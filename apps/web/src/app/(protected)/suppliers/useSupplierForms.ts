import { useState } from "react";
import { getApiErrorMessage } from "@/lib/api";
import { type Supplier, CreateSupplierDto, UpdateSupplierDto } from "@repo/types";

export function useSupplierForms(
  onCreate: (dto: CreateSupplierDto) => Promise<void>,
  onUpdate: (id: string, dto: UpdateSupplierDto) => Promise<void>,
  onDelete: (id: string) => Promise<void>
) {
  // Create
  const [showCreate, setShowCreate] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPhone, setCreatePhone] = useState("");
  const [createAddress, setCreateAddress] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  // Edit
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  // Delete
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Create
  async function handleCreate(e: React.SubmitEvent) {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError("");

    try {
      await onCreate({
        name: createName,
        contactEmail: createEmail,
        phone: createPhone || undefined,
        address: createAddress || undefined,
      });

      setCreateName("");
      setCreateEmail("");
      setCreatePhone("");
      setCreateAddress("");
      setShowCreate(false);
    } catch (err) {
      setCreateError(getApiErrorMessage(err));
    } finally {
      setCreateLoading(false);
    }
  }

  // Open Edit
  function openEdit(supplier: Supplier) {
    setEditSupplier(supplier);
    setEditName(supplier.name);
    setEditEmail(supplier.contactEmail);
    setEditPhone(supplier.phone ?? "");
    setEditAddress(supplier.address ?? "");
    setEditError("");
  }

  // Edit
  async function handleEdit(e: React.SubmitEvent) {
    e.preventDefault();
    if (!editSupplier) return;

    setEditLoading(true);
    setEditError("");

    try {
      await onUpdate(editSupplier.id, {
        name: editName,
        contactEmail: editEmail,
        phone: editPhone || undefined,
        address: editAddress || undefined,
      });

      setEditSupplier(null);
    } catch (err) {
      setEditError(getApiErrorMessage(err));
    } finally {
      setEditLoading(false);
    }
  }

  //Delete
  async function handleDelete() {
    if (!deleteId) return;

    setDeleteLoading(true);
    setDeleteError("");

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
    // Create
    showCreate, setShowCreate,
    createName, setCreateName,
    createEmail, setCreateEmail,
    createPhone, setCreatePhone,
    createAddress, setCreateAddress,
    createLoading,
    createError,
    handleCreate,

    // Edit
    editSupplier, setEditSupplier,
    editName, setEditName,
    editEmail, setEditEmail,
    editPhone, setEditPhone,
    editAddress, setEditAddress,
    editLoading,
    editError,
    openEdit,
    handleEdit,

    // Delete
    deleteId, setDeleteId,
    deleteLoading,
    deleteError,
    handleDelete,
  };
}