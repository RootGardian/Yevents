import React, { useState } from 'react';
import { Search, User, Mail, Phone, Building, Briefcase, CheckCircle, AlertCircle, Loader2, Save, ArrowLeft, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';

const RegistrationCorrection = ({ onBack }) => {
  const [step, setStep] = useState('lookup'); // 'lookup', 'verify', 'edit'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [correctionToken, setCorrectionToken] = useState(null);

  const [lookupData, setLookupData] = useState({
    email: '',
    telephone: ''
  });

  const [formData, setFormData] = useState({
    id: null,
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    indicatif: '+212',
    entreprise: '',
    categorie_badge: 'PARTICIPANT'
  });
  const [otpCode, setOtpCode] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  const countryCodes = [
    { code: '+212', country: 'Maroc' },
    { code: '+241', country: 'Gabon' },
    { code: '+33', country: 'France' },
    { code: '+221', country: 'Sénégal' },
    { code: '+225', country: 'Côte d’Ivoire' },
    { code: '+213', country: 'Algérie' },
    { code: '+216', country: 'Tunisie' },
    { code: '+222', country: 'Mauritanie' },
    { code: '+223', country: 'Mali' },
    { code: '+224', country: 'Guinée' },
    { code: '+226', country: 'Burkina Faso' },
    { code: '+227', country: 'Niger' },
    { code: '+228', country: 'Togo' },
    { code: '+229', country: 'Bénin' },
    { code: '+237', country: 'Cameroun' },
    { code: '+32', country: 'Belgique' },
    { code: '+41', country: 'Suisse' },
    { code: '+1', country: 'USA/Canada' },
  ];

  const handleLookup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/register/lookup', lookupData);
      const participant = res.data;

      // Attempt to split phone and country code
      let foundIndicatif = '+212';
      let purePhone = participant.telephone;

      for (const c of countryCodes) {
        if (participant.telephone.startsWith(c.code)) {
          foundIndicatif = c.code;
          purePhone = participant.telephone.slice(c.code.length);
          break;
        }
      }

      setFormData({
        id: participant.id,
        nom: participant.nom,
        prenom: participant.prenom,
        email: participant.email,
        telephone: purePhone,
        indicatif: foundIndicatif,
        entreprise: participant.entreprise || '',
        categorie_badge: participant.categorieBadge || 'PARTICIPANT'
      });
      
      // Automatic OTP request after lookup
      setStep('verify');
      handleRequestOTP(participant.email);
    } catch (err) {
      setError(err.response?.data?.message || "Aucune inscription trouvée. Vérifiez vos informations.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOTP = async (targetEmail) => {
    const emailToUse = targetEmail || formData.email;
    setOtpLoading(true);
    setError(null);
    try {
      await api.post('/otp/request', { email: emailToUse });
      alert("Un code de vérification a été envoyé à votre e-mail actuel.");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'envoi du code.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setOtpLoading(true);
    setError(null);
    try {
      const res = await api.post('/otp/verify', { email: formData.email, code: otpCode });
      setCorrectionToken(res.data.token);
      setStep('edit');
    } catch (err) {
      setError(err.response?.data?.message || "Code invalide ou expiré.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const submissionData = {
        ...formData,
        telephone: `${formData.indicatif}${formData.telephone}`
      };
      
      await api.post('/register/update', submissionData, {
        headers: { 'x-correction-token': correctionToken }
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Code invalide ou erreur de mise à jour.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuit = () => {
    setCorrectionToken(null);
    setOtpCode('');
    setStep('lookup');
    setError(null);
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 sm:p-12 rounded-[2.5rem] text-center shadow-2xl space-y-6"
      >
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="text-green-500 w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black uppercase italic">Informations Corrigées !</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Vos informations ont été mises à jour. <br />
          Un nouveau badge a été envoyé à l'adresse : <br />
          <span className="text-ynov font-bold break-all underline">{formData.email}</span>
        </p>
        <button
          onClick={onBack}
          className="bg-ynov hover:bg-ynov/90 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-xl shadow-ynov/20"
        >
          Retour à l'accueil
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 flex items-center justify-between gap-4">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 transition-all shadow-sm group"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-ynov transition-colors" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">Accueil</span>
        </button>
        <div className="flex-1 text-right sm:text-left">
          <h2 className="text-xl md:text-2xl font-black uppercase italic tracking-tight">Correction</h2>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest hidden sm:block">Modifiez vos informations erronées</p>
        </div>
        {(step === 'verify' || step === 'edit') && (
          <button 
            onClick={handleQuit}
            className="text-[10px] font-black text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition-all uppercase tracking-widest"
          >
            Quitter
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {step === 'lookup' ? (
          <motion.div
            key="lookup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-xl space-y-6"
          >
            <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-6">
              <h3 className="text-xl font-black italic">Retrouvez votre inscription</h3>
              <p className="text-slate-400 text-xs">Saisissez l'e-mail ou le numéro de téléphone utilisé lors de l'inscription.</p>
            </div>

            <form onSubmit={handleLookup} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Adresse e-mail</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-ynov text-base"
                      placeholder="monaddresse@yevents.ma"
                      value={lookupData.email}
                      onChange={(e) => setLookupData({ ...lookupData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="text-center text-[10px] font-black text-slate-300 uppercase italic">OU</div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Numéro de téléphone</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-ynov text-base"
                      placeholder="+212612345678"
                      value={lookupData.telephone}
                      onChange={(e) => setLookupData({ ...lookupData, telephone: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded-xl flex items-center gap-3 text-xs font-bold">
                  <AlertCircle className="w-4 h-4" /> {error}
                </div>
              )}

              <button
                disabled={loading || (!lookupData.email && !lookupData.telephone)}
                type="submit"
                className="w-full bg-slate-900 dark:bg-ynov hover:opacity-90 text-white font-black py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-30"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <><Search className="w-5 h-5" /> TROUVER MON INSCRIPTION</>}
              </button>
            </form>
          </motion.div>
        ) : step === 'verify' ? (
          <motion.div
            key="verify"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-xl space-y-8"
          >
            <div className="text-center space-y-4">
               <div className="w-16 h-16 bg-ynov/10 rounded-full flex items-center justify-center mx-auto text-ynov">
                  <Mail className="w-8 h-8" />
               </div>
               <h3 className="text-2xl font-black italic uppercase">Vérifiez votre boîte mail</h3>
               <p className="text-slate-500 text-sm max-w-sm mx-auto">
                 Nous avons envoyé un code de vérification à l'adresse associée à votre badge : <br/>
                 <strong className="text-slate-900 dark:text-white underline">{formData.email}</strong>
               </p>
            </div>

            <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div className="flex justify-center">
                    <input
                      required
                      autoFocus
                      type="text"
                      maxLength={6}
                      className="w-full max-w-[280px] bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-5 px-4 text-center text-3xl font-black tracking-[0.25em] focus:ring-2 focus:ring-ynov transition-all"
                      placeholder="••••••"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    />
                </div>

                {error && (
                  <div className="bg-red-50 text-red-500 p-4 rounded-xl text-center text-[10px] font-black uppercase tracking-widest">
                    {error}
                  </div>
                )}

                <button
                  disabled={otpLoading || otpCode.length < 6}
                  type="submit"
                  className="w-full bg-ynov text-white font-black py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {otpLoading ? <Loader2 className="animate-spin w-5 h-5" /> : "VÉRIFIER ET MODIFIER"}
                </button>

                <button type="button" onClick={() => handleRequestOTP()} className="w-full text-slate-400 hover:text-ynov text-[10px] font-black uppercase tracking-widest transition-colors">
                  Renvoyer le code
                </button>
            </form>
          </motion.div>
        ) : step === 'edit' ? (
          <motion.div
            key="edit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-xl space-y-6"
          >
            <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-6">
              <h3 className="text-xl font-black italic">Modifier vos coordonnées</h3>
              <p className="text-slate-400 text-xs">Corrigez les erreurs détectées. Un nouveau badge vous sera envoyé.</p>
            </div>

            <form onSubmit={handleUpdate} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Prénom</label>
                  <input required type="text" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-ynov text-base" value={formData.prenom} onChange={(e) => setFormData({ ...formData, prenom: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom</label>
                  <input required type="text" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-ynov text-base" value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-red-400 font-bold">Nouvelle adresse e-mail *</label>
                <input required type="email" className="w-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl py-4 px-5 focus:ring-2 focus:ring-ynov transition-all text-base font-bold" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nouveau numéro de téléphone *</label>
                <div className="flex gap-2">
                  <div className="relative">
                    <select
                      className="bg-slate-100 dark:bg-slate-800 flex items-center px-3 pr-8 rounded-xl text-xs font-bold text-slate-500 h-full border-none focus:ring-2 focus:ring-ynov appearance-none cursor-pointer"
                      value={formData.indicatif}
                      onChange={(e) => setFormData({ ...formData, indicatif: e.target.value })}
                    >
                      {countryCodes.map((c) => (
                        <option key={c.code} value={c.code}>{c.code}</option>
                      ))}
                    </select>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ChevronDown className="w-3 h-3" />
                    </div>
                  </div>
                  <input required type="tel" className="flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-4 px-5 focus:ring-2 focus:ring-ynov transition-all text-base" value={formData.telephone} onChange={(e) => setFormData({ ...formData, telephone: e.target.value })} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Entreprise / Université</label>
                <input required type="text" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-ynov text-base" value={formData.entreprise} onChange={(e) => setFormData({ ...formData, entreprise: e.target.value })} />
              </div>

              <div className="bg-green-500/5 dark:bg-green-500/10 p-4 rounded-xl border border-green-500/20 text-center">
                <p className="text-[10px] text-green-600 dark:text-green-400 font-black uppercase tracking-widest">Identité vérifiée ✓ Session active</p>
              </div>

              {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded-xl flex items-center gap-3 text-xs font-bold">
                  <AlertCircle className="w-4 h-4" /> {error}
                </div>
              )}

              <button
                disabled={loading}
                type="submit"
                className="w-full bg-ynov hover:opacity-90 text-white font-black py-5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <><Save className="w-5 h-5" /> ENREGISTRER LES MODIFICATIONS</>}
              </button>

              <button type="button" onClick={() => setStep('lookup')} className="w-full text-slate-400 hover:text-slate-600 text-[10px] font-bold uppercase tracking-widest py-2 transition-colors">
                Annuler la modification
              </button>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default RegistrationCorrection;
