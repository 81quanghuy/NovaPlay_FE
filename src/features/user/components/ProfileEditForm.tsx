import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, Mail, Phone, Save, User, ShieldCheck, AtSign } from 'lucide-react';
import { Alert, Button, FormField } from '@/components/ui';
import { userService } from '../services/userService';
import { useAuthStore } from '@/store/authStore';
import type { UserProfileDTO } from '../types';

export const profileUpdateSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Họ và tên phải có tối thiểu 2 ký tự')
    .max(50, 'Họ và tên tối đa 50 ký tự'),
  phoneNumber: z
    .string()
    .trim()
    .regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Số điện thoại không hợp lệ (VD: 0987654321)')
    .optional()
    .or(z.literal('')),
  bio: z.string().max(500, 'Tiểu sử tối đa 500 ký tự').optional(),
});

export type ProfileUpdateFormValues = z.infer<typeof profileUpdateSchema>;

interface ProfileEditFormProps {
  profile: UserProfileDTO;
  onProfileUpdated: (updated: UserProfileDTO) => void;
}

export function ProfileEditForm({ profile, onProfileUpdated }: ProfileEditFormProps) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileUpdateFormValues>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      fullName: profile.fullName || '',
      phoneNumber: profile.phoneNumber || '',
      bio: profile.bio || '',
    },
  });

  const bioValue = watch('bio') || '';

  // Reset form default values when profile prop changes
  useEffect(() => {
    reset({
      fullName: profile.fullName || '',
      phoneNumber: profile.phoneNumber || '',
      bio: profile.bio || '',
    });
  }, [profile, reset]);

  const onSubmit = async (values: ProfileUpdateFormValues) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const updatedProfile = await userService.updateProfile({
        fullName: values.fullName.trim(),
        phoneNumber: values.phoneNumber ? values.phoneNumber.trim() : '',
        bio: values.bio ? values.bio.trim() : '',
      });

      // Synchronize with auth store
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        useAuthStore.getState().setUser({
          ...currentUser,
          username: updatedProfile.username,
        });
      }

      onProfileUpdated(updatedProfile);
      setSuccessMessage('Hồ sơ của bạn đã được cập nhật thành công!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể cập nhật hồ sơ, vui lòng thử lại.';
      setErrorMessage(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Alert Notifications */}
      {successMessage && (
        <Alert tone="success" title="Thành công" className="animate-fade-in">
          {successMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert tone="danger" title="Lỗi" className="animate-fade-in">
          {errorMessage}
        </Alert>
      )}

      {/* Account Info (Read-only section) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-surface-3/50 border border-border/80 rounded-2xl p-4 sm:p-5">
        <div>
          <label className="block text-xs font-bold text-fg-3 uppercase tracking-wider mb-1">
            Email tài khoản
          </label>
          <div className="flex items-center gap-2.5 h-10 px-3.5 bg-surface-2 border border-border/60 rounded-xl text-fg-2 text-sm select-none">
            <Mail className="w-4 h-4 text-fg-3 flex-shrink-0" />
            <span className="truncate">{profile.email}</span>
            <ShieldCheck className="w-4 h-4 text-success ml-auto flex-shrink-0" title="Email đã xác thực" />
          </div>
          <p className="text-[11px] text-fg-3 mt-1">Email được cố định để bảo mật tài khoản</p>
        </div>

        <div>
          <label className="block text-xs font-bold text-fg-3 uppercase tracking-wider mb-1">
            Tên người dùng (Username)
          </label>
          <div className="flex items-center gap-2.5 h-10 px-3.5 bg-surface-2 border border-border/60 rounded-xl text-fg-2 text-sm select-none">
            <AtSign className="w-4 h-4 text-fg-3 flex-shrink-0" />
            <span className="truncate">{profile.username}</span>
          </div>
          <p className="text-[11px] text-fg-3 mt-1">Được cấp tự động và dùng cho định danh hệ thống</p>
        </div>
      </div>

      {/* Editable Fields */}
      <div className="space-y-4">
        {/* Full Name */}
        <FormField
          label="Họ và tên hiển thị"
          leftIcon={<User className="w-4 h-4" />}
          placeholder="Nhập họ và tên đầy đủ..."
          error={errors.fullName?.message}
          {...register('fullName')}
        />

        {/* Phone Number */}
        <FormField
          label="Số điện thoại liên hệ"
          leftIcon={<Phone className="w-4 h-4" />}
          placeholder="VD: 0987654321"
          hint="Dùng để nhận thông báo khẩn cấp hoặc hỗ trợ kỹ thuật"
          error={errors.phoneNumber?.message}
          {...register('phoneNumber')}
        />

        {/* Biography */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="bio-input" className="text-sm font-semibold text-fg-1">
              Giới thiệu bản thân / Tiểu sử
            </label>
            <span className="text-xs text-fg-3 font-mono">
              {bioValue.length}/500 ký tự
            </span>
          </div>
          <textarea
            id="bio-input"
            rows={4}
            placeholder="Chia sẻ sở thích xem phim, đạo diễn hoặc thể loại yêu thích của bạn..."
            aria-invalid={!!errors.bio}
            className={`w-full bg-surface-2 border rounded-xl px-4 py-3 text-sm text-fg placeholder:text-fg-3 outline-none transition-colors duration-fast resize-y min-h-[96px] ${
              errors.bio
                ? 'border-danger focus:border-danger focus:ring-2 focus:ring-danger/30'
                : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/30'
            }`}
            {...register('bio')}
          />
          {errors.bio ? (
            <p className="text-xs text-danger mt-1.5 font-medium">{errors.bio.message}</p>
          ) : (
            <p className="text-xs text-fg-3 mt-1.5">
              Tiểu sử sẽ được hiển thị công khai trên phần bình luận và đánh giá phim.
            </p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={isSubmitting}
          disabled={isSubmitting || !isDirty}
          leftIcon={<Save className="w-4 h-4" />}
          className="min-w-[160px]"
        >
          {isSubmitting ? 'Đang lưu...' : 'Lưu Thay Đổi'}
        </Button>
      </div>
    </form>
  );
}
