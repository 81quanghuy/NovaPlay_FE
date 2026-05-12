import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { extractErrorMessage } from '@/lib/api/client';
import type { ResetPasswordRequest } from '@/lib/api/types';

export function useResetPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function submit(values: ResetPasswordRequest) {
    setIsLoading(true);
    setError(null);
    try {
      await authService.resetPassword(values);
      navigate('/login', {
        replace: true,
        state: { flash: 'Mật khẩu đã được đặt lại. Vui lòng đăng nhập.' },
      });
    } catch (err) {
      setError(extractErrorMessage(err, 'Đặt lại mật khẩu thất bại'));
    } finally {
      setIsLoading(false);
    }
  }

  return { submit, isLoading, error };
}
