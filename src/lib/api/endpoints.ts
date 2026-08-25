/**
 * Nguồn sự thật duy nhất cho mọi Endpoint REST API của NovaPlay Backend Microservices
 * Kết nối thông qua API Gateway (Mặc định: http://localhost:8072)
 */
export const ENDPOINTS = {
  // 1. Auth Service (Port 8000 qua Gateway)
  auth: {
    register: '/api/v1/auth/register',
    verifyOtp: '/api/v1/auth/verify-otp',
    resendOtp: '/api/v1/auth/resend-registration-otp',
    login: '/api/v1/auth/login',
    refresh: '/api/v1/auth/refresh-token',
    logout: '/api/v1/auth/logout',
    forgotPassword: '/api/v1/auth/forgot-password',
    resetPassword: '/api/v1/auth/reset-password',
    changePassword: '/api/v1/auth/change-password',
    me: '/api/v1/auth/me',
  },

  // 2. User Service (Port 8700 qua Gateway)
  users: {
    me: '/api/v1/users/me',
    profile: '/api/v1/users/me/profile',
    avatar: '/api/v1/users/me/avatar',
    favorites: '/api/v1/users/favorites',
    favoriteById: (movieId: string) => `/api/v1/users/favorites/${movieId}`,
    watchProgress: '/api/v1/users/watch-progress',
    watchProgressByMovie: (movieId: string) => `/api/v1/users/watch-progress/${movieId}`,
  },

  // 3. Movie Service (Port 8600 qua Gateway)
  movies: {
    list: '/api/v1/movies',
    detail: (id: string) => `/api/v1/movies/${id}`,
    trending: '/api/v1/movies/trending',
    topRated: '/api/v1/movies/top-rated',
    search: '/api/v1/movies/search',
    byGenre: (genreId: string) => `/api/v1/movies/genre/${genreId}`,
    adminManage: '/api/v1/movies/manage',
    adminMovieDetail: (id: string) => `/api/v1/movies/manage/${id}`,
    adminEpisodes: (movieId: string) => `/api/v1/movies/manage/${movieId}/episodes`,
  },

  // 4. Genres & Artists (Movie Service)
  genres: {
    list: '/api/v1/genres',
    detail: (id: string) => `/api/v1/genres/${id}`,
    create: '/api/v1/genres',
    update: (id: string) => `/api/v1/genres/${id}`,
    delete: (id: string) => `/api/v1/genres/${id}`,
  },
  artists: {
    list: '/api/v1/artists',
    detail: (id: string) => `/api/v1/artists/${id}`,
    create: '/api/v1/artists',
    update: (id: string) => `/api/v1/artists/${id}`,
    delete: (id: string) => `/api/v1/artists/${id}`,
  },

  // 5. Notification Service (Port 8900 qua Gateway)
  notifications: {
    list: '/api/v1/notifications',
    unreadCount: '/api/v1/notifications/unread-count',
    markRead: (id: string) => `/api/v1/notifications/${id}/read`,
    markAllRead: '/api/v1/notifications/read-all',
    delete: (id: string) => `/api/v1/notifications/${id}`,
  },

  // 6. Promotion Service (Port 8300 qua Gateway)
  promotions: {
    validateCoupon: (code: string) => `/api/v1/promotions/coupons/${code}/validate`,
    redeemCoupon: '/api/v1/promotions/coupons/redeem',
    campaigns: '/api/v1/promotions/campaigns',
  },

  // 7. Media Service (Port 8081 qua Gateway)
  media: {
    presignedUpload: '/api/v1/media/upload/presigned-url',
    multipartInit: '/api/v1/media/upload/multipart/init',
    multipartPartUrl: '/api/v1/media/upload/multipart/part-url',
    multipartComplete: '/api/v1/media/upload/multipart/complete',
    multipartAbort: '/api/v1/media/upload/multipart/abort',
  },

  // 8. Streaming Service (Port 8200 qua Gateway)
  streaming: {
    playbackToken: (movieId: string, episodeId?: string) =>
      `/api/v1/streaming/tokens?movieId=${movieId}${episodeId ? `&episodeId=${episodeId}` : ''}`,
    hlsMaster: (playbackToken: string) => `/api/v1/streaming/hls/master.m3u8?pt=${playbackToken}`,
  },
} as const;
