export const ENDPOINTS = {
  auth: {
    register: '/auth/register',
    verifyOtp: '/auth/verify-otp',
    resendOtp: '/auth/resend-registration-otp',
    login: '/auth/login',
    refresh: '/auth/refresh-token',
    logout: '/auth/logout',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    changePassword: '/auth/change-password',
    me: '/auth/me',
  },
} as const;
