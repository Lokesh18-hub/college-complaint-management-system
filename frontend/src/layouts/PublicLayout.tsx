import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Sparkles, User, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const PublicLayout: React.FC = () => {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Floating Modern Pill Navbar (Image 1 Style) */}
      <header className="sticky top-3 z-50 px-4 sm:px-6 w-full max-w-6xl mx-auto">
        <div className="rounded-2xl sm:rounded-full bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-2xl px-4 sm:px-6 py-2.5 flex items-center justify-between transition-all hover:border-white/20">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-sky-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white group-hover:text-blue-300 transition-colors">
                CCMS
              </span>
              <span className="hidden sm:inline-block text-[11px] text-slate-400 font-medium pl-1.5 border-l border-slate-700">
                Complaint Portal
              </span>
            </div>
          </Link>

          {/* Navigation Links (Features, Departments, Workflow, About) */}
          <nav className="hidden md:flex items-center gap-7 text-xs sm:text-sm font-medium text-slate-300">
            {isHome ? (
              <>
                <a href="#features" className="hover:text-white transition-colors">
                  Features
                </a>
                <a href="#departments" className="hover:text-white transition-colors">
                  Departments
                </a>
                <a href="#workflow" className="hover:text-white transition-colors">
                  Workflow
                </a>
                <a href="#stats" className="hover:text-white transition-colors">
                  Live Stats
                </a>
              </>
            ) : (
              <>
                <Link to="/#features" className="hover:text-white transition-colors">
                  Features
                </Link>
                <Link to="/#departments" className="hover:text-white transition-colors">
                  Departments
                </Link>
                <Link to="/#workflow" className="hover:text-white transition-colors">
                  Workflow
                </Link>
              </>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated ? (
              <Link
                to={role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard'}
                className="text-xs font-bold text-slate-950 bg-white hover:bg-slate-100 px-4 py-2 rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" />
                <span>{role === 'ADMIN' ? 'Admin Dashboard' : 'Student Dashboard'}</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-xs sm:text-sm font-bold text-slate-950 bg-white hover:bg-slate-100 px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95 flex items-center gap-1.5"
                >
                  <span>Sign up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* Modern Dark Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-8 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 space-y-2">
          <div className="flex items-center justify-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span className="font-semibold text-slate-300">College Complaint Management System (CCMS)</span>
          </div>
          <p>© 2026 Designed for transparent campus operations & SLA accountability.</p>
        </div>
      </footer>
    </div>
  );
};
