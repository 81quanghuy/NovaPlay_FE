export const APP = {
  NAME: 'NovaPlay',
  LOCALE: 'vi-VN',
  COPYRIGHT_START_YEAR: 2025,
} as const;

export const UI = {
  SEARCH_DEBOUNCE_MS: 250,
  RELATED_MOVIES_LIMIT: 12,
  HERO_AUTOPLAY_MS: 6000,
} as const;


export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
  OTP_LENGTH: 6,
} as const;
