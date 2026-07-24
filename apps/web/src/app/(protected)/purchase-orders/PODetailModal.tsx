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
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Purchase Order Details</h2>
          <button onClick={onClose} className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100">Close</button>
        </div>

        <div className="mb-4 space-y-1 text-sm">
          <p><span className="font-medium">Supplier:</span> {order.supplier.name}</p>
          <p><span className="font-medium">Status:</span> <span className={isReceived ? 'text-green-600 font-medium' : 'text-yellow-600 font-medium'}>{order.status}</span></p>
          <p><span className="font-medium">Notes:</span> {order.notes ?? '—'}</p>
          <p><span className="font-medium">Created:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>

        <h3 className="mb-2 text-sm font-medium">Line Items</h3>
        <table className="w-full border-collapse text-sm mb-4">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2 pr-4 font-medium">Product</th>
              <th className="py-2 pr-4 font-medium">SKU</th>
              <th className="py-2 pr-4 font-medium">Quantity</th>
              <th className="py-2 font-medium">Unit Price</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="py-2 pr-4">{item.product.name}</td>
                <td className="py-2 pr-4 text-gray-500">{item.product.sku}</td>
                <td className="py-2 pr-4">{item.quantity}</td>
                <td className="py-2">${item.unitPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {error && <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        {admin && !isReceived && (
          <div className="flex gap-2 items-center">
            <select required value={warehouseId} onChange={(e) => setWarehouseId(e.target.value)} className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none">
              <option value="">Select warehouse to receive into...</option>
              {warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
            <button onClick={handleReceive} disabled={loading || !warehouseId} className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800 disabled:opacity-50">
              {loading ? 'Receiving...' : 'Receive'}
            </button>
          </div>
        )}

        {isReceived && (
          <p className="text-sm text-green-600 font-medium">This order has been received.</p>
        )}
      </div>
    </div>
  );
}