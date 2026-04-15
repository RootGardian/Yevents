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
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class EventReminder extends Mailable
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
            subject: 'Rappel : On se voit demain à Ynov Events !',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.reminder',
        );
    }

    private function getBadgeColor($category): string
    {
        return match ($category) {
            'STAFF YNOV' => '#48bb78',
            'INVITÉ' => '#4299e1',
            'PRESTATAIRE' => '#ed8936',
            'EXPERT & PANÉLISTE' => '#ecc94b',
            default => '#ffffff'
        };
    }

    public function attachments(): array
    {
        $qrCode = QrCode::size(200)->generate($this->participant->qr_code_token);
        $badgeColor = $this->getBadgeColor($this->participant->categorie_badge);

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.badge', [
            'participant' => $this->participant,
            'qrCode' => base64_encode($qrCode),
            'badgeColor' => $badgeColor
        ]);

        return [
            \Illuminate\Mail\Mailables\Attachment::fromData(
                fn () => $pdf->output(),
                'Badge_Ynov_Events' . rand(100, 999) . '.pdf'
            )->withMime('application/pdf'),
        ];
    }
}
