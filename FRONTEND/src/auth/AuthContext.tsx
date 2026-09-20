/**
 * =====================================================================================
 * SECURITY AUDIT & PRODUCTION DEPLOYMENT NOTE:
 * -------------------------------------------------------------------------------------
 * In a production environment, jurisdiction filtering MUST take place on the backend
 * API server (e.g. database-level row filtering based on verified JWT role claims).
 * Never rely on client-side filtering alone for sensitive mental health victim data.
 * Production auth should use secure httpOnly cookies; for demonstration and rememberMe,
 * localStorage is optionally populated when the user checks "Remember Me".
 * =====================================================================================
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { CounsellorSession, AuthorisedCounsellor, AuditLogEntry } from '../types';
import { AUTHORISED_COUNSELLORS } from '../data/counsellors';

interface AuthContextType {
  session: CounsellorSession | null;
  pendingCounsellor: AuthorisedCounsellor | null;
  counsellorsList: AuthorisedCounsellor[];
  auditLogs: AuditLogEntry[];
  loginStep: 'CREDENTIALS' | 'ONBOARDING' | 'AUTHENTICATED';
  rememberMe: boolean;
  setRememberMe: (val: boolean) => void;
  login: (email: string, pass: string, counsellorId: string, remember?: boolean) => { success: boolean; error?: string };
  completeOnboarding: (state: string, district: string) => void;
  logout: () => void;
  updateCounsellorProfile: (updated: Partial<AuthorisedCounsellor>) => void;
  logAuditAction: (action: string, details: string, caseId?: string, status?: 'SUCCESS' | 'DENIED' | 'FLAGGED') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [counsellorsList, setCounsellorsList] = useState<AuthorisedCounsellor[]>(() => {
    const saved = localStorage.getItem('sahay_counsellors');
    return saved ? JSON.parse(saved) : AUTHORISED_COUNSELLORS;
  });

  const [session, setSession] = useState<CounsellorSession | null>(() => {
    const saved = localStorage.getItem('sahay_counsellor_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [pendingCounsellor, setPendingCounsellor] = useState<AuthorisedCounsellor | null>(null);
  const [loginStep, setLoginStep] = useState<'CREDENTIALS' | 'ONBOARDING' | 'AUTHENTICATED'>(() => {
    const saved = localStorage.getItem('sahay_counsellor_session');
    return saved ? 'AUTHENTICATED' : 'CREDENTIALS';
  });

  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  useEffect(() => {
    localStorage.setItem('sahay_counsellors', JSON.stringify(counsellorsList));
  }, [counsellorsList]);

  const logAuditAction = (
    action: string,
    details: string,
    caseId?: string,
    status: 'SUCCESS' | 'DENIED' | 'FLAGGED' = 'SUCCESS'
  ) => {
    const newEntry: AuditLogEntry = {
      id: `AUD-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      counsellorId: session?.counsellorId || pendingCounsellor?.counsellorId || 'UNAUTH_ATTEMPT',
      action,
      details,
      caseId,
      status
    };

    setAuditLogs(prev => [newEntry, ...prev]);
    console.warn(`[SECURITY AUDIT LOG] [${newEntry.status}] ${newEntry.timestamp} | Counsellor: ${newEntry.counsellorId} | Action: ${action} | Details: ${details}`);
  };

  const login = (email: string, pass: string, counsellorId: string, remember: boolean = true) => {
    setRememberMe(remember);
    const match = counsellorsList.find(
      c => c.counsellorId.toUpperCase() === counsellorId.trim().toUpperCase() &&
           c.email.toLowerCase() === email.trim().toLowerCase() &&
           c.password === pass
    );

    if (!match) {
      logAuditAction(
        'LOGIN_FAILED',
        `Unauthorised counsellor login attempt with ID: "${counsellorId}" and email: "${email}"`,
        undefined,
        'DENIED'
      );
      return {
        success: false,
        error: "Access Denied — unauthorised login attempt has been logged. Verify your credentials or official Counsellor ID."
      };
    }

    setPendingCounsellor(match);
    setLoginStep('ONBOARDING');
    logAuditAction('CREDENTIAL_VERIFIED', `Credentials verified for ${match.name} (${match.counsellorId}). Pending state/district selection.`);
    return { success: true };
  };

  const completeOnboarding = (assignedState: string, assignedDistrict: string) => {
    if (!pendingCounsellor) return;

    const mockJwt = `header.${btoa(JSON.stringify({
      sub: pendingCounsellor.counsellorId,
      name: pendingCounsellor.name,
      email: pendingCounsellor.email,
      state: assignedState,
      district: assignedDistrict,
      iat: Date.now(),
      exp: Date.now() + 8 * 3600 * 1000
    }))}.signature_mock`;

    const newSession: CounsellorSession = {
      token: mockJwt,
      counsellorId: pendingCounsellor.counsellorId,
      name: pendingCounsellor.name,
      email: pendingCounsellor.email,
      designation: pendingCounsellor.designation,
      assignedState,
      assignedDistrict,
      loginTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setSession(newSession);
    setLoginStep('AUTHENTICATED');

    if (rememberMe) {
      // NOTE FOR PRODUCTION AUDIT:
      // Production apps must store JWTs in secure httpOnly, SameSite=Strict cookies rather than localStorage.
      localStorage.setItem('sahay_counsellor_session', JSON.stringify(newSession));
    } else {
      localStorage.removeItem('sahay_counsellor_session');
    }

    logAuditAction(
      'SESSION_ESTABLISHED',
      `Authorized session granted under jurisdiction: ${assignedDistrict}, ${assignedState} (RememberMe: ${rememberMe})`,
      undefined,
      'SUCCESS'
    );
  };

  const updateCounsellorProfile = (updated: Partial<AuthorisedCounsellor>) => {
    if (!session) return;
    setCounsellorsList(prev => prev.map(c => {
      if (c.counsellorId === session.counsellorId) {
        return { ...c, ...updated };
      }
      return c;
    }));

    if (updated.name || updated.designation) {
      setSession(prev => prev ? {
        ...prev,
        name: updated.name || prev.name,
        designation: updated.designation || prev.designation
      } : null);
    }

    logAuditAction('PROFILE_UPDATED', `Counsellor ${session.counsellorId} updated their clinical profile details.`);
  };

  const logout = () => {
    if (session) {
      logAuditAction('LOGOUT', `Counsellor ${session.name} logged out securely.`);
    }
    setSession(null);
    setPendingCounsellor(null);
    setLoginStep('CREDENTIALS');
    localStorage.removeItem('sahay_counsellor_session');
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        pendingCounsellor,
        counsellorsList,
        auditLogs,
        loginStep,
        rememberMe,
        setRememberMe,
        login,
        completeOnboarding,
        logout,
        updateCounsellorProfile,
        logAuditAction
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
