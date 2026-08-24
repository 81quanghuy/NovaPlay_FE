export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_UPPERCASE: /[A-Z]/,
  PASSWORD_LOWERCASE: /[a-z]/,
  PASSWORD_NUMBER: /[0-9]/,
  PASSWORD_SPECIAL: /[^A-Za-z0-9]/,
  USERNAME: /^[A-Za-z0-9_.-]+$/,
  NUMERIC: /^[0-9]+$/,
} as const;
