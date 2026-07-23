import { useState } from 'react';
import type { CreatePurchaseOrderDto } from '@repo/types';
import { getApiErrorMessage } from '@/lib/api';
import { purchaseOrdersApi, type LineItem } from '@/lib/purchase-orders';

export function useCreateOrder(onSuccess: () => void) {
  const [show, setShow] = useState(false);
  const [supplierId, setSupplierId] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<LineItem[]>([{ productId: '', quantity: '', unitPrice: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function addItem() {
    setItems([...items, { productId: '', quantity: '', unitPrice: '' }]);
  }

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof LineItem, value: string) {
    setItems(items.map((item, i) => i === index ? { ...item, [field]: value } : item));
  }

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const dto: CreatePurchaseOrderDto = {
        supplierId,
        notes: notes || undefined,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: parseInt(item.quantity, 10),
          unitPrice: parseFloat(item.unitPrice),
        })),
      };
      await purchaseOrdersApi.create(dto);
      setSupplierId('');
      setNotes('');
      setItems([{ productId: '', quantity: '', unitPrice: '' }]);
      setShow(false);
      onSuccess();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return {
    show, setShow,
    supplierId, setSupplierId,
    notes, setNotes,
    items, addItem, removeItem, updateItem,
    loading, error,
    handleSubmit,
  };
}