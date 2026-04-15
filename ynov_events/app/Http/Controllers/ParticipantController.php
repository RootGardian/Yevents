<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Participant;
use App\Mail\RegistrationConfirmation;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use App\Helpers\AuditHelper;

class ParticipantController extends Controller {
    
    // Inscription d'un participant
    public function store(Request $request) {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|email|unique:participants,email',
            'telephone' => 'required|string|max:20',
            'entreprise' => 'nullable|string|max:255',
            'categorie_badge' => 'required|string|in:PARTICIPANT,PRESTATAIRE,EXPERT & PANÉLISTE',
            'nb_accompagnateurs' => 'nullable|integer|min:0|max:5',
            'accepted_terms' => 'required|accepted',
            'accepted_data_processing' => 'required|accepted',
        ]);

        // Vérification de la jauge
        $maxCapacity = (int) (\App\Models\Setting::where('key', 'max_capacity')->first()->value ?? env('MAX_PARTICIPANTS', 100));
        $currentCount = Participant::sum('nb_accompagnateurs') + Participant::count();
        $requestedCount = 1 + ($validated['nb_accompagnateurs'] ?? 0);

        if (($currentCount + $requestedCount) > $maxCapacity) {
            return response()->json([
                'message' => 'Désolé, l\'événement est complet. Capacité maximale atteinte.',
                'jauge' => $maxCapacity,
                'places_restantes' => max(0, $maxCapacity - $currentCount)
            ], 422);
        }

        // Inscription transactionnelle
        DB::beginTransaction();
        try {
            $participant = Participant::create(array_merge($validated, [
                'consent_timestamp' => now()
            ]));
            
            // Tentative d'envoi synchrone pour garantir la réception lors de l'inscription
            Mail::to($participant->email)->send(new RegistrationConfirmation($participant));
            
            // Si on arrive ici, le mail est parti
            $participant->update([
                'email_sent' => true,
                'registration_status' => 'confirmed'
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Inscription réussie ! Un email de confirmation vous a été envoyé.',
                'participant' => $participant
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            // On enregistre quand même la tentative échouée pour le monitoring si on veut (mais pas via create car rollback)
            // Alternative: Créer le participant d'abord, puis tenter le mail, et ne modifier le statut que si ok.
            // Mais l'utilisateur a dit "on ne confirme pas".
            
            \Illuminate\Support\Facades\Log::error("Erreur inscription/mail: " . $e->getMessage());
            
            // On crée un enregistrement "fantôme" ou on logue simplement ? 
            // L'utilisateur veut "voir les alertes si une personne n'a pas reçu de mail".
            // Donc on va EFFECTIVEMENT créer le participant mais avec un statut 'email_failed'.
            
            $failedParticipant = Participant::create(array_merge($validated, [
                'registration_status' => 'email_failed',
                'email_sent' => false,
                'email_error' => $e->getMessage()
            ]));

            return response()->json([
                'message' => 'L\'inscription a été enregistrée mais l\'envoi de l\'email a échoué. Veuillez contacter le support desk.',
                'error_detail' => $e->getMessage(),
                'participant_id' => $failedParticipant->id
            ], 500);
        }
    }

    // Validation (Check-in) via Token
    public function checkIn(Request $request, $token) {
        $query = Participant::query();

        // Si le token est un UUID valide, recherche exacte
        if (\Illuminate\Support\Str::isUuid($token)) {
            $query->where('qr_code_token', $token);
        } else {
            // Recherche partielle : cast en text pour Postgres (car qr_code_token est de type uuid)
            $query->whereRaw('qr_code_token::text LIKE ?', ["$token%"]);
        }

        $participants = $query->get();

        // Si on demande la version Web (via navigateur)
        $isWebRequest = $request->acceptsHtml() && !$request->expectsJson();

        if ($participants->isEmpty()) {
            if ($isWebRequest) {
                return view('admin.checkin_result', ['status' => 'error', 'message' => 'Participant non trouvé']);
            }
            return response()->json(['message' => 'Participant non trouvé'], 404);
        }

        if ($participants->count() > 1) {
            if ($isWebRequest) {
                return view('admin.checkin_result', ['status' => 'error', 'message' => 'Plusieurs participants correspondent. Précisez le code.']);
            }
            return response()->json(['message' => 'Plusieurs participants correspondent à ce code partiel. Veuillez saisir plus de caractères.'], 422);
        }

        $participant = $participants->first();

        if ($participant->is_checked_in) {
            if ($isWebRequest) {
                return view('admin.checkin_result', ['status' => 'success', 'message' => 'Déjà présent', 'participant' => $participant]);
            }
            return response()->json(['message' => 'Déjà présent', 'participant' => $participant], 200);
        }

        $participant->update(['is_checked_in' => true]);

        AuditHelper::log('CHECKIN', "Validation de présence pour: {$participant->prenom} {$participant->nom} (ID: {$participant->id})", $participant);

        if ($isWebRequest) {
            return view('admin.checkin_result', ['status' => 'success', 'message' => 'Check-in réussi !', 'participant' => $participant]);
        }

        return response()->json([
            'message' => 'Check-in réussi !',
            'participant' => $participant
        ], 200);
    }

    // Liste des participants (Admin)
    public function index() {
        return response()->json(Participant::orderBy('created_at', 'desc')->get());
    }

    // Export CSV des participants
    public function export() {
        $participants = Participant::all();
        $filename = "participants_" . date('Y-m-d_H-i-s') . ".csv";
        
        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $columns = ['Nom', 'Prénom', 'Email', 'Téléphone', 'Entreprise', 'Catégorie', 'Présence', 'Date Inscription'];

        AuditHelper::log('EXPORT', "Export CSV des participants effectué.");

        return response()->stream(function() use($participants, $columns) {
            $file = fopen('php://output', 'w');
            
            // Ajout du BOM UTF-8 pour Excel
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));

            fputcsv($file, $columns, ';');

            foreach ($participants as $participant) {
                fputcsv($file, [
                    $participant->nom,
                    $participant->prenom,
                    $participant->email,
                    $participant->telephone,
                    $participant->entreprise,
                    $participant->categorie_badge,
                    $participant->is_checked_in ? 'PRÉSENT' : 'ABSENT',
                    $participant->created_at->format('d/m/Y H:i'),
                ], ';');
            }

            fclose($file);
        }, 200, $headers);
    }

    // Renvoyer l'email de confirmation
    public function resend(Request $request) {
        $request->validate(['email' => 'required|email']);
        
        $participant = Participant::where('email', $request->email)->first();

        if (!$participant) {
            return response()->json(['message' => 'Aucun participant trouvé avec cet email'], 404);
        }

        try {
            Mail::to($participant->email)->send(new RegistrationConfirmation($participant));
            $participant->update([
                'email_sent' => true,
                'registration_status' => 'confirmed',
                'email_error' => null
            ]);
            AuditHelper::log('RESEND_EMAIL', "Renvoi manuel de l'email de confirmation à: {$participant->email}", $participant);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Erreur mail resend: " . $e->getMessage());
            $participant->update([
                'email_sent' => false,
                'registration_status' => 'email_failed',
                'email_error' => $e->getMessage()
            ]);
            return response()->json(['message' => 'L\'envoi du mail a encore échoué : ' . $e->getMessage()], 500);
        }

        return response()->json(['message' => 'Email de confirmation renvoyé !'], 200);
    }

    // Statistiques globales (Admin)
    public function stats() {
        $maxCapacity = (int) (\App\Models\Setting::where('key', 'max_capacity')->first()->value ?? env('MAX_PARTICIPANTS', 100));
        $totalParticipants = Participant::count();
        $totalGuests = Participant::sum('nb_accompagnateurs');
        $totalExpected = $totalParticipants + $totalGuests;
        
        $present = Participant::where('is_checked_in', true)->count();
        $presentGuests = Participant::where('is_checked_in', true)->sum('nb_accompagnateurs'); 
        $totalPresent = $present + $presentGuests;

        $statsByCategory = Participant::select('categorie_badge', DB::raw('count(*) as total'))
            ->groupBy('categorie_badge')
            ->get();

        $emailFailures = Participant::where('registration_status', 'email_failed')->count();

        return response()->json([
            'jauge_max' => $maxCapacity,
            'total_inscrits' => $totalParticipants,
            'total_accompagnateurs' => $totalGuests,
            'total_attendu' => $totalExpected,
            'total_present' => $totalPresent,
            'taux_remplissage' => round(($totalExpected / $maxCapacity) * 100, 2),
            'taux_presence' => $totalExpected > 0 ? round(($totalPresent / $totalExpected) * 100, 2) : 0,
            'stats_par_categorie' => $statsByCategory,
            'email_failures' => $emailFailures
        ]);
    }
}
