export const APP_CONFIG = {
  API_URL: import.meta.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  APP_NAME: 'NovaPLay',
  DEFAULT_LANGUAGE: 'vi',
  SUPPORTED_LANGUAGES: ['vi', 'en'],
  DEFAULT_CURRENCY: 'VND',
  DATE_FORMAT: 'DD/MM/YYYY',
  TIME_FORMAT: 'HH:mm',
  DATETIME_FORMAT: 'DD/MM/YYYY HH:mm',
  ITEMS_PER_PAGE: 10,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
  TOKEN_KEY: 'token',
  USER_KEY: 'user',
  THEME_KEY: 'theme',
  DEFAULT_THEME: 'light'
}; 