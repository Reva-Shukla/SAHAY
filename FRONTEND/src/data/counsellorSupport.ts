import type { CounsellingSessionRecord, PatientCase } from '../types';

export const MOCK_SESSION_HISTORY: CounsellingSessionRecord[] = [
  { id: 'SES-1001', caseId: 'Case #4821', date: '2026-08-28', sessionType: 'Tele-counselling', duration: '42 min', status: 'Completed', topic: 'Anxiety and sleep disruption', notesSummary: 'Reviewed grounding exercises and sleep routine.', followUpStatus: 'Follow-up due in 7 days', details: 'Patient engaged with the plan and requested a shorter follow-up interval.' },
  { id: 'SES-1002', caseId: 'Case #4821', date: '2026-09-12', sessionType: 'Support check-in', duration: '30 min', status: 'Scheduled', topic: 'Progress review', notesSummary: 'Review check-in trend and current triggers.', followUpStatus: 'Scheduled', details: 'Use the latest check-in information to guide the conversation.' },
  { id: 'SES-1003', caseId: 'Case #7109', date: '2026-09-08', sessionType: 'Clinical review', duration: '35 min', status: 'Completed', topic: 'Safety and support planning', notesSummary: 'Discussed available support pathways.', followUpStatus: 'Follow-up due in 3 days', details: 'Continue monitoring distress changes and document the next contact.' }
];

export const getSessionHistory = (patient: PatientCase): CounsellingSessionRecord[] => {
  const records = MOCK_SESSION_HISTORY.filter((session) => session.caseId === patient.id);
  return records.length > 0 ? records : [{
    id: `SES-${patient.id.replace(/\D/g, '').slice(-4) || '0000'}`,
    caseId: patient.id,
    date: patient.lastCheckIn,
    sessionType: 'Check-in review',
    duration: 'Not recorded',
    status: 'Completed',
    topic: patient.primaryTriggers[0] || 'Wellbeing review',
    notesSummary: 'No session summary is available in the temporary local dataset.',
    followUpStatus: 'Review required',
    details: 'This isolated mock record is a placeholder until the session history API is connected.'
  }];
};
