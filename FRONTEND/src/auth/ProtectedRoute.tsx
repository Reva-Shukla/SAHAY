import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session } = useAuth();

  if (!session) {
    return <Navigate to="/counsellor/login" replace />;
  }

  return <>{children}</>;
};
