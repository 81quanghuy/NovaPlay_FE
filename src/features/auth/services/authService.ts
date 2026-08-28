import { apiClient, postWithoutAuth } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type {
  AuthResponse,
  ChangePasswordRequest,
  EmailRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  UserResponse,
  VerifyOtpRequest,
} from '@/lib/api/types';

export const authService = {
  async login(payload: LoginRequest): Promise<AuthResponse> {
    const usernameOrEmail =
      payload.usernameOrEmail ||
      payload.emailOrUsername ||
      payload.email_or_username ||
      '';

    const res = await postWithoutAuth<AuthResponse>(ENDPOINTS.auth.login, {
      usernameOrEmail,
      email_or_username: usernameOrEmail,
      emailOrUsername: usernameOrEmail,
      password: payload.password,
    });
    return res.data;
  },

  async register(payload: RegisterRequest): Promise<UserResponse> {
    const res = await postWithoutAuth<UserResponse>(ENDPOINTS.auth.register, payload);
    return res.data;
  },

  async verifyOtp(payload: VerifyOtpRequest): Promise<void> {
    await postWithoutAuth<void>(ENDPOINTS.auth.verifyOtp, payload);
  },

  async resendOtp(payload: EmailRequest): Promise<void> {
    await postWithoutAuth<void>(ENDPOINTS.auth.resendOtp, payload);
  },

  async forgotPassword(payload: EmailRequest): Promise<void> {
    await postWithoutAuth<void>(ENDPOINTS.auth.forgotPassword, payload);
  },

  async resetPassword(payload: ResetPasswordRequest): Promise<void> {
    const newPassword = payload.newPassword || payload.new_password || '';
    await postWithoutAuth<void>(ENDPOINTS.auth.resetPassword, {
      email: payload.email,
      otp: payload.otp,
      newPassword,
      new_password: newPassword,
    });
  },

  async changePassword(payload: ChangePasswordRequest): Promise<void> {
    const currentPassword = payload.currentPassword || payload.current_password || '';
    const newPassword = payload.newPassword || payload.new_password || '';
    await apiClient.post(ENDPOINTS.auth.changePassword, {
      currentPassword,
      current_password: currentPassword,
      newPassword,
      new_password: newPassword,
    });
  },

  async logout(refreshToken: string): Promise<void> {
    await apiClient.post(ENDPOINTS.auth.logout, {
      refreshToken,
      refresh_token: refreshToken,
    });
  },

  async me(): Promise<UserResponse> {
    const res = await apiClient.get<any>(ENDPOINTS.auth.me);
    return res.data?.result || res.data;
  },

  async updateProfile(payload: { username?: string }): Promise<UserResponse> {
    const res = await apiClient.put<any>(ENDPOINTS.auth.me, payload);
    return res.data?.result || res.data;
  },
};
