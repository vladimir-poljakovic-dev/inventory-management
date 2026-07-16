import type { Product, WareHouse } from '@repo/types';

interface Props {
  products: Product[];
  warehouses: WareHouse[];
  productId: string;
  warehouseId: string;
  quantityDelta: string;
  reason: string;
  loading: boolean;
  error: string;
  onChangeProduct: (v: string) => void;
  onChangeWarehouse: (v: string) => void;
  onChangeDelta: (v: string) => void;
  onChangeReason: (v: string) => void;
  onSubmit: (e: React.SubmitEvent) => void;
  onCancel: () => void;
}

export default function AdjustModal({ products, warehouses, productId, warehouseId, quantityDelta, reason, loading, error, onChangeProduct, onChangeWarehouse, onChangeDelta, onChangeReason, onSubmit, onCancel }: Props) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold">Adjust Stock</h2>
        {error && <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Product</label>
            <select required value={productId} onChange={(e) => onChangeProduct(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-900 focus:outline-none">
              <option value="">Select product...</option>
              {products.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Warehouse</label>
            <select required value={warehouseId} onChange={(e) => onChangeWarehouse(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-900 focus:outline-none">
              <option value="">Select warehouse...</option>
              {warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Quantity Delta</label>
            <input required type="number" value={quantityDelta} onChange={(e) => onChangeDelta(e.target.value)} placeholder="e.g. 10 or -5" className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-900 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Reason</label>
            <input required value={reason} onChange={(e) => onChangeReason(e.target.value)} placeholder="e.g. Received shipment" className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-900 focus:outline-none" />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onCancel} className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100">Cancel</button>
            <button type="submit" disabled={loading} className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800 disabled:opacity-50">
              {loading ? 'Saving...' : 'Adjust'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}