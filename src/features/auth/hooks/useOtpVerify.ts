import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { extractErrorMessage } from '@/lib/api/client';

export function useOtpVerify(email: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const navigate = useNavigate();

  async function submit(otp: string) {
    setIsLoading(true);
    setError(null);
    setInfo(null);
    try {
      await authService.verifyOtp({ email, otp });
      navigate('/login', {
        replace: true,
        state: { flash: 'Xác thực thành công. Vui lòng đăng nhập.' },
      });
    } catch (err) {
      setError(extractErrorMessage(err, 'Mã OTP không đúng hoặc đã hết hạn'));
    } finally {
      setIsLoading(false);
    }
  }

  async function resend() {
    setIsResending(true);
    setError(null);
    setInfo(null);
    try {
      await authService.resendOtp({ email });
      setInfo('Đã gửi lại mã. Vui lòng kiểm tra hộp thư.');
    } catch (err) {
      setError(extractErrorMessage(err, 'Không thể gửi lại mã lúc này'));
    } finally {
      setIsResending(false);
    }
  }

  return { submit, resend, isLoading, isResending, error, info };
}
