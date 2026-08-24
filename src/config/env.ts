function optional(key: 'VITE_API_URL' | 'VITE_APP_ENV', fallback: string): string {
  const value = import.meta.env[key];
  return value && value.length > 0 ? value : fallback;
}

export const ENV = {
  API_URL: optional('VITE_API_URL', 'http://localhost:8080/api/v1'),
  APP_ENV: optional('VITE_APP_ENV', import.meta.env.MODE),
  AUTH_BYPASS: import.meta.env.VITE_AUTH_BYPASS === 'true',
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
} as const;
