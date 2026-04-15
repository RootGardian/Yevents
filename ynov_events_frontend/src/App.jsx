import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Calendar, ShieldCheck, Github, Instagram, Linkedin } from 'lucide-react';
import RegistrationForm from './components/RegistrationForm';
import AdminDashboard from './components/AdminDashboard';
import HeaderBanner from './components/HeaderBanner';

const Layout = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen font-sans selection:bg-ynov selection:text-white transition-colors duration-300">
      {/* Top Banner */}
      <HeaderBanner />

      {/* Navbar - Sticky below the banner */}
      <nav className="sticky top-0 w-full z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-900 h-16 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex items-center justify-center gap-6 sm:gap-12">
          <Link
            to="/"
            className={`text-xs font-black uppercase tracking-[0.2em] hover:text-ynov transition-colors ${!isAdmin ? 'text-ynov' : 'text-slate-400'}`}
          >
            INSCRIPTION
          </Link>
          <div className="w-px h-4 bg-slate-200 dark:bg-slate-800"></div>
          <Link
            to="/admin"
            className={`flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] hover:text-ynov transition-colors ${isAdmin ? 'text-ynov' : 'text-slate-400'}`}
          >
            <ShieldCheck className="w-4 h-4" />
            ESPACE ADMIN
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-10 md:py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 dark:border-slate-900 py-12 bg-slate-50 dark:bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-sm">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-ynov rounded flex items-center justify-center">
                <Calendar className="text-white w-3 h-3" />
              </div>
              <span className="font-black tracking-tighter dark:text-white">Maroc Ynov Campus</span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              8 Ibnou Katima (Ex Bournazel), Casablanca 20000<br />
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs">Événement</h4>
            <ul className="space-y-2 text-slate-500">
              <li>Ynov Days 2026</li>
              <li>Conférences & Networking</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs">Suivez-nous</h4>
            <div className="flex items-center gap-4 text-slate-400">
              <a href="#" className="hover:text-ynov transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="hover:text-ynov transition-colors"><Linkedin className="w-5 h-5" /></a>
              <a href="#" className="hover:text-ynov transition-colors"><Github className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <p>© 2026 YNOV MOROCCO - ALL RIGHTS RESERVED.</p>
          <div className="flex gap-4">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<RegistrationForm />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
