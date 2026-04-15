<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class SendEventReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reminders:send';
    protected $description = 'Envoie les mails de rappel à tous les participants';

    public function handle()
    {
        $participants = \App\Models\Participant::all();
        $this->info("Envoi de " . $participants->count() . " rappels en cours...");

        foreach ($participants as $participant) {
            \Illuminate\Support\Facades\Mail::to($participant->email)->send(new \App\Mail\EventReminder($participant));
            $this->info("Rappel envoyé à : " . $participant->email);
        }

        $this->info("Tous les rappels ont été envoyés avec succès.");
    }
}
