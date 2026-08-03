'use client';

import { StockMovementType } from '@repo/types';
import { useDashboard } from './useDashboard';

const statCards = (data: NonNullable<ReturnType<typeof useDashboard>['data']>) => [
  { label: 'Total Products', value: data.totalProducts, color: 'bg-indigo-600' },
  { label: 'Warehouses', value: data.totalWarehouses, color: 'bg-emerald-600' },
  { label: 'Suppliers', value: data.totalSuppliers, color: 'bg-sky-600' },
  { label: 'Low Stock Items', value: data.lowStockCount, color: data.lowStockCount > 0 ? 'bg-red-600' : 'bg-gray-600' },
  { label: 'Total Stock Value', value: `$${data.totalStockValue.toLocaleString()}`, color: 'bg-violet-600' },
];

function movementColor(type: StockMovementType) {
  if (type === StockMovementType.IN) return 'text-emerald-600';
  if (type === StockMovementType.OUT) return 'text-red-600';
  return 'text-yellow-600';
}

function movementSign(type: StockMovementType, delta: number) {
  if (type === StockMovementType.IN) return `+${delta}`;
  if (type === StockMovementType.OUT) return `${delta}`;
  return `${delta > 0 ? '+' : ''}${delta}`;
}

export default function DashboardPage() {
  const { data, loading, error } = useDashboard();

  return (
    <main className="px-6 py-10">
      <h1 className="mb-8 text-3xl font-semibold">Dashboard</h1>

      {error && <p className="mb-4 text-sm text-red-700">{error}</p>}
      {loading && <p className="text-gray-500">Loading dashboard...</p>}

      {data && (
        <>
          <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
            {statCards(data).map((card) => (
              <div key={card.label} className={`rounded-xl p-4 text-white shadow-md ${card.color}`}>
                <p className="text-xs font-medium opacity-80 break-words">{card.label}</p>
                <p className="mt-1 text-2xl font-bold break-all">{card.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Low Stock Warnings
                {data.lowStockItems.length > 0 && (
                  <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                    {data.lowStockItems.length}
                  </span>
                )}
              </h2>
              {data.lowStockItems.length === 0 ? (
                <p className="text-sm text-gray-500">All stock levels are healthy.</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {data.lowStockItems.map((s) => (
                    <li key={s.id} className="py-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{s.product.name}</p>
                          <p className="text-xs text-gray-400">{s.warehouse.name}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-red-600">{s.quantity}</p>
                          <p className="text-xs text-gray-400">threshold: {s.lowStockThreshold}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Recent Activity</h2>
              {data.recentMovements.length === 0 ? (
                <p className="text-sm text-gray-500">No recent movements.</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {data.recentMovements.map((m) => (
                    <li key={m.id} className="py-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{m.stock.product.name}</p>
                          <p className="text-xs text-gray-500 break-words">{m.reason}</p>
                          <p className="text-xs text-gray-400 truncate">{m.user.email}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className={`text-sm font-bold ${movementColor(m.type)}`}>
                            {movementSign(m.type, m.quantityDelta)}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(m.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </main>
  );
}