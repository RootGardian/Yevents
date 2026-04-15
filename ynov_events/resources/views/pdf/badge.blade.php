<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        @page { margin: 0; }
        body {
            font-family: 'Helvetica', Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
        }
        .badge-card {
            width: 10cm;
            height: 14cm;
            border: 1px solid #eeeeee;
            margin: 0 auto;
            position: relative;
            overflow: hidden;
            text-align: center;
        }
        .header {
            background-color: #8c2d2d;
            color: #ffffff;
            padding: 20px 10px;
            font-size: 1.5em;
            font-weight: bold;
            text-transform: uppercase;
        }
        .logo-area {
            margin-top: 10px;
            font-size: 0.9em;
            letter-spacing: 2px;
        }
        .content {
            padding: 15px 10px;
        }
        .name {
            font-size: 1.8em;
            font-weight: bold;
            color: #1a1a1a;
            margin-bottom: 5px;
            text-transform: uppercase;
        }
        .company {
            font-size: 1.1em;
            color: #4a5568;
            margin-bottom: 20px;
        }
        .badge-type {
            display: inline-block;
            padding: 8px 25px;
            border-radius: 50px;
            color: #ffffff;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 0.9em;
            margin-bottom: 15px;
        }
        .qr-code {
            margin: 5px auto;
        }
        .footer {
            position: absolute;
            bottom: 0;
            width: 100%;
            background-color: #f7fafc;
            padding: 15px 0;
            font-size: 0.8em;
            color: #718096;
            border-top: 1px solid #edf2f7;
        }
        .urn {
            font-family: monospace;
            font-weight: bold;
            color: #2d3748;
        }
        .guests {
            font-size: 0.9em;
            color: #8c2d2d;
            margin-top: 5px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="badge-card">
        <div class="header">
            YNOV EVENTS
            <div class="logo-area">ACCÈS CONFIRMÉ</div>
        </div>
        
        <div class="content">
            <div class="name">{{ $participant->prenom }} {{ $participant->nom }}</div>
            <div class="company">{{ $participant->entreprise ?? 'PARTICIPANT' }}</div>
            
            <div class="badge-type" style="background-color: {{ $badgeColor }};">
                {{ $participant->categorie_badge }}
            </div>
            
            <div class="qr-code" style="padding: 10px; background: white; width: 160px; margin: 0 auto;">
                <img src="{{ $qrCode }}" style="width: 160px; height: 160px; display: block; margin: 0 auto;">
            </div>

            @if($participant->nb_accompagnateurs > 0)
                <div class="guests">+ {{ $participant->nb_accompagnateurs }} INVITÉ(S)</div>
            @endif
        </div>
        
        <div class="footer">
            ID: <span class="urn">{{ substr($participant->qr_code_token, 0, 13) }}</span><br>
            Présentez ce badge à l'entrée.
        </div>
    </div>
</body>
</html>
