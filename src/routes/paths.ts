/**
 * Nguồn sự thật duy nhất cho mọi đường dẫn route.
 * Import từ đây thay vì viết chuỗi đường dẫn trực tiếp.
 */
export const PATHS = {
  // Public / Auth
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
  PRICING: '/pricing',

  // User features — protected (cần đăng nhập)
  NOTIFICATIONS: '/notifications',
  MY_LIST: '/my-list',
  WATCHLIST: '/my-list', // Alias cho tương thích ngược
  PROFILE: '/profile',
  CHANGE_PASSWORD: '/change-password',

  // Movies — protected (cần đăng nhập)
  WATCH: (id: string) => `/watch/${id}`,

  // Admin area — protected (yêu cầu vai trò ADMIN)
  ADMIN: '/admin',
  ADMIN_MOVIES: '/admin/movies',
  ADMIN_GENRES: '/admin/genres',
  ADMIN_ARTISTS: '/admin/artists',
  ADMIN_EPISODES: (id: string) => `/admin/movies/${id}/episodes`,

  // Special
  FORBIDDEN: '/403',
  NOT_FOUND: '/404',
} as const;

/** Các route tĩnh (không có tham số) */
export type StaticPath = Extract<(typeof PATHS)[keyof typeof PATHS], string>;
