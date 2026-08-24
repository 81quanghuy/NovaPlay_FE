import { useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, type ResetPasswordFormValues } from '../schemas';
import { useResetPassword } from '../hooks/useResetPassword';
import { AuthLayout } from '../components/AuthLayout';
import { OtpInput } from '../components/OtpInput';
import { PasswordInput } from '../components/PasswordInput';
import { Button } from '../components/Button';
import { Alert } from '../components/Alert';
import { PATHS } from '@/routes/paths';

export function ResetPasswordPage() {
  const [params] = useSearchParams();
  const email = params.get('email') || '';
  const [otp, setOtp] = useState('');
  const { submit, isLoading, error } = useResetPassword();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email, otp: '', newPassword: '', confirmNewPassword: '' },
  });

  if (!email) return <Navigate to={PATHS.FORGOT_PASSWORD} replace />;

  return (
    <AuthLayout
      variant="center"
      title="Đặt Lại Mật Khẩu"
      subtitle={
        <>
          Email: <span className="text-fg-1 font-semibold">{email}</span> · Kiểm tra hộp thư để
          lấy mã
        </>
      }
      footer={
        <Link to={PATHS.LOGIN} className="text-fg-2 hover:text-fg">
          Quay lại đăng nhập
        </Link>
      }
    >
      <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4" noValidate>
        {error && <Alert tone="danger">{error}</Alert>}

        <div>
          <span className="block mb-2 text-sm font-semibold text-fg-1">Mã OTP</span>
          <OtpInput
            value={otp}
            onChange={(v) => {
              setOtp(v);
              setValue('otp', v, { shouldValidate: v.length === 6 });
            }}
            error={errors.otp?.message}
          />
        </div>

        <PasswordInput
          label="Mật khẩu mới"
          placeholder="Mật khẩu mạnh"
          autoComplete="new-password"
          showHintRules
          error={errors.newPassword?.message}
          {...register('newPassword')}
        />

        <PasswordInput
          label="Nhập lại mật khẩu"
          placeholder="Nhập lại mật khẩu"
          autoComplete="new-password"
          error={errors.confirmNewPassword?.message}
          {...register('confirmNewPassword')}
        />

        <Button type="submit" loading={isLoading} fullWidth className="mt-2">
          Cập Nhật Mật Khẩu
        </Button>
      </form>
    </AuthLayout>
  );
}
