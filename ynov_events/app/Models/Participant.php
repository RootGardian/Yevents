<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Participant extends Model
{
    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'telephone',
        'entreprise',
        'categorie_badge',
        'qr_code_token',
        'is_checked_in',
        'nb_accompagnateurs',
        'registration_status',
        'email_sent',
        'email_error',
        'accepted_terms',
        'accepted_data_processing',
        'consent_timestamp'
    ];

    protected $casts = [
        'is_checked_in' => 'boolean',
        'accepted_terms' => 'boolean',
        'accepted_data_processing' => 'boolean',
        'consent_timestamp' => 'datetime'
    ];

    // Génération automatique du UUID lors de la création
    protected static function booted()
    {
        static::creating(function ($participant) {
            if (!$participant->qr_code_token) {
                $participant->qr_code_token = (string) \Illuminate\Support\Str::uuid();
            }
        });
    }
}
