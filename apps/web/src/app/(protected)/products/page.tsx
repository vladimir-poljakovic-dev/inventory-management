'use client';

import { useEffect, useState } from 'react';
import type { Product, Category } from '@repo/types';
import { isAdmin } from '@/lib/jwt';
import { categoriesApi } from '@/lib/categories';
import { useProducts } from './useProducts';
import { useCrudForms } from '@/lib/useCrudForms';
import EntityTable from '@/components/EntityTable';
import EntityForm from '@/components/EntityForm';
import DeleteModal from '@/components/DeleteModal';

const EMPTY = { name: '', sku: '', description: '', price: '', categoryId: '' };

export default function ProductsPage() {
  const [admin, setAdmin] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const { products, loading, error, categoryFilter, setCategoryFilter, createProduct, updateProduct, deleteProduct } = useProducts();
  const forms = useCrudForms<Product>(EMPTY, createProduct, updateProduct, deleteProduct, (p) => ({
    name: p.name,
    sku: p.sku,
    description: p.description ?? '',
    price: String(p.price),
    categoryId: p.category.id,
  }));

  useEffect(() => {
    setAdmin(isAdmin());
    categoriesApi.getAll().then(setCategories).catch(() => {});
  }, []);

  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name }));

  const FIELDS = [
    { name: 'name', label: 'Name', required: true },
    { name: 'sku', label: 'SKU', required: true },
    { name: 'description', label: 'Description(max length is 60 characters.)', maxLength:60},
    { name: 'price', label: 'Price', required: true },
    { name: 'categoryId', label: 'Category', required: true, type: 'select' as const, options: categoryOptions },
  ];

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Products</h1>
        {admin && <button onClick={() => forms.setShowCreate(true)} className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800">New Product</button>}
      </div>

      <div className="mb-4">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {error && <p className="mb-4 text-sm text-red-700">{error}</p>}
      {loading && <p className="text-gray-500">Loading products...</p>}
      {!loading && products.length === 0 && <p className="text-gray-500">No products yet.</p>}
      {!loading && products.length > 0 && (
        <EntityTable
          items={products}
          columns={[
            { header: 'Name', render: (p) => p.name },
            { header: 'SKU', render: (p) => p.sku },
            { header: 'Description', render: (p) => p.description ?? '—' },
            { header: 'Price', render: (p) => `$${p.price}` },
            { header: 'Category', render: (p) => p.category.name },
          ]}
          admin={admin}
          onEdit={forms.openEdit}
          onDelete={forms.setDeleteId}
        />
      )}

      {forms.showCreate && <EntityForm title="New Product" fields={FIELDS} values={forms.createValues} loading={forms.createLoading} error={forms.createError} onChange={forms.changeCreate} onSubmit={forms.handleCreate} onCancel={() => forms.setShowCreate(false)} submitLabel="Create" />}
      {forms.editItem && <EntityForm title="Edit Product" fields={FIELDS} values={forms.editValues} loading={forms.editLoading} error={forms.editError} onChange={forms.changeEdit} onSubmit={forms.handleEdit} onCancel={() => forms.setEditItem(null)} submitLabel="Save" />}
      {forms.deleteId && <DeleteModal loading={forms.deleteLoading} error={forms.deleteError} onConfirm={forms.handleDelete} onCancel={() => forms.setDeleteId(null)} />}
    </main>
  );
}