/**
 * =====================================================================================
 * SECURITY AUDIT & PRODUCTION DEPLOYMENT NOTE:
 * -------------------------------------------------------------------------------------
 * In a production environment, jurisdiction filtering MUST take place on the backend
 * API server (e.g. database-level row filtering based on verified JWT role claims).
 * Never rely on client-side filtering alone for sensitive mental health victim data.
 * This frontend mock implementation is strictly for demonstration and hackathon UI/UX
 * validation (Smart India Hackathon 2026 - SAHAY Portal).
 * Session tokens are preserved strictly in memory (React State) to prevent token exposure.
 * =====================================================================================
 */

import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { CounsellorSession, AuthorisedCounsellor, AuditLogEntry } from '../types';
import { AUTHORISED_COUNSELLORS } from '../data/counsellors';

interface AuthContextType {
  session: CounsellorSession | null;
  pendingCounsellor: AuthorisedCounsellor | null;
  auditLogs: AuditLogEntry[];
  loginStep: 'CREDENTIALS' | 'ONBOARDING' | 'AUTHENTICATED';
  login: (email: string, pass: string, counsellorId: string) => { success: boolean; error?: string };
  completeOnboarding: (state: string, district: string) => void;
  logout: () => void;
  logAuditAction: (action: string, details: string, caseId?: string, status?: 'SUCCESS' | 'DENIED' | 'FLAGGED') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<CounsellorSession | null>(null);
  const [pendingCounsellor, setPendingCounsellor] = useState<AuthorisedCounsellor | null>(null);
  const [loginStep, setLoginStep] = useState<'CREDENTIALS' | 'ONBOARDING' | 'AUTHENTICATED'>('CREDENTIALS');
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

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

    // Audit log simulated console output for accountability compliance
    console.warn(`[SECURITY AUDIT LOG] [${newEntry.status}] ${newEntry.timestamp} | Counsellor: ${newEntry.counsellorId} | Action: ${action} | Details: ${details}`);
  };

  const login = (email: string, pass: string, counsellorId: string) => {
    // BACKEND INTEGRATION POINT: POST /api/auth/counsellor-login (real credential + ID verification)
    const match = AUTHORISED_COUNSELLORS.find(
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

    // Move to onboarding step (Jurisdiction selection)
    setPendingCounsellor(match);
    setLoginStep('ONBOARDING');
    logAuditAction('CREDENTIAL_VERIFIED', `Credentials verified for ${match.name} (${match.counsellorId}). Pending state/district selection.`);
    return { success: true };
  };

  const completeOnboarding = (assignedState: string, assignedDistrict: string) => {
    if (!pendingCounsellor) return;

    // Simulate in-memory JWT bearer token with state and district claim payloads
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
      loginTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      verificationStatus: 'VERIFIED',
      languages: pendingCounsellor.languages || ['English', 'Hindi'],
      specialization: pendingCounsellor.specialization || pendingCounsellor.designation,
      availability: pendingCounsellor.availability || 'Assigned availability'
    };

    setSession(newSession);
    setLoginStep('AUTHENTICATED');

    logAuditAction(
      'SESSION_ESTABLISHED',
      `Authorized session granted under jurisdiction: ${assignedDistrict}, ${assignedState}`,
      undefined,
      'SUCCESS'
    );
  };

  const logout = () => {
    if (session) {
      logAuditAction('LOGOUT', `Counsellor ${session.name} logged out securely.`);
    }
    setSession(null);
    setPendingCounsellor(null);
    setLoginStep('CREDENTIALS');
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        pendingCounsellor,
        auditLogs,
        loginStep,
        login,
        completeOnboarding,
        logout,
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
