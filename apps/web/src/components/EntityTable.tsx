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
    <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm overflow-x-auto">
      <table className="w-full min-w-[500px] border-collapse text-sm">
        <thead>
          <tr className="bg-gray-900 text-left text-white">
            {columns.map((col) => (
              <th key={col.header} className="px-4 py-3 font-medium">{col.header}</th>
            ))}
            {admin && <th className="px-4 py-3 font-medium">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={item.id} className={`border-t border-gray-100 hover:bg-indigo-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
              {columns.map((col) => (
                <td key={col.header} className="px-4 py-3 text-gray-700">{col.render(item)}</td>
              ))}
              {admin && (
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => onEdit(item)} className="rounded border border-indigo-300 px-3 py-1 text-xs text-indigo-600 hover:bg-indigo-50">Edit</button>
                    <button onClick={() => onDelete(item.id)} className="rounded border border-red-300 px-3 py-1 text-xs text-red-600 hover:bg-red-50">Delete</button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}