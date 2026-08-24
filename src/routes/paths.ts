/**
 * Nguồn sự thật duy nhất cho mọi đường dẫn route.
 * Import từ đây thay vì viết chuỗi đường dẫn trực tiếp.
 */
export const PATHS = {
  // Public
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_OTP: '/verify-otp',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // Movies — public (không cần đăng nhập)
  MOVIES: '/movies',
  MOVIE_DETAIL: (id: string) => `/movie/${id}`,
  SEARCH: '/search',

  // Movies — protected (cần đăng nhập)
  WATCH: (id: string) => `/watch/${id}`,
  WATCHLIST: '/watchlist',

  // Auth protected
  CHANGE_PASSWORD: '/change-password',

  // Admin
  ADMIN: '/admin',

  // Special
  FORBIDDEN: '/403',
  NOT_FOUND: '/404',
} as const;

/** Các route tĩnh (không có tham số) */
export type StaticPath = Extract<(typeof PATHS)[keyof typeof PATHS], string>;
