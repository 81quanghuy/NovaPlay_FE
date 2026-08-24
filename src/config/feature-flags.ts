import { ENV } from './env';

export const FLAGS = {
  AUTH_BYPASS: ENV.IS_DEV && ENV.AUTH_BYPASS,
} as const;
