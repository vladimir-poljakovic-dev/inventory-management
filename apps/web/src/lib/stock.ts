import { AdjustStockDto, StockItem } from '@repo/types';
import api from './api';

export const stockApi = {
  getAll: () => api.get<StockItem[]>('/stock'),
  adjust: (dto: AdjustStockDto) => api.post<StockItem>('/stock/adjust', dto),
};