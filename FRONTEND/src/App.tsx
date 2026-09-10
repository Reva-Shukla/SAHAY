import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './auth/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { PatientCheckIn } from './pages/PatientCheckIn';
import { CounsellorLogin } from './pages/CounsellorLogin';
import { CounsellorDashboard } from './pages/CounsellorDashboard';
import { NotFound } from './pages/NotFound';
import { LanguagePopup } from './components/LanguagePopup';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 mins
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <LanguagePopup />
          <BrowserRouter>
            <Routes>
              {/* Root Landing Page: Role Gate Selection (Patient vs Counsellor) & Language Choice */}
              <Route path="/" element={<LandingPage />} />
              
              {/* Patient & Caretaker Portal */}
              <Route path="/patient" element={<PatientCheckIn />} />

              {/* Counsellor Login & Jurisdiction Gate */}
              <Route path="/counsellor/login" element={<CounsellorLogin />} />

              {/* Protected Counsellor Dashboard */}
              <Route
                path="/counsellor/dashboard"
                element={
                  <ProtectedRoute>
                    <CounsellorDashboard />
                  </ProtectedRoute>
                }
              />

              {/* 404 Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
