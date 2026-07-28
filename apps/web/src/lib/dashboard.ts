import api from './api';
import type { StockItem } from '@repo/types';

export interface DashboardData {
  totalProducts: number;
  totalWarehouses: number;
  totalSuppliers: number;
  lowStockCount: number;
  totalStockValue: number;
  recentMovements: RecentMovement[];
}

export interface RecentMovement {
  id: string;
  quantityDelta: number;
  reason: string;
  type: 'in' | 'out' | 'adjustment';
  createdAt: string;
  stock: {
    product: {
      name: string;
      sku: string;
    };
  };
  user: {
    email: string;
    role: string;
  };
}

export const dashboardApi = {
  get: () => api.get<DashboardData>('/dashboard'),
  getLowStock: () => api.get<StockItem[]>('/stock/low'),
};