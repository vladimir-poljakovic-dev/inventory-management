'use client';

import { useEffect, useState } from 'react';
import type { Product, WareHouse } from '@repo/types';
import { isAdmin } from '@/lib/jwt';
import { productsApi } from '@/lib/products';
import { warehousesApi } from '@/lib/warehouses';
import { useStock } from './useStock';
import { useAdjustForm } from './useAdjustForm';
import StockTable from './StockTable';
import AdjustModal from './AdjustModal';

export default function StockPage() {
  const [admin, setAdmin] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<WareHouse[]>([]);
  const { stock, loading, error, fetchStock } = useStock();
  const form = useAdjustForm(fetchStock);

  useEffect(() => {
    setAdmin(isAdmin());
    productsApi.getAll().then(setProducts).catch(() => {});
    warehousesApi.getAll().then(setWarehouses).catch(() => {});
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Stock</h1>
        {admin && <button onClick={() => form.setShow(true)} className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800">Adjust Stock</button>}
      </div>

      {error && <p className="mb-4 text-sm text-red-700">{error}</p>}
      {loading && <p className="text-gray-500">Loading stock...</p>}
      {!loading && stock.length === 0 && <p className="text-gray-500">No stock records yet.</p>}
      {!loading && stock.length > 0 && <StockTable stock={stock} />}

      {form.show && (
        <AdjustModal
          products={products}
          warehouses={warehouses}
          productId={form.productId}
          warehouseId={form.warehouseId}
          quantityDelta={form.quantityDelta}
          reason={form.reason}
          loading={form.loading}
          error={form.error}
          onChangeProduct={form.setProductId}
          onChangeWarehouse={form.setWarehouseId}
          onChangeDelta={form.setQuantityDelta}
          onChangeReason={form.setReason}
          onSubmit={form.handleSubmit}
          onCancel={() => form.setShow(false)}
        />
      )}
    </main>
  );
}