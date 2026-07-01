import { useEffect, useState } from 'react';
import { getApiErrorMessage } from '@/lib/api';
import { suppliersApi } from '@/lib/suppliers';
import { type Supplier, CreateSupplierDto, UpdateSupplierDto } from '@repo/types';

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchSuppliers(); }, []);

  async function fetchSuppliers() {
    setLoading(true);
    setError('');
    try {
      setSuppliers(await suppliersApi.getAll());
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function createSupplier(values: Record<string, string>) {
    const dto: CreateSupplierDto = {
      name: values.name,
      contactEmail: values.contactEmail,
      phone: values.phone || undefined,
      address: values.address || undefined,
    };
    await suppliersApi.create(dto);
    fetchSuppliers();
  }

  async function updateSupplier(id: string, values: Record<string, string>) {
    const dto: UpdateSupplierDto = {
      name: values.name,
      contactEmail: values.contactEmail,
      phone: values.phone || undefined,
      address: values.address || undefined,
    };
    await suppliersApi.update(id, dto);
    fetchSuppliers();
  }

  async function deleteSupplier(id: string) {
    await suppliersApi.delete(id);
    fetchSuppliers();
  }

  return { suppliers, loading, error, createSupplier, updateSupplier, deleteSupplier };
}