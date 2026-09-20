export type RiskLevel = 'GREEN' | 'YELLOW' | 'RED';

export interface DistressHistoryEntry {
  week: string;
  score: number;
  mood: 'Very Low' | 'Low' | 'Neutral' | 'Good' | 'Great';
  predictedScore?: number;
  timestamp: string;
  flags?: string[];
  noteSnippet?: string;
}

export interface PatientCase {
  id: string; // e.g. "Case #4821"
  patientAlias: string; // e.g. "Victim P-9102"
  age: number;
  gender: string;
  state: string; // e.g. "Haryana"
  district: string; // e.g. "Rewari"
  riskLevel: RiskLevel;
  currentScore: number; // 0 to 100
  previousScore: number;
  scoreTrend: 'rising' | 'falling' | 'stable';
  lastCheckIn: string;
  primaryTriggers: string[];
  distressHistory: DistressHistoryEntry[];
  clinicalSummary: string;
  contactStatus: 'Uncontacted' | 'In Touch' | 'Crisis Intervention Active' | 'Resolved';
  voiceSentimentScore?: number; // 0 to 1 scale
  checkInCount: number;
}

export interface AuthorisedCounsellor {
  counsellorId: string; // e.g. "CNS-8842"
  name: string;
  email: string;
  password: string;
  department: string;
  designation: string;
  badge: string;
  avatar?: string;
  qualifications?: string;
  specializations?: string[];
  yearsOfExperience?: number;
  bio?: string;
  onlineStatus?: 'Available Online' | 'Busy' | 'Offline';
}

export interface ChatMessage {
  id: string | number;
  caseId: string;
  text: string;
  sender: 'counsellor' | 'patient';
  time: string;
  timestamp: number;
  type: 'text' | 'voice';
  audioUrl?: string;
  durationSeconds?: number;
}

export interface CounsellorMeeting {
  id: string;
  caseId: string;
  patientAlias: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "10:30 AM"
  status: 'upcoming' | 'missed' | 'started' | 'completed';
  type: 'Video Consultation' | 'Audio Follow-up' | 'Crisis Check-in' | 'Weekly Therapy';
  riskLevel: RiskLevel;
  notes?: string;
}

export interface SOSAlert {
  id: string;
  caseId: string;
  patientAlias: string;
  distressScore: number;
  scoreTrend: 'rising' | 'falling' | 'stable';
  timestamp: string;
  state: string;
  district: string;
  status: 'ACTIVE' | 'DISPATCHED' | 'RESOLVED';
  resolvedAt?: string;
  resolutionNotes?: string;
  actionTaken?: 'Dispatch Emergency Team' | 'Resolve — No Team Needed';
  locationGrantedDurationHours?: number;
}

export interface SharedMentalHealthReport {
  id: string;
  caseId: string;
  patientAlias: string;
  dateShared: string;
  dateRange: string;
  averageMood: string;
  averageSleep: string;
  topTriggers: string[];
  topActivities: string[];
  summaryText: string;
  counsellorNotes?: string;
}

export interface CounsellorSession {
  token: string;
  counsellorId: string;
  name: string;
  email: string;
  designation: string;
  assignedState: string;
  assignedDistrict: string;
  loginTimestamp: string;
}

export interface InterventionRecommendation {
  id: string;
  riskLevel: RiskLevel;
  title: string;
  category: 'Counselling' | 'Legal Aid' | 'Relocation' | 'Financial Assistance' | 'Medical';
  description: string;
  urgency: 'Immediate (within 2h)' | 'High (within 24h)' | 'Standard (within 7 days)';
  actionLabel: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  counsellorId: string;
  action: string;
  details: string;
  caseId?: string;
  status: 'SUCCESS' | 'DENIED' | 'FLAGGED';
}

export interface PatientCheckInPayload {
  phoneNumber: string;
  mood: 'Very Low' | 'Low' | 'Neutral' | 'Good' | 'Great';
  journalText: string;
  hasVoiceNote: boolean;
  voiceDurationSeconds?: number;
  recordedTranscript?: string;
}
