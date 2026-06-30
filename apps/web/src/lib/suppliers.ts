import { type Supplier, CreateSupplierDto, UpdateSupplierDto } from "@repo/types";
import api from "./api";

export const suppliersApi = {
    getAll: () => api.get<Supplier[]>("/suppliers"),
    getOne: (id: string) => api.get(`/suppliers/${id}`),
    create: (dto: CreateSupplierDto) => api.post("/suppliers", dto),
    update: (id: string, dto: UpdateSupplierDto) => api.patch(`/suppliers/${id}`, dto),
    delete: (id: string) => api.delete(`/suppliers/${id}`),
};