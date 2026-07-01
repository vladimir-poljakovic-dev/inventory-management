import { CreateWarehouseDto, UpdateWarehouseDto, type WareHouse } from '@repo/types';
import api from './api';

export const warehousesApi = {
  getAll: () => api.get<WareHouse[]>('/warehouses'),
  create: (dto: CreateWarehouseDto) => api.post<WareHouse>('/warehouses', dto),
  update: (id: string, dto: UpdateWarehouseDto) => api.patch<WareHouse>(`/warehouses/${id}`, dto),
  delete: (id: string) => api.delete<void>(`/warehouses/${id}`),
};