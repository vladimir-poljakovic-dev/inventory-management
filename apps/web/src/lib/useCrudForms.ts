import { useState } from 'react';
import { getApiErrorMessage } from '@/lib/api';

export function useCrudForms<T extends { id: string }>(
  emptyValues: Record<string, string>,
  onCreate: (values: Record<string, string>) => Promise<void>,
  onUpdate: (id: string, values: Record<string, string>) => Promise<void>,
  onDelete: (id: string) => Promise<void>,
  toFormValues: (item: T) => Record<string, string>,
) {
  const [showCreate, setShowCreate] = useState(false);
  const [createValues, setCreateValues] = useState(emptyValues);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');

  const [editItem, setEditItem] = useState<T | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>(emptyValues);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  function changeCreate(name: string, value: string) {
    setCreateValues((prev) => ({ ...prev, [name]: value }));
  }

  function changeEdit(name: string, value: string) {
    setEditValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleCreate(e: React.SubmitEvent) {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError('');
    try {
      await onCreate(createValues);
      setCreateValues(emptyValues);
      setShowCreate(false);
    } catch (err) {
      setCreateError(getApiErrorMessage(err));
    } finally {
      setCreateLoading(false);
    }
  }

  function openEdit(item: T) {
    setEditItem(item);
    setEditValues(toFormValues(item));
    setEditError('');
  }

  async function handleEdit(e: React.SubmitEvent) {
    e.preventDefault();
    if (!editItem) return;
    setEditLoading(true);
    setEditError('');
    try {
      await onUpdate(editItem.id, editValues);
      setEditItem(null);
    } catch (err) {
      setEditError(getApiErrorMessage(err));
    } finally {
      setEditLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleteLoading(true);
    setDeleteError('');
    try {
      await onDelete(deleteId);
      setDeleteId(null);
    } catch (err) {
      setDeleteError(getApiErrorMessage(err));
    } finally {
      setDeleteLoading(false);
    }
  }
  return {
    showCreate, setShowCreate, createValues, changeCreate, createLoading, createError, handleCreate,
    editItem, setEditItem, editValues, changeEdit, editLoading, editError, openEdit, handleEdit,
    deleteId, setDeleteId, deleteLoading, deleteError, handleDelete,
  };
}