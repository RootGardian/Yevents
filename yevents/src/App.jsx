import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Calendar, ShieldCheck, Github, Instagram, Linkedin, Scan, BarChart3, LogOut, User, ArrowLeft } from 'lucide-react';
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
import ForceChangePassword from './components/ForceChangePassword';
import api from './api';
import { useNavigate } from 'react-router-dom';


const Layout = ({ children, user, onLogout, settings }) => {
  const location = useLocation();
  const isRegistrationPage = location.pathname === '/inscription';
  const isHome = location.pathname === '/';

  const currentYear = new Date().getFullYear();
  const event_name = settings?.event_name || 'Ynov Events';
  const support_email = settings?.support_email || 'ahmedrachid.bangoura@ynov.com';
  const event_location = settings?.event_location || '8 Ibnou Katima (Ex Bournazel), Casablanca 20000';
  const event_location_link = settings?.event_location_link || 'https://maps.app.goo.gl/B6KTip19rMJmUVMp7?g_st=ic';

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
                className={`text-xs font-black uppercase tracking-[0.25em] transition-all duration-300 ${location.pathname === '/checkin' ? 'text-ynov' : 'text-slate-400 hover:text-white'}`}
              >
                Check-in
              </Link>
              {(!user || user.role === 'admin' || user.isSuperAdmin) && (
                <Link
                  to="/admin"
                  className={`text-xs font-black uppercase tracking-[0.25em] transition-all duration-300 ${location.pathname === '/admin' ? 'text-ynov' : 'text-slate-400 hover:text-white'}`}
                >
                  Admin
                </Link>
              )}
            </div>

            {/* Right - Profile Actions */}
            <div className="flex items-center gap-4">
              {!user ? (
                <Link to="/admin" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-ynov transition-colors flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  Connexion
                </Link>
              ) : (
                <>
                  <div className="hidden sm:flex flex-col items-end mr-2">
                    <span className="text-xs font-black tracking-[0.1em] text-white uppercase italic">{user.nom}</span>
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{user.role}</span>
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
              <span className="font-black tracking-tighter dark:text-white uppercase">{event_name}</span>
            </div>
            <a
              href={event_location_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 text-sm hover:text-ynov transition-colors cursor-pointer"
            >
              {event_location}
            </a>
          </div>
          <div className="space-y-4">
            <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs">L'Événement</h4>
            <ul className="space-y-2 text-slate-500 text-sm">
              <li className="font-bold">{event_name}</li>
              <li>Propulsé par Ynov Campus</li>
              <li className="pt-2">
                <Link to="/faq" className="hover:text-ynov transition-colors font-bold tracking-tight">FAQ / Aide</Link>
              </li>
              <li className="pt-1">
                <a href={`mailto:${support_email}`} className="hover:text-ynov transition-colors font-bold tracking-tight text-xs opacity-70">Support : {support_email}</a>
              </li>
            </ul>
          </div>
          <div className="space-y-4 text-right">
            <p className="text-xs font-bold text-slate-400 uppercase">© {currentYear} YNOV MOROCCO</p>
            <div className="flex justify-end gap-4 text-xs font-bold uppercase tracking-widest text-slate-500">
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
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-6">
      <Link
        to="/"
        className="group flex items-center gap-2 text-slate-500 hover:text-ynov transition-all duration-300 text-xs font-black uppercase tracking-[0.2em] bg-slate-900/50 px-4 py-2 rounded-full border border-white/5 hover:border-ynov/20 shadow-xl"
      >
        <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
        Retour à l'accueil
      </Link>
      <form onSubmit={handleSubmit} className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl w-full max-w-md space-y-6">
        <div className="text-center">
          <ShieldCheck className="w-12 h-12 text-ynov mx-auto mb-4" />
          <h2 className="text-2xl font-black uppercase italic">Accès Restreint</h2>
          <p className="text-slate-400 text-sm uppercase tracking-widest">Admin & Staff Uniquement</p>
        </div>
        <div className="space-y-4">
          <input type="email" placeholder="Email" className="w-full bg-slate-800 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-ynov" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Mot de passe" className="w-full bg-slate-800 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-ynov" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}
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
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        setSettings(res.data);
      } catch (err) {
        console.error("Error fetching global settings:", err);
      }
    };
    fetchSettings();
  }, []);

  const handleLogin = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('admin_token', userToken);
  };

  const handlePasswordChanged = () => {
    const updatedUser = { ...user, requiresPasswordChange: false };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
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
      <Layout user={user} onLogout={handleLogout} settings={settings}>
        <Routes>
          <Route path="/" element={<WelcomePage settings={settings} />} />
          <Route path="/inscription" element={<RegistrationForm settings={settings} />} />
          <Route path="/cgu" element={<TermsOfUse />} />
          <Route path="/confidentialite" element={<PrivacyPolicy />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/mes-inscriptions" element={<MyRegistrations settings={settings} onBack={() => window.location.hash = '#/'} />} />
          <Route path="/correction" element={<RegistrationCorrection settings={settings} onBack={() => window.location.hash = '#/'} />} />

          <Route
            path="/admin"
            element={
              user ? (
                user.requiresPasswordChange ? (
                  <ForceChangePassword token={token} onPasswordChanged={handlePasswordChanged} />
                ) : (
                  user.role === 'admin' ? <AdminDashboard user={user} token={token} onLogout={handleLogout} /> : <Navigate to="/checkin" />
                )
              ) : <Login onLogin={handleLogin} />
            }
          />
          <Route
            path="/checkin"
            element={
              user ? (
                user.requiresPasswordChange ? (
                  <ForceChangePassword token={token} onPasswordChanged={handlePasswordChanged} />
                ) : (
                  <CheckinDashboard user={user} token={token} />
                )
              ) : <Login onLogin={handleLogin} />
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
