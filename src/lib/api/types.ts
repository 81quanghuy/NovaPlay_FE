export type RoleName = 'ADMIN' | 'USER' | 'MODERATOR' | string;

export interface RoleResponse {
  id?: string;
  roleName: RoleName;
  description?: string;
  permissions?: { id?: string; name: string }[];
}

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLoginAt?: string | null;
  roles: RoleResponse[];
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user_profile: UserResponse;
}

export interface LoginRequest {
  emailOrUsername: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  locale?: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface EmailRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface ApiErrorBody {
  code?: number | string;
  message?: string;
  errors?: Record<string, string[]>;
}
