import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import {
  Users, CheckCircle2, QrCode, Download, RefreshCw, BarChart3, Search, LogOut, Scan, AlertTriangle, Mail, Key, MousePointerClick, X
} from 'lucide-react';
import api from '../api';
import QRScanner from './QRScanner';
import { soundService } from '../utils/sounds';

const COLORS = ['#8c2d2d', '#4299e1', '#ed8936', '#ecc94b'];

const AdminDashboard = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('admin_token') || '');
  const [isAuth, setIsAuth] = useState(false);
  const [stats, setStats] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showScanner, setShowScanner] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [lastScanResult, setLastScanResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      validateAndFetch();
    } else {
      setLoading(false);
    }
  }, []);

  const validateAndFetch = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [statsRes, listRes] = await Promise.all([
        api.get('/admin/stats', { headers }),
        api.get('/admin/participants', { headers })
      ]);
      setStats(statsRes.data);
      setParticipants(listRes.data);
      setIsAuth(true);
    } catch (err) {
      console.error(err);
      setIsAuth(false);
      localStorage.removeItem('admin_token');
      setToken('');
      setError('Session expirée');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/login', { email, password });
      const newToken = res.data.token;
      setToken(newToken);
      localStorage.setItem('admin_token', newToken);
      setIsAuth(true);
      // Les données seront chargées par le useEffect suivant le changement d'état ou manuellement ici
      const headers = { Authorization: `Bearer ${newToken}` };
      const [statsRes, listRes] = await Promise.all([
        api.get('/admin/stats', { headers }),
        api.get('/admin/participants', { headers })
      ]);
      setStats(statsRes.data);
      setParticipants(listRes.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Identifiants incorrects');
      setIsAuth(false);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const res = await api.get('/admin/export', {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      // Utiliser directement res.data qui est déjà un blob
      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `participants_ynov_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();

      // Nettoyage
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'export CSV");
    }
  };

  const handleScanSuccessful = async (decodedText) => {
    // Le QR contient l'URL complète : http://.../api/admin/checkin/{token}
    const tokenPart = decodedText.split('/').pop();
    handleCheckinAction(tokenPart);
  };

  const handleCheckinAction = async (tokenPart) => {
    try {
      const res = await api.post(`/admin/checkin/${tokenPart}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      soundService.playSuccess();
      setLastScanResult({
        success: true,
        message: res.data.message
      });

      setShowScanner(false);
      setShowManualInput(false);
      setManualCode('');

      // Rafraîchir les données
      validateAndFetch();

      // Effacer le message après 3s
      setTimeout(() => setLastScanResult(null), 3000);
    } catch (err) {
      console.error(err);
      soundService.playError();
      setLastScanResult({
        success: false,
        message: err.response?.data?.message || "Erreur de validation"
      });
      setShowScanner(false);
      setTimeout(() => setLastScanResult(null), 3000);
    }
  };

  const handleResendMail = async (email) => {
    try {
      const res = await api.post('/admin/resend-email', { email }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(res.data.message);
      validateAndFetch(); // Refresh to see status change
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Erreur lors du renvoi");
    }
  };

  if (!isAuth) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <form
          onSubmit={handleLogin}
          className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl w-full max-w-md space-y-5"
        >
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-ynov mx-auto mb-4" />
            <h2 className="text-2xl font-black">Admin Access</h2>
            <p className="text-slate-400 text-sm">Veuillez vous authentifier</p>
          </div>
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email..."
              className={`w-full bg-slate-800 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-ynov ${error ? 'ring-2 ring-red-500' : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
            <input
              type="password"
              placeholder="Mot de passe..."
              className={`w-full bg-slate-800 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-ynov ${error ? 'ring-2 ring-red-500' : ''}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          {error && <p className="text-red-500 text-xs font-bold text-center mt-2">{error}</p>}
          <button
            disabled={loading}
            className="w-full bg-ynov py-3 rounded-xl font-bold hover:bg-ynov/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>
      </div>
    );
  }

  const filteredParticipants = participants.filter(p =>
    p.nom.toLowerCase().includes(search.toLowerCase()) ||
    p.prenom.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase()) ||
    (p.qr_code_token && p.qr_code_token.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black mb-1 italic">DASHBOARD</h1>
          <p className="text-xs sm:text-sm text-slate-400">Ynov Events - {new Date().toLocaleDateString()}</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button onClick={() => validateAndFetch()} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              soundService.init();
              setShowScanner(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg font-bold hover:bg-slate-700 transition-all border border-slate-700"
          >
            <Scan className="w-4 h-4 text-ynov" /> Scanner
          </button>
          <button
            onClick={() => {
              soundService.init();
              setShowManualInput(!showManualInput);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all border ${showManualInput ? 'bg-ynov border-ynov text-white' : 'bg-slate-800 border-slate-700 hover:bg-slate-700'}`}
          >
            <Key className="w-4 h-4" /> Presence
          </button>
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg font-bold hover:bg-slate-700 transition-all border border-slate-700">
            <Download className="w-4 h-4" /> CSV
          </button>
          <button onClick={() => { setIsAuth(false); localStorage.removeItem('admin_token'); }} className="p-2 bg-red-900/20 text-red-500 rounded-lg">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {showManualInput && (
        <div className="bg-slate-900 border-2 border-ynov/30 p-4 rounded-2xl flex flex-col sm:flex-row gap-3 items-center animate-in slide-in-from-top duration-300">
          <div className="flex-1 w-full relative">
            <Key className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Entrez le code unique (UUID)..."
              className="w-full bg-slate-800 py-2 pl-10 pr-4 rounded-xl focus:ring-2 focus:ring-ynov border-none text-sm"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCheckinAction(manualCode)}
              autoFocus
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => handleCheckinAction(manualCode)}
              disabled={!manualCode}
              className="flex-1 sm:flex-none px-6 py-2 bg-ynov rounded-xl font-bold hover:bg-ynov/80 disabled:opacity-50 transition-all"
            >
              Valider Presence
            </button>
            <button
              onClick={() => setShowManualInput(false)}
              className="p-2 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>
      )}

      {lastScanResult && (
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[110] px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-top duration-500 flex items-center gap-3 font-bold ${lastScanResult.success ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {lastScanResult.success ? <CheckCircle2 className="w-6 h-6" /> : <X className="w-6 h-6" />}
          {lastScanResult.message}
        </div>
      )}

      {showScanner && (
        <QRScanner
          onScanSuccess={handleScanSuccessful}
          onClose={() => setShowScanner(false)}
        />
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6">
        {[
          { label: 'Total Inscrits', value: stats?.total_attendu, icon: Users, color: 'text-blue-400' },
          { label: 'Taux Remplissage', value: `${stats?.taux_remplissage}%`, icon: BarChart3, color: 'text-ynov' },
          { label: 'Présents', value: stats?.total_present, icon: CheckCircle2, color: 'text-green-400' },
          { label: 'Pass Restants', value: stats?.jauge_max - stats?.total_attendu, icon: QrCode, color: 'text-orange-400' },
          { label: 'Échecs Email', value: stats?.email_failures || 0, icon: AlertTriangle, color: stats?.email_failures > 0 ? 'text-red-500 animate-pulse' : 'text-slate-600' },
        ].map((item, idx) => (
          <div key={idx} className={`bg-slate-900/50 border ${item.label === 'Échecs Email' && stats?.email_failures > 0 ? 'border-red-900/50' : 'border-slate-800'} p-4 sm:p-6 rounded-xl sm:rounded-2xl`}>
            <item.icon className={`${item.color} w-5 h-5 sm:w-6 sm:h-6 mb-3 sm:mb-4`} />
            <div className={`text-xl sm:text-2xl font-black ${item.label === 'Échecs Email' && stats?.email_failures > 0 ? 'text-red-500' : ''}`}>{item.value}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-tight">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 p-6 rounded-3xl h-[400px]">
          <h3 className="font-bold mb-6 text-slate-400 uppercase text-xs tracking-widest">Répartition par Catégorie</h3>
          <ResponsiveContainer width="100%" height="80%">
            <PieChart>
              <Pie
                data={stats?.stats_par_categorie || []}
                dataKey="total"
                nameKey="categorie_badge"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                label
              >
                {stats?.stats_par_categorie?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }}
                itemStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Search & Actions */}
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Rechercher un participant..."
              className="w-full bg-slate-800 py-3 pl-11 pr-4 rounded-xl focus:ring-2 focus:ring-ynov border-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden h-[312px] overflow-y-auto overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[500px] sm:min-w-0">
              <thead className="bg-slate-800 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                <tr>
                  <th className="px-4 py-3">Participant</th>
                  <th className="px-4 py-3">Email Status</th>
                  <th className="px-4 py-3">Presence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredParticipants.map(p => (
                  <tr key={p.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-white">{p.prenom} {p.nom}</div>
                      <div className="text-[10px] text-slate-500">{p.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      {p.registration_status === 'email_failed' ? (
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-500 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> ÉCHEC
                          </span>
                          <button
                            onClick={() => handleResendMail(p.email)}
                            className="p-1 hover:bg-slate-700 rounded text-ynov"
                            title="Renvoyer l'email"
                          >
                            <RefreshCw className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-500">
                          REÇU
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {p.is_checked_in ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-500">
                          PRÉSENT
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            soundService.init();
                            handleCheckinAction(p.qr_code_token);
                          }}
                          className="flex items-center gap-1 ml-auto px-2 py-1 bg-slate-700 hover:bg-ynov/20 hover:text-ynov rounded text-[10px] font-bold transition-all text-slate-400 border border-transparent hover:border-ynov/30"
                        >
                          <MousePointerClick className="w-3 h-3" /> MARQUER PRÉSENT
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
