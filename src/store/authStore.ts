import { create } from 'zustand';
import type { AuthResponse, RoleName, UserResponse } from '@/lib/api/types';
import { refreshTokenStorage } from './refreshTokenStorage';

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

interface AuthState {
  accessToken: string | null;
  user: UserResponse | null;
  status: AuthStatus;
  setStatus: (s: AuthStatus) => void;
  setAuth: (res: AuthResponse) => void;
  setAccessToken: (token: string | null) => void;
  setUser: (user: UserResponse | null) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  status: 'idle',
  setStatus: (status) => set({ status }),
  setAuth: (res) => {
    refreshTokenStorage.set(res.refresh_token);
    set({
      accessToken: res.access_token,
      user: res.user_profile,
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
  if (!user) return false;
  return user.roles.some((r) => r.roleName === role);
}

export function hasAnyRole(user: UserResponse | null, roles: RoleName[]): boolean {
  if (!user || roles.length === 0) return !!user;
  return roles.some((r) => hasRole(user, r));
}

export function getAccessToken(): string | null {
  return useAuthStore.getState().accessToken;
}
