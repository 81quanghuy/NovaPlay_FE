import axios, {
  isAxiosError,
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import { useAuthStore } from '@/store/authStore';
import { refreshTokenStorage } from '@/store/refreshTokenStorage';
import { APP_EVENTS, ENV } from '@/config';
import type { AuthResponse } from './types';
import { ENDPOINTS } from './endpoints';

export const apiClient: AxiosInstance = axios.create({
  baseURL: ENV.API_URL,
  headers: { 'Content-Type': 'application/json' },
});

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean; _skipAuth?: boolean };

apiClient.interceptors.request.use((config) => {
  const cfg = config as RetryConfig;
  if (cfg._skipAuth) return cfg;
  const token = useAuthStore.getState().accessToken;
  if (token) {
    cfg.headers.set('Authorization', `Bearer ${token}`);
  }
  return cfg;
});

let refreshing: Promise<string | null> | null = null;

function notifyAuthExpired() {
  window.dispatchEvent(new CustomEvent(APP_EVENTS.AUTH_EXPIRED));
}

function getEndpointPath(url: string): string {
  try {
    return new URL(url, ENV.API_URL).pathname;
  } catch {
    return url;
  }
}

function isSameEndpoint(url: string, endpoint: string): boolean {
  const path = getEndpointPath(url);
  const basePath = getEndpointPath(ENV.API_URL).replace(/\/$/, '');
  return path === endpoint || path === `${basePath}${endpoint}`;
}

function isAuthEndpoint(url: string): boolean {
  return [ENDPOINTS.auth.login, ENDPOINTS.auth.refresh, ENDPOINTS.auth.register].some((endpoint) =>
    isSameEndpoint(url, endpoint),
  );
}

function getRefreshPromise(): Promise<string | null> {
  if (!refreshing) {
    refreshing = performRefresh().finally(() => {
      refreshing = null;
    });
  }
  return refreshing;
}

async function performRefresh(): Promise<string | null> {
  const refreshToken = refreshTokenStorage.get();
  if (!refreshToken) {
    useAuthStore.getState().reset();
    notifyAuthExpired();
    return null;
  }
  try {
    const res = await axios.post<AuthResponse>(
      `${ENV.API_URL}${ENDPOINTS.auth.refresh}`,
      { refresh_token: refreshToken },
      { headers: { 'Content-Type': 'application/json' } },
    );
    useAuthStore.getState().setAuth(res.data);
    return res.data.access_token;
  } catch {
    useAuthStore.getState().reset();
    notifyAuthExpired();
    return null;
  }
}

apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as RetryConfig | undefined;
    const status = error.response?.status;
    const url = original?.url ?? '';

    if (status === 401 && original && !original._retry && !isAuthEndpoint(url)) {
      original._retry = true;
      const newToken = await getRefreshPromise();
      if (newToken) {
        original.headers.set('Authorization', `Bearer ${newToken}`);
        return apiClient.request(original);
      }
    }

    return Promise.reject(error);
  },
);

export function extractErrorMessage(err: unknown, fallback = 'Có lỗi xảy ra, vui lòng thử lại'): string {
  if (isAxiosError(err)) {
    const data = err.response?.data as { message?: string; error?: string } | undefined;
    return data?.message || data?.error || err.message || fallback;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}

export function postWithoutAuth<T>(url: string, body: unknown, config: AxiosRequestConfig = {}) {
  return apiClient.post<T>(url, body, { ...config, _skipAuth: true } as AxiosRequestConfig);
}
