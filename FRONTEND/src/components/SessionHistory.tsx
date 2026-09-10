import React, { useState } from 'react';
import { ChevronDown, History } from 'lucide-react';
import type { CounsellingSessionRecord } from '../types';

interface Props { sessions: CounsellingSessionRecord[]; }

export const SessionHistory: React.FC<Props> = ({ sessions }) => {
  const [openId, setOpenId] = useState<string | null>(null);
  return <section className="p-5 sm:p-6 rounded-3xl bg-white/60 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-3">
    <div className="flex items-center gap-2"><History className="w-4 h-4 text-indigo-600" /><h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Session History</h3><span className="text-[10px] text-slate-500">Temporary local records</span></div>
    <div className="space-y-2">{sessions.map((session) => <div key={session.id} className="rounded-xl border border-slate-200 bg-white/70 overflow-hidden">
      <button type="button" onClick={() => setOpenId(openId === session.id ? null : session.id)} className="w-full p-3 text-left flex items-center justify-between gap-3 hover:bg-slate-50">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 flex-1 text-[11px]"><span><strong className="block text-slate-500">Date</strong>{session.date}</span><span><strong className="block text-slate-500">Type</strong>{session.sessionType}</span><span><strong className="block text-slate-500">Duration</strong>{session.duration}</span><span><strong className="block text-slate-500">Status</strong>{session.status}</span><span><strong className="block text-slate-500">Follow-up</strong>{session.followUpStatus}</span></div><ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${openId === session.id ? 'rotate-180' : ''}`} /></button>
      {openId === session.id && <div className="px-3 pb-3 text-xs text-slate-600 border-t border-slate-100 pt-3 space-y-1"><p><strong>Concern:</strong> {session.topic}</p><p><strong>Notes summary:</strong> {session.notesSummary}</p><p><strong>Details:</strong> {session.details}</p></div>}
    </div>)}</div>
  </section>;
};
