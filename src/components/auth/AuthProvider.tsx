import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { LoadingScreen } from '../ui/LoadingScreen';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { isLoading } = useAuthStore();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};