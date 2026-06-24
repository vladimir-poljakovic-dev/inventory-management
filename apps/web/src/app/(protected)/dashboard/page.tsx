'use client';

import { useRouter } from 'next/navigation';
import { clearToken, clearTokenCookie } from '@/lib/auth';

export default function DashboardPage() {
  const router = useRouter();

  function handleLogout() {
    clearToken();
    clearTokenCookie();
    router.push('/login');
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
        >
          Log out
        </button>
      </div>
      <p className="text-gray-600">Welcome to Inventory Management.</p>
    </main>
  );
}
