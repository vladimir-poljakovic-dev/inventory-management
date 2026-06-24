const TOKEN_KEY = 'token';

// The token lives in localStorage (for axios) AND a cookie (so middleware,
// which can't read localStorage, can gate routes on the server).
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export function getToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function setTokenCookie(token: string): void {
  document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
}

export function clearTokenCookie(): void {
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
}
