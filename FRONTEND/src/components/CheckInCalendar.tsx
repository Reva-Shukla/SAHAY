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
}

// Helper to map mood to emoji
const getMoodEmoji = (mood: string) => {
  switch (mood) {
    case 'Very Low': return '😫';
    case 'Low': return '😔';
    case 'Neutral': return '😐';
    case 'Good': return '🙂';
    case 'Great': return '😄';
    default: return '🙂';
  }
};

// Generate some mock history for Sept 2026
const MOCK_HISTORY: PastCheckIn[] = [
  { date: '2026-09-01', mood: 'Low', journal: 'Hard day at work.', energy: 3, stress: 8, sleep: '5h 30m' },
  { date: '2026-09-02', mood: 'Neutral', journal: 'Felt a bit better today.', energy: 5, stress: 6, sleep: '6h 45m' },
  { date: '2026-09-03', mood: 'Neutral', journal: '', energy: 4, stress: 5, sleep: '7h 00m' },
  { date: '2026-09-04', mood: 'Low', journal: 'Exhausted.', energy: 2, stress: 9, sleep: '4h 15m' },
  { date: '2026-09-05', mood: 'Good', journal: 'Weekend relaxation.', energy: 7, stress: 3, sleep: '8h 20m' },
  { date: '2026-09-07', mood: 'Good', journal: 'Nice walk in the park.', energy: 8, stress: 2, sleep: '7h 50m' },
  { date: '2026-09-08', mood: 'Neutral', journal: 'Normal day.', energy: 5, stress: 5, sleep: '6h 30m' },
  { date: '2026-09-09', mood: 'Good', journal: 'Finished my project!', energy: 9, stress: 4, sleep: '7h 10m' },
];

interface Props {
  currentCheckIn?: {
    date: string;
    mood: MoodType;
    journal: string;
  };
}

export const CheckInCalendar: React.FC<Props> = ({ currentCheckIn }) => {
  const [currentDate] = useState(new Date(2026, 8, 10)); // Sept 10, 2026
  const [selectedDay, setSelectedDay] = useState<PastCheckIn | null>(null);

  // Combine mock history with current check-in if provided
  const allHistory = [...MOCK_HISTORY];
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
    if (found) setSelectedDay(found);
    else setSelectedDay(null);
  };

  return (
    <div className="mt-8 bg-slate-900 rounded-3xl p-6 shadow-2xl text-slate-100 max-w-sm mx-auto relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button className="p-1 hover:bg-slate-800 rounded-lg transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="font-mono text-sm font-bold tracking-widest uppercase">
          {monthNames[month]} {year}
        </h3>
        <button className="p-1 hover:bg-slate-800 rounded-lg transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-1 mb-2 text-center">
        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
          <div key={day} className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-y-4 gap-x-1 text-center relative z-10">
        {blanks.map(b => (
          <div key={`blank-${b}`} />
        ))}
        {days.map(day => {
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const entry = allHistory.find(h => h.date === dateStr);
          
          return (
            <div 
              key={day} 
              onClick={() => handleDayClick(day)}
              className={`flex flex-col items-center gap-1 cursor-pointer group ${entry ? 'hover:scale-110 transition-transform' : ''}`}
            >
              <span className={`text-xs font-mono ${entry ? 'text-slate-300' : 'text-slate-600'}`}>
                {day}
              </span>
              <div className="h-6 flex items-center justify-center">
                {entry ? (
                  <span className="text-lg group-hover:animate-bounce">{getMoodEmoji(entry.mood)}</span>
                ) : (
                  <span className="text-slate-800 text-[10px]">-</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom info section */}
      <div className="mt-8 pt-4 border-t border-slate-800 border-dashed text-center space-y-4">
        <p className="font-mono text-xs text-slate-400">TODAY — {monthNames[month]} 10</p>
        <div className="text-sm font-medium text-slate-300">Daily check-in streak: <span className="text-emerald-400 font-bold">12 Days 🔥</span></div>
      </div>

      {/* Day Detail Modal */}
      <AnimatePresence>
        {selectedDay && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-0 bg-slate-900 z-50 flex flex-col"
          >
            {/* Modal Header */}
            <div className="p-5 flex items-center justify-between border-b border-slate-800">
              <span className="font-mono text-xs text-slate-400 uppercase tracking-widest">
                {new Date(selectedDay.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <button 
                onClick={() => setSelectedDay(null)}
                className="p-1 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-8">
              {/* Mood Overview */}
              <div className="flex items-center gap-4">
                <span className="text-4xl">{getMoodEmoji(selectedDay.mood)}</span>
                <div>
                  <div className="text-xs text-slate-500 font-mono uppercase mb-1">Mood</div>
                  <div className="text-lg font-bold text-slate-100">{selectedDay.mood}</div>
                </div>
              </div>

              {/* Journal */}
              {selectedDay.journal && (
                <div className="space-y-2">
                  <div className="text-xs text-slate-500 font-mono uppercase flex items-center gap-2">
                    <Smile className="w-3.5 h-3.5" /> Journal
                  </div>
                  <p className="text-sm text-slate-300 italic border-l-2 border-slate-700 pl-3">
                    "{selectedDay.journal}"
                  </p>
                </div>
              )}

              {/* Stats */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5" /> Energy
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className={`w-3 h-3 rounded-sm ${i < selectedDay.energy ? 'bg-amber-400' : 'bg-slate-800'}`} />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5" /> Stress
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className={`w-3 h-3 rounded-sm ${i < selectedDay.stress ? 'bg-rose-500' : 'bg-slate-800'}`} />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
                    <Moon className="w-3.5 h-3.5" /> Sleep
                  </div>
                  <div className="text-sm font-bold text-slate-200 font-mono">
                    {selectedDay.sleep}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};