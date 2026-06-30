import { type Category } from "@repo/types";

interface Props {
    categories: Category[];
    admin: boolean;
    onEdit: (cat: Category) =>void;
    onDelete: (id: string) =>void;
}

export default function CategoryTable ({categories, admin, onEdit, onDelete}: Props){
    return (
        <table className="w-full border-collapse text-sm">
            <thead>
                <tr className="border-b text-left">
                    <th className="py-2 pr-4 font-medium">Name</th>
                    <th className="py-2 pr-4 font-medium">Description</th>
                    <th className="py-2 pr-4 font-medium">Created</th>
                    {admin &&<th className="py-2 font-medium">Actions</th>}
                </tr>
            </thead>
            <tbody>
                {categories.map((cat) =>(
                    <tr key={cat.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 pr-4">{cat.name}</td>
                        <td className="py-2 pr-4 text-gray-500">{cat.description}</td>
                        <td className="py-2 pr-4 text-gray-500">{new Date(cat.createdAt).toLocaleDateString()}</td>
                        {admin && (
                            <td className="py-2">
                                <div className="flex gap-2">
                                    <button onClick={()=>onEdit(cat)}className="rounded border border-gray-300 px-3 py-1 text-xs hover:bg-gray-100">Edit</button>
                                    <button onClick={()=>onDelete(cat.id)}className="rounded border border-red-300 px-3 py-1 text-xs text-red-600 hover:bg-red-50">Delete</button>
                                </div>
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}