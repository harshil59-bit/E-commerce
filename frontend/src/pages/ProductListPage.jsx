import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";
import ProductCard from "../components/ProductCard";
import api from "../services/api";
import { useCart } from "../context/CartContext";

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { fetchCart } = useCart();
  const pageSize = 8;

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await api.get("/products", { params: { search, category: category || undefined, page, page_size: pageSize } });
        setProducts(data.items);
        setCategories(data.categories);
        setTotal(data.total);
      } catch (err) {
        setError(err.response?.data?.detail || "Unable to load products");
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(timeout);
  }, [search, category, page]);

  const pages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total]);

  return (
    <>
      <Navbar search={search} setSearch={(value) => { setSearch(value); setPage(1); }} />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <section className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-black text-ink">Shop CartLabs</h1>
            <p className="mt-1 text-sm text-slate-600">Curated products across tech, home, fashion, travel, and kitchen.</p>
          </div>
          <select value={category} onChange={(event) => { setCategory(event.target.value); setPage(1); }} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-brand">
            <option value="">All categories</option>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </section>

        {loading && <LoadingSpinner />}
        {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>}
        {!loading && !error && products.length === 0 && <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">No products match your search.</div>}
        {!loading && !error && products.length > 0 && (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
            <div className="mt-8 flex items-center justify-center gap-3">
              <button disabled={page === 1} onClick={() => setPage((value) => value - 1)} className="rounded-lg border border-slate-200 bg-white px-4 py-2 font-semibold disabled:opacity-40">Previous</button>
              <span className="text-sm font-bold text-slate-600">Page {page} of {pages}</span>
              <button disabled={page === pages} onClick={() => setPage((value) => value + 1)} className="rounded-lg border border-slate-200 bg-white px-4 py-2 font-semibold disabled:opacity-40">Next</button>
            </div>
          </>
        )}
      </main>
    </>
  );
}
