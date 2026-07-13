import type { StockItem } from '@repo/types';

interface Props {
  stock: StockItem[];
}

export default function StockTable({ stock }: Props) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b text-left">
          <th className="py-2 pr-4 font-medium">Product</th>
          <th className="py-2 pr-4 font-medium">SKU</th>
          <th className="py-2 pr-4 font-medium">Warehouse</th>
          <th className="py-2 pr-4 font-medium">Quantity</th>
          <th className="py-2 pr-4 font-medium">Threshold</th>
        </tr>
      </thead>
      <tbody>
        {stock.map((s) => {
          const isLow = s.quantity < s.lowStockThreshold;
          return (
            <tr key={s.id} className={`border-b ${isLow ? 'bg-red-50' : 'hover:bg-gray-50'}`}>
              <td className={`py-2 pr-4 ${isLow ? 'font-medium text-red-700' : ''}`}>{s.product.name}</td>
              <td className={`py-2 pr-4 ${isLow ? 'text-red-700' : 'text-gray-500'}`}>{s.product.sku}</td>
              <td className={`py-2 pr-4 ${isLow ? 'text-red-700' : ''}`}>{s.warehouse.name}</td>
              <td className={`py-2 pr-4 font-semibold ${isLow ? 'text-red-700' : ''}`}>{s.quantity}</td>
              <td className={`py-2 pr-4 ${isLow ? 'text-red-700' : 'text-gray-500'}`}>{s.lowStockThreshold}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}