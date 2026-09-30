import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  PackageCheck,
  ShieldCheck,
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
  UserCircle,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 py-5 text-center sm:flex-row lg:px-8">
        <p className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200">
          Shop<span className="text-indigo-600">Flow</span>
        </p>

        <p className="text-xs font-medium text-slate-400">
          © 2026 ShopFlow. All rights reserved.
        </p>

        <p className="text-xs text-slate-400">
          Commerce workspace
        </p>
      </div>
    </footer>
  );
}

function ProfilePanel({ email, role, logout }) {
  return (
    <div className="border-t border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
          {(email?.[0] || "U").toUpperCase()}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">
            {email || "User"}
          </p>

          <div className="mt-1 flex items-center gap-2">
            <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
              {role || "user"}
            </span>

            <span className="text-[10px] font-medium text-emerald-600">
              ● Active
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={logout}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-red-900 dark:hover:bg-red-950/30 dark:hover:text-red-400"
      >
        <LogOut size={16} />
        Sign out
      </button>
    </div>
  );
}

export default function Layout() {
  const { role, email, logout } = useAuth();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("shopflow-theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("shopflow-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("shopflow-theme", "light");
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((current) => !current);
  };

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    navigate("/login");
  };

  const links = [
    {
      to: "/app",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      to: "/app/products",
      label: "Products",
      icon: ShoppingBag,
    },
    {
      to: "/app/cart",
      label: "Shopping Cart",
      icon: ShoppingCart,
    },
    {
      to: "/app/orders",
      label: "My Orders",
      icon: PackageCheck,
    },
  ];

  if (role === "admin") {
    links.push({
      to: "/app/admin",
      label: "Admin Center",
      icon: ShieldCheck,
    });
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex dark:border-slate-800 dark:bg-slate-950">

        <div className="flex h-20 items-center border-b border-slate-200 px-6 dark:border-slate-800">
          <button
            onClick={() => navigate("/app")}
            className="text-left"
          >
            <div className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              Shop<span className="text-indigo-600">Flow</span>
            </div>

            <div className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Commerce Platform
            </div>
          </button>
        </div>

        <div className="flex-1 px-3 py-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Workspace
          </p>

          <nav className="space-y-1">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/app"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? "border-indigo-100 bg-indigo-50 text-indigo-700 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-300"
                      : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:border-slate-800 dark:hover:bg-slate-900 dark:hover:text-white"
                  }`
                }
              >
                <Icon size={18} strokeWidth={2} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-800">
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
              Preferences
            </p>

            <button
              onClick={toggleTheme}
              className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              <span className="flex items-center gap-3">
                {darkMode ? <Moon size={18} /> : <Sun size={18} />}
                {darkMode ? "Dark mode" : "Light mode"}
              </span>

              <span className="text-xs text-slate-400">
                {darkMode ? "ON" : "OFF"}
              </span>
            </button>
          </div>
        </div>

        <ProfilePanel
          email={email}
          role={role}
          logout={handleLogout}
        />
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white shadow-2xl transition-transform duration-200 lg:hidden dark:border-slate-800 dark:bg-slate-950 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-slate-200 px-5 dark:border-slate-800">
          <div>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              Shop<span className="text-indigo-600">Flow</span>
            </div>

            <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
              Commerce Platform
            </div>
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg border border-slate-200 p-2 text-slate-500 dark:border-slate-700 dark:text-slate-300"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 px-3 py-6">
          <nav className="space-y-1">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/app"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg border px-3 py-3 text-sm font-semibold ${
                    isActive
                      ? "border-indigo-100 bg-indigo-50 text-indigo-700 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-300"
                      : "border-transparent text-slate-600 dark:text-slate-400"
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>

          <button
            onClick={toggleTheme}
            className="mt-6 flex w-full items-center gap-3 rounded-lg border border-slate-200 px-3 py-3 text-sm font-semibold dark:border-slate-800"
          >
            {darkMode ? <Moon size={18} /> : <Sun size={18} />}
            {darkMode ? "Dark mode" : "Light mode"}
          </button>
        </div>

        <ProfilePanel
          email={email}
          role={role}
          logout={handleLogout}
        />
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">

        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 dark:border-slate-800 dark:bg-slate-950/95">

          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg border border-slate-200 p-2 text-slate-600 lg:hidden dark:border-slate-700 dark:text-slate-300"
              aria-label="Open navigation"
            >
              <Menu size={18} />
            </button>

            <div className="hidden text-sm font-semibold text-slate-500 sm:block dark:text-slate-400">
              Commerce Workspace
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setProfileOpen((value) => !value)}
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                {(email?.[0] || "U").toUpperCase()}
              </div>

              <div className="hidden text-left sm:block">
                <p className="max-w-[180px] truncate text-xs font-bold text-slate-800 dark:text-slate-100">
                  {email || "Account"}
                </p>

                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {role}
                </p>
              </div>

              <ChevronDown size={15} className="text-slate-400" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">

                <div className="border-b border-slate-200 p-4 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-bold text-white">
                      {(email?.[0] || "U").toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">
                        {email || "Account"}
                      </p>

                      <p className="mt-1 text-xs font-medium text-slate-400">
                        {role === "admin" ? "Administrator" : "Customer"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <button
                    onClick={() => setProfileOpen(false)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <UserCircle size={17} />
                    Account
                  </button>

                  <button
                    onClick={toggleTheme}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    {darkMode ? <Moon size={17} /> : <Sun size={17} />}
                    {darkMode ? "Switch to Light" : "Switch to Dark"}
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                  >
                    <LogOut size={17} />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}


