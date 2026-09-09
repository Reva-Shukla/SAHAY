import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartPulse, ShieldCheck, User, Sparkles, PhoneCall, Globe, ArrowRight, Lock, CheckCircle2, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import type { SupportedLanguage } from '../context/LanguageContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { setLanguage } = useLanguage();
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const handleSelectPatientRole = () => {
    setShowLanguageModal(true);
  };

  const handleChooseLanguage = (lang: SupportedLanguage) => {
    setLanguage(lang);
    setShowLanguageModal(false);
    navigate('/patient');
  };

  const handleSelectCounsellorRole = () => {
    navigate('/counsellor/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between relative overflow-hidden">
      
      {/* Background Decorative Ambient Pastel Blobs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-teal-200/40 rounded-full blur-3xl pointer-events-none"></div>

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
            <span>AI-Powered Mental Health Monitoring & Distress Prediction System</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight"
          >
            Welcome to <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 bg-clip-text text-transparent">SAHAY</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed"
          >
            A two-sided secure portal connecting patients and caretakers with clinical counsellors for early distress intervention and care.
          </motion.p>
        </div>

        {/* Role Selection Question Banner */}
        <div className="text-center space-y-1">
          <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-slate-700">
            Please Select Your Role to Continue
          </h2>
          <p className="text-xs text-slate-500">आप किस रूप में प्रवेश करना चाहते हैं?</p>
        </div>

        {/* Two Interactive Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          
          {/* Role Card 1: Patient / Victim / Caretaker */}
          <motion.div
            whileHover={{ scale: 1.025, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSelectPatientRole}
            className="p-6 sm:p-8 rounded-3xl bg-white border border-emerald-200 hover:border-emerald-400 shadow-xl hover:shadow-2xl transition-all cursor-pointer group flex flex-col justify-between space-y-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/50 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>

            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center justify-center shadow-xs">
                <User className="w-7 h-7" />
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">
                  Open Access Support
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Patient or Caretaker
                </h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  मरीज़ या देखभालकर्ता
                </p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Simple daily check-in with mood tracker, text journal, and optional voice note recording. Safe, easy-access, and 100% confidential.
              </p>
            </div>

            <button
              type="button"
              className="w-full py-3 px-4 rounded-2xl bg-emerald-600 group-hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Continue as Patient / Caretaker</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Role Card 2: Authorized Counsellor / Official */}
          <motion.div
            whileHover={{ scale: 1.025, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSelectCounsellorRole}
            className="p-6 sm:p-8 rounded-3xl bg-white border border-indigo-200 hover:border-indigo-400 shadow-xl hover:shadow-2xl transition-all cursor-pointer group flex flex-col justify-between space-y-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100/50 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>

            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-700 border border-indigo-300 flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-7 h-7" />
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 block">
                  Restricted Department Access
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-indigo-700 transition-colors">
                  Authorized Counsellor
                </h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  अधिकृत काउंसलर / अधिकारी
                </p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Secure credential verification, operational jurisdiction assignment (State & District), and real-time AI distress case monitoring dashboard.
              </p>
            </div>

            <button
              type="button"
              className="w-full py-3 px-4 rounded-2xl bg-indigo-600 group-hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Counsellor Login & Authorization</span>
              <Lock className="w-4 h-4" />
            </button>
          </motion.div>

        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl pt-4">
          <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200 flex items-center gap-3 text-xs text-slate-700 shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span><strong>24/7 Tele-MANAS</strong> Helpline Integration</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200 flex items-center gap-3 text-xs text-slate-700 shadow-xs">
            <Lock className="w-5 h-5 text-indigo-600 flex-shrink-0" />
            <span><strong>In-Memory JWT</strong> Role Claims</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200 flex items-center gap-3 text-xs text-slate-700 shadow-xs">
            <Sparkles className="w-5 h-5 text-teal-600 flex-shrink-0" />
            <span><strong>AI Distress Forecast</strong> & Recommendations</span>
          </div>
        </div>

      </main>

      {/* Language Selection Modal */}
      <AnimatePresence>
        {showLanguageModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 relative"
            >
              <button
                onClick={() => setShowLanguageModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Select Language / भाषा चुनें
                </h3>
                <p className="text-xs text-slate-600">
                  Which language are you comfortable using for check-in?
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handleChooseLanguage('hi')}
                  className="w-full p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-slate-900 font-bold text-sm text-left flex items-center justify-between transition-all group shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🇮🇳</span>
                    <div>
                      <p className="font-extrabold text-emerald-900">हिन्दी (Hindi)</p>
                      <p className="text-[11px] text-emerald-700">हिन्दी भाषा में चेक-इन जारी रखें</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-700 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => handleChooseLanguage('en')}
                  className="w-full p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-sm text-left flex items-center justify-between transition-all group shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🌐</span>
                    <div>
                      <p className="font-extrabold text-slate-900">English</p>
                      <p className="text-[11px] text-slate-500">Continue check-in in English</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-200 bg-white">
        SAHAY Portal — Mental Health Support System (Smart India Hackathon 2026)
      </footer>
    </div>
  );
};
