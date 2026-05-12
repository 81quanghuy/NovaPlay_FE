import { useEffect, useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { MailCheck } from 'lucide-react';
import { useOtpVerify } from '../hooks/useOtpVerify';
import { AuthLayout } from '../components/AuthLayout';
import { OtpInput } from '../components/OtpInput';
import { Button } from '../components/Button';
import { Alert } from '../components/Alert';

const RESEND_COOLDOWN = 60;

export function VerifyOtpPage() {
  const [params] = useSearchParams();
  const email = params.get('email') || '';
  const [otp, setOtp] = useState('');
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const { submit, resend, isLoading, isResending, error, info } = useOtpVerify(email);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  if (!email) return <Navigate to="/register" replace />;

  const onResend = async () => {
    await resend();
    setCooldown(RESEND_COOLDOWN);
  };

  const otpInvalid = otp.length > 0 && otp.length < 6;

  return (
    <AuthLayout
      variant="center"
      icon={
        <span className="w-16 h-16 rounded-pill bg-primary-soft border border-primary/40 grid place-items-center shadow-glow">
          <MailCheck className="w-8 h-8 text-primary-hover" />
        </span>
      }
      title="Xác Thực Email"
      subtitle={
        <>
          Nhập mã 6 số đã gửi tới{' '}
          <span className="text-fg-1 font-semibold">{email}</span>
        </>
      }
      footer={
        <Link to="/register" className="text-fg-2 hover:text-fg">
          Quay lại đăng ký
        </Link>
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (otp.length === 6) submit(otp);
        }}
        className="flex flex-col gap-5"
        noValidate
      >
        {error && <Alert tone="danger">{error}</Alert>}
        {info && <Alert tone="success">{info}</Alert>}

        <OtpInput
          value={otp}
          onChange={setOtp}
          autoFocus
          error={otpInvalid ? 'Mã gồm đủ 6 chữ số' : undefined}
        />

        <Button type="submit" loading={isLoading} disabled={otp.length !== 6} fullWidth>
          Xác Nhận
        </Button>

        <div className="text-center text-sm text-fg-2">
          {cooldown > 0 ? (
            <>Gửi lại mã trong <span className="font-mono text-fg-1">{cooldown}s</span></>
          ) : (
            <button
              type="button"
              onClick={onResend}
              disabled={isResending}
              className="text-primary-hover hover:text-primary font-semibold disabled:opacity-60"
            >
              {isResending ? 'Đang gửi lại...' : 'Gửi lại mã'}
            </button>
          )}
        </div>
      </form>
    </AuthLayout>
  );
}
