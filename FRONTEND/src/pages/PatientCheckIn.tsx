import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HeartPulse, CheckCircle2, Phone, ShieldCheck, ArrowRight, Sparkles, MessageSquare, Globe, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { MoodSelector } from '../components/MoodSelector';
import type { MoodType } from '../components/MoodSelector';
import { VoiceRecorder } from '../components/VoiceRecorder';
import { CheckInCalendar } from '../components/CheckInCalendar';
import { submitPatientCheckIn } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export const PatientCheckIn: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  // Step state: 'AUTH' -> 'CHECKIN' -> 'SUBMITTED'
  const [step, setStep] = useState<'AUTH' | 'CHECKIN' | 'SUBMITTED'>('AUTH');
  
  // Phone & OTP state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [authError, setAuthError] = useState('');

  // Check-in form state
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [journalText, setJournalText] = useState('');
  const [hasVoiceNote, setHasVoiceNote] = useState(false);
  const [voiceDuration, setVoiceDuration] = useState(0);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Phone + OTP verification
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      setAuthError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setAuthError('');
    setOtpSent(true);
    setOtp('4821'); // Auto-fill demo OTP
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== '4821') {
      setAuthError('Invalid OTP code. Please check your SMS.');
      return;
    }
    setAuthError('');
    setStep('CHECKIN');
  };

  // Submit Daily Check-in
  const handleSubmitCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMood) {
      alert(language === 'hi' ? 'कृपया जमा करने से पहले चुनें कि आप कैसा महसूस कर रहे हैं।' : 'Please select how you are feeling today before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitPatientCheckIn({
        phoneNumber,
        mood: selectedMood,
        journalText,
        hasVoiceNote,
        voiceDurationSeconds: voiceDuration,
        recordedTranscript: voiceTranscript
      });
      setSubmitMessage(res.message);
      setStep('SUBMITTED');
    } catch (err) {
      alert(language === 'hi' ? 'चेक-इन दर्ज करने में नेटवर्क समस्या। कृपया पुनः प्रयास करें।' : 'Network issue recording check-in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6f7f4] via-[#fefae0] to-[#e8f0fe] text-slate-900 flex flex-col justify-between relative overflow-hidden">
      
      {/* Soft Ambient Blobs (No leaves) */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-200/30 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-200/30 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col justify-between min-h-screen">
        <Navbar />

        {/* Language Switcher Bar & Role Switcher */}
      <div className="bg-white/80 border-b border-slate-200 py-2 px-4">
        <div className="max-w-xl mx-auto flex items-center justify-between text-xs">
          <Link
            to="/"
            className="flex items-center gap-1.5 font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-indigo-600" />
            <span>{language === 'hi' ? 'मुख्य पृष्ठ पर जाएं' : 'Switch Role / Home'}</span>
          </Link>

          {/* Language Toggle Pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <Globe className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-0.5 rounded-md font-bold text-[11px] transition-all ${
                language === 'en' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2.5 py-0.5 rounded-md font-bold text-[11px] transition-all ${
                language === 'hi' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              हिन्दी
            </button>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-6 sm:py-10 flex flex-col justify-center">
        
        {/* Step 1: Phone + OTP Access */}
        {step === 'AUTH' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header Banner */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-xs">
                <HeartPulse className="w-4 h-4 text-emerald-600 animate-pulse" />
                <span>{t.portalTitle}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {t.howAreYou}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                {t.subTitle}
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-white/60 backdrop-blur-xl border border-white hover:border-emerald-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-5">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      {t.phoneLabel}
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder={t.phonePlaceholder}
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        maxLength={10}
                        required
                      />
                    </div>
                  </div>

                  {authError && (
                    <p className="text-xs text-rose-600 font-bold">{authError}</p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    <span>{t.getOtpBtn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        {t.otpLabel}
                      </label>
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        className="text-[11px] font-semibold text-emerald-700 hover:underline"
                      >
                        {t.changeNumber} ({phoneNumber})
                      </button>
                    </div>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder={t.otpPlaceholder}
                      className="w-full tracking-widest text-center text-lg font-mono font-bold py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-emerald-700 focus:outline-none focus:border-emerald-500"
                      maxLength={4}
                      required
                    />
                    <p className="text-[11px] text-slate-500 text-center mt-1">
                      {t.otpDemoText}
                    </p>
                  </div>

                  {authError && (
                    <p className="text-xs text-rose-600 font-bold">{authError}</p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    <span>{t.verifyOtpBtn}</span>
                    <ShieldCheck className="w-4 h-4" />
                  </button>
                </form>
              )}

              <div className="pt-2 border-t border-slate-100 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t.confidentialNotice}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Daily Check-in Form */}
        {step === 'CHECKIN' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Greeting Header */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  {t.dailyCheckIn}
                </span>
                <span className="text-xs text-slate-500 font-mono">Mobile: {phoneNumber}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                {t.howAreYou}
              </h2>
            </div>

            {/* Check-in Form Card */}
            <form onSubmit={handleSubmitCheckIn} className="p-6 sm:p-8 rounded-3xl bg-white/60 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6">
              
              {/* Mood Selector */}
              <MoodSelector
                selectedMood={selectedMood}
                onSelectMood={(m) => setSelectedMood(m)}
              />

              {/* Text Journaling */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <span>{t.journalLabel}</span>
                  </label>
                  <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    {t.aiSafeguard}
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={journalText}
                  onChange={(e) => setJournalText(e.target.value)}
                  placeholder={t.journalPlaceholder}
                  className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Voice Note Recorder */}
              <VoiceRecorder
                onRecordingComplete={(hasRec, dur, transcript) => {
                  setHasVoiceNote(hasRec);
                  setVoiceDuration(dur);
                  setVoiceTranscript(transcript);
                }}
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !selectedMood}
                className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                  selectedMood
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-600/20'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    {t.submittingText}
                  </span>
                ) : (
                  <>
                    <span>{t.submitBtn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}

        {/* Step 3: Submitted Confirmation */}
        {step === 'SUBMITTED' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 rounded-3xl bg-white/60 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center space-y-6"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-300 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">{t.recordedSuccessTitle}</h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                {submitMessage || t.recordedSuccessMsg}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 text-left space-y-2">
              <p className="font-bold flex items-center gap-1.5 text-emerald-800">
                <HeartPulse className="w-4 h-4 text-emerald-600" />
                {t.teleManasNotice}
              </p>
              <p className="text-[11px] text-slate-700">
                If you or someone you know is in severe emotional distress, call toll-free helpline <strong>14416</strong> or <strong>1800-891-4416</strong> immediately.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
              <button
                onClick={() => setStep('CHECKIN')}
                className="w-full sm:w-1/2 px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all border border-slate-200"
              >
                {t.editCheckIn}
              </button>
              <button
                onClick={() => {
                  setStep('CHECKIN');
                  setSelectedMood(null);
                  setJournalText('');
                  setHasVoiceNote(false);
                }}
                className="w-full sm:w-1/2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
              >
                {t.submitAnotherBtn}
              </button>
            </div>
            
            {/* Calendar */}
            <CheckInCalendar 
              currentCheckIn={selectedMood ? { 
                date: '2026-09-10', 
                mood: selectedMood, 
                journal: journalText 
              } : undefined} 
            />
          </motion.div>
        )}

      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-200 bg-white/60 backdrop-blur-md">
        SAHAY Portal — Mental Health Support System (Smart India Hackathon 2026)
      </footer>
      </div>
    </div>
  );
};
