import { Minus, Plus, Trash2 } from "lucide-react";

export default function CartItem({ item, onUpdate, onRemove }) {
  return (
    <div className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[120px_1fr_auto]">
      <img src={item.product.image_url} alt={item.product.name} className="h-28 w-full rounded-md object-cover sm:w-28" />
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase text-brand">{item.product.category}</p>
        <h3 className="font-bold text-ink">{item.product.name}</h3>
        <p className="text-sm text-slate-600">${Number(item.product.price).toFixed(2)} each</p>
        <div className="flex items-center gap-2">
          <button className="rounded-md border p-2 transition hover:bg-slate-50" onClick={() => onUpdate(item.product.id, Math.max(1, item.quantity - 1))} title="Decrease">
            <Minus className="h-4 w-4" />
          </button>
          <span className="grid h-9 w-10 place-items-center rounded-md bg-slate-100 text-sm font-bold">{item.quantity}</span>
          <button className="rounded-md border p-2 transition hover:bg-slate-50" onClick={() => onUpdate(item.product.id, item.quantity + 1)} title="Increase">
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
        <p className="text-lg font-black">${Number(item.line_total).toFixed(2)}</p>
        <button onClick={() => onRemove(item.product.id)} className="rounded-md p-2 text-red-600 transition hover:bg-red-50" title="Remove">
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
