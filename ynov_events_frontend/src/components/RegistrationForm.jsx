import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Building, Briefcase, Users, CheckCircle, AlertCircle, Loader2, Linkedin, Twitter, Facebook, Globe, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';
import BadgePreview from './BadgePreview';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    entreprise: '',
    intitule_poste: '',
    categorie_badge: 'PARTICIPANT',
    nb_accompagnateurs: 0,
    accepted_terms: false,
    accepted_data_processing: false
  });

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats', {
        headers: { 'X-Admin-Token': 'ynov_secret_2026' }
      });
      setStats(res.data);
    } catch (err) {
      console.error("Erreur stats:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/register', formData);
      setSuccess(true);
      fetchStats();
    } catch (err) {
      setError(err.response?.data?.message || "Une erreur est survenue lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-12 rounded-3xl sm:rounded-[3rem] text-center shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-ynov"></div>
        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="text-green-500 w-12 h-12" />
        </div>
        <h2 className="text-2xl sm:text-4xl font-black mb-4 uppercase italic">Inscription Réussie !</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto text-sm sm:text-lg">
          Bienvenue à bord, <strong>{formData.prenom}</strong>. <br />
          Votre badge numérique a été envoyé avec succès à <span className="text-ynov font-bold underline break-all">{formData.email}</span>.
        </p>
        <button
          onClick={() => { setSuccess(false); setFormData({ nom: '', prenom: '', email: '', telephone: '', entreprise: '', intitule_poste: '', categorie_badge: 'PARTICIPANT', nb_accompagnateurs: 0, accepted_terms: false, accepted_data_processing: false }); }}
          className="bg-ynov hover:bg-ynov/90 text-white px-8 py-3 sm:px-10 sm:py-4 rounded-xl sm:rounded-2xl font-black transition-all shadow-xl shadow-ynov/20 active:scale-95 text-xs sm:text-base"
        >
          Nouvelle inscription
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-12">


      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Form */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-10 rounded-3xl sm:rounded-[2.5rem] shadow-xl space-y-6 sm:space-y-8">
            <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-6">
              <h3 className="text-xl sm:text-2xl font-black leading-tight">Veuillez remplir le formulaire d'inscription ci-dessous.</h3>
              <p className="text-red-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest">Les informations doivent être saisies avec soin.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Prénom *</label>
                  <input required type="text" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 sm:py-4 sm:px-5 focus:ring-2 focus:ring-ynov transition-all text-sm" value={formData.prenom} onChange={(e) => setFormData({ ...formData, prenom: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Nom *</label>
                  <input required type="text" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 sm:py-4 sm:px-5 focus:ring-2 focus:ring-ynov transition-all text-sm" value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Adresse e-mail *</label>
                <input required type="email" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 sm:py-4 sm:px-5 focus:ring-2 focus:ring-ynov transition-all text-sm" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Numéro de téléphone *</label>
                  <div className="flex gap-2">
                    <span className="bg-slate-100 dark:bg-slate-800 flex items-center px-4 rounded-xl text-xs font-bold text-slate-500">+212</span>
                    <input required type="tel" className="flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-4 px-5 focus:ring-2 focus:ring-ynov transition-all" value={formData.telephone} onChange={(e) => setFormData({ ...formData, telephone: e.target.value })} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Nom de l'entreprise / Université *</label>
                  <input required type="text" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 sm:py-4 sm:px-5 focus:ring-2 focus:ring-ynov transition-all text-sm" value={formData.entreprise} onChange={(e) => setFormData({ ...formData, entreprise: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Catégorie de badge *</label>
                  <div className="relative">
                    <select className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 sm:py-4 sm:px-5 focus:ring-2 focus:ring-ynov transition-all appearance-none cursor-pointer text-sm pr-10" value={formData.categorie_badge} onChange={(e) => setFormData({ ...formData, categorie_badge: e.target.value })}>
                      <option value="PARTICIPANT">Participant</option>
                      <option value="PRESTATAIRE">Prestataire</option>
                      <option value="EXPERT & PANÉLISTE">Expert & Panéliste</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4 py-2 border-t border-slate-100 dark:border-slate-800">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center mt-1">
                    <input
                      required
                      type="checkbox"
                      className="peer h-5 w-5 border-2 border-slate-200 dark:border-slate-700 rounded-md checked:bg-ynov checked:border-ynov transition-all cursor-pointer appearance-none"
                      checked={formData.accepted_terms}
                      onChange={(e) => setFormData({ ...formData, accepted_terms: e.target.checked })}
                    />
                    <CheckCircle className="absolute h-3 w-3 text-white left-1 opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                  </div>
                  <span className="text-[10px] sm:text-xs text-slate-500 font-medium leading-tight select-none">
                    J'accepte les <a href="#" className="underline text-ynov font-bold">conditions générales d'utilisation</a> et la <a href="#" className="underline text-ynov font-bold">politique de confidentialité</a>. *
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center mt-1">
                    <input
                      required
                      type="checkbox"
                      className="peer h-5 w-5 border-2 border-slate-200 dark:border-slate-700 rounded-md checked:bg-ynov checked:border-ynov transition-all cursor-pointer appearance-none"
                      checked={formData.accepted_data_processing}
                      onChange={(e) => setFormData({ ...formData, accepted_data_processing: e.target.checked })}
                    />
                    <CheckCircle className="absolute h-3 w-3 text-white left-1 opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                  </div>
                  <span className="text-[10px] sm:text-xs text-slate-500 font-medium leading-tight select-none">
                    Je consens au traitement de mes coordonnées pour la gestion opérationnelle de cet événement. *
                  </span>
                </label>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-red-50 text-red-500 p-4 rounded-xl flex items-center gap-3 text-sm font-bold">
                    <AlertCircle className="w-5 h-5" /> {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <button disabled={loading} type="submit" className="w-full bg-ynov hover:bg-ynov/90 text-white font-black py-4 rounded-xl sm:rounded-2xl shadow-xl shadow-ynov/20 transition-all flex items-center justify-center gap-3 group disabled:opacity-50 mt-4 h-14 sm:h-16 text-sm sm:text-base">
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "RÉSERVER MA PLACE"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Badge Preview */}
        <div className="lg:col-span-5">
          <BadgePreview formData={formData} />
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
