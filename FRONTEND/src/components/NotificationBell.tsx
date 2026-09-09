import React, { useState } from 'react';
import { Bell, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const NotificationBell: React.FC<{ count: number }> = ({ count }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all focus:outline-none"
        aria-label="High Risk Alerts"
      >
        <Bell className={`w-4 h-4 ${count > 0 ? 'text-amber-600 animate-bounce' : 'text-slate-500'}`} />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-lg animate-pulse-red">
            {count}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white border border-slate-200 shadow-2xl p-4 z-50 glass-panel"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">High Risk Critical Alerts</h4>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-3">
              {count > 0 ? (
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs">
                    <p className="font-bold text-rose-900">🚨 {count} RED Priority Case(s) Active</p>
                    <p className="text-slate-600 mt-1 text-[11px]">
                      Cases in your jurisdiction require immediate clinical review or legal intervention dispatch.
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 py-2 text-center">
                  No unaddressed high-risk red cases in your assigned area.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
