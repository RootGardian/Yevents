import React from 'react';
import { QrCode, Building, Briefcase, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const BadgePreview = ({ formData }) => {
  const fullName = `${formData.prenom} ${formData.nom}`.trim() || "NOM COMPLET";
  const company = formData.entreprise || "NOM DE L'ENTREPRISE";
  const category = formData.categorie_badge || "VISITOR PASS";
  const qrCodeToken = formData.qrCodeToken;
  const isRealBadge = !!qrCodeToken;
  const urn = isRealBadge ? qrCodeToken.substring(0, 8).toUpperCase() : 'PREVIEW';

  return (
    <div className="lg:sticky lg:top-32 space-y-6">
      <div className="flex items-center justify-between px-2 no-print">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-white/40">Badge Virtuel</h3>
        <div className="h-px flex-1 bg-slate-200 dark:bg-white/10 ml-4"></div>
      </div>

      <motion.div 
        layout
        className="relative w-full max-w-[420px] mx-auto overflow-hidden bg-white dark:bg-[#1a1a1a] rounded-[2rem] sm:rounded-[3rem] shadow-2xl dark:shadow-[0_40px_80px_rgba(0,0,0,0.6)] text-slate-900 dark:text-white border border-slate-100 dark:border-white/5 flex flex-col badge-container font-sans"
      >
        {/* Top Header - Branding */}
        <div className="bg-[#8c2d2d] p-5 sm:p-8 text-center ring-1 ring-inset ring-white/10">
            <h2 className="text-xs sm:text-base font-black tracking-[0.2em] sm:tracking-[0.25em] uppercase leading-none text-white">Ynov Talk Events 2026</h2>
        </div>

        {/* Badge Content Card */}
        <div className="p-3 sm:p-6">
            <div className="bg-slate-50 dark:bg-[#262626] rounded-[1.2rem] sm:rounded-[2rem] p-4 sm:p-8 border border-slate-200 dark:border-white/5 space-y-4 sm:space-y-8">
                <h3 className="text-center text-[7px] sm:text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-[0.2em] sm:tracking-[0.25em] border-b border-slate-100 dark:border-white/10 pb-3 sm:pb-5">
                  Visitor Registration Summary
                </h3>

                <div className="flex gap-4 sm:gap-8 items-center">
                    {/* Left: QR & URN */}
                    <div className="w-1/2 flex flex-col items-center gap-3 sm:gap-4">
                        <div className="bg-white p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-xl">
                            {isRealBadge ? (
                              <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrCodeToken}`} 
                                alt="QR Code" 
                                className="w-20 h-20 sm:w-32 sm:h-32"
                              />
                            ) : (
                              <div className="w-20 h-20 sm:w-32 sm:h-32 flex items-center justify-center bg-slate-50 text-slate-200">
                                <QrCode className="w-12 h-12 sm:w-20 sm:h-20" strokeWidth={1} />
                              </div>
                            )}
                        </div>
                        <div className="text-center">
                            <p className="text-[6px] sm:text-[7px] font-black text-slate-400 dark:text-white/30 uppercase tracking-widest">URN</p>
                            <p className="text-xs sm:text-base font-black text-slate-800 dark:text-white tracking-[0.1em] sm:tracking-[0.2em] mt-0.5">{urn}</p>
                        </div>
                    </div>

                    {/* Right: Personal Info */}
                    <div className="w-1/2 space-y-3 sm:space-y-6 pt-1">
                        <div className="space-y-1">
                            <p className="text-[7px] sm:text-[8px] font-black text-slate-400 dark:text-white/30 uppercase tracking-widest sm:tracking-[0.2em]">Name</p>
                            <p className="text-xs sm:text-lg font-black text-slate-900 dark:text-white leading-tight uppercase tracking-tight">{fullName}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[7px] sm:text-[8px] font-black text-slate-400 dark:text-white/30 uppercase tracking-widest sm:tracking-[0.2em]">Category</p>
                            <p className="text-[10px] sm:text-xs font-black text-ynov uppercase tracking-widest sm:tracking-[0.25em]">{category}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[7px] sm:text-[8px] font-black text-slate-400 dark:text-white/30 uppercase tracking-widest sm:tracking-[0.2em]">Company</p>
                            <p className="text-[10px] sm:text-xs font-black text-slate-600 dark:text-white/80 uppercase truncate tracking-tight">{company}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Event Information Section */}
        <div className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="bg-[#8c2d2d] py-2 sm:py-4 text-center rounded-t-xl sm:rounded-t-2xl">
                <p className="text-[8px] sm:text-[10px] font-black tracking-[0.2em] sm:tracking-[0.25em] text-white">EVENT INFORMATION</p>
            </div>
            <div className="bg-slate-50 dark:bg-[#262626] p-4 sm:p-6 rounded-b-xl sm:rounded-b-2xl border-x border-b border-slate-200 dark:border-white/5 grid grid-cols-2 gap-4 sm:gap-8">
                <div className="space-y-1 sm:space-y-2">
                    <p className="text-[6px] sm:text-[8px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest">Show Timings</p>
                    <p className="text-[9px] sm:text-xs font-bold text-slate-700 dark:text-white/90 leading-relaxed">Samedi, 2 Mai<br/>14:00 – 18:00</p>
                </div>
                <div className="space-y-1 sm:space-y-2">
                    <p className="text-[6px] sm:text-[8px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest">Location</p>
                    <p className="text-[9px] sm:text-xs font-bold text-slate-700 dark:text-white/90 leading-relaxed">Maroc Ynov Campus,<br/>Casablanca 20000</p>
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-8 pt-1 sm:pt-2 text-center">
            <p className="text-[6px] sm:text-[8px] font-medium text-slate-400 dark:text-white/20 uppercase tracking-[0.3em] sm:tracking-[0.4em]">&copy; 2026 YNOV MOROCCO</p>
        </div>
      </motion.div>


      <div className="text-center p-4 no-print">
        <p className="text-[10px] text-slate-400 dark:text-white/30 font-medium leading-relaxed max-w-[280px] mx-auto italic">
            {isRealBadge ? "Badge généré avec succès" : "Aperçu en temps réel (données non sécurisées)"}
        </p>
      </div>
    </div>
  );
};

export default BadgePreview;
