import type { CreatePurchaseOrderDto, PurchaseOrder, ReceivePurchaseOrderDto } from '@repo/types';
import api from './api';

export interface LineItem {
    productId: string;
    quantity: string;
    unitPrice: string;
  }  

export const purchaseOrdersApi = {
    getAll: () => api.get<PurchaseOrder[]>('/purchase-orders'),
    getOne: (id: string) => api.get<PurchaseOrder>(`/purchase-orders/${id}`),
    create: (dto: CreatePurchaseOrderDto) => api.post<PurchaseOrder>('/purchase-orders', dto),
    receive: (id: string, dto: ReceivePurchaseOrderDto) => api.patch<PurchaseOrder>(`/purchase-orders/${id}/receive`, dto),
};