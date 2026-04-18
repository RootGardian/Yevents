import React, { useState, useEffect } from 'react';
import {
  Users, CheckCircle2, QrCode, Download, RefreshCw, BarChart3, Search, LogOut, Scan, AlertTriangle, Mail, Key, MousePointerClick, X, ShieldCheck, History, Eye, MapPin, UserPlus, Trash2
} from 'lucide-react';
import api from '../api';
import QRScanner from './QRScanner';
import { soundService } from '../utils/sounds';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#8c2d2d', '#4299e1', '#ed8936', '#ecc94b'];

const AdminDashboard = ({ user, token }) => {
  const [stats, setStats] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showScanner, setShowScanner] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [lastScanResult, setLastScanResult] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isTriggering, setIsTriggering] = useState(false);
  const [view, setView] = useState('stats'); // 'stats', 'audit', 'staff', 'admins', 'settings'
  const [auditLogs, setAuditLogs] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [adminsList, setAdminsList] = useState([]);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });
  const [newStaff, setNewStaff] = useState({ name: '', email: '', password: '' });
  const [eventSettings, setEventSettings] = useState({
    event_name: '',
    event_date: '',
    event_date_text: '',
    event_hours: '',
    event_location: '',
    event_location_link: '',
    event_public_target: '',
    max_capacity: '',
    support_email: ''
  });
  const [settingsLoading, setSettingsLoading] = useState(false);

  useEffect(() => {
    fetchData();
    fetchSettingsData();
  }, []);

  const fetchSettingsData = async () => {
    try {
      const res = await api.get('/settings');
      setEventSettings(res.data);
    } catch (err) {
      console.error("Erreur settings:", err);
    }
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    setSettingsLoading(true);
    try {
      await api.post('/admin/settings', eventSettings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Paramètres mis à jour !");
    } catch (err) {
      alert(err.response?.data?.message || "Erreur de mise à jour");
    } finally {
      setSettingsLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [statsRes, listRes] = await Promise.all([
        api.get('/admin/stats', { headers }),
        api.get('/admin/participants', { headers })
      ]);
      setStats(statsRes.data);
      setParticipants(listRes.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        localStorage.removeItem('admin_token');
        window.location.reload();
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const res = await api.get('/admin/audit-logs', { headers: { Authorization: `Bearer ${token}` } });
      setAuditLogs(res.data);
      setView('audit');
    } catch (err) {
      alert("Erreur logs");
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await api.get('/admin/staff', { headers: { Authorization: `Bearer ${token}` } });
      setStaffList(res.data);
      setView('staff');
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAdmins = async () => {
    try {
      const res = await api.get('/admin/admins', { headers: { Authorization: `Bearer ${token}` } });
      setAdminsList(res.data);
      setView('admins');
    } catch (err) {
      alert("Privilèges Super Admin requis.");
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/admins', newAdmin, { headers: { Authorization: `Bearer ${token}` } });
      setNewAdmin({ name: '', email: '', password: '' });
      fetchAdmins();
      alert("Administrateur créé !");
    } catch (err) {
      alert(err.response?.data?.message || "Erreur création");
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (!confirm("Supprimer l'admin ?")) return;
    try {
      await api.delete(`/admin/admins/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchAdmins();
    } catch (err) {
      alert("Erreur suppression");
    }
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/staff', newStaff, { headers: { Authorization: `Bearer ${token}` } });
      setNewStaff({ name: '', email: '', password: '' });
      fetchStaff();
      alert("Staff créé !");
    } catch (err) {
      alert("Erreur création");
    }
  };

  const handleDeleteStaff = async (id) => {
    if (!confirm("Supprimer le staff ?")) return;
    try {
      await api.delete(`/admin/staff/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchStaff();
    } catch (err) {
      alert("Erreur suppression");
    }
  };

  const handleExport = async () => {
    try {
      const res = await api.get('/admin/export', { headers: { Authorization: `Bearer ${token}` }, responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `participants_ynov.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert("Erreur export");
    }
  };

  const handleTriggerReminders = () => {
    setShowAuthModal(true);
  };

  const confirmTriggerReminders = async (e) => {
    e.preventDefault();
    if (!adminPassword) return;

    setIsTriggering(true);
    try {
      const res = await api.post('/admin/trigger-reminders',
        { password: adminPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message);
      setShowAuthModal(false);
      setAdminPassword('');
    } catch (err) {
      alert(err.response?.data?.message || "Erreur d'authentification");
    } finally {
      setIsTriggering(false);
    }
  };

  const handleResendMail = async (email) => {
    try {
      const res = await api.post('/admin/resend-email', { email }, { headers: { Authorization: `Bearer ${token}` } });
      alert(res.data.message);
      fetchData();
    } catch (err) {
      alert("Erreur renvoi");
    }
  };

  const filteredParticipants = participants.filter(p =>
    p.nom.toLowerCase().includes(search.toLowerCase()) ||
    p.prenom.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black mb-1 italic uppercase underline decoration-ynov decoration-4 underline-offset-8">Dashboard Admin</h1>
          <p className="text-xs sm:text-sm text-slate-400">Bienvenue, <span className="text-white font-bold">{user.nom}</span> | Yevents Management System</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setView('stats')} className={`px-4 py-2 rounded-xl font-bold transition-all border ${view === 'stats' ? 'bg-ynov border-ynov text-white shadow-lg' : 'bg-slate-800 border-slate-700'}`}>Stats</button>
          {user.isSuperAdmin && (
            <button onClick={() => setView('settings')} className={`px-4 py-2 rounded-xl font-bold transition-all border ${view === 'settings' ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-slate-800 border-slate-700'}`}>Configuration</button>
          )}
          {user.isSuperAdmin && (
            <button onClick={fetchStaff} className={`px-4 py-2 rounded-xl font-bold transition-all border ${view === 'staff' ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-slate-800 border-slate-700'}`}>Staff</button>
          )}
          {user.isSuperAdmin && (
            <button onClick={fetchAdmins} className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all border ${view === 'admins' ? 'bg-red-600 border-red-500 text-white shadow-lg' : 'bg-slate-800 border-slate-700'}`}> Admins</button>
          )}
          <button onClick={fetchAuditLogs} className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all border ${view === 'audit' ? 'bg-amber-600 border-amber-500 text-white shadow-lg' : 'bg-slate-800 border-slate-700'}`}> Logs</button>
          <button onClick={handleExport} className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl font-bold hover:bg-slate-700">CSV</button>
          {user.isSuperAdmin && (
            <button
              onClick={handleTriggerReminders}
              disabled={isTriggering}
              className={`flex items-center gap-2 px-4 py-2 border rounded-xl font-bold transition-all group ${isTriggering ? 'bg-slate-700 border-slate-600 text-slate-500 cursor-not-allowed' : 'bg-ynov/10 border-ynov/30 text-ynov hover:bg-ynov/20'}`}
            >
              <RefreshCw className={`w-4 h-4 ${isTriggering ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
              {isTriggering ? 'Envoi...' : 'Rappels J-2'}
            </button>
          )}
        </div>
      </div>

      {view === 'stats' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Inscrits', value: stats?.total_inscrits, icon: Users, color: 'text-blue-400' },
              { label: 'Remplissage', value: `${stats?.taux_remplissage}%`, icon: BarChart3, color: 'text-ynov' },
              { label: 'Présents', value: stats?.total_present, icon: CheckCircle2, color: 'text-green-400' },
              { label: 'Echecs Mail', value: stats?.email_failures || 0, icon: AlertTriangle, color: stats?.email_failures > 0 ? 'text-red-500' : 'text-slate-500' },
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
                <item.icon className={`${item.color} w-5 h-5 mb-4`} />
                <div className="text-2xl font-black">{item.value ?? 0}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem] h-[400px]">
              <h3 className="font-bold text-slate-400 uppercase text-xs tracking-widest mb-6 border-b border-slate-800 pb-2">Répartition Catégories</h3>
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie data={stats?.stats_par_categorie || []} dataKey="total" nameKey="categorie_badge" cx="50%" cy="50%" innerRadius={60} outerRadius={100} label>
                    {stats?.stats_par_categorie?.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} itemStyle={{ color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem] h-[400px]">
              <h3 className="font-bold text-slate-400 uppercase text-xs tracking-widest mb-6 border-b border-slate-800 pb-2">Arrivées par Heure</h3>
              <ResponsiveContainer width="100%" height="80%">
                <AreaChart data={stats?.presences_par_heure || []}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8c2d2d" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8c2d2d" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="hour" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} itemStyle={{ color: '#fff' }} />
                  <Area type="monotone" dataKey="count" stroke="#8c2d2d" fillOpacity={1} fill="url(#colorCount)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <input type="text" placeholder="Chercher..." className="w-full bg-slate-900 py-3 pl-10 pr-4 rounded-2xl border border-slate-800 focus:ring-2 focus:ring-ynov transition-all" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden h-[308px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-800 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                    <tr><th className="px-4 py-3 text-left">Nom</th><th className="px-4 py-3 text-left">État</th><th className="px-4 py-3 text-right">Action</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredParticipants.map(p => (
                      <tr key={p.id} className="hover:bg-slate-800/10 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-bold text-white text-xs">{p.prenom} {p.nom}</div>
                          <div className="text-[10px] text-slate-500 truncate max-w-[150px]">{p.email}</div>
                        </td>
                        <td className="px-4 py-3">
                          {p.isCheckedIn ? 
                            <span className="text-[9px] font-black text-green-500 bg-green-500/10 px-2 py-0.5 rounded">PRÉSENT</span> : 
                            <span className="text-[9px] font-black text-slate-500 uppercase">Attendu</span>
                          }
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleResendMail(p.email)} 
                              title="Renvoyer le mail"
                              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-ynov transition-all"
                            >
                              <Mail className="w-4 h-4" />
                            </button>
                            {p.registrationStatus === 'email_failed' && (
                              <button 
                                onClick={() => handleResendMail(p.email)} 
                                title="Erreur mail - Renvoyer"
                                className="p-1.5 bg-red-500/10 rounded-lg text-red-500"
                              >
                                <RefreshCw className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {view === 'audit' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden animate-in fade-in zoom-in duration-300">
          <div className="p-6 border-b border-slate-800 font-bold uppercase text-xs tracking-widest text-slate-400">Rapport d'Audit</div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800 text-slate-400 text-[10px] font-bold uppercase">
                <tr><th className="px-6 py-4">Action</th><th className="px-6 py-4">Détails</th><th className="px-6 py-4 text-right">Date</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-800/20">
                    <td className="px-6 py-4"><span className="px-2 py-0.5 rounded text-[10px] font-black bg-slate-800 border border-slate-700">{log.action}</span></td>
                    <td className="px-6 py-4 text-white text-xs">{log.details}</td>
                    <td className="px-6 py-4 text-right text-slate-500 text-[10px]">{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === 'staff' && user.isSuperAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in slide-in-from-right duration-500">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl h-fit">
            <h3 className="font-black text-white mb-6 uppercase italic">Ajouter Staff</h3>
            <form onSubmit={handleCreateStaff} className="space-y-4">
              <input type="text" placeholder="Nom" className="w-full bg-slate-800 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500" value={newStaff.name} onChange={e => setNewStaff({ ...newStaff, name: e.target.value })} required />
              <input type="email" placeholder="Email" className="w-full bg-slate-800 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500" value={newStaff.email} onChange={e => setNewStaff({ ...newStaff, email: e.target.value })} required />
              <input type="password" placeholder="Pass" className="w-full bg-slate-800 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500" value={newStaff.password} onChange={e => setNewStaff({ ...newStaff, password: e.target.value })} required />
              <button className="w-full bg-indigo-600 py-3 rounded-xl font-bold">Créer</button>
            </form>
          </div>
          <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800 text-slate-400 text-xs font-bold uppercase">
                <tr><th className="px-6 py-4">Nom</th><th className="px-6 py-4 text-right">Action</th></tr>
              </thead>
              <tbody>
                {staffList.map(s => (
                  <tr key={s.id} className="border-t border-slate-800"><td className="px-6 py-4 font-bold text-white">{s.name}</td><td className="px-6 py-4 text-right"><button onClick={() => handleDeleteStaff(s.id)} className="text-red-500">Supprimer</button></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === 'admins' && user.isSuperAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in slide-in-from-left duration-500">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl h-fit">
            <h3 className="font-black text-white mb-6 uppercase italic">Ajouter Admin</h3>
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <input type="text" placeholder="Nom" className="w-full bg-slate-800 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-red-500" value={newAdmin.name} onChange={e => setNewAdmin({ ...newAdmin, name: e.target.value })} required />
              <input type="email" placeholder="Email" className="w-full bg-slate-800 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-red-500" value={newAdmin.email} onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })} required />
              <input type="password" placeholder="Pass" className="w-full bg-slate-800 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-red-500" value={newAdmin.password} onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })} required />
              <button className="w-full bg-red-600 py-3 rounded-xl font-bold">Créer</button>
            </form>
          </div>
          <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800 text-slate-400 text-xs font-bold uppercase">
                <tr><th className="px-6 py-4">Email</th><th className="px-6 py-4 text-right">Action</th></tr>
              </thead>
              <tbody>
                {adminsList.map(adm => (
                  <tr key={adm.id} className="border-t border-slate-800"><td className="px-6 py-4 text-white font-bold">{adm.email}</td><td className="px-6 py-4 text-right">{!adm.isSuperAdmin && <button onClick={() => handleDeleteAdmin(adm.id)} className="text-red-500">Supprimer</button>}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === 'settings' && user.isSuperAdmin && (
        <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden animate-in slide-in-from-top-4 duration-500">
          <div className="bg-indigo-600 p-8 text-white relative h-32 flex items-end">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter relative z-10">Configuration de l'Événement</h2>
          </div>
          
          <form onSubmit={handleUpdateSettings} className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Nom de l'événement</label>
                <input type="text" className="w-full bg-slate-800 border-none rounded-xl py-4 px-6 focus:ring-2 focus:ring-indigo-500 transition-all" value={eventSettings.event_name} onChange={e => setEventSettings({...eventSettings, event_name: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Cible Publique</label>
                <input type="text" className="w-full bg-slate-800 border-none rounded-xl py-4 px-6 focus:ring-2 focus:ring-indigo-500 transition-all" value={eventSettings.event_public_target} onChange={e => setEventSettings({...eventSettings, event_public_target: e.target.value})} required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Date (ISO: YYYY-MM-DD)</label>
                <input type="date" className="w-full bg-slate-800 border-none rounded-xl py-4 px-6 focus:ring-2 focus:ring-indigo-500 transition-all" value={eventSettings.event_date} onChange={e => setEventSettings({...eventSettings, event_date: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Date Affichée (Texte)</label>
                <input type="text" className="w-full bg-slate-800 border-none rounded-xl py-4 px-6 focus:ring-2 focus:ring-indigo-500 transition-all" value={eventSettings.event_date_text} onChange={e => setEventSettings({...eventSettings, event_date_text: e.target.value})} required placeholder="SAMEDI 2 MAI" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Horaires (Texte)</label>
                <input type="text" className="w-full bg-slate-800 border-none rounded-xl py-4 px-6 focus:ring-2 focus:ring-indigo-500 transition-all" value={eventSettings.event_hours} onChange={e => setEventSettings({...eventSettings, event_hours: e.target.value})} required placeholder="09:00 - 18:00" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Localisation (Texte)</label>
              <input type="text" className="w-full bg-slate-800 border-none rounded-xl py-4 px-6 focus:ring-2 focus:ring-indigo-500 transition-all" value={eventSettings.event_location} onChange={e => setEventSettings({...eventSettings, event_location: e.target.value})} required />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Lien Google Maps (URL)</label>
              <input type="url" className="w-full bg-slate-800 border-none rounded-xl py-4 px-6 focus:ring-2 focus:ring-indigo-500 transition-all" value={eventSettings.event_location_link} onChange={e => setEventSettings({...eventSettings, event_location_link: e.target.value})} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Capacité Maximale</label>
                <input type="number" className="w-full bg-slate-800 border-none rounded-xl py-4 px-6 focus:ring-2 focus:ring-indigo-500 transition-all" value={eventSettings.max_capacity} onChange={e => setEventSettings({...eventSettings, max_capacity: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email Support</label>
                <input type="email" className="w-full bg-slate-800 border-none rounded-xl py-4 px-6 focus:ring-2 focus:ring-indigo-500 transition-all" value={eventSettings.support_email} onChange={e => setEventSettings({...eventSettings, support_email: e.target.value})} required />
              </div>
            </div>

            <button
              type="submit"
              disabled={settingsLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20 disabled:opacity-50"
            >
              {settingsLoading ? "Mise à jour..." : "Enregistrer les modifications"}
            </button>
          </form>
        </div>
      )}

      {/* Auth Modal for Reminders */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-ynov/10 rounded-2xl">
                <ShieldCheck className="w-8 h-8 text-ynov" />
              </div>
              <button
                onClick={() => { setShowAuthModal(false); setAdminPassword(''); }}
                className="p-2 hover:bg-slate-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <h3 className="text-2xl font-black text-white mb-2 uppercase italic">Action Critique</h3>
            <p className="text-slate-400 text-sm mb-6">
              L'envoi automatique des rappels à tous les participants est une action irréversible.
              Veuillez saisir votre mot de passe pour confirmer.
            </p>

            <form onSubmit={confirmTriggerReminders} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Mot de Passe Admin</label>
                <input
                  type="password"
                  autoFocus
                  className="w-full bg-slate-800 border-none rounded-2xl py-4 px-6 text-white focus:ring-2 focus:ring-ynov transition-all placeholder:text-slate-600"
                  placeholder="••••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isTriggering}
                className="w-full bg-ynov hover:bg-ynov_dark text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-ynov/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isTriggering ? (
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto" />
                ) : (
                  'Confirmer l\'envoi'
                )}
              </button>

              <button
                type="button"
                onClick={() => { setShowAuthModal(false); setAdminPassword(''); }}
                className="w-full py-3 text-slate-500 text-xs font-bold hover:text-slate-300 transition-colors"
              >
                Annuler
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
