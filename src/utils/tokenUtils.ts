export interface JwtPayload {
  sub?: string;
  exp?: number;
  iat?: number;
  roles?: string[];
  jti?: string;
  [k: string]: unknown;
}

export function parseJwt(token: string): JwtPayload | null {
  try {
    const [, payload] = token.split('.');
    if (!payload) return null;
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escape(json))) as JwtPayload;
  } catch {
    return null;
  }
}

export function isExpired(token: string, skewSec = 5): boolean {
  const p = parseJwt(token);
  if (!p?.exp) return true;
  return Date.now() / 1000 >= p.exp - skewSec;
}
