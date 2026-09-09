import React from 'react';
import { motion } from 'framer-motion';

export type MoodType = 'Very Low' | 'Low' | 'Neutral' | 'Good' | 'Great';

interface MoodOption {
  value: MoodType;
  emoji: string;
  label: string;
  color: string;
  selectedBg: string;
  desc: string;
}

const MOODS: MoodOption[] = [
  { value: 'Very Low', emoji: '🌧️', label: 'Severe Distress', color: 'text-rose-600', selectedBg: 'bg-rose-50 border-rose-400 text-rose-950', desc: 'Feeling overwhelmed or unsafe' },
  { value: 'Low', emoji: '☁️', label: 'Down / Low', color: 'text-amber-600', selectedBg: 'bg-amber-50 border-amber-400 text-amber-950', desc: 'Feeling sad, tired or anxious' },
  { value: 'Neutral', emoji: '⛅', label: 'Okay / Neutral', color: 'text-teal-600', selectedBg: 'bg-teal-50 border-teal-400 text-teal-950', desc: 'Just getting through the day' },
  { value: 'Good', emoji: '🌤️', label: 'Good / Calm', color: 'text-emerald-600', selectedBg: 'bg-emerald-50 border-emerald-400 text-emerald-950', desc: 'Feeling stable and relaxed' },
  { value: 'Great', emoji: '☀️', label: 'Thriving', color: 'text-cyan-600', selectedBg: 'bg-cyan-50 border-cyan-400 text-cyan-950', desc: 'Feeling joyful and motivated' }
];

interface Props {
  selectedMood: MoodType | null;
  onSelectMood: (mood: MoodType) => void;
}

export const MoodSelector: React.FC<Props> = ({ selectedMood, onSelectMood }) => {
  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
        How are you feeling right now? <span className="text-emerald-600">*</span>
      </label>
      
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {MOODS.map((m) => {
          const isSelected = selectedMood === m.value;
          return (
            <motion.button
              key={m.value}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectMood(m.value)}
              className={`p-3.5 rounded-2xl border transition-all text-center flex flex-col items-center justify-center gap-1.5 focus:outline-none shadow-xs ${
                isSelected
                  ? m.selectedBg + ' ring-2 ring-emerald-500/30 shadow-md'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <span className="text-3xl select-none">{m.emoji}</span>
              <span className={`text-xs font-bold ${isSelected ? 'text-slate-900' : m.color}`}>
                {m.label}
              </span>
              <span className="text-[10px] text-slate-500 hidden sm:block line-clamp-1">
                {m.desc}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
