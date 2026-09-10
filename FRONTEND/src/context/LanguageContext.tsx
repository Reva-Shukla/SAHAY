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
    voiceLabel: "Voice Note Check-in (Optional)",
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
    editCheckIn: "Edit Check-in"
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
    voiceLabel: "वॉइस नोट चेक-इन (वैकल्पिक)",
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
    editCheckIn: "चेक-इन संपादित करें"
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
