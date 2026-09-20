import React, { useState } from 'react';
import { Bell, AlertTriangle, X, AlertOctagon, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SOSAlert } from '../types';

interface Props {
  count: number;
  sosAlerts?: SOSAlert[];
  onSelectSosAlert?: (caseId: string) => void;
}

export const NotificationBell: React.FC<Props> = ({ count, sosAlerts = [], onSelectSosAlert }) => {
  const [isOpen, setIsOpen] = useState(false);
  const activeSos = sosAlerts.filter(a => a.status === 'ACTIVE');

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all focus:outline-none"
        aria-label="High Risk & SOS Emergency Alerts"
      >
        <Bell className={`w-4 h-4 ${count > 0 || activeSos.length > 0 ? 'text-rose-600 animate-bounce' : 'text-slate-500'}`} />
        {(count > 0 || activeSos.length > 0) && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-lg animate-pulse">
            {activeSos.length > 0 ? activeSos.length : count}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-2xl p-4 z-50 glass-panel space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Critical SOS & Priority Alerts</h4>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {activeSos.length > 0 ? (
                activeSos.map(sos => (
                  <div
                    key={sos.id}
                    onClick={() => {
                      setIsOpen(false);
                      if (onSelectSosAlert) onSelectSosAlert(sos.caseId);
                    }}
                    className="p-3 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div>
                      <p className="font-extrabold text-rose-900 flex items-center gap-1.5">
                        <AlertOctagon className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                        {sos.caseId} ({sos.patientAlias})
                      </p>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Location: {sos.district}, {sos.state} • Distress Score: <strong>{sos.distressScore}</strong>
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-rose-700 group-hover:translate-x-1 transition-transform" />
                  </div>
                ))
              ) : count > 0 ? (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs">
                  <p className="font-bold text-amber-900">🚨 {count} High-Risk Priority Case(s) Active</p>
                  <p className="text-slate-600 mt-1 text-[11px]">
                    Jurisdiction cases require clinical triage review.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-500 py-2 text-center">
                  No unaddressed emergency alerts in your assigned jurisdiction.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
