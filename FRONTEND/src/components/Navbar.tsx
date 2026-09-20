import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HeartPulse, ShieldAlert, PhoneCall, LogOut, UserCheck } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { NotificationBell } from './NotificationBell';
import { useLanguage } from '../context/LanguageContext';

import type { SOSAlert } from '../types';

export const Navbar: React.FC<{
  highRiskCount?: number;
  sosAlerts?: SOSAlert[];
  onSelectSosAlert?: (caseId: string) => void;
}> = ({ highRiskCount = 0, sosAlerts = [], onSelectSosAlert }) => {
  const location = useLocation();
  const { session, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const isPatientView = location.pathname.startsWith('/patient');

  return (
    <header className="bg-white/95 border-b border-slate-200/80 backdrop-blur-md sticky top-0 z-40 shadow-xs transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isPatientView ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-indigo-50 text-indigo-600 border border-indigo-200'}`}>
              {isPatientView ? <HeartPulse className="w-6 h-6 animate-pulse" /> : <ShieldAlert className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold tracking-wider text-slate-500 uppercase">SIH 2026</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold">Tele-MANAS Integrated</span>
              </div>
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                <span className="bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent">SAHAY</span>
                <span className="text-slate-400 font-normal text-xs sm:text-sm">|</span>
                <span className="text-slate-700 text-xs sm:text-sm font-semibold">
                  {isPatientView ? t.patientSupportPortal : t.aiDistressMonitoring}
                </span>
              </h1>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3 sm:gap-4">
            {isPatientView ? (
              <a
                href="tel:14416"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs sm:text-sm font-semibold transition-all shadow-xs"
              >
                <PhoneCall className="w-4 h-4 animate-bounce text-emerald-600" />
                <span>Tele-MANAS Helpline: <strong>14416</strong></span>
              </a>
            ) : session ? (
              <>
                {/* Counsellor Jurisdiction Badge */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-slate-500">{t.jurisdictionLabel}</span>
                  <span className="font-bold text-slate-800">{session.assignedDistrict}, {session.assignedState}</span>
                </div>

                {/* Counsellor Profile Info */}
                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-xs">
                  <UserCheck className="w-4 h-4 text-indigo-600" />
                  <div className="hidden sm:block text-left">
                    <p className="font-bold text-slate-900 leading-tight">{session.name}</p>
                    <p className="text-[10px] text-indigo-600 font-mono">{session.counsellorId}</p>
                  </div>
                </div>

                {/* Language Switcher Pill */}
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  <button
                    onClick={() => {
                      setLanguage('en');
                      localStorage.setItem('sahay_language', 'en');
                    }}
                    className={`px-2 py-0.5 rounded font-bold text-[10px] transition-all ${
                      language === 'en' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('hi');
                      localStorage.setItem('sahay_language', 'hi');
                    }}
                    className={`px-2 py-0.5 rounded font-bold text-[10px] transition-all ${
                      language === 'hi' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    HI
                  </button>
                </div>

                {/* Animated High Risk Alert Bell */}
                <NotificationBell count={highRiskCount} sosAlerts={sosAlerts} onSelectSosAlert={onSelectSosAlert} />

                {/* Logout Button */}
                <button
                  onClick={logout}
                  title="Logout"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t.logoutBtn}</span>
                </button>
              </>
            ) : (
              <Link
                to="/counsellor/login"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all"
              >
                {t.counsellorPortalLoginBtn}
              </Link>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
