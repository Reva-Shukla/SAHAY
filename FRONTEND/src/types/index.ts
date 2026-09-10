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
  preferredLanguage?: string;
  currentMood?: DistressHistoryEntry['mood'];
}

export interface AuthorisedCounsellor {
  counsellorId: string; // e.g. "CNS-8842"
  name: string;
  email: string;
  password: string;
  department: string;
  designation: string;
  badge: string;
  languages?: string[];
  specialization?: string;
  availability?: string;
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
  verificationStatus?: 'VERIFIED';
  languages?: string[];
  specialization?: string;
  availability?: string;
}

export type SessionStatus = 'Scheduled' | 'Completed' | 'Cancelled' | 'In progress';

export interface CounsellingSessionRecord {
  id: string;
  caseId: string;
  date: string;
  sessionType: string;
  duration: string;
  status: SessionStatus;
  topic: string;
  notesSummary: string;
  followUpStatus: string;
  details: string;
}

export interface CounsellorNote {
  id: string;
  caseId: string;
  text: string;
  createdAt: string;
  updatedAt?: string;
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
