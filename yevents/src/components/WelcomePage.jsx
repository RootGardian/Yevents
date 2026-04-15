import React from 'react';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const WelcomePage = () => {
  return (
    <div className="max-w-4xl mx-auto text-center space-y-12 py-12 animate-in fade-in duration-1000">
      <div className="space-y-4">
        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
          Ynov Days <span className="text-ynov">2026</span>
        </h1>
        <p className="text-xl text-slate-500 font-medium uppercase tracking-widest">L'innovation au cœur de Casablanca</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl hover:border-ynov/50 transition-colors group">
          <Calendar className="w-8 h-8 text-ynov mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="font-black uppercase text-sm mb-2">Date</h3>
          <p className="text-slate-400 text-xs">Mai 2026</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl hover:border-ynov/50 transition-colors group">
          <MapPin className="w-8 h-8 text-ynov mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="font-black uppercase text-sm mb-2">Lieu</h3>
          <p className="text-slate-400 text-xs">Campus Ynov Casablanca</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl hover:border-ynov/50 transition-colors group">
          <Users className="w-8 h-8 text-ynov mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="font-black uppercase text-sm mb-2">Public</h3>
          <p className="text-slate-400 text-xs">Étudiants & Professionnels</p>
        </div>
      </div>

      <div className="pt-8 bg-slate-900/30 border border-slate-800/50 p-10 rounded-[3rem] space-y-6">
        <h2 className="text-2xl font-black uppercase italic">Inscriptions Ouvertes</h2>
        <p className="text-slate-400 max-w-lg mx-auto text-sm leading-relaxed">
          Cet événement est privé. Pour vous inscrire, veuillez utiliser le lien d'invitation qui vous a été communiqué par e-mail ou par SMS.
        </p>
        <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/inscription" className="flex items-center justify-center gap-2 px-8 py-3 bg-ynov hover:bg-ynov/90 rounded-xl font-bold transition-all uppercase text-xs tracking-widest text-white shadow-lg shadow-ynov/20">
            S'inscrire à l'événement <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/admin" className="flex items-center justify-center gap-2 px-8 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold transition-all uppercase text-xs tracking-widest">
            Accès Staff
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
