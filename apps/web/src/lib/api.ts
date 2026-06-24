import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';
import { clearToken, clearTokenCookie, getToken } from './auth';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Attach the bearer token to every request when present.
instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401, clear credentials and bounce to login.
instance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      clearToken();
      clearTokenCookie();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

// The API wraps payloads in { data, statusCode, timestamp }. These helpers
// unwrap `.data.data` so callers receive the payload (type T) directly.
interface ApiEnvelope<T> {
  data: T;
}

export const api = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    (await instance.get<ApiEnvelope<T>>(url, config)).data.data,
  post: async <T>(
    url: string,
    body?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> =>
    (await instance.post<ApiEnvelope<T>>(url, body, config)).data.data,
  put: async <T>(
    url: string,
    body?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> =>
    (await instance.put<ApiEnvelope<T>>(url, body, config)).data.data,
  patch: async <T>(
    url: string,
    body?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> =>
    (await instance.patch<ApiEnvelope<T>>(url, body, config)).data.data,
  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    (await instance.delete<ApiEnvelope<T>>(url, config)).data.data,
};

/**
 * Extracts the API's `{ error }` message from a failed request, with a fallback.
 */
export function getApiErrorMessage(
  error: unknown,
  fallback = 'Something went wrong. Please try again.',
): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { error?: string } | undefined;
    return data?.error ?? error.message ?? fallback;
  }
  return fallback;
}

export default api;
