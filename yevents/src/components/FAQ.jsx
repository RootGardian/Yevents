import React, { useState } from 'react';
import { HelpCircle, ChevronLeft, ChevronDown, CheckCircle, Mail, MapPin, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden transition-all duration-300 hover:border-ynov/30 shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-center justify-between gap-4 text-left group"
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
            <div className="px-6 pb-6 pt-2">
                <div className="h-px w-full bg-slate-50 dark:bg-slate-800 mb-4" />
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                {answer}
                </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = () => {
  const faqs = [
    {
      question: "Je me suis trompé dans mes informations, puis-je les modifier ?",
      answer: "Oui ! C'est tout à fait possible. Vous pouvez rectifier vos informations vous-même à tout moment en utilisant la section 'Mes Inscriptions' ou en cliquant sur 'Gérer mon inscription' sur la page d'accueil. Un nouveau badge avec les informations corrigées vous sera automatiquement renvoyé par e-mail."
    },
    {
      question: "Je n'ai pas reçu mon badge par e-mail, que faire ?",
      answer: "Vérifiez d'abord vos courriers indésirables (spams). Si vous ne le trouvez toujours pas, rendez-vous dans la section 'Mes Inscriptions' de ce site pour renvoyer votre badge instantanément vers votre boîte mail."
    },
    {
      question: "L'événement est-il ouvert à tout le monde ?",
      answer: "Il s'agit d'un événement privé. L'inscription nécessite un lien d'invitation officiel communiqué par Maroc Ynov Campus à ses étudiants, partenaires et alumni."
    },
    {
      question: "Comment accéder au campus ?",
      answer: "Le campus est situé à Casablanca, quartier Bournazel. Un lien Google Maps interactif est présent sur votre badge numérique et sur la page d'accueil pour faciliter votre itinéraire."
    },
    {
      question: "Le badge est-il obligatoire pour entrer ?",
      answer: "Oui, le badge QR Code (numérique ou imprimé) est indispensable. Il sera scanné par notre staff à l'entrée pour valider votre présence."
    },
    {
      question: "Puis-je venir avec un accompagnateur ?",
      answer: "Non, les inscriptions sont strictement individuelles par des raisons de sécurité et de capacité d'accueil. Chaque personne doit posséder son propre badge."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Navigation */}
      <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-ynov transition-colors font-bold uppercase text-[10px] tracking-widest group">
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Retour à l'accueil
      </Link>

      {/* Header */}
      <div className="bg-[#0f172a] rounded-[2.5rem] p-8 sm:p-12 text-white relative overflow-hidden border border-white/5 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-ynov/20 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse"></div>
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="w-20 h-20 bg-white/5 rounded-[2rem] backdrop-blur-md flex items-center justify-center border border-white/10 shrink-0">
            <HelpCircle className="w-10 h-10 text-ynov" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-black italic uppercase tracking-tighter leading-none">Questions <span className="text-ynov">Fréquentes</span></h1>
            <p className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em]">Tout savoir sur Ynov Events 2026</p>
          </div>
        </div>
      </div>

      {/* FAQ Grid */}
      <div className="grid grid-cols-1 gap-4">
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>

      {/* Contact Section */}
      <div className="bg-ynov rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full -mb-16 -mr-16 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
        <div className="space-y-2 relative z-10 text-center md:text-left">
          <h2 className="text-2xl font-black uppercase italic tracking-tight">Besoin d'aide supplémentaire ?</h2>
          <p className="text-white/80 text-sm font-medium">Notre équipe support vous répond sous 24h.</p>
        </div>
        <a 
          href="mailto:ahmedrachid.bangoura@ynov.com" 
          className="relative z-10 flex items-center gap-3 px-8 py-4 bg-white text-ynov rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-50 transition-all shadow-xl active:scale-95"
        >
          <Mail className="w-4 h-4" /> Nous contacter
        </a>
      </div>
    </div>
  );
};

export default FAQ;
