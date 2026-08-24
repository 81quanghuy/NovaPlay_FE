import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuthStore } from '@/store/authStore';
import { refreshTokenStorage } from '@/store/refreshTokenStorage';
import { PATHS } from '@/routes/paths';

export function useLogout() {
  const [isLoading, setIsLoading] = useState(false);
  const reset = useAuthStore((s) => s.reset);
  const navigate = useNavigate();

  async function logout() {
    setIsLoading(true);
    const refreshToken = refreshTokenStorage.get();
    try {
      if (refreshToken) {
        await authService.logout(refreshToken).catch(() => undefined);
      }
    } finally {
      reset();
      setIsLoading(false);
      navigate(PATHS.LOGIN, { replace: true });
    }
  }

  return { logout, isLoading };
}
