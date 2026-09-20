import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, Phone, Search, Users, Wind, Shield, 
  Database, FileText, MessageSquareWarning, X, HeartPulse, CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface TrustedContact {
  name: string;
  relationship: string;
  phone: string;
}

export const SupportTab: React.FC = () => {
  const { t } = useLanguage();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Report a Problem State
  const [reportIssueType, setReportIssueType] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportEmail, setReportEmail] = useState('');
  const [reportPhone, setReportPhone] = useState('');
  const [reportError, setReportError] = useState<string | null>(null);
  const [reportSuccess, setReportSuccess] = useState(false);

  // Trusted Contact State
  const [trustedContact, setTrustedContact] = useState<TrustedContact | null>(() => {
    const saved = localStorage.getItem('sahay_trusted_contact');
    return saved ? JSON.parse(saved) : null;
  });
  const [newContact, setNewContact] = useState<TrustedContact>({ name: '', relationship: '', phone: '' });

  // Breathing Exercise State
  const [breathingPhase, setBreathingPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [timeLeft, setTimeLeft] = useState(60);
  const [isBreathingActive, setIsBreathingActive] = useState(false);

  // Distress Score (Mocking from recent checkin for now, or using local storage if available)
  // Let's assume a mock score if none exists
  const [distressScore] = useState<number>(() => {
    // 0-4 scale: 0: severe, 1: low, 2: neutral, 3: good, 4: thriving
    // Re-mapped to distress levels: 
    // Usually mood 0, 1 -> HIGH/CRITICAL
    // Mood 2 -> MODERATE
    // Mood 3, 4 -> LOW
    const lastMood = localStorage.getItem('sahay_last_mood');
    return lastMood ? parseInt(lastMood) : 2; // default moderate
  });

  const getDistressLevelInfo = (score: number) => {
    // Using the same mood scale (0 = Severe Distress to 4 = Thriving)
    if (score <= 1) return { level: 'HIGH', label: 'Higher Distress', color: 'text-rose-600', bg: 'bg-rose-50' };
    if (score === 2) return { level: 'MODERATE', label: 'Moderate Distress', color: 'text-amber-600', bg: 'bg-amber-50' };
    return { level: 'LOW', label: 'Low Distress', color: 'text-emerald-600', bg: 'bg-emerald-50' };
  };

  const distressInfo = getDistressLevelInfo(distressScore);

  // Handle Breathing Exercise
  useEffect(() => {
    let timer: any;
    if (isBreathingActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        const cycle = 60 - timeLeft; // 0 to 60
        const phaseInCycle = cycle % 10; // 10 second cycle
        if (phaseInCycle < 4) setBreathingPhase('Inhale'); // 0-3
        else if (phaseInCycle < 6) setBreathingPhase('Hold'); // 4-5
        else setBreathingPhase('Exhale'); // 6-9
      }, 1000);
    } else if (timeLeft === 0) {
      setIsBreathingActive(false);
    }
    return () => clearInterval(timer);
  }, [isBreathingActive, timeLeft]);

  const saveTrustedContact = () => {
    localStorage.setItem('sahay_trusted_contact', JSON.stringify(newContact));
    setTrustedContact(newContact);
    setActiveModal(null);
  };

  const confirmEmergencyCall = () => {
    if (window.confirm("If you are in immediate danger, please contact emergency services now.")) {
      window.location.href = "tel:112";
    }
  };

  const handleDeleteData = () => {
    // Delete patient specific local storage
    localStorage.removeItem('sahay_patient_name');
    localStorage.removeItem('sahay_patient_phone');
    localStorage.removeItem('sahay_last_mood');
    localStorage.removeItem('sahay_trusted_contact');
    alert("Data deleted successfully.");
    setActiveModal(null);
  };

  const closeModal = () => {
    setActiveModal(null);
    setIsBreathingActive(false);
    setTimeLeft(60);
  };

  const triggerStillNeedHelp = () => {
    setActiveModal('support_options');
    try {
      const savedChats = localStorage.getItem('sahay_chats');
      const chats = savedChats ? JSON.parse(savedChats) : {};
      const defaultCaseId = "Case #4821";
      const timestamp = Date.now();
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const urgentMsg = {
        id: `urgent-${timestamp}`,
        caseId: defaultCaseId,
        text: "🚨 I Still Need Help - Patient requested urgent assistance",
        sender: "patient",
        time: timeStr,
        timestamp,
        type: "text",
        isHighPriority: true
      };
      
      chats[defaultCaseId] = [...(chats[defaultCaseId] || []), urgentMsg];
      localStorage.setItem('sahay_chats', JSON.stringify(chats));

      const highPriorityCases = JSON.parse(localStorage.getItem('sahay_high_priority_cases') || '[]');
      if (!highPriorityCases.includes(defaultCaseId)) {
        highPriorityCases.push(defaultCaseId);
        localStorage.setItem('sahay_high_priority_cases', JSON.stringify(highPriorityCases));
      }
    } catch (err) {
      console.error("Error triggering high priority chat flag:", err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Support & Safety</h2>
        <p className="text-slate-600 font-medium">Whatever you're going through, you don't have to handle it alone.</p>
      </div>

      {/* Distress Based Recommendations */}
      <div className={`${distressInfo.bg} rounded-3xl p-6 border border-slate-100 shadow-sm`}>
        <div className="flex items-center gap-3 mb-4">
          <HeartPulse className={`w-6 h-6 ${distressInfo.color}`} />
          <h3 className="font-bold text-slate-800">Based on your recent check-in</h3>
        </div>
        <p className="text-sm text-slate-600 mb-4">Your responses indicate a <span className={`font-bold ${distressInfo.color}`}>{distressInfo.label.toLowerCase()}</span>. Here are recommended next steps:</p>
        <div className="flex flex-wrap gap-3">
          {distressInfo.level === 'LOW' && (
            <>
              <button onClick={() => setActiveModal('grounding')} className="bg-white px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors">Breathing exercise</button>
              <button className="bg-white px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors">Daily check-in</button>
            </>
          )}
          {distressInfo.level === 'MODERATE' && (
            <>
              <button onClick={() => setActiveModal('grounding')} className="bg-white px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors">Grounding exercise</button>
              <button onClick={() => setActiveModal('trusted_contact')} className="bg-white px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors">Talk to someone</button>
              <button onClick={() => setActiveModal('professional')} className="bg-white px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors">Professional support</button>
            </>
          )}
          {distressInfo.level === 'HIGH' && (
            <>
              <button onClick={() => setActiveModal('professional')} className="bg-white px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors">Professional support</button>
              <button onClick={() => setActiveModal('trusted_contact')} className="bg-white px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors">Trusted contact</button>
              <button className="bg-rose-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-rose-700 transition-colors">Crisis resources</button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* I NEED HELP RIGHT NOW */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">I Need Help Right Now</h3>
            <p className="text-sm text-slate-500">If you feel unsafe, overwhelmed, or unable to cope, please reach out for immediate support.</p>
          </div>

          <div className="space-y-4">
            {/* Emergency Help */}
            <div className="bg-rose-50 border border-rose-100 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6 text-rose-600" />
                </div>
                <div>
                  <h4 className="font-bold text-rose-900">Emergency Help</h4>
                  <p className="text-xs text-rose-700 mt-1 max-w-xs">If you are in immediate danger or believe you may hurt yourself or someone else, contact emergency services.</p>
                </div>
              </div>
              <button onClick={confirmEmergencyCall} className="w-full sm:w-auto px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-colors shadow-sm shrink-0 whitespace-nowrap">
                Call 112
              </button>
            </div>

            {/* Helpline */}
            <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-md transition-shadow">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Mental Health Helpline</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Tele-MANAS (24/7 Toll-Free)</p>
                </div>
              </div>
              <a href="tel:14416" className="w-full sm:w-auto px-6 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold rounded-xl transition-colors text-center shrink-0">
                Call 14416
              </a>
            </div>

            {/* Grounding Help */}
            <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-md transition-shadow">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center shrink-0">
                  <Wind className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Quick Grounding Help</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Simple 60-second breathing exercise.</p>
                </div>
              </div>
              <button onClick={() => setActiveModal('grounding')} className="w-full sm:w-auto px-6 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold rounded-xl transition-colors shrink-0">
                Help Me Calm Down
              </button>
            </div>

            {/* Trusted Contact */}
            <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-md transition-shadow">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Talk to Someone You Trust</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{trustedContact ? `${trustedContact.name} (${trustedContact.relationship})` : 'Add a trusted contact to call quickly.'}</p>
                </div>
              </div>
              {trustedContact ? (
                 <a href={`tel:${trustedContact.phone}`} className="w-full sm:w-auto px-6 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-bold rounded-xl transition-colors text-center shrink-0">
                   Call Contact
                 </a>
              ) : (
                <button onClick={() => setActiveModal('trusted_contact')} className="w-full sm:w-auto px-6 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-bold rounded-xl transition-colors shrink-0">
                  Add Contact
                </button>
              )}
            </div>

            {/* Professional Support */}
            <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-md transition-shadow">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                  <Search className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Find Professional Support</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Locate counsellors, psychologists, or clinics.</p>
                </div>
              </div>
              <button onClick={() => setActiveModal('professional')} className="w-full sm:w-auto px-6 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold rounded-xl transition-colors shrink-0">
                Find Support
              </button>
            </div>
          </div>
        </div>

        {/* SAFETY & PRIVACY */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">Safety & Privacy</h3>
            <p className="text-sm text-slate-500">Your wellbeing matters, and so does your privacy.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <button onClick={() => setActiveModal('data_protection')} className="bg-white border border-slate-200 p-5 rounded-2xl text-left hover:shadow-md transition-shadow group flex flex-col gap-3">
              <Shield className="w-6 h-6 text-indigo-500 group-hover:scale-110 transition-transform" />
              <div>
                <h4 className="font-bold text-slate-900">How My Data Is Protected</h4>
                <p className="text-xs text-slate-500 mt-1">Learn about data collection, storage, and privacy.</p>
              </div>
            </button>

            <button onClick={() => setActiveModal('distress_tracking')} className="bg-white border border-slate-200 p-5 rounded-2xl text-left hover:shadow-md transition-shadow group flex flex-col gap-3">
              <HeartPulse className="w-6 h-6 text-emerald-500 group-hover:scale-110 transition-transform" />
              <div>
                <h4 className="font-bold text-slate-900">How Distress Tracking Works</h4>
                <p className="text-xs text-slate-500 mt-1">Understand what your score means.</p>
              </div>
            </button>

            <button onClick={() => setActiveModal('manage_data')} className="bg-white border border-slate-200 p-5 rounded-2xl text-left hover:shadow-md transition-shadow group flex flex-col gap-3">
              <Database className="w-6 h-6 text-slate-500 group-hover:scale-110 transition-transform" />
              <div>
                <h4 className="font-bold text-slate-900">Manage My Data</h4>
                <p className="text-xs text-slate-500 mt-1">View or delete your stored data.</p>
              </div>
            </button>

            <button onClick={() => setActiveModal('privacy_policy')} className="bg-white border border-slate-200 p-5 rounded-2xl text-left hover:shadow-md transition-shadow group flex flex-col gap-3">
              <FileText className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" />
              <div>
                <h4 className="font-bold text-slate-900">Privacy Policy</h4>
                <p className="text-xs text-slate-500 mt-1">Read our full privacy policy.</p>
              </div>
            </button>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl hover:shadow-md transition-shadow">
             <div className="flex items-center gap-3 mb-4">
               <MessageSquareWarning className="w-5 h-5 text-amber-500" />
               <h4 className="font-bold text-slate-900">Report a Problem</h4>
             </div>
             {reportSuccess ? (
               <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-center space-y-2">
                 <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                 <h5 className="font-bold text-emerald-900 text-sm">{t.reportSubmittedSuccess}</h5>
                 <button
                   onClick={() => { setReportSuccess(false); setReportIssueType(''); setReportDescription(''); setReportEmail(''); setReportPhone(''); }}
                   className="text-xs font-bold text-emerald-700 hover:underline pt-1"
                 >
                   Submit another report
                 </button>
               </div>
             ) : (
               <form 
                 onSubmit={(e) => {
                   e.preventDefault();
                   setReportError(null);
                   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                   if (!emailRegex.test(reportEmail.trim())) {
                     setReportError(t.emailRequiredErr);
                     return;
                   }
                   const cleanPhone = reportPhone.replace(/[\s-]/g, '');
                   if (cleanPhone.length < 10) {
                     setReportError(t.phoneRequiredErr);
                     return;
                   }

                   try {
                     const existing = JSON.parse(localStorage.getItem('sahay_problem_reports') || '[]');
                     const newReport = {
                       id: `rep-${Date.now()}`,
                       issueType: reportIssueType,
                       description: reportDescription.trim(),
                       email: reportEmail.trim(),
                       phone: reportPhone.trim(),
                       timestamp: new Date().toISOString()
                     };
                     localStorage.setItem('sahay_problem_reports', JSON.stringify([...existing, newReport]));
                     setReportSuccess(true);
                   } catch (err) {
                     console.error("Failed to save report", err);
                   }
                 }} 
                 className="space-y-3"
               >
                 {reportError && (
                   <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 rounded-xl text-xs font-bold">
                     {reportError}
                   </div>
                 )}
                 <select 
                   value={reportIssueType}
                   onChange={e => setReportIssueType(e.target.value)}
                   className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500" 
                   required
                 >
                   <option value="">Select issue type</option>
                   <option value="technical">Technical Issue</option>
                   <option value="privacy">Privacy Concern</option>
                   <option value="counsellor">Counsellor Interaction</option>
                   <option value="other">Other Concern</option>
                 </select>
                 <textarea 
                   value={reportDescription}
                   onChange={e => setReportDescription(e.target.value)}
                   placeholder="Describe the issue..." 
                   rows={3} 
                   className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500" 
                   required
                 ></textarea>
                 <div>
                   <label className="text-[11px] font-bold text-slate-500 block mb-1">{t.emailLabel} *</label>
                   <input 
                     type="email" 
                     value={reportEmail}
                     onChange={e => setReportEmail(e.target.value)}
                     placeholder="e.g. user@example.com" 
                     className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500" 
                     required 
                   />
                 </div>
                 <div>
                   <label className="text-[11px] font-bold text-slate-500 block mb-1">{t.phoneLabelRequired} *</label>
                   <input 
                     type="tel" 
                     value={reportPhone}
                     onChange={e => setReportPhone(e.target.value)}
                     placeholder="e.g. 9876543210" 
                     className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500" 
                     required 
                   />
                 </div>
                 <button type="submit" className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-colors">Submit Report</button>
               </form>
             )}
          </div>

        </div>
      </div>

      <div className="pt-8 border-t border-slate-200/60 pb-8 text-center">
        <p className="text-xs text-slate-400 max-w-3xl mx-auto leading-relaxed">
          This platform is intended for wellness support and early awareness. It does not provide medical diagnosis or replace professional mental health care. If you are in immediate danger, contact emergency services or seek urgent professional help.
        </p>
      </div>

      {/* Modals Overlay */}
      {activeModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <button onClick={closeModal} className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
              <X className="w-4 h-4" />
            </button>

            {/* Grounding Exercise Modal */}
            {activeModal === 'grounding' && (
              <div className="text-center space-y-6 pt-2">
                <h3 className="text-xl font-bold text-slate-900">Grounding Exercise</h3>
                <p className="text-sm text-slate-500">Follow the circle and focus on your breath for 60 seconds.</p>
                
                <div className="flex items-center justify-center py-8">
                  <div className={`w-40 h-40 rounded-full flex items-center justify-center transition-all duration-1000 ${
                    breathingPhase === 'Inhale' ? 'scale-110 bg-emerald-100 border-8 border-emerald-200' :
                    breathingPhase === 'Hold' ? 'scale-110 bg-emerald-50 border-8 border-emerald-200' :
                    'scale-90 bg-emerald-50 border-8 border-emerald-100'
                  }`}>
                    <span className="text-2xl font-extrabold text-emerald-700 tracking-wider animate-pulse">{breathingPhase}</span>
                  </div>
                </div>

                <div className="font-mono text-2xl font-bold text-slate-700">00:{timeLeft.toString().padStart(2, '0')}</div>

                {!isBreathingActive ? (
                  <button onClick={() => { setIsBreathingActive(true); setTimeLeft(60); }} className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-sm">
                    Start Exercise
                  </button>
                ) : (
                  <button onClick={() => setIsBreathingActive(false)} className="px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors shadow-sm">
                    Pause
                  </button>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-100">
                  <button onClick={closeModal} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors">I'm Feeling Better</button>
                  <button onClick={triggerStillNeedHelp} className="flex-1 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-sm transition-colors">I Still Need Help</button>
                </div>
              </div>
            )}

            {/* Redirect back to support options from Grounding */}
            {activeModal === 'support_options' && (
              <div className="text-center space-y-6 pt-2">
                <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
                <h3 className="text-xl font-bold text-slate-900">Still Need Help?</h3>
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-bold">
                  🚨 High-priority alert sent to your assigned counsellor's chat inbox.
                </div>
                <p className="text-sm text-slate-600">Please choose an option to connect with someone right away.</p>
                <div className="space-y-3">
                  <button onClick={confirmEmergencyCall} className="w-full py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-colors">Call Emergency (112)</button>
                  <a href="tel:14416" className="w-full py-3 bg-indigo-50 text-indigo-700 font-bold rounded-xl border border-indigo-200 block text-center hover:bg-indigo-100 transition-colors">Call Helpline (14416)</a>
                  {trustedContact && <a href={`tel:${trustedContact.phone}`} className="w-full py-3 bg-amber-50 text-amber-700 font-bold rounded-xl border border-amber-200 block text-center hover:bg-amber-100 transition-colors">Call Trusted Contact</a>}
                </div>
              </div>
            )}

            {/* Trusted Contact Modal */}
            {activeModal === 'trusted_contact' && (
              <div className="space-y-6 pt-2">
                <h3 className="text-xl font-bold text-slate-900">Trusted Contact</h3>
                <p className="text-sm text-slate-500">Add someone you trust who can support you when you're feeling overwhelmed.</p>
                <form onSubmit={(e) => { e.preventDefault(); saveTrustedContact(); }} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Name</label>
                    <input type="text" required value={newContact.name} onChange={e => setNewContact({...newContact, name: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-500" placeholder="e.g. Jane Doe" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Relationship</label>
                    <input type="text" required value={newContact.relationship} onChange={e => setNewContact({...newContact, relationship: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-500" placeholder="e.g. Sister, Friend" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                    <input type="tel" required value={newContact.phone} onChange={e => setNewContact({...newContact, phone: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-500" placeholder="Mobile number" />
                  </div>
                  <div className="pt-4 flex gap-3">
                    <button type="button" onClick={closeModal} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors">Cancel</button>
                    <button type="submit" className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-sm transition-colors shadow-sm">Save Contact</button>
                  </div>
                </form>
              </div>
            )}

            {/* Professional Modal */}
            {activeModal === 'professional' && (
              <div className="space-y-6 pt-2">
                <h3 className="text-xl font-bold text-slate-900">Find a Professional</h3>
                <p className="text-sm text-slate-500">Search for verified mental health professionals in your area.</p>
                
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input type="text" placeholder="Enter your city or pin code..." className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500" />
                </div>
                
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Filter by Type</p>
                  <label className="flex items-center gap-2 text-sm text-slate-700 p-2 hover:bg-slate-50 rounded-lg cursor-pointer"><input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" /> Clinical Psychologist</label>
                  <label className="flex items-center gap-2 text-sm text-slate-700 p-2 hover:bg-slate-50 rounded-lg cursor-pointer"><input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" /> Psychiatrist</label>
                  <label className="flex items-center gap-2 text-sm text-slate-700 p-2 hover:bg-slate-50 rounded-lg cursor-pointer"><input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" /> Mental Health Clinic</label>
                  <label className="flex items-center gap-2 text-sm text-slate-700 p-2 hover:bg-slate-50 rounded-lg cursor-pointer"><input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" /> Counsellor</label>
                </div>
                
                <div className="pt-4 border-t border-slate-100">
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-center">
                    <p className="text-xs text-blue-800 font-medium">Directory feature requires active integration with local health provider APIs. Currently in demonstration mode.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Data Protection Modal */}
            {activeModal === 'data_protection' && (
              <div className="space-y-6 pt-2">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2"><Shield className="w-5 h-5 text-indigo-500" /> Data Protection</h3>
                <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
                  <p><strong className="text-slate-800">What we collect:</strong> We temporarily store your check-in moods, journals, and trusted contact details locally on your device.</p>
                  <p><strong className="text-slate-800">Why we collect it:</strong> To provide personalized distress insights and track your emotional well-being over time.</p>
                  <p><strong className="text-slate-800">Storage & Sharing:</strong> Data remains in your local browser storage unless you explicitly choose to share it with an authorized counsellor. It is not permanently stored on open servers.</p>
                  <p><strong className="text-slate-800">Deletion:</strong> You can wipe all local data at any time using the Manage Data section.</p>
                </div>
              </div>
            )}

            {/* Distress Tracking Modal */}
            {activeModal === 'distress_tracking' && (
              <div className="space-y-6 pt-2">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2"><HeartPulse className="w-5 h-5 text-emerald-500" /> Distress Tracking</h3>
                <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
                  <p>Our system analyzes your daily mood check-ins and journal sentiment to estimate a "Distress Score".</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong className="text-emerald-700">Low:</strong> Stable mood patterns.</li>
                    <li><strong className="text-amber-700">Moderate:</strong> Fluctuating or consistently low mood.</li>
                    <li><strong className="text-rose-700">High/Critical:</strong> Severe distress indicators requesting prompt support.</li>
                  </ul>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-bold mt-4">
                    Disclaimer: Your distress score is an indicator, not a medical diagnosis.
                  </div>
                </div>
              </div>
            )}

            {/* Manage Data Modal */}
            {activeModal === 'manage_data' && (
              <div className="space-y-6 pt-2">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2"><Database className="w-5 h-5 text-slate-700" /> Manage My Data</h3>
                <p className="text-sm text-slate-500">View or clear your local storage history. This will log you out and remove your check-in history from this device.</p>
                
                <div className="p-4 border border-rose-200 bg-rose-50 rounded-xl space-y-3">
                  <h4 className="font-bold text-rose-900 text-sm">Danger Zone</h4>
                  <p className="text-xs text-rose-700">Are you sure you want to delete your wellness history? This action cannot be undone.</p>
                  <div className="flex gap-3 pt-2">
                    <button onClick={closeModal} className="flex-1 py-2 bg-white border border-rose-200 text-rose-700 font-bold rounded-lg text-xs transition-colors hover:bg-rose-50">Cancel</button>
                    <button onClick={handleDeleteData} className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs transition-colors shadow-sm">Delete My Data</button>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Policy Modal */}
            {activeModal === 'privacy_policy' && (
              <div className="space-y-6 pt-2">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2"><FileText className="w-5 h-5 text-blue-500" /> Privacy Policy</h3>
                <div className="space-y-4 text-sm text-slate-600 leading-relaxed max-h-60 overflow-y-auto pr-2">
                  <p><strong>Pending Finalization</strong></p>
                  <p>The comprehensive privacy policy is currently being finalized before deployment to production. It will adhere to all local healthcare data protection regulations (e.g. HIPAA, DISHA) concerning the processing and safeguarding of mental health information.</p>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
