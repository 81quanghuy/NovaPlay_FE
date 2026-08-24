import { useState } from 'react';
import { authService } from '../services/authService';
import { extractErrorMessage } from '@/lib/api/client';
import type { ChangePasswordRequest } from '@/lib/api/types';

export function useChangePassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function submit(values: ChangePasswordRequest) {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await authService.changePassword(values);
      setSuccess(true);
    } catch (err) {
      setError(extractErrorMessage(err, 'Đổi mật khẩu thất bại'));
    } finally {
      setIsLoading(false);
    }
  }

  return { submit, isLoading, error, success, reset: () => setSuccess(false) };
}
