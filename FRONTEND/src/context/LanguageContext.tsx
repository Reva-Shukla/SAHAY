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
    caretakerBadge: "Patient or Caretaker Access"
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
    caretakerBadge: "मरीज़ या देखभालकर्ता पोर्टल"
  }
};

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<SupportedLanguage>('en');

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: TRANSLATIONS[language] }}>
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
