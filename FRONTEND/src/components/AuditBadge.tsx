import React from 'react';
import { Lock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface Props {
  caseId: string;
}

export const AuditBadge: React.FC<Props> = ({ caseId }) => {
  const { language } = useLanguage();

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-2xl bg-white/70 backdrop-blur-xl border border-white text-xs text-slate-600 font-mono shadow-xs">
      <div className="flex items-center gap-2">
        <Lock className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
        <span>
          {language === 'hi' ? (
            <>सुरक्षा ऑडिट: <strong>{caseId}</strong> का अवलोकन आईटी अधिनियम की धारा 43A एवं सहाय निर्देशों के तहत दर्ज है।</>
          ) : (
            <>MoSJE Security Audit: Viewing of <strong>{caseId}</strong> logged under Section 43A IT Act & SAHAY Directives.</>
          )}
        </span>
      </div>
      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
        {language === 'hi' ? 'ट्रैक आईडी:' : 'Trace ID:'} AUD-2026-9041
      </span>
    </div>
  );
};
