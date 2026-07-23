import type { Product, Supplier } from '@repo/types';
import { type LineItem } from '@/lib/purchase-orders';

interface Props {
  suppliers: Supplier[];
  products: Product[];
  supplierId: string;
  notes: string;
  items: LineItem[];
  loading: boolean;
  error: string;
  onChangeSupplier: (v: string) => void;
  onChangeNotes: (v: string) => void;
  onUpdateItem: (index: number, field: keyof LineItem, value: string) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onSubmit: (e: React.SubmitEvent) => void;
  onCancel: () => void;
}

export default function CreateOrderModal({ suppliers, products, supplierId, notes, items, loading, error, onChangeSupplier, onChangeNotes, onUpdateItem, onAddItem, onRemoveItem, onSubmit, onCancel }: Props) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="mb-4 text-xl font-semibold">New Purchase Order</h2>
        {error && <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Supplier</label>
            <select required value={supplierId} onChange={(e) => onChangeSupplier(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-900 focus:outline-none">
              <option value="">Select supplier...</option>
              {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Notes</label>
            <input value={notes} onChange={(e) => onChangeNotes(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-900 focus:outline-none" />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium">Line Items</label>
              <button type="button" onClick={onAddItem} className="rounded-md border border-gray-300 px-3 py-1 text-xs hover:bg-gray-100">Add Item</button>
            </div>
            {items.map((item, index) => (
              <div key={index} className="mb-2 flex gap-2 items-center">
                <select required value={item.productId} onChange={(e) => onUpdateItem(index, 'productId', e.target.value)} className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none">
                  <option value="">Select product...</option>
                  {products.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>)}
                </select>
                <input required type="number" placeholder="Qty" value={item.quantity} onChange={(e) => onUpdateItem(index, 'quantity', e.target.value)} className="w-20 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none" />
                <input required type="number" step="0.01" placeholder="Price" value={item.unitPrice} onChange={(e) => onUpdateItem(index, 'unitPrice', e.target.value)} className="w-24 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none" />
                {items.length > 1 && (
                  <button type="button" onClick={() => onRemoveItem(index)} className="rounded-md border border-red-300 px-3 py-2 text-xs text-red-600 hover:bg-red-50">Remove</button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onCancel} className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100">Cancel</button>
            <button type="submit" disabled={loading} className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800 disabled:opacity-50">
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}