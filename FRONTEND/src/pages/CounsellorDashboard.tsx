import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Clock,
  TrendingUp,
  Activity,
  FileText,
  MapPin,
  RefreshCw,
  Play,
  Square,
  CalendarClock
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { fetchCasesByJurisdiction, fetchCaseRecommendations } from '../services/api';
import type { RiskLevel } from '../types';
import { Navbar } from '../components/Navbar';
import { DistressChart } from '../components/DistressChart';
import { InterventionPanel } from '../components/InterventionPanel';
import { AuditBadge } from '../components/AuditBadge';
import { SidebarSkeleton, ChartSkeleton } from '../components/LoadingSkeleton';
import { SessionHistory } from '../components/SessionHistory';
import { CounsellorNotes } from '../components/CounsellorNotes';
import { TeleManasPanel } from '../components/TeleManasPanel';
import { EscalationModal } from '../components/EscalationModal';
import { getSessionHistory } from '../data/counsellorSupport';

export const CounsellorDashboard: React.FC = () => {
  const { session, logAuditAction } = useAuth();
  
  // Selected Patient Case ID state
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [riskFilter, setRiskFilter] = useState<'ALL' | RiskLevel>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [isEscalationOpen, setIsEscalationOpen] = useState(false);
  const [notice, setNotice] = useState('');

  // Fetch jurisdiction-filtered patient cases via TanStack Query
  const {
    data: cases = [],
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['cases', session?.assignedState, session?.assignedDistrict],
    queryFn: () => fetchCasesByJurisdiction(session!.assignedState, session!.assignedDistrict),
    enabled: !!session
  });

  // Auto-select first case on initial load
  useEffect(() => {
    if (cases.length > 0 && !selectedCaseId) {
      setSelectedCaseId(cases[0].id);
    }
  }, [cases, selectedCaseId]);

  // Log view audit event when case selection changes
  useEffect(() => {
    if (selectedCaseId && session) {
      logAuditAction(
        'CASE_VIEWED',
        `Counsellor viewed detailed distress chart and medical history for ${selectedCaseId}`,
        selectedCaseId,
        'SUCCESS'
      );
    }
  }, [selectedCaseId, session]);

  // Selected case entity
  const selectedCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  useEffect(() => {
    if (!isSessionActive) return;
    const timer = window.setInterval(() => setSessionSeconds((seconds) => seconds + 1), 1000);
    return () => window.clearInterval(timer);
  }, [isSessionActive]);

  useEffect(() => {
    setIsSessionActive(false);
    setSessionSeconds(0);
  }, [selectedCaseId]);

  // Fetch interventions for selected case risk level
  const { data: recommendations = [] } = useQuery({
    queryKey: ['recommendations', selectedCase?.riskLevel],
    queryFn: () => fetchCaseRecommendations(selectedCase!.riskLevel),
    enabled: !!selectedCase
  });

  // High risk red cases count for header notification bell
  const highRiskCount = cases.filter((c) => c.riskLevel === 'RED').length;

  const formatDuration = (seconds: number) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
  const handleEndSession = () => {
    if (!window.confirm('End this active counselling session?')) return;
    setIsSessionActive(false);
    logAuditAction('SESSION_ENDED', `Counsellor ended active session for ${selectedCase?.id || 'unknown case'}`, selectedCase?.id);
    setNotice('Session ended and recorded locally for this demonstration.');
  };

  // Filtered case list based on search and risk filter tabs
  const filteredCases = cases.filter((c) => {
    const matchesRisk = riskFilter === 'ALL' || c.riskLevel === riskFilter;
    const matchesSearch =
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.patientAlias.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.primaryTriggers.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRisk && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6f7f4] via-[#fefae0] to-[#e8f0fe] text-slate-900 flex flex-col relative overflow-hidden">
      
      {/* Soft Ambient Blobs (No leaves) */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-200/30 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-200/30 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar highRiskCount={highRiskCount} />

        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ========================================================================= */}
        {/* LEFT SIDEBAR: Jurisdiction Patient List */}
        {/* ========================================================================= */}
        <aside className="lg:col-span-4 xl:col-span-4 flex flex-col space-y-4">
          
          {/* Jurisdiction Header Banner */}
          <div className="p-4 rounded-2xl bg-white/60 backdrop-blur-xl border border-white space-y-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Active Jurisdiction Filter
              </span>
              <button
                onClick={() => refetch()}
                className="text-slate-400 hover:text-slate-600 p-1 transition-colors"
                title="Refresh case data"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <h3 className="text-sm font-bold text-slate-900">
              Showing {cases.length} cases in <span className="text-emerald-700 font-extrabold">{session?.assignedDistrict}, {session?.assignedState}</span>
            </h3>
            
            <p className="text-[11px] text-slate-500 leading-tight">
              SAHAY monitoring data is filtered strictly by your assigned department jurisdiction.
            </p>
          </div>

          {/* Search & Risk Filters */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search case ID, alias, or triggers..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-xs"
              />
            </div>

            {/* Risk Category Tabs */}
            <div className="flex gap-1 bg-white/60 backdrop-blur-xl p-1 rounded-xl border border-white text-[11px] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              {(['ALL', 'RED', 'YELLOW', 'GREEN'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setRiskFilter(lvl)}
                  className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                    riskFilter === lvl
                      ? lvl === 'RED'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : lvl === 'YELLOW'
                        ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                        : lvl === 'GREEN'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Cases List */}
          <div className="flex-1 overflow-y-auto max-h-[calc(100vh-280px)] space-y-2.5 pr-1">
            {isLoading ? (
              <SidebarSkeleton />
            ) : isError ? (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs text-center font-medium">
                Failed to fetch jurisdiction cases. Click refresh to retry.
              </div>
            ) : filteredCases.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs rounded-2xl bg-white border border-slate-200">
                No matching cases found for {session?.assignedDistrict}, {session?.assignedState}.
              </div>
            ) : (
              filteredCases.map((c) => {
                const isSelected = selectedCaseId === c.id;
                const isRed = c.riskLevel === 'RED';

                return (
                  <motion.div
                    key={c.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedCaseId(c.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden shadow-xs ${
                      isSelected
                        ? 'bg-indigo-50/70 border-indigo-500 shadow-md ring-1 ring-indigo-500/20'
                        : 'bg-white/60 backdrop-blur-xl border-white hover:border-indigo-300'
                    } ${isRed ? 'animate-pulse-red' : ''}`}
                  >
                    {/* Left Priority Accent Stripe */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                        c.riskLevel === 'RED'
                          ? 'bg-rose-500'
                          : c.riskLevel === 'YELLOW'
                          ? 'bg-yellow-500'
                          : 'bg-emerald-500'
                      }`}
                    />

                    <div className="pl-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-xs text-slate-900">{c.id}</span>
                          <span className="text-[10px] text-slate-500 font-mono">({c.patientAlias})</span>
                        </div>
                        
                        {/* Risk Badge */}
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            c.riskLevel === 'RED'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : c.riskLevel === 'YELLOW'
                              ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {c.riskLevel}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-600">
                        <span>{c.age} yrs • {c.gender}</span>
                        <div className="flex items-center gap-1">
                          <Activity className="w-3 h-3 text-indigo-600" />
                          <span className={`font-bold ${c.currentScore >= 70 ? 'text-rose-600' : c.currentScore >= 40 ? 'text-yellow-600' : 'text-emerald-600'}`}>
                            Distress: {c.currentScore}
                          </span>
                        </div>
                      </div>

                      {/* Primary Trigger Tags */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {c.primaryTriggers.slice(0, 3).map((trig, idx) => (
                          <span key={idx} className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                            {trig}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

        </aside>

        {/* ========================================================================= */}
        {/* RIGHT MAIN PANEL: Patient Case Detail & Recharts Graph */}
        {/* ========================================================================= */}
        <section className="lg:col-span-8 xl:col-span-8 space-y-6">
          
          {!selectedCase ? (
            <div className="p-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
              Select a patient case from the sidebar to view full distress trajectory and AI recommendation metrics.
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCase.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                
                {/* Case Top Overview Header Card */}
                <div className="p-5 sm:p-6 rounded-3xl bg-white/60 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                          {selectedCase.id}
                        </h2>
                        <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-mono font-bold">
                          {selectedCase.patientAlias}
                        </span>
                        <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${
                          selectedCase.riskLevel === 'RED'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : selectedCase.riskLevel === 'YELLOW'
                            ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}>
                          {selectedCase.riskLevel} Priority Protocol
                        </span>
                      </div>
                      
                      <p className="text-xs text-slate-600 flex items-center gap-3 pt-1">
                        <span>Demographics: <strong>{selectedCase.age} yrs, {selectedCase.gender}</strong></span>
                        <span>•</span>
                        <span>Location: <strong>{selectedCase.district}, {selectedCase.state}</strong></span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-700">
                          <Clock className="w-3.5 h-3.5 text-indigo-600" />
                          Last Check-in: {selectedCase.lastCheckIn}
                        </span>
                      </p>
                    </div>

                    {/* Big Animated Current Score Widget */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center min-w-[130px] shadow-xs">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Current Distress Score
                      </span>
                      <motion.div
                        key={selectedCase.currentScore}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`text-3xl sm:text-4xl font-extrabold my-0.5 ${
                          selectedCase.currentScore >= 70
                            ? 'text-rose-600'
                            : selectedCase.currentScore >= 40
                            ? 'text-yellow-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {selectedCase.currentScore}
                      </motion.div>
                      <span className="text-[10px] font-semibold text-slate-500 flex items-center justify-center gap-1">
                        <TrendingUp className={`w-3 h-3 ${selectedCase.scoreTrend === 'rising' ? 'text-rose-600' : 'text-emerald-600'}`} />
                        {selectedCase.scoreTrend.toUpperCase()} ({selectedCase.previousScore} prev)
                      </span>
                    </div>

                  </div>

                  {/* Clinical Summary Block */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <p className="font-bold text-slate-800 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-indigo-600" />
                      SAHAY Clinical & AI Sentiment Assessment:
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                      {selectedCase.clinicalSummary}
                    </p>
                  </div>

                  {/* Patient context additions */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                    <div className="rounded-xl bg-white border border-slate-200 p-3"><span className="block text-slate-500">Preferred language</span><strong>{selectedCase.preferredLanguage || 'Hindi / English'}</strong></div>
                    <div className="rounded-xl bg-white border border-slate-200 p-3"><span className="block text-slate-500">Current mood</span><strong>{selectedCase.currentMood || selectedCase.distressHistory[selectedCase.distressHistory.length - 1]?.mood || 'Not recorded'}</strong></div>
                    <div className="rounded-xl bg-white border border-slate-200 p-3"><span className="block text-slate-500">Recent sessions</span><strong>{selectedCase.checkInCount}</strong></div>
                    <div className="rounded-xl bg-white border border-slate-200 p-3"><span className="block text-slate-500">Primary triggers</span><strong>{selectedCase.primaryTriggers.slice(0, 2).join(', ')}</strong></div>
                  </div>
                </div>

                {/* Current / upcoming session */}
                <div className="p-5 sm:p-6 rounded-3xl bg-white/60 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-3">
                  <div className="flex items-center gap-2"><CalendarClock className="w-4 h-4 text-indigo-600" /><h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Current / Upcoming Session</h3></div>
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs">
                    <div><strong className="block text-slate-900">Support check-in</strong><span className="text-slate-500">Today, 4:30 PM • {selectedCase.patientAlias}</span><span className="block text-emerald-700 font-semibold">Scheduled</span></div>
                    {isSessionActive ? <div className="flex items-center gap-2"><span className="font-mono font-bold text-indigo-700">{formatDuration(sessionSeconds)}</span><button type="button" onClick={handleEndSession} className="inline-flex items-center gap-1 rounded-xl bg-rose-600 px-3 py-2 text-[11px] font-bold text-white"><Square className="w-3 h-3" />End Session</button></div> : <button type="button" onClick={() => { setIsSessionActive(true); logAuditAction('SESSION_STARTED', `Counsellor started session for ${selectedCase.id}`, selectedCase.id); }} className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-3 py-2 text-[11px] font-bold text-white"><Play className="w-3 h-3" />Start Session</button>}
                  </div>
                  {notice && <p className="text-xs text-emerald-700">{notice}</p>}
                </div>

                {/* Distress History Recharts Graph */}
                <div className="p-5 sm:p-6 rounded-3xl bg-white/60 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <Activity className="w-4 h-4 text-indigo-600" />
                        Multi-Week Distress Trajectory & Forecast
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Solid line represents actual weekly check-in distress ratings. Dotted line represents AI predictive projection.
                      </p>
                    </div>
                  </div>

                  {isLoading ? (
                    <ChartSkeleton />
                  ) : (
                    <DistressChart history={selectedCase.distressHistory} />
                  )}
                </div>

                {/* AI Intervention Recommendations Panel */}
                <div className="p-5 sm:p-6 rounded-3xl bg-white/60 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <InterventionPanel
                    recommendations={recommendations}
                    patientId={selectedCase.id}
                    patientRisk={selectedCase.riskLevel}
                  />
                </div>

                <SessionHistory sessions={getSessionHistory(selectedCase)} />
                <CounsellorNotes caseId={selectedCase.id} />
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <TeleManasPanel onConnect={() => setNotice('Tele-MANAS connection is ready for backend integration and has not been initiated.')} />
                  {selectedCase.riskLevel === 'RED' && <div className="p-5 rounded-3xl bg-rose-50/80 border border-rose-200 space-y-3"><h3 className="text-xs font-bold uppercase tracking-wider text-rose-900">High-risk case</h3><p className="text-xs text-rose-800">This case is currently RED. Escalation requires a documented note and confirmation.</p><button type="button" onClick={() => setIsEscalationOpen(true)} className="rounded-xl bg-rose-600 px-3 py-2 text-xs font-bold text-white hover:bg-rose-700">Escalate Case</button></div>}
                </div>

                {/* Accountability Audit Badge */}
                <AuditBadge caseId={selectedCase.id} />
                <EscalationModal open={isEscalationOpen} caseId={selectedCase.id} riskLevel={selectedCase.riskLevel} onClose={() => setIsEscalationOpen(false)} onConfirm={(note) => { logAuditAction('CASE_ESCALATED', note, selectedCase.id, 'FLAGGED'); setIsEscalationOpen(false); setNotice('Escalation note recorded in the audit trail.'); }} />

              </motion.div>
            </AnimatePresence>
          )}

        </section>

      </main>
      </div>
    </div>
  );
};
