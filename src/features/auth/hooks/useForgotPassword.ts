import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { extractErrorMessage } from '@/lib/api/client';

export function useForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function submit(email: string) {
    setIsLoading(true);
    setError(null);
    try {
      await authService.forgotPassword({ email });
      navigate(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(extractErrorMessage(err, 'Không thể gửi yêu cầu lúc này'));
    } finally {
      setIsLoading(false);
    }
  }

  return { submit, isLoading, error };
}
