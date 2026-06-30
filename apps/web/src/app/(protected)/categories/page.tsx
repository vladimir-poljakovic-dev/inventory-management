'use client';

import { useEffect, useState } from 'react';
import { Category } from '@repo/types';
import { isAdmin } from '@/lib/jwt';
import { useCategories } from './useCategories';
import { useCrudForms } from '@/lib/useCrudForms';
import EntityTable from '@/components/EntityTable';
import EntityForm from '@/components/EntityForm';
import DeleteModal from '@/components/DeleteModal';

const FIELDS = [
  { name: 'name', label: 'Name', required: true },
  { name: 'description', label: 'Description' },
];
const EMPTY = { name: '', description: '' };

export default function CategoriesPage() {
  const [admin, setAdmin] = useState(false);
  const { categories, loading, error, createCategory, updateCategory, deleteCategory } = useCategories();
  const forms = useCrudForms<Category>(EMPTY, createCategory, updateCategory, deleteCategory, (c) => ({ name: c.name, description: c.description ?? '' }));

  useEffect(() => { setAdmin(isAdmin()); }, []);

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Categories</h1>
        {admin && <button onClick={() => forms.setShowCreate(true)} className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800">New Category</button>}
      </div>

      {error && <p className="mb-4 text-sm text-red-700">{error}</p>}
      {loading && <p className="text-gray-500">Loading categories...</p>}
      {!loading && categories.length === 0 && <p className="text-gray-500">No categories yet.</p>}
      {!loading && categories.length > 0 && (
        <EntityTable
          items={categories}
          columns={[
            { header: 'Name', render: (c) => c.name },
            { header: 'Description', render: (c) => c.description ?? '—' },
            { header: 'Created', render: (c) => new Date(c.createdAt).toLocaleDateString() },
          ]}
          admin={admin}
          onEdit={forms.openEdit}
          onDelete={forms.setDeleteId}
        />
      )}

      {forms.showCreate && <EntityForm title="New Category" fields={FIELDS} values={forms.createValues} loading={forms.createLoading} error={forms.createError} onChange={forms.changeCreate} onSubmit={forms.handleCreate} onCancel={() => forms.setShowCreate(false)} submitLabel="Create" />}
      {forms.editItem && <EntityForm title="Edit Category" fields={FIELDS} values={forms.editValues} loading={forms.editLoading} error={forms.editError} onChange={forms.changeEdit} onSubmit={forms.handleEdit} onCancel={() => forms.setEditItem(null)} submitLabel="Save" />}
      {forms.deleteId && <DeleteModal loading={forms.deleteLoading} error={forms.deleteError} onConfirm={forms.handleDelete} onCancel={() => forms.setDeleteId(null)} />}
    </main>
  );
}