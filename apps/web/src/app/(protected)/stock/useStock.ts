import { useEffect, useState } from 'react';
import type { StockItem } from '@repo/types';
import { getApiErrorMessage } from '@/lib/api';
import { stockApi } from '@/lib/stock';

export function useStock() {
  const [stock, setStock] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchStock(); }, []);

  async function fetchStock() {
    setLoading(true);
    setError('');
    try {
      setStock(await stockApi.getAll());
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return { stock, loading, error, fetchStock };
}