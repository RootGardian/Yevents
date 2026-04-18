import React, { useState, useEffect } from 'react';
import {
  Users, CheckCircle2, QrCode, Search, LogOut, Scan, Key, MousePointerClick, X, RefreshCw, AlertTriangle
} from 'lucide-react';
import api from '../api';
import QRScanner from './QRScanner';
import { soundService } from '../utils/sounds';

const CheckinDashboard = ({ user, token }) => {
  const [participants, setParticipants] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showScanner, setShowScanner] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [lastScanResult, setLastScanResult] = useState(null);
  const [stats, setStats] = useState(null);

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

  const handleScanSuccessful = async (decodedText) => {
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
        message: res.data.message,
        participant: res.data.participant
      });

      setShowScanner(false);
      setShowManualInput(false);
      setManualCode('');
      fetchData();

      setTimeout(() => setLastScanResult(null), 4000);
    } catch (err) {
      console.error(err);
      const isAlready = err.response?.data?.status === 'ALREADY_CHECKED_IN';
      
      if (isAlready) {
          soundService.playError(); // Or maybe a neutral sound? playError for now
      } else {
          soundService.playError();
      }

      setLastScanResult({
        success: false,
        isWarning: isAlready,
        message: err.response?.data?.message || "Erreur de validation",
        participant: err.response?.data?.participant
      });
      setShowScanner(false);
      setTimeout(() => setLastScanResult(null), 4000);
    }
  };

  const filteredParticipants = participants.filter(p =>
    p.nom.toLowerCase().includes(search.toLowerCase()) ||
    p.prenom.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase()) ||
    (p.qrCodeToken && p.qrCodeToken.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black mb-1 italic">CHECK-IN</h1>
          <p className="text-xs sm:text-sm text-slate-400">Scanner & Validation des présences</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button onClick={fetchData} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
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
            <Key className="w-4 h-4" /> UUID
          </button>
        </div>
      </div>

      {showManualInput && (
        <div className="bg-slate-900 border-2 border-ynov/30 p-4 rounded-2xl flex flex-col sm:flex-row gap-3 items-center animate-in slide-in-from-top duration-300">
          <div className="flex-1 w-full relative">
            <Key className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Entrez le code unique..."
              className="w-full bg-slate-800 py-2 pl-10 pr-4 rounded-xl focus:ring-2 focus:ring-ynov border-none text-base"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCheckinAction(manualCode)}
              autoFocus
            />
          </div>
          <button
            onClick={() => handleCheckinAction(manualCode)}
            disabled={!manualCode}
            className="w-full sm:w-auto px-6 py-2 bg-ynov rounded-xl font-bold hover:bg-ynov/80 disabled:opacity-50 transition-all"
          >
            Valider
          </button>
        </div>
      )}

      {lastScanResult && (
        <div className={`fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300 backdrop-blur-md ${
             lastScanResult.success ? 'bg-green-500/90' : 
             lastScanResult.isWarning ? 'bg-amber-500/90' : 'bg-red-500/90'
           }`}>
           <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-2xl max-w-lg w-full text-center space-y-6 border-4 border-white/20">
             <div className="flex justify-center">
                {lastScanResult.success ? (
                    <CheckCircle2 className="w-24 h-24 text-green-500 animate-bounce" />
                ) : lastScanResult.isWarning ? (
                    <AlertTriangle className="w-24 h-24 text-amber-500 animate-pulse" />
                ) : (
                    <X className="w-24 h-24 text-red-500" />
                )}
             </div>
             
             <div className="space-y-2">
                <h3 className={`text-3xl font-black uppercase italic ${
                    lastScanResult.success ? 'text-green-500' : 
                    lastScanResult.isWarning ? 'text-amber-500' : 'text-red-500'
                }`}>
                    {lastScanResult.message}
                </h3>
                {lastScanResult.participant && (
                    <p className="text-xl font-bold text-slate-700 dark:text-white uppercase tracking-tighter">
                        {lastScanResult.participant.prenom} {lastScanResult.participant.nom}
                    </p>
                )}
                {lastScanResult.isWarning && (
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest pt-2 border-t border-slate-100 dark:border-slate-800 mt-4">
                        ⚠️ DÉJÀ VALIDÉ PRÉCÉDEMMENT
                    </p>
                )}
             </div>

             <button 
                onClick={() => setLastScanResult(null)}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-black transition-all"
             >
                Fermer
             </button>
           </div>
        </div>
      )}

      {showScanner && (
        <QRScanner
          onScanSuccess={handleScanSuccessful}
          onClose={() => setShowScanner(false)}
        />
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
          <Users className="text-blue-400 w-6 h-6 mb-4" />
          <div className="text-2xl font-black">{stats?.total_attendu || 0}</div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Attendus</div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
          <CheckCircle2 className="text-green-400 w-6 h-6 mb-4" />
          <div className="text-2xl font-black">{stats?.total_present || 0}</div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Présents</div>
        </div>
      </div>

      <div className="space-y-4">
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
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
              <tr>
                <th className="px-4 py-3">Participant</th>
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
                    {p.isCheckedIn ? (
                      <span className="px-2 py-0.5 rounded text-[9px] font-black bg-green-500/20 text-green-500 border border-green-500/30">PRÉSENT</span>
                    ) : p.registrationStatus === 'email_failed' ? (
                      <div className="flex flex-col gap-1.5">
                        <span className="w-fit px-2 py-0.5 rounded text-[9px] font-black bg-red-500/20 text-red-500 border border-red-500/30">ERREUR EMAIL</span>
                        <button
                          onClick={() => handleCheckinAction(p.qrCodeToken)}
                          className="flex items-center gap-1 w-fit px-2 py-1 bg-slate-700 hover:bg-ynov/20 hover:text-ynov rounded text-[10px] font-bold transition-all text-slate-400 group"
                        >
                          <MousePointerClick className="w-3 h-3 group-hover:scale-110 transition-transform" /> VALIDER MANUELLEMENT
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleCheckinAction(p.qrCodeToken)}
                        className="flex items-center gap-1 px-2 py-1 bg-slate-700 hover:bg-ynov/20 hover:text-ynov rounded text-[10px] font-bold transition-all text-slate-400 group"
                      >
                        <MousePointerClick className="w-3 h-3 group-hover:scale-110 transition-transform" /> VALIDER PRÉSENCE
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
  );
};

export default CheckinDashboard;
