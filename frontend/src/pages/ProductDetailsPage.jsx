import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import api from "../services/api";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, fetchCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [productResponse, similarResponse] = await Promise.all([api.get(`/products/${id}`), api.get(`/products/${id}/similar`)]);
      setProduct(productResponse.data);
      setSimilar(similarResponse.data);
      setLoading(false);
    };
    load();
    fetchCart();
  }, [id, fetchCart]);

  const handleAdd = async () => {
    await addToCart(product.id, 1);
    showToast("Added to cart");
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6">
        {loading && <LoadingSpinner />}
        {!loading && product && (
          <>
            <Link to="/" className="text-sm font-bold text-brand">Back to products</Link>
            <section className="mt-4 grid gap-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[1fr_1fr]">
              <div className="aspect-square overflow-hidden rounded-lg bg-slate-100">
                <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-sm font-bold uppercase text-brand">{product.category}</p>
                <h1 className="mt-2 text-3xl font-black text-ink md:text-4xl">{product.name}</h1>
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-3xl font-black">${Number(product.price).toFixed(2)}</span>
                  <span className="flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 font-bold text-emerald-700">
                    <Star className="h-4 w-4 fill-current" />
                    {product.rating}
                  </span>
                </div>
                <p className="mt-5 leading-7 text-slate-600">{product.description}</p>
                <button onClick={handleAdd} className="mt-8 flex w-full max-w-sm items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 font-black text-white transition hover:bg-ink">
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </button>
              </div>
            </section>
            <section className="mt-10">
              <h2 className="mb-4 text-2xl font-black text-ink">Similar Products</h2>
              {similar.length > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {similar.map((item) => <ProductCard key={item.id} product={item} />)}
                </div>
              ) : (
                <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-600">No similar products found.</div>
              )}
            </section>
          </>
        )}
      </main>
    </>
  );
}
