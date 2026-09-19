import React, { useState } from 'react';
import { 
  MessageSquare, Calendar, FileText, 
  Clock, Check, X, Send, Mic, Share2, Download
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export interface Appointment {
  id: number;
  date: string;
  time: string;
  counsellor: string;
  type: string;
  status?: string;
}

interface CounsellorTabProps {
  appointments: { upcoming: Appointment[], past: Appointment[] };
  setAppointments: React.Dispatch<React.SetStateAction<{ upcoming: Appointment[], past: Appointment[] }>>;
}

export const CounsellorTab: React.FC<CounsellorTabProps> = ({ appointments, setAppointments }) => {
  const { t } = useLanguage();

  // 1. Recommendations State
  const [recommendations, setRecommendations] = useState([
    { id: 1, title: '10-minute breathing exercise', desc: 'Focus on deep abdominal breathing', date: 'Complete before Sept 20', done: false },
    { id: 2, title: 'Write 3 things you are grateful for', desc: 'Gratitude journaling', date: 'Complete today', done: true }
  ]);

  const toggleRec = (id: number) => {
    setRecommendations(prev => prev.map(r => r.id === id ? { ...r, done: !r.done } : r));
  };

  // 2. Appointments State
  const [showReschedule, setShowReschedule] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [selectedApt, setSelectedApt] = useState<any>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');

  const PRE_SET_SLOTS = ["09:00 AM", "10:00 AM", "11:30 AM", "02:00 PM", "04:00 PM"];
  const OCCUPIED_SLOTS = ["10:00 AM", "02:00 PM"];

  const handleReschedule = (apt: any) => {
    setSelectedApt(apt);
    setRescheduleDate(apt.date);
    setRescheduleTime(apt.time);
    setShowReschedule(true);
  };
  
  const handleCancel = (apt: any) => {
    setSelectedApt(apt);
    setShowCancel(true);
  };

  const confirmReschedule = () => {
    if (!rescheduleDate || !rescheduleTime) return;
    setAppointments(prev => ({
      ...prev,
      upcoming: prev.upcoming.map(a => a.id === selectedApt.id ? { ...a, date: rescheduleDate, time: rescheduleTime } : a)
    }));
    setShowReschedule(false);
  };

  const confirmCancel = () => {
    setAppointments(prev => ({
      ...prev,
      upcoming: prev.upcoming.filter(a => a.id !== selectedApt.id)
    }));
    setShowCancel(false);
  };

  // 3. Chat State
  const [messages, setMessages] = useState<any[]>([
    { id: 1, text: 'Hello Kalash, how have you been feeling this week?', sender: 'counsellor', time: '10:00 AM', type: 'text' },
    { id: 2, text: 'I have been a bit stressed about work, but the breathing exercises help.', sender: 'patient', time: '10:15 AM', type: 'text' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, { id: Date.now(), text: newMessage, sender: 'patient', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), type: 'text' }]);
    setNewMessage('');
  };
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(blob);
        setMessages(prev => [...prev, { 
          id: Date.now(), 
          text: 'Voice Message', 
          audioUrl: audioUrl,
          sender: 'patient', 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
          type: 'voice' 
        }]);
        stream.getTracks().forEach(track => track.stop());
      };
      
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access denied or unavailable.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleShareEntry = () => {
    const msg = `Shared Journal & Mood logs with counsellor.`;
    setMessages([...messages, { id: Date.now(), text: msg, sender: 'patient', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), type: 'text' }]);
    setShowShareModal(false);
  };

  // 4. Report State
  const [reportState, setReportState] = useState({
    start: '', end: '', mood: true, sleep: true, triggers: true, activities: true, journal: false
  });
  const [showReportPreview, setShowReportPreview] = useState(false);

  const generateReportText = () => {
    return `Mental Health Report
====================

Period: ${reportState.start || 'Recent'} to ${reportState.end || 'Today'}

${reportState.mood ? '• Average Mood: Good\n' : ''}${reportState.sleep ? '• Average Sleep: 6h 45m\n' : ''}${reportState.triggers ? '• Top Triggers: Work, Lack of sleep\n' : ''}${reportState.activities ? '• Top Activities: Yoga, Walking\n' : ''}`;
  };

  const handleShareReport = () => {
    const reportTxt = generateReportText();
    setMessages([...messages, { id: Date.now(), text: reportTxt, sender: 'patient', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), type: 'text' }]);
  };

  const handleDownloadReport = () => {
    const reportTxt = generateReportText();
    const blob = new Blob([reportTxt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Mental_Health_Report.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">{t.counsellorCenter}</h2>
        <p className="text-slate-500 text-sm">{t.counsellorCenterSub}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Profile & Recommendations */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Counsellor Profile */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-white space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl relative">
                SJ
                <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Dr. Sarah Jenkins</h3>
                <p className="text-emerald-600 text-xs font-bold uppercase tracking-wider">{t.counsellorAvailable}</p>
                <p className="text-slate-500 text-xs mt-0.5">{t.counsellorRole}</p>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold py-2 rounded-xl text-sm transition-colors border border-indigo-100">
                {t.viewProfileBtn}
              </button>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-white space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800">{t.recommendationsTitle}</h3>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">{t.tasksBadge}</span>
            </div>
            
            <div className="space-y-3">
              {recommendations.map(rec => {
                let recTitle = rec.title;
                let recDesc = rec.desc;
                let recDate = rec.date;
                if (rec.id === 1) { recTitle = t.rec1Title; recDesc = t.rec1Desc; recDate = t.rec1Date; }
                else if (rec.id === 2) { recTitle = t.rec2Title; recDesc = t.rec2Desc; recDate = t.rec2Date; }
                return (
                <div key={rec.id} onClick={() => toggleRec(rec.id)} className="cursor-pointer group flex items-start gap-3 p-3 bg-white border border-slate-100 rounded-2xl hover:shadow-md transition-all">
                  <div className={`mt-0.5 shrink-0 w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${rec.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 bg-slate-50 group-hover:border-emerald-300'}`}>
                    {rec.done && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold transition-colors ${rec.done ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{recTitle}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{recDesc}</p>
                    <div className="text-[10px] font-semibold text-amber-600 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {recDate}
                    </div>
                  </div>
                </div>
              )})}
            </div>
          </div>

        </div>

        {/* Middle Column: Chat */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-white h-[500px] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4 shrink-0">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-slate-800">{t.chatTitle}</h3>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 ml-2">{t.privateBadge}</span>
              </div>
              <button onClick={() => setShowShareModal(true)} className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5" /> {t.shareLogsBtn}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {messages.map(msg => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === 'patient' ? 'items-end' : 'items-start'}`}>
                  <div className={`whitespace-pre-wrap max-w-[75%] p-3 rounded-2xl text-sm ${msg.sender === 'patient' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'}`}>
                    {msg.type === 'voice' && msg.audioUrl ? (
                      <div className="flex flex-col gap-2">
                        <span className="text-xs opacity-80">🎤 {msg.text}</span>
                        <audio controls src={msg.audioUrl} className="h-8 w-48" />
                      </div>
                    ) : (
                      msg.text
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium mt-1 mx-1">{msg.time}</span>
                </div>
              ))}
            </div>

            <div className="shrink-0 pt-4 mt-2 border-t border-slate-100 flex items-center gap-2">
              <button 
                onClick={toggleRecording} 
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border transition-all shadow-sm
                  ${isRecording ? 'bg-rose-500 border-rose-500 text-white animate-pulse' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'}
                `}
              >
                <Mic className="w-4 h-4" />
              </button>
              <input 
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t.typeMessagePlaceholder}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
              />
              <button onClick={handleSend} className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center shrink-0 text-white shadow-sm transition-colors">
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Appointments */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-white space-y-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-800">{t.appointmentsTitle}</h3>
          </div>
          
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{t.upcomingBadge}</h4>
            {appointments.upcoming.map(apt => (
              <div key={apt.id} className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h5 className="font-bold text-slate-800">{apt.type}</h5>
                  <p className="text-xs text-slate-500 mt-0.5">{apt.counsellor}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-emerald-700">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {apt.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {apt.time}</span>
                  </div>
                </div>
                <div className="flex sm:flex-col gap-2 shrink-0">
                  <button onClick={() => handleReschedule(apt)} className="flex-1 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 font-semibold text-xs rounded-lg hover:bg-slate-50">{t.rescheduleBtn}</button>
                  <button onClick={() => handleCancel(apt)} className="flex-1 px-3 py-1.5 bg-rose-50 border border-rose-100 text-rose-600 font-semibold text-xs rounded-lg hover:bg-rose-100">{t.cancelBtn}</button>
                </div>
              </div>
            ))}
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{t.pastBadge}</h4>
            {appointments.past.map(apt => (
              <div key={apt.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center opacity-80">
                <div>
                  <h5 className="font-bold text-slate-800 text-sm">{apt.counsellor}</h5>
                  <div className="flex items-center gap-2 mt-1 text-xs font-medium text-slate-500">
                    <span>{apt.date}</span> • <span>{apt.time}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-1 bg-slate-200 text-slate-600 rounded-lg">{apt.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mental Health Report */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-white space-y-5">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold text-slate-800">{t.reportTitle}</h3>
          </div>
          <p className="text-sm text-slate-500">{t.reportSub}</p>

          {!showReportPreview ? (
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs font-bold text-slate-500 mb-1 block">{t.startDate}</label>
                  <input type="date" value={reportState.start} onChange={e => setReportState({...reportState, start: e.target.value})} className="w-full text-sm p-2 bg-slate-50 border border-slate-200 rounded-xl" />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-bold text-slate-500 mb-1 block">{t.endDate}</label>
                  <input type="date" value={reportState.end} onChange={e => setReportState({...reportState, end: e.target.value})} className="w-full text-sm p-2 bg-slate-50 border border-slate-200 rounded-xl" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 mb-2 block">{t.includeInReport}</label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={reportState.mood} onChange={e => setReportState({...reportState, mood: e.target.checked})} className="rounded text-indigo-600" /> {t.moodSummary}
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={reportState.sleep} onChange={e => setReportState({...reportState, sleep: e.target.checked})} className="rounded text-indigo-600" /> {t.sleepData}
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={reportState.triggers} onChange={e => setReportState({...reportState, triggers: e.target.checked})} className="rounded text-indigo-600" /> {t.triggersStr}
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={reportState.activities} onChange={e => setReportState({...reportState, activities: e.target.checked})} className="rounded text-indigo-600" /> {t.activitiesStr}
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer col-span-2 mt-1 border-t border-slate-100 pt-2">
                    <input type="checkbox" checked={reportState.journal} onChange={e => setReportState({...reportState, journal: e.target.checked})} className="rounded text-indigo-600" /> {t.includeJournal}
                  </label>
                </div>
              </div>
              <button onClick={() => setShowReportPreview(true)} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-sm mt-2">
                {t.generateReportBtn}
              </button>
            </div>
          ) : (
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
                <h4 className="font-bold text-indigo-900">{t.reportPreview}</h4>
                <button onClick={() => setShowReportPreview(false)} className="text-xs text-indigo-600 font-semibold hover:underline">{t.editBtn}</button>
              </div>
              <div className="space-y-2 text-sm text-slate-700">
                <p><strong>{t.periodLabel}</strong> {reportState.start || t.recentLabel} to {reportState.end || t.todayLabel}</p>
                {reportState.mood && <p>• Average Mood: Good</p>}
                {reportState.sleep && <p>• Average Sleep: 6h 45m</p>}
                {reportState.triggers && <p>• Top Triggers: Work, Lack of sleep</p>}
                {reportState.activities && <p>• Top Activities: Yoga, Walking</p>}
                {reportState.journal ? <p className="text-amber-600 text-xs">Contains private journal text.</p> : <p className="text-slate-400 text-xs">Journals excluded.</p>}
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={handleShareReport} className="flex-1 flex items-center justify-center gap-2 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 transition-colors">
                  <Share2 className="w-3.5 h-3.5" /> {t.shareBtn}
                </button>
                <button onClick={handleDownloadReport} className="flex-1 flex items-center justify-center gap-2 py-2 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors">
                  <Download className="w-3.5 h-3.5" /> {t.downloadBtn}
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Modals */}
      {showReschedule && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-bold text-lg mb-2">{t.rescheduleTitle}</h3>
            <p className="text-sm text-slate-500 mb-4">You are requesting to reschedule your {selectedApt?.type} with {selectedApt?.counsellor}.</p>
            
            <label className="text-xs font-bold text-slate-500 mb-1 block">Date</label>
            <input type="date" value={rescheduleDate} onChange={e => setRescheduleDate(e.target.value)} className="w-full border border-slate-200 p-2 rounded-xl mb-4 text-sm" />
            
            <label className="text-xs font-bold text-slate-500 mb-1 block">Available Slots</label>
            <div className="flex flex-wrap gap-2 mb-4">
              {PRE_SET_SLOTS.map(slot => {
                const isOccupied = OCCUPIED_SLOTS.includes(slot);
                const isSelected = rescheduleTime === slot;
                return (
                  <button 
                    key={slot}
                    disabled={isOccupied}
                    onClick={() => setRescheduleTime(slot)}
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
              <button onClick={() => setShowReschedule(false)} className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-200">{t.cancelBtn}</button>
              <button onClick={confirmReschedule} className="flex-1 py-2 bg-emerald-600 text-white font-bold rounded-xl text-sm hover:bg-emerald-700">{t.confirmBtn}</button>
            </div>
          </div>
        </div>
      )}

      {showCancel && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-bold text-lg mb-2 text-rose-600">{t.cancelTitle}</h3>
            <p className="text-sm text-slate-500 mb-4">Are you sure you want to cancel your session with {selectedApt?.counsellor}?</p>
            <div className="flex gap-2">
              <button onClick={() => setShowCancel(false)} className="flex-1 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-200">{t.keepItBtn}</button>
              <button onClick={confirmCancel} className="flex-1 py-2 bg-rose-600 text-white font-bold rounded-xl text-sm hover:bg-rose-700">{t.yesCancelBtn}</button>
            </div>
          </div>
        </div>
      )}

      {showShareModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">{t.shareLogsTitle}</h3>
              <button onClick={() => setShowShareModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <p className="text-sm text-slate-500">{t.shareLogsSub}</p>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {['Sept 15 (Mood: Low, Journal: Exhausted)', 'Sept 14 (Mood: Neutral)', 'Sept 12 (Mood: Good, Journal: Nice walk)'].map((log, i) => (
                <label key={i} className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer hover:border-indigo-200">
                  <input type="checkbox" className="mt-1" />
                  <span className="text-xs text-slate-700 font-medium">{log}</span>
                </label>
              ))}
            </div>
            <button onClick={handleShareEntry} className="w-full py-2 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-indigo-700">{t.shareSelectedBtn}</button>
          </div>
        </div>
      )}

    </div>
  );
};
