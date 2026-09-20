import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HeartPulse, Phone, ArrowRight, Home, Globe, UserCheck, Lock, LogIn, UserPlus, ShieldCheck } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { useLanguage } from '../context/LanguageContext';
import { MoodSelector } from '../components/MoodSelector';
import type { MoodType } from '../components/MoodSelector';
import { VoiceRecorder } from '../components/VoiceRecorder';

export const PatientCheckIn: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Master Step state: 'AUTH' -> 'CHECKIN' -> 'SUBMITTED'
  const [step] = useState<'AUTH' | 'CHECKIN' | 'SUBMITTED'>(() => {
    return searchParams.get('skipAuth') === 'true' ? 'CHECKIN' : 'AUTH';
  });

  // Auth Sub-flow
  const [authMode, setAuthMode] = useState<'CHOICE' | 'LOGIN' | 'LOGIN_OTP' | 'SIGNUP' | 'SIGNUP_OTP'>('CHOICE');
  
  // Form fields
  const [phoneNumber, setPhoneNumber] = useState('');
  const [patientName, setPatientName] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [authError, setAuthError] = useState('');

  // Checkin states
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [journalText, setJournalText] = useState('');
  const [energyLevel, setEnergyLevel] = useState<number>(7);
  const [stressLevel, setStressLevel] = useState<number>(4);
  const [sleepHours, setSleepHours] = useState<number>(7);
  const [sleepMinutes, setSleepMinutes] = useState<number>(30);
  const [hasRecordedVoice, setHasRecordedVoice] = useState<boolean>(false);
  const [voiceTranscript, setVoiceTranscript] = useState<string>('');
  
  const [isSubmitting] = useState(false);

  // Load registered users from local storage
  const getRegisteredUsers = () => {
    const data = localStorage.getItem('sahay_registered_users');
    return data ? JSON.parse(data) : {};
  };

  const saveRegisteredUser = (user: any) => {
    const users = getRegisteredUsers();
    users[user.phone] = user;
    localStorage.setItem('sahay_registered_users', JSON.stringify(users));
  };

  // Login Handlers
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      setAuthError(language === 'hi' ? 'कृपया एक वैध 10-अंकीय मोबाइल नंबर दर्ज करें।' : 'Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!password) {
      setAuthError(language === 'hi' ? 'कृपया अपना पासवर्ड दर्ज करें।' : 'Please enter your password.');
      return;
    }
    const users = getRegisteredUsers();
    const user = users[phoneNumber];
    if (!user) {
      setAuthError(language === 'hi' ? 'कोई खाता नहीं मिला। कृपया साइन अप करें।' : 'Account not found. Please sign up.');
      return;
    }
    if (user.password !== password) {
      setAuthError(language === 'hi' ? 'गलत पासवर्ड।' : 'Incorrect password.');
      return;
    }
    setAuthError('');
    setPatientName(user.name);
    setAuthMode('LOGIN_OTP');
    setOtp('4821'); // Auto-fill demo OTP
  };

  // Signup Handlers
  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      setAuthError(language === 'hi' ? 'कृपया अपना नाम दर्ज करें।' : 'Please enter your name.');
      return;
    }
    if (!phoneNumber || phoneNumber.length < 10) {
      setAuthError(language === 'hi' ? 'कृपया एक वैध 10-अंकीय मोबाइल नंबर दर्ज करें।' : 'Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!password || password.length < 6) {
      setAuthError(language === 'hi' ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।' : 'Password must be at least 6 characters.');
      return;
    }

    const users = getRegisteredUsers();
    if (users[phoneNumber]) {
      setAuthError(language === 'hi' ? 'यह नंबर पहले से पंजीकृत है। कृपया लॉग इन करें।' : 'This number is already registered. Please log in.');
      return;
    }

    setAuthError('');
    setAuthMode('SIGNUP_OTP');
    setOtp('4821'); // Auto-fill demo OTP
  };

  const handleVerifyOtp = (e: React.FormEvent, isSignup: boolean) => {
    e.preventDefault();
    if (otp !== '4821') {
      setAuthError(language === 'hi' ? 'अमान्य OTP कोड।' : 'Invalid OTP code.');
      return;
    }
    setAuthError('');
    
    if (isSignup) {
      saveRegisteredUser({
        phone: phoneNumber,
        name: patientName,
        password: password
      });
      
      // Initialize an empty dashboard structure for new user if needed
      if (!localStorage.getItem(`sahay_data_${phoneNumber}`)) {
        localStorage.setItem(`sahay_data_${phoneNumber}`, JSON.stringify({
          appointments: { upcoming: [], past: [] },
          checklist: [
            { id: 1, text: 'Drink 2L of water', done: false },
            { id: 2, text: 'Take medication', done: false }
          ],
          profilePic: null
        }));
      }
    }

    localStorage.setItem('sahay_patient_name', patientName);
    localStorage.setItem('sahay_patient_phone', phoneNumber);
    localStorage.setItem('sahay_active_user_phone', phoneNumber); // Explicit active user
    
    navigate('/patient/dashboard');
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat text-slate-900 flex flex-col justify-between relative overflow-hidden" style={{ backgroundImage: 'url(/landing-bg.jpg)' }}>
      
      {/* Soft Ambient Blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-200/30 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-200/30 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col justify-between min-h-screen">
        <Navbar />

        <div className="bg-white/80 border-b border-slate-200 py-2 px-4">
          <div className="max-w-xl mx-auto flex items-center justify-between text-xs">
            <Link to="/" className="flex items-center gap-1.5 font-bold text-slate-600 hover:text-slate-900 transition-colors">
              <Home className="w-3.5 h-3.5 text-indigo-600" />
              <span>{language === 'hi' ? 'मुख्य पृष्ठ पर जाएं' : 'Switch Role / Home'}</span>
            </Link>
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <Globe className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
              <button onClick={() => setLanguage('en')} className={`px-2.5 py-0.5 rounded-md font-bold text-[11px] transition-all ${language === 'en' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}>English</button>
              <button onClick={() => setLanguage('hi')} className={`px-2.5 py-0.5 rounded-md font-bold text-[11px] transition-all ${language === 'hi' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}>हिन्दी</button>
            </div>
          </div>
        </div>

        <main className="flex-1 max-w-xl w-full mx-auto px-4 py-6 sm:py-10 flex flex-col justify-center">
          
          {step === 'AUTH' && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-xs">
                  <HeartPulse className="w-4 h-4 text-emerald-600 animate-pulse" />
                  <span>{t.portalTitle}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {authMode === 'CHOICE' ? (language === 'hi' ? 'स्वागत है' : 'Welcome') : 
                   authMode.includes('LOGIN') ? (language === 'hi' ? 'वापसी पर स्वागत है' : 'Welcome Back') : 
                   (language === 'hi' ? 'खाता बनाएं' : 'Create Account')}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  {authMode === 'CHOICE' ? (language === 'hi' ? 'कृपया अपनी पहचान सत्यापित करें।' : 'Please authenticate to access your dashboard.') :
                   authMode.includes('OTP') ? (language === 'hi' ? 'आपके फोन पर भेजा गया 4-अंकीय कोड दर्ज करें' : 'Enter the 4-digit code sent to your phone') :
                   (language === 'hi' ? 'जारी रखने के लिए अपने विवरण दर्ज करें।' : 'Enter your details to continue.')}
                </p>
              </div>

              <div className="p-6 sm:p-8 rounded-3xl bg-white/60 backdrop-blur-xl border border-white hover:border-emerald-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-5 transition-all">
                
                {authMode === 'CHOICE' && (
                  <div className="space-y-4">
                    <button onClick={() => setAuthMode('LOGIN')} className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-2xl shadow-sm transition-all text-sm">
                      <LogIn className="w-4 h-4" /> {language === 'hi' ? 'लॉग इन करें' : 'Log In'}
                    </button>
                    <button onClick={() => setAuthMode('SIGNUP')} className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-emerald-700 border border-emerald-200 font-bold py-3.5 px-4 rounded-2xl shadow-sm transition-all text-sm">
                      <UserPlus className="w-4 h-4" /> {language === 'hi' ? 'साइन अप करें' : 'Sign Up'}
                    </button>
                  </div>
                )}

                {authMode === 'LOGIN' && (
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        {t.phoneLabel}
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                        <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder={t.phonePlaceholder} className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        {language === 'hi' ? 'पासवर्ड' : 'Password'}
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                      </div>
                    </div>
                    {authError && <p className="text-rose-500 text-xs font-bold bg-rose-50 p-2 rounded-lg">{authError}</p>}
                    <button type="submit" className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-2xl shadow-sm transition-all text-sm mt-2">
                      {language === 'hi' ? 'लॉग इन करें' : 'Log In'} <ArrowRight className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => setAuthMode('CHOICE')} className="w-full text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors py-2">
                      {language === 'hi' ? 'वापस जाएँ' : 'Go Back'}
                    </button>
                  </form>
                )}

                {authMode === 'SIGNUP' && (
                  <form onSubmit={handleSignupSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        {language === 'hi' ? 'आपका नाम' : 'Your Name'}
                      </label>
                      <div className="relative">
                        <UserCheck className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                        <input type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder={language === 'hi' ? 'अपना नाम दर्ज करें' : 'Enter your full name'} className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        {t.phoneLabel}
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                        <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder={t.phonePlaceholder} className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        {language === 'hi' ? 'पासवर्ड सेट करें' : 'Set Password'}
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" />
                      </div>
                    </div>
                    {authError && <p className="text-rose-500 text-xs font-bold bg-rose-50 p-2 rounded-lg">{authError}</p>}
                    <button type="submit" className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-2xl shadow-sm transition-all text-sm mt-2">
                      {language === 'hi' ? 'खाता बनाएं' : 'Create Account'} <ArrowRight className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => setAuthMode('CHOICE')} className="w-full text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors py-2">
                      {language === 'hi' ? 'वापस जाएँ' : 'Go Back'}
                    </button>
                  </form>
                )}

                {(authMode === 'LOGIN_OTP' || authMode === 'SIGNUP_OTP') && (
                  <form onSubmit={(e) => handleVerifyOtp(e, authMode === 'SIGNUP_OTP')} className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                          {t.otpLabel}
                        </label>
                        <button type="button" onClick={() => setAuthMode(authMode === 'SIGNUP_OTP' ? 'SIGNUP' : 'LOGIN')} className="text-[11px] font-semibold text-emerald-700 hover:underline">
                          {t.changeNumber} ({phoneNumber})
                        </button>
                      </div>
                      <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder={t.otpPlaceholder} className="w-full tracking-widest text-center text-lg font-mono font-bold py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-emerald-700 focus:outline-none focus:border-emerald-500" maxLength={4} />
                    </div>
                    {authError && <p className="text-rose-500 text-xs font-bold bg-rose-50 p-2 rounded-lg">{authError}</p>}
                    <button type="submit" className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-2xl shadow-sm transition-all text-sm mt-2">
                      <ShieldCheck className="w-4 h-4" /> {language === 'hi' ? 'सत्यापित करें' : 'Verify'}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          )}
          
          {step === 'CHECKIN' && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
               <div className="text-center">
                 <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{t.dashBannerTitle} {patientName}?</h2>
                 <p className="text-slate-500 mt-2 text-sm">{t.dashBannerSub}</p>
               </div>
               
               <form onSubmit={async (e) => { 
                 e.preventDefault(); 
                 if (!selectedMood) return;
                 
                 const sleepStr = `${sleepHours}h ${sleepMinutes < 10 ? '0' : ''}${sleepMinutes}m`;
                 const moodList: MoodType[] = ['Very Low', 'Low', 'Neutral', 'Good', 'Great'];
                 const moodIndex = moodList.indexOf(selectedMood);

                 const newCheckIn = {
                   date: new Date().toISOString().split('T')[0],
                   mood: selectedMood,
                   journal: journalText.trim(),
                   energy: energyLevel,
                   stress: stressLevel,
                   sleep: sleepStr,
                   hasVoiceNote: hasRecordedVoice,
                   voiceTranscript: voiceTranscript
                 };

                 const phone = localStorage.getItem('sahay_patient_phone') || localStorage.getItem('sahay_active_user_phone');
                 if (phone) {
                   const histStr = localStorage.getItem(`sahay_history_${phone}`);
                   const hist = histStr ? JSON.parse(histStr) : [];
                   const filtered = hist.filter((h: any) => h.date !== newCheckIn.date);
                   filtered.push(newCheckIn);
                   localStorage.setItem(`sahay_history_${phone}`, JSON.stringify(filtered));
                 }

                 localStorage.setItem('sahay_last_mood', String(moodIndex >= 0 ? moodIndex : 3));
                 localStorage.setItem('sahay_last_journal', journalText.trim());
                 localStorage.setItem('sahay_last_energy', String(energyLevel));
                 localStorage.setItem('sahay_last_stress', String(stressLevel));
                 localStorage.setItem('sahay_last_sleep', sleepStr);
                 localStorage.setItem('sahay_has_voice_note', String(hasRecordedVoice));

                 navigate('/patient/dashboard'); 
               }} className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-200/40 space-y-8">
                 
                 {/* Mood Selection */}
                 <div>
                   <label className="block text-sm font-bold text-slate-800 mb-4">{language === 'hi' ? 'आज आप कैसा महसूस कर रहे हैं?' : 'How are you feeling today?'}</label>
                   <MoodSelector selectedMood={selectedMood} onSelectMood={setSelectedMood} />
                 </div>

                 {/* Energy & Stress 1-10 Ratings */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                   <div>
                     <div className="flex justify-between items-center mb-2">
                       <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                         {language === 'hi' ? 'ऊर्जा का स्तर (1-10)' : 'Energy Level (1-10)'}
                       </label>
                       <span className="text-xs font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md">{energyLevel}/10</span>
                     </div>
                     <div className="flex items-center gap-1">
                       {Array.from({ length: 10 }).map((_, i) => (
                         <button
                           key={i}
                           type="button"
                           onClick={() => setEnergyLevel(i + 1)}
                           className={`flex-1 h-8 rounded-lg text-xs font-bold transition-all ${
                             i < energyLevel ? 'bg-amber-400 text-amber-950 shadow-xs scale-105' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                           }`}
                         >
                           {i + 1}
                         </button>
                       ))}
                     </div>
                   </div>

                   <div>
                     <div className="flex justify-between items-center mb-2">
                       <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                         {language === 'hi' ? 'तनाव का स्तर (1-10)' : 'Stress Level (1-10)'}
                       </label>
                       <span className="text-xs font-bold px-2 py-0.5 bg-rose-100 text-rose-800 rounded-md">{stressLevel}/10</span>
                     </div>
                     <div className="flex items-center gap-1">
                       {Array.from({ length: 10 }).map((_, i) => (
                         <button
                           key={i}
                           type="button"
                           onClick={() => setStressLevel(i + 1)}
                           className={`flex-1 h-8 rounded-lg text-xs font-bold transition-all ${
                             i < stressLevel ? 'bg-rose-400 text-rose-950 shadow-xs scale-105' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                           }`}
                         >
                           {i + 1}
                         </button>
                       ))}
                     </div>
                   </div>
                 </div>

                 {/* Sleep Duration Input */}
                 <div className="pt-4 border-t border-slate-100">
                   <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                     {language === 'hi' ? 'नींद की अवधि (घंटे / मिनट)' : 'Sleep Duration (Hours / Minutes)'}
                   </label>
                   <div className="flex items-center gap-4">
                     <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-2 px-4">
                       <input
                         type="number"
                         min="0"
                         max="24"
                         value={sleepHours}
                         onChange={(e) => setSleepHours(Math.max(0, Math.min(24, parseInt(e.target.value) || 0)))}
                         className="w-12 bg-transparent font-bold text-center text-slate-800 focus:outline-none"
                       />
                       <span className="text-xs font-bold text-slate-400">{language === 'hi' ? 'घंटे' : 'hrs'}</span>
                     </div>
                     <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-2 px-4">
                       <input
                         type="number"
                         min="0"
                         max="59"
                         value={sleepMinutes}
                         onChange={(e) => setSleepMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                         className="w-12 bg-transparent font-bold text-center text-slate-800 focus:outline-none"
                       />
                       <span className="text-xs font-bold text-slate-400">{language === 'hi' ? 'मिनट' : 'mins'}</span>
                     </div>
                   </div>
                 </div>

                 {/* Journal & Voice Note */}
                 <div className="space-y-4 pt-4 border-t border-slate-100">
                   <div>
                     <label className="block text-sm font-bold text-slate-800 mb-2">{language === 'hi' ? 'जर्नल' : 'Journal'}</label>
                     <p className="text-xs text-slate-500 mb-3">{language === 'hi' ? 'कुछ और शेयर करना चाहते हैं?' : 'Anything else you want to share?'}</p>
                     <textarea value={journalText} onChange={(e) => setJournalText(e.target.value)} rows={3} className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" placeholder={language === 'hi' ? 'यहां लिखें...' : 'Write here...'} />
                   </div>
                   <VoiceRecorder onRecordingComplete={(hasRec, _, transcript) => {
                     setHasRecordedVoice(hasRec);
                     setVoiceTranscript(transcript || '');
                   }} />
                 </div>

                 <button type="submit" disabled={!selectedMood || isSubmitting} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-sm">
                   {isSubmitting ? '...' : (language === 'hi' ? 'चेक-इन करें' : 'Check In')} <ArrowRight className="w-5 h-5" />
                 </button>
               </form>
            </motion.div>
          )}

        </main>

        <footer className="py-6 text-center text-xs font-medium text-slate-400">
          <p>© 2026 SIH Tele-MANAS Integrated Platform. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};
