import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import { loginSchema, type LoginFormValues } from '../schemas';
import { useLogin } from '../hooks/useLogin';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { FormField } from '@/components/ui/FormField';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { PATHS } from '@/routes/paths';

interface FlashState {
  flash?: string;
}

export function LoginPage() {
  const { submit, isLoading, error } = useLogin();
  const location = useLocation();
  const flash = (location.state as FlashState | null)?.flash;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { emailOrUsername: '', password: '', rememberMe: true },
  });

  useEffect(() => {
    if (flash) window.history.replaceState({}, '');
  }, [flash]);

  return (
    <AuthLayout
      title="Chào Mừng Trở Lại"
      subtitle="Đăng nhập để tiếp tục xem phim"
      footer={
        <>
          Chưa có tài khoản?{' '}
          <Link to={PATHS.REGISTER} className="text-primary-hover hover:text-primary font-semibold">
            Đăng ký ngay
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4" noValidate>
        {flash && <Alert tone="success">{flash}</Alert>}
        {error && <Alert tone="danger">{error}</Alert>}

        <FormField
          label="Email hoặc tên đăng nhập"
          placeholder="ban@novaplay.vn"
          autoComplete="username"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.emailOrUsername?.message}
          {...register('emailOrUsername')}
        />

        <PasswordInput
          label="Mật khẩu"
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="flex items-center justify-between text-sm">
          <label className="inline-flex items-center gap-2 cursor-pointer text-fg-2">
            <input
              type="checkbox"
              className="w-4 h-4 rounded-xs bg-surface-2 border border-border accent-primary cursor-pointer"
              {...register('rememberMe')}
            />
            Ghi nhớ đăng nhập
          </label>
          <Link
            to={PATHS.FORGOT_PASSWORD}
            className="text-primary-hover hover:text-primary font-semibold"
          >
            Quên mật khẩu?
          </Link>
        </div>

        <Button type="submit" loading={isLoading} fullWidth size="md" className="mt-2">
          Đăng Nhập
        </Button>
      </form>
    </AuthLayout>
  );
}
