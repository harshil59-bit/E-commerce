import { ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAdd = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    await addToCart(product.id, 1);
    showToast("Added to cart");
  };

  return (
    <Link to={`/products/${product.id}`} className="group rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <div className="aspect-[4/3] overflow-hidden rounded-t-lg bg-slate-100">
        <img src={product.image_url} alt={product.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
      </div>
      <div className="space-y-3 p-4">
        <div>
          <p className="text-xs font-semibold uppercase text-brand">{product.category}</p>
          <h3 className="line-clamp-2 min-h-12 text-base font-bold text-ink">{product.name}</h3>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-black">${Number(product.price).toFixed(2)}</span>
          <span className="flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-sm font-semibold text-emerald-700">
            <Star className="h-4 w-4 fill-current" />
            {product.rating}
          </span>
        </div>
        <button onClick={handleAdd} className="flex w-full items-center justify-center gap-2 rounded-lg bg-ink px-4 py-2 text-sm font-bold text-white transition hover:bg-brand">
          <ShoppingCart className="h-4 w-4" />
          Add to cart
        </button>
      </div>
    </Link>
  );
}
