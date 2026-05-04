import { useState } from "react";

const initialState = { flat: "", building: "", city: "", state: "", pincode: "", is_primary: false };

export default function AddressForm({ onSubmit }) {
  const [form, setForm] = useState(initialState);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(form);
    setForm(initialState);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          ["flat", "Flat No"],
          ["building", "Building"],
          ["city", "City"],
          ["state", "State"],
          ["pincode", "Pincode"],
        ].map(([name, label]) => (
          <label key={name} className="grid gap-1 text-sm font-semibold text-slate-700">
            {label}
            <input
              required
              value={form[name]}
              onChange={(event) => setForm((current) => ({ ...current, [name]: event.target.value }))}
              className="rounded-lg border border-slate-200 px-3 py-2 font-normal outline-none transition focus:border-brand"
            />
          </label>
        ))}
      </div>
      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <input type="checkbox" checked={form.is_primary} onChange={(event) => setForm((current) => ({ ...current, is_primary: event.target.checked }))} />
        Set as primary address
      </label>
      <button className="rounded-lg bg-brand px-4 py-2 font-bold text-white transition hover:bg-ink">Save address</button>
    </form>
  );
}
