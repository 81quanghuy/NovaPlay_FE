export type RoleName = 'ADMIN' | 'USER' | 'MEMBER';

export interface RoleResponse {
  roleName: RoleName;
  description?: string;
}

export interface UserResponse {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string | null;
  phoneNumber?: string | null;
  bio?: string | null;
  isActive?: boolean;
  isEmailVerified?: boolean;
  lastLoginAt?: string | null;
  roles: RoleResponse[];
  activePlan?: string;
  planExpiredAt?: string | null;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type?: string;
  expires_in: number;
  user_profile: UserResponse;
}

export interface LoginRequest {
  email_or_username?: string;
  emailOrUsername?: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirm_password?: string;
  confirmPassword?: string;
  locale?: string;
  accept?: boolean;
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
  new_password?: string;
  newPassword?: string;
  confirm_new_password?: string;
  confirmNewPassword?: string;
}

export interface ChangePasswordRequest {
  current_password?: string;
  currentPassword?: string;
  new_password?: string;
  newPassword?: string;
  confirm_new_password?: string;
  confirmNewPassword?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

/**
 * Standard Backend Microservices Envelope (GenericResponse<T>)
 */
export interface GenericResponse<T> {
  success: boolean;
  message: string;
  statusCode: number;
  result: T;
  timestamp?: string;
}

/**
 * Standard Spring Data Page Envelope (PageResponse<T>)
 */
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ApiError {
  message: string;
  error?: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}
