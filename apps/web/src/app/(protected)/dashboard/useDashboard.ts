import { useEffect, useState } from 'react';
import type { StockItem } from '@repo/types';
import { getApiErrorMessage } from '@/lib/api';
import { dashboardApi, DashboardData } from '@/lib/dashboard';

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [lowStock, setLowStock] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchDashboard(); }, []);

  async function fetchDashboard() {
    setLoading(true);
    setError('');
    try {
      const [dashData, lowStockData] = await Promise.all([
        dashboardApi.get(),
        dashboardApi.getLowStock(),
      ]);
      setData(dashData);
      setLowStock(lowStockData);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return { data, lowStock, loading, error, fetchDashboard };
}