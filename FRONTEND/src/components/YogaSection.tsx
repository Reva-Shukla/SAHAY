import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Check, Sparkles, Wind, Heart, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export interface PracticeItem {
  id: string;
  category: 'yoga' | 'meditation';
  name: string;
  nameHi: string;
  sanskritName?: string;
  description: string;
  descriptionHi: string;
  benefit: string;
  benefitHi: string;
  durationMinutes: number;
}

const PRACTICES: PracticeItem[] = [
  // YOGA
  {
    id: 'yoga-1',
    category: 'yoga',
    name: "Child's Pose",
    nameHi: "बालक आसन (Balasana)",
    sanskritName: "Balasana",
    description: "Restorative pose that gently stretches hips, thighs, and ankles while calming the mind.",
    descriptionHi: "विश्रामदायक मुद्रा जो दिमाग को शांत करते हुए कूल्हों, जांघों और टखनों को धीरे से खींचती है।",
    benefit: "Stress relief, anxiety reduction & lower back relaxation.",
    benefitHi: "तनाव से राहत, चिंता में कमी और पीठ के निचले हिस्से को आराम।",
    durationMinutes: 5
  },
  {
    id: 'yoga-2',
    category: 'yoga',
    name: "Cat-Cow Pose",
    nameHi: "मार्जरी-बिटिलासन (Cat-Cow)",
    sanskritName: "Marjaryasana-Bitilasana",
    description: "Gentle flow between two postures that warms up the body and brings flexibility to the spine.",
    descriptionHi: "दो मुद्राओं के बीच सौम्य प्रवाह जो शरीर को गर्म करता है और रीढ़ की हड्डी में लचीलापन लाता है।",
    benefit: "Spinal mobility, posture improvement & core tension release.",
    benefitHi: "रीढ़ की गतिशीलता, मुद्रा में सुधार और शारीरिक तनाव से मुक्ति।",
    durationMinutes: 5
  },
  {
    id: 'yoga-3',
    category: 'yoga',
    name: "Mountain Pose",
    nameHi: "ताड़ासन (Tadasana)",
    sanskritName: "Tadasana",
    description: "Foundation of all standing poses that improves posture, balance, and grounding focus.",
    descriptionHi: "सभी खड़ी मुद्राओं का आधार जो मुद्रा, संतुलन और ध्यान में सुधार करता है।",
    benefit: "Body posture alignment, balance & mental grounding.",
    benefitHi: "शारीरिक मुद्रा संरेखण, संतुलन और मानसिक स्थिरता।",
    durationMinutes: 3
  },
  {
    id: 'yoga-4',
    category: 'yoga',
    name: "Tree Pose",
    nameHi: "वृक्षासन (Vrksasana)",
    sanskritName: "Vrksasana",
    description: "Standing balance pose that strengthens legs and improves concentration and mental clarity.",
    descriptionHi: "संतुलन मुद्रा जो पैरों को मजबूत बनाती है और एकाग्रता तथा मानसिक स्पष्टता में सुधार करती है।",
    benefit: "Mental focus, neuromuscular balance & leg strength.",
    benefitHi: "मानसिक एकाग्रता, तंत्रिका संबंधी संतुलन और पैरों की ताकत।",
    durationMinutes: 5
  },
  {
    id: 'yoga-5',
    category: 'yoga',
    name: "Seated Forward Fold",
    nameHi: "पश्चिमोत्तानासन (Seated Fold)",
    sanskritName: "Paschimottanasana",
    description: "Deep seated stretch for the hamstrings and spine that relieves anxiety and nervous fatigue.",
    descriptionHi: "जांघों और रीढ़ के लिए गहरा खिंचाव जो चिंता और तंत्रिका की थकान को दूर करता है।",
    benefit: "Calms nervous system, relieves mild depression & fatigue.",
    benefitHi: "तंत्रिका तंत्र को शांत करता है, हल्के अवसाद और थकान को दूर करता है।",
    durationMinutes: 7
  },
  {
    id: 'yoga-6',
    category: 'yoga',
    name: "Corpse Pose",
    nameHi: "शवासन (Savasana)",
    sanskritName: "Savasana",
    description: "Total relaxation pose performed to integrate physical practice and quiet active mind chatter.",
    descriptionHi: "पूर्ण विश्राम मुद्रा जो शारीरिक अभ्यास को एकीकृत करने और मन को शांत करने के लिए की जाती है।",
    benefit: "Deep nervous system reset, insomnia relief & full body relaxation.",
    benefitHi: "गहरा विश्राम, अनिद्रा से राहत और पूरे शरीर को शांति।",
    durationMinutes: 10
  },
  // MEDITATION & BREATHING
  {
    id: 'med-1',
    category: 'meditation',
    name: "Deep Breathing",
    nameHi: "गहरी सांस अभ्यास (Diaphragmatic)",
    description: "Deep abdominal breathing to activate the parasympathetic natural relaxation response.",
    descriptionHi: "शरीर की प्राकृतिक विश्राम प्रतिक्रिया को सक्रिय करने के लिए गहरी पेट की सांस लेने का अभ्यास।",
    benefit: "Slows heart rate, lowers blood pressure & reduces immediate panic.",
    benefitHi: "हृदय गति को धीमा करता है, रक्तचाप कम करता है और घबराहट घटाता है।",
    durationMinutes: 5
  },
  {
    id: 'med-2',
    category: 'meditation',
    name: "4-7-8 Breathing",
    nameHi: "4-7-8 प्राणायाम तकनीक",
    description: "Rhythmic breathing pattern: inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds.",
    descriptionHi: "लयबद्ध श्वास तकनीक: 4 सेकंड सांस लें, 7 सेकंड रोकें, 8 सेकंड छोड़ें।",
    benefit: "Rapid anxiety reduction, sleep onset support & emotional stabilization.",
    benefitHi: "चिंता में तेजी से कमी, अच्छी नींद में सहायता और भावनात्मक स्थिरता।",
    durationMinutes: 5
  },
  {
    id: 'med-3',
    category: 'meditation',
    name: "Box Breathing",
    nameHi: "बॉक्स ब्रीथिंग (Square Breathing)",
    description: "Equal 4-part square breathing (4s in, 4s hold, 4s out, 4s hold) used for stress resilience.",
    descriptionHi: "बराबर 4-चरणीय वर्ग श्वास (4 से. अंदर, 4 से. रोकें, 4 से. बाहर, 4 से. रोकें)।",
    benefit: "Heightened mental focus, vagus nerve stimulation & stress resilience.",
    benefitHi: "मानसिक एकाग्रता में वृद्धि और तनाव से मुकाबला करने की क्षमता।",
    durationMinutes: 4
  },
  {
    id: 'med-4',
    category: 'meditation',
    name: "Mindfulness Meditation",
    nameHi: "माइंडफुलनेस ध्यान (Mindfulness)",
    description: "Observing thoughts, feelings, and bodily sensations without judgment to cultivate presence.",
    descriptionHi: "बिना किसी निर्णय के विचारों और संवेदनाओं का अवलोकन कर वर्तमान में जीने का अभ्यास।",
    benefit: "Emotional self-regulation, mindfulness & reduced overthinking.",
    benefitHi: "भावनात्मक स्व-नियंत्रण, जागरूकता और अत्यधिक सोच में कमी।",
    durationMinutes: 10
  },
  {
    id: 'med-5',
    category: 'meditation',
    name: "Body Scan",
    nameHi: "बॉडी स्कैन रिलेक्सेशन",
    description: "Systematic mental scan from toes to head to locate and consciously release hidden physical tension.",
    descriptionHi: "सिर से पैर तक ध्यान लगाकर शारीरिक तनाव को खोजने और शांत करने का अभ्यास।",
    benefit: "Somatic awareness, muscle relaxation & chronic stress release.",
    benefitHi: "शारीरिक जागरूकता, मांसपेशियों में खिंचाव से राहत और तनाव मुक्ति।",
    durationMinutes: 8
  },
  {
    id: 'med-6',
    category: 'meditation',
    name: "Guided Relaxation",
    nameHi: "मार्गदर्शित विश्राम (Guided Relaxation)",
    description: "Soothing mental visualization promoting deep mental serenity, safety, and muscle release.",
    descriptionHi: "मानसिक शांति, सुरक्षा और विश्राम को बढ़ावा देने वाली सुखद दृश्य श्वास।",
    benefit: "Calms hyper-arousal, improves sleep quality & emotional comfort.",
    benefitHi: "मानसिक उत्तेजना को शांत करता है, नींद में सुधार करता है और मानसिक सुकून देता है।",
    durationMinutes: 10
  }
];

export const YogaSection: React.FC = () => {
  const { language, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<'yoga' | 'meditation'>('yoga');

  // Practice Timer States
  const [timers, setTimers] = useState<Record<string, { timeLeft: number; isRunning: boolean; isDone: boolean }>>(() => {
    const initial: Record<string, { timeLeft: number; isRunning: boolean; isDone: boolean }> = {};
    PRACTICES.forEach(p => {
      initial[p.id] = { timeLeft: p.durationMinutes * 60, isRunning: false, isDone: false };
    });
    return initial;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prev => {
        const next = { ...prev };
        let updated = false;

        Object.keys(next).forEach(id => {
          if (next[id].isRunning && next[id].timeLeft > 0) {
            updated = true;
            if (next[id].timeLeft === 1) {
              next[id] = { timeLeft: 0, isRunning: false, isDone: true };
            } else {
              next[id] = { ...next[id], timeLeft: next[id].timeLeft - 1 };
            }
          }
        });

        return updated ? next : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleStart = (id: string) => {
    setTimers(prev => ({
      ...prev,
      [id]: { ...prev[id], isRunning: true, isDone: false }
    }));
  };

  const handlePause = (id: string) => {
    setTimers(prev => ({
      ...prev,
      [id]: { ...prev[id], isRunning: false }
    }));
  };

  const handleReset = (id: string) => {
    const practice = PRACTICES.find(p => p.id === id);
    const initialSec = (practice?.durationMinutes || 5) * 60;
    setTimers(prev => ({
      ...prev,
      [id]: { timeLeft: initialSec, isRunning: false, isDone: false }
    }));
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const filteredPractices = PRACTICES.filter(p => p.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <Wind className="w-6 h-6 text-emerald-600" />
            {t.dashNavYoga}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {language === 'hi' 
              ? 'माइंडफुलनेस, श्वास तकनीक और निर्देशित ध्यान का अभ्यास करें।' 
              : 'Practice guided yoga poses, breathing techniques, and mindfulness meditation.'}
          </p>
        </div>

        {/* Category Switcher */}
        <div className="flex bg-white/80 p-1.5 rounded-2xl border border-slate-200 shadow-sm shrink-0">
          <button
            onClick={() => setSelectedCategory('yoga')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              selectedCategory === 'yoga'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {t.tabYogaCategory}
          </button>
          <button
            onClick={() => setSelectedCategory('meditation')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              selectedCategory === 'meditation'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            {t.tabMeditationCategory}
          </button>
        </div>
      </div>

      {/* Grid of Practices */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPractices.map(practice => {
          const state = timers[practice.id] || { timeLeft: practice.durationMinutes * 60, isRunning: false, isDone: false };
          const totalSec = practice.durationMinutes * 60;
          const progressPercent = Math.round(((totalSec - state.timeLeft) / totalSec) * 100);
          
          const name = language === 'hi' ? practice.nameHi : practice.name;
          const description = language === 'hi' ? practice.descriptionHi : practice.description;
          const benefit = language === 'hi' ? practice.benefitHi : practice.benefit;

          return (
            <div
              key={practice.id}
              className={`bg-white/80 backdrop-blur-xl rounded-3xl p-6 border shadow-sm flex flex-col justify-between transition-all hover:shadow-md ${
                state.isRunning ? 'border-emerald-400 ring-2 ring-emerald-400/20' : 'border-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60">
                    {practice.sanskritName || (practice.category === 'yoga' ? 'Yoga' : 'Breathing')}
                  </span>
                  <div className="flex items-center gap-1.5 text-slate-500 font-mono text-xs font-bold bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {practice.durationMinutes} min
                  </div>
                </div>

                <h3 className="font-extrabold text-slate-800 text-lg mb-1">{name}</h3>
                <p className="text-slate-600 text-xs leading-relaxed mb-4">{description}</p>

                <div className="bg-emerald-50/70 border border-emerald-100/80 rounded-2xl p-3 mb-5">
                  <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    {t.benefitLabel}
                  </div>
                  <p className="text-xs text-emerald-950 font-medium leading-snug">{benefit}</p>
                </div>
              </div>

              {/* Interactive Timer Controls */}
              <div className="pt-4 border-t border-slate-100">
                {/* Progress Bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="font-mono font-extrabold text-slate-800 text-lg">
                    {formatTime(state.timeLeft)}
                  </div>

                  {state.isDone ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 flex items-center gap-1">
                        <Check className="w-4 h-4 text-emerald-600" />
                        {t.practiceCompleted}
                      </span>
                      <button
                        onClick={() => handleReset(practice.id)}
                        className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 transition-colors"
                        title={t.resetTimer}
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  ) : state.isRunning ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePause(practice.id)}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <Pause className="w-3.5 h-3.5 fill-current" />
                        {t.pauseTimer}
                      </button>
                      <button
                        onClick={() => handleReset(practice.id)}
                        className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 transition-colors"
                        title={t.resetTimer}
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  ) : state.timeLeft < totalSec ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStart(practice.id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />
                        {t.resumeTimer}
                      </button>
                      <button
                        onClick={() => handleReset(practice.id)}
                        className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 transition-colors"
                        title={t.resetTimer}
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStart(practice.id)}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />
                      {t.startTimer}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
