import { IsArray, IsNumber, IsOptional, IsString, IsUUID, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
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

    @IsNumber()
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
    @ValidateNested({ each: true })
    @Type(() => CreatePurchaseOrderItemDto)
    items: CreatePurchaseOrderItemDto[];
}