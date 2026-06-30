import { useEffect, useState } from "react";
import { getApiErrorMessage } from "@/lib/api";
import { suppliersApi } from "@/lib/suppliers";
import { type Supplier, CreateSupplierDto, UpdateSupplierDto } from "@repo/types";

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSuppliers();
  }, []);

  async function fetchSuppliers() {
    setLoading(true);
    setError("");

    try {
      const data = await suppliersApi.getAll();
      setSuppliers(data);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function createSupplier(dto: CreateSupplierDto) {
    await suppliersApi.create(dto);
    fetchSuppliers();
  }

  async function updateSupplier(id: string, dto: UpdateSupplierDto) {
    await suppliersApi.update(id, dto);
    fetchSuppliers();
  }

  async function deleteSupplier(id: string) {
    await suppliersApi.delete(id);
    fetchSuppliers();
  }

  return {
    suppliers,
    loading,
    error,
    createSupplier,
    updateSupplier,
    deleteSupplier,
  };
}