/**
 * Nguồn sự thật duy nhất cho mọi Endpoint REST API của NovaPlay Backend Microservices
 * Base URL (ENV.API_URL) đã bao gồm tiền tố `/api/v1` (VD: http://localhost/api/v1 hoặc http://localhost:8072/api/v1)
 */
export const ENDPOINTS = {
  // 1. Auth Service (Port 8000 qua Gateway)
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

  // 2. User Service (Port 8700 qua Gateway)
  users: {
    me: '/users/me',
    profile: '/users/me/profile',
    avatar: '/users/me/avatar',
    favorites: '/users/favorites',
    favoriteById: (movieId: string) => `/users/favorites/${movieId}`,
    watchProgress: '/users/watch-progress',
    watchProgressByMovie: (movieId: string) => `/users/watch-progress/${movieId}`,
  },

  // 3. Movie Service (Port 8600 qua Gateway)
  movies: {
    list: '/movies',
    detail: (id: string) => `/movies/${id}`,
    trending: '/movies/trending',
    topRated: '/movies/top-rated',
    search: '/movies/search',
    byGenre: (genreId: string) => `/movies/genre/${genreId}`,
    adminManage: '/movies/manage',
    adminMovieDetail: (id: string) => `/movies/manage/${id}`,
    adminEpisodes: (movieId: string) => `/movies/manage/${movieId}/episodes`,
  },

  // 4. Genres & Artists (Movie Service)
  genres: {
    list: '/genres',
    detail: (id: string) => `/genres/${id}`,
    create: '/genres',
    update: (id: string) => `/genres/${id}`,
    delete: (id: string) => `/genres/${id}`,
  },
  artists: {
    list: '/artists',
    detail: (id: string) => `/artists/${id}`,
    create: '/artists',
    update: (id: string) => `/artists/${id}`,
    delete: (id: string) => `/artists/${id}`,
  },

  // 5. Notification Service (Port 8900 qua Gateway)
  notifications: {
    list: '/notifications',
    unreadCount: '/notifications/unread-count',
    markRead: (id: string) => `/notifications/${id}/read`,
    markAllRead: '/notifications/read-all',
    delete: (id: string) => `/notifications/${id}`,
  },

  // 6. Promotion Service (Port 8300 qua Gateway)
  promotions: {
    validateCoupon: (code: string) => `/promotions/coupons/${code}/validate`,
    redeemCoupon: '/promotions/coupons/redeem',
    campaigns: '/promotions/campaigns',
  },

  // 7. Media Service (Port 8081 qua Gateway)
  media: {
    presignedUpload: '/media/upload/presigned-url',
    multipartInit: '/media/upload/multipart/init',
    multipartPartUrl: '/media/upload/multipart/part-url',
    multipartComplete: '/media/upload/multipart/complete',
    multipartAbort: '/media/upload/multipart/abort',
  },

  // 8. Streaming Service (Port 8200 qua Gateway)
  streaming: {
    playbackToken: (movieId: string, episodeId?: string) =>
      `/streaming/tokens?movieId=${movieId}${episodeId ? `&episodeId=${episodeId}` : ''}`,
    hlsMaster: (playbackToken: string) => `/streaming/hls/master.m3u8?pt=${playbackToken}`,
  },
} as const;
