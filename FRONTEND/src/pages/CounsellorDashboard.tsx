import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Search, Activity, FileText, MapPin, RefreshCw,
  MessageSquare, Calendar as CalendarIcon, User,
  Mic, Send, LayoutDashboard, LogOut, Globe, HeartPulse, AlertTriangle, Camera, ExternalLink, Video, Target, Check, Plus, Trash2, Clock
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { useLanguage, getDynamicText } from '../context/LanguageContext';
import { fetchCasesByJurisdiction } from '../services/api';
import type { RiskLevel, ChatMessage, CounsellorMeeting, SharedMentalHealthReport, SharedGoal } from '../types';
import { DistressChart } from '../components/DistressChart';
import { AuditBadge } from '../components/AuditBadge';
import { SidebarSkeleton } from '../components/LoadingSkeleton';
import {
  INITIAL_MOCK_CHATS,
  INITIAL_MOCK_MEETINGS,
  INITIAL_MOCK_SHARED_REPORTS,
  INITIAL_MOCK_GOALS
} from '../data/sharedData';

export const CounsellorDashboard: React.FC = () => {
  const { session, counsellorsList, updateCounsellorProfile, logAuditAction, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  // Navigation tab state: 'CASES' | 'CHAT' | 'MEETINGS' | 'REPORTS' | 'PROFILE' | 'GOALS'
  const [activeTab, setActiveTab] = useState<'CASES' | 'CHAT' | 'MEETINGS' | 'REPORTS' | 'PROFILE' | 'GOALS'>('CASES');
  const [meetingsSubTab, setMeetingsSubTab] = useState<'PENDING' | 'UPCOMING' | 'MISSED'>('UPCOMING');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Selected Patient Case ID state
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [riskFilter, setRiskFilter] = useState<'ALL' | RiskLevel>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Local persistent state (using localStorage synchronization across patient and counsellor portals)
  const [chats, setChats] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem('sahay_chats');
    return saved ? JSON.parse(saved) : INITIAL_MOCK_CHATS;
  });

  const [meetings, setMeetings] = useState<CounsellorMeeting[]>(() => {
    const saved = localStorage.getItem('sahay_meetings');
    return saved ? JSON.parse(saved) : INITIAL_MOCK_MEETINGS;
  });

  const [sharedReports, setSharedReports] = useState<SharedMentalHealthReport[]>(() => {
    const saved = localStorage.getItem('sahay_shared_reports');
    return saved ? JSON.parse(saved) : INITIAL_MOCK_SHARED_REPORTS;
  });

  const [sharedGoals, setSharedGoals] = useState<SharedGoal[]>(() => {
    const saved = localStorage.getItem('sahay_shared_goals');
    return saved ? JSON.parse(saved) : INITIAL_MOCK_GOALS;
  });

  // Track high priority cases (e.g. triggered via Patient's "I Still Need Help")
  const [highPriorityCases] = useState<string[]>(() => {
    const saved = localStorage.getItem('sahay_high_priority_cases');
    return saved ? JSON.parse(saved) : ["Case #4821"];
  });

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem('sahay_chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem('sahay_meetings', JSON.stringify(meetings));
  }, [meetings]);

  useEffect(() => {
    localStorage.setItem('sahay_shared_reports', JSON.stringify(sharedReports));
  }, [sharedReports]);

  useEffect(() => {
    localStorage.setItem('sahay_shared_goals', JSON.stringify(sharedGoals));
  }, [sharedGoals]);

  // Storage listener for cross-tab auto-sync
  useEffect(() => {
    const handleStorage = () => {
      const savedChats = localStorage.getItem('sahay_chats');
      if (savedChats) setChats(JSON.parse(savedChats));
      const savedMeetings = localStorage.getItem('sahay_meetings');
      if (savedMeetings) setMeetings(JSON.parse(savedMeetings));
      const savedReports = localStorage.getItem('sahay_shared_reports');
      if (savedReports) setSharedReports(JSON.parse(savedReports));
      const savedGoals = localStorage.getItem('sahay_shared_goals');
      if (savedGoals) setSharedGoals(JSON.parse(savedGoals));
    };
    window.addEventListener('storage', handleStorage);
    const interval = setInterval(handleStorage, 2000);
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  // Fetch jurisdiction-filtered patient cases via TanStack Query
  const {
    data: cases = [],
    isLoading,
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

  const selectedCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  // Active Counsellor Profile details
  const currentCounsellor = counsellorsList.find(c => c.counsellorId === session?.counsellorId) || counsellorsList[0];

  // Filtered case list based on search and risk filter tabs
  const filteredCases = cases.filter((c) => {
    const matchesRisk = riskFilter === 'ALL' || c.riskLevel === riskFilter;
    const matchesSearch =
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.patientAlias.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.primaryTriggers.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRisk && matchesSearch;
  });

  // Helper to determine priority for a case (RED, YELLOW, GREEN)
  const getCasePriority = (caseObj: { id: string; riskLevel: RiskLevel }) => {
    const isUrgent = highPriorityCases.includes(caseObj.id) ||
      (chats[caseObj.id] && chats[caseObj.id].some(m => m.isHighPriority || m.text.includes("I Still Need Help") || m.text.includes("🚨")));
    
    if (caseObj.riskLevel === 'RED' || isUrgent) {
      return { level: 'RED', rank: 1, badgeClass: 'bg-rose-100 text-rose-800 border-rose-200', text: 'RED' };
    }
    if (caseObj.riskLevel === 'YELLOW') {
      return { level: 'YELLOW', rank: 2, badgeClass: 'bg-amber-100 text-amber-800 border-amber-200', text: 'YELLOW' };
    }
    return { level: 'GREEN', rank: 3, badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200', text: 'GREEN' };
  };

  // Sorted case list for Chat Inbox (RED first, then YELLOW, then GREEN)
  const sortedChatCases = [...cases].sort((a, b) => {
    const pA = getCasePriority(a).rank;
    const pB = getCasePriority(b).rank;
    return pA - pB;
  });

  // =========================================================================
  // 1. COUNSELLOR CHAT INBOX STATE & REAL-TIME MOCK DELIVERY
  // =========================================================================
  const [newMsgText, setNewMsgText] = useState('');
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);

  // Real-time simulated message arrival (WebSocket / Polling mock)
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.1 && selectedCaseId) {
        const timestamp = Date.now();
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const autoReply: ChatMessage = {
          id: `auto-${timestamp}`,
          caseId: selectedCaseId,
          text: "Automated check-in update logged from patient mobile node.",
          sender: "patient",
          time: timeStr,
          timestamp,
          type: "text"
        };
        setChats(prev => ({
          ...prev,
          [selectedCaseId]: [...(prev[selectedCaseId] || []), autoReply]
        }));
      }
    }, 25000);
    return () => clearInterval(interval);
  }, [selectedCaseId]);

  const handleSendMessage = () => {
    if (!newMsgText.trim() || !selectedCaseId) return;
    const timestamp = Date.now();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msg: ChatMessage = {
      id: `cns-${timestamp}`,
      caseId: selectedCaseId,
      text: newMsgText.trim(),
      sender: "counsellor",
      time: timeStr,
      timestamp,
      type: "text"
    };

    setChats(prev => ({
      ...prev,
      [selectedCaseId]: [...(prev[selectedCaseId] || []), msg]
    }));
    setNewMsgText('');
    logAuditAction('MESSAGE_SENT', `Counsellor sent text message to ${selectedCaseId}`, selectedCaseId);
  };

  const handleSendVoiceNote = () => {
    if (!selectedCaseId) return;
    setIsRecordingAudio(true);
    setTimeout(() => {
      setIsRecordingAudio(false);
      const timestamp = Date.now();
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const voiceMsg: ChatMessage = {
        id: `cns-v-${timestamp}`,
        caseId: selectedCaseId,
        text: "Clinical Voice Guidance Note",
        sender: "counsellor",
        time: timeStr,
        timestamp,
        type: "voice",
        durationSeconds: 14,
        audioUrl: ""
      };
      setChats(prev => ({
        ...prev,
        [selectedCaseId]: [...(prev[selectedCaseId] || []), voiceMsg]
      }));
      logAuditAction('VOICE_NOTE_SENT', `Counsellor sent voice note to ${selectedCaseId}`, selectedCaseId);
    }, 2000);
  };

  // =========================================================================
  // 2. MEETINGS & CALENDAR AUTO-MISSED TRANSITION LOGIC
  // =========================================================================
  useEffect(() => {
    const nowStr = new Date().toISOString().split('T')[0];
    setMeetings(prev => prev.map(m => {
      if (m.status === 'upcoming' && m.date < nowStr) {
        return { ...m, status: 'missed' };
      }
      return m;
    }));
  }, []);

  const upcomingMeetings = meetings.filter(m => m.status === 'upcoming');
  const missedMeetings = meetings.filter(m => m.status === 'missed');

  // Count missed meetings per case to flag repeat no-shows
  const getMissedCountForCase = (caseId: string) => {
    return meetings.filter(m => m.caseId === caseId && m.status === 'missed').length;
  };

  // =========================================================================
  // 3. SHARED PATIENT REPORTS PRIVATE NOTES STATE
  // =========================================================================
  const [reportNoteText, setReportNoteText] = useState<Record<string, string>>({});
  const [editingReportNotes, setEditingReportNotes] = useState<Record<string, boolean>>({});

  const handleSaveReportNote = (reportId: string) => {
    const note = reportNoteText[reportId];
    if (!note || !note.trim()) return;

    setSharedReports(prev => prev.map(r => r.id === reportId ? { ...r, counsellorNotes: note.trim() } : r));
    setEditingReportNotes(prev => ({ ...prev, [reportId]: false }));
    logAuditAction('REPORT_NOTE_ADDED', `Added private clinical note to shared report ${reportId}`);
  };

  const handleEditReportNote = (reportId: string, existingNote: string) => {
    setReportNoteText(prev => ({ ...prev, [reportId]: existingNote }));
    setEditingReportNotes(prev => ({ ...prev, [reportId]: true }));
  };

  // =========================================================================
  // 4. COUNSELLOR PATIENT GOALS MANAGEMENT STATE
  // =========================================================================
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDesc, setNewGoalDesc] = useState('');
  const [newGoalDueDate, setNewGoalDueDate] = useState('');

  const handleAssignGoalToPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;
    const targetCaseId = selectedCaseId || "Case #4821";
    const newGoal: SharedGoal = {
      id: `goal-${Date.now()}`,
      caseId: targetCaseId,
      title: newGoalTitle.trim(),
      description: newGoalDesc.trim(),
      assignedBy: 'counsellor',
      dueDate: newGoalDueDate.trim() || (language === 'hi' ? 'इस सप्ताह पूरा करें' : 'Complete this week'),
      completed: false,
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [newGoal, ...sharedGoals];
    setSharedGoals(updated);
    localStorage.setItem('sahay_shared_goals', JSON.stringify(updated));
    setNewGoalTitle('');
    setNewGoalDesc('');
    setNewGoalDueDate('');
    logAuditAction('GOAL_ASSIGNED', `Assigned new goal to ${targetCaseId}: ${newGoalTitle.trim()}`, targetCaseId);
  };

  const handleDeleteGoal = (goalId: string) => {
    const updated = sharedGoals.filter(g => g.id !== goalId);
    setSharedGoals(updated);
    localStorage.setItem('sahay_shared_goals', JSON.stringify(updated));
    logAuditAction('GOAL_DELETED', `Deleted goal ${goalId}`);
  };

  // =========================================================================
  // 4. COUNSELLOR PROFILE VIEW & EDIT MODE STATE
  // =========================================================================
  const [savedProfile, setSavedProfile] = useState(() => {
    const raw = localStorage.getItem('sahay_counsellor_profile');
    if (raw) {
      try { return JSON.parse(raw); } catch (e) { console.error(e); }
    }
    return null;
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(savedProfile?.name || currentCounsellor.name);
  const [profileDesignation, setProfileDesignation] = useState(savedProfile?.designation || currentCounsellor.designation);
  const [profileQualifications, setProfileQualifications] = useState(savedProfile?.qualifications || currentCounsellor.qualifications || 'M.Phil Clinical Psychology, NIMHANS');
  const [profileYears, setProfileYears] = useState(savedProfile?.yearsOfExperience || currentCounsellor.yearsOfExperience || 10);
  const [profileBio, setProfileBio] = useState(savedProfile?.bio || currentCounsellor.bio || 'Dedicated clinical psychologist specializing in trauma care and adolescent mental well-being.');
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>(savedProfile?.specializations || currentCounsellor.specializations || ["Trauma Counselling", "Crisis Intervention"]);
  const [profilePic, setProfilePic] = useState<string | null>(savedProfile?.photoUrl || currentCounsellor.avatar || null);
  const [photoError, setPhotoError] = useState('');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

  const AVAILABLE_SPECIALIZATIONS = [
    "Trauma Counselling", "Crisis Intervention", "Adolescent Psychology",
    "PTSD Therapy", "Anxiety & Panic Disorders", "Depression Support",
    "Victim Rehabilitation", "Addiction Counselling", "Family Support"
  ];

  const handleToggleSpec = (spec: string) => {
    if (selectedSpecs.includes(spec)) {
      setSelectedSpecs(selectedSpecs.filter(s => s !== spec));
    } else {
      setSelectedSpecs([...selectedSpecs, spec]);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError('');
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        setPhotoError(t.photoSizeError);
        return;
      }
      if (file.size > 2 * 1024 * 1024) { // 2 MB Limit
        setPhotoError(t.photoSizeError);
        return;
      }

      // BACKEND INTEGRATION POINT: uploadCounsellorAvatarEndpoint(file)
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setProfilePic(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedData = {
      name: profileName,
      designation: profileDesignation,
      qualifications: profileQualifications,
      yearsOfExperience: profileYears,
      bio: profileBio,
      specializations: selectedSpecs,
      photoUrl: profilePic
    };

    updateCounsellorProfile(updatedData);
    setSavedProfile(updatedData);
    localStorage.setItem('sahay_counsellor_profile', JSON.stringify(updatedData));
    setIsEditingProfile(false);
    setProfileSuccessMsg(t.profileUpdatedSuccess);
    setTimeout(() => setProfileSuccessMsg(''), 4000);
  };

  return (
    <div className="min-h-screen bg-[#f0fdf4] text-slate-900 flex font-sans overflow-hidden">
      
      {/* MOBILE OVERLAY TOGGLE BUTTON */}
      <div className="md:hidden fixed top-3 left-3 z-50">
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-2.5 rounded-xl bg-white shadow-md border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2"
        >
          <LayoutDashboard className="w-5 h-5 text-emerald-600" />
          <span>Menu</span>
        </button>
      </div>

      {/* LEFT SIDEBAR NAVIGATION (Reusing Patient Dashboard Sidebar Style & Width) */}
      <aside className={`
        fixed md:relative top-0 left-0 bottom-0 z-40 w-64 bg-indigo-50/40 backdrop-blur-xl border-r border-white text-slate-600 flex flex-col justify-between py-8 px-6 rounded-r-3xl my-2 shadow-[4px_0_24px_rgba(0,0,0,0.02)] shrink-0 transition-transform duration-300
        ${isMobileSidebarOpen ? 'translate-x-0 bg-white' : '-translate-x-full md:translate-x-0'}
      `}>
        <div>
          {/* Brand & Static Online Status */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-xl tracking-wide">
              <HeartPulse className="w-6 h-6 animate-pulse" />
              <span className="text-slate-800">SAHAY</span>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 text-emerald-700 text-[11px] font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{t.statusOnline}</span>
            </div>
          </div>
          
          {/* Main Navigation Items */}
          <nav className="space-y-2 text-sm font-medium">
            <button
              onClick={() => { setActiveTab('CASES'); setIsMobileSidebarOpen(false); }}
              className={`flex w-full items-center gap-3 py-3 px-4 rounded-xl transition-colors ${
                activeTab === 'CASES' ? 'bg-white shadow-sm text-emerald-700 border-l-4 border-emerald-500 font-bold' : 'hover:bg-white/60 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>{t.navCases}</span>
            </button>

            <button
              onClick={() => { setActiveTab('CHAT'); setIsMobileSidebarOpen(false); }}
              className={`flex w-full items-center gap-3 py-3 px-4 rounded-xl transition-colors ${
                activeTab === 'CHAT' ? 'bg-white shadow-sm text-emerald-700 border-l-4 border-emerald-500 font-bold' : 'hover:bg-white/60 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span>{t.navChat}</span>
            </button>

            <button
              onClick={() => { setActiveTab('MEETINGS'); setIsMobileSidebarOpen(false); }}
              className={`flex w-full items-center gap-3 py-3 px-4 rounded-xl transition-colors ${
                activeTab === 'MEETINGS' ? 'bg-white shadow-sm text-emerald-700 border-l-4 border-emerald-500 font-bold' : 'hover:bg-white/60 hover:text-slate-900'
              }`}
            >
              <CalendarIcon className="w-5 h-5" />
              <span>{t.navMeetings}</span>
            </button>

            <button
              onClick={() => { setActiveTab('REPORTS'); setIsMobileSidebarOpen(false); }}
              className={`flex w-full items-center gap-3 py-3 px-4 rounded-xl transition-colors ${
                activeTab === 'REPORTS' ? 'bg-white shadow-sm text-emerald-700 border-l-4 border-emerald-500 font-bold' : 'hover:bg-white/60 hover:text-slate-900'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>{t.navReports}</span>
            </button>

            <button
              onClick={() => { setActiveTab('GOALS'); setIsMobileSidebarOpen(false); }}
              className={`flex w-full items-center gap-3 py-3 px-4 rounded-xl transition-colors ${
                activeTab === 'GOALS' ? 'bg-white shadow-sm text-emerald-700 border-l-4 border-emerald-500 font-bold' : 'hover:bg-white/60 hover:text-slate-900'
              }`}
            >
              <Target className="w-5 h-5" />
              <span>{t.dashNavGoals}</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer: EN/Hindi Toggle, Profile & Logout */}
        <div className="space-y-3 text-sm font-medium">
          {/* Language Toggle Pills */}
          <div className="flex items-center gap-1 bg-white/70 backdrop-blur-md p-1 rounded-xl border border-white shadow-sm">
            <Globe className="w-4 h-4 text-slate-500 ml-1.5 mr-1" />
            <button
              onClick={() => setLanguage('en')}
              className={`flex-1 py-1 rounded-lg font-bold text-xs transition-all ${
                language === 'en' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`flex-1 py-1 rounded-lg font-bold text-xs transition-all ${
                language === 'hi' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              हिन्दी
            </button>
          </div>

          <button
            onClick={() => { setActiveTab('PROFILE'); setIsMobileSidebarOpen(false); }}
            className={`flex w-full items-center gap-3 py-3 px-4 rounded-xl transition-colors ${
              activeTab === 'PROFILE' ? 'bg-white shadow-sm text-emerald-700 border-l-4 border-emerald-500 font-bold' : 'hover:bg-white/60 hover:text-slate-900'
            }`}
          >
            <User className="w-5 h-5" />
            <span>{t.navProfile}</span>
          </button>

          <button
            onClick={logout}
            className="flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-white/60 hover:text-rose-600 transition-colors text-rose-500 w-full font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>{t.logoutBtn}</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col p-4 sm:p-8 h-screen overflow-y-auto bg-gradient-to-br from-[#f0fdf4] via-[#fefae0] to-[#e8f0fe]">
        
        {/* TAB 1: CASES SECTION (PATIENT JURISDICTION & TRAJECTORY + SCHEDULED MEETINGS + SHARED REPORTS LINKS) */}
        {activeTab === 'CASES' && (
          <div className="flex flex-col lg:flex-row gap-6 w-full max-w-[1600px] mx-auto">
            
            {/* Compact Secondary Case List Panel */}
            <aside className="w-full lg:w-80 shrink-0 flex flex-col space-y-4">
              <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-xl border border-white space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {t.jurisdictionLabel} {language === 'hi' ? 'फ़िल्टर' : 'Filter'}
                  </span>
                  <button onClick={() => refetch()} className="text-slate-400 hover:text-slate-600 p-1 transition-colors" title="Refresh cases">
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  {cases.length} {language === 'hi' ? 'मामले' : 'cases in'} <span className="text-emerald-700 font-extrabold">{session?.assignedDistrict}, {session?.assignedState}</span>
                </h3>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.dashSearchPlaceholder}
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 shadow-xs"
                  />
                </div>

                <div className="flex gap-1 bg-white/70 backdrop-blur-xl p-1 rounded-xl border border-white text-[11px] shadow-xs">
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
                      {lvl === 'ALL' ? (language === 'hi' ? 'सभी' : 'ALL') : lvl === 'RED' ? (language === 'hi' ? 'लाल' : 'RED') : lvl === 'YELLOW' ? (language === 'hi' ? 'पीला' : 'YELLOW') : (language === 'hi' ? 'हरा' : 'GREEN')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto max-h-[calc(100vh-280px)] space-y-2.5 pr-1">
                {isLoading ? (
                  <SidebarSkeleton />
                ) : filteredCases.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs rounded-2xl bg-white border border-slate-200">
                    {language === 'hi' ? 'कोई मेल खाता मामला नहीं मिला।' : 'No matching cases found.'}
                  </div>
                ) : (
                  filteredCases.map((c) => {
                    const isSelected = selectedCaseId === c.id;
                    const priority = getCasePriority(c);

                    return (
                      <div
                        key={c.id}
                        onClick={() => setSelectedCaseId(c.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden shadow-xs ${
                          isSelected
                            ? 'bg-indigo-50/70 border-indigo-500 shadow-md ring-1 ring-indigo-500/20'
                            : 'bg-white/70 backdrop-blur-xl border-white hover:border-indigo-300'
                        }`}
                      >
                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                          priority.level === 'RED' ? 'bg-rose-500' : priority.level === 'YELLOW' ? 'bg-yellow-500' : 'bg-emerald-500'
                        }`} />

                        <div className="pl-2 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-xs text-slate-900">{c.id}</span>
                              <span className="text-[10px] text-slate-500 font-mono">({c.patientAlias})</span>
                            </div>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${priority.badgeClass}`}>
                              {priority.text}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-slate-600">
                            <span>{c.age} {language === 'hi' ? 'वर्ष' : 'yrs'} • {c.gender === 'Female' ? (language === 'hi' ? 'महिला' : 'Female') : c.gender === 'Male' ? (language === 'hi' ? 'पुरुष' : 'Male') : c.gender}</span>
                            <div className="flex items-center gap-1">
                              <Activity className="w-3 h-3 text-indigo-600" />
                              <span className={`font-bold ${c.currentScore >= 70 ? 'text-rose-600' : c.currentScore >= 40 ? 'text-yellow-600' : 'text-emerald-600'}`}>
                                {language === 'hi' ? 'स्कोर:' : 'Score:'} {c.currentScore}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </aside>

            {/* Dominant Central Case Detail & Graph Section */}
            <section className="flex-1 min-w-0 space-y-6">
              {!selectedCase ? (
                <div className="p-12 text-center text-slate-500 bg-white/70 backdrop-blur-xl rounded-3xl border border-white">
                  {language === 'hi' ? 'संकट प्रक्षेपवक्र देखने के लिए एक रोगी केस चुनें।' : 'Select a patient case to view distress trajectory.'}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Case Trajectory & Distress Chart */}
                  <div className="p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white shadow-sm space-y-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{selectedCase.id}</h2>
                          <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-mono font-bold">{selectedCase.patientAlias}</span>
                          <span className={`text-xs px-3 py-1 rounded-full font-bold border ${getCasePriority(selectedCase).badgeClass}`}>
                            {getCasePriority(selectedCase).text}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 flex items-center gap-3 pt-2">
                          <span>{selectedCase.age} {language === 'hi' ? 'वर्ष' : 'yrs'}, {selectedCase.gender === 'Female' ? (language === 'hi' ? 'महिला' : 'Female') : selectedCase.gender === 'Male' ? (language === 'hi' ? 'पुरुष' : 'Male') : selectedCase.gender}</span>
                          <span>•</span>
                          <span>{selectedCase.district}, {selectedCase.state}</span>
                          <span>•</span>
                          <span>{language === 'hi' ? 'अंतिम चेक-इन:' : 'Last Check-in:'} {selectedCase.lastCheckIn}</span>
                        </p>
                      </div>
                    </div>

                    <DistressChart history={selectedCase.distressHistory} />
                    <AuditBadge caseId={selectedCase.id} />
                  </div>

                  {/* LINKED SCHEDULED MEETINGS SECTION */}
                  <div className="p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5 text-emerald-600" />
                        <h3 className="font-bold text-slate-800 text-base">{t.scheduledMeetingsTitle}</h3>
                      </div>
                      <span className="text-xs font-medium text-slate-500">{selectedCase.id}</span>
                    </div>

                    {(() => {
                      const patientMeetings = meetings.filter(m => m.caseId === selectedCase.id && m.status === 'upcoming');
                      if (patientMeetings.length === 0) {
                        return (
                          <div className="p-6 text-center text-slate-500 text-xs rounded-2xl bg-slate-50/50 border border-slate-100">
                            {t.noMeetingsScheduled}
                          </div>
                        );
                      }
                      return (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {patientMeetings.map(m => (
                            <div
                              key={m.id}
                              onClick={() => { setActiveTab('MEETINGS'); setMeetingsSubTab('UPCOMING'); }}
                              className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 cursor-pointer hover:shadow-md transition-all flex justify-between items-center group"
                            >
                              <div>
                                <h4 className="font-bold text-slate-800 text-sm">{getDynamicText(m.type, language)}</h4>
                                <p className="text-xs text-emerald-700 font-semibold mt-1 flex items-center gap-2">
                                  <span>📅 {m.date}</span>
                                  <span>⏰ {m.time}</span>
                                </p>
                              </div>
                              <ExternalLink className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>

                  {/* LINKED SHARED REPORTS SECTION */}
                  <div className="p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-indigo-600" />
                        <h3 className="font-bold text-slate-800 text-base">{t.sharedReportsTitle}</h3>
                      </div>
                      <span className="text-xs font-medium text-slate-500">{selectedCase.id}</span>
                    </div>

                    {(() => {
                      const patientReports = sharedReports.filter(r => r.caseId === selectedCase.id);
                      if (patientReports.length === 0) {
                        return (
                          <div className="p-6 text-center text-slate-500 text-xs rounded-2xl bg-slate-50/50 border border-slate-100">
                            {t.noReportsShared}
                          </div>
                        );
                      }
                      return (
                        <div className="space-y-3">
                          {patientReports.map(r => (
                            <div
                              key={r.id}
                              onClick={() => { setActiveTab('REPORTS'); setSelectedReportId(r.id); }}
                              className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 cursor-pointer hover:shadow-md transition-all flex items-center justify-between group"
                            >
                              <div>
                                <h4 className="font-bold text-slate-800 text-sm">{language === 'hi' ? 'मानसिक स्वास्थ्य प्रक्षेपवक्र रिपोर्ट' : 'Mental Health Trajectory Report'} ({r.dateRange})</h4>
                                <p className="text-xs text-indigo-700 font-medium mt-0.5">{language === 'hi' ? 'साझा करने की तारीख:' : 'Shared on'} {r.dateShared} • {language === 'hi' ? 'औसत मूड:' : 'Avg Mood:'} {r.averageMood}</p>
                              </div>
                              <ExternalLink className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
            </section>
          </div>
        )}

        {/* TAB 2: CHAT SECTION (WITH PRIORITY BADGES RED -> YELLOW -> GREEN & BILINGUAL LABELS) */}
        {activeTab === 'CHAT' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto w-full h-[calc(100vh-120px)]">
            
            {/* Chat Inbox List */}
            <aside className="lg:col-span-4 bg-white/70 backdrop-blur-xl rounded-3xl p-4 border border-white shadow-sm flex flex-col space-y-3 overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-indigo-600" />
                  {t.chatTitle}
                </h3>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">{sortedChatCases.length}</span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {sortedChatCases.map(c => {
                  const isSelected = selectedCaseId === c.id;
                  const caseMsgs = chats[c.id] || [];
                  const lastMsg = caseMsgs[caseMsgs.length - 1];
                  const priority = getCasePriority(c);

                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedCaseId(c.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                        isSelected ? 'bg-indigo-600 text-white shadow-md' : 'bg-white hover:bg-indigo-50/50 border-slate-100 text-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-extrabold text-sm">{c.id}</h4>
                          <p className={`text-xs ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>{c.patientAlias}</p>
                        </div>

                        {/* PRIORITY BADGE WITH COLOR + BILINGUAL TEXT LABEL */}
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase border ${
                          isSelected ? 'bg-white/20 text-white border-white/30' : priority.badgeClass
                        }`}>
                          {priority.text}
                        </span>
                      </div>

                      {lastMsg && (
                        <div className="mt-2 text-xs flex justify-between items-center opacity-90">
                          <p className="truncate max-w-[180px] font-medium">{getDynamicText(lastMsg.text, language)}</p>
                          <span className="text-[10px] font-mono opacity-80">{lastMsg.time}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </aside>

            {/* Active Conversation Main View */}
            <section className="lg:col-span-8 bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white shadow-sm flex flex-col justify-between overflow-hidden">
              {!selectedCase ? (
                <div className="flex-1 flex items-center justify-center text-slate-400 text-sm font-medium">
                  {language === 'hi' ? 'इनबॉक्स से एक रोगी बातचीत चुनें।' : 'Select a patient conversation from the inbox.'}
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4 shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm border border-indigo-200">
                        {selectedCase.id.slice(-2)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{selectedCase.id} ({selectedCase.patientAlias})</h3>
                        <p className="text-xs text-slate-500">{selectedCase.district}, {selectedCase.state} • {language === 'hi' ? 'एन्क्रिप्टेड सत्र' : 'Encrypted Session'}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-bold border ${getCasePriority(selectedCase).badgeClass}`}>
                      {getCasePriority(selectedCase).text}
                    </span>
                  </div>

                  {/* Messages Feed */}
                  <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-2">
                    {(chats[selectedCase.id] || []).map(msg => (
                      <div key={msg.id} className={`flex flex-col ${msg.sender === 'counsellor' ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[75%] p-3.5 rounded-2xl text-sm ${
                          msg.sender === 'counsellor' ? 'bg-indigo-600 text-white rounded-br-none shadow-sm' : 'bg-slate-100 text-slate-800 rounded-bl-none'
                        } ${msg.isHighPriority ? 'ring-2 ring-rose-500 bg-rose-50 text-rose-900 border border-rose-200' : ''}`}>
                          {getDynamicText(msg.text, language)}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono mt-1 px-1">{msg.time}</span>
                      </div>
                    ))}
                  </div>

                  {/* Input Controls */}
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleSendVoiceNote}
                      disabled={isRecordingAudio}
                      className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 transition-colors"
                      title={language === 'hi' ? 'वॉइस नोट भेजें' : 'Send Voice Note'}
                    >
                      <Mic className={`w-4 h-4 ${isRecordingAudio ? 'text-rose-600 animate-pulse' : ''}`} />
                    </button>
                    <input
                      type="text"
                      value={newMsgText}
                      onChange={(e) => setNewMsgText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder={t.typeMessagePlaceholder}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shrink-0 shadow-sm transition-colors"
                    >
                      <Send className="w-4 h-4 ml-0.5" />
                    </button>
                  </div>
                </>
              )}
            </section>
          </div>
        )}

        {/* TAB 3: MEETINGS SECTION (REDESIGNED TO MATCH PATIENT SCHEDULED PAGE) */}
        {activeTab === 'MEETINGS' && (
          <div className="max-w-5xl mx-auto w-full space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">{t.dashScheduledTitle}</h2>
                <p className="text-slate-500 text-sm mt-1">{t.dashScheduledSub}</p>
              </div>

              {/* Sub-tabs: Pending, Upcoming, Missed */}
              <div className="flex bg-white/70 backdrop-blur-xl p-1 rounded-2xl border border-white shadow-xs shrink-0">
                <button
                  onClick={() => setMeetingsSubTab('PENDING')}
                  className={`px-4 py-2 rounded-xl font-bold text-xs transition-all relative ${
                    meetingsSubTab === 'PENDING' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.pendingRequests} ({meetings.filter(m => m.status === 'pending').length})
                  {meetings.filter(m => m.status === 'pending').length > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full animate-ping" />
                  )}
                </button>
                <button
                  onClick={() => setMeetingsSubTab('UPCOMING')}
                  className={`px-5 py-2 rounded-xl font-bold text-xs transition-all ${
                    meetingsSubTab === 'UPCOMING' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.tabUpcoming} ({upcomingMeetings.length})
                </button>
                <button
                  onClick={() => setMeetingsSubTab('MISSED')}
                  className={`px-5 py-2 rounded-xl font-bold text-xs transition-all ${
                    meetingsSubTab === 'MISSED' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.tabMissed} ({missedMeetings.length})
                </button>
              </div>
            </div>

            {/* Meetings Cards Feed */}
            {meetingsSubTab === 'PENDING' ? (
              <div className="space-y-4">
                {meetings.filter(m => m.status === 'pending').length === 0 ? (
                  <div className="p-12 text-center text-slate-500 bg-white/70 backdrop-blur-xl rounded-3xl border border-white">
                    {t.noMeetingsFound}
                  </div>
                ) : (
                  meetings.filter(m => m.status === 'pending').map(m => (
                    <div key={m.id} className="p-6 bg-white/70 backdrop-blur-xl rounded-3xl border border-amber-200 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 text-base">{getDynamicText(m.type, language)}</span>
                          <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 border border-amber-200">{m.caseId}</span>
                          <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-rose-100 text-rose-800 border border-rose-200">{m.riskLevel}</span>
                        </div>
                        <p className="text-xs text-slate-600">{m.patientAlias} • {getDynamicText(m.notes || '', language)}</p>
                        <div className="flex items-center gap-3 text-xs font-bold text-amber-700 pt-1">
                          <span className="flex items-center gap-1">📅 {m.date}</span>
                          <span className="flex items-center gap-1">⏰ {m.time}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => {
                            const updated = meetings.map(item => item.id === m.id ? { ...item, status: 'upcoming' as const, meetUrl: item.meetUrl || 'https://meet.google.com/sah-aytm-mtg' } : item);
                            setMeetings(updated);
                            localStorage.setItem('sahay_meetings', JSON.stringify(updated));
                            logAuditAction('MEETING_ACCEPTED', `Accepted meeting request ${m.id}`, m.caseId);
                          }}
                          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" />
                          {t.acceptBtn}
                        </button>
                        <button
                          onClick={() => {
                            const updated = meetings.map(item => item.id === m.id ? { ...item, status: 'declined' as const } : item);
                            setMeetings(updated);
                            localStorage.setItem('sahay_meetings', JSON.stringify(updated));
                            logAuditAction('MEETING_DECLINED', `Declined meeting request ${m.id}`, m.caseId);
                          }}
                          className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-xl text-xs transition-colors"
                        >
                          {t.declineBtn}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : meetingsSubTab === 'UPCOMING' ? (
              <div className="space-y-4">
                {upcomingMeetings.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 bg-white/70 backdrop-blur-xl rounded-3xl border border-white">
                    {t.noMeetingsFound}
                  </div>
                ) : (
                  upcomingMeetings.map(m => (
                    <div key={m.id} className="p-6 bg-white/70 backdrop-blur-xl rounded-3xl border border-white shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:shadow-md transition-shadow">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 text-base">{getDynamicText(m.type, language)}</span>
                          <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">{m.caseId}</span>
                        </div>
                        <p className="text-xs text-slate-600">{m.patientAlias} • {getDynamicText(m.notes || '', language)}</p>
                        <div className="flex items-center gap-3 text-xs font-bold text-emerald-700 pt-1">
                          <span className="flex items-center gap-1">📅 {m.date}</span>
                          <span className="flex items-center gap-1">⏰ {m.time}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <a
                          href={m.meetUrl || "https://meet.google.com/sah-aytm-mtg"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center gap-1.5"
                        >
                          <Video className="w-4 h-4" />
                          {t.joinMeeting}
                        </a>
                        <button
                          onClick={() => { setSelectedCaseId(m.caseId); setActiveTab('CHAT'); }}
                          className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold rounded-xl text-xs transition-colors"
                        >
                          {t.openPatientChat}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {missedMeetings.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 bg-white/70 backdrop-blur-xl rounded-3xl border border-white">
                    {t.noMeetingsFound}
                  </div>
                ) : (
                  missedMeetings.map(m => {
                    const missedCount = getMissedCountForCase(m.caseId);
                    const isRepeatMiss = missedCount >= 2;

                    return (
                      <div key={m.id} className="p-6 bg-white/70 backdrop-blur-xl rounded-3xl border border-rose-100 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-900 text-base">{getDynamicText(m.type, language)}</span>
                            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700">{m.caseId}</span>
                            
                            {/* REPEAT MISS FLAG */}
                            {isRepeatMiss && (
                              <span className="text-xs px-3 py-0.5 rounded-full font-bold bg-rose-100 text-rose-800 border border-rose-300 animate-pulse flex items-center gap-1">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                {t.repeatMissFlag} ({missedCount})
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600">{m.patientAlias} • {getDynamicText(m.notes || '', language)}</p>
                          <div className="flex items-center gap-3 text-xs font-medium text-rose-700 pt-1">
                            <span>Missed Date: {m.date}</span>
                            <span>Time: {m.time}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => { setSelectedCaseId(m.caseId); setActiveTab('CHAT'); }}
                          className="px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-xl text-xs transition-colors shrink-0"
                        >
                          {t.followUpChat}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SHARED REPORTS SECTION */}
        {activeTab === 'REPORTS' && (
          <div className="max-w-5xl mx-auto w-full space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">{t.reportTitle}</h2>
              <p className="text-slate-500 text-sm mt-1">{t.reportSub}</p>
            </div>

            <div className="space-y-4">
              {sharedReports.map(r => {
                const isSelectedReport = selectedReportId === r.id;

                return (
                  <div key={r.id} className={`p-6 rounded-3xl border transition-all ${
                    isSelectedReport ? 'bg-white shadow-md border-indigo-400 ring-1 ring-indigo-400/20' : 'bg-white/70 backdrop-blur-xl border-white shadow-sm'
                  }`}>
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-slate-900 text-base">{r.caseId} ({r.patientAlias})</h3>
                          <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">{language === 'hi' ? 'साझा किया गया' : 'Shared'} {r.dateShared}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{language === 'hi' ? 'रिपोर्ट अवधि:' : 'Report Period:'} <strong>{r.dateRange}</strong></p>
                      </div>
                      <button
                        onClick={() => { setSelectedCaseId(r.caseId); setActiveTab('CASES'); }}
                        className="px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold rounded-xl text-xs hover:bg-indigo-100 transition-colors shrink-0"
                      >
                        {t.viewTrajectory}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                        <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">{language === 'hi' ? 'औसत मेट्रिक्स' : 'Average Metrics'}</span>
                        <p className="text-slate-700">{language === 'hi' ? 'मूड:' : 'Mood:'} <strong>{r.averageMood}</strong></p>
                        <p className="text-slate-700">{language === 'hi' ? 'नींद:' : 'Sleep:'} <strong>{r.averageSleep}</strong></p>
                      </div>
                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                        <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">{language === 'hi' ? 'शीर्ष ट्रिगर्स एवं गतिविधियां' : 'Top Triggers & Activities'}</span>
                        <p className="text-slate-700">{language === 'hi' ? 'ट्रिगर्स:' : 'Triggers:'} <strong>{r.topTriggers.join(', ')}</strong></p>
                        <p className="text-slate-700">{language === 'hi' ? 'गतिविधियां:' : 'Activities:'} <strong>{r.topActivities.join(', ')}</strong></p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                      <span className="text-xs font-bold text-slate-700">{language === 'hi' ? 'काउंसलर के व्यक्तिगत नैदानिक नोट्स:' : 'Counsellor Private Clinical Notes:'}</span>
                      {editingReportNotes[r.id] ? (
                        <div className="space-y-2">
                          <textarea
                            value={reportNoteText[r.id] ?? r.counsellorNotes}
                            onChange={(e) => setReportNoteText({ ...reportNoteText, [r.id]: e.target.value })}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSaveReportNote(r.id)}
                              className="px-4 py-1.5 bg-indigo-600 text-white font-bold text-xs rounded-lg shadow-xs"
                            >
                              {language === 'hi' ? 'नोट सहेजें' : 'Save Note'}
                            </button>
                            <button
                              onClick={() => setEditingReportNotes({ ...editingReportNotes, [r.id]: false })}
                              className="px-4 py-1.5 bg-slate-100 text-slate-600 font-bold text-xs rounded-lg"
                            >
                              {t.cancelEditBtn}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between bg-indigo-50/50 p-3.5 rounded-2xl border border-indigo-100 text-xs text-indigo-900">
                          <p className="whitespace-pre-wrap">{r.counsellorNotes || (language === 'hi' ? 'अभी तक कोई नोट नहीं जोड़ा गया।' : 'No notes added yet.')}</p>
                          <button
                            onClick={() => handleEditReportNote(r.id, r.counsellorNotes || '')}
                            className="text-indigo-600 font-bold hover:underline shrink-0 ml-4"
                          >
                            {language === 'hi' ? 'नोट संपादित करें' : 'Edit Note'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: COUNSELLOR PROFILE VIEW & EDIT MODE + PHOTO CHANGE */}
        {activeTab === 'PROFILE' && (
          <div className="max-w-4xl mx-auto w-full space-y-6">
            
            {/* Success Toast Banner */}
            {profileSuccessMsg && (
              <div className="p-4 rounded-2xl bg-emerald-500 text-white font-bold text-sm shadow-md flex items-center justify-between">
                <span>✓ {profileSuccessMsg}</span>
                <button onClick={() => setProfileSuccessMsg('')} className="text-white text-xs opacity-80 hover:opacity-100">Dismiss</button>
              </div>
            )}

            {/* Profile Card Header */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white shadow-sm space-y-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100">
                <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                  
                  {/* Avatar with Overlay Photo Change Picker */}
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-indigo-100 border-4 border-indigo-50 shadow-sm flex items-center justify-center text-indigo-700 font-bold text-3xl overflow-hidden shrink-0">
                      {profilePic ? (
                        <img src={profilePic} alt={profileName} className="w-full h-full object-cover" />
                      ) : (
                        <span>{profileName.split(' ').map((n: string) => n[0]).join('')}</span>
                      )}
                    </div>

                    <label className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white cursor-pointer shadow-sm hover:bg-indigo-700 transition-colors border-2 border-white" title={t.changePhotoBtn}>
                      <Camera className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div>
                    <h3 className="text-2xl font-extrabold text-slate-900">{profileName}</h3>
                    <p className="text-emerald-700 font-bold text-sm">{profileDesignation}</p>
                    <p className="text-slate-500 text-xs mt-1 font-mono">{session?.counsellorId} • {session?.assignedDistrict}, {session?.assignedState}</p>
                  </div>
                </div>

                {/* Edit Profile Button at Top Right */}
                {!isEditingProfile ? (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-sm transition-colors shrink-0"
                  >
                    {t.editProfileBtn}
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsEditingProfile(false)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                    >
                      {t.cancelEditBtn}
                    </button>
                  </div>
                )}
              </div>

              {photoError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-bold">
                  ⚠️ {photoError}
                </div>
              )}

              {/* READ-ONLY VIEW MODE */}
              {!isEditingProfile ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{t.qualificationsLabel}</h4>
                      <p className="font-bold text-slate-800 text-sm">{profileQualifications}</p>
                      <p className="text-xs text-slate-500 mt-1">{profileYears} {language === 'hi' ? 'वर्षों का नैदानिक अनुभव' : 'Years Clinical Experience'}</p>
                    </div>

                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{language === 'hi' ? 'आधिकारिक अधिकार क्षेत्र' : 'Official Jurisdiction'}</h4>
                      <p className="font-bold text-slate-800 text-sm">{session?.assignedDistrict}, {session?.assignedState}</p>
                      <p className="text-xs text-emerald-600 font-bold mt-1">{language === 'hi' ? 'सहाय टेली-मानस अधिकृत नोड' : 'SAHAY Tele-MANAS Authorized Node'}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.specializationsLabel}</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedSpecs.map(s => (
                        <span key={s} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full font-bold text-xs border border-indigo-100">
                          {getDynamicText(s, language)}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.bioLabel}</h4>
                    <p className="text-slate-700 text-sm leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      {getDynamicText(profileBio, language)}
                    </p>
                  </div>
                </div>
              ) : (
                /* EDIT FORM MODE */
                <form onSubmit={handleSaveProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">{language === 'hi' ? 'पूरा नाम' : 'Full Name'}</label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">{language === 'hi' ? 'पदनाम' : 'Designation'}</label>
                      <input
                        type="text"
                        value={profileDesignation}
                        onChange={(e) => setProfileDesignation(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">{t.qualificationsLabel}</label>
                      <input
                        type="text"
                        value={profileQualifications}
                        onChange={(e) => setProfileQualifications(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">{language === 'hi' ? 'अनुभव के वर्ष' : 'Years of Experience'}</label>
                      <input
                        type="number"
                        value={profileYears}
                        onChange={(e) => setProfileYears(parseInt(e.target.value) || 0)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">{t.specializationsLabel}</label>
                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_SPECIALIZATIONS.map(spec => {
                        const isSelected = selectedSpecs.includes(spec);
                        return (
                          <button
                            type="button"
                            key={spec}
                            onClick={() => handleToggleSpec(spec)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                              isSelected ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            {isSelected ? '✓ ' : '+ '}{getDynamicText(spec, language)}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{t.bioLabel}</label>
                    <textarea
                      value={profileBio}
                      onChange={(e) => setProfileBio(e.target.value)}
                      rows={4}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                    >
                      {t.cancelEditBtn}
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-sm transition-colors"
                    >
                      {t.saveProfileBtn}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 6. GOALS MANAGEMENT VIEW */}
        {/* ========================================================================= */}
        {activeTab === 'GOALS' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <Target className="w-6 h-6 text-emerald-600" />
                  {language === 'hi' ? 'रोगी लक्ष्य प्रबंधन' : 'Patient Goals Management'}
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  {language === 'hi'
                    ? 'रोगियों के लिए लक्ष्य निर्दिष्ट करें और उनकी प्रगति की वास्तविक समय में निगरानी करें।'
                    : 'Assign therapy goals to patients and monitor their completion progress in real-time.'}
                </p>
              </div>

              {/* Patient Case Selector */}
              <div className="flex items-center gap-2 bg-white/70 backdrop-blur-xl p-2 rounded-2xl border border-white shadow-xs">
                <User className="w-4 h-4 text-slate-500 ml-1" />
                <select
                  value={selectedCaseId || ''}
                  onChange={(e) => setSelectedCaseId(e.target.value)}
                  className="bg-transparent text-sm font-bold text-slate-800 focus:outline-none cursor-pointer pr-2"
                >
                  {cases.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.id} — {c.patientAlias}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Form to Assign New Goal */}
              <div className="lg:col-span-1 bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Plus className="w-4 h-4 text-emerald-600" />
                  {t.assignGoalBtn}
                </h3>
                <form onSubmit={handleAssignGoalToPatient} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{t.goalTitleLabel} *</label>
                    <input
                      type="text"
                      value={newGoalTitle}
                      onChange={(e) => setNewGoalTitle(e.target.value)}
                      placeholder={language === 'hi' ? 'उदा. 4-7-8 श्वास अभ्यास' : 'e.g. Practice 4-7-8 breathing'}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{t.goalDescLabel}</label>
                    <textarea
                      value={newGoalDesc}
                      onChange={(e) => setNewGoalDesc(e.target.value)}
                      placeholder={language === 'hi' ? 'निर्देश या मार्गदर्शन...' : 'Instructions or guidance...'}
                      rows={3}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{t.dueDateLabel}</label>
                    <input
                      type="text"
                      value={newGoalDueDate}
                      onChange={(e) => setNewGoalDueDate(e.target.value)}
                      placeholder={language === 'hi' ? 'उदा. 22 सितंबर तक' : 'e.g. Complete before Sept 22'}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm shadow-sm transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    {t.assignGoalBtn}
                  </button>
                </form>
              </div>

              {/* Goals Feed: Doctor Assigned vs Self Goals */}
              <div className="lg:col-span-2 space-y-6">
                {/* Doctor Assigned Goals */}
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-bold text-slate-900 text-base">{t.doctorAssignedGoals} ({selectedCaseId || 'Case #4821'})</h3>
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                      {sharedGoals.filter(g => (g.caseId === selectedCaseId || !g.caseId) && g.assignedBy === 'counsellor' && g.completed).length} / {sharedGoals.filter(g => (g.caseId === selectedCaseId || !g.caseId) && g.assignedBy === 'counsellor').length} {t.completedLabel}
                    </span>
                  </div>

                  {sharedGoals.filter(g => (g.caseId === selectedCaseId || (!selectedCaseId && g.caseId === 'Case #4821')) && g.assignedBy === 'counsellor').length === 0 ? (
                    <p className="text-slate-500 text-sm py-4 italic">No goals assigned to this patient yet.</p>
                  ) : (
                    sharedGoals.filter(g => (g.caseId === selectedCaseId || (!selectedCaseId && g.caseId === 'Case #4821')) && g.assignedBy === 'counsellor').map(goal => (
                      <div key={goal.id} className="p-4 bg-white rounded-2xl border border-indigo-100 flex items-start justify-between gap-4 shadow-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className={`font-bold text-sm ${goal.completed ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{goal.title}</h4>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              goal.completed ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              {goal.completed ? `✓ ${t.completedLabel}` : `⏳ ${t.inProgressLabel}`}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600">{goal.description}</p>
                          {goal.dueDate && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 mt-1">
                              <Clock className="w-3 h-3" /> {t.dueDateLabel}: {goal.dueDate}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteGoal(goal.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                          title="Remove Goal"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Patient Self Goals */}
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-bold text-slate-900 text-base">{t.selfGoals} ({selectedCaseId || 'Case #4821'})</h3>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                      {sharedGoals.filter(g => (g.caseId === selectedCaseId || !g.caseId) && g.assignedBy === 'patient' && g.completed).length} / {sharedGoals.filter(g => (g.caseId === selectedCaseId || !g.caseId) && g.assignedBy === 'patient').length} {t.completedLabel}
                    </span>
                  </div>

                  {sharedGoals.filter(g => (g.caseId === selectedCaseId || (!selectedCaseId && g.caseId === 'Case #4821')) && g.assignedBy === 'patient').length === 0 ? (
                    <p className="text-slate-500 text-sm py-4 italic">Patient has not added any self goals yet.</p>
                  ) : (
                    sharedGoals.filter(g => (g.caseId === selectedCaseId || (!selectedCaseId && g.caseId === 'Case #4821')) && g.assignedBy === 'patient').map(goal => (
                      <div key={goal.id} className="p-4 bg-white rounded-2xl border border-emerald-100 flex items-start justify-between gap-4 shadow-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className={`font-bold text-sm ${goal.completed ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{goal.title}</h4>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              goal.completed ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              {goal.completed ? `✓ ${t.completedLabel}` : `⏳ ${t.inProgressLabel}`}
                            </span>
                          </div>
                          {goal.description && <p className="text-xs text-slate-600">{goal.description}</p>}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default CounsellorDashboard;
