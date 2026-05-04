import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useEffect } from "react";
import CartItem from "../components/CartItem";
import LoadingSpinner from "../components/LoadingSpinner";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

export default function CartPage() {
  const { cart, loading, fetchCart, updateCart, removeFromCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleRemove = async (productId) => {
    await removeFromCart(productId);
    showToast("Item removed");
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="mb-5 text-3xl font-black text-ink">Your Cart</h1>
        {loading && <LoadingSpinner />}
        {!loading && cart.items.length === 0 && (
          <div className="grid place-items-center rounded-lg border border-slate-200 bg-white p-10 text-center shadow-sm">
            <ShoppingBag className="mb-3 h-12 w-12 text-slate-400" />
            <h2 className="text-xl font-black text-ink">Your cart is empty</h2>
            <p className="mt-1 text-slate-600">Add products from the dashboard to start checkout.</p>
            <Link to="/" className="mt-5 rounded-lg bg-brand px-5 py-2 font-bold text-white">Shop products</Link>
          </div>
        )}
        {!loading && cart.items.length > 0 && (
          <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
            <section className="grid gap-4">
              {cart.items.map((item) => <CartItem key={item.id} item={item} onUpdate={updateCart} onRemove={handleRemove} />)}
            </section>
            <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black text-ink">Order Summary</h2>
              <div className="mt-4 flex justify-between border-t border-slate-200 pt-4 text-lg font-black">
                <span>Total</span>
                <span>${Number(cart.total_price).toFixed(2)}</span>
              </div>
              <button onClick={() => navigate("/checkout")} className="mt-5 w-full rounded-lg bg-accent px-4 py-3 font-black text-white transition hover:bg-ink">Proceed to Checkout</button>
            </aside>
          </div>
        )}
      </main>
    </>
  );
}
