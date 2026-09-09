import React from 'react';
import { Lock } from 'lucide-react';

interface Props {
  caseId: string;
}

export const AuditBadge: React.FC<Props> = ({ caseId }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 font-mono shadow-xs">
      <div className="flex items-center gap-2">
        <Lock className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
        <span>
          MoSJE Security Audit: Viewing of <strong>{caseId}</strong> logged under Section 43A IT Act & SAHAY Directives.
        </span>
      </div>
      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
        Trace ID: AUD-2026-9041
      </span>
    </div>
  );
};
