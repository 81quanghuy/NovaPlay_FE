import { useEffect, useRef, type ReactNode } from 'react';
import { useAuthStore } from '@/store/authStore';
import { refreshTokenStorage } from '@/store/refreshTokenStorage';
import { authService } from '@/features/auth/services/authService';
import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { AuthResponse } from '@/lib/api/types';
import { Logo } from '@/features/auth/components/Logo';
import { Loader2 } from 'lucide-react';

interface Props {
  children: ReactNode;
}

export function AuthBootstrap({ children }: Props) {
  const status = useAuthStore((s) => s.status);
  const setStatus = useAuthStore((s) => s.setStatus);
  const setAuth = useAuthStore((s) => s.setAuth);
  const setUser = useAuthStore((s) => s.setUser);
  const reset = useAuthStore((s) => s.reset);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const refreshToken = refreshTokenStorage.get();
    if (!refreshToken) {
      setStatus('unauthenticated');
      return;
    }

    setStatus('loading');
    (async () => {
      try {
        const res = await apiClient.post<AuthResponse>(
          ENDPOINTS.auth.refresh,
          { refresh_token: refreshToken },
          { _skipAuth: true } as Parameters<typeof apiClient.post>[2],
        );
        setAuth(res.data);
        const me = await authService.me();
        setUser(me);
      } catch {
        reset();
      }
    })();
  }, [reset, setAuth, setStatus, setUser]);

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="min-h-screen bg-bg grid place-items-center">
        <div className="flex flex-col items-center gap-4">
          <Logo size="lg" />
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <p className="text-sm text-fg-2">Đang khởi động...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
