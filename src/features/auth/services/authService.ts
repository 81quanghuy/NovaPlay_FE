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
    const res = await postWithoutAuth<AuthResponse>(ENDPOINTS.auth.login, payload);
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
    await postWithoutAuth<void>(ENDPOINTS.auth.resetPassword, payload);
  },

  async changePassword(payload: ChangePasswordRequest): Promise<void> {
    await apiClient.post(ENDPOINTS.auth.changePassword, payload);
  },

  async logout(refreshToken: string): Promise<void> {
    await apiClient.post(ENDPOINTS.auth.logout, { refresh_token: refreshToken });
  },

  async me(): Promise<UserResponse> {
    const res = await apiClient.get<UserResponse>(ENDPOINTS.auth.me);
    return res.data;
  },
};
