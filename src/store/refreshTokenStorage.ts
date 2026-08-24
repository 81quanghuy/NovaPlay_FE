import { STORAGE_KEYS } from '@/config';

export const refreshTokenStorage = {
  get(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    } catch {
      return null;
    }
  },
  set(token: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
    } catch {
      /* storage may be blocked; ignore */
    }
  },
  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    } catch {
      /* ignore */
    }
  },
};
