import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Calendar, ShieldCheck, Github, Instagram, Linkedin, Scan, BarChart3, LogOut, User } from 'lucide-react';
import RegistrationForm from './components/RegistrationForm';
import AdminDashboard from './components/AdminDashboard';
import CheckinDashboard from './components/CheckinDashboard';
import WelcomePage from './components/WelcomePage';
import RegistrationCorrection from './components/RegistrationCorrection';
import TermsOfUse from './components/TermsOfUse';
import PrivacyPolicy from './components/PrivacyPolicy';
import MyRegistrations from './components/MyRegistrations';
import FAQ from './components/FAQ';
import ScrollToTop from './components/ScrollToTop';
import api from './api';
import { useNavigate } from 'react-router-dom';


const Layout = ({ children, user, onLogout }) => {
  const location = useLocation();
  const isRegistrationPage = location.pathname === '/inscription';
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen font-sans selection:bg-ynov selection:text-white transition-colors duration-300">

      {/* Dark Minimalist Navbar - Hidden on special registration page */}
      {!isRegistrationPage && (
        <nav className="sticky top-0 w-full z-50 bg-[#0a0b0d] border-b border-white/5 h-16 flex items-center shadow-2xl">
          <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">

            {/* Center - Main Navigation Links */}
            <div className="flex items-center gap-6 sm:gap-10">
              <Link
                to="/checkin"
                className={`text-[11px] font-black uppercase tracking-[0.25em] transition-all duration-300 ${location.pathname === '/checkin' ? 'text-ynov' : 'text-slate-400 hover:text-white'}`}
              >
                Check-in
              </Link>
              {(!user || user.role === 'admin' || user.isSuperAdmin) && (
                <Link
                  to="/admin"
                  className={`text-[11px] font-black uppercase tracking-[0.25em] transition-all duration-300 ${location.pathname === '/admin' ? 'text-ynov' : 'text-slate-400 hover:text-white'}`}
                >
                  Admin
                </Link>
              )}
            </div>

            {/* Right - Profile Actions */}
            <div className="flex items-center gap-4">
              {!user ? (
                <Link to="/admin" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-ynov transition-colors flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  Connexion
                </Link>
              ) : (
                <>
                  <div className="hidden sm:flex flex-col items-end mr-2">
                    <span className="text-[10px] font-black tracking-[0.1em] text-white uppercase italic">{user.nom}</span>
                    <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">{user.role}</span>
                  </div>
                  <div 
                    onClick={onLogout}
                    className="p-2 bg-slate-800/50 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 rounded-xl cursor-pointer transition-all group"
                    title="Déconnexion"
                  >
                    <LogOut className="w-4 h-4 text-slate-500 group-hover:text-red-500 transition-colors" />
                  </div>
                </>
              )}
            </div>
          </div>
        </nav>
      )}

      <main className="py-10 md:py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        {children}
      </main>

      <footer className="border-t border-slate-100 dark:border-slate-900 py-12 bg-slate-50 dark:bg-slate-950/50 mt-auto">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-sm">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-ynov rounded flex items-center justify-center"><Calendar className="text-white w-3 h-3" /></div>
              <span className="font-black tracking-tighter dark:text-white uppercase">Ynov Events</span>
            </div>
            <a 
              href="https://maps.app.goo.gl/B6KTip19rMJmUVMp7?g_st=ic" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-500 text-xs hover:text-ynov transition-colors cursor-pointer"
            >
              8 Ibnou Katima (Ex Bournazel)<br />Casablanca 20000
            </a>
          </div>
          <div className="space-y-4">
            <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-[10px]">L'Événement</h4>
            <ul className="space-y-2 text-slate-500 text-xs">
              <li>Ynov Days 2026</li>
              <li>Campus de Casablanca</li>
              <li className="pt-2">
                <Link to="/faq" className="hover:text-ynov transition-colors font-bold tracking-tight">FAQ / Aide</Link>
              </li>
              <li className="pt-1">
                <a href="mailto:ahmedrachid.bangoura@ynov.com" className="hover:text-ynov transition-colors font-bold tracking-tight text-[10px] opacity-70">Support : ahmedrachid.bangoura@ynov.com</a>
              </li>
            </ul>
          </div>
          <div className="space-y-4 text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase">© 2026 YNOV MOROCCO</p>
            <div className="flex justify-end gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
               <Link to="/cgu" className="hover:text-ynov transition-colors">CGU</Link>
               <Link to="/confidentialite" className="hover:text-ynov transition-colors">Confidentialité</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Simple Login Component
const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/login', { email, password });
      onLogin(res.data.user, res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl w-full max-w-md space-y-6">
        <div className="text-center">
          <ShieldCheck className="w-12 h-12 text-ynov mx-auto mb-4" />
          <h2 className="text-2xl font-black uppercase italic">Accès Restreint</h2>
          <p className="text-slate-400 text-xs uppercase tracking-widest">Admin & Staff Uniquement</p>
        </div>
        <div className="space-y-4">
          <input type="email" placeholder="Email" className="w-full bg-slate-800 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-ynov" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Mot de passe" className="w-full bg-slate-800 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-ynov" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}
        <button disabled={loading} className="w-full bg-ynov py-3 rounded-xl font-bold hover:bg-ynov/90 disabled:opacity-50 transition-all uppercase tracking-widest">
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
};

function App() {
  const getSafeStorage = (key) => {
    const item = localStorage.getItem(key);
    if (!item || item === 'undefined') return null;
    try {
      return JSON.parse(item);
    } catch (e) {
      return null;
    }
  };

  const [user, setUser] = useState(getSafeStorage('user'));
  const [token, setToken] = useState(localStorage.getItem('admin_token'));

  const handleLogin = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('admin_token', userToken);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('admin_token');
  };

  return (
    <Router>
      <ScrollToTop />
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/inscription" element={<RegistrationForm />} />
          <Route path="/cgu" element={<TermsOfUse />} />
          <Route path="/confidentialite" element={<PrivacyPolicy />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/mes-inscriptions" element={<MyRegistrations />} />
          <Route path="/correction" element={<RegistrationCorrection onBack={() => window.location.hash = '#/'} />} />

          <Route
            path="/admin"
            element={
              user ? (
                user.role === 'admin' ? <AdminDashboard user={user} token={token} /> : <Navigate to="/checkin" />
              ) : <Login onLogin={handleLogin} />
            }
          />
          <Route
            path="/checkin"
            element={
              user ? <CheckinDashboard user={user} token={token} /> : <Login onLogin={handleLogin} />
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
