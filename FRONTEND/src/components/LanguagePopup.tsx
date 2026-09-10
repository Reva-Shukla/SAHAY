import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe2 } from 'lucide-react';

export const LanguagePopup: React.FC = () => {
  const { hasSelectedLanguage, setLanguage, setHasSelectedLanguage } = useLanguage();

  if (hasSelectedLanguage) return null;

  const handleSelect = (lang: 'en' | 'hi') => {
    setLanguage(lang);
    setHasSelectedLanguage(true);
  };

  return (
    <AnimatePresence>
      {!hasSelectedLanguage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md glass-card-light rounded-2xl shadow-2xl overflow-hidden border border-white/40"
          >
            {/* Header Area */}
            <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 p-6 text-center border-b border-emerald-100/50">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Globe2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">
                Welcome to SAHAY / सहाय में आपका स्वागत है
              </h2>
              <p className="text-slate-600 text-sm">
                Choose your preferred language to continue <br/>
                आगे बढ़ने के लिए अपनी पसंदीदा भाषा चुनें
              </p>
            </div>

            {/* Options Area */}
            <div className="p-6 space-y-4">
              <button
                onClick={() => handleSelect('en')}
                className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-200 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center text-slate-600 group-hover:text-emerald-600 font-medium transition-colors">
                    A
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-slate-800 text-lg">English</div>
                    <div className="text-sm text-slate-500">Continue in English</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleSelect('hi')}
                className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-200 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center text-slate-600 group-hover:text-emerald-600 font-medium transition-colors text-xl">
                    अ
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-slate-800 text-lg">हिंदी</div>
                    <div className="text-sm text-slate-500">हिंदी में जारी रखें</div>
                  </div>
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
