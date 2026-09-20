import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Calendar as CalendarIcon, Target, Users, 
  MessageSquare, LogOut, ChevronRight,
  Clock, Play, HeartPulse, Search, Check, TrendingUp, Moon, Zap, Smile, X, Activity, Globe, Video, User, Wind
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { CheckInCalendar, getMoodEmoji } from '../components/CheckInCalendar';
import type { PastCheckIn } from '../components/CheckInCalendar';
import type { MoodType } from '../components/MoodSelector';
import { useLanguage } from '../context/LanguageContext';
import { CounsellorTab } from '../components/CounsellorTab';
import { SupportTab } from '../components/SupportTab';
import { YogaSection } from '../components/YogaSection';
import { INITIAL_MOCK_GOALS, INITIAL_MOCK_MEETINGS } from '../data/sharedData';
import type { SharedGoal, CounsellorMeeting } from '../types';

const mockMoodData = [
  { date: '8', mood: 2, label: 'Normal', sleep: '6h', energy: 'Medium' },
  { date: '9', mood: 4, label: 'Amazing', sleep: '8h', energy: 'High' },
  { date: '10', mood: 3, label: 'Great', sleep: '7h', energy: 'High' },
  { date: '11', mood: 2, label: 'Normal', sleep: '6h', energy: 'Medium' },
  { date: '12', mood: 2, label: 'Normal', sleep: '7h', energy: 'Medium' },
  { date: '13', mood: 1, label: 'Bad', sleep: '4h', energy: 'Low' },
  { date: '14', mood: 3, label: 'Great', sleep: '8h', energy: 'High' },
];

const moodLabels = ['Terrible', 'Bad', 'Normal', 'Great', 'Amazing'];



const CustomMoodTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xl text-sm space-y-2 z-50 min-w-[150px]">
        <p className="font-bold text-slate-800 border-b border-slate-100 pb-2">Sep {data.date}</p>
        <div className="flex justify-between items-center gap-4">
          <span className="text-slate-500 font-medium flex items-center gap-1.5"><Smile className="w-4 h-4 text-emerald-500" /> Mood</span>
          <span className="font-extrabold text-slate-900">{data.label}</span>
        </div>
        <div className="flex justify-between items-center gap-4">
          <span className="text-slate-500 font-medium flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-500" /> Energy</span>
          <span className="font-extrabold text-slate-900">{data.energy}</span>
        </div>
        <div className="flex justify-between items-center gap-4">
          <span className="text-slate-500 font-medium flex items-center gap-1.5"><Moon className="w-4 h-4 text-indigo-500" /> Sleep</span>
          <span className="font-extrabold text-slate-900">{data.sleep}</span>
        </div>
      </div>
    );
  }
  return null;
};

export const PatientDashboard: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  
  const patientPhone = localStorage.getItem('sahay_active_user_phone') || localStorage.getItem('sahay_patient_phone') || '+91 00000 00000';
  
  const [patientName] = useState(() => {
    return localStorage.getItem('sahay_patient_name') || 'Dianne Russell';
  });
  
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase() || 'U';
  };

  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'CALENDAR' | 'INSIGHTS' | 'SCHEDULED' | 'GOALS' | 'COUNSELLOR' | 'PROFILE' | 'SUPPORT' | 'YOGA'>('DASHBOARD');

  // Load User Data
  const loadUserData = () => {
    const raw = localStorage.getItem(`sahay_data_${patientPhone}`);
    if (raw) return JSON.parse(raw);
    return null;
  };
  const initialData = loadUserData();

  // Profile Picture State
  const [profilePic, setProfilePic] = useState<string | null>(initialData?.profilePic || null);

  const handlePicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        
        // Compress the image so it fits within localStorage limits comfortably
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 300;
          const MAX_HEIGHT = 300;
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions keeping aspect ratio
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            // Compress to JPEG with 0.7 quality
            const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
            setProfilePic(dataUrl);
          } else {
            // Fallback to original if canvas fails
            setProfilePic(result);
          }
        };
        img.src = result;
      };
      reader.readAsDataURL(file);
    }
  };

  // Dynamic Shared Goals State (Synced across Patient and Counsellor)
  const [sharedGoals, setSharedGoals] = useState<SharedGoal[]>(() => {
    const saved = localStorage.getItem('sahay_shared_goals');
    return saved ? JSON.parse(saved) : INITIAL_MOCK_GOALS;
  });

  const [goalsSubTab, setGoalsSubTab] = useState<'DOCTOR_ASSIGNED' | 'SELF_GOALS'>('DOCTOR_ASSIGNED');

  // Dynamic Shared Meetings State (Synced across Patient and Counsellor)
  const [sharedMeetings, setSharedMeetings] = useState<CounsellorMeeting[]>(() => {
    const saved = localStorage.getItem('sahay_meetings');
    return saved ? JSON.parse(saved) : INITIAL_MOCK_MEETINGS;
  });

  // Storage listener & auto-sync across tabs/roles
  useEffect(() => {
    const handleStorage = () => {
      const savedGoals = localStorage.getItem('sahay_shared_goals');
      if (savedGoals) setSharedGoals(JSON.parse(savedGoals));
      const savedMeetings = localStorage.getItem('sahay_meetings');
      if (savedMeetings) setSharedMeetings(JSON.parse(savedMeetings));
    };
    window.addEventListener('storage', handleStorage);
    const interval = setInterval(handleStorage, 2000);
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  const saveSharedGoals = (updated: SharedGoal[]) => {
    setSharedGoals(updated);
    localStorage.setItem('sahay_shared_goals', JSON.stringify(updated));
  };

  const saveSharedMeetings = (updated: CounsellorMeeting[]) => {
    setSharedMeetings(updated);
    localStorage.setItem('sahay_meetings', JSON.stringify(updated));
  };

  const getTodayCheckIn = (): PastCheckIn => {
    const todayStr = new Date().toISOString().split('T')[0];
    const phone = localStorage.getItem('sahay_patient_phone') || localStorage.getItem('sahay_active_user_phone');
    if (phone) {
      const histStr = localStorage.getItem(`sahay_history_${phone}`);
      if (histStr) {
        try {
          const hist: PastCheckIn[] = JSON.parse(histStr);
          const todayEntry = hist.find(h => h.date === todayStr);
          if (todayEntry) return todayEntry;
        } catch (e) {}
      }
    }

    const savedLast = localStorage.getItem('sahay_last_mood');
    const savedJournal = localStorage.getItem('sahay_last_journal');
    const savedEnergy = localStorage.getItem('sahay_last_energy');
    const savedStress = localStorage.getItem('sahay_last_stress');
    const savedSleep = localStorage.getItem('sahay_last_sleep');
    const hasVoice = localStorage.getItem('sahay_has_voice_note') === 'true';
    
    const moodNum = savedLast ? parseInt(savedLast) : 3;
    const moodLabelsList: MoodType[] = ['Very Low', 'Low', 'Neutral', 'Good', 'Great'];
    const category = moodLabelsList[moodNum] || 'Neutral';

    return {
      date: todayStr,
      mood: category,
      journal: savedJournal !== null ? savedJournal : (language === 'hi' ? 'दैनिक चेक-इन प्रविष्टि दर्ज की गई।' : 'Daily check-in logged.'),
      energy: savedEnergy ? parseInt(savedEnergy) : 7,
      stress: savedStress ? parseInt(savedStress) : 4,
      sleep: savedSleep || '7h 30m',
      hasVoiceNote: hasVoice
    };
  };

  const [selectedPastDay, setSelectedPastDay] = useState<PastCheckIn | null>(getTodayCheckIn());

  // Daily Goals State
  const [isReadingDone] = useState(initialData?.isReadingDone || false);
  const [isYogaDone] = useState(initialData?.isYogaDone || false);

  // Appointments State
  const [appointments, setAppointments] = useState<{ upcoming: any[], past: any[] }>(initialData?.appointments || {
    upcoming: [
      { id: 1, date: '2026-09-22', time: '10:00 AM', counsellor: 'Dr. Rajesh Sharma', type: 'Video Session' },
      { id: 3, date: '2026-09-17', time: '11:00 AM', counsellor: 'Dr. Rajesh Sharma', type: 'Clinic Visit' }
    ],
    past: [
      { id: 2, date: '2026-09-15', time: '2:00 PM', counsellor: 'Dr. Rajesh Sharma', status: 'Completed' }
    ]
  });

  const [checklist] = useState(initialData?.checklist || [
    { id: 1, text: 'Drink 2L Water', done: false },
    { id: 2, text: 'Take prescribed medication', done: false },
    { id: 3, text: '30 min walk', done: false },
    { id: 4, text: 'Write in journal', done: false }
  ]);

  // Persist User Data
  useEffect(() => {
    const dataToSave = {
      profilePic,
      isReadingDone,
      isYogaDone,
      appointments,
      checklist
    };
    try {
      localStorage.setItem(`sahay_data_${patientPhone}`, JSON.stringify(dataToSave));
    } catch (error) {
      console.error("Storage limit exceeded, likely due to a large profile picture.", error);
      try {
        const fallbackData = { ...dataToSave, profilePic: null };
        localStorage.setItem(`sahay_data_${patientPhone}`, JSON.stringify(fallbackData));
        alert(language === 'hi' ? 'प्रोफ़ाइल फ़ोटो बहुत बड़ी है और सहेजी नहीं जा सकी।' : 'The selected image is too large and could not be saved.');
        setProfilePic(null);
      } catch (fallbackError) {
        console.error("Failed to save even without profilePic", fallbackError);
      }
    }
  }, [profilePic, isReadingDone, isYogaDone, appointments, checklist, patientPhone, language]);

  const [showScheduleNew, setShowScheduleNew] = useState(false);
  const [newAptDate, setNewAptDate] = useState('');
  const [newAptTime, setNewAptTime] = useState('');
  const PRE_SET_SLOTS = ["09:00 AM", "10:00 AM", "11:30 AM", "02:00 PM", "04:00 PM"];
  const OCCUPIED_SLOTS = ["10:00 AM", "02:00 PM"];

  // Patient Meeting Request Creation Flow
  const confirmNewAppointment = () => {
    if (!newAptDate || !newAptTime) return;

    const newMeetingRequest: CounsellorMeeting = {
      id: `MTG-${Date.now()}`,
      caseId: "Case #4821",
      patientAlias: "Victim H-104",
      date: newAptDate,
      time: newAptTime,
      status: "pending",
      type: "Video Consultation",
      riskLevel: "RED",
      notes: "Patient submitted session request.",
      meetUrl: "https://meet.google.com/sah-aytm-mtg"
    };

    saveSharedMeetings([newMeetingRequest, ...sharedMeetings]);
    setShowScheduleNew(false);
    setNewAptDate('');
    setNewAptTime('');
    alert(t.requestSentSuccess);
  };

  // Calculate Goals Progress Dynamically from shared goals!
  const patientCaseGoals = sharedGoals.filter(g => g.caseId === "Case #4821" || !g.caseId);
  const totalTasks = patientCaseGoals.length || 1;
  const completedTasks = patientCaseGoals.filter(g => g.completed).length;
  const dailyGoalPercent = Math.round((completedTasks / totalTasks) * 100);

  const toggleSharedGoal = (goalId: string) => {
    const updated = sharedGoals.map(g => g.id === goalId ? { ...g, completed: !g.completed } : g);
    saveSharedGoals(updated);
  };

  const handleSidebarDayClick = (day: PastCheckIn | null) => {
    if (day) {
      setSelectedPastDay(day);
      setActiveTab('CALENDAR');
    } else {
      setSelectedPastDay(getTodayCheckIn());
    }
  };

  const computedUpcoming = appointments.upcoming;

  return (
    <div className="min-h-screen bg-[#f0fdf4] text-slate-900 flex font-sans overflow-hidden">
      
      {/* Left Sidebar */}
      <aside className="w-64 bg-indigo-50/40 backdrop-blur-xl border-r border-white text-slate-600 flex flex-col justify-between py-8 px-6 rounded-r-3xl my-2 shadow-[4px_0_24px_rgba(0,0,0,0.02)] relative z-20 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-12 text-emerald-600 font-bold text-xl tracking-wide">
            <HeartPulse className="w-6 h-6" />
            <span className="text-slate-800">SAHAY</span>
          </div>
          
          <nav className="space-y-2 text-sm font-medium">
            <button onClick={() => setActiveTab('DASHBOARD')} className={`flex w-full items-center gap-3 py-3 px-4 rounded-xl transition-colors ${activeTab === 'DASHBOARD' ? 'bg-white shadow-sm text-emerald-700 border-l-4 border-emerald-500' : 'hover:bg-white/60 hover:text-slate-900'}`}>
              <LayoutDashboard className="w-5 h-5" />
              {t.dashNavDashboard}
            </button>
            <button onClick={() => setActiveTab('CALENDAR')} className={`flex w-full items-center gap-3 py-3 px-4 rounded-xl transition-colors ${activeTab === 'CALENDAR' ? 'bg-white shadow-sm text-emerald-700 border-l-4 border-emerald-500' : 'hover:bg-white/60 hover:text-slate-900'}`}>
              <CalendarIcon className="w-5 h-5" />
              {t.dashNavCalendar}
            </button>
            <button onClick={() => setActiveTab('INSIGHTS')} className={`flex w-full items-center gap-3 py-3 px-4 rounded-xl transition-colors ${activeTab === 'INSIGHTS' ? 'bg-white shadow-sm text-emerald-700 border-l-4 border-emerald-500' : 'hover:bg-white/60 hover:text-slate-900'}`}>
              <TrendingUp className="w-5 h-5" />
              {t.dashNavInsights}
            </button>
            <button onClick={() => setActiveTab('SCHEDULED')} className={`flex w-full items-center gap-3 py-3 px-4 rounded-xl transition-colors ${activeTab === 'SCHEDULED' ? 'bg-white shadow-sm text-emerald-700 border-l-4 border-emerald-500' : 'hover:bg-white/60 hover:text-slate-900'}`}>
              <Clock className="w-5 h-5" />
              {t.dashNavScheduled}
            </button>
            <button onClick={() => setActiveTab('GOALS')} className={`flex w-full items-center gap-3 py-3 px-4 rounded-xl transition-colors ${activeTab === 'GOALS' ? 'bg-white shadow-sm text-emerald-700 border-l-4 border-emerald-500' : 'hover:bg-white/60 hover:text-slate-900'}`}>
              <Target className="w-5 h-5" />
              {t.dashNavGoals}
            </button>
            <button onClick={() => setActiveTab('YOGA')} className={`flex w-full items-center gap-3 py-3 px-4 rounded-xl transition-colors ${activeTab === 'YOGA' ? 'bg-white shadow-sm text-emerald-700 border-l-4 border-emerald-500' : 'hover:bg-white/60 hover:text-slate-900'}`}>
              <Wind className="w-5 h-5" />
              {t.dashNavYoga}
            </button>
            <button onClick={() => setActiveTab('COUNSELLOR')} className={`flex w-full items-center gap-3 py-3 px-4 rounded-xl transition-colors ${activeTab === 'COUNSELLOR' ? 'bg-white shadow-sm text-emerald-700 border-l-4 border-emerald-500' : 'hover:bg-white/60 hover:text-slate-900'}`}>
              <Users className="w-5 h-5" />
              {t.dashNavCounsellor}
            </button>
          </nav>
        </div>

        <div className="space-y-2 text-sm font-medium">
          <button onClick={() => setActiveTab('SUPPORT')} className={`flex w-full items-center gap-3 py-3 px-4 rounded-xl transition-colors ${activeTab === 'SUPPORT' ? 'bg-white shadow-sm text-emerald-700 border-l-4 border-emerald-500' : 'hover:bg-white/60 hover:text-slate-900'}`}>
            <MessageSquare className="w-5 h-5" />
            {t.dashNavSupport}
          </button>
          <button onClick={() => setActiveTab('PROFILE')} className={`flex w-full items-center gap-3 py-3 px-4 rounded-xl transition-colors ${activeTab === 'PROFILE' ? 'bg-white shadow-sm text-emerald-700 border-l-4 border-emerald-500' : 'hover:bg-white/60 hover:text-slate-900'}`}>
            <User className="w-5 h-5" />
            {t.dashNavProfile}
          </button>
          <Link to="/patient" className="flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-white/60 hover:text-rose-600 transition-colors mt-6 text-rose-500">
            <LogOut className="w-5 h-5" />
            {t.logoutBtn}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-6 sm:p-8 h-screen overflow-y-auto bg-gradient-to-br from-[#f0fdf4] via-[#fefae0] to-[#e8f0fe]">
        
        <div className="flex gap-8 max-w-7xl mx-auto w-full">
          
          <div className="flex-1 space-y-6">
            
            {/* Search and Language Switcher */}
            <div className="flex items-center justify-between">
              <div className="relative max-w-md w-full">
                <Search className="w-4 h-4 absolute left-4 top-3 text-slate-400" />
                <input 
                  type="text" 
                  placeholder={t.dashSearchPlaceholder} 
                  className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-white/70 border border-white text-sm focus:outline-none focus:border-emerald-500 shadow-sm backdrop-blur-md"
                />
              </div>

              {/* Language Toggle Pills */}
              <div className="flex items-center gap-1 bg-white/70 backdrop-blur-md p-1 rounded-xl border border-white shadow-sm shrink-0 ml-4">
                <Globe className="w-4 h-4 text-slate-500 ml-1.5 mr-1" />
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                    language === 'en' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage('hi')}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                    language === 'hi' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  हिन्दी
                </button>
              </div>
            </div>

            {/* DASHBOARD TAB */}
            {activeTab === 'DASHBOARD' && (
              <>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-[28px] font-extrabold text-slate-800 leading-tight tracking-tight">
                      {t.dashBannerTitle} <span className="text-emerald-600 font-black">{patientName.split(' ')[0]}?</span>
                    </h2>
                    <p className="text-slate-500 font-medium text-base mt-1">{t.dashBannerSub}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Link to="/patient?skipAuth=true" className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-xl text-sm font-bold text-indigo-700 shadow-sm hover:bg-indigo-100 hover:scale-105 transition-all">
                      <Zap className="w-4 h-4" />
                      {t.dashBannerBtn}
                    </Link>
                  </div>
                </div>

                <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white shadow-sm h-[380px]">
                   <div className="flex items-center justify-between mb-6">
                     <h3 className="font-bold text-slate-800">{t.dashMoodChartTitle}</h3>
                     <span className="text-xs font-semibold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-100">{t.dashMoodChartSub}</span>
                   </div>
                   <div className="h-[260px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mockMoodData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} dy={10} />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 11, fill: '#94a3b8' }}
                          tickFormatter={(value) => moodLabels[value] || ''}
                          domain={[0, 4]}
                          ticks={[0, 1, 2, 3, 4]}
                        />
                        <Tooltip content={<CustomMoodTooltip />} />
                        <Line 
                          type="monotone" 
                          dataKey="mood" 
                          stroke="#10b981" 
                          strokeWidth={4}
                          dot={{ r: 5, strokeWidth: 2, fill: '#fff', stroke: '#10b981' }}
                          activeDot={{ r: 7, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
                        />
                      </LineChart>
                     </ResponsiveContainer>
                   </div>
                </div>

                {/* Bottom Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                  <button onClick={() => setActiveTab('GOALS')} className="bg-emerald-50 hover:bg-emerald-100 rounded-2xl p-4 flex items-center justify-between border border-emerald-100 shadow-sm transition-colors text-left group">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center shadow-sm relative transition-all group-hover:scale-105 shrink-0"
                        style={{ background: `conic-gradient(#34d399 ${dailyGoalPercent}%, #e2e8f0 ${dailyGoalPercent}%)` }}
                      >
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-emerald-800 text-sm absolute">
                          {dailyGoalPercent}%
                        </div>
                      </div>
                      <span className="font-bold text-sm text-emerald-900">{t.dashDailyGoals}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-emerald-600 transition-transform group-hover:translate-x-1" />
                  </button>
                  
                  <div onClick={() => setActiveTab('YOGA')} className="bg-slate-50/80 backdrop-blur-sm rounded-2xl p-4 relative overflow-hidden flex items-center justify-between shadow-sm border border-slate-200 cursor-pointer hover:shadow-md transition-all group">
                    <div className="relative z-10 w-full">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-slate-800">{t.dashReadingTitle}</h3>
                        <span className="text-xl font-bold font-mono text-slate-400">07:00</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 group-hover:text-indigo-500 transition-colors">Start Session</div>
                        <div className="flex items-center gap-1">
                          <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center transition-colors group-hover:bg-indigo-600 group-hover:text-white shadow-sm pointer-events-none">
                            <Play className="w-4 h-4 ml-0.5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div onClick={() => setActiveTab('YOGA')} className="bg-rose-50/80 backdrop-blur-sm rounded-2xl p-4 relative overflow-hidden flex items-center justify-between shadow-sm border border-rose-100 cursor-pointer hover:shadow-md transition-all group">
                    <div className="relative z-10 w-full">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-rose-900">{t.dashYogaTitle}</h3>
                        <span className="text-xl font-bold font-mono text-rose-400">05:00</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-[10px] uppercase font-bold tracking-wider text-rose-400 group-hover:text-rose-600 transition-colors">Start Session</div>
                        <div className="flex items-center gap-1">
                          <div className="w-8 h-8 rounded-full bg-rose-200 text-rose-700 flex items-center justify-center transition-colors group-hover:bg-rose-600 group-hover:text-white shadow-sm pointer-events-none">
                            <Play className="w-4 h-4 ml-0.5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* CALENDAR TAB */}
            {activeTab === 'CALENDAR' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">{t.dashCheckInHistory}</h2>
                  <p className="text-slate-500 text-sm">{t.dashCheckInHistorySub}</p>
                </div>
                
                <div className="flex flex-col xl:flex-row gap-6">
                  {/* Large Calendar */}
                  <div className="flex-1 bg-white/70 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-sm border border-white max-w-2xl">
                    <CheckInCalendar 
                      size="large"
                      externalSelectedDay={selectedPastDay}
                      onSelectDay={setSelectedPastDay}
                      appointments={[...appointments.upcoming, ...appointments.past]}
                    />
                  </div>

                  {/* Day Details Side Panel */}
                  {selectedPastDay && (
                    <div className="w-full xl:w-80 bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white shadow-sm flex flex-col h-fit shrink-0">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                        <span className="font-mono text-xs text-slate-500 font-semibold uppercase tracking-widest">
                          {new Date(selectedPastDay.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                        <button 
                          onClick={() => setSelectedPastDay(null)}
                          className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-6">
                        <div className="flex items-center gap-4">
                          <span className="text-5xl drop-shadow-sm">{getMoodEmoji(selectedPastDay.mood)}</span>
                          <div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Mood</div>
                            <div className="text-xl font-bold text-slate-800">{selectedPastDay.mood}</div>
                          </div>
                        </div>

                        {selectedPastDay.journal && (
                          <div className="space-y-2">
                            <div className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1.5">
                              <Smile className="w-3 h-3" /> Journal
                            </div>
                            <p className="text-sm text-slate-600 italic border-l-2 border-slate-200 pl-3 leading-relaxed">
                              "{selectedPastDay.journal}"
                            </p>
                          </div>
                        )}

                        <div className="space-y-4 pt-4 border-t border-slate-100">
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-slate-500 font-bold flex items-center gap-2">
                              <Zap className="w-4 h-4 text-amber-500" /> Energy
                            </div>
                            <div className="flex gap-1.5">
                              {Array.from({ length: 10 }).map((_, i) => (
                                <div key={i} className={`w-3 h-3 rounded-[3px] ${i < selectedPastDay.energy ? 'bg-amber-400' : 'bg-slate-100'}`} />
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-xs text-slate-500 font-bold flex items-center gap-2">
                              <Activity className="w-4 h-4 text-rose-500" /> Stress
                            </div>
                            <div className="flex gap-1.5">
                              {Array.from({ length: 10 }).map((_, i) => (
                                <div key={i} className={`w-3 h-3 rounded-[3px] ${i < selectedPastDay.stress ? 'bg-rose-400' : 'bg-slate-100'}`} />
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-xs text-slate-500 font-bold flex items-center gap-2">
                              <Moon className="w-4 h-4 text-indigo-500" /> Sleep
                            </div>
                            <div className="text-sm font-bold text-slate-700">
                              {selectedPastDay.sleep}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* INSIGHTS TAB */}
            {activeTab === 'INSIGHTS' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">{t.dashInsightsTitle}</h2>
                  <p className="text-slate-500 text-sm">{t.dashInsightsSub}</p>
                </div>
                
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white shadow-sm space-y-8">
                   
                   {/* Summary Cards */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-2xl flex items-start gap-4">
                       <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                         <Zap className="w-5 h-5 text-indigo-600" />
                       </div>
                       <div>
                         <h4 className="font-bold text-indigo-900">{t.dashTopTriggers}</h4>
                         <p className="text-sm text-indigo-700 mt-1">{t.dashTopTriggersDesc}</p>
                       </div>
                     </div>
                     <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl flex items-start gap-4">
                       <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                         <Activity className="w-5 h-5 text-emerald-600" />
                       </div>
                       <div>
                         <h4 className="font-bold text-emerald-900">{t.dashRecurringPatterns}</h4>
                         <p className="text-sm text-emerald-700 mt-1">{t.dashRecurringPatternsDesc}</p>
                       </div>
                     </div>
                   </div>

                   <div className="pt-4">
                     <div className="flex items-center justify-between mb-6">
                       <h3 className="font-bold text-slate-800">{t.dash30DayTrend}</h3>
                       <span className="text-xs font-semibold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-100">{t.dashPastMonth}</span>
                     </div>
                     <div className="h-[300px] w-full">
                       <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mockMoodData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} dy={10} />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 11, fill: '#94a3b8' }}
                            tickFormatter={(value) => moodLabels[value] || ''}
                            domain={[0, 4]}
                            ticks={[0, 1, 2, 3, 4]}
                          />
                          <Tooltip content={<CustomMoodTooltip />} />
                          <Line 
                            type="monotone" 
                            dataKey="mood" 
                            stroke="#6366f1" 
                            strokeWidth={3}
                            dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#6366f1' }}
                            activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
                          />
                        </LineChart>
                       </ResponsiveContainer>
                     </div>
                  </div>
                </div>
              </div>
            )}

            {/* SCHEDULED TAB */}
            {activeTab === 'SCHEDULED' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">{t.dashScheduledTitle}</h2>
                    <p className="text-slate-500 text-sm">{t.dashScheduledSub}</p>
                  </div>
                  <button onClick={() => setShowScheduleNew(true)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm transition-colors text-sm">
                    + Schedule New
                  </button>
                </div>
                
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white shadow-sm space-y-8">
                   
                   {/* Pending Requests Section */}
                   {sharedMeetings.filter(m => m.status === 'pending').length > 0 && (
                     <div className="flex flex-col gap-4">
                       <h3 className="font-bold text-amber-800 border-b border-amber-100 pb-2 flex items-center gap-2">
                         <Clock className="w-4 h-4 text-amber-600" />
                         {t.pendingRequests}
                       </h3>
                       {sharedMeetings.filter(m => m.status === 'pending').map(m => (
                         <div key={m.id} className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-col md:flex-row justify-between md:items-center gap-4 shadow-xs">
                           <div className="flex gap-4 items-center">
                             <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                               <Video className="w-5 h-5"/>
                             </div>
                             <div>
                                <h4 className="font-bold text-slate-800">{m.type} with Dr. Rajesh Sharma</h4>
                                <span className="inline-block text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200 mt-1">
                                  ⏳ {t.statusPending}
                                </span>
                             </div>
                           </div>
                           <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-600 shrink-0">
                              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-amber-100"><CalendarIcon className="w-4 h-4 text-amber-500" /> {m.date}</div>
                              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-amber-100"><Clock className="w-4 h-4 text-amber-500" /> {m.time}</div>
                           </div>
                         </div>
                       ))}
                     </div>
                   )}

                   {/* Declined Requests Section */}
                   {sharedMeetings.filter(m => m.status === 'declined').length > 0 && (
                     <div className="flex flex-col gap-4">
                       <h3 className="font-bold text-rose-800 border-b border-rose-100 pb-2 flex items-center gap-2">
                         <X className="w-4 h-4 text-rose-600" />
                         {t.statusDeclined}
                       </h3>
                       {sharedMeetings.filter(m => m.status === 'declined').map(m => (
                         <div key={m.id} className="p-5 rounded-2xl bg-rose-50/60 border border-rose-100 flex flex-col md:flex-row justify-between md:items-center gap-4">
                           <div className="flex gap-4 items-center">
                             <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                               <Video className="w-5 h-5"/>
                             </div>
                             <div>
                                <h4 className="font-bold text-slate-800">{m.type} ({m.date} {m.time})</h4>
                                <p className="text-xs font-semibold text-rose-700 mt-1">{t.counsellorBusyMsg}</p>
                             </div>
                           </div>
                           <button 
                             onClick={() => setShowScheduleNew(true)} 
                             className="px-4 py-2 bg-rose-100 text-rose-700 font-bold rounded-xl hover:bg-rose-200 transition-colors text-xs shrink-0"
                           >
                             Try Another Slot
                           </button>
                         </div>
                       ))}
                     </div>
                   )}

                   {/* Upcoming Section */}
                   <div className="flex flex-col gap-4">
                     <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">{t.upcomingBadge}</h3>
                     {sharedMeetings.filter(m => m.status === 'upcoming' || m.status === 'accepted').length === 0 ? (
                        <p className="text-slate-500 text-sm py-4">No upcoming appointments.</p>
                     ) : (
                       sharedMeetings.filter(m => m.status === 'upcoming' || m.status === 'accepted').map(apt => (
                         <div key={apt.id} className="p-5 rounded-2xl bg-white border border-slate-100 flex flex-col md:flex-row justify-between md:items-center gap-4 hover:shadow-md transition-shadow">
                           <div className="flex gap-4 items-center">
                             <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
                               <Video className="w-5 h-5"/>
                             </div>
                             <div>
                                <h4 className="font-bold text-slate-800">{apt.type} with Dr. Rajesh Sharma</h4>
                                <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 mt-0.5">
                                  ✓ {t.statusAccepted}
                                </span>
                             </div>
                           </div>
                           <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-600 shrink-0">
                              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100"><CalendarIcon className="w-4 h-4 text-slate-400" /> {apt.date}</div>
                              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100"><Clock className="w-4 h-4 text-slate-400" /> {apt.time}</div>
                              {apt.meetUrl && (
                                <a
                                  href={apt.meetUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-xs text-xs flex items-center gap-1.5"
                                >
                                  <Video className="w-4 h-4" />
                                  {t.joinMeeting}
                                </a>
                              )}
                              <button onClick={() => setActiveTab('COUNSELLOR')} className="px-4 py-2 bg-emerald-50 text-emerald-600 font-bold rounded-xl hover:bg-emerald-100 transition-colors border border-emerald-100 text-xs">{t.viewProfileBtn}</button>
                           </div>
                         </div>
                       ))
                     )}
                   </div>

                   {/* Missed Section */}
                   <div className="flex flex-col gap-4">
                     <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">{t.tabMissed}</h3>
                     {sharedMeetings.filter(m => m.status === 'missed').length === 0 ? (
                        <p className="text-slate-500 text-sm py-4">No missed appointments.</p>
                     ) : (
                       sharedMeetings.filter(m => m.status === 'missed').map(apt => (
                         <div key={apt.id} className="p-5 rounded-2xl bg-rose-50/50 border border-rose-100 flex flex-col md:flex-row justify-between md:items-center gap-4 opacity-80">
                           <div className="flex gap-4 items-center">
                             <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center shrink-0">
                               <Video className="w-5 h-5"/>
                             </div>
                             <div>
                                <h4 className="font-bold text-slate-800">{apt.type} with Dr. Rajesh Sharma</h4>
                                <p className="text-xs text-rose-500 mt-0.5 font-bold">{t.tabMissed}</p>
                             </div>
                           </div>
                           <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-600 shrink-0">
                              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-rose-100"><CalendarIcon className="w-4 h-4 text-rose-400" /> {apt.date}</div>
                              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-rose-100"><Clock className="w-4 h-4 text-rose-400" /> {apt.time}</div>
                              <button onClick={() => setShowScheduleNew(true)} className="px-4 py-2 bg-rose-100 text-rose-700 font-bold rounded-xl hover:bg-rose-200 transition-colors border border-rose-200 text-xs">{t.rescheduleBtn}</button>
                           </div>
                         </div>
                       ))
                     )}
                   </div>

                </div>
              </div>
            )}

            {/* YOGA TAB */}
            {activeTab === 'YOGA' && (
              <YogaSection />
            )}

            {/* GOALS TAB */}
            {activeTab === 'GOALS' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">{t.dashDailyGoals}</h2>
                    <p className="text-slate-500 text-sm">{t.dashGoalsSub}</p>
                  </div>

                  {/* Internal Goals Tab Switcher */}
                  <div className="flex bg-white/80 p-1.5 rounded-2xl border border-slate-200 shadow-sm shrink-0">
                    <button
                      onClick={() => setGoalsSubTab('DOCTOR_ASSIGNED')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        goalsSubTab === 'DOCTOR_ASSIGNED'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      {t.doctorAssignedGoals}
                    </button>
                    <button
                      onClick={() => setGoalsSubTab('SELF_GOALS')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        goalsSubTab === 'SELF_GOALS'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      {t.selfGoals}
                    </button>
                  </div>
                </div>
                
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white shadow-sm space-y-8">
                  <div className="flex flex-col md:flex-row items-center gap-8 bg-emerald-50/60 p-6 rounded-2xl border border-emerald-100">
                    <div 
                      className="w-24 h-24 rounded-full flex items-center justify-center shadow-sm relative shrink-0"
                      style={{ background: `conic-gradient(#34d399 ${dailyGoalPercent}%, #e2e8f0 ${dailyGoalPercent}%)` }}
                    >
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center font-bold text-emerald-800 text-3xl absolute">
                        {dailyGoalPercent}%
                      </div>
                    </div>
                    <div className="text-center md:text-left">
                      <h3 className="font-bold text-emerald-950 text-xl">{t.dashGoalsGreat}</h3>
                      <p className="text-emerald-700 font-medium mt-1">
                        {completedTasks} {t.dashOutOf} {totalTasks} {t.dashTasksCompleted}
                      </p>
                    </div>
                  </div>
                  
                  {goalsSubTab === 'DOCTOR_ASSIGNED' && (
                    <div className="space-y-4">
                      <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                        <User className="w-4 h-4 text-indigo-500" />
                        {t.doctorAssignedGoals}
                      </h4>

                      {patientCaseGoals.filter(g => g.assignedBy === 'counsellor').length === 0 ? (
                        <p className="text-slate-500 text-sm py-4 italic">No goals assigned by your counsellor yet.</p>
                      ) : (
                        patientCaseGoals.filter(g => g.assignedBy === 'counsellor').map(goal => (
                          <div
                            key={goal.id}
                            onClick={() => toggleSharedGoal(goal.id)}
                            className="flex items-start gap-4 cursor-pointer bg-white p-5 rounded-2xl hover:shadow-md transition-all border border-indigo-100/80 group"
                          >
                            <div className={`mt-0.5 w-6 h-6 shrink-0 rounded-lg flex items-center justify-center border transition-colors ${
                              goal.completed ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' : 'border-indigo-200 bg-indigo-50 group-hover:bg-indigo-100'
                            }`}>
                              {goal.completed && <Check className="w-4 h-4" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h5 className={`font-bold text-base transition-all ${
                                  goal.completed ? 'text-slate-400 line-through' : 'text-slate-900'
                                }`}>
                                  {goal.title}
                                </h5>
                                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                                  {t.assignedByLabel}: Dr. Rajesh Sharma
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 mt-1">{goal.description}</p>
                              {goal.dueDate && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 mt-2 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                                  <Clock className="w-3 h-3" /> {t.dueDateLabel}: {goal.dueDate}
                                </span>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {goalsSubTab === 'SELF_GOALS' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-slate-800 text-sm">{t.selfGoals}</h4>
                        <button
                          onClick={() => {
                            const title = window.prompt('Enter Goal Title:');
                            if (!title || !title.trim()) return;
                            const desc = window.prompt('Enter Goal Description (Optional):') || '';
                            const newGoal: SharedGoal = {
                              id: `goal-${Date.now()}`,
                              caseId: "Case #4821",
                              title: title.trim(),
                              description: desc.trim(),
                              assignedBy: "patient",
                              dueDate: "Daily",
                              completed: false,
                              createdAt: new Date().toISOString().split('T')[0]
                            };
                            saveSharedGoals([...sharedGoals, newGoal]);
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-xs text-xs flex items-center gap-1"
                        >
                          + {t.addGoalBtn}
                        </button>
                      </div>

                      {patientCaseGoals.filter(g => g.assignedBy === 'patient').length === 0 ? (
                        <p className="text-slate-500 text-sm py-4 italic">No self goals added yet. Click "+ Add Goal" above to create one!</p>
                      ) : (
                        patientCaseGoals.filter(g => g.assignedBy === 'patient').map(goal => (
                          <div
                            key={goal.id}
                            onClick={() => toggleSharedGoal(goal.id)}
                            className="flex items-start gap-4 cursor-pointer bg-white p-5 rounded-2xl hover:shadow-md transition-all border border-emerald-100 group"
                          >
                            <div className={`mt-0.5 w-6 h-6 shrink-0 rounded-lg flex items-center justify-center border transition-colors ${
                              goal.completed ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm' : 'border-emerald-200 bg-emerald-50 group-hover:bg-emerald-100'
                            }`}>
                              {goal.completed && <Check className="w-4 h-4" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h5 className={`font-bold text-base transition-all ${
                                  goal.completed ? 'text-emerald-700 line-through opacity-70' : 'text-emerald-950 font-medium'
                                }`}>
                                  {goal.title}
                                </h5>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    saveSharedGoals(sharedGoals.filter(g => g.id !== goal.id));
                                  }}
                                  className="text-slate-400 hover:text-rose-500 text-xs p-1"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                              {goal.description && <p className="text-xs text-slate-500 mt-1">{goal.description}</p>}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* COUNSELLOR TAB */}
            {activeTab === 'COUNSELLOR' && (
              <CounsellorTab appointments={appointments} setAppointments={setAppointments} />
            )}

            {/* SUPPORT TAB */}
            {activeTab === 'SUPPORT' && (
              <SupportTab />
            )}

            {/* PROFILE TAB */}
            {activeTab === 'PROFILE' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">{t.dashNavProfile}</h2>
                  <p className="text-slate-500 text-sm">Manage your personal information and preferences.</p>
                </div>
                
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white shadow-sm space-y-8">
                  <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-slate-100">
                    <div className="relative">
                      {profilePic ? (
                        <img src={profilePic} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-indigo-50 shadow-sm" />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-indigo-100 border-4 border-indigo-50 shadow-sm flex items-center justify-center text-indigo-700 font-bold text-3xl">
                          {getInitials(patientName)}
                        </div>
                      )}
                      <label className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white cursor-pointer shadow-sm hover:bg-indigo-700 transition-colors border-2 border-white">
                        <User className="w-4 h-4" />
                        <input type="file" accept="image/*" className="hidden" onChange={handlePicUpload} />
                      </label>
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="text-2xl font-bold text-slate-800">{patientName}</h3>
                      <p className="text-slate-500">{patientPhone}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Assigned Counsellor</h4>
                      <p className="font-bold text-slate-800 text-lg">Dr. Rajesh Sharma</p>
                      <p className="text-xs text-emerald-600 font-semibold mt-1">Clinical Psychologist</p>
                    </div>
                    
                    <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100">
                      <h4 className="text-xs font-bold text-emerald-600/70 uppercase tracking-wider mb-2">Daily Goal Progress</h4>
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center shadow-sm relative shrink-0"
                          style={{ background: `conic-gradient(#34d399 ${dailyGoalPercent}%, #e2e8f0 ${dailyGoalPercent}%)` }}
                        >
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-emerald-800 absolute">
                            {dailyGoalPercent}%
                          </div>
                        </div>
                        <p className="font-semibold text-emerald-900 text-sm">Keep up the good work today!</p>
                      </div>
                    </div>

                    <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100 md:col-span-2 flex justify-between items-center">
                      <div>
                        <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">Next Meeting</h4>
                        {computedUpcoming.length > 0 ? (
                          <p className="font-bold text-indigo-900 text-lg">{computedUpcoming[0].type} on {new Date(computedUpcoming[0].date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                        ) : (
                          <p className="font-bold text-indigo-900 text-lg">No upcoming meetings</p>
                        )}
                      </div>
                      <button onClick={() => setActiveTab('COUNSELLOR')} className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl text-sm shadow-sm hover:bg-indigo-700">View</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Right Sidebar */}
          <div className="w-72 space-y-6 h-fit shrink-0">
            
            {/* Profile */}
            <div 
              onClick={() => setActiveTab('PROFILE')} 
              className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-md transition-all group"
            >
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="w-12 h-12 rounded-full object-cover shadow-sm border border-slate-100" />
              ) : (
                <div className="w-12 h-12 rounded-full shadow-sm bg-indigo-100 flex items-center justify-center font-bold text-indigo-700 border border-indigo-50">
                  {getInitials(patientName)}
                </div>
              )}
              <span className="font-bold text-sm text-slate-800 group-hover:text-indigo-600 transition-colors">{patientName}</span>
            </div>

            {/* Small Calendar */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-5 border border-white shadow-sm">
              <CheckInCalendar 
                size="small"
                hideModal={true}
                onSelectDay={handleSidebarDayClick}
                externalSelectedDay={activeTab === 'CALENDAR' ? selectedPastDay : null}
                appointments={[...appointments.upcoming, ...appointments.past]}
              />
            </div>

            {/* Scheduled */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-800">{t.dashNavScheduled}</h3>
                <button onClick={() => setActiveTab('SCHEDULED')} className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">{t.dashViewAll}</button>
              </div>
              
              <div className="space-y-3">
                {computedUpcoming.length === 0 ? (
                   <p className="text-slate-500 text-xs text-center py-4">No upcoming scheduled meetings.</p>
                ) : (
                   computedUpcoming.slice(0, 3).map(apt => (
                    <div key={apt.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3 transition-transform hover:-translate-y-0.5 cursor-pointer" onClick={() => setActiveTab('SCHEDULED')}>
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm text-slate-800">{apt.type}</h4>
                        <p className="text-[10px] text-slate-500 leading-tight">with {apt.counsellor}</p>
                      </div>
                      <div className="pt-3 border-t border-dashed border-slate-100 flex items-center justify-between text-[10px] font-semibold text-slate-500">
                        <div className="flex items-center gap-1.5"><CalendarIcon className="w-3 h-3 text-indigo-400" /> {new Date(apt.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</div>
                        <div className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-indigo-400" /> {apt.time}</div>
                      </div>
                    </div>
                   ))
                )}
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Modals */}
      {showScheduleNew && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-bold text-lg mb-2">Schedule Appointment</h3>
            <p className="text-sm text-slate-500 mb-4">Book a new session with Dr. Rajesh Sharma.</p>
            
            <label className="text-xs font-bold text-slate-500 mb-1 block">Date</label>
            <input type="date" value={newAptDate} onChange={e => setNewAptDate(e.target.value)} className="w-full border border-slate-200 p-2 rounded-xl mb-4 text-sm" />
            
            <label className="text-xs font-bold text-slate-500 mb-1 block">Available Slots</label>
            <div className="flex flex-wrap gap-2 mb-4">
              {PRE_SET_SLOTS.map(slot => {
                const isOccupied = OCCUPIED_SLOTS.includes(slot);
                const isSelected = newAptTime === slot;
                return (
                  <button 
                    key={slot}
                    disabled={isOccupied}
                    onClick={() => setNewAptTime(slot)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                      isOccupied ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60' :
                      isSelected ? 'bg-indigo-600 text-white border-indigo-600' :
                      'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2">
              <button onClick={() => setShowScheduleNew(false)} className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-200">Cancel</button>
              <button onClick={confirmNewAppointment} className="flex-1 py-2 bg-emerald-600 text-white font-bold rounded-xl text-sm hover:bg-emerald-700">Confirm</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
