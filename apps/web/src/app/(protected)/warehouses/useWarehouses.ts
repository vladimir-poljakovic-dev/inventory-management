import { useEffect, useState } from 'react';
import type { WareHouse } from '@repo/types';
import { getApiErrorMessage } from '@/lib/api';
import { warehousesApi } from '@/lib/warehouses';

export function useWarehouses() {
  const [warehouses, setWarehouses] = useState<WareHouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchWarehouses(); }, []);

  async function fetchWarehouses() {
    setLoading(true);
    setError('');
    try {
      setWarehouses(await warehousesApi.getAll());
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function createWarehouse(values: Record<string, string>) {
    await warehousesApi.create({ name: values.name, location: values.location, description: values.description || undefined });
    fetchWarehouses();
  }

  async function updateWarehouse(id: string, values: Record<string, string>) {
    await warehousesApi.update(id, { name: values.name, location: values.location, description: values.description || undefined });
    fetchWarehouses();
  }

  async function deleteWarehouse(id: string) {
    await warehousesApi.delete(id);
    fetchWarehouses();
  }

  return { warehouses, loading, error, createWarehouse, updateWarehouse, deleteWarehouse };
}