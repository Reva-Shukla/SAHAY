import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeartPulse, ShieldCheck, User, Sparkles, PhoneCall, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  const handleSelectPatientRole = () => {
    navigate('/patient');
  };

  const handleSelectCounsellorRole = () => {
    navigate('/counsellor/login');
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat text-slate-900 flex flex-col justify-between relative overflow-hidden" style={{ backgroundImage: 'url(/landing-bg.jpg)' }}>
      
      {/* Background Decorative Soft Pastel Blobs & Silhouette Illustrations */}
      <div className="absolute top-0 right-0 w-[650px] h-[650px] bg-[#d8f3dc]/40 rounded-full blur-[90px] pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[600px] bg-[#ffcad4]/50 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#f4acb7]/35 rounded-full blur-[110px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[550px] h-[550px] bg-[#b7e4c7]/40 rounded-full blur-[100px] pointer-events-none"></div>

      {/* SVG Corner Plant/Leaves Illustration (Top-Right) */}
      <svg className="absolute top-0 right-0 w-80 sm:w-96 h-[480px] pointer-events-none opacity-45 sm:opacity-55" viewBox="0 0 300 420" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M280 20 Q200 0 160 80 Q140 140 210 170 Q280 140 280 20 Z" fill="#a7f3d0" opacity="0.6"/>
        <path d="M300 90 Q230 75 210 135 Q200 185 250 210 Q300 185 300 90 Z" fill="#6ee7b7" opacity="0.7"/>
        <path d="M230 160 Q170 150 155 205 Q140 260 210 280 Q270 250 230 160 Z" fill="#34d399" opacity="0.5"/>
        <path d="M260 240 Q210 230 195 275 Q180 320 230 340 Q280 315 260 240 Z" fill="#818cf8" opacity="0.3"/>
      </svg>

      {/* SVG Corner People/Support Silhouette Illustration (Bottom-Left) */}
      <svg className="absolute bottom-0 left-0 w-88 sm:w-[420px] h-72 sm:h-80 pointer-events-none opacity-40 sm:opacity-55" viewBox="0 0 420 300" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Soft Warm Purple-Pink Silhouette Group Walking Together & Offering Support */}
        <g opacity="0.85">
          {/* Person 1 - Left */}
          <circle cx="70" cy="140" r="15" fill="#9d4edd"/>
          <path d="M50 240 C50 180 90 180 90 240 Z" fill="#9d4edd"/>
          {/* Person 2 - Center Left (Arm around Person 3) */}
          <circle cx="125" cy="125" r="17" fill="#c77dff"/>
          <path d="M100 240 C100 165 150 165 150 240 Z" fill="#c77dff"/>
          {/* Support Connection Arc / Shared Shoulder */}
          <path d="M120 160 Q150 150 180 160" stroke="#e0aaff" strokeWidth="8" strokeLinecap="round"/>
          {/* Person 3 - Center Right */}
          <circle cx="175" cy="130" r="16" fill="#b5e2fa"/>
          <path d="M152 240 C152 170 198 170 198 240 Z" fill="#e0aaff"/>
          {/* Person 4 - Right */}
          <circle cx="225" cy="145" r="14" fill="#ff99c8"/>
          <path d="M205 240 C205 188 245 188 245 240 Z" fill="#ff99c8"/>
        </g>
        {/* Soft Decorative Ground Flow & Leaves */}
        <path d="M0 240 Q120 220 250 245 Q350 260 420 240 L420 300 L0 300 Z" fill="#f4acb7" opacity="0.3"/>
        <path d="M180 230 Q220 180 270 205 Q310 220 280 260 Q230 270 180 230 Z" fill="#b7e4c7" opacity="0.5"/>
        <path d="M260 245 Q290 210 330 225 Q360 235 340 265 Q300 275 260 245 Z" fill="#95d5b2" opacity="0.4"/>
      </svg>

      {/* Top Header Navigation */}
      <header className="bg-white/90 border-b border-slate-200/80 backdrop-blur-md sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md">
                <HeartPulse className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-extrabold tracking-wider text-slate-500 uppercase">SIH 2026</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold">Tele-MANAS Integrated</span>
                </div>
                <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">
                  SAHAY <span className="text-slate-400 font-normal text-xs">(सहाय)</span>
                </h1>
              </div>
            </div>

            <a
              href="tel:14416"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs sm:text-sm font-bold shadow-xs transition-all"
            >
              <PhoneCall className="w-4 h-4 text-emerald-600 animate-bounce" />
              <span>Tele-MANAS Helpline: <strong>14416</strong></span>
            </a>
          </div>
        </div>
      </header>
      
      {/* Language Switcher Bar */}
      <div className="bg-white/80 border-b border-slate-200 py-2 px-4 z-40 relative">
        <div className="max-w-7xl mx-auto flex items-center justify-end text-xs">
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 ml-1.5"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
            <button
              onClick={() => {
                setLanguage('en');
                localStorage.setItem('sahay_language', 'en');
                localStorage.setItem('sahay_language_selected', 'true');
              }}
              className={`px-2.5 py-0.5 rounded-md font-bold text-[11px] transition-all ${
                language === 'en' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English
            </button>
            <button
              onClick={() => {
                setLanguage('hi');
                localStorage.setItem('sahay_language', 'hi');
                localStorage.setItem('sahay_language_selected', 'true');
              }}
              className={`px-2.5 py-0.5 rounded-md font-bold text-[11px] transition-all ${
                language === 'hi' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              हिन्दी
            </button>
          </div>
        </div>
      </div>

      {/* Main Hero & Role Selection Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-10 sm:py-16 flex flex-col justify-center items-center z-10 space-y-10">
        
        {/* Title & Subtitle Banner */}
        <div className="text-center space-y-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>{t.aiSystemLabel}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight"
          >
            {language === 'hi' ? (
              <>
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 bg-clip-text text-transparent">SAHAY</span> {t.welcomeTo}
              </>
            ) : (
              <>
                {t.welcomeTo} <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 bg-clip-text text-transparent">SAHAY</span>
              </>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed"
          >
            {t.portalDescription}
          </motion.p>
        </div>

        {/* Role Selection Question Banner */}
        <div className="text-center space-y-1">
          <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-slate-700">
            {t.selectRoleTitle}
          </h2>
          <p className="text-xs text-slate-500">{t.selectRoleSubtitle}</p>
        </div>

        {/* Two Interactive Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          
          {/* Role Card 1: Patient / Victim / Caretaker */}
          <motion.div
            whileHover={{ scale: 1.025, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSelectPatientRole}
            className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-50/70 to-emerald-100/40 backdrop-blur-xl border border-white hover:border-emerald-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(16,185,129,0.1)] transition-all cursor-pointer group flex flex-col justify-between space-y-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/30 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>

            <div className="space-y-4 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-800 border border-emerald-300 flex items-center justify-center shadow-sm">
                <User className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                  {t.openAccessSupport}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {t.patientOrCaretaker}
                </h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed max-w-[250px]">
                {t.patientCardDesc}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-white font-bold text-sm bg-emerald-500 shadow-md shadow-emerald-500/20 px-6 py-3 rounded-xl w-fit mx-auto group-hover:bg-emerald-600 transition-all">
              <span>{t.continueAsPatient}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>

          {/* Role Card 2: Official Counsellor / Admin */}
          <motion.div
            whileHover={{ scale: 1.025, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSelectCounsellorRole}
            className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-50/70 to-indigo-100/40 backdrop-blur-xl border border-white hover:border-indigo-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(79,70,229,0.1)] transition-all cursor-pointer group flex flex-col justify-between space-y-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200/30 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
            
            <div className="space-y-4 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-800 border border-indigo-300 flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 block mb-1">
                  {t.restrictedAccess}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-indigo-700 transition-colors">
                  {t.authorizedCounsellor}
                </h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed max-w-[250px]">
                {t.counsellorCardDesc}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-white font-bold text-sm bg-indigo-500 shadow-md shadow-indigo-500/20 px-6 py-3 rounded-xl w-fit mx-auto group-hover:bg-indigo-600 transition-all">
              <Lock className="w-4 h-4" />
              <span>{t.counsellorLoginBtn}</span>
            </div>
          </motion.div>

        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl pt-4">
          <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200 flex items-center gap-3 text-xs text-slate-700 shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span><strong>24/7 Tele-MANAS</strong> {t.trustBadge1}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200 flex items-center gap-3 text-xs text-slate-700 shadow-xs">
            <Lock className="w-5 h-5 text-indigo-600 flex-shrink-0" />
            <span><strong>In-Memory JWT</strong> {t.trustBadge2}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200 flex items-center gap-3 text-xs text-slate-700 shadow-xs">
            <Sparkles className="w-5 h-5 text-teal-600 flex-shrink-0" />
            <span><strong>AI Distress Forecast</strong> {t.trustBadge3}</span>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-200 bg-white">
        {t.footerText}
      </footer>
    </div>
  );
};
