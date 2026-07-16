import { IsInt, IsNotEmpty, IsString, IsUUID } from "class-validator";
import type { Product } from './product.dto';
import type { WareHouse } from './warehouse.dto';

export interface StockItem {
  id: string;
  quantity: number;
  lowStockThreshold: number;
  productId: string;
  warehouseId: string;
  product: Product;
  warehouse: WareHouse;
  createdAt: string;
  updatedAt: string;
}

export class AdjustStockDto {
    @IsUUID()
    productId: string;

    @IsUUID()
    warehouseId: string;

    @IsInt()
    quantityDelta: number;

    @IsString()
    @IsNotEmpty()
    reason: string
}