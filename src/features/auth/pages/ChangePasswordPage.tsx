import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema, type ChangePasswordFormValues } from '../schemas';
import { useChangePassword } from '../hooks/useChangePassword';
import { PasswordInput } from '../components/PasswordInput';
import { Button } from '../components/Button';
import { Alert } from '../components/Alert';
import { PATHS } from '@/routes/paths';


export function ChangePasswordPage() {
  const navigate = useNavigate();
  const { submit, isLoading, error, success } = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmNewPassword: '' },
  });

  useEffect(() => {
    if (success) reset();
  }, [success, reset]);

  return (
    <div className="min-h-screen bg-bg text-fg-1">
      <main className="max-w-container mx-auto px-6 py-12 flex justify-center">
        <div className="w-full max-w-[480px] bg-surface border border-border rounded-xl shadow-lg p-8">
          <h3 className="font-display font-bold text-2xl text-fg mb-1.5">Đổi Mật Khẩu</h3>
          <p className="text-fg-2 text-sm mb-6">
            Sử dụng mật khẩu mạnh để bảo vệ tài khoản của bạn.
          </p>

          <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4" noValidate>
            {error && <Alert tone="danger">{error}</Alert>}
            {success && <Alert tone="success">Đổi mật khẩu thành công.</Alert>}

            <PasswordInput
              label="Mật khẩu hiện tại"
              autoComplete="current-password"
              error={errors.currentPassword?.message}
              {...register('currentPassword')}
            />

            <PasswordInput
              label="Mật khẩu mới"
              autoComplete="new-password"
              showHintRules
              error={errors.newPassword?.message}
              {...register('newPassword')}
            />

            <PasswordInput
              label="Nhập lại mật khẩu mới"
              autoComplete="new-password"
              error={errors.confirmNewPassword?.message}
              {...register('confirmNewPassword')}
            />

            <div className="flex gap-3 mt-2">
              <Button type="submit" loading={isLoading} fullWidth>
                Lưu Thay Đổi
              </Button>
              <Button type="button" variant="secondary" onClick={() => navigate(PATHS.HOME)}>

                Hủy
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
