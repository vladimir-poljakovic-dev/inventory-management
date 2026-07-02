import { CreateProductDto, UpdateProductDto } from "@repo/types";
import type { Product } from "@repo/types";
import api from "./api";

export const productsApi = {
    getAll: ( categoryId?: string ) => api.get<Product[]>(categoryId ? `/products?categoryId=${categoryId}` : '/products'),
    create: ( dto: CreateProductDto ) => api.post<Product>(`/products`, dto),
    update: ( id: string, dto: UpdateProductDto ) => api.patch<Product>(`/products/${id}`, dto),
    delete: ( id: string ) => api.delete<void> (`/products/${id}`),
};