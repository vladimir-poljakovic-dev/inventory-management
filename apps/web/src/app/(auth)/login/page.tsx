'use client';

import type { AuthResponseDto, LoginDto } from '@repo/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api, getApiErrorMessage } from '@/lib/api';
import { setToken, setTokenCookie } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload: LoginDto = { email, password };
      const result = await api.post<AuthResponseDto>('/auth/login', payload);
      setToken(result.accessToken);
      setTokenCookie(result.accessToken);
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-2xl font-semibold">Sign in</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-900 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-900 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          No account?{' '}
          <Link href="/register" className="font-medium text-gray-900 underline">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
