import { useCallback } from 'react';
import { AuthService } from '../services/auth.service';
import { useAuthStore } from '../store/authStore';
import { useLoading } from './useLoading';
import { useError } from './useError';
import { AuthCredentials } from '../types/auth';

export const useAuth = () => {
  const { setUser } = useAuthStore();
  const { isLoading, withLoading } = useLoading();
  const { error, handleError, clearError } = useError();

  const login = useCallback(async (credentials: AuthCredentials) => {
    clearError();
    try {
      const user = await withLoading(() => AuthService.login(credentials));
      setUser(user);
    } catch (err) {
      handleError(err);
      throw err;
    }
  }, [withLoading, handleError, clearError, setUser]);

  const logout = useCallback(async () => {
    clearError();
    try {
      await withLoading(() => AuthService.logout());
      setUser(null);
    } catch (err) {
      handleError(err);
      throw err;
    }
  }, [withLoading, handleError, clearError, setUser]);

  return {
    login,
    logout,
    isLoading,
    error,
  };
};