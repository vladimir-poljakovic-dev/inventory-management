"use client";

import { useEffect, useState } from "react";
import { isAdmin } from "@/lib/jwt";
import { useSuppliers } from "./useSuppliers";
import { useSupplierForms } from "./useSupplierForms";
import SupplierTable from "./SupplierTable";
import SupplierForm from "./SupplierForm";
import DeleteModal from "./DeleteModal";

export default function SuppliersPage() {
  const [admin, setAdmin] = useState(false);
  const {suppliers, loading, error, createSupplier, updateSupplier, deleteSupplier,} = useSuppliers();
  const forms = useSupplierForms( createSupplier, updateSupplier, deleteSupplier );

  useEffect(() => { setAdmin(isAdmin());}, []);

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Suppliers</h1>
        {admin && (
          <button
            onClick={() => forms.setShowCreate(true)} className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800"> New Supplier</button>)}
      </div>
      {error && <p className="mb-4 text-sm text-red-700">{error}</p>}
      {loading && <p className="text-gray-500">Loading suppliers...</p>}
      {!loading && suppliers.length === 0 && (<p className="text-gray-500">No suppliers yet.</p>)}
      {!loading && suppliers.length > 0 && ( <SupplierTable suppliers={suppliers} admin={admin} onEdit={forms.openEdit} onDelete={forms.setDeleteId}/>)}

      {forms.showCreate && (
        <SupplierForm title="New Supplier"
          name={forms.createName}
          contactEmail={forms.createEmail}
          phone={forms.createPhone}
          address={forms.createAddress}
          loading={forms.createLoading}
          error={forms.createError}
          onChangeName={forms.setCreateName}
          onChangeEmail={forms.setCreateEmail}
          onChangePhone={forms.setCreatePhone}
          onChangeAddress={forms.setCreateAddress}
          onSubmit={forms.handleCreate}
          onCancel={() => forms.setShowCreate(false)}
          submitLabel="Create"
        />
      )}

      {forms.editSupplier && (
        <SupplierForm
          title="Edit Supplier"
          name={forms.editName}
          contactEmail={forms.editEmail}
          phone={forms.editPhone}
          address={forms.editAddress}
          loading={forms.editLoading}
          error={forms.editError}
          onChangeName={forms.setEditName}
          onChangeEmail={forms.setEditEmail}
          onChangePhone={forms.setEditPhone}
          onChangeAddress={forms.setEditAddress}
          onSubmit={forms.handleEdit}
          onCancel={() => forms.setEditSupplier(null)}
          submitLabel="Save"
        />
      )}

      {forms.deleteId && (
        <DeleteModal
          loading={forms.deleteLoading}
          error={forms.deleteError}
          onConfirm={forms.handleDelete}
          onCancel={() => forms.setDeleteId(null)}
        />
      )}
    </main>
  );
}