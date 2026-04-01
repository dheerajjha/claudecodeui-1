import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { IS_PLATFORM } from '../../../constants/config';
import { api } from '../../../utils/api';
import { AUTH_ERROR_MESSAGES, AUTH_TOKEN_STORAGE_KEY } from '../constants';
import type {
  AuthContextValue,
  AuthProviderProps,
  AuthSessionPayload,
  AuthStatusPayload,
  AuthUser,
  AuthUserPayload,
  OnboardingStatusPayload,
} from '../types';
import { parseJsonSafely, resolveApiErrorMessage } from '../utils';

const AuthContext = createContext<AuthContextValue | null>(null);

const readStoredToken = (): string | null => localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

const persistToken = (token: string) => {
  localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
};

const clearStoredToken = () => {
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
};

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Auth is disabled — always authenticated with a default user
  const noopAuth = useCallback(async () => ({ success: true as const }), []);
  const noop = useCallback(() => {}, []);
  const refreshOnboardingStatus = useCallback(async () => {}, []);

  const contextValue = useMemo<AuthContextValue>(
    () => ({
      user: { username: 'default' },
      token: 'disabled',
      isLoading: false,
      needsSetup: false,
      hasCompletedOnboarding: true,
      error: null,
      login: noopAuth,
      register: noopAuth,
      logout: noop,
      refreshOnboardingStatus,
    }),
    [noopAuth, noop, refreshOnboardingStatus],
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
