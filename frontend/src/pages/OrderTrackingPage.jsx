import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, Circle } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import Navbar from "../components/Navbar";
import api from "../services/api";

const statuses = ["Processing", "Dispatched", "Out for Delivery", "Delivered"];

export default function OrderTrackingPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data);
      setLoading(false);
    };
    load();
  }, [id]);

  const activeIndex = useMemo(() => (order ? statuses.indexOf(order.status) : 0), [order]);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-6">
        {loading && <LoadingSpinner />}
        {!loading && order && (
          <>
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black text-ink">Order #{order.id}</h1>
                <p className="text-sm text-slate-600">Placed {new Date(order.created_at).toLocaleString()}</p>
              </div>
              <Link to="/" className="rounded-lg bg-brand px-4 py-2 font-bold text-white">Continue Shopping</Link>
            </div>
            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="grid gap-4 md:grid-cols-4">
                {statuses.map((status, index) => {
                  const done = index <= activeIndex;
                  const Icon = done ? CheckCircle2 : Circle;
                  return (
                    <div key={status} className="flex items-center gap-3 rounded-lg bg-slate-50 p-4">
                      <Icon className={done ? "h-6 w-6 text-emerald-600" : "h-6 w-6 text-slate-400"} />
                      <span className={done ? "font-black text-ink" : "font-semibold text-slate-500"}>{status}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 border-t border-slate-200 pt-5">
                <h2 className="mb-3 text-xl font-black text-ink">Items</h2>
                <div className="grid gap-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                      <span className="font-semibold">{item.product.name} x {item.quantity}</span>
                      <span className="font-black">${Number(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-between text-xl font-black">
                  <span>Total</span>
                  <span>${Number(order.total_price).toFixed(2)}</span>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </>
  );
}
