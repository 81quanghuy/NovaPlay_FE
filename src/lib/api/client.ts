import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import { useAuthStore } from '@/store/authStore';
import { refreshTokenStorage } from '@/store/refreshTokenStorage';
import type { AuthResponse } from './types';
import { ENDPOINTS } from './endpoints';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
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

async function performRefresh(): Promise<string | null> {
  const refreshToken = refreshTokenStorage.get();
  if (!refreshToken) return null;
  try {
    const res = await axios.post<AuthResponse>(
      `${BASE_URL}${ENDPOINTS.auth.refresh}`,
      { refresh_token: refreshToken },
      { headers: { 'Content-Type': 'application/json' } },
    );
    useAuthStore.getState().setAuth(res.data);
    return res.data.access_token;
  } catch {
    useAuthStore.getState().reset();
    return null;
  }
}

apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as RetryConfig | undefined;
    const status = error.response?.status;
    const url = original?.url ?? '';

    const isAuthEndpoint =
      url.includes(ENDPOINTS.auth.login) ||
      url.includes(ENDPOINTS.auth.refresh) ||
      url.includes(ENDPOINTS.auth.register);

    if (status === 401 && original && !original._retry && !isAuthEndpoint) {
      original._retry = true;
      refreshing = refreshing ?? performRefresh();
      const newToken = await refreshing;
      refreshing = null;
      if (newToken) {
        original.headers.set('Authorization', `Bearer ${newToken}`);
        return apiClient.request(original);
      }
    }

    return Promise.reject(error);
  },
);

export function extractErrorMessage(err: unknown, fallback = 'Có lỗi xảy ra, vui lòng thử lại'): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string; error?: string } | undefined;
    return data?.message || data?.error || err.message || fallback;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}

export function postWithoutAuth<T>(url: string, body: unknown, config: AxiosRequestConfig = {}) {
  return apiClient.post<T>(url, body, { ...config, _skipAuth: true } as AxiosRequestConfig);
}
