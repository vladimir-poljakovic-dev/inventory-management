'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { clearToken, clearTokenCookie } from '@/lib/auth';
import { getEmail } from '@/lib/jwt';

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/categories', label: 'Categories' },
  { href: '/products', label: 'Products' },
  { href: '/suppliers', label: 'Suppliers' },
  { href: '/warehouses', label: 'Warehouses' },
  { href: '/stock', label: 'Stock' },
  { href: '/purchase-orders', label: 'Purchase Orders' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState('');
  useEffect(() => {
    const email = getEmail();
    setUsername(email?.split('@')[0] ?? '');
  }, []);
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    clearToken();
    clearTokenCookie();
    router.push('/login');
    router.refresh();
  }

  return (
    <>
<div className="md:hidden fixed top-0 right-0 z-50">
  <button
    onClick={() => setMenuOpen(!menuOpen)}
    className="m-3 rounded-md bg-gray-900 p-2 text-white shadow-lg"
  >
    <span className="block w-5 h-0.5 bg-white mb-1" />
    <span className="block w-5 h-0.5 bg-white mb-1" />
    <span className="block w-5 h-0.5 bg-white" />
  </button>

{menuOpen && (
  <div className="absolute right-0 top-full w-56 bg-gray-900 shadow-2xl rounded-xl border border-gray-700" onClick={(e) => e.stopPropagation()}>
    <div className="absolute -top-1.5 right-6 w-3 h-3 bg-gray-900 rotate-45 border-l border-t border-gray-700" />
    <div className="px-3 py-3">
      <div className="mb-3 rounded-md bg-gray-800 px-3 py-2">
        <p className="text-xs text-gray-400">Logged in as</p>
        <p className="truncate text-xs font-medium text-white">{username}</p>
      </div>
      <button onClick={handleLogout} className="mb-3 w-full rounded-md bg-red-600 px-3 py-2 text-left text-xs font-medium text-white hover:bg-red-500">
        Log out
      </button>
      <div className="mb-3 border-t border-gray-700" />
      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            className={`rounded-md px-3 py-2 text-xs font-medium transition-colors ${
              pathname === link.href
                ? 'bg-indigo-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  </div>
)}
</div>

{menuOpen && (
  <div className="lg:hidden fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
)}

<aside className="hidden md:flex flex-col fixed top-0 left-0 h-full w-60 bg-gray-900 px-4 py-5 shadow-[4px_0_15px_rgba(0,0,0,0.3)] z-30">
  <div className="mb-5 px-2">
    <h1 className="text-base font-bold text-white">Inventory</h1>
    <p className="text-xs text-gray-400">Management System</p>
  </div>
  <div className="mb-3 rounded-md bg-gray-800 px-3 py-2">
    <p className="text-xs text-gray-400">Logged in as</p>
    <p className="truncate text-sm font-medium text-white">{username}</p>
  </div>
  <button onClick={handleLogout} className="mb-3 w-full rounded-md bg-red-600 px-3 py-2 text-left text-sm font-medium text-white hover:bg-red-500 transition-colors">
    Log out
  </button>
  <div className="mb-3 border-t border-gray-700" />
  <nav className="flex flex-col gap-1 flex-1 overflow-y-auto pb-6">
    {links.map((link) => (
      <Link
        key={link.href}
        href={link.href}
        className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
          pathname === link.href
            ? 'bg-indigo-600 text-white'
            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
        }`}
      >
        {link.label}
      </Link>
    ))}
  </nav>
</aside>
    </>
  );
}