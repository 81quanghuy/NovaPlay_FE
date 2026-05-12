import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, User } from 'lucide-react';
import { registerSchema, type RegisterFormValues } from '../schemas';
import { useRegister } from '../hooks/useRegister';
import { AuthLayout } from '../components/AuthLayout';
import { FormField } from '../components/FormField';
import { PasswordInput } from '../components/PasswordInput';
import { Button } from '../components/Button';
import { Alert } from '../components/Alert';

export function RegisterPage() {
  const { submit, isLoading, error } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: '', email: '', password: '', confirmPassword: '', accept: false as never },
  });

  return (
    <AuthLayout
      title="Tạo Tài Khoản"
      subtitle="Bắt đầu hành trình điện ảnh của bạn"
      footer={
        <>
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-primary-hover hover:text-primary font-semibold">
            Đăng nhập
          </Link>
        </>
      }
    >
      <form
        onSubmit={handleSubmit((v) =>
          submit({
            username: v.username,
            email: v.email,
            password: v.password,
            locale: 'vi',
          }),
        )}
        className="flex flex-col gap-4"
        noValidate
      >
        {error && <Alert tone="danger">{error}</Alert>}

        <FormField
          label="Tên đăng nhập"
          placeholder="nova_fan"
          autoComplete="username"
          leftIcon={<User className="w-4 h-4" />}
          error={errors.username?.message}
          {...register('username')}
        />

        <FormField
          label="Email"
          type="email"
          placeholder="ban@novaplay.vn"
          autoComplete="email"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <PasswordInput
          label="Mật khẩu"
          placeholder="Mật khẩu mạnh"
          autoComplete="new-password"
          showHintRules
          error={errors.password?.message}
          {...register('password')}
        />

        <PasswordInput
          label="Nhập lại mật khẩu"
          placeholder="Nhập lại mật khẩu"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <label className="flex items-start gap-2.5 cursor-pointer text-sm text-fg-2 mt-1">
          <input
            type="checkbox"
            className="w-4 h-4 mt-0.5 rounded-xs bg-surface-2 border border-border accent-primary cursor-pointer flex-shrink-0"
            {...register('accept')}
          />
          <span>
            Tôi đồng ý với{' '}
            <a href="#" className="text-primary-hover hover:text-primary font-semibold">
              Điều khoản dịch vụ
            </a>{' '}
            và{' '}
            <a href="#" className="text-primary-hover hover:text-primary font-semibold">
              Chính sách bảo mật
            </a>
          </span>
        </label>
        {errors.accept && (
          <p className="text-xs text-danger -mt-2 font-medium">{errors.accept.message}</p>
        )}

        <Button type="submit" loading={isLoading} fullWidth size="md" className="mt-2">
          Đăng Ký
        </Button>
      </form>
    </AuthLayout>
  );
}
