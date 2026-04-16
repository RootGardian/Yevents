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
        <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-40">Badge Virtuel</h3>
        <div className="h-px flex-1 bg-current opacity-5 ml-4"></div>
      </div>

      <motion.div 
        layout
        className="relative w-full max-w-[340px] mx-auto overflow-hidden bg-[#1a1a1a] rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)] text-white border border-white/5 flex flex-col badge-container font-sans"
      >
        {/* Top Header - Branding */}
        <div className="bg-[#8c2d2d] p-6 text-center">
            <h2 className="text-sm font-black tracking-[0.2em] uppercase leading-none">Ynov Talk Events 2026</h2>
        </div>

        {/* Badge Content Card */}
        <div className="p-4">
            <div className="bg-[#262626] rounded-[1.5rem] p-6 border border-white/5 space-y-6">
                <h3 className="text-center text-[9px] font-black text-white/40 uppercase tracking-[0.2em] border-b border-white/10 pb-4">
                  Visitor Registration Summary
                </h3>

                <div className="flex gap-6">
                    {/* Left: QR & URN */}
                    <div className="w-1/2 flex flex-col items-center gap-3">
                        <div className="bg-white p-2 rounded-xl shadow-inner">
                            {isRealBadge ? (
                              <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrCodeToken}`} 
                                alt="QR Code" 
                                className="w-24 h-24"
                              />
                            ) : (
                              <div className="w-24 h-24 flex items-center justify-center bg-slate-100 text-slate-300">
                                <QrCode className="w-16 h-16" strokeWidth={1} />
                              </div>
                            )}
                        </div>
                        <div className="text-center">
                            <p className="text-[6px] font-black text-white/30 uppercase tracking-widest">URN</p>
                            <p className="text-sm font-black text-white tracking-widest mt-0.5">{urn}</p>
                        </div>
                    </div>

                    {/* Right: Personal Info */}
                    <div className="w-1/2 space-y-4 pt-1">
                        <div className="space-y-1">
                            <p className="text-[7px] font-black text-white/30 uppercase tracking-[0.2em]">Name</p>
                            <p className="text-sm font-black text-white leading-tight uppercase">{fullName}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[7px] font-black text-white/30 uppercase tracking-[0.2em]">Category</p>
                            <p className="text-[10px] font-black text-ynov uppercase tracking-widest">{category}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[7px] font-black text-white/30 uppercase tracking-[0.2em]">Company</p>
                            <p className="text-[10px] font-black text-white/80 uppercase truncate">{company}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Event Information Section */}
        <div className="px-4 pb-4">
            <div className="bg-[#8c2d2d] py-3 text-center rounded-t-xl">
                <p className="text-[9px] font-black tracking-[0.2em]">EVENT INFORMATION</p>
            </div>
            <div className="bg-[#262626] p-4 rounded-b-xl border-x border-b border-white/5 grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <p className="text-[7px] font-black text-white/40 uppercase tracking-widest">Show Timings</p>
                    <p className="text-[9px] font-bold text-white/90 leading-tight">Samedi, 2 Mai<br/>14:00 – 18:00</p>
                </div>
                <div className="space-y-1">
                    <p className="text-[7px] font-black text-white/40 uppercase tracking-widest">Location</p>
                    <p className="text-[9px] font-bold text-white/90 leading-tight">Maroc Ynov Campus,<br/>Casablanca 20000</p>
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-2 text-center">
            <p className="text-[7px] font-medium text-white/20 uppercase tracking-[0.3em]">&copy; 2026 YNOV MOROCCO</p>
        </div>
      </motion.div>

      <div className="text-center p-4 no-print">
        <p className="text-[10px] text-white/30 font-medium leading-relaxed max-w-[280px] mx-auto italic">
            {isRealBadge ? "Badge généré avec succès" : "Aperçu en temps réel (données non sécurisées)"}
        </p>
      </div>
    </div>
  );
};



export default BadgePreview;
