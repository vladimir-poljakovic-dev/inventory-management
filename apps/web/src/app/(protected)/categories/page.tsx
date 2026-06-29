'use client';

import { useEffect, useState } from 'react';
import { isAdmin } from '@/lib/jwt';
import { useCategories } from './useCategories';
import { useCategoryForms } from './useCategoryForms';
import CategoryTable from './CategoryTable';
import CategoryForm from './CategoryForm';
import DeleteModal from './DeleteModal';

export default function CategoriesPage() {
  const [admin, setAdmin] = useState(false);
  const { categories, loading, error, createCategory, updateCategory, deleteCategory } = useCategories();
  const forms = useCategoryForms(createCategory, updateCategory, deleteCategory);

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
      {!loading && categories.length > 0 && <CategoryTable categories={categories} admin={admin} onEdit={forms.openEdit} onDelete={forms.setDeleteId} />}

      {forms.showCreate && <CategoryForm title="New Category" name={forms.createName} description={forms.createDescription} loading={forms.createLoading} error={forms.createError} onChangeName={forms.setCreateName} onChangeDescription={forms.setCreateDescription} onSubmit={forms.handleCreate} onCancel={() => forms.setShowCreate(false)} submitLabel="Create" />}
      {forms.editCategory && <CategoryForm title="Edit Category" name={forms.editName} description={forms.editDescription} loading={forms.editLoading} error={forms.editError} onChangeName={forms.setEditName} onChangeDescription={forms.setEditDescription} onSubmit={forms.handleEdit} onCancel={() => forms.setEditCategory(null)} submitLabel="Save" />}
      {forms.deleteId && <DeleteModal loading={forms.deleteLoading} onConfirm={forms.handleDelete} onCancel={() => forms.setDeleteId(null)} />}

    </main>
  );
}