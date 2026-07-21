import { ArrayMinSize, IsArray, IsNumber, IsOptional, IsString, IsUUID, Min, ValidateNested } from 'class-validator';
import { PurchaseOrderStatus } from '../enums/purchase-order-status.enum';
import type { Product } from './product.dto';
import type { Supplier } from './supplier.dto';

export interface PurchaseOrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  productId: string;
  product: Product;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrder {
  id: string;
  status: PurchaseOrderStatus;
  notes: string | null;
  supplierId: string;
  supplier: Supplier;
  items: PurchaseOrderItem[];
  createdAt: string;
  updatedAt: string;
}

export class CreatePurchaseOrderItemDto {
  @IsUUID()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  unitPrice: number;
}

export class CreatePurchaseOrderDto {
  @IsUUID()
  supplierId: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsArray()
  @ArrayMinSize(1)
  items: CreatePurchaseOrderItemDto[];
}