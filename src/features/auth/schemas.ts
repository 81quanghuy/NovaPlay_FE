import { z } from 'zod';
import { REGEX, VALIDATION } from '@/config';

const strongPassword = z
  .string()
  .min(VALIDATION.PASSWORD_MIN_LENGTH, `Mật khẩu tối thiểu ${VALIDATION.PASSWORD_MIN_LENGTH} ký tự`)
  .regex(REGEX.PASSWORD_UPPERCASE, 'Cần ít nhất 1 chữ in hoa')
  .regex(REGEX.PASSWORD_LOWERCASE, 'Cần ít nhất 1 chữ thường')
  .regex(REGEX.PASSWORD_NUMBER, 'Cần ít nhất 1 chữ số')
  .regex(REGEX.PASSWORD_SPECIAL, 'Cần ít nhất 1 ký tự đặc biệt');

export const loginSchema = z.object({
  emailOrUsername: z.string().trim().min(VALIDATION.USERNAME_MIN_LENGTH, `Tối thiểu ${VALIDATION.USERNAME_MIN_LENGTH} ký tự`),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
  rememberMe: z.boolean().optional(),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(VALIDATION.USERNAME_MIN_LENGTH, `Tên đăng nhập tối thiểu ${VALIDATION.USERNAME_MIN_LENGTH} ký tự`)
      .max(VALIDATION.USERNAME_MAX_LENGTH, `Tối đa ${VALIDATION.USERNAME_MAX_LENGTH} ký tự`)
      .regex(REGEX.USERNAME, 'Chỉ chứa chữ, số và . _ -'),
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
  otp: z
    .string()
    .length(VALIDATION.OTP_LENGTH, `Mã gồm ${VALIDATION.OTP_LENGTH} chữ số`)
    .regex(REGEX.NUMERIC, `Mã gồm ${VALIDATION.OTP_LENGTH} chữ số`),
});
export type OtpFormValues = z.infer<typeof otpSchema>;

export const emailSchema = z.object({
  email: z.string().trim().email('Email không hợp lệ'),
});
export type EmailFormValues = z.infer<typeof emailSchema>;

export const resetPasswordSchema = z
  .object({
    email: z.string().trim().email('Email không hợp lệ'),
    otp: z
      .string()
      .length(VALIDATION.OTP_LENGTH, `Mã gồm ${VALIDATION.OTP_LENGTH} chữ số`)
      .regex(REGEX.NUMERIC, `Mã gồm ${VALIDATION.OTP_LENGTH} chữ số`),
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
