interface Column<T> {
    header: string;
    render: (item: T) => React.ReactNode;
  }
  
  interface Props<T extends { id: string }> {
    items: T[];
    columns: Column<T>[];
    admin: boolean;
    onEdit: (item: T) => void;
    onDelete: (id: string) => void;
  }
  
  export default function EntityTable<T extends { id: string }>({ items, columns, admin, onEdit, onDelete }: Props<T>) {
    return (
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b text-left">
            {columns.map((col) => (
              <th key={col.header} className="py-2 pr-4 font-medium">{col.header}</th>
            ))}
            {admin && <th className="py-2 font-medium">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b hover:bg-gray-50">
              {columns.map((col) => (
                <td key={col.header} className="py-2 pr-4">{col.render(item)}</td>
              ))}
              {admin && (
                <td className="py-2">
                  <div className="flex gap-2">
                    <button onClick={() => onEdit(item)} className="rounded border border-gray-300 px-3 py-1 text-xs hover:bg-gray-100">Edit</button>
                    <button onClick={() => onDelete(item.id)} className="rounded border border-red-300 px-3 py-1 text-xs text-red-600 hover:bg-red-50">Delete</button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }