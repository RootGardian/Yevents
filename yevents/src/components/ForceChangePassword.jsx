import React, { useState } from 'react';
import { ShieldCheck, Key, Lock, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import api from '../api';

const ForceChangePassword = ({ onPasswordChanged, token }) => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      setLoading(false);
      return;
    }

    try {
      await api.post('/change-password', 
        { 
          oldPassword: formData.oldPassword, 
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSuccess(true);
      setTimeout(() => {
        onPasswordChanged();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du changement de mot de passe');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] max-w-md w-full text-center space-y-6 animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-black uppercase italic tracking-tight">Mot de passe mis à jour !</h2>
          <p className="text-slate-400 text-sm">Votre compte est désormais sécurisé. Vous allez être redirigé vers le dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] max-w-md w-full overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-ynov p-8 text-white relative h-32 flex items-end">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <ShieldCheck className="absolute top-6 right-6 w-12 h-12 text-white/20" />
          <h2 className="text-2xl font-black uppercase italic tracking-tighter relative z-10">Sécurité Requise</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-loose">
              Pour votre première connexion, vous devez définir un nouveau mot de passe personnel.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Key className="w-3 h-3" /> Mot de passe temporaire
              </label>
              <input 
                type="password" 
                required
                className="w-full bg-slate-800 border-none rounded-xl py-3.5 px-6 focus:ring-2 focus:ring-ynov transition-all text-white placeholder:text-slate-600"
                placeholder="Le mot de passe actuel"
                value={formData.oldPassword}
                onChange={e => setFormData({...formData, oldPassword: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Lock className="w-3 h-3" /> Nouveau mot de passe
              </label>
              <input 
                type="password" 
                required
                minLength={6}
                className="w-full bg-slate-800 border-none rounded-xl py-3.5 px-6 focus:ring-2 focus:ring-ynov transition-all text-white placeholder:text-slate-600"
                placeholder="Min. 6 caractères"
                value={formData.newPassword}
                onChange={e => setFormData({...formData, newPassword: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Lock className="w-3 h-3" /> Confirmer le mot de passe
              </label>
              <input 
                type="password" 
                required
                className="w-full bg-slate-800 border-none rounded-xl py-3.5 px-6 focus:ring-2 focus:ring-ynov transition-all text-white placeholder:text-slate-600"
                placeholder="Répétez le mot de passe"
                value={formData.confirmPassword}
                onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 bg-red-500/10 p-4 rounded-xl border border-red-500/20 animate-in shake duration-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p className="text-xs font-bold">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ynov hover:bg-ynov_dark text-white py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-xl shadow-ynov/20 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              'Mettre à jour mon mot de passe'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForceChangePassword;
