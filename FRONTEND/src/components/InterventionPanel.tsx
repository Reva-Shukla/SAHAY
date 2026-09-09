import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, AlertOctagon, Scale, Home, DollarSign, Stethoscope, Check } from 'lucide-react';
import type { InterventionRecommendation, RiskLevel } from '../types';
import { useAuth } from '../auth/AuthContext';

interface Props {
  recommendations: InterventionRecommendation[];
  patientId: string;
  patientRisk: RiskLevel;
}

export const InterventionPanel: React.FC<Props> = ({ recommendations, patientId, patientRisk }) => {
  const { logAuditAction } = useAuth();
  const [triggeredActions, setTriggeredActions] = useState<Record<string, boolean>>({});

  const handleAction = (rec: InterventionRecommendation) => {
    setTriggeredActions(prev => ({ ...prev, [rec.id]: true }));
    logAuditAction(
      'INTERVENTION_TRIGGERED',
      `Counsellor dispatched action "${rec.title}" (Category: ${rec.category}, Urgency: ${rec.urgency}) for ${patientId}`,
      patientId,
      'SUCCESS'
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Counselling': return <Stethoscope className="w-4 h-4 text-cyan-600" />;
      case 'Legal Aid': return <Scale className="w-4 h-4 text-amber-600" />;
      case 'Relocation': return <Home className="w-4 h-4 text-emerald-600" />;
      case 'Financial Assistance': return <DollarSign className="w-4 h-4 text-purple-600" />;
      default: return <ShieldCheck className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertOctagon className={`w-5 h-5 ${patientRisk === 'RED' ? 'text-rose-600 animate-pulse' : patientRisk === 'AMBER' ? 'text-amber-600' : 'text-emerald-600'}`} />
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            AI Recommended Interventions
          </h3>
        </div>
        <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
          patientRisk === 'RED' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
          patientRisk === 'AMBER' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
          'bg-emerald-100 text-emerald-800 border border-emerald-200'
        }`}>
          {patientRisk} Priority Protocol
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {recommendations.map((rec) => {
          const isDone = triggeredActions[rec.id];

          return (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 shadow-xs transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    {getCategoryIcon(rec.category)}
                    {rec.category}
                  </span>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {rec.urgency}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 leading-snug">{rec.title}</h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{rec.description}</p>
              </div>

              <button
                type="button"
                onClick={() => handleAction(rec)}
                disabled={isDone}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  isDone
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800 cursor-default'
                    : patientRisk === 'RED'
                    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20'
                }`}
              >
                {isDone ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Intervention Dispatched & Logged</span>
                  </>
                ) : (
                  <span>{rec.actionLabel}</span>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
