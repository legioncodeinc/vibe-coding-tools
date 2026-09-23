/**
 * Session-cookie config — opinionated defaults for 2026.
 *
 * Cite: guides/10-session-storage.md, OWASP Session Management Cheat Sheet,
 * RFC 6265bis. Use this as the source of truth and verify your provider
 * sets these attributes by running scripts/cookie-attribute-checker.ts.
 */

export type CookieMode = 'same-site' | 'cross-site';

interface SessionCookieConfig {
  name: string;
  httpOnly: true;
  secure: boolean;
  sameSite: 'lax' | 'strict' | 'none';
  path: '/';
  domain?: string;
  maxAge: number; // seconds
}

/**
 * Default same-site session cookie.
 *
 * - HttpOnly: JS cannot read; XSS-resistant.
 * - Secure: HTTPS-only (relax in dev only).
 * - SameSite=Lax: blocks most CSRF; promote to Strict for high-sensitivity.
 * - Path=/: explicit, not scoped to a subpath.
 * - Max-Age 30 days: idle timeout enforced server-side; absolute timeout
 *   should also be enforced server-side (e.g., 90 days hard cap).
 */
export const defaultSessionCookie: SessionCookieConfig = {
  name: '__Host-session', // __Host- prefix: Secure + Path=/ + no Domain (browser-enforced)
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  path: '/',
  maxAge: 60 * 60 * 24 * 30, // 30 days
};

/**
 * Cross-site session cookie (for embeds, widgets, cross-site OAuth flows).
 *
 * Required when SameSite=None: the cookie can be sent in a third-party
 * context. Pair with a CSRF token (double-submit) on every state-changing
 * request — SameSite=None alone is NOT a CSRF defense.
 *
 * NOTE: __Host- prefix requires Path=/ and no Domain attribute. With
 * SameSite=None this is the most defensible config; some setups need
 * explicit Domain — drop the __Host- prefix in that case but document why.
 */
export const crossSiteSessionCookie: SessionCookieConfig = {
  name: '__Host-session',
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  path: '/',
  maxAge: 60 * 60 * 24 * 30,
};

/**
 * High-sensitivity session (banking, admin, billing-edit).
 *
 * SameSite=Strict: even top-level GETs from another origin won't carry
 * the cookie. UX cost: a click from email lands the user on sign-in.
 */
export const strictSessionCookie: SessionCookieConfig = {
  name: '__Host-admin-session',
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  path: '/',
  maxAge: 60 * 60 * 24, // 1 day absolute, with idle 30 min server-side
};

/**
 * Dev-only relaxation. Localhost has no HTTPS by default.
 * Do NOT ship to production with secure=false.
 */
export const devSessionCookie: SessionCookieConfig = {
  name: 'session', // __Host- requires Secure; drop the prefix in dev
  httpOnly: true,
  secure: false,
  sameSite: 'lax',
  path: '/',
  maxAge: 60 * 60 * 24, // 1 day in dev
};

/**
 * Compose the Set-Cookie header.
 */
export function setCookieHeader(value: string, cfg: SessionCookieConfig): string {
  const parts = [
    `${cfg.name}=${value}`,
    `Path=${cfg.path}`,
    `Max-Age=${cfg.maxAge}`,
    'HttpOnly',
    cfg.secure ? 'Secure' : '',
    `SameSite=${cfg.sameSite[0].toUpperCase()}${cfg.sameSite.slice(1)}`,
    cfg.domain ? `Domain=${cfg.domain}` : '',
  ].filter(Boolean);
  return parts.join('; ');
}

/**
 * CSRF token cookie companion (double-submit pattern).
 *
 * NOT HttpOnly — the client JS reads it and echoes into a request header
 * (e.g., X-CSRF-Token). Server compares cookie value to header value.
 * Attackers cannot read the cookie cross-origin, cannot forge the header.
 */
export const csrfCookie = {
  name: 'csrf-token',
  httpOnly: false, // <-- intentional; client-readable
  secure: true,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 30,
};

/**
 * Choose the right config.
 */
export function chooseSessionCookieConfig(
  mode: CookieMode,
  env: 'dev' | 'prod' | 'staging',
  sensitivity: 'normal' | 'high',
): SessionCookieConfig {
  if (env === 'dev') return devSessionCookie;
  if (sensitivity === 'high') return strictSessionCookie;
  return mode === 'cross-site' ? crossSiteSessionCookie : defaultSessionCookie;
}
