interface Props {
 loading: boolean;
  error?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteModal({ loading, error, onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl border border-gray-100">
        <h2 className="mb-2 text-xl font-semibold text-gray-900">Confirm Delete</h2>
        <p className="mb-4 text-sm text-gray-500">Are you sure? This cannot be undone.</p>
        {error && <p className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</p>}
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50">
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}