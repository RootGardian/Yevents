import React, { useState, useEffect } from 'react';
import { Mail, ShieldCheck, Loader2, ArrowRight, ArrowLeft, RefreshCw, CheckCircle, AlertCircle, Download, Edit3, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';
import BadgePreview from './BadgePreview';

const MyRegistrations = ({ onBack }) => {
    const [step, setStep] = useState('email'); // 'email', 'otp', 'verified'
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [participant, setParticipant] = useState(null);
    const [timer, setTimer] = useState(0);
    const [token, setToken] = useState(null);
    const [showEdit, setShowEdit] = useState(false);

    // Timer logic for resend
    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await api.post('/otp/request', { email });
            setStep('otp');
            setTimer(120); // 2 minutes
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de l'envoi du code.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await api.post('/otp/verify', { email, code });
            setParticipant(res.data.participant);
            setToken(res.data.token);
            setStep('verified');
        } catch (err) {
            setError(err.response?.data?.message || "Code invalide ou expiré.");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        window.print();
    };

    const handleUpdateParticipant = async (updatedData) => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.post('/register/update', updatedData, {
                headers: {
                    'x-correction-token': token
                }
            });
            setParticipant(res.data.participant);
            setShowEdit(false);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la mise à jour.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-4 md:py-8 px-2 sm:px-4">
            {/* Top Navigation Header - Always Visible */}
            <div className="mb-6 md:mb-8 flex items-center justify-between gap-4">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 transition-all shadow-sm group"
                >
                    <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-ynov transition-colors" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">Accueil</span>
                </button>
                <div className="flex-1 text-right sm:text-left">
                    <h2 className="text-xl md:text-2xl font-black uppercase italic tracking-tight">Espace Badges</h2>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest hidden sm:block">Retrouvez et gérez vos accès</p>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {step === 'verified' && participant ? (
                    <motion.div
                        key="verified"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <div className="flex flex-col lg:flex-row gap-8 items-start">
                            {/* Badge Column */}
                            <div className="flex-1 w-full space-y-6">
                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 md:p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                                    <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                                        <h3 className="text-xl font-black uppercase italic tracking-tight">Votre Badge</h3>
                                        <div className="flex w-full sm:w-auto gap-2">
                                            <button
                                                onClick={handleDownload}
                                                className="flex-1 sm:flex-none p-3 bg-slate-100 dark:bg-slate-800 rounded-xl hover:text-ynov transition-colors flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest"
                                            >
                                                <Download className="w-4 h-4" /> <span className="hidden xs:inline">Badge</span> PDF
                                            </button>
                                            <button
                                                onClick={() => setShowEdit(!showEdit)}
                                                className={`flex-1 sm:flex-none p-3 rounded-xl transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest border-2 ${showEdit ? 'bg-ynov border-ynov text-white ring-4 ring-ynov/20' : 'bg-red-600 border-red-600 text-white shadow-xl shadow-red-600/40 hover:scale-105 active:scale-95'}`}
                                            >
                                                <Edit3 className="w-4 h-4" /> {showEdit ? 'Fermer' : 'Modifier'}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-3xl border border-slate-100 dark:border-slate-800">
                                        <BadgePreview
                                            formData={{
                                                nom: participant.nom,
                                                prenom: participant.prenom,
                                                email: participant.email,
                                                entreprise: participant.entreprise,
                                                categorie_badge: participant.categorieBadge,
                                                telephone: participant.telephone,
                                                qrCodeToken: participant.qrCodeToken
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Edit Form Column */}
                            <AnimatePresence>
                                {showEdit && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="w-full lg:w-[400px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-2xl sticky top-24"
                                    >
                                        <div className="flex items-center justify-between mb-8">
                                            <h3 className="text-xl font-black uppercase italic">Modifier</h3>
                                            <button onClick={() => setShowEdit(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 hover:text-red-500 transition-colors">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <EditForm participant={participant} onUpdate={handleUpdateParticipant} loading={loading} error={error} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                ) : step === 'email' ? (
                    <motion.div
                        key="email"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-2xl space-y-6"
                    >
                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 bg-ynov/10 rounded-full flex items-center justify-center mx-auto text-ynov mb-4">
                                <Mail className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-black uppercase italic">Accéder à mes badges</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium px-4">Saisissez l'e-mail de votre inscription pour recevoir votre code d'accès.</p>
                        </div>

                        <form onSubmit={handleRequestOTP} className="space-y-4">
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    required
                                    type="email"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-ynov transition-all text-base"
                                    placeholder="monmail@yevents.ma"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            {error && <p className="text-red-500 text-[10px] font-black text-center uppercase tracking-widest">{error}</p>}
                            <button
                                disabled={loading}
                                className="w-full bg-ynov text-white font-black py-4 rounded-2xl shadow-xl shadow-ynov/10 hover:opacity-90 transition-all flex items-center justify-center gap-3"
                            >
                                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <>CONTINUER <ArrowRight className="w-4 h-4" /></>}
                            </button>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div
                        key="otp"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-2xl space-y-6"
                    >
                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 bg-ynov/10 rounded-full flex items-center justify-center mx-auto text-ynov mb-4">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-black uppercase italic">Vérification</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Le code a été envoyé à : <br /><strong className="text-slate-900 dark:text-white underline">{email}</strong></p>
                        </div>

                        <form onSubmit={handleVerifyOTP} className="space-y-6">
                            <div className="flex justify-center">
                                <input
                                    required
                                    autoFocus
                                    maxLength={6}
                                    type="text"
                                    className="w-full max-w-[280px] bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-5 px-4 text-center text-3xl font-black tracking-[0.25em] focus:ring-2 focus:ring-ynov transition-all placeholder:tracking-normal placeholder:text-lg"
                                    placeholder="••••••"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                                />
                            </div>

                            {error && <p className="text-red-500 text-[10px] font-black text-center uppercase tracking-widest">{error}</p>}

                            <button
                                disabled={loading || code.length !== 6}
                                className="w-full bg-ynov text-white font-black py-4 rounded-2xl shadow-xl shadow-ynov/10 hover:opacity-90 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "VÉRIFIER LE CODE"}
                            </button>

                            <div className="text-center">
                                {timer > 0 ? (
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Renvoyer dans {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</p>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleRequestOTP}
                                        className="text-ynov hover:underline text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 mx-auto"
                                    >
                                        <RefreshCw className="w-3 h-3" /> Renvoyer un code
                                    </button>
                                )}
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const EditForm = ({ participant, onUpdate, loading, error }) => {
    const [formData, setFormData] = useState({
        id: participant.id,
        nom: participant.nom,
        prenom: participant.prenom,
        email: participant.email,
        telephone: participant.telephone,
        entreprise: participant.entreprise || '',
        categorie_badge: participant.categorieBadge || 'PARTICIPANT'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Prénom</label>
                    <input required type="text" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 text-sm" value={formData.prenom} onChange={e => setFormData({ ...formData, prenom: e.target.value })} />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nom</label>
                    <input required type="text" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 text-sm" value={formData.nom} onChange={e => setFormData({ ...formData, nom: e.target.value })} />
                </div>
            </div>
            <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">E-mail</label>
                <input required type="email" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 text-sm" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Téléphone</label>
                <input required type="tel" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 text-sm" value={formData.telephone} onChange={e => setFormData({ ...formData, telephone: e.target.value })} />
            </div>
            <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Entreprise</label>
                <input required type="text" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 text-sm" value={formData.entreprise} onChange={e => setFormData({ ...formData, entreprise: e.target.value })} />
            </div>
            {error && <p className="text-red-500 text-[10px] font-black text-center uppercase tracking-widest">{error}</p>}
            <button disabled={loading} className="w-full bg-ynov text-white font-black py-4 rounded-xl shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 mt-4">
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <><Save className="w-4 h-4" /> ENREGISTRER</>}
            </button>
        </form>
    );
};

export default MyRegistrations;
