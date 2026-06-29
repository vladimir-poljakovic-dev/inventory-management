import { CreateCategoryDto, UpdateCategoryDto } from '@repo/types';
import api from './api';

export interface Category {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export const categoriesApi = {
  getAll: () => api.get<Category[]>('/categories'),
  getOne: (id: string) => api.get<Category>(`/categories/${id}`),
  create: (dto: CreateCategoryDto) => api.post<Category>('/categories', dto),
  update: (id: string, dto: UpdateCategoryDto) => api.patch<Category>(`/categories/${id}`, dto),
  delete: (id: string) => api.delete<void>(`/categories/${id}`),
};