import { useEffect, useRef, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { refreshTokenStorage } from '@/store/refreshTokenStorage';
import { authService } from '@/features/auth/services/authService';
import { postWithoutAuth } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { AuthResponse, UserResponse } from '@/lib/api/types';
import { Logo } from '@/features/auth/components/Logo';

interface Props {
  children: ReactNode;
}

const DEV_BYPASS_AUTH = true;

const FAKE_ADMIN_USER: UserResponse = {
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
  user_profile: FAKE_ADMIN_USER,
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

    if (DEV_BYPASS_AUTH) {
      setAuth(FAKE_AUTH_RESPONSE);
      setUser(FAKE_ADMIN_USER);
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

  return <>{children}</>;
}
