'use client';

import { useEffect, useState } from 'react';
import { Supplier } from '@repo/types';
import { isAdmin } from '@/lib/jwt';
import { useSuppliers } from './useSuppliers';
import { useCrudForms } from '@/lib/useCrudForms';
import EntityTable from '@/components/EntityTable';
import EntityForm from '@/components/EntityForm';
import DeleteModal from '@/components/DeleteModal';

const FIELDS = [
  { name: 'name', label: 'Name', required: true },
  { name: 'contactEmail', label: 'Contact Email', required: true },
  { name: 'phone', label: 'Phone' },
  { name: 'address', label: 'Address' },
];
const EMPTY = { name: '', contactEmail: '', phone: '', address: '' };

export default function SuppliersPage() {
  const [admin, setAdmin] = useState(false);
  const { suppliers, loading, error, createSupplier, updateSupplier, deleteSupplier } = useSuppliers();
  const forms = useCrudForms<Supplier>(EMPTY, createSupplier, updateSupplier, deleteSupplier, (s) => ({
    name: s.name,
    contactEmail: s.contactEmail,
    phone: s.phone ?? '',
    address: s.address ?? '',
  }));

  useEffect(() => { setAdmin(isAdmin()); }, []);

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Suppliers</h1>
        {admin && <button onClick={() => forms.setShowCreate(true)} className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800">New Supplier</button>}
      </div>

      {error && <p className="mb-4 text-sm text-red-700">{error}</p>}
      {loading && <p className="text-gray-500">Loading suppliers...</p>}
      {!loading && suppliers.length === 0 && <p className="text-gray-500">No suppliers yet.</p>}
      {!loading && suppliers.length > 0 && (
        <EntityTable
          items={suppliers}
          columns={[
            { header: 'Name', render: (s) => s.name },
            { header: 'Email', render: (s) => s.contactEmail },
            { header: 'Phone', render: (s) => s.phone ?? '—' },
            { header: 'Address', render: (s) => s.address ?? '—' },
          ]}
          admin={admin}
          onEdit={forms.openEdit}
          onDelete={forms.setDeleteId}
        />
      )}

      {forms.showCreate && <EntityForm title="New Supplier" fields={FIELDS} values={forms.createValues} loading={forms.createLoading} error={forms.createError} onChange={forms.changeCreate} onSubmit={forms.handleCreate} onCancel={() => forms.setShowCreate(false)} submitLabel="Create" />}
      {forms.editItem && <EntityForm title="Edit Supplier" fields={FIELDS} values={forms.editValues} loading={forms.editLoading} error={forms.editError} onChange={forms.changeEdit} onSubmit={forms.handleEdit} onCancel={() => forms.setEditItem(null)} submitLabel="Save" />}
      {forms.deleteId && <DeleteModal loading={forms.deleteLoading} error={forms.deleteError} onConfirm={forms.handleDelete} onCancel={() => forms.setDeleteId(null)} />}
    </main>
  );
}