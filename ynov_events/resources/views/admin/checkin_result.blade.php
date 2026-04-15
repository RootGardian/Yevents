<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Check-in Résultat - Ynov Events</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="bg-[#0f172a] text-white min-h-screen flex items-center justify-center p-6">
    <div class="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-[2rem] shadow-2xl text-center space-y-6">
        
        @if($status === 'success')
            <div class="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h1 class="text-3xl font-black text-green-500 uppercase tracking-tighter italic">CHECK-IN RÉUSSI</h1>
        @elseif($status === 'warning')
            <div class="w-24 h-24 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            <h1 class="text-3xl font-black text-orange-500 uppercase tracking-tighter italic">DÉJÀ VALIDÉ</h1>
        @else
            <div class="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>
            <h1 class="text-3xl font-black text-red-500 uppercase tracking-tighter italic">ERREUR</h1>
        @endif

        <div class="space-y-2">
            <p class="text-slate-400 text-sm uppercase font-bold tracking-widest">{{ $message }}</p>
            @if(isset($participant))
                <div class="text-xl font-bold">{{ $participant->prenom }} {{ $participant->nom }}</div>
                <div class="inline-block px-4 py-1 bg-[#8c2d2d] rounded-full text-xs font-black uppercase">
                    {{ $participant->categorie_badge }}
                </div>
            @endif
        </div>

        <div class="pt-4">
            <button onclick="window.close();" class="text-slate-500 text-xs underline uppercase tracking-widest font-bold">
                Fermer la fenêtre
            </button>
        </div>
    </div>
</body>
</html>
