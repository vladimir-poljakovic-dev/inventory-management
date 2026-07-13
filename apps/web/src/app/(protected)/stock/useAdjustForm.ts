import { useState } from 'react';
import { getApiErrorMessage } from '@/lib/api';
import { stockApi } from '@/lib/stock';

export function useAdjustForm(onSuccess: () => void) {
  const [productId, setProductId] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [quantityDelta, setQuantityDelta] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [show, setShow] = useState(false);

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await stockApi.adjust({
        productId,
        warehouseId,
        quantityDelta: parseInt(quantityDelta),
        reason,
      });
      setProductId('');
      setWarehouseId('');
      setQuantityDelta('');
      setReason('');
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
    productId, setProductId,
    warehouseId, setWarehouseId,
    quantityDelta, setQuantityDelta,
    reason, setReason,
    loading, error,
    handleSubmit,
  };
}