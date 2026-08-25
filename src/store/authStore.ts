import { create } from 'zustand';
import type { AuthResponse, RoleName, UserResponse } from '@/lib/api/types';
import { refreshTokenStorage } from './refreshTokenStorage';

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

interface AuthState {
  accessToken: string | null;
  user: UserResponse | null;
  status: AuthStatus;
  setStatus: (s: AuthStatus) => void;
  setAuth: (res: AuthResponse | Record<string, unknown>) => void;
  setAccessToken: (token: string | null) => void;
  setUser: (user: UserResponse | null) => void;
  reset: () => void;
}

export function normalizeAuthResponse(raw: unknown): {
  accessToken: string;
  refreshToken: string;
  user: UserResponse | null;
} {
  if (!raw || typeof raw !== 'object') {
    return { accessToken: '', refreshToken: '', user: null };
  }

  const rawObj = raw as Record<string, unknown>;
  const resultObj = (rawObj.result || rawObj.data || rawObj) as Record<string, unknown>;

  const accessToken = String(
    resultObj.accessToken ||
      resultObj.access_token ||
      rawObj.accessToken ||
      rawObj.access_token ||
      '',
  );

  const refreshToken = String(
    resultObj.refreshToken ||
      resultObj.refresh_token ||
      rawObj.refreshToken ||
      rawObj.refresh_token ||
      '',
  );

  const userRaw = (resultObj.user ||
    resultObj.user_profile ||
    rawObj.user ||
    rawObj.user_profile ||
    null) as UserResponse | null;

  return { accessToken, refreshToken, user: userRaw };
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  status: 'idle',
  setStatus: (status) => set({ status }),
  setAuth: (res) => {
    const { accessToken, refreshToken, user } = normalizeAuthResponse(res);
    if (refreshToken) {
      refreshTokenStorage.set(refreshToken);
    }
    set({
      accessToken: accessToken || null,
      user: user || null,
      status: 'authenticated',
    });
  },
  setAccessToken: (accessToken) => set({ accessToken }),
  setUser: (user) => set({ user }),
  reset: () => {
    refreshTokenStorage.clear();
    set({ accessToken: null, user: null, status: 'unauthenticated' });
  },
}));

export function hasRole(user: UserResponse | null, role: RoleName): boolean {
  if (!user || !user.roles) return false;
  return user.roles.some((r) => {
    if (typeof r === 'string') {
      return r === role || r === `ROLE_${role}`;
    }
    return r.roleName === role;
  });
}

export function hasAnyRole(user: UserResponse | null, roles: RoleName[]): boolean {
  if (!user || roles.length === 0) return !!user;
  return roles.some((r) => hasRole(user, r));
}

export function getAccessToken(): string | null {
  return useAuthStore.getState().accessToken;
}
