import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Lock, Mail, UserCheck, AlertTriangle, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { INDIAN_STATES_DISTRICTS, getStateDistricts } from '../data/statesAndDistricts';
import { Navbar } from '../components/Navbar';

export const CounsellorLogin: React.FC = () => {
  const navigate = useNavigate();
  const { session, loginStep, login, completeOnboarding } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (session) {
      navigate('/counsellor/dashboard', { replace: true });
    }
  }, [session, navigate]);

  // Form State
  const [email, setEmail] = useState('rajesh.sharma@sahay.org');
  const [password, setPassword] = useState('password123');
  const [counsellorId, setCounsellorId] = useState('CNS-8842');

  const [errorMessage, setErrorMessage] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  // Onboarding Jurisdiction State
  const [selectedState, setSelectedState] = useState('Haryana');
  const [selectedDistrict, setSelectedDistrict] = useState('Rewari');

  // Handle State Change to reset District dropdown
  const handleStateChange = (stateName: string) => {
    setSelectedState(stateName);
    const districts = getStateDistricts(stateName);
    if (districts.length > 0) {
      setSelectedDistrict(districts[0]);
    } else {
      setSelectedDistrict('');
    }
  };

  // Step 1: Login Submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const result = login(email, password, counsellorId);
    if (!result.success) {
      setErrorMessage(result.error || 'Access Denied');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  // Step 2: Onboarding Jurisdiction Confirmation
  const handleOnboardingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedState || !selectedDistrict) {
      alert('Please select your assigned State and District jurisdiction.');
      return;
    }
    completeOnboarding(selectedState, selectedDistrict);
    navigate('/counsellor/dashboard');
  };

  // Quick Demo Credentials Selector helper
  const handleSelectDemoUser = (id: string, em: string, state: string, dist: string) => {
    setCounsellorId(id);
    setEmail(em);
    setPassword('password123');
    setSelectedState(state);
    setSelectedDistrict(dist);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-md w-full mx-auto px-4 py-8 sm:py-12 flex flex-col justify-center">
        
        {/* Step 1: Credentials Verification */}
        {loginStep === 'CREDENTIALS' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              x: isShaking ? [-12, 12, -8, 8, -4, 4, 0] : 0
            }}
            transition={{ duration: isShaking ? 0.4 : 0.3 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold shadow-xs">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>SAHAY Official Authorization Gate</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Counsellor Portal Login
              </h2>
              <p className="text-xs text-slate-600">
                Authorized Clinical Counsellors & Officials Network
              </p>
            </div>

            {/* Login Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xl space-y-5">
              
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Counsellor ID Field */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Official Counsellor ID <span className="text-indigo-600">*</span>
                  </label>
                  <div className="relative">
                    <UserCheck className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={counsellorId}
                      onChange={(e) => setCounsellorId(e.target.value)}
                      placeholder="e.g. CNS-8842"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-indigo-900 font-mono font-bold text-sm uppercase focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Authorized Government Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@sahay.org"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Security Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>

                {/* Error Banner with Framer Motion Entrance */}
                <AnimatePresence>
                  {errorMessage && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 font-medium"
                    >
                      <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                      <span>{errorMessage}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <span>Authenticate & Verify Identity</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Demo Login Quick Selectors */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <p className="text-[11px] font-bold text-slate-500 text-center uppercase tracking-wider">
                  Test Credentials (Click to Autofill)
                </p>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => handleSelectDemoUser('CNS-8842', 'rajesh.sharma@sahay.org', 'Haryana', 'Rewari')}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-all shadow-xs"
                  >
                    <p className="font-bold text-indigo-700">CNS-8842 (Dr. Rajesh)</p>
                    <p className="text-slate-500 text-[10px]">Haryana → Rewari</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectDemoUser('CNS-3310', 'vikram.rao@sahay.org', 'Maharashtra', 'Pune')}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-all shadow-xs"
                  >
                    <p className="font-bold text-indigo-700">CNS-3310 (Dr. Vikram)</p>
                    <p className="text-slate-500 text-[10px]">Maharashtra → Pune</p>
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* Step 2: Jurisdiction Onboarding (State & District Selection) */}
        {loginStep === 'ONBOARDING' && (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Identity Verified</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Select Operational Jurisdiction
              </h2>
              <p className="text-xs text-slate-600">
                Choose your assigned State & District to load SAHAY jurisdiction-filtered patient monitoring cases.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xl space-y-5">
              
              <form onSubmit={handleOnboardingSubmit} className="space-y-4">
                
                {/* State Dropdown */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-indigo-600" />
                    <span>Select Assigned State</span>
                  </label>
                  <select
                    value={selectedState}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-indigo-500"
                  >
                    {INDIAN_STATES_DISTRICTS.map((s) => (
                      <option key={s.state} value={s.state}>
                        {s.state}
                      </option>
                    ))}
                  </select>
                </div>

                {/* District Dropdown (Dependent on State) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>Select Assigned District / Area</span>
                  </label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-indigo-500"
                  >
                    {getStateDistricts(selectedState).map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-[11px] text-indigo-900">
                  📍 <strong>Filter Guarantee:</strong> SAHAY dashboard will strictly display victim distress cases originating within <strong>{selectedDistrict}, {selectedState}</strong>.
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-700 hover:to-emerald-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <span>Launch SAHAY Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

            </div>
          </motion.div>
        )}

      </main>

      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-200 bg-white">
        SAHAY Portal — Mental Health Support System (Smart India Hackathon 2026)
      </footer>
    </div>
  );
};
