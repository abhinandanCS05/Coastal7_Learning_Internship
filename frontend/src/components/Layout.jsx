import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  User,
  Search,
  LogOut,
  Sun,
  Moon,
  Package,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { useCartStore } from "../store/cartStore";

export default function Layout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const location = useLocation();

  const [dark, setDark] = useState(
    localStorage.getItem("shopflow_theme") === "dark"
  );
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const setCartCount = useCartStore((state) => state.setCartCount);
  const count = useCartStore((state) => state.cartCount);

  const cartQuery = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const { data } = await api.get("/cart");
      return data;
    },
    staleTime: 30 * 1000,
    enabled: Boolean(user),
  });

  useEffect(() => {
    if (cartQuery.data) {
      setCartCount(cartQuery.data.count || 0);
    }
  }, [cartQuery.data, setCartCount]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("shopflow_theme", dark ? "dark" : "light");
  }, [dark]);

  const search = (e) => {
    e.preventDefault();
    nav(`/app/products?search=${encodeURIComponent(q)}`);
  };

  const signout = () => {
    useCartStore.getState().resetCart();
    logout();
    nav("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
        <div className="mx-auto flex max-w-[1500px] items-center gap-4 px-4 py-3">
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>

          <Link
            to="/app"
            className="shrink-0 text-2xl font-black tracking-tight text-indigo-600"
          >
            shop<span className="text-slate-900 dark:text-white">flow</span>
          </Link>

          <form
            onSubmit={search}
            className="hidden min-w-0 flex-1 md:block"
          >
            <div className="flex h-11 max-w-2xl items-center rounded-xl border border-slate-200 bg-slate-50 px-3 dark:border-slate-700 dark:bg-slate-900">
              <Search size={18} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search products, categories and more…"
                className="w-full bg-transparent px-3 outline-none"
              />
            </div>
          </form>

          <nav className="ml-auto hidden items-center gap-1 md:flex">
            <Link
              title="Wishlist"
              to="/app/wishlist"
              className="rounded-xl p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Heart size={20} />
            </Link>

            <Link
              title="My Orders"
              to="/app/orders"
              className="rounded-xl p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Package size={20} />
            </Link>

            <Link
              title="Cart"
              to="/app/cart"
              className="relative rounded-xl p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ShoppingCart size={20} />

              {count > 0 && (
                <span className="absolute -right-1 -top-1 rounded-full bg-indigo-600 px-1.5 text-[10px] text-white">
                  {count}
                </span>
              )}
            </Link>

            <button
              title="Toggle theme"
              onClick={() => setDark(!dark)}
              className="rounded-xl p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {dark ? <Sun size={19} /> : <Moon size={19} />}
            </button>

            {user?.role === "admin" && (
              <Link
                to="/app/admin"
                title="Admin Dashboard"
                className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300"
              >
                <LayoutDashboard size={16} />
                Admin Dashboard
              </Link>
            )}

            <div className="ml-1 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700">
              <User size={17} />
              <span className="max-w-28 truncate text-sm">
                {user?.full_name || user?.email}
              </span>

              <button title="Logout" onClick={signout}>
                <LogOut size={16} />
              </button>
            </div>
          </nav>
        </div>

        <div className="border-t border-slate-100 px-4 py-2 md:hidden dark:border-slate-800">
          <form
            onSubmit={search}
            className="flex h-10 items-center rounded-lg border px-3"
          >
            <Search size={17} />

            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search ShopFlow…"
              className="w-full bg-transparent px-2 outline-none"
            />
          </form>
        </div>
      </header>

      {open && (
        <div className="border-b bg-white p-4 md:hidden dark:bg-slate-950">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Link
              onClick={() => setOpen(false)}
              to="/app/products"
              className="rounded-lg p-3 hover:bg-slate-100"
            >
              Products
            </Link>

            <Link
              onClick={() => setOpen(false)}
              to="/app/wishlist"
              className="rounded-lg p-3"
            >
              Wishlist
            </Link>

            <Link
              onClick={() => setOpen(false)}
              to="/app/cart"
              className="rounded-lg p-3"
            >
              Cart
            </Link>

            <Link
              onClick={() => setOpen(false)}
              to="/app/orders"
              className="rounded-lg p-3"
            >
              Orders
            </Link>

            {user?.role === "admin" && (
              <Link
                onClick={() => setOpen(false)}
                to="/app/admin"
                className="rounded-lg p-3 font-semibold text-indigo-600"
              >
                Admin Dashboard
              </Link>
            )}
          </div>
        </div>
      )}

      <div className="mx-auto max-w-[1500px] px-4">
        <Outlet />
      </div>

      <footer className="mt-16 border-t border-slate-200 py-8 text-center text-sm text-slate-500 dark:border-slate-800">
        © 2026 ShopFlow · Smart shopping, simple checkout.
      </footer>
    </div>
  );
}
