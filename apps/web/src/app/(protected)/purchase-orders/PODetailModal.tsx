import { useState } from 'react';
import type { PurchaseOrder, WareHouse } from '@repo/types';
import { PurchaseOrderStatus } from '@repo/types';
import { getApiErrorMessage } from '@/lib/api';
import { purchaseOrdersApi } from '@/lib/purchase-orders';

interface Props {
  order: PurchaseOrder;
  warehouses: WareHouse[];
  admin: boolean;
  onClose: () => void;
  onReceived: () => void;
}

export default function PODetailModal({ order, warehouses, admin, onClose, onReceived }: Props) {
  const [warehouseId, setWarehouseId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleReceive() {
    if (!warehouseId) return;
    setLoading(true);
    setError('');
    try {
      await purchaseOrdersApi.receive(order.id, { warehouseId });
      onReceived();
      onClose();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  const isReceived = order.status === PurchaseOrderStatus.RECEIVED;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Purchase Order Details</h2>
          <button onClick={onClose} className="rounded-lg border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50">Close</button>
        </div>

        <div className="mb-5 space-y-1 text-sm rounded-lg bg-gray-50 p-4 border border-gray-100">
          <p><span className="font-medium text-gray-700">Supplier:</span> <span className="text-gray-600">{order.supplier.name}</span></p>
          <p><span className="font-medium text-gray-700">Status:</span>{' '}
            <span className={`font-medium ${isReceived ? 'text-emerald-600' : 'text-yellow-600'}`}>
              {order.status}
            </span>
          </p>
          <p><span className="font-medium text-gray-700">Notes:</span> <span className="text-gray-600">{order.notes ?? '—'}</span></p>
          <p><span className="font-medium text-gray-700">Created:</span> <span className="text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</span></p>
        </div>

        <h3 className="mb-2 text-sm font-semibold text-gray-900">Line Items</h3>
        <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm mb-5">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-900 text-left text-white">
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">SKU</th>
                <th className="px-4 py-3 font-medium">Quantity</th>
                <th className="px-4 py-3 font-medium">Unit Price</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr key={item.id} className={`border-t border-gray-100 hover:bg-indigo-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-4 py-3 text-gray-700">{item.product.name}</td>
                  <td className="px-4 py-3 text-gray-500">{item.product.sku}</td>
                  <td className="px-4 py-3 text-gray-700">{item.quantity}</td>
                  <td className="px-4 py-3 text-gray-700">${item.unitPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {error && <p className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</p>}

        {admin && !isReceived && (
          <div className="flex gap-2 items-center">
            <select
              required
              value={warehouseId}
              onChange={(e) => setWarehouseId(e.target.value)}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">Select warehouse to receive into...</option>
              {warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
            <button
              onClick={handleReceive}
              disabled={loading || !warehouseId}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Receiving...' : 'Receive'}
            </button>
          </div>
        )}

        {isReceived && (
          <p className="text-sm text-emerald-600 font-medium">This order has been received.</p>
        )}
      </div>
    </div>
  );
}