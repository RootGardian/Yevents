import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api';

const WelcomePage = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        setSettings(res.data);
      } catch (err) {
        console.error("Error fetching settings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-ynov animate-spin opacity-20" />
      </div>
    );
  }

  const {
    event_name = 'Ynov Talk 2026',
    event_date_text = 'SAMEDI 2 MAI 2026',
    event_hours = '09:00 - 18:00',
    event_location = 'Casablanca Ynov campus',
    event_location_link = '#',
    event_public_target = 'PROFESSIONELS & ÉTUDIANTS YNOV'
  } = settings || {};

  // Extract year from event_name or default
  const match = event_name.match(/\d{4}/);
  const eventYear = match ? match[0] : '2026';
  const eventTitleBase = event_name.replace(eventYear, '').trim();

  return (
    <div className="max-w-4xl mx-auto space-y-16 py-12 animate-in fade-in duration-1000">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
          {eventTitleBase} <span className="text-ynov">{eventYear}</span>
        </h1>
        <p className="text-xl text-slate-500 font-medium uppercase tracking-widest leading-tight">{event_name}</p>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl hover:border-ynov/50 transition-all group shadow-sm dark:shadow-none hover:shadow-xl hover:shadow-ynov/5">
          <Calendar className="w-8 h-8 text-ynov mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="font-black uppercase text-xs tracking-widest mb-2 text-slate-900 dark:text-white">Date & Horaires</h3>
          <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold font-mono">
            {event_date_text.toUpperCase()}<br/>
            {event_hours}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl hover:border-ynov/50 transition-all group shadow-sm dark:shadow-none hover:shadow-xl hover:shadow-ynov/5">
          <MapPin className="w-8 h-8 text-ynov mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="font-black uppercase text-xs tracking-widest mb-2 text-slate-900 dark:text-white">Lieu & Accès</h3>
          <a
            href={event_location_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 dark:text-slate-400 text-[11px] font-bold hover:text-ynov transition-colors underline underline-offset-4 decoration-slate-200 dark:decoration-slate-800"
          >
            {event_location}
          </a>
        </div>
        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl hover:border-ynov/50 transition-all group shadow-sm dark:shadow-none hover:shadow-xl hover:shadow-ynov/5">
          <Users className="w-8 h-8 text-ynov mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="font-black uppercase text-xs tracking-widest mb-2 text-slate-900 dark:text-white">Public Cible</h3>
          <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase">{event_public_target}</p>
        </div>
      </div>

      {/* Action Box */}
      <div className="bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/50 p-8 sm:p-12 rounded-[3.5rem] space-y-8 shadow-inner dark:shadow-none text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-ynov/5 blur-3xl rounded-full"></div>

        <div className="space-y-4">
          <h2 className="text-3xl sm:text-4xl font-black uppercase italic text-slate-900 dark:text-white tracking-tighter">Inscriptions Ouvertes</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto text-sm sm:text-base leading-relaxed font-medium">
            Cet événement est privé. Pour vous inscrire, veuillez utiliser le lien d'invitation qui vous a été communiqué par E-mail.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-4">
          <Link to="/inscription" className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-ynov hover:bg-ynov/90 rounded-2xl font-black transition-all uppercase text-sm tracking-widest text-white shadow-2xl shadow-ynov/30 group">
            S'inscrire maintenant <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/admin" className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-5 bg-slate-900 hover:bg-black rounded-2xl font-black transition-all uppercase text-sm tracking-widest text-white ring-1 ring-white/10 shadow-xl">
            Accès Staff
          </Link>
        </div>

        <div className="pt-6 border-t border-slate-200/50 dark:border-slate-800/50 w-full max-w-md mx-auto">
          <Link to="/mes-inscriptions" className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-500 hover:text-ynov transition-colors group">
            <CheckCircle className="w-4 h-4 text-ynov" />
            <span className="underline underline-offset-8 decoration-slate-200 dark:decoration-slate-800/50 group-hover:decoration-ynov">Gérer mon inscription ou récupérer mon badge</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default WelcomePage;
