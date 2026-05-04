import { LogOut, Search, ShoppingCart, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar({ search, setSearch }) {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center">
        <Link to="/" className="flex items-center gap-2 text-2xl font-black tracking-normal text-ink">
          <span className="rounded-md bg-brand px-2 py-1 text-white">Cart</span>
          <span>Labs</span>
        </Link>
        {setSearch && (
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 transition focus-within:border-brand focus-within:bg-white">
            <Search className="h-5 w-5 text-slate-500" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products"
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
        )}
        <nav className="flex items-center justify-between gap-3 md:justify-end">
          <Link to="/cart" className="relative rounded-lg p-2 text-slate-700 transition hover:bg-slate-100" title="Cart">
            <ShoppingCart className="h-6 w-6" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </Link>
          <div className="hidden items-center gap-2 text-sm text-slate-600 sm:flex">
            <UserRound className="h-5 w-5" />
            <span className="max-w-36 truncate">{user?.name}</span>
          </div>
          <button onClick={handleLogout} className="rounded-lg p-2 text-slate-700 transition hover:bg-slate-100" title="Logout">
            <LogOut className="h-5 w-5" />
          </button>
        </nav>
      </div>
    </header>
  );
}
