<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #1a1a1a; color: #ffffff; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background-color: #2d2d2d; padding: 30px; border-radius: 10px; border-top: 5px solid #8c2d2d; }
        h1 { color: #ffffff; font-size: 1.5em; text-align: center; }
        p { line-height: 1.6; color: #cccccc; }
        .footer { text-align: center; font-size: 0.8em; color: #718096; margin-top: 30px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>On se voit demain !</h1>
        <p>Bonjour {{ $participant->prenom }},</p>
        <p>C'est déjà demain ! Vous êtes inscrit pour l'événement <strong>Ynov Events</strong> qui se déroulera le 2 mai.</p>
        <p>Nous avons hâte de vous accueillir. Pour faciliter votre entrée, n'oubliez pas de présenter votre badge à l'accueil.</p>
        <p><strong>Vous trouverez votre badge PDF complété en pièce jointe de cet email.</strong></p>
        <p>À demain !<br>L'équipe Ynov Events</p>
        
        <div class="footer">
            Cet email a été envoyé automatiquement par le système Ynov Events.
        </div>
    </div>
</body>
</html>
