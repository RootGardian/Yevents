<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

use Illuminate\Support\Facades\Schedule;
use Carbon\Carbon;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Automatisation du rappel J-1 (1er Mai)
Schedule::command('reminders:send')
    ->dailyAt('09:00')
    ->when(function () {
        $eventDate = env('EVENT_DATE', '2026-05-02');
        return Carbon::now()->isSameDay(Carbon::parse($eventDate)->subDay());
    });
