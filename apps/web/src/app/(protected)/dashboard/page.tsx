'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { clearToken, clearTokenCookie } from '@/lib/auth';
import { useState} from "react";
import { getEmail } from "@/lib/jwt";

export default function DashboardPage() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const email = getEmail();
  const username = email?.split("@")[0] ?? "";

  function handleLogout() {
    clearToken();
    clearTokenCookie();
    router.push('/login');
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-semibold ">Dashboard</h1>
        <div className="relative">
  <button
    onClick={() => setMenuOpen(!menuOpen)}
    className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800"
  >Menu
  </button>
  {menuOpen && (
    <div className="absolute right-0 mt-2 w-48 rounded-md border border-gray-300 bg-white shadow-lg"> 
      <span className="block px-4 py-2 text-sm font-semibold">
      Hello: {username}
      </span>
      <Link
        href="/categories"
        onClick={() => setMenuOpen(false)}
        className="block px-4 py-2 text-sm hover:bg-gray-100"
      >Categories
      </Link>

      <Link
        href="/products"
        onClick={() => setMenuOpen(false)}
        className="block px-4 py-2 text-sm hover:bg-gray-100"
      >Products
      </Link>

      <Link
        href="/suppliers"
        onClick={() => setMenuOpen(false)}
        className="block px-4 py-2 text-sm hover:bg-gray-100"
      >Suppliers
      </Link>

      <Link
        href="/warehouses"
        onClick={() => setMenuOpen(false)}
        className="block px-4 py-2 text-sm hover:bg-gray-100"
      >Warehouses
      </Link>

      <button
        onClick={handleLogout}
        className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
      >Log out
      </button>
    </div>
  )}
</div>
      </div>
      <p className="text-gray-600">Welcome to Inventory Management.</p>
    </main>
  );
}
