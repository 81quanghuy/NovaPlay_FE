import { z } from 'zod';

const strongPassword = z
  .string()
  .min(8, 'Mật khẩu tối thiểu 8 ký tự')
  .regex(/[A-Z]/, 'Cần ít nhất 1 chữ in hoa')
  .regex(/[a-z]/, 'Cần ít nhất 1 chữ thường')
  .regex(/[0-9]/, 'Cần ít nhất 1 chữ số')
  .regex(/[^A-Za-z0-9]/, 'Cần ít nhất 1 ký tự đặc biệt');

export const loginSchema = z.object({
  emailOrUsername: z.string().trim().min(3, 'Tối thiểu 3 ký tự'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
  rememberMe: z.boolean().optional(),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, 'Tên đăng nhập tối thiểu 3 ký tự')
      .max(30, 'Tối đa 30 ký tự')
      .regex(/^[A-Za-z0-9_.-]+$/, 'Chỉ chứa chữ, số và . _ -'),
    email: z.string().trim().email('Email không hợp lệ'),
    password: strongPassword,
    confirmPassword: z.string(),
    accept: z.boolean().refine((v) => v === true, {
      message: 'Bạn cần đồng ý điều khoản',
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Mật khẩu nhập lại không khớp',
  });
export type RegisterFormValues = z.infer<typeof registerSchema>;

export const otpSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, 'Mã gồm 6 chữ số'),
});
export type OtpFormValues = z.infer<typeof otpSchema>;

export const emailSchema = z.object({
  email: z.string().trim().email('Email không hợp lệ'),
});
export type EmailFormValues = z.infer<typeof emailSchema>;

export const resetPasswordSchema = z
  .object({
    email: z.string().trim().email('Email không hợp lệ'),
    otp: z.string().regex(/^\d{6}$/, 'Mã gồm 6 chữ số'),
    newPassword: strongPassword,
    confirmNewPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmNewPassword, {
    path: ['confirmNewPassword'],
    message: 'Mật khẩu nhập lại không khớp',
  });
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại'),
    newPassword: strongPassword,
    confirmNewPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmNewPassword, {
    path: ['confirmNewPassword'],
    message: 'Mật khẩu nhập lại không khớp',
  })
  .refine((d) => d.newPassword !== d.currentPassword, {
    path: ['newPassword'],
    message: 'Mật khẩu mới phải khác mật khẩu hiện tại',
  });
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
