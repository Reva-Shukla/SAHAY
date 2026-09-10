import React, { useState, useEffect } from 'react';
import { Mic, Square, Trash2, CheckCircle2, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

interface Props {
  onRecordingComplete: (hasRecording: boolean, durationSeconds: number, transcript: string) => void;
}

export const VoiceRecorder: React.FC<Props> = ({ onRecordingComplete }) => {
  const { t, language } = useLanguage();
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isRecording) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStart = () => {
    setSeconds(0);
    setIsRecording(true);
    setHasCompleted(false);
  };

  const mockTranscriptEn = "I've been feeling continuous pressure in my chest since morning and having trouble sleeping peaceful thoughts...";
  const mockTranscriptHi = "मुझे सुबह से ही सीने में लगातार दबाव महसूस हो रहा है और शांतिपूर्ण नींद लेने में परेशानी हो रही है...";

  const handleStop = () => {
    setIsRecording(false);
    setHasCompleted(true);
    const mockTranscript = language === 'hi' ? mockTranscriptHi : mockTranscriptEn;
    onRecordingComplete(true, seconds, mockTranscript);
  };

  const handleReset = () => {
    setIsRecording(false);
    setSeconds(0);
    setHasCompleted(false);
    setIsPlaying(false);
    onRecordingComplete(false, 0, "");
  };

  return (
    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 shadow-xs">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <Mic className="w-4 h-4 text-emerald-600" />
          <span>{t.voiceLabel}</span>
        </label>
        {isRecording && (
          <span className="flex items-center gap-1.5 text-xs text-rose-600 font-mono font-bold animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            {t.recordingText} {seconds}s
          </span>
        )}
      </div>

      {!hasCompleted ? (
        <div className="flex items-center gap-3">
          {!isRecording ? (
            <button
              type="button"
              onClick={handleStart}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 text-xs font-bold transition-all shadow-xs"
            >
              <Mic className="w-4 h-4 text-emerald-600" />
              <span>{t.tapToRecord}</span>
            </button>
          ) : (
            <div className="flex items-center gap-3 w-full">
              {/* Simulated Waveform Animation */}
              <div className="flex-1 flex items-center justify-center gap-1 h-8 bg-white rounded-xl px-3 border border-slate-200">
                {[40, 75, 30, 90, 55, 80, 45, 100, 60, 35, 85].map((h, idx) => (
                  <motion.div
                    key={idx}
                    animate={{ height: isRecording ? [`${h * 0.3}%`, `${h}%`, `${h * 0.4}%`] : '20%' }}
                    transition={{ repeat: Infinity, duration: 0.6 + idx * 0.1 }}
                    className="w-1 bg-emerald-500 rounded-full"
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleStop}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md transition-all"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>{language === 'hi' ? 'संपन्न' : 'Done'}</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
          <div className="flex items-center justify-between text-xs text-emerald-900">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="font-bold">{t.recordingDone} ({seconds}s)</span>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
              title="Delete recording"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Audio Playback Simulator */}
          <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-emerald-200 shadow-xs">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded-full bg-emerald-600 text-white hover:bg-emerald-500 text-xs"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
            <div className="flex-1 text-[11px] text-slate-700 italic line-clamp-1">
              "{language === 'hi' ? mockTranscriptHi.substring(0, 70) + '...' : mockTranscriptEn.substring(0, 68) + '...'}"
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
