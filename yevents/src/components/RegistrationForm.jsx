import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Building, Briefcase, Users, CheckCircle, AlertCircle, Loader2, Linkedin, Twitter, Facebook, Globe, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../api';
import BadgePreview from './BadgePreview';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    entreprise: '',
    categorie_badge: 'PARTICIPANT',
    nb_accompagnateurs: 0,
    accepted_terms: false,
    accepted_data_processing: false,
    indicatif: '+212'
  });

  const countryCodes = [
    // --- Priorités (Event local & Fréquents) ---
    { code: '+212', country: 'Maroc' },
    { code: '+241', country: 'Gabon' },
    { code: '+33', country: 'France' },
    { code: '+221', country: 'Sénégal' },
    { code: '+225', country: 'Côte d’Ivoire' },
    
    // --- Afrique (Nord & Sahel) ---
    { code: '+213', country: 'Algérie' },
    { code: '+216', country: 'Tunisie' },
    { code: '+218', country: 'Libye' },
    { code: '+222', country: 'Mauritanie' },
    { code: '+223', country: 'Mali' },
    { code: '+224', country: 'Guinée' },
    { code: '+226', country: 'Burkina Faso' },
    { code: '+227', country: 'Niger' },
    { code: '+228', country: 'Togo' },
    { code: '+229', country: 'Bénin' },
    
    // --- Afrique (Centrale & Est) ---
    { code: '+235', country: 'Tchad' },
    { code: '+236', country: 'RCA' },
    { code: '+237', country: 'Cameroun' },
    { code: '+240', country: 'Guinée Éq.' },
    { code: '+242', country: 'Congo' },
    { code: '+243', country: 'RDC' },
    { code: '+244', country: 'Angola' },
    { code: '+250', country: 'Rwanda' },
    { code: '+251', country: 'Éthiopie' },
    { code: '+253', country: 'Djibouti' },
    { code: '+254', country: 'Kenya' },
    { code: '+257', country: 'Burundi' },
    { code: '+258', country: 'Mozambique' },
    
    // --- Afrique (Ouest & Sud) ---
    { code: '+231', country: 'Liberia' },
    { code: '+232', country: 'Sierra Leone' },
    { code: '+233', country: 'Ghana' },
    { code: '+234', country: 'Nigeria' },
    { code: '+261', country: 'Madagascar' },
    { code: '+262', country: 'Réunion/Mayotte' },
    { code: '+269', country: 'Comores' },
    { code: '+230', country: 'Maurice' },
    { code: '+27', country: 'Afrique du Sud' },
    { code: '+220', country: 'Gambie' },
    { code: '+238', country: 'Cap-Vert' },
    { code: '+245', country: 'Guinée-Biss.' },
    
    // --- Europe (Ouest & Sud) ---
    { code: '+32', country: 'Belgique' },
    { code: '+41', country: 'Suisse' },
    { code: '+352', country: 'Luxembourg' },
    { code: '+377', country: 'Monaco' },
    { code: '+39', country: 'Italie' },
    { code: '+34', country: 'Espagne' },
    { code: '+351', country: 'Portugal' },
    { code: '+30', country: 'Grèce' },
    { code: '+44', country: 'Royaume-Uni' },
    { code: '+353', country: 'Irlande' },
    { code: '+31', country: 'Pays-Bas' },
    
    // --- Europe (Centrale & Nord) ---
    { code: '+49', country: 'Allemagne' },
    { code: '+43', country: 'Autriche' },
    { code: '+46', country: 'Suède' },
    { code: '+47', country: 'Norvège' },
    { code: '+45', country: 'Danemark' },
    { code: '+358', country: 'Finlande' },
    { code: '+48', country: 'Pologne' },
    { code: '+420', country: 'Rép. Tchèque' },
    { code: '+36', country: 'Hongrie' },
    { code: '+40', country: 'Roumanie' },
    
    // --- Autres ---
    { code: '+1', country: 'USA/Canada' },
    { code: '+971', country: 'UAE' },
    { code: '+90', country: 'Turquie' },
  ];

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
      const submissionData = {
        ...formData,
        telephone: `${formData.indicatif}${formData.telephone}`
      };
      await api.post('/register', submissionData);
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
          onClick={() => { setSuccess(false); setFormData({ nom: '', prenom: '', email: '', telephone: '', entreprise: '', categorie_badge: 'PARTICIPANT', nb_accompagnateurs: 0, accepted_terms: false, accepted_data_processing: false, indicatif: '+212' }); }}
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
                  <input required type="text" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 sm:py-4 sm:px-5 focus:ring-2 focus:ring-ynov transition-all text-base sm:text-sm" value={formData.prenom} onChange={(e) => setFormData({ ...formData, prenom: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Nom *</label>
                  <input required type="text" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 sm:py-4 sm:px-5 focus:ring-2 focus:ring-ynov transition-all text-base sm:text-sm" value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Adresse e-mail *</label>
                <input required type="email" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 sm:py-4 sm:px-5 focus:ring-2 focus:ring-ynov transition-all text-base sm:text-sm" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Numéro de téléphone *</label>
                  <div className="flex gap-2 min-w-0">
                    <div className="relative shrink-0 w-24 sm:w-28">
                      <select 
                        className="w-full bg-slate-100 dark:bg-slate-800 flex items-center px-3 pr-8 rounded-xl text-base sm:text-xs font-bold text-slate-500 h-full border-none focus:ring-2 focus:ring-ynov appearance-none cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap"
                        value={formData.indicatif}
                        onChange={(e) => setFormData({ ...formData, indicatif: e.target.value })}
                      >
                        {countryCodes.map((c) => (
                          <option key={c.code} value={c.code}>{c.code} ({c.country})</option>
                        ))}
                      </select>
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <ChevronDown className="w-3 h-3" />
                      </div>
                    </div>
                    <input required type="tel" className="flex-1 min-w-0 bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-4 px-5 focus:ring-2 focus:ring-ynov transition-all text-base sm:text-sm" placeholder="612345678" value={formData.telephone} onChange={(e) => setFormData({ ...formData, telephone: e.target.value })} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Nom de l'entreprise / Université *</label>
                  <input required type="text" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 sm:py-4 sm:px-5 focus:ring-2 focus:ring-ynov transition-all text-base sm:text-sm" value={formData.entreprise} onChange={(e) => setFormData({ ...formData, entreprise: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Catégorie de badge *</label>
                  <div className="relative">
                    <select className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 sm:py-4 sm:px-5 focus:ring-2 focus:ring-ynov transition-all appearance-none cursor-pointer text-base sm:text-sm pr-10" value={formData.categorie_badge} onChange={(e) => setFormData({ ...formData, categorie_badge: e.target.value })}>
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
                    J'accepte les <Link to="/cgu" className="underline text-ynov font-bold">conditions générales d'utilisation</Link> et la <Link to="/confidentialite" className="underline text-ynov font-bold">politique de confidentialité</Link>. *
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
