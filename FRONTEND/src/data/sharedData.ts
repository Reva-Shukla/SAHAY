import type { ChatMessage, CounsellorMeeting, SOSAlert, SharedMentalHealthReport } from '../types';

export const INITIAL_MOCK_CHATS: Record<string, ChatMessage[]> = {
  "Case #4821": [
    {
      id: "msg-101",
      caseId: "Case #4821",
      sender: "counsellor",
      text: "Hello, I am Dr. Rajesh Sharma. I noticed your recent check-in score was elevated. How are you feeling right now?",
      time: "10:15 AM",
      timestamp: Date.now() - 3600000 * 4,
      type: "text"
    },
    {
      id: "msg-102",
      caseId: "Case #4821",
      sender: "patient",
      text: "I feel very overwhelmed and unable to focus. The anxiety has been constant since yesterday night.",
      time: "10:18 AM",
      timestamp: Date.now() - 3600000 * 3.8,
      type: "text"
    },
    {
      id: "msg-103",
      caseId: "Case #4821",
      sender: "patient",
      text: "Voice check-in recording attached for clinical review.",
      time: "10:20 AM",
      timestamp: Date.now() - 3600000 * 3.7,
      type: "voice",
      durationSeconds: 18,
      audioUrl: ""
    },
    {
      id: "msg-104",
      caseId: "Case #4821",
      sender: "counsellor",
      text: "I hear the distress in your voice note. Please practice 4-7-8 breathing and stay in a calm room. I am monitoring your status continuously.",
      time: "10:25 AM",
      timestamp: Date.now() - 3600000 * 3.5,
      type: "text"
    }
  ],
  "Case #4890": [
    {
      id: "msg-201",
      caseId: "Case #4890",
      sender: "counsellor",
      text: "Good morning. This is Tele-MANAS response node for Rewari district. Please let us know if you need emergency support today.",
      time: "09:00 AM",
      timestamp: Date.now() - 3600000 * 6,
      type: "text"
    },
    {
      id: "msg-202",
      caseId: "Case #4890",
      sender: "patient",
      text: "Having severe insomnia and trauma flashbacks. Need assistance.",
      time: "09:45 AM",
      timestamp: Date.now() - 3600000 * 5.2,
      type: "text"
    }
  ],
  "Case #4211": [
    {
      id: "msg-301",
      caseId: "Case #4211",
      sender: "patient",
      text: "Completed my weekly breathing exercises. Feeling slightly better than Monday.",
      time: "Yesterday 04:30 PM",
      timestamp: Date.now() - 86400000,
      type: "text"
    },
    {
      id: "msg-302",
      caseId: "Case #4211",
      sender: "counsellor",
      text: "Great progress! Keep logging your daily mood check-ins.",
      time: "Yesterday 05:00 PM",
      timestamp: Date.now() - 86400000 + 1800000,
      type: "text"
    }
  ]
};

export const INITIAL_MOCK_MEETINGS: CounsellorMeeting[] = [
  {
    id: "MTG-901",
    caseId: "Case #4821",
    patientAlias: "Victim H-104",
    date: "2026-09-20",
    time: "11:30 AM",
    status: "upcoming",
    type: "Crisis Check-in",
    riskLevel: "RED",
    notes: "Urgent crisis triage review following voice sentiment alert."
  },
  {
    id: "MTG-902",
    caseId: "Case #4890",
    patientAlias: "Victim H-209",
    date: "2026-09-20",
    time: "03:00 PM",
    status: "upcoming",
    type: "Video Consultation",
    riskLevel: "RED",
    notes: "Follow-up on recent livelihood loss trauma."
  },
  {
    id: "MTG-903",
    caseId: "Case #4211",
    patientAlias: "Victim H-312",
    date: "2026-09-21",
    time: "10:00 AM",
    status: "upcoming",
    type: "Weekly Therapy",
    riskLevel: "YELLOW",
    notes: "Routine weekly CBT session."
  },
  {
    id: "MTG-904",
    caseId: "Case #4821",
    patientAlias: "Victim H-104",
    date: "2026-09-18",
    time: "04:00 PM",
    status: "missed",
    type: "Audio Follow-up",
    riskLevel: "RED",
    notes: "Patient did not answer tele-consultation call."
  },
  {
    id: "MTG-905",
    caseId: "Case #4890",
    patientAlias: "Victim H-209",
    date: "2026-09-16",
    time: "02:30 PM",
    status: "missed",
    type: "Video Consultation",
    riskLevel: "RED",
    notes: "Repeat no-show — 2nd consecutive missed session."
  },
  {
    id: "MTG-906",
    caseId: "Case #4112",
    patientAlias: "Victim H-519",
    date: "2026-09-15",
    time: "11:00 AM",
    status: "completed",
    type: "Weekly Therapy",
    riskLevel: "GREEN",
    notes: "Mindfulness modules reviewed successfully."
  }
];

export const INITIAL_MOCK_SOS_ALERTS: SOSAlert[] = [
  {
    id: "SOS-7701",
    caseId: "Case #4821",
    patientAlias: "Victim H-104",
    distressScore: 88,
    scoreTrend: "rising",
    timestamp: "2026-09-20T08:15:00Z",
    state: "Haryana",
    district: "Rewari",
    status: "ACTIVE"
  },
  {
    id: "SOS-7702",
    caseId: "Case #4890",
    patientAlias: "Victim H-209",
    distressScore: 82,
    scoreTrend: "rising",
    timestamp: "2026-09-20T08:45:00Z",
    state: "Haryana",
    district: "Rewari",
    status: "ACTIVE"
  },
  {
    id: "SOS-7703",
    caseId: "Case #4601",
    patientAlias: "Victim H-512",
    distressScore: 68,
    scoreTrend: "rising",
    timestamp: "2026-09-20T09:05:00Z",
    state: "Haryana",
    district: "Rewari",
    status: "ACTIVE"
  }
];

export const INITIAL_MOCK_SHARED_REPORTS: SharedMentalHealthReport[] = [
  {
    id: "REP-401",
    caseId: "Case #4821",
    patientAlias: "Victim H-104",
    dateShared: "2026-09-19 06:45 PM",
    dateRange: "Sep 12 - Sep 19, 2026",
    averageMood: "Very Low (1.4/5)",
    averageSleep: "4h 15m (Fragmented)",
    topTriggers: ["Severe Anxiety", "Work Pressure", "Insomnia"],
    topActivities: ["Breathing Exercises", "Quiet Meditation"],
    summaryText: "Mental Health Trajectory Report:\n• Patient logged 7 check-ins with 4 panic attack indicators.\n• Average sleep dropped below recommended thresholds.\n• AI Distress Score projected to exceed 85.",
    counsellorNotes: "Reviewed by Dr. Rajesh Sharma. Patient needs immediate mobile crisis team dispatch if distress score reaches 90."
  },
  {
    id: "REP-402",
    caseId: "Case #4211",
    patientAlias: "Victim H-312",
    dateShared: "2026-09-17 02:10 PM",
    dateRange: "Sep 10 - Sep 17, 2026",
    averageMood: "Neutral (3.1/5)",
    averageSleep: "6h 50m (Restful)",
    topTriggers: ["Domestic Stress"],
    topActivities: ["Yoga Routine", "Evening Walks"],
    summaryText: "Mental Health Trajectory Report:\n• Consistent mood trend over the past 7 days.\n• Improved sleep consistency.",
    counsellorNotes: "Patient progressing well with self-care modules."
  }
];
