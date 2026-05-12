import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyRound, Mail } from 'lucide-react';
import { emailSchema, type EmailFormValues } from '../schemas';
import { useForgotPassword } from '../hooks/useForgotPassword';
import { AuthLayout } from '../components/AuthLayout';
import { FormField } from '../components/FormField';
import { Button } from '../components/Button';
import { Alert } from '../components/Alert';

export function ForgotPasswordPage() {
  const { submit, isLoading, error } = useForgotPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  return (
    <AuthLayout
      variant="center"
      icon={
        <span className="w-16 h-16 rounded-pill bg-primary-soft border border-primary/40 grid place-items-center shadow-glow">
          <KeyRound className="w-8 h-8 text-primary-hover" />
        </span>
      }
      title="Quên Mật Khẩu"
      subtitle="Nhập email để nhận mã đặt lại mật khẩu"
      footer={
        <Link to="/login" className="text-fg-2 hover:text-fg">
          Quay lại đăng nhập
        </Link>
      }
    >
      <form onSubmit={handleSubmit((v) => submit(v.email))} className="flex flex-col gap-4" noValidate>
        {error && <Alert tone="danger">{error}</Alert>}

        <FormField
          label="Email"
          type="email"
          placeholder="ban@novaplay.vn"
          autoComplete="email"
          autoFocus
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Button type="submit" loading={isLoading} fullWidth className="mt-2">
          Gửi Mã
        </Button>
      </form>
    </AuthLayout>
  );
}
