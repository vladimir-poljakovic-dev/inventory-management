interface Field {
  name: string;
  label: string;
  required?: boolean;
  type?: 'text' | 'select';
  options?: { value: string; label: string }[];
}

interface Props {
  title: string;
  fields: Field[];
  values: Record<string, string>;
  loading: boolean;
  error: string;
  onChange: (name: string, value: string) => void;
  onSubmit: (e: React.SubmitEvent) => void;
  onCancel: () => void;
  submitLabel: string;
}

export default function EntityForm({ title, fields, values, loading, error, onChange, onSubmit, onCancel, submitLabel }: Props) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl border border-gray-100">
        <h2 className="mb-5 text-xl font-semibold text-gray-900">{title}</h2>
        {error && <p className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</p>}
        <form onSubmit={onSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="mb-1 block text-sm font-medium text-gray-700">{field.label}</label>
              {field.type === 'select' ? (
                <select
                  required={field.required}
                  value={values[field.name] ?? ''}
                  onChange={(e) => onChange(field.name, e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">Select...</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : (
                <input
                  required={field.required}
                  value={values[field.name] ?? ''}
                  onChange={(e) => onChange(field.name, e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              )}
            </div>
          ))}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onCancel} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 disabled:opacity-50">
              {loading ? 'Saving...' : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}