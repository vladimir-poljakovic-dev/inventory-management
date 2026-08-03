import { useEffect, useState } from 'react';
import { getApiErrorMessage } from '@/lib/api';
import type { DashboardData } from '@repo/types';
import { dashboardApi } from '@/lib/dashboard';

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchDashboard(); }, []);

  async function fetchDashboard() {
    setLoading(true);
    setError('');
    try {
      setData(await dashboardApi.get());
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, fetchDashboard };
}