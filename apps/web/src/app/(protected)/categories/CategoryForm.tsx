interface Props {
    title: string;
    name: string;
    description: string;
    loading: boolean;
    error:string;
    onChangeName: (v:string) =>void;
    onChangeDescription: (v: string) =>void;
    onSubmit: (e: React.SubmitEvent) =>void;
    onCancel: () =>void;
    submitLabel:string;
}

export default function CategoryForm({title, name, description, loading, error, onCancel, onChangeDescription, onSubmit, onChangeName, submitLabel}: Props){
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-xl font-semibold">{title}</h2>
                {error && <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
                <form onSubmit={onSubmit} className="spave-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium">Name</label>
                        <input required value={name} onChange={(e)=> onChangeName(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-900 focus:outline-none"/>
                    </div>
                    <div>
                        <label className=" mb-1 block text-sm font-medium">Description</label>
                        <input required value={description} onChange={(e)=> onChangeDescription(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-900 focus:outline-none"/>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onCancel} className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100">Cancel</button>
                        <button type="submit" disabled={loading} className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800 disabled:opacity-50">{loading ? 'Saving...':submitLabel}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}


