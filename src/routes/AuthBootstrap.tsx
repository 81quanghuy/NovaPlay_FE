import { useEffect, useRef, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { refreshTokenStorage } from '@/store/refreshTokenStorage';
import { authService } from '@/features/auth/services/authService';
import { postWithoutAuth } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { AuthResponse, UserResponse } from '@/lib/api/types';
import { Logo } from '@/components/ui';
import { FLAGS } from '@/config';


interface Props {
  children: ReactNode;
}

const DEV_AUTH_USER: UserResponse = {
  id: 'dev-admin-id',
  username: 'admin',
  email: 'admin@novaplay.local',
  isActive: true,
  isEmailVerified: true,
  lastLoginAt: new Date().toISOString(),
  roles: [
    { roleName: 'ADMIN', description: 'Administrator (dev bypass)' },
    { roleName: 'USER', description: 'Standard user (dev bypass)' },
  ],
};

const FAKE_AUTH_RESPONSE: AuthResponse = {
  access_token: 'dev-bypass-access-token',
  refresh_token: 'dev-bypass-refresh-token',
  token_type: 'Bearer',
  expires_in: 60 * 60 * 24,
  user_profile: DEV_AUTH_USER,
};

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

    if (FLAGS.AUTH_BYPASS) {
      console.warn('[NovaPlay] AUTH BYPASS đang bật. Chỉ dùng cho môi trường phát triển local.');
      setAuth(FAKE_AUTH_RESPONSE);
      setUser(DEV_AUTH_USER);
      return;
    }

    const refreshToken = refreshTokenStorage.get();
    if (!refreshToken) {
      setStatus('unauthenticated');
      return;
    }

    setStatus('loading');
    (async () => {
      try {
        const res = await postWithoutAuth<AuthResponse>(ENDPOINTS.auth.refresh, {
          refresh_token: refreshToken,
        });
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
          <p className="text-sm text-fg-2">Đang khởi động...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {FLAGS.AUTH_BYPASS && (
        <div className="fixed inset-x-0 top-0 z-50 bg-danger px-4 py-2 text-center text-sm font-semibold text-white shadow-lg">
          AUTH BYPASS đang bật - chỉ dùng cho phát triển local.
        </div>
      )}
      {children}
    </>
  );
}
