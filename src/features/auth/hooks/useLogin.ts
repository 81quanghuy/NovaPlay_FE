import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuthStore } from '@/store/authStore';
import { extractErrorMessage } from '@/lib/api/client';
import type { LoginRequest } from '@/lib/api/types';

interface LocationState {
  from?: { pathname: string };
}

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();
  const location = useLocation();

  async function submit(values: LoginRequest) {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.login(values);
      setAuth(res);
      const from = (location.state as LocationState | null)?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err) {
      setError(extractErrorMessage(err, 'Đăng nhập thất bại'));
    } finally {
      setIsLoading(false);
    }
  }

  return { submit, isLoading, error };
}
