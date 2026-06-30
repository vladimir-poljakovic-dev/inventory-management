interface Props {
    loading: boolean;
    error: string;
    onConfirm: () => void;
    onCancel: () => void;
  }
  
  export default function DeleteModal({loading, error, onConfirm, onCancel,}: Props) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40">
        <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-2 text-xl font-semibold">Delete Supplier</h2>
          <p className="mb-6 text-gray-600">Are you sure? This cannot be undone.</p>
          {error && (
            <p className="mb-4 text-sm text-red-600">
              {error}
            </p>
          )}
  
          <div className="flex justify-end gap-2">
            <button
              onClick={onCancel}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100">Cancel</button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50">{loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    );
  }