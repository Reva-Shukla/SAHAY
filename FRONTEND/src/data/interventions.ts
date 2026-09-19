import type { InterventionRecommendation } from '../types';

export const INTERVENTION_CATALOG: InterventionRecommendation[] = [
  // RED RISK INTERVENTIONS
  {
    id: "INT-RED-01",
    riskLevel: "RED",
    title: "Dispatch Emergency Tele-MANAS Mobile Crisis Unit",
    category: "Counselling",
    description: "Deploy immediate local ground counsellor and clinical psychologist to patient's verified district location for physical welfare check.",
    urgency: "Immediate (within 2h)",
    actionLabel: "Dispatch Crisis Unit"
  },
  {
    id: "INT-RED-02",
    riskLevel: "RED",
    title: "Initiate State Legal Aid & Victim Protection Protocol",
    category: "Legal Aid",
    description: "Connect patient with District Legal Services Authority (DLSA) for immediate protection order or legal counsel regarding domestic/workplace violence.",
    urgency: "Immediate (within 2h)",
    actionLabel: "Assign Legal Advocate"
  },
  {
    id: "INT-RED-03",
    riskLevel: "RED",
    title: "Safe Relocation & Shelter Home Placement",
    category: "Relocation",
    description: "Coordinate with Department of Social Justice shelter network for temporary emergency housing and safe passage.",
    urgency: "High (within 24h)",
    actionLabel: "Request Shelter Transfer"
  },

  // YELLOW RISK INTERVENTIONS
  {
    id: "INT-YEL-01",
    riskLevel: "YELLOW",
    title: "Schedule Weekly 1-on-1 Cognitive Therapy Session",
    category: "Counselling",
    description: "Assign assigned district psychiatric counsellor for weekly video/audio therapy sessions targeting anxiety and trauma triggers.",
    urgency: "High (within 24h)",
    actionLabel: "Book Therapy Session"
  },
  {
    id: "INT-YEL-02",
    riskLevel: "YELLOW",
    title: "Apply for MoSJE Distress Financial Assistance Scheme",
    category: "Financial Assistance",
    description: "Fast-track application for government financial support scheme for victims facing severe economic hardship.",
    urgency: "Standard (within 7 days)",
    actionLabel: "File Relief Grant"
  },

  // GREEN RISK INTERVENTIONS
  {
    id: "INT-GRN-01",
    riskLevel: "GREEN",
    title: "Enroll in Tele-MANAS Self-Guided Wellness Module",
    category: "Counselling",
    description: "Provide interactive daily mindfulness exercises, breathing tutorials, and sleep hygiene tracking via patient portal.",
    urgency: "Standard (within 7 days)",
    actionLabel: "Send Self-Care Module"
  }
];

export const getInterventionsForRisk = (riskLevel: 'GREEN' | 'YELLOW' | 'RED'): InterventionRecommendation[] => {
  return INTERVENTION_CATALOG.filter(item => item.riskLevel === riskLevel);
};
