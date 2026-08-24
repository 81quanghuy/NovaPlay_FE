import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { extractErrorMessage } from '@/lib/api/client';
import type { RegisterRequest } from '@/lib/api/types';

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function submit(values: RegisterRequest) {
    setIsLoading(true);
    setError(null);
    try {
      await authService.register(values);
      navigate(`/verify-otp?email=${encodeURIComponent(values.email)}`, { replace: true });
    } catch (err) {
      setError(extractErrorMessage(err, 'Đăng ký thất bại'));
    } finally {
      setIsLoading(false);
    }
  }

  return { submit, isLoading, error };
}
