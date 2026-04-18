import React, { useState } from 'react';
import { Calendar, MapPin, Users, ArrowRight, ChevronDown, CheckCircle, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-100 dark:border-slate-800 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between gap-4 text-left group"
      >
        <span className="text-sm sm:text-base font-black uppercase italic tracking-tight text-slate-800 dark:text-white group-hover:text-ynov transition-colors">
          {question}
        </span>
        <div className={`p-1 rounded-full bg-slate-50 dark:bg-slate-800 transition-all duration-300 ${isOpen ? 'rotate-180 bg-ynov/10' : ''}`}>
          <ChevronDown className={`w-4 h-4 ${isOpen ? 'text-ynov' : 'text-slate-400'}`} />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const WelcomePage = () => {
  const faqs = [
    {
      question: "Je me suis trompé dans mes informations, puis-je les modifier ?",
      answer: "Oui ! C'est tout à fait possible. Vous pouvez modifier vos informations vous-même à tout moment en cliquant sur 'Gérer mon inscription' en bas de cette page. Vous recevrez automatiquement un nouveau badge avec les informations corrigées."
    },
    {
      question: "Je n'ai pas reçu mon badge par e-mail, que faire ?",
      answer: "Vérifiez d'abord vos courriers indésirables (spams). Si vous ne le trouvez toujours pas, utilisez la section 'Gérer mon inscription' sur ce site pour renvoyer votre badge instantanément vers votre boîte mail."
    },
    {
      question: "L'événement est-il ouvert à tout le monde ?",
      answer: "Il s'agit d'un événement privé. L'inscription nécessite un lien d'invitation officiel communiqué par Maroc Ynov Campus à ses étudiants et partenaires."
    },
    {
      question: "Comment accéder au campus ?",
      answer: "Le campus est situé à Casablanca, quartier Bournazel. Vous trouverez un lien Google Maps interactif directement sur votre badge numérique pour faciliter votre navigation."
    },
    {
      question: "Puis-je venir avec un accompagnateur ?",
      answer: "Les inscriptions sont strictement individuelles. Chaque participant doit posséder son propre badge QR Code pour accéder à l'événement."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-16 py-12 animate-in fade-in duration-1000">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
          Ynov Talk <span className="text-ynov">2026</span>
        </h1>
        <p className="text-xl text-slate-500 font-medium uppercase tracking-widest">AGIR POUR REUSSIR • CASABLANCA</p>
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
            CAMPUS BOURNAZEL, CASABLANCA
          </a>
        </div>
        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl hover:border-ynov/50 transition-all group shadow-sm dark:shadow-none hover:shadow-xl hover:shadow-ynov/5">
          <Users className="w-8 h-8 text-ynov mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="font-black uppercase text-xs tracking-widest mb-2 text-slate-900 dark:text-white">Public Cible</h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold">INVITÉS & ÉTUDIANTS YNOV</p>
        </div>
      </div>

      {/* Action Box */}
      <div className="bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/50 p-8 sm:p-12 rounded-[3.5rem] space-y-8 shadow-inner dark:shadow-none text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-ynov/5 blur-3xl rounded-full"></div>
        
        <div className="space-y-4">
          <h2 className="text-3xl sm:text-4xl font-black uppercase italic text-slate-900 dark:text-white tracking-tighter">Inscriptions Ouvertes</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto text-sm sm:text-base leading-relaxed font-medium">
            Réservez votre place dès maintenant pour participer aux conférences et ateliers exclusifs de l'édition 2026.
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

      {/* FAQ Section */}
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="h-0.5 flex-1 bg-slate-100 dark:bg-slate-800"></div>
          <div className="flex items-center gap-2 px-6 py-2 bg-slate-50 dark:bg-slate-900 rounded-full border border-slate-100 dark:border-slate-800">
            <HelpCircle className="w-4 h-4 text-ynov" />
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-slate-900 dark:text-white">Questions Fréquentes</span>
          </div>
          <div className="h-0.5 flex-1 bg-slate-100 dark:bg-slate-800"></div>
        </div>

        <div className="bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-6 sm:p-10 shadow-sm">
          <div className="divide-y divide-slate-50 dark:divide-slate-800">
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
