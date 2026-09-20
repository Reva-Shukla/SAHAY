import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type SupportedLanguage = 'en' | 'hi';

interface Translations {
  portalTitle: string;
  subTitle: string;
  phoneLabel: string;
  phonePlaceholder: string;
  getOtpBtn: string;
  otpLabel: string;
  otpPlaceholder: string;
  otpDemoText: string;
  verifyOtpBtn: string;
  changeNumber: string;
  howAreYou: string;
  dailyCheckIn: string;
  journalLabel: string;
  journalPlaceholder: string;
  voiceLabel: string;
  tapToRecord: string;
  recordingText: string;
  recordingDone: string;
  submitBtn: string;
  submittingText: string;
  recordedSuccessTitle: string;
  recordedSuccessMsg: string;
  teleManasNotice: string;
  submitAnotherBtn: string;
  confidentialNotice: string;
  helplineBanner: string;
  selectLanguageTitle: string;
  caretakerBadge: string;
  // Landing Page specific
  aiSystemLabel: string;
  welcomeTo: string;
  portalDescription: string;
  selectRoleTitle: string;
  selectRoleSubtitle: string;
  openAccessSupport: string;
  patientOrCaretaker: string;
  patientOrCaretakerSub: string;
  patientCardDesc: string;
  continueAsPatient: string;
  restrictedAccess: string;
  authorizedCounsellor: string;
  authorizedCounsellorSub: string;
  counsellorCardDesc: string;
  counsellorLoginBtn: string;
  trustBadge1: string;
  trustBadge2: string;
  trustBadge3: string;
  footerText: string;
  // Counsellor Login specific
  counsellorAuthGate: string;
  counsellorPortalLogin: string;
  counsellorNetworkSub: string;
  officialCounsellorId: string;
  authGovEmail: string;
  securityPassword: string;
  authVerifyBtn: string;
  testCredentials: string;
  identityVerified: string;
  selectJurisdiction: string;
  chooseAssigned: string;
  selectState: string;
  selectDistrict: string;
  filterGuaranteePrefix: string;
  filterGuaranteeSuffix: string;
  launchDashboardBtn: string;
  // Navbar specific
  patientSupportPortal: string;
  aiDistressMonitoring: string;
  jurisdictionLabel: string;
  logoutBtn: string;
  counsellorPortalLoginBtn: string;
  // Mood Selector specific
  moodQuestion: string;
  mood1Label: string;
  mood1Desc: string;
  mood2Label: string;
  mood2Desc: string;
  mood3Label: string;
  mood3Desc: string;
  mood4Label: string;
  mood4Desc: string;
  mood5Label: string;
  mood5Desc: string;
  aiSafeguard: string;
  editCheckIn: string;
  viewDashboardBtn: string;
  // Dashboard specific
  dashNavDashboard: string;
  dashNavCalendar: string;
  dashNavInsights: string;
  dashNavScheduled: string;
  dashNavGoals: string;
  dashNavCounsellor: string;
  dashNavSupport: string;
  dashNavProfile: string;
  dashNavYoga: string;
  dashSearchPlaceholder: string;
  dashBannerTitle: string;
  dashBannerSub: string;
  dashBannerBtn: string;
  dashMoodChartTitle: string;
  dashMoodChartSub: string;
  dashDailyGoals: string;
  dashChecklistTitle: string;
  dashCoreRoutines: string;
  dashReadingTitle: string;
  dashYogaTitle: string;
  dashCheckInHistory: string;
  dashCheckInHistorySub: string;
  dashInsightsTitle: string;
  dashInsightsSub: string;
  dashScheduledTitle: string;
  dashScheduledSub: string;
  dashTasksCompleted: string;
  dashNoteTimers: string;
  dashViewAll: string;
  dashEnergyVsMood: string;
  dashEnergyVsMoodDesc: string;
  dashRecurringPatterns: string;
  dashRecurringPatternsDesc: string;
  dash30DayTrend: string;
  dashPastMonth: string;
  dashTopTriggers: string;
  dashTopTriggersDesc: string;
  dashGoalsSub: string;
  dashGoalsGreat: string;
  dashOutOf: string;
  goalWater: string;
  goalMeds: string;
  goalWalk: string;
  goalJournal: string;
  
  counsellorCenter: string;
  counsellorCenterSub: string;
  counsellorAvailable: string;
  counsellorRole: string;
  viewProfileBtn: string;
  recommendationsTitle: string;
  tasksBadge: string;
  chatTitle: string;
  privateBadge: string;
  shareLogsBtn: string;
  typeMessagePlaceholder: string;
  appointmentsTitle: string;
  upcomingBadge: string;
  pastBadge: string;
  rescheduleBtn: string;
  cancelBtn: string;
  reportTitle: string;
  reportSub: string;
  startDate: string;
  endDate: string;
  includeInReport: string;
  moodSummary: string;
  sleepData: string;
  triggersStr: string;
  activitiesStr: string;
  includeJournal: string;
  generateReportBtn: string;
  reportPreview: string;
  editBtn: string;
  periodLabel: string;
  recentLabel: string;
  todayLabel: string;
  shareBtn: string;
  downloadBtn: string;
  rescheduleTitle: string;
  cancelTitle: string;
  keepItBtn: string;
  yesCancelBtn: string;
  confirmBtn: string;
  shareLogsTitle: string;
  shareLogsSub: string;
  shareSelectedBtn: string;
  rec1Title: string;
  rec1Desc: string;
  rec1Date: string;
  rec2Title: string;
  rec2Desc: string;
  rec2Date: string;
  // Counsellor UI & Priority Badges
  priorityHigh: string;
  priorityMedium: string;
  priorityLow: string;
  navCases: string;
  navChat: string;
  navMeetings: string;
  navReports: string;
  navProfile: string;
  statusOnline: string;
  tabUpcoming: string;
  tabMissed: string;
  repeatMissFlag: string;
  noMeetingsFound: string;
  scheduledMeetingsTitle: string;
  sharedReportsTitle: string;
  noMeetingsScheduled: string;
  noReportsShared: string;
  editProfileBtn: string;
  saveProfileBtn: string;
  cancelEditBtn: string;
  changePhotoBtn: string;
  photoSizeError: string;
  profileUpdatedSuccess: string;
  qualificationsLabel: string;
  specializationsLabel: string;
  bioLabel: string;
  joinMeeting: string;
  openPatientChat: string;
  followUpChat: string;
  viewTrajectory: string;
  // New Connected Feature Translations
  tabYogaCategory: string;
  tabMeditationCategory: string;
  startTimer: string;
  pauseTimer: string;
  resumeTimer: string;
  resetTimer: string;
  practiceCompleted: string;
  benefitLabel: string;
  durationLabel: string;
  pendingRequests: string;
  acceptBtn: string;
  declineBtn: string;
  statusPending: string;
  statusAccepted: string;
  statusDeclined: string;
  counsellorBusyMsg: string;
  requestSentSuccess: string;
  doctorAssignedGoals: string;
  selfGoals: string;
  addGoalBtn: string;
  assignGoalBtn: string;
  assignedByLabel: string;
  goalTitleLabel: string;
  goalDescLabel: string;
  dueDateLabel: string;
  inProgressLabel: string;
  completedLabel: string;
  emailRequiredErr: string;
  phoneRequiredErr: string;
  reportSubmittedSuccess: string;
  emailLabel: string;
  phoneLabelRequired: string;
}

const TRANSLATIONS: Record<SupportedLanguage, Translations> = {
  en: {
    portalTitle: "SAHAY — Safe & Confidential Support Portal",
    subTitle: "Connect with state Tele-MANAS support system. Simple phone check-in — no long registration required.",
    phoneLabel: "Enter Mobile Number",
    phonePlaceholder: "e.g. 9876543210",
    getOtpBtn: "Receive OTP Code",
    otpLabel: "Enter 4-Digit OTP Code",
    otpPlaceholder: "Enter 4821",
    otpDemoText: "Demo OTP auto-filled: 4821",
    verifyOtpBtn: "Verify & Continue to SAHAY Check-in",
    changeNumber: "Change Number",
    howAreYou: "How are you feeling today?",
    dailyCheckIn: "SAHAY Daily Check-in",
    journalLabel: "How has your day been so far? (Optional)",
    journalPlaceholder: "Write a few lines about your thoughts, feelings, or struggles...",
    voiceLabel: "Voice Note Check-in",
    tapToRecord: "Tap to Record Voice Note",
    recordingText: "Recording",
    recordingDone: "Voice Note Recorded",
    submitBtn: "Submit Daily Check-in",
    submittingText: "Encrypting & Logging Check-in...",
    recordedSuccessTitle: "SAHAY Check-in Recorded",
    recordedSuccessMsg: "Your check-in has been securely recorded by your district mental health monitoring node.",
    teleManasNotice: "Emergency Tele-MANAS Support (24/7 Toll-Free Call):",
    submitAnotherBtn: "Submit Another Check-in",
    confidentialNotice: "Encrypted & Monitored under SAHAY Tele-MANAS Framework",
    helplineBanner: "Tele-MANAS Helpline: 14416",
    selectLanguageTitle: "Choose your preferred language",
    caretakerBadge: "Patient or Caretaker Access",
    // Landing Page
    aiSystemLabel: "AI-Powered Mental Health Monitoring & Distress Prediction System",
    welcomeTo: "Welcome to",
    portalDescription: "Mental Wellness Within Reach | SAHAY | Your Path to Healing and Support",
    selectRoleTitle: "Connecting individuals with certified mental health professionals and resources. Your journey to well-being begins here.",
    selectRoleSubtitle: "",
    openAccessSupport: "Open Access Support",
    patientOrCaretaker: "Patient / Caretaker",
    patientOrCaretakerSub: "मरीज़ या देखभालकर्ता",
    patientCardDesc: "Access resources, self-care tools, support, and connect with licensed counsellors.",
    continueAsPatient: "Start",
    restrictedAccess: "Restricted Department Access",
    authorizedCounsellor: "Authorized Counsellor",
    authorizedCounsellorSub: "अधिकृत काउंसलर / अधिकारी",
    counsellorCardDesc: "Manage your practice, schedule appointments, and provide secure therapy to clients.",
    counsellorLoginBtn: "Login (Secure)",
    trustBadge1: "Helpline Integration",
    trustBadge2: "Role Claims",
    trustBadge3: "& Recommendations",
    footerText: "SAHAY Portal — Mental Health Support System (Smart India Hackathon 2026)",
    // Counsellor Login
    counsellorAuthGate: "SAHAY Official Authorization Gate",
    counsellorPortalLogin: "Counsellor Portal Login",
    counsellorNetworkSub: "Authorized Clinical Counsellors & Officials Network",
    officialCounsellorId: "Official Counsellor ID",
    authGovEmail: "Authorized Government Email",
    securityPassword: "Security Password",
    authVerifyBtn: "Authenticate & Verify Identity",
    testCredentials: "Test Credentials (Click to Autofill)",
    identityVerified: "Identity Verified",
    selectJurisdiction: "Select Operational Jurisdiction",
    chooseAssigned: "Choose your assigned State & District to load SAHAY jurisdiction-filtered patient monitoring cases.",
    selectState: "Select Assigned State",
    selectDistrict: "Select Assigned District / Area",
    filterGuaranteePrefix: "Filter Guarantee: SAHAY dashboard will strictly display victim distress cases originating within",
    filterGuaranteeSuffix: ".",
    launchDashboardBtn: "Launch SAHAY Dashboard",
    // Navbar
    patientSupportPortal: "Patient Support Portal",
    aiDistressMonitoring: "AI Distress Monitoring",
    jurisdictionLabel: "Jurisdiction:",
    logoutBtn: "Logout",
    counsellorPortalLoginBtn: "Counsellor Portal Login",
    // Mood Selector
    moodQuestion: "How are you feeling right now?",
    mood1Label: "Severe Distress",
    mood1Desc: "Feeling overwhelmed or unsafe",
    mood2Label: "Down / Low",
    mood2Desc: "Feeling sad, tired or anxious",
    mood3Label: "Okay / Neutral",
    mood3Desc: "Just getting through the day",
    mood4Label: "Good / Calm",
    mood4Desc: "Feeling stable and relaxed",
    mood5Label: "Thriving",
    mood5Desc: "Feeling joyful and motivated",
    aiSafeguard: "AI Safeguard",
    editCheckIn: "Edit Check-in",
    viewDashboardBtn: "View Dashboard",
    dashNavDashboard: "Dashboard",
    dashNavCalendar: "Calendar",
    dashNavInsights: "Mood Insights",
    dashNavScheduled: "Scheduled",
    dashNavGoals: "Goals",
    dashNavCounsellor: "Counsellor",
    dashNavSupport: "Support",
    dashNavProfile: "Profile",
    dashNavYoga: "Yoga and Meditation",
    dashSearchPlaceholder: "Search something...",
    dashBannerTitle: "How do you feel, ",
    dashBannerSub: "Please, mark your mood today",
    dashBannerBtn: "Mark now",
    dashMoodChartTitle: "Mood chart",
    dashMoodChartSub: "Track your mood easily",
    dashDailyGoals: "Daily goals",
    dashChecklistTitle: "Custom Checklist",
    dashCoreRoutines: "Core Routines",
    dashReadingTitle: "Daily reading",
    dashYogaTitle: "Daily yoga",
    dashCheckInHistory: "Your Check-In History",
    dashCheckInHistorySub: "Review your past moods and daily journals.",
    dashInsightsTitle: "Mood Insights",
    dashInsightsSub: "Understand your emotional patterns and triggers.",
    dashScheduledTitle: "Your Appointments & Webinars",
    dashScheduledSub: "Manage your upcoming sessions with caretakers.",
    dashTasksCompleted: "tasks completed",
    dashNoteTimers: "Note: Complete core routines from the Dashboard timers.",
    dashViewAll: "View all",
    dashEnergyVsMood: "Energy vs Mood",
    dashEnergyVsMoodDesc: "Your mood tends to be lower on days with poor sleep. When you log less than 6 hours of sleep, your stress levels jump by an average of 30%.",
    dashRecurringPatterns: "Recurring Patterns",
    dashRecurringPatternsDesc: "Thursdays are consistently your highest-stress days. Consider scheduling your Daily yoga earlier in the day to manage anxiety proactively.",
    dash30DayTrend: "30-Day Trend",
    dashPastMonth: "Past Month",
    dashGoalsSub: "Track your custom checklist and routines.",
    dashGoalsGreat: "Great progress today!",
    dashOutOf: "out of",
    dashTopTriggers: "Top Triggers",
    dashTopTriggersDesc: "Work, Lack of sleep",
    goalWater: "Drink 2L Water",
    goalMeds: "Take prescribed medication",
    goalWalk: "30 min walk",
    goalJournal: "Write in journal",
    counsellorCenter: "Counsellor Center",
    counsellorCenterSub: "Connect with your therapist, track recommendations, and generate reports.",
    counsellorAvailable: "Available Online",
    counsellorRole: "Clinical Psychologist",
    viewProfileBtn: "View Profile",
    recommendationsTitle: "Recommendations",
    tasksBadge: "Tasks",
    chatTitle: "Counsellor Chat",
    privateBadge: "Private",
    shareLogsBtn: "Share Logs",
    typeMessagePlaceholder: "Type a message...",
    appointmentsTitle: "Appointments",
    upcomingBadge: "Upcoming",
    pastBadge: "Past",
    rescheduleBtn: "Reschedule",
    cancelBtn: "Cancel",
    reportTitle: "Shareable Mental Health Report",
    reportSub: "Generate a comprehensive summary of your check-ins to share with your counsellor for better guidance.",
    startDate: "Start Date",
    endDate: "End Date",
    includeInReport: "Include in report:",
    moodSummary: "Mood Summary",
    sleepData: "Sleep Data",
    triggersStr: "Triggers",
    activitiesStr: "Activities",
    includeJournal: "Include personal journal entries",
    generateReportBtn: "Generate Report",
    reportPreview: "Report Preview",
    editBtn: "Edit",
    periodLabel: "Period:",
    recentLabel: "Recent",
    todayLabel: "Today",
    shareBtn: "Share",
    downloadBtn: "Download",
    rescheduleTitle: "Reschedule Appointment",
    cancelTitle: "Cancel Appointment?",
    keepItBtn: "Keep It",
    yesCancelBtn: "Yes, Cancel",
    confirmBtn: "Confirm",
    shareLogsTitle: "Share Logs",
    shareLogsSub: "Select which recent entries you want to securely share with Dr. Rajesh Sharma.",
    shareSelectedBtn: "Share Selected",
    rec1Title: "10-minute breathing exercise",
    rec1Desc: "Focus on deep abdominal breathing",
    rec1Date: "Complete before Sept 20",
    rec2Title: "Write 3 things you are grateful for",
    rec2Desc: "Gratitude journaling",
    rec2Date: "Complete today",
    // Counsellor UI & Priority Badges
    priorityHigh: "High",
    priorityMedium: "Medium",
    priorityLow: "Low",
    navCases: "Dashboard/Cases",
    navChat: "Chat",
    navMeetings: "Meetings",
    navReports: "Shared Reports",
    navProfile: "Profile",
    statusOnline: "Online",
    tabUpcoming: "Upcoming",
    tabMissed: "Missed",
    repeatMissFlag: "Repeat Miss",
    noMeetingsFound: "No meetings found",
    scheduledMeetingsTitle: "Scheduled Meetings",
    sharedReportsTitle: "Shared Reports",
    noMeetingsScheduled: "No scheduled meetings for this patient",
    noReportsShared: "No shared reports for this patient",
    editProfileBtn: "Edit Profile",
    saveProfileBtn: "Save Profile",
    cancelEditBtn: "Cancel",
    changePhotoBtn: "Change Photo",
    photoSizeError: "Image size must be under 2 MB and a valid image format.",
    profileUpdatedSuccess: "Profile updated successfully.",
    qualificationsLabel: "Qualifications",
    specializationsLabel: "Specializations",
    bioLabel: "Professional Bio",
    joinMeeting: "Join Meeting",
    openPatientChat: "Open Patient Chat",
    followUpChat: "Follow Up via Chat",
    viewTrajectory: "View Case Trajectory",
    // New Connected Feature Translations
    tabYogaCategory: "Yoga Poses",
    tabMeditationCategory: "Meditation & Breathing",
    startTimer: "Start Session",
    pauseTimer: "Pause",
    resumeTimer: "Resume",
    resetTimer: "Reset",
    practiceCompleted: "Session Completed! Great job!",
    benefitLabel: "Useful for / Benefits",
    durationLabel: "Recommended Duration",
    pendingRequests: "Pending Requests",
    acceptBtn: "Accept",
    declineBtn: "Decline",
    statusPending: "Pending Approval",
    statusAccepted: "Accepted",
    statusDeclined: "Declined",
    counsellorBusyMsg: "Counsellor is currently busy/unavailable and could not accept the request.",
    requestSentSuccess: "Meeting request sent to your counsellor!",
    doctorAssignedGoals: "Doctor Assigned Goals",
    selfGoals: "Self Goals",
    addGoalBtn: "Add Goal",
    assignGoalBtn: "Assign Goal to Patient",
    assignedByLabel: "Assigned by",
    goalTitleLabel: "Goal Title",
    goalDescLabel: "Goal Description",
    dueDateLabel: "Due Date",
    inProgressLabel: "In Progress",
    completedLabel: "Completed",
    emailRequiredErr: "Please enter a valid email address.",
    phoneRequiredErr: "Please enter a valid 10-digit phone number.",
    reportSubmittedSuccess: "Report submitted successfully! Our support team will contact you.",
    emailLabel: "Email",
    phoneLabelRequired: "Phone Number"
  },
  hi: {
    portalTitle: "सहाय — सुरक्षित एवं गोपनीय सहायता पोर्टल",
    subTitle: "राज्य टेली-मानस सहायता प्रणाली से जुड़ें। सरल फ़ोन चेक-इन — किसी लंबे पंजीकरण की आवश्यकता नहीं।",
    phoneLabel: "मोबाइल नंबर दर्ज करें",
    phonePlaceholder: "उदा. 9876543210",
    getOtpBtn: "ओटीपी कोड प्राप्त करें",
    otpLabel: "4-अंकों का ओटीपी दर्ज करें",
    otpPlaceholder: "4821 दर्ज करें",
    otpDemoText: "डेमो ओटीपी ऑटो-फिल: 4821",
    verifyOtpBtn: "सत्यापित करें और चेक-इन जारी रखें",
    changeNumber: "नंबर बदलें",
    howAreYou: "आज आप कैसा महसूस कर रहे हैं?",
    dailyCheckIn: "सहाय दैनिक चेक-इन",
    journalLabel: "आज आपका दिन कैसा रहा? (वैकल्पिक)",
    journalPlaceholder: "अपने विचारों, भावनाओं या कठिनाइयों के बारे में कुछ पंक्तियाँ लिखें...",
    voiceLabel: "वॉइस नोट चेक-इन",
    tapToRecord: "वॉइस नोट रिकॉर्ड करने के लिए टैप करें",
    recordingText: "रिकॉर्डिंग चालू है",
    recordingDone: "वॉइस नोट रिकॉर्ड हो गया",
    submitBtn: "दैनिक चेक-इन जमा करें",
    submittingText: "सुरक्षित रूप से दर्ज हो रहा है...",
    recordedSuccessTitle: "सहाय चेक-इन सफलतापूर्वक दर्ज हुआ",
    recordedSuccessMsg: "आपका चेक-इन आपके जिला मानसिक स्वास्थ्य केंद्र द्वारा सुरक्षित रूप से दर्ज कर लिया गया है।",
    teleManasNotice: "आपात्कालीन टेली-मानस सहायता (24/7 निःशुल्क कॉल):",
    submitAnotherBtn: "एक और चेक-इन जमा करें",
    confidentialNotice: "सहाय टेली-मानस ढाँचे के तहत एन्क्रिप्टेड और सुरक्षित",
    helplineBanner: "टेली-मानस हेल्पलाइन: 14416",
    selectLanguageTitle: "अपनी पसंदीदा भाषा चुनें",
    caretakerBadge: "मरीज़ या देखभालकर्ता पोर्टल",
    // Landing Page
    aiSystemLabel: "एआई-संचालित मानसिक स्वास्थ्य निगरानी प्रणाली",
    welcomeTo: "में आपका स्वागत है",
    portalDescription: "मानसिक कल्याण आपकी पहुंच में | सहाय | उपचार और सहायता का आपका मार्ग",
    selectRoleTitle: "प्रमाणित मानसिक स्वास्थ्य पेशेवरों और संसाधनों के साथ व्यक्तियों को जोड़ना। आपकी भलाई की यात्रा यहाँ से शुरू होती है।",
    selectRoleSubtitle: "",
    openAccessSupport: "ओपन एक्सेस सपोर्ट",
    patientOrCaretaker: "मरीज / देखभालकर्ता",
    patientOrCaretakerSub: "मरीज़ या देखभालकर्ता",
    patientCardDesc: "Access resources, self-care tools, support, and connect with licensed counsellors.",
    continueAsPatient: "शुरू करें",
    restrictedAccess: "प्रतिबंधित विभाग पहुंच",
    authorizedCounsellor: "अधिकृत परामर्शदाता",
    authorizedCounsellorSub: "अधिकृत काउंसलर / अधिकारी",
    counsellorCardDesc: "Manage your practice, schedule appointments, and provide secure therapy to clients.",
    counsellorLoginBtn: "लॉगिन करें (सुरक्षित)",
    trustBadge1: "हेल्पलाइन एकीकरण",
    trustBadge2: "रोल क्लेम्स",
    trustBadge3: "और सिफ़ारिशें",
    footerText: "सहाय पोर्टल — मानसिक स्वास्थ्य सहायता प्रणाली (स्मार्ट इंडिया हैकथॉन 2026)",
    // Counsellor Login
    counsellorAuthGate: "सहाय आधिकारिक प्राधिकरण गेट",
    counsellorPortalLogin: "काउंसलर पोर्टल लॉगिन",
    counsellorNetworkSub: "अधिकृत नैदानिक काउंसलर और अधिकारी नेटवर्क",
    officialCounsellorId: "आधिकारिक काउंसलर आईडी",
    authGovEmail: "अधिकृत सरकारी ईमेल",
    securityPassword: "सुरक्षा पासवर्ड",
    authVerifyBtn: "प्रमाणित करें और पहचान सत्यापित करें",
    testCredentials: "परीक्षण क्रेडेंशियल (ऑटोफिल के लिए क्लिक करें)",
    identityVerified: "पहचान सत्यापित",
    selectJurisdiction: "संचालन अधिकार क्षेत्र का चयन करें",
    chooseAssigned: "सहाय अधिकार क्षेत्र-फ़िल्टर किए गए रोगी निगरानी मामलों को लोड करने के लिए अपना निर्दिष्ट राज्य और जिला चुनें।",
    selectState: "निर्दिष्ट राज्य का चयन करें",
    selectDistrict: "निर्दिष्ट जिला / क्षेत्र का चयन करें",
    filterGuaranteePrefix: "फ़िल्टर गारंटी: सहाय डैशबोर्ड सख्ती से उन पीड़ित संकट मामलों को प्रदर्शित करेगा जो",
    filterGuaranteeSuffix: "के भीतर उत्पन्न होते हैं।",
    launchDashboardBtn: "सहाय डैशबोर्ड लॉन्च करें",
    // Navbar
    patientSupportPortal: "रोगी सहायता पोर्टल",
    aiDistressMonitoring: "एआई संकट निगरानी",
    jurisdictionLabel: "अधिकार क्षेत्र:",
    logoutBtn: "लॉग आउट",
    counsellorPortalLoginBtn: "काउंसलर पोर्टल लॉगिन",
    // Mood Selector
    moodQuestion: "अभी आप कैसा महसूस कर रहे हैं?",
    mood1Label: "गंभीर संकट",
    mood1Desc: "अत्यधिक दबाव या असुरक्षित महसूस करना",
    mood2Label: "उदास / कम",
    mood2Desc: "उदास, थका हुआ या चिंतित महसूस करना",
    mood3Label: "ठीक / तटस्थ",
    mood3Desc: "बस दिन गुजार रहे हैं",
    mood4Label: "अच्छा / शांत",
    mood4Desc: "स्थिर और तनावमुक्त महसूस करना",
    mood5Label: "उत्कृष्ट",
    mood5Desc: "आनंदित और प्रेरित महसूस करना",
    aiSafeguard: "एआई सुरक्षा",
    editCheckIn: "चेक-इन संपादित करें",
    viewDashboardBtn: "डैशबोर्ड देखें",
    dashNavDashboard: "डैशबोर्ड",
    dashNavCalendar: "कैलेंडर",
    dashNavInsights: "मूड इनसाइट्स",
    dashNavScheduled: "निर्धारित",
    dashNavGoals: "लक्ष्य",
    dashNavCounsellor: "काउंसलर",
    dashNavSupport: "सहायता",
    dashNavProfile: "प्रोफ़ाइल",
    dashNavYoga: "योग और ध्यान",
    dashSearchPlaceholder: "कुछ खोजें...",
    dashBannerTitle: "आप कैसा महसूस कर रहे हैं, ",
    dashBannerSub: "कृपया, आज अपना मूड दर्ज करें",
    dashBannerBtn: "अभी दर्ज करें",
    dashMoodChartTitle: "मूड चार्ट",
    dashMoodChartSub: "आसानी से अपने मूड को ट्रैक करें",
    dashDailyGoals: "दैनिक लक्ष्य",
    dashChecklistTitle: "कस्टम चेकलिस्ट",
    dashCoreRoutines: "मुख्य दिनचर्या",
    dashReadingTitle: "दैनिक पढ़ना",
    dashYogaTitle: "दैनिक योग",
    dashCheckInHistory: "आपका चेक-इन इतिहास",
    dashCheckInHistorySub: "अपने पिछले मूड और दैनिक पत्रिकाओं की समीक्षा करें।",
    dashInsightsTitle: "मूड इनसाइट्स",
    dashInsightsSub: "अपने भावनात्मक पैटर्न और ट्रिगर्स को समझें।",
    dashScheduledTitle: "आपकी नियुक्तियां और वेबिनार",
    dashScheduledSub: "देखभालकर्ताओं के साथ अपने आगामी सत्रों का प्रबंधन करें।",
    dashTasksCompleted: "कार्य पूरे किए गए",
    dashNoteTimers: "नोट: डैशबोर्ड टाइमर से मुख्य दिनचर्या पूरी करें।",
    dashViewAll: "सभी देखें",
    dashEnergyVsMood: "ऊर्जा बनाम मूड",
    dashEnergyVsMoodDesc: "खराब नींद वाले दिनों में आपका मूड आमतौर पर कम होता है। जब आप 6 घंटे से कम नींद लेते हैं, तो आपका तनाव स्तर औसतन 30% बढ़ जाता है।",
    dashRecurringPatterns: "बार-बार होने वाले पैटर्न",
    dashRecurringPatternsDesc: "गुरुवार लगातार आपके सबसे अधिक तनाव वाले दिन होते हैं। चिंता को सक्रिय रूप से प्रबंधित करने के लिए दिन में पहले अपना 'दैनिक योग' निर्धारित करने पर विचार करें।",
    dash30DayTrend: "30-दिन की प्रवृत्ति",
    dashPastMonth: "पिछला महीना",
    dashGoalsSub: "अपनी कस्टम चेकलिस्ट और दिनचर्या ट्रैक करें।",
    dashGoalsGreat: "आज शानदार प्रगति!",
    dashOutOf: "में से",
    dashTopTriggers: "शीर्ष ट्रिगर्स",
    dashTopTriggersDesc: "काम, नींद की कमी",
    goalWater: "2 लीटर पानी पिएं",
    goalMeds: "निर्धारित दवा लें",
    goalWalk: "30 मिनट की सैर",
    goalJournal: "जर्नल में लिखें",
    counsellorCenter: "काउंसलर केंद्र",
    counsellorCenterSub: "अपने थेरेपिस्ट से जुड़ें, अनुशंसाओं को ट्रैक करें, और रिपोर्ट तैयार करें।",
    counsellorAvailable: "ऑनलाइन उपलब्ध",
    counsellorRole: "नैदानिक मनोवैज्ञानिक",
    viewProfileBtn: "प्रोफ़ाइल देखें",
    recommendationsTitle: "अनुशंसाएं",
    tasksBadge: "कार्य",
    chatTitle: "काउंसलर चैट",
    privateBadge: "निजी",
    shareLogsBtn: "लॉग साझा करें",
    typeMessagePlaceholder: "एक संदेश टाइप करें...",
    appointmentsTitle: "नियुक्तियां",
    upcomingBadge: "आगामी",
    pastBadge: "पिछला",
    rescheduleBtn: "पुनर्निर्धारित करें",
    cancelBtn: "रद्द करें",
    reportTitle: "साझा करने योग्य मानसिक स्वास्थ्य रिपोर्ट",
    reportSub: "बेहतर मार्गदर्शन के लिए अपने काउंसलर के साथ साझा करने के लिए अपने चेक-इन का एक व्यापक सारांश तैयार करें।",
    startDate: "आरंभ तिथि",
    endDate: "समाप्ति तिथि",
    includeInReport: "रिपोर्ट में शामिल करें:",
    moodSummary: "मूड सारांश",
    sleepData: "नींद का डेटा",
    triggersStr: "ट्रिगर्स",
    activitiesStr: "गतिविधियां",
    includeJournal: "व्यक्तिगत जर्नल प्रविष्टियां शामिल करें",
    generateReportBtn: "रिपोर्ट बनाएं",
    reportPreview: "रिपोर्ट पूर्वावलोकन",
    editBtn: "संपादित करें",
    periodLabel: "अवधि:",
    recentLabel: "हालिया",
    todayLabel: "आज",
    shareBtn: "साझा करें",
    downloadBtn: "डाउनलोड करें",
    rescheduleTitle: "नियुक्ति पुनर्निर्धारित करें",
    cancelTitle: "नियुक्ति रद्द करें?",
    keepItBtn: "इसे रखें",
    yesCancelBtn: "हां, रद्द करें",
    confirmBtn: "पुष्टि करें",
    shareLogsTitle: "लॉग साझा करें",
    shareLogsSub: "चुनें कि आप कौन सी हालिया प्रविष्टियां डॉ. राजेश शर्मा के साथ सुरक्षित रूप से साझा करना चाहते हैं।",
    shareSelectedBtn: "चयनित साझा करें",
    rec1Title: "10 मिनट की श्वास व्यायाम",
    rec1Desc: "गहरी पेट की श्वास पर ध्यान दें",
    rec1Date: "20 सितंबर से पहले पूरा करें",
    rec2Title: "3 चीजें लिखें जिनके लिए आप आभारी हैं",
    rec2Desc: "कृतज्ञता जर्नलिंग",
    rec2Date: "आज पूरा करें",
    // Counsellor UI & Priority Badges
    priorityHigh: "उच्च",
    priorityMedium: "मध्यम",
    priorityLow: "निम्न",
    navCases: "डैशबोर्ड/मामले",
    navChat: "चैट",
    navMeetings: "बैठकें",
    navReports: "साझा रिपोर्ट",
    navProfile: "प्रोफ़ाइल",
    statusOnline: "ऑनलाइन",
    tabUpcoming: "आगामी",
    tabMissed: "छूटी हुई",
    repeatMissFlag: "पुनरावृत्ति अनुपस्थिति",
    noMeetingsFound: "कोई बैठक नहीं मिली",
    scheduledMeetingsTitle: "निर्धारित बैठकें",
    sharedReportsTitle: "साझा की गई रिपोर्ट",
    noMeetingsScheduled: "इस मरीज के लिए कोई निर्धारित बैठक नहीं है",
    noReportsShared: "इस मरीज के लिए कोई साझा रिपोर्ट नहीं है",
    editProfileBtn: "प्रोफ़ाइल संपादित करें",
    saveProfileBtn: "प्रोफ़ाइल सहेजें",
    cancelEditBtn: "रद्द करें",
    changePhotoBtn: "फ़ोटो बदलें",
    photoSizeError: "छवि का आकार 2 MB से कम और मान्य प्रारूप होना चाहिए।",
    profileUpdatedSuccess: "प्रोफ़ाइल सफलतापूर्वक अपडेट की गई।",
    qualificationsLabel: "योग्यताएं",
    specializationsLabel: "विशेषज्ञता",
    bioLabel: "पेशेवर विवरण",
    joinMeeting: "मीटिंग में शामिल हों",
    openPatientChat: "रोगी चैट खोलें",
    followUpChat: "चैट द्वारा अनुवर्ती कार्यवाही",
    viewTrajectory: "केस प्रक्षेपवक्र देखें",
    // New Connected Feature Translations
    tabYogaCategory: "योग आसन",
    tabMeditationCategory: "ध्यान और श्वास",
    startTimer: "सत्र शुरू करें",
    pauseTimer: "रोकें",
    resumeTimer: "पुनः शुरू करें",
    resetTimer: "रीसेट करें",
    practiceCompleted: "सत्र पूरा हुआ! बहुत बढ़िया!",
    benefitLabel: "उपयोगिता / लाभ",
    durationLabel: "अनुशंसित अवधि",
    pendingRequests: "लंबित अनुरोध",
    acceptBtn: "स्वीकार करें",
    declineBtn: "अस्वीकार करें",
    statusPending: "अनुमोदन का इंतजार",
    statusAccepted: "स्वीकृत",
    statusDeclined: "अस्वीकृत",
    counsellorBusyMsg: "काउंसलर वर्तमान में व्यस्त/अनुपलब्ध हैं और अनुरोध स्वीकार नहीं कर सके।",
    requestSentSuccess: "आपके काउंसलर को मीटिंग का अनुरोध भेज दिया गया है!",
    doctorAssignedGoals: "डॉक्टर द्वारा निर्दिष्ट लक्ष्य",
    selfGoals: "स्वयं के लक्ष्य",
    addGoalBtn: "लक्ष्य जोड़ें",
    assignGoalBtn: "रोगी को लक्ष्य निर्दिष्ट करें",
    assignedByLabel: "द्वारा निर्दिष्ट",
    goalTitleLabel: "लक्ष्य का शीर्षक",
    goalDescLabel: "लक्ष्य का विवरण",
    dueDateLabel: "नियत तिथि",
    inProgressLabel: "प्रगति पर है",
    completedLabel: "पूरा हुआ",
    emailRequiredErr: "कृपया एक मान्य ईमेल पता दर्ज करें।",
    phoneRequiredErr: "कृपया 10-अंकों का मान्य फ़ोन नंबर दर्ज करें।",
    reportSubmittedSuccess: "रिपोर्ट सफलतापूर्वक जमा हो गई है! हमारी सहायता टीम आपसे संपर्क करेगी।",
    emailLabel: "ईमेल",
    phoneLabelRequired: "फ़ोन नंबर"
  }
};

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: Translations;
  hasSelectedLanguage: boolean;
  setHasSelectedLanguage: (selected: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem('sahay_language');
    return (saved as SupportedLanguage) || 'en';
  });
  
  const [hasSelectedLanguage, setHasSelectedLanguageState] = useState<boolean>(() => {
    return localStorage.getItem('sahay_language_selected') === 'true';
  });

  const handleSetLanguage = (lang: SupportedLanguage) => {
    setLanguage(lang);
    localStorage.setItem('sahay_language', lang);
  };

  const setHasSelectedLanguage = (selected: boolean) => {
    setHasSelectedLanguageState(selected);
    localStorage.setItem('sahay_language_selected', String(selected));
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage: handleSetLanguage, 
      t: TRANSLATIONS[language],
      hasSelectedLanguage,
      setHasSelectedLanguage
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const DYNAMIC_TRANSLATIONS: Record<string, { en: string; hi: string }> = {
  "Crisis Check-in": { en: "Crisis Check-in", hi: "संकट चेक-इन" },
  "Urgent crisis triage review following voice sentiment alert.": {
    en: "Urgent crisis triage review following voice sentiment alert.",
    hi: "वॉइस सेंटिमेंट अलर्ट के बाद आपातकालीन संकट समीक्षा।"
  },
  "Video Consultation": { en: "Video Consultation", hi: "वीडियो परामर्श" },
  "Follow-up on recent livelihood loss trauma.": {
    en: "Follow-up on recent livelihood loss trauma.",
    hi: "हाल की आजीविका हानि के आघात पर अनुवर्ती कार्यवाही।"
  },
  "Weekly Therapy": { en: "Weekly Therapy", hi: "साप्ताहिक थेरेपी" },
  "Routine weekly CBT session.": {
    en: "Routine weekly CBT session.",
    hi: "नियमित साप्ताहिक सीबीटी सत्र।"
  },
  "Audio Follow-up": { en: "Audio Follow-up", hi: "ऑडियो अनुवर्ती कार्यवाही" },
  "Patient did not answer tele-consultation call.": {
    en: "Patient did not answer tele-consultation call.",
    hi: "रोगी ने टेली-परामर्श कॉल का उत्तर नहीं दिया।"
  },
  "Repeat no-show — 2nd consecutive missed session.": {
    en: "Repeat no-show — 2nd consecutive missed session.",
    hi: "पुनरावृत्ति गैर-हाजिरी — लगातार दूसरा छूटा हुआ सत्र।"
  },
  "Mindfulness modules reviewed successfully.": {
    en: "Mindfulness modules reviewed successfully.",
    hi: "माइंडफुलनेस मॉड्यूल की सफलतापूर्वक समीक्षा की गई।"
  },
  "Automated check-in update logged from patient mobile node.": {
    en: "Automated check-in update logged from patient mobile node.",
    hi: "रोगी मोबाइल नोड से स्वचालित चेक-इन अपडेट दर्ज किया गया।"
  },
  "Automated check-in update...": {
    en: "Automated check-in update...",
    hi: "स्वचालित चेक-इन अपडेट..."
  },
  "Trauma Counselling": { en: "Trauma Counselling", hi: "आघात परामर्श" },
  "Crisis Intervention": { en: "Crisis Intervention", hi: "संकट हस्तक्षेप" },
  "Adolescent Psychology": { en: "Adolescent Psychology", hi: "किशोरी मनोविज्ञान" },
  "PTSD Therapy": { en: "PTSD Therapy", hi: "पीटीएसडी थेरेपी" },
  "Anxiety & Panic Disorders": { en: "Anxiety & Panic Disorders", hi: "चिंता और घबराहट विकार" },
  "Depression Support": { en: "Depression Support", hi: "अवसाद सहायता" },
  "Victim Rehabilitation": { en: "Victim Rehabilitation", hi: "पीड़ित पुनर्वास" },
  "Addiction Counselling": { en: "Addiction Counselling", hi: "व्यसन परामर्श" },
  "Family Support": { en: "Family Support", hi: "पारिवारिक सहायता" },
  "Dedicated clinical psychologist specializing in trauma care and adolescent mental well-being.": {
    en: "Dedicated clinical psychologist specializing in trauma care and adolescent mental well-being.",
    hi: "ट्रॉमा केयर और किशोर मानसिक कल्याण में विशेषज्ञता प्राप्त समर्पित नैदानिक मनोवैज्ञानिक।"
  }
};

export const getDynamicText = (text: string, lang: SupportedLanguage): string => {
  if (DYNAMIC_TRANSLATIONS[text]) {
    return DYNAMIC_TRANSLATIONS[text][lang];
  }
  return text;
};
