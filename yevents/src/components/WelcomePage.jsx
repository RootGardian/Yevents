import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, ArrowRight, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Countdown = () => {
  const calculateTimeLeft = () => {
    const eventDate = new Date('2026-05-02T09:00:00');
    const difference = +eventDate - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        jours: Math.floor(difference / (1000 * 60 * 60 * 24)),
        heures: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        secondes: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timerComponents = Object.keys(timeLeft).map((interval) => {
    return (
      <div key={interval} className="flex flex-col items-center px-4">
        <span className="text-2xl sm:text-4xl font-black italic text-slate-800 dark:text-white leading-none">
          {timeLeft[interval] < 10 ? `0${timeLeft[interval]}` : timeLeft[interval]}
        </span>
        <span className="text-[9px] font-black uppercase tracking-widest text-ynov mt-1">
          {interval}
        </span>
      </div>
    );
  });

  return (
    <div className="flex items-center justify-center divide-x divide-slate-100 dark:divide-slate-800 py-4">
      {timerComponents.length ? timerComponents : <span className="text-ynov font-black uppercase tracking-widest">L'événement commence !</span>}
    </div>
  );
};

const WelcomePage = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-12 animate-in fade-in duration-1000">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
            Ynov Talk <span className="text-ynov">2026</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium uppercase tracking-widest">AGIR POUR REUSSIR</p>
        </div>
        
        <div className="inline-block bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl px-8 py-2 shadow-sm">
          <Countdown />
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl hover:border-ynov/50 transition-all group shadow-sm dark:shadow-none hover:shadow-xl hover:shadow-ynov/5">
          <Calendar className="w-8 h-8 text-ynov mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="font-black uppercase text-xs tracking-widest mb-2 text-slate-900 dark:text-white">Date de l'événement</h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold font-mono">SAMEDI 2 MAI 2026</p>
        </div>
        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl hover:border-ynov/50 transition-all group shadow-sm dark:shadow-none hover:shadow-xl hover:shadow-ynov/5">
          <MapPin className="w-8 h-8 text-ynov mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="font-black uppercase text-xs tracking-widest mb-2 text-slate-900 dark:text-white">Lieu & Accès</h3>
          <a
            href="https://maps.app.goo.gl/B6KTip19rMJmUVMp7?g_st=ic"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 dark:text-slate-400 text-[11px] font-bold hover:text-ynov transition-colors underline underline-offset-4 decoration-slate-200 dark:decoration-slate-800"
          >
            Casablanca Ynov campus
          </a>
        </div>
        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl hover:border-ynov/50 transition-all group shadow-sm dark:shadow-none hover:shadow-xl hover:shadow-ynov/5">
          <Users className="w-8 h-8 text-ynov mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="font-black uppercase text-xs tracking-widest mb-2 text-slate-900 dark:text-white">Public Cible</h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold">PROFESSIONELS & ÉTUDIANTS YNOV</p>
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
