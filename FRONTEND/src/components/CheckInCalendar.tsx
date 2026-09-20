import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Activity, Moon, Zap, Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MoodType } from './MoodSelector';

export interface PastCheckIn {
  date: string; // YYYY-MM-DD
  mood: MoodType;
  journal: string;
  energy: number; // 0-10
  stress: number; // 0-10
  sleep: string; // e.g. "7h 20m"
  hasVoiceNote?: boolean;
}

// Helper to map mood to emoji
export const getMoodEmoji = (mood: string) => {
  switch (mood) {
    case 'Very Low': return '😫';
    case 'Low': return '😔';
    case 'Neutral': return '😐';
    case 'Good': return '🙂';
    case 'Great': return '😄';
    default: return '🙂';
  }
};

// Generate some mock history as fallback
const DEFAULT_MOCK_HISTORY: PastCheckIn[] = [
  { date: '2026-09-01', mood: 'Low', journal: 'Hard day at work.', energy: 3, stress: 8, sleep: '5h 30m' },
  { date: '2026-09-02', mood: 'Neutral', journal: 'Felt a bit better today.', energy: 5, stress: 6, sleep: '6h 45m' },
  { date: '2026-09-03', mood: 'Neutral', journal: '', energy: 4, stress: 5, sleep: '7h 00m' },
  { date: '2026-09-04', mood: 'Low', journal: 'Exhausted.', energy: 2, stress: 9, sleep: '4h 15m' },
  { date: '2026-09-05', mood: 'Good', journal: 'Weekend relaxation.', energy: 7, stress: 3, sleep: '8h 20m' },
  { date: '2026-09-07', mood: 'Good', journal: 'Nice walk in the park.', energy: 8, stress: 2, sleep: '7h 50m' },
  { date: '2026-09-08', mood: 'Neutral', journal: 'Normal day.', energy: 5, stress: 5, sleep: '6h 30m' },
  { date: '2026-09-09', mood: 'Good', journal: 'Finished my project!', energy: 9, stress: 4, sleep: '7h 10m' },
];

const getHistory = (): PastCheckIn[] => {
  const phone = localStorage.getItem('sahay_active_user_phone');
  if (!phone) return DEFAULT_MOCK_HISTORY;
  const histStr = localStorage.getItem(`sahay_history_${phone}`);
  if (histStr) {
    try {
      const parsed = JSON.parse(histStr);
      // Ensure DEFAULT_MOCK_HISTORY is included so calendar doesn't look empty initially
      const combined = [...DEFAULT_MOCK_HISTORY];
      for (const checkIn of parsed) {
        if (!combined.find(c => c.date === checkIn.date)) {
          combined.push(checkIn);
        }
      }
      return combined;
    } catch (e) {
      return DEFAULT_MOCK_HISTORY;
    }
  }
  return DEFAULT_MOCK_HISTORY;
};

interface Props {
  currentCheckIn?: {
    date: string;
    mood: MoodType;
    journal: string;
  };
  externalSelectedDay?: PastCheckIn | null;
  onSelectDay?: (day: PastCheckIn | null) => void;
  hideModal?: boolean;
  size?: 'small' | 'large';
  appointments?: any[];
}

export const CheckInCalendar: React.FC<Props> = ({ currentCheckIn, externalSelectedDay, onSelectDay, hideModal, size = 'small', appointments = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [internalSelectedDay, setInternalSelectedDay] = useState<PastCheckIn | null>(null);

  const selectedDay = externalSelectedDay !== undefined ? externalSelectedDay : internalSelectedDay;
  const handleSetSelectedDay = onSelectDay || setInternalSelectedDay;

  // Combine mock history with current check-in if provided
  const allHistory = getHistory();
  if (currentCheckIn) {
    const existingIdx = allHistory.findIndex(h => h.date === currentCheckIn.date);
    const newEntry: PastCheckIn = {
      date: currentCheckIn.date,
      mood: currentCheckIn.mood,
      journal: currentCheckIn.journal,
      energy: 6,
      stress: 4,
      sleep: '7h 00m'
    };
    if (existingIdx >= 0) allHistory[existingIdx] = newEntry;
    else allHistory.push(newEntry);
  }

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sun, 1 = Mon...

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  const handleDayClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const found = allHistory.find(h => h.date === dateStr);
    if (found) {
      handleSetSelectedDay(found);
    } else {
      handleSetSelectedDay(null);
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const isLarge = size === 'large';

  return (
    <div className={`bg-transparent text-slate-800 relative overflow-hidden w-full ${!isLarge ? 'max-w-sm mx-auto' : ''}`}>
      {/* Header */}
      <div className={`flex items-center justify-between ${isLarge ? 'mb-6' : 'mb-4'}`}>
        <h3 className={`font-bold text-slate-800 whitespace-nowrap ${isLarge ? 'text-xl' : 'text-base'}`}>
          {monthNames[month]} {year}
        </h3>
        <div className="flex gap-2 text-slate-400 shrink-0">
          <button onClick={handlePrevMonth} className="p-1 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
            <ChevronLeft className={isLarge ? 'w-5 h-5' : 'w-4 h-4'} />
          </button>
          <button onClick={handleNextMonth} className="p-1 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
            <ChevronRight className={isLarge ? 'w-5 h-5' : 'w-4 h-4'} />
          </button>
        </div>
      </div>

      {/* Weekdays */}
      <div className={`grid grid-cols-7 gap-1 text-center ${isLarge ? 'mb-4' : 'mb-2'}`}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className={`font-medium text-slate-400 ${isLarge ? 'text-sm' : 'text-xs'}`}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className={`grid grid-cols-7 text-center relative z-10 ${isLarge ? 'gap-y-3 gap-x-2' : 'gap-y-3 gap-x-1'}`}>
        {blanks.map(b => (
          <div key={`blank-${b}`} />
        ))}
        {days.map(day => {
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const entry = allHistory.find(h => h.date === dateStr);
          const dayAppointments = appointments.filter(a => a.date === dateStr && a.status !== 'Completed');
          const isSelected = selectedDay?.date === dateStr;
          
          return (
            <div 
              key={day} 
              onClick={() => handleDayClick(day)}
              className={`flex flex-col items-center justify-center cursor-pointer group rounded-xl transition-all relative ${isLarge ? 'p-2' : 'p-1'} ${isSelected ? 'bg-indigo-50 border border-indigo-100 ring-1 ring-indigo-200 shadow-sm' : 'hover:bg-slate-50'}`}
            >
              {dayAppointments.length > 0 && (
                <div className="absolute top-1 right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-500 rounded-full shadow-sm animate-pulse" title={`${dayAppointments.length} meeting(s)`} />
              )}
              <span className={`font-semibold ${entry || dayAppointments.length > 0 ? 'text-slate-700' : 'text-slate-300'} ${isLarge ? 'text-base mb-1' : 'text-xs mb-0.5'}`}>
                {day}
              </span>
              <div className={`flex items-center justify-center ${isLarge ? 'h-6' : 'h-5'}`}>
                {entry ? (
                  <span className={`${isLarge ? 'text-xl' : 'text-[14px]'} group-hover:scale-110 transition-transform drop-shadow-sm`}>{getMoodEmoji(entry.mood)}</span>
                ) : (
                  <span className="text-slate-200 text-[10px]">-</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom info section */}
      {!isLarge && (
        <div className="mt-6 pt-3 border-t border-slate-200 border-dashed text-center space-y-2">
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">TODAY — {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
          <div className="text-xs font-medium text-slate-600">Daily check-in streak: <span className="text-emerald-500 font-bold">12 Days 🔥</span></div>
        </div>
      )}

      {/* Day Detail Modal - ONLY for small sizes if hideModal is false */}
      {!hideModal && !isLarge && (
        <AnimatePresence>
          {selectedDay && (
            <motion.div 
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-0 bg-white/95 backdrop-blur-md z-50 flex flex-col rounded-3xl border border-slate-100 shadow-xl"
            >
              {/* Modal Header */}
              <div className="p-4 flex items-center justify-between border-b border-slate-100">
                <span className="font-mono text-xs text-slate-500 font-semibold uppercase tracking-widest">
                  {new Date(selectedDay.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
                <button 
                  onClick={() => handleSetSelectedDay(null)}
                  className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-5 overflow-y-auto space-y-6">
                {/* Mood Overview */}
                <div className="flex items-center gap-4">
                  <span className="text-4xl drop-shadow-sm">{getMoodEmoji(selectedDay.mood)}</span>
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Mood</div>
                    <div className="text-lg font-bold text-slate-800">{selectedDay.mood}</div>
                  </div>
                </div>

                {/* Journal */}
                {selectedDay.journal && (
                  <div className="space-y-1.5">
                    <div className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1.5">
                      <Smile className="w-3 h-3" /> Journal
                    </div>
                    <p className="text-xs text-slate-600 italic border-l-2 border-slate-200 pl-3 leading-relaxed">
                      "{selectedDay.journal}"
                    </p>
                  </div>
                )}

                {/* Stats */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] text-slate-500 font-bold flex items-center gap-1.5">
                      <Zap className="w-3 h-3 text-amber-500" /> Energy
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className={`w-2.5 h-2.5 rounded-[2px] ${i < selectedDay.energy ? 'bg-amber-400' : 'bg-slate-100'}`} />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-[10px] text-slate-500 font-bold flex items-center gap-1.5">
                      <Activity className="w-3 h-3 text-rose-500" /> Stress
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className={`w-2.5 h-2.5 rounded-[2px] ${i < selectedDay.stress ? 'bg-rose-400' : 'bg-slate-100'}`} />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-[10px] text-slate-500 font-bold flex items-center gap-1.5">
                      <Moon className="w-3 h-3 text-indigo-500" /> Sleep
                    </div>
                    <div className="text-xs font-bold text-slate-700">
                      {selectedDay.sleep}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};