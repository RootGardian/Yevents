<!DOCTYPE html>
<html lang="fr" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">
    <title>Confirmation d'inscription - Ynov Events</title>
    <style>
        :root {
            color-scheme: light dark;
            supported-color-schemes: light dark;
        }

        body {
            margin: 0;
            padding: 0;
            width: 100% !important;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            background-color: #f4f7f9;
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }

        /* Top Logo Area */
        .header-logo {
            padding: 25px 0;
            text-align: center;
            background-color: #1a1a1b;
        }

        /* Banner Style */
        .header-banner {
            background-color: #8c2d2d;
            color: #ffffff;
            padding: 20px 25px;
            text-align: center;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            font-size: 17px;
        }

        .main-content {
            padding: 45px 35px;
            background-color: #1a1a1b;
            color: #ffffff;
        }

        .greeting {
            font-size: 20px;
            margin-bottom: 25px;
            font-weight: 600;
        }

        .confirmation-text {
            font-size: 15px;
            line-height: 1.7;
            color: #cbd5e0;
            margin-bottom: 40px;
        }

        .summary-title {
            text-align: center;
            font-weight: 800;
            text-transform: uppercase;
            font-size: 15px;
            margin-bottom: 30px;
            letter-spacing: 1.5px;
            color: #ffffff;
        }

        /* Summary Grid */
        .summary-card {
            background-color: #2d2d2e;
            padding: 30px 25px;
            border-radius: 6px;
            margin-bottom: 40px;
        }

        .summary-table {
            width: 100%;
            border-collapse: collapse;
        }

        .summary-table td {
            padding: 12px 0;
            vertical-align: top;
            font-size: 14px;
        }

        .label {
            color: #a0aec0;
            width: 45%;
        }

        .value {
            color: #ffffff;
            font-weight: bold;
            text-transform: uppercase;
        }

        .urn-display {
            text-align: center;
            padding: 20px 0;
        }

        .urn-large {
            font-size: 26px;
            font-weight: 900;
            color: #ffffff;
            margin-bottom: 15px;
            letter-spacing: 2px;
        }

        .qr-placeholder {
            background-color: #ffffff;
            padding: 12px;
            display: inline-block;
            border-radius: 2px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        }

        /* Event Info Section */
        .info-title-banner {
            background-color: #8c2d2d;
            color: #ffffff;
            padding: 15px 25px;
            text-align: center;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            font-size: 15px;
        }

        .info-content {
            background-color: #1a1a1b;
            padding: 40px 35px;
            color: #ffffff;
        }

        .info-grid {
            width: 100%;
        }

        .info-grid td {
            width: 50%;
            vertical-align: top;
            padding-bottom: 30px;
            padding-right: 15px;
        }

        .info-header {
            font-weight: 900;
            font-size: 15px;
            margin-bottom: 12px;
            display: block;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .info-text {
            font-size: 14px;
            color: #cbd5e0;
            line-height: 1.6;
        }

        .footer {
            background-color: #111111;
            color: #718096;
            padding: 30px;
            text-align: center;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            line-height: 1.8;
        }

        @media (prefers-color-scheme: dark) {
            body {
                background-color: #000000 !important;
            }

            .container {
                background-color: #1a1a1b !important;
            }
        }

        @media only screen and (max-width: 480px) {
            .info-grid td {
                display: block !important;
                width: 100% !important;
                padding-right: 0 !important;
            }

            .summary-card td {
                display: block !important;
                width: 100% !important;
            }

            .summary-card td:first-child {
                text-align: center !important;
                margin-bottom: 30px;
            }

            .summary-card td:last-child {
                padding-left: 0 !important;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <!-- Logo Area -->
        <div class="header-logo">
            <span
                style="color: #ffffff; font-size: 24px; font-weight: 900; border: 2px solid #8c2d2d; padding: 5px 15px; letter-spacing: 2px;">YNOV
                EVENTS</span>
        </div>

        <!-- Banner Title -->
        <div class="header-banner">
            VOTRE INSCRIPTION À YNOV TALKS EVENT 2026 EST CONFIRMÉE
        </div>

        <!-- Main Body -->
        <div class="main-content">
            <div class="greeting">
                Bonjour {{ $participant->prenom }} {{ $participant->nom }},
            </div>

            <div class="confirmation-text">
                Nous avons le plaisir de vous confirmer votre participation à <strong>YNOV TALKS EVENT
                    2026</strong>.<br>
                Votre inscription est désormais enregistrée et validée.
            </div>

            <div class="summary-title">
                RÉSUMÉ DE VOTRE INSCRIPTION {{ $participant->categorie_badge }} :
            </div>

            <div class="summary-card">
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td width="35%" style="vertical-align: middle; text-align: center;">
                            <div class="urn-large">{{ substr($participant->qr_code_token, 0, 8) }}</div>
                            <div class="qr-placeholder">
                                <img src="{{ $qrCode }}" width="150" height="150" style="display: block; border: none;"
                                    alt="QR Code">
                            </div>
                        </td>
                        <td width="65%" style="padding-left: 35px; vertical-align: middle;">
                            <table class="summary-table">
                                <tr>
                                    <td class="label">Numéro d'Inscription Unique (URN) :</td>
                                    <td class="value">{{ substr($participant->qr_code_token, 0, 8) }}</td>
                                </tr>
                                <tr>
                                    <td class="label">Catégorie du Badge :</td>
                                    <td class="value">{{ $participant->categorie_badge }}</td>
                                </tr>
                                <tr>
                                    <td class="label">Nom Complet :</td>
                                    <td class="value">{{ $participant->prenom }} {{ $participant->nom }}</td>
                                </tr>
                                <tr>
                                    <td class="label">Entreprise :</td>
                                    <td class="value">{{ $participant->entreprise ?? 'N/A' }}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </div>
        </div>

        <!-- Event Information Banner -->
        <div class="info-title-banner">
            INFORMATIONS SUR L'ÉVÉNEMENT
        </div>

        <!-- Detailed Event Info -->
        <div class="info-content">
            <table class="info-grid" cellpadding="0" cellspacing="0">
                <tr>
                    <td>
                        <span class="info-header">Horaires de l'événement :</span>
                        <div class="info-text">
                            Samedi 2 Mai 2026 : 14h00 – 18h00
                        </div>
                    </td>
                    <td>
                        <span class="info-header">Localisation :</span>
                        <div class="info-text">
                            Maroc Ynov Campus,<br>
                            8 Ibnou Katima (Ex Bournazel),<br>
                            Casablanca 20000, Maroc
                        </div>
                    </td>
                </tr>
            </table>
        </div>

        <!-- Footer -->
        <div class="footer">
            © 2026 YNOV CAMPUS MAROC - TOUS DROITS RÉSERVÉS.<br>
            CETTE CONFIRMATION DOIT ÊTRE PRÉSENTÉE À L'ACCUEIL POUR ACCÉDER À L'ÉVÉNEMENT.
        </div>
    </div>
</body>

</html>