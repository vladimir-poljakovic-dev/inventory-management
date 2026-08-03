'use client';

import { useEffect, useState } from 'react';
import type { PurchaseOrder, Supplier, Product, WareHouse } from '@repo/types';
import { isAdmin } from '@/lib/jwt';
import { suppliersApi } from '@/lib/suppliers';
import { productsApi } from '@/lib/products';
import { warehousesApi } from '@/lib/warehouses';
import { usePurchaseOrders } from './usePurchaseOrders';
import { useCreateOrder } from './useCreateOrder';
import CreateOrderModal from './CreateOrderModal';
import PODetailModal from './PODetailModal';

export default function PurchaseOrdersPage() {
  const [admin, setAdmin] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<WareHouse[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const { orders, loading, error, fetchOrders } = usePurchaseOrders();
  const createOrder = useCreateOrder(fetchOrders);

  useEffect(() => {
    setAdmin(isAdmin());
    suppliersApi.getAll().then(setSuppliers).catch(() => {});
    productsApi.getAll().then(setProducts).catch(() => {});
    warehousesApi.getAll().then(setWarehouses).catch(() => {});
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Purchase Orders</h1>
        {admin && (
          <button onClick={() => createOrder.setShow(true)} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700">
            New Order
          </button>
        )}
      </div>

      {error && <p className="mb-4 text-sm text-red-700">{error}</p>}
      {loading && <p className="text-gray-500">Loading orders...</p>}
      {!loading && orders.length === 0 && <p className="text-gray-500">No purchase orders yet.</p>}

      {!loading && orders.length > 0 && (
   <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm overflow-x-auto">
   <table className="w-full min-w-[500px] border-collapse text-sm">
      <thead>
        <tr className="bg-gray-900 text-left text-white">
          <th className="px-4 py-3 font-medium">Supplier</th>
          <th className="px-4 py-3 font-medium">Status</th>
          <th className="px-4 py-3 font-medium">Items</th>
          <th className="px-4 py-3 font-medium">Created</th>
          <th className="px-4 py-3 font-medium">Actions</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order, i) => (
          <tr key={order.id} className={`border-t border-gray-100 hover:bg-indigo-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
            <td className="px-4 py-3 text-gray-700">{order.supplier.name}</td>
            <td className="px-4 py-3">
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${order.status === 'received' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {order.status}
              </span>
            </td>
            <td className="px-4 py-3 text-gray-700">{order.items.length}</td>
            <td className="px-4 py-3 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
            <td className="px-4 py-3">
              <button onClick={() => setSelectedOrder(order)} className="rounded border border-indigo-300 px-3 py-1 text-xs text-indigo-600 hover:bg-indigo-50">
                View
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

      {createOrder.show && (
        <CreateOrderModal
          suppliers={suppliers}
          products={products}
          supplierId={createOrder.supplierId}
          notes={createOrder.notes}
          items={createOrder.items}
          loading={createOrder.loading}
          error={createOrder.error}
          onChangeSupplier={createOrder.setSupplierId}
          onChangeNotes={createOrder.setNotes}
          onUpdateItem={createOrder.updateItem}
          onAddItem={createOrder.addItem}
          onRemoveItem={createOrder.removeItem}
          onSubmit={createOrder.handleSubmit}
          onCancel={() => createOrder.setShow(false)}
        />
      )}

      {selectedOrder && (
        <PODetailModal
          order={selectedOrder}
          warehouses={warehouses}
          admin={admin}
          onClose={() => setSelectedOrder(null)}
          onReceived={fetchOrders}
        />
      )}
    </main>
  );
}