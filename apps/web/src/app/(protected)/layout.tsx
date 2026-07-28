import type { ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto md:ml-60 px-6 py-6">
        {children}
      </div>
    </div>
  );
}