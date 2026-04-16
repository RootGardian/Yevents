import React from 'react';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const WelcomePage = () => {
  return (
    <div className="max-w-4xl mx-auto text-center space-y-12 py-12 animate-in fade-in duration-1000">
      <div className="space-y-4">
        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
          Ynov Talk Events <span className="text-ynov">2026</span>
        </h1>
        <p className="text-xl text-slate-500 font-medium uppercase tracking-widest">AGIR POUR REUSSIR</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl hover:border-ynov/50 transition-colors group shadow-sm dark:shadow-none">
          <Calendar className="w-8 h-8 text-ynov mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="font-black uppercase text-sm mb-2 text-slate-900 dark:text-white">Date</h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold">2 Mai 2026</p>
        </div>
        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl hover:border-ynov/50 transition-colors group shadow-sm dark:shadow-none">
          <MapPin className="w-8 h-8 text-ynov mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="font-black uppercase text-sm mb-2 text-slate-900 dark:text-white">Lieu</h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold">Campus Ynov Casablanca</p>
        </div>
        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl hover:border-ynov/50 transition-colors group shadow-sm dark:shadow-none">
          <Users className="w-8 h-8 text-ynov mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="font-black uppercase text-sm mb-2 text-slate-900 dark:text-white">Public</h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold">Étudiants & Professionnels</p>
        </div>
      </div>

      <div className="pt-8 bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/50 p-10 rounded-[3rem] space-y-6 shadow-inner dark:shadow-none">
        <h2 className="text-2xl font-black uppercase italic text-slate-900 dark:text-white">Inscriptions Ouvertes</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto text-sm leading-relaxed font-medium">
          Cet événement est privé. Pour vous inscrire, veuillez utiliser le lien d'invitation qui vous a été communiqué par e-mail ou par SMS.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/inscription" className="flex items-center justify-center gap-2 px-8 py-3 bg-ynov hover:bg-ynov/90 rounded-xl font-bold transition-all uppercase text-xs tracking-widest text-white shadow-lg shadow-ynov/20">
            S'inscrire à l'événement <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/admin" className="flex items-center justify-center gap-2 px-8 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold transition-all uppercase text-xs tracking-widest text-white">
            Accès Staff
          </Link>
        </div>
        <div className="pt-2">
          <Link to="/mes-inscriptions" className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-slate-500 hover:text-ynov transition-colors underline underline-offset-8 decoration-slate-300 dark:decoration-slate-800 hover:decoration-ynov">
            Gérer mon inscription ou récupérer mon badge
          </Link>
        </div>

      </div>
    </div>
  );
};

export default WelcomePage;
