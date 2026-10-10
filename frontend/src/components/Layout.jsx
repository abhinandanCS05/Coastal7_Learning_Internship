import { useEffect, useState } from "react";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";

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
  ShieldCheck,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { useCartStore } from "../store/cartStore";
import NotificationPanel from "./NotificationPanel";
import SupportChat from "./SupportChat";

export default function Layout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const location = useLocation();

  const isAdmin = user?.role === "admin";
  const isAdminRoute = location.pathname.startsWith("/app/admin") || location.pathname.startsWith("/app/background-jobs");

  const [dark, setDark] = useState(
    localStorage.getItem("zetA_theme") === "dark"
  );

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const setCartCount = useCartStore(
    (state) => state.setCartCount
  );

  const count = useCartStore(
    (state) => state.cartCount
  );

  /*
   * Customer cart query.
   * Admin does not need customer cart state.
   */
  const cartQuery = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const { data } = await api.get("/cart");
      return data;
    },
    staleTime: 30 * 1000,
    enabled: Boolean(user) && !isAdmin,
  });

  useEffect(() => {
    if (cartQuery.data && !isAdmin) {
      setCartCount(cartQuery.data.count || 0);
    }
  }, [
    cartQuery.data,
    setCartCount,
    isAdmin,
  ]);

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      dark
    );

    localStorage.setItem(
      "zetA_theme",
      dark ? "dark" : "light"
    );
  }, [dark]);

  /*
   * ========================================================
   * ADMIN ROUTING
   * ========================================================
   */

  if (isAdmin && location.pathname === "/app") {
    return (
      <Navigate
        to="/app/admin"
        replace
      />
    );
  }

  if (
    isAdmin &&
    !isAdminRoute
  ) {
    return (
      <Navigate
        to="/app/admin"
        replace
      />
    );
  }

  const search = (e) => {
    e.preventDefault();

    if (!q.trim()) {
      nav("/app/products");
      return;
    }

    nav(
      `/app/products?search=${encodeURIComponent(
        q.trim()
      )}`
    );
  };

  const signout = () => {
    useCartStore.getState().resetCart();
    logout();
    nav("/login", { replace: true });
  };

  /*
   * ========================================================
   * ADMIN SHELL
   * ========================================================
   */

  if (isAdmin) {
    return (
      <div className="zetA-app min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">

        <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">

          <div className="mx-auto flex max-w-[1500px] items-center gap-4 px-5 py-3">

            <Link
              to="/app/admin"
              className="shrink-0 text-2xl font-black tracking-tight text-indigo-600"
            >
              <span className="inline-flex items-center gap-0.5"><span className="font-black tracking-[-0.07em] text-slate-950 dark:text-white">zet</span><span className="rounded-md bg-lime-300 px-1 text-slate-950">A</span></span>
            </Link>

            <div className="hidden h-9 w-px bg-slate-200 dark:bg-slate-800 md:block" />

            <div className="hidden items-center gap-2 md:flex">
              <ShieldCheck
                size={19}
                className="text-indigo-600"
              />

              <div>
                <p className="text-xs font-black uppercase tracking-wider text-indigo-600">
                  Administration
                </p>

                <p className="text-sm font-bold">
                  Admin Command Center
                </p>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <NotificationPanel />
              <SupportChat placement="header" />

              <button
                title="Toggle theme"
                onClick={() => setDark(!dark)}
                className="rounded-xl p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {dark ? (
                  <Sun size={19} />
                ) : (
                  <Moon size={19} />
                )}
              </button>

              <div className="hidden items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 sm:flex">
                <User size={17} />

                <span className="max-w-36 truncate text-sm font-semibold">
                  {"zetA Admin"}
                </span>
              </div>

              <button
                title="Logout"
                onClick={signout}
                className="rounded-xl border border-slate-200 p-2.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                <LogOut size={17} />
              </button>

            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800">

            <div className="mx-auto flex max-w-[1500px] items-center gap-2 px-5 py-2">

              <Link
                to="/app/admin"
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-bold text-white"
              >
                <LayoutDashboard size={16} />
                Command Center
              </Link>

            </div>

          </div>

        </header>

        <main className="mx-auto max-w-[1500px] px-4">
          <Outlet />
        </main>

        <footer className="mt-16 border-t border-slate-200 py-8 text-center text-sm text-slate-500 dark:border-slate-800">
          zetA Admin Console · Secure Operations
        </footer>

      </div>
    );
  }

  /*
   * ========================================================
   * CUSTOMER SHELL
   * ========================================================
   *
   * This section intentionally preserves the previous
   * Day-16 customer experience.
   */

  return (
    <div className="zetA-app min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">

      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">

        <div className="mx-auto flex max-w-[1500px] items-center gap-4 px-4 py-3">

          <button
            className="md:hidden"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>

          <Link
            to="/app"
            className="shrink-0 text-2xl font-black tracking-tight text-indigo-600"
          >
            <span className="inline-flex items-center gap-0.5"><span className="font-black tracking-[-0.07em] text-slate-950 dark:text-white">zet</span><span className="rounded-md bg-lime-300 px-1 text-slate-950">A</span></span>
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
                placeholder="Search products, categories and more..."
                className="w-full bg-transparent px-3 outline-none"
              />

            </div>

          </form>

          <nav className="ml-auto hidden items-center gap-1 md:flex">
            <NotificationPanel />
            <SupportChat placement="header" />

            <Link
              title="AI Product Assistant"
              to="/app/ai-assistant"
              className="rounded-xl p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <span className="text-sm font-bold">AI</span>
            </Link>

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
              {dark ? (
                <Sun size={19} />
              ) : (
                <Moon size={19} />
              )}
            </button>

            <div className="ml-1 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700">

              <User size={17} />

              <span className="max-w-28 truncate text-sm">
                {user?.full_name || user?.email}
              </span>

              <button
                title="Logout"
                onClick={signout}
              >
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
              placeholder="Search zetA..."
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
              to="/app/ai-assistant"
              className="rounded-lg p-3 hover:bg-slate-100"
            >
              AI Product Assistant
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

          </div>

        </div>
      )}

      <main className="mx-auto max-w-[1500px] px-4">
        <Outlet />
      </main>

      <footer className="mt-16 border-t border-slate-200 py-8 text-center text-sm text-slate-500 dark:border-slate-800">
        © 2026 zetA · Smart shopping, simple checkout.
      </footer>

    </div>
  );
}