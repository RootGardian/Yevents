import React, { useState, useEffect } from 'react';
import {
  Users, CheckCircle2, QrCode, Download, RefreshCw, BarChart3, Search, LogOut, Scan, AlertTriangle, Mail, Key, MousePointerClick, X, ShieldCheck, History, Eye, MapPin, UserPlus, Trash2
} from 'lucide-react';
import api from '../api';
import QRScanner from './QRScanner';
import { soundService } from '../utils/sounds';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

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
  const [view, setView] = useState('stats'); // 'stats', 'audit', 'staff'
  const [auditLogs, setAuditLogs] = useState([]);
  const [staffList, setStaffList] = useState([]);

  // Staff Form
  const [newStaff, setNewStaff] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    fetchData();
  }, []);

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
      const res = await api.get('/admin/audit-logs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAuditLogs(res.data);
      setView('audit');
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la récupération des logs");
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await api.get('/admin/staff', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStaffList(res.data);
      setView('staff');
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/staff', newStaff, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewStaff({ name: '', email: '', password: '' });
      fetchStaff();
      alert("Membre du staff créé !");
    } catch (err) {
      alert(err.response?.data?.message || "Erreur de création");
    }
  };

  const handleDeleteStaff = async (id) => {
    if (!confirm("Supprimer ce compte staff ?")) return;
    try {
      await api.delete(`/admin/staff/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchStaff();
    } catch (err) {
      alert("Erreur de suppression");
    }
  };

  const handleExport = async () => {
    try {
      const res = await api.get('/admin/export', {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `participants_ynov_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Erreur lors de l'export");
    }
  };

  const handleResendMail = async (email) => {
    try {
      const res = await api.post('/admin/resend-email', { email }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(res.data.message);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors du renvoi");
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
          <h1 className="text-2xl sm:text-4xl font-black mb-1 italic">ADMINISTRATION</h1>
          <p className="text-xs sm:text-sm text-slate-400">Contrôle total & Gestion d'évènement</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setView('stats')}
            className={`px-4 py-2 rounded-lg font-bold transition-all border ${view === 'stats' ? 'bg-ynov border-ynov text-white' : 'bg-slate-800 border-slate-700 hover:bg-slate-700'}`}
          >
            Stats
          </button>
          <button
            onClick={fetchStaff}
            className={`px-4 py-2 rounded-lg font-bold transition-all border ${view === 'staff' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 hover:bg-slate-700'}`}
          >
            Staff
          </button>
          <button
            onClick={fetchAuditLogs}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all border ${view === 'audit' ? 'bg-amber-600 border-amber-500 text-white' : 'bg-slate-800 border-slate-700 hover:bg-slate-700'}`}
          >
            <ShieldCheck className="w-4 h-4" /> Rapport
          </button>
          <button onClick={handleExport} className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg font-bold hover:bg-slate-700">
            CSV
          </button>
        </div>
      </div>

      {view === 'stats' && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: 'Total Inscrits', value: stats?.total_attendu, icon: Users, color: 'text-blue-400' },
              { label: 'Remplissage', value: `${stats?.taux_remplissage}%`, icon: BarChart3, color: 'text-ynov' },
              { label: 'Présents', value: stats?.total_present, icon: CheckCircle2, color: 'text-green-400' },
              { label: 'Echecs Mail', value: stats?.email_failures || 0, icon: AlertTriangle, color: stats?.email_failures > 0 ? 'text-red-500' : 'text-slate-500' },
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                <item.icon className={`${item.color} w-5 h-5 mb-4`} />
                <div className="text-2xl font-black">{item.value}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 p-6 rounded-3xl h-[400px]">
              <h3 className="font-bold text-slate-400 uppercase text-xs tracking-widest mb-6">Répartition</h3>
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie data={stats?.stats_par_categorie || []} dataKey="total" nameKey="categorie_badge" cx="50%" cy="50%" innerRadius={60} outerRadius={100} label>
                    {stats?.stats_par_categorie?.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} itemStyle={{ color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Chercher..."
                  className="w-full bg-slate-800 py-2.5 pl-10 pr-4 rounded-xl border-none focus:ring-2 focus:ring-ynov"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden h-[312px] overflow-y-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-800 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                    <tr>
                      <th className="px-4 py-3">Nom</th>
                      <th className="px-4 py-3">État</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredParticipants.map(p => (
                      <tr key={p.id}>
                        <td className="px-4 py-3">
                          <div className="font-bold text-white">{p.prenom} {p.nom}</div>
                          <div className="text-[10px] text-slate-500">{p.email}</div>
                        </td>
                        <td className="px-4 py-3">
                          {p.is_checked_in ? (
                            <span className="px-2 py-0.5 rounded text-[9px] font-black bg-green-500/20 text-green-500 border border-green-500/30">PRÉSENT</span>
                          ) : p.registration_status === 'email_failed' ? (
                            <span className="px-2 py-0.5 rounded text-[9px] font-black bg-red-500/20 text-red-500 border border-red-500/30">ERREUR EMAIL</span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[9px] font-black bg-slate-800 text-slate-500 border border-slate-700">ATTENDU</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {p.registration_status === 'email_failed' && (
                            <button onClick={() => handleResendMail(p.email)} title="Renvoyer l'email" className="p-2 text-ynov hover:bg-ynov/10 rounded-lg"><RefreshCw className="w-4 h-4" /></button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {view === 'audit' && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center text-slate-400 font-bold uppercase text-xs tracking-widest">
            <div className="flex items-center gap-2"><History className="w-4 h-4 text-amber-500" /> Rapport d'Audit</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800/50 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                <tr><th className="px-6 py-4">Action</th><th className="px-6 py-4">Description</th><th className="px-6 py-4">User</th><th className="px-6 py-4 text-right">Date</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4"><span className="px-2 py-0.5 rounded text-[10px] font-black border border-slate-700">{log.action}</span></td>
                    <td className="px-6 py-4 text-white">{log.details}</td>
                    <td className="px-6 py-4 text-xs text-slate-400">{log.causerType} (ID: {log.causerId || 'N/A'})</td>
                    <td className="px-6 py-4 text-right text-slate-500 text-xs">{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === 'staff' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl h-fit">
            <h3 className="font-bold text-white mb-6 flex items-center gap-2"><UserPlus className="w-5 h-5 text-indigo-400" /> Ajouter Staff</h3>
            <form onSubmit={handleCreateStaff} className="space-y-4">
              <input type="text" placeholder="Nom complet" className="w-full bg-slate-800 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500" value={newStaff.name} onChange={e => setNewStaff({ ...newStaff, name: e.target.value })} required />
              <input type="email" placeholder="Email" className="w-full bg-slate-800 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500" value={newStaff.email} onChange={e => setNewStaff({ ...newStaff, email: e.target.value })} required />
              <input type="password" placeholder="Mot de passe" className="w-full bg-slate-800 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500" value={newStaff.password} onChange={e => setNewStaff({ ...newStaff, password: e.target.value })} required />
              <button className="w-full bg-indigo-600 py-3 rounded-xl font-bold hover:bg-indigo-500 transition-all">Créer le compte</button>
            </form>
          </div>

          <div className="md:col-span-2 bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 font-bold uppercase text-xs tracking-widest text-slate-400">Liste du Staff</div>
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800/50 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                <tr><th className="px-6 py-4">Nom</th><th className="px-6 py-4">Email</th><th className="px-6 py-4 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {staffList.map(s => (
                  <tr key={s.id} className="hover:bg-slate-800/20">
                    <td className="px-6 py-4 font-bold text-white">{s.name}</td>
                    <td className="px-6 py-4 text-slate-400">{s.email}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDeleteStaff(s.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
