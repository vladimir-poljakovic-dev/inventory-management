'use client';

import { useEffect, useState } from 'react';
import type { WareHouse } from '@repo/types';
import { isAdmin } from '@/lib/jwt';
import { useWarehouses } from './useWarehouses';
import { useCrudForms } from '@/lib/useCrudForms';
import EntityTable from '@/components/EntityTable';
import EntityForm from '@/components/EntityForm';
import DeleteModal from '@/components/DeleteModal';

const FIELDS = [
  { name: 'name', label: 'Name', required: true },
  { name: 'location', label: 'Location', required: true },
  { name: 'description', label: 'Description(max length is 60 characters.)', maxLength:60},
];
const EMPTY = { name: '', location: '', description: '' };

export default function WarehousesPage() {
  const [admin, setAdmin] = useState(false);
  const { warehouses, loading, error, createWarehouse, updateWarehouse, deleteWarehouse } = useWarehouses();
  const forms = useCrudForms<WareHouse>(EMPTY, createWarehouse, updateWarehouse, deleteWarehouse, (w) => ({ name: w.name, location: w.location, description: w.description ?? '' }));

  useEffect(() => { setAdmin(isAdmin()); }, []);

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Warehouses</h1>
        {admin && <button onClick={() => forms.setShowCreate(true)} className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800">New Warehouse</button>}
      </div>

      {error && <p className="mb-4 text-sm text-red-700">{error}</p>}
      {loading && <p className="text-gray-500">Loading warehouses...</p>}
      {!loading && warehouses.length === 0 && <p className="text-gray-500">No warehouses yet.</p>}
      {!loading && warehouses.length > 0 && (
        <EntityTable
          items={warehouses}
          columns={[
            { header: 'Name', render: (w) => w.name },
            { header: 'Location', render: (w) => w.location },
            { header: 'Description', render: (w) => w.description ?? '—' },
          ]}
          admin={admin}
          onEdit={forms.openEdit}
          onDelete={forms.setDeleteId}
        />
      )}

      {forms.showCreate && <EntityForm title="New Warehouse" fields={FIELDS} values={forms.createValues} loading={forms.createLoading} error={forms.createError} onChange={forms.changeCreate} onSubmit={forms.handleCreate} onCancel={() => forms.setShowCreate(false)} submitLabel="Create" />}
      {forms.editItem && <EntityForm title="Edit Warehouse" fields={FIELDS} values={forms.editValues} loading={forms.editLoading} error={forms.editError} onChange={forms.changeEdit} onSubmit={forms.handleEdit} onCancel={() => forms.setEditItem(null)} submitLabel="Save" />}
      {forms.deleteId && <DeleteModal loading={forms.deleteLoading} error={forms.deleteError} onConfirm={forms.handleDelete} onCancel={() => forms.setDeleteId(null)} />}    </main>
  );
}