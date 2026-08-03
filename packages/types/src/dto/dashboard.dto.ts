import { StockMovementType } from '../enums/stock-movement-type.enum';
import type { Product } from './product.dto';
import type { WareHouse } from './warehouse.dto';

export interface RecentMovement {
  id: string;
  quantityDelta: number;
  reason: string;
  type: StockMovementType;
  createdAt: string;
  stock: {
    product: {
      name: string;
      sku: string;
    };
  };
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export interface LowStockItem {
  id: string;
  quantity: number;
  lowStockThreshold: number;
  product: Product;
  warehouse: WareHouse;
}

export interface DashboardData {
  totalProducts: number;
  totalWarehouses: number;
  totalSuppliers: number;
  lowStockCount: number;
  totalStockValue: number;
  recentMovements: RecentMovement[];
  lowStockItems: LowStockItem[];
}