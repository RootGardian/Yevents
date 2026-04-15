import React from 'react';
import { QrCode, Building, Briefcase, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const BadgePreview = ({ formData }) => {
  const fullName = `${formData.prenom} ${formData.nom}`.trim() || "NOM COMPLET";
  const jobTitle = formData.intitule_poste || "INTITULÉ DU POSTE";
  const company = formData.entreprise || "NOM DE L'ENTREPRISE";
  const category = formData.categorie_badge || "VISITOR PASS";

  return (
    <div className="sticky top-32 space-y-6">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-50">Aperçu du Badge</h3>
        <div className="h-px flex-1 bg-current opacity-10 ml-4"></div>
      </div>

      <motion.div 
        layout
        className="relative w-full max-w-[320px] mx-auto overflow-hidden bg-white rounded-3xl sm:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-slate-900 border border-slate-100 flex flex-col"
      >
        {/* Top Header - Event Info */}
        <div className="bg-ynov p-6 sm:p-8 text-white relative overflow-hidden h-28 sm:h-32 flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <div className="relative z-10">
                <div className="text-[9px] sm:text-[10px] font-black tracking-widest uppercase opacity-80 mb-1">YNOV CAMPUS</div>
                <div className="text-lg sm:text-xl font-black italic tracking-tighter leading-none">EVENTS<span className="text-white/50">2026</span></div>
            </div>
        </div>

        {/* Badge Body */}
        <div className="p-6 sm:p-8 flex flex-col items-center text-center space-y-4 sm:space-y-6">
            {/* QR Code Placeholder with "Preview" Stamp */}
            <div className="relative p-3 bg-slate-50 rounded-3xl border border-slate-100">
                <QrCode className="w-32 h-32 text-slate-200" strokeWidth={1} />
                <div className="absolute inset-0 flex items-center justify-center rotate-[-30deg] pointer-events-none">
                    <span className="bg-ynov/90 text-white text-[8px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg">
                        Badge non valide
                    </span>
                </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-4 w-full">
                <div className="space-y-1">
                    <h2 className="text-2xl font-black tracking-tight text-slate-900 truncate uppercase">{fullName}</h2>
                    <div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-wide">
                        <Briefcase className="w-3 h-3" />
                        <span>{jobTitle}</span>
                    </div>
                </div>

                <div className="h-px bg-slate-100 mx-8"></div>

                <div className="space-y-1 text-slate-600">
                    <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-widest">
                        <Building className="w-3 h-3" />
                        <span>{company}</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Category Footer */}
        <div className="mt-auto bg-slate-50 border-t border-slate-100 p-6 flex items-center justify-center">
            <div className={`px-5 py-2 rounded-xl text-xs font-black tracking-[0.15em] uppercase shadow-sm ${
                category === 'PARTICIPANT' ? 'bg-ynov text-white bubble-glow' : 'bg-white text-slate-600 border border-slate-200'
            }`}>
                {category}
            </div>
        </div>
      </motion.div>

      <div className="text-center p-4">
        <p className="text-[10px] text-slate-400 font-medium leading-relaxed max-w-[280px] mx-auto italic">
            Ceci est un aperçu en temps réel. Votre badge officiel sera envoyé par email après validation.
        </p>
      </div>
    </div>
  );
};

export default BadgePreview;
