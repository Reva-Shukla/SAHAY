import React, { useEffect, useState } from 'react';
import { Edit3, FileText, Save } from 'lucide-react';
import type { CounsellorNote } from '../types';

interface Props { caseId: string; }
const storageKey = (caseId: string) => `sahay_counsellor_notes_${caseId}`;

export const CounsellorNotes: React.FC<Props> = ({ caseId }) => {
  const [notes, setNotes] = useState<CounsellorNote[]>([]);
  const [draft, setDraft] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  useEffect(() => { const stored = localStorage.getItem(storageKey(caseId)); setNotes(stored ? JSON.parse(stored) as CounsellorNote[] : []); setDraft(''); setEditingId(null); }, [caseId]);
  const persist = (next: CounsellorNote[]) => { setNotes(next); localStorage.setItem(storageKey(caseId), JSON.stringify(next)); };
  const save = () => { if (!draft.trim()) return; const now = new Date().toISOString(); const next = editingId ? notes.map((note) => note.id === editingId ? { ...note, text: draft.trim(), updatedAt: now } : note) : [{ id: `NOTE-${Date.now()}`, caseId, text: draft.trim(), createdAt: now }, ...notes]; persist(next); setDraft(''); setEditingId(null); };
  return <section className="p-5 sm:p-6 rounded-3xl bg-white/60 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-3">
    <div className="flex items-center gap-2"><FileText className="w-4 h-4 text-indigo-600" /><h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Counsellor Notes</h3><span className="text-[10px] text-slate-500">Stored locally until an API is connected</span></div>
    <textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Add a private session note..." className="w-full min-h-20 rounded-xl bg-white border border-slate-200 p-3 text-xs resize-y focus:outline-none focus:border-indigo-500" />
    <button type="button" onClick={save} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-bold text-white hover:bg-indigo-700"><Save className="w-3.5 h-3.5" />{editingId ? 'Save edit' : 'Save note'}</button>
    <div className="space-y-2">{notes.length === 0 ? <p className="text-xs text-slate-500">No previous notes for this case.</p> : notes.map((note) => <div key={note.id} className="rounded-xl border border-slate-200 bg-white/70 p-3"><div className="flex items-start justify-between gap-3"><p className="text-xs text-slate-700 whitespace-pre-wrap">{note.text}</p><button type="button" title="Edit note" onClick={() => { setDraft(note.text); setEditingId(note.id); }} className="text-indigo-600 hover:text-indigo-800"><Edit3 className="w-3.5 h-3.5" /></button></div><p className="mt-2 text-[10px] text-slate-500">{new Date(note.updatedAt || note.createdAt).toLocaleString()}</p></div>)}</div>
  </section>;
};
