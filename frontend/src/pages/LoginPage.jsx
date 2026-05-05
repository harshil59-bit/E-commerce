import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const getErrorMessage = (error, fallback) =>
  error.response?.data?.detail || fallback;

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await login(form);

      showToast("Welcome back to CartLabs");

      // 🔥 IMPORTANT FIX (wait for state update)
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 0);

    } catch (error) {
      showToast(getErrorMessage(error, "Login failed"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-soft"
      >
        <div className="mb-6">
          <h1 className="text-3xl font-black text-ink">CartLabs</h1>
          <p className="mt-1 text-sm text-slate-600">
            Sign in to shop products, carts, and orders.
          </p>
        </div>

        <div className="grid gap-4">
          <label className="grid gap-1 text-sm font-semibold">
            Email
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-brand"
            />
          </label>

          <label className="grid gap-1 text-sm font-semibold">
            Password
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-brand"
            />
          </label>

          <button
            disabled={loading}
            className="rounded-lg bg-brand px-4 py-3 font-bold text-white transition hover:bg-ink disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </div>

        <p className="mt-5 text-center text-sm text-slate-600">
          New to CartLabs?{" "}
          <Link className="font-bold text-brand" to="/register">
            Create account
          </Link>
        </p>
      </form>
    </main>
  );
}