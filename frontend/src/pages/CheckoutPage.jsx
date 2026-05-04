import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, MapPin } from "lucide-react";
import AddressForm from "../components/AddressForm";
import LoadingSpinner from "../components/LoadingSpinner";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import api from "../services/api";

const getErrorMessage = (error, fallback) => error.response?.data?.detail || fallback;

export default function CheckoutPage() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const { cart, fetchCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const primaryAddress = useMemo(() => addresses.find((address) => address.is_primary), [addresses]);

  const loadAddresses = async () => {
    const { data } = await api.get("/address");
    setAddresses(data);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchCart(), loadAddresses()]);
      setLoading(false);
    };
    load();
  }, [fetchCart]);

  const addAddress = async (payload) => {
    const { data } = await api.post("/address", payload);
    setAddresses((current) => [data, ...current.filter((item) => item.id !== data.id)]);
    await loadAddresses();
    showToast("Address saved");
  };

  const selectPrimary = async (addressId) => {
    const { data } = await api.put("/address/select-primary", { address_id: addressId });
    setAddresses(data);
  };

  const confirmOrder = async () => {
    setPlacing(true);
    try {
      const { data } = await api.post("/orders");
      await fetchCart();
      showToast("Order confirmed");
      navigate(`/orders/${data.id}`);
    } catch (error) {
      showToast(getErrorMessage(error, "Checkout failed"), "error");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="mb-5 text-3xl font-black text-ink">Checkout</h1>
        {loading && <LoadingSpinner />}
        {!loading && (
          <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
            <section className="grid gap-5">
              <AddressForm onSubmit={addAddress} />
              <div className="grid gap-3">
                {addresses.map((address) => (
                  <button
                    key={address.id}
                    onClick={() => selectPrimary(address.id)}
                    className={`flex items-start gap-3 rounded-lg border bg-white p-4 text-left shadow-sm transition hover:border-brand ${address.is_primary ? "border-brand" : "border-slate-200"}`}
                  >
                    <MapPin className="mt-1 h-5 w-5 text-brand" />
                    <span className="flex-1">
                      <span className="block font-bold text-ink">{address.flat}, {address.building}</span>
                      <span className="block text-sm text-slate-600">{address.city}, {address.state} - {address.pincode}</span>
                    </span>
                    {address.is_primary && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            </section>
            <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black text-ink">Confirm Order</h2>
              <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                {primaryAddress ? `${primaryAddress.flat}, ${primaryAddress.building}, ${primaryAddress.city}, ${primaryAddress.state} - ${primaryAddress.pincode}` : "No primary address selected"}
              </div>
              <div className="mt-4 flex justify-between border-t border-slate-200 pt-4 text-lg font-black">
                <span>Total</span>
                <span>${Number(cart.total_price).toFixed(2)}</span>
              </div>
              <button disabled={!primaryAddress || cart.items.length === 0 || placing} onClick={confirmOrder} className="mt-5 w-full rounded-lg bg-accent px-4 py-3 font-black text-white transition hover:bg-ink disabled:opacity-50">
                {placing ? "Placing..." : "Confirm Order"}
              </button>
            </aside>
          </div>
        )}
      </main>
    </>
  );
}
