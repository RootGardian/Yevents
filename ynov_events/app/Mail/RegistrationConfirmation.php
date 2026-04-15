<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

use App\Models\Participant;
use chillerlan\QRCode\QRCode;
use chillerlan\QRCode\QROptions;
use chillerlan\QRCode\Output\QROutputInterface;

class RegistrationConfirmation extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $participant;

    public function __construct(Participant $participant)
    {
        $this->participant = $participant;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Confirmation d\'inscription - Ynov Events',
        );
    }

    public function content(): Content
    {
        $options = new QROptions([
            'outputType'  => QROutputInterface::GDIMAGE_PNG,
            'eccLevel'    => QRCode::ECC_L,
            'imageBase64' => true,
        ]);

        $qrCode = (new QRCode($options))->render($this->participant->qr_code_token);

        return new Content(
            view: 'emails.registration',
            with: [
                'qrCode' => $qrCode, // Déjà encodé en base64 Data URI par chillerlan
                'badgeColor' => $this->getBadgeColor($this->participant->categorie_badge)
            ]
        );
    }

    private function getBadgeColor($category): string
    {
        return match ($category) {
            'PARTICIPANT' => '#4299e1', // Bleu
            'PRESTATAIRE' => '#ed8936',  // Orange
            'EXPERT & PANÉLISTE' => '#ecc94b', // Or
            default => '#8c2d2d' // Rouge Ynov par défaut
        };
    }

    public function attachments(): array
    {
        $options = new QROptions([
            'outputType'  => QROutputInterface::GDIMAGE_PNG,
            'eccLevel'    => QRCode::ECC_L,
            'imageBase64' => true,
        ]);

        $qrCode = (new QRCode($options))->render($this->participant->qr_code_token);
        $badgeColor = $this->getBadgeColor($this->participant->categorie_badge);

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.badge', [
            'participant' => $this->participant,
            'qrCode' => $qrCode,
            'badgeColor' => $badgeColor
        ]);

        return [
            \Illuminate\Mail\Mailables\Attachment::fromData(
                fn () => $pdf->output(),
                'Badge_Ynov_Events.pdf'
            )->withMime('application/pdf'),
        ];
    }
}
