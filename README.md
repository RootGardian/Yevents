# Yevents 🚀

Bienvenue sur le dépôt officiel de **Yevents**, une plateforme moderne de gestion d'événements.

Ce projet est organisé en **monorepo** pour faciliter la gestion du backend et du frontend.

## 🏗️ Structure du Projet

Le dépôt est divisé en deux parties principales :

- **[`ynov_events/`](./ynov_events)** : Le backend de l'application développé avec **Laravel**. Il gère l'API, la base de données PostgreSQL, l'authentification et la logique métier.
- **[`yevents/`](./yevents)** : Le frontend de l'application développé avec **React** et **Vite**. Il offre une interface utilisateur premium, réactive et optimisée pour mobile.

## 🛠️ Technologies Utilisées

### Backend
- **Framework** : Laravel 11+
- **Base de données** : PostgreSQL
- **Authentification** : Laravel Sanctum
- **Déploiement** : Docker / Render

### Frontend
- **Framework** : React 19+
- **Build Tool** : Vite
- **Styling** : Modern CSS / Framer Motion
- **Gestion d'état** : Hooks React / Axios

## 🚀 Installation et Lancement

### Backend
```bash
cd ynov_events
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

### Frontend
```bash
cd yevents
npm install
npm run dev
```

---

*Développé avec passion pour Ynov Events.*
