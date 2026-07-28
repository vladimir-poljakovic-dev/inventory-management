import type { StockItem } from '@repo/types';

interface Props {
  stock: StockItem[];
}

export default function StockTable({ stock }: Props) {
  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm overflow-x-auto">
      <table className="w-full min-w-[500px] border-collapse text-sm">
        <thead>
          <tr className="bg-gray-900 text-left text-white">
            <th className="px-4 py-3 font-medium">Product</th>
            <th className="px-4 py-3 font-medium">SKU</th>
            <th className="px-4 py-3 font-medium">Warehouse</th>
            <th className="px-4 py-3 font-medium">Quantity</th>
            <th className="px-4 py-3 font-medium">Threshold</th>
          </tr>
        </thead>
        <tbody>
          {stock.map((s, i) => {
            const isLow = s.quantity < s.lowStockThreshold;
            return (
              <tr key={s.id} className={`border-t border-gray-100 transition-colors ${isLow ? 'bg-red-50 hover:bg-red-100' : i % 2 === 0 ? 'bg-white hover:bg-indigo-50' : 'bg-gray-50 hover:bg-indigo-50'}`}>
                <td className={`px-4 py-3 ${isLow ? 'font-medium text-red-700' : 'text-gray-700'}`}>{s.product.name}</td>
                <td className={`px-4 py-3 ${isLow ? 'text-red-600' : 'text-gray-500'}`}>{s.product.sku}</td>
                <td className={`px-4 py-3 ${isLow ? 'text-red-600' : 'text-gray-700'}`}>{s.warehouse.name}</td>
                <td className={`px-4 py-3 font-semibold ${isLow ? 'text-red-700' : 'text-gray-700'}`}>{s.quantity}</td>
                <td className={`px-4 py-3 ${isLow ? 'text-red-600' : 'text-gray-500'}`}>{s.lowStockThreshold}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}