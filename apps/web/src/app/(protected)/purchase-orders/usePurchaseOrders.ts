import { useEffect, useState } from 'react';
import type { PurchaseOrder } from '@repo/types';
import { getApiErrorMessage } from '@/lib/api';
import { purchaseOrdersApi } from '@/lib/purchase-orders';

export function usePurchaseOrders() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading,setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchOrders(); 
  },[]);

  async function fetchOrders() {
    setLoading(true);
    setError('');
    try {
      setOrders(await purchaseOrdersApi.getAll());
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }
  return { orders, loading, error, fetchOrders };
}