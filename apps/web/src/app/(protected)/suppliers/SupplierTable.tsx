import { type Supplier } from "@repo/types";

interface Props {
  suppliers: Supplier[];
  admin: boolean;
  onEdit: (supplier: Supplier) => void;
  onDelete: (id: string) => void;
}

export default function SupplierTable({
  suppliers,
  admin,
  onEdit,
  onDelete,
}: Props) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b text-left">
          <th className="py-2 pr-4 font-medium">Name</th>
          <th className="py-2 pr-4 font-medium">Email</th>
          <th className="py-2 pr-4 font-medium">Phone</th>
          <th className="py-2 pr-4 font-medium">Address</th>
          <th className="py-2 pr-4 font-medium">Created</th>
          {admin && <th className="py-2 font-medium">Actions</th>}
        </tr>
      </thead>

      <tbody>
        {suppliers.map((supplier) => (
          <tr key={supplier.id} className="border-b hover:bg-gray-50">
            <td className="py-2 pr-4">{supplier.name}</td>

            <td className="py-2 pr-4 text-gray-500">
              {supplier.contactEmail}
            </td>

            <td className="py-2 pr-4 text-gray-500">
              {supplier.phone ?? "-"}
            </td>

            <td className="py-2 pr-4 text-gray-500">
              {supplier.address ?? "-"}
            </td>

            <td className="py-2 pr-4 text-gray-500">
              {new Date(supplier.createdAt).toLocaleDateString()}
            </td>

            {admin && (
              <td className="py-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(supplier)}
                    className="rounded border border-gray-300 px-3 py-1 text-xs hover:bg-gray-100"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(supplier.id)}
                    className="rounded border border-red-300 px-3 py-1 text-xs text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}