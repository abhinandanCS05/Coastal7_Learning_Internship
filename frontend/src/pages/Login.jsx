import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, ShoppingBag, Eye, EyeOff } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Enter a valid email address"),

  password: z
    .string()
    .min(6, "Password must contain at least 6 characters"),

  role: z.enum(["user", "admin"]),
});

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      role: "user",
    },
  });

  const onSubmit = async (form) => {
    setServerError("");

    try {
      const response = await api.post(
        "/auth/login",
        {
          email: form.email,
          password: form.password,
        },
        {
          params: {
            role: form.role,
          },
        }
      );

      login(
        response.data.access_token,
        form.role,
        form.email
      );

      navigate("/app");
    } catch (error) {
      setServerError(
        error?.response?.data?.detail ||
          "Unable to sign in. Please check your credentials."
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">

      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <ShoppingBag size={19} />
            </div>

            <div>
              <div className="text-lg font-black tracking-tight">
                Shop<span className="text-indigo-600">Flow</span>
              </div>

              <div className="hidden text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400 sm:block">
                Commerce Platform
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-2 text-xs font-semibold text-slate-500 sm:flex dark:text-slate-400">
            <ShieldCheck size={15} />
            Secure workspace
          </div>

        </div>
      </header>

      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10 sm:px-6">

        <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none lg:grid-cols-[1fr_440px]">

          {/* Information Panel */}
          <section className="hidden border-r border-slate-200 bg-slate-50 p-10 lg:flex lg:flex-col lg:justify-between dark:border-slate-800 dark:bg-slate-950">

            <div>
              <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-600 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-400">
                <ShoppingBag size={23} />
              </div>

              <h1 className="max-w-md text-3xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
                Manage your commerce workspace with clarity.
              </h1>

              <p className="mt-5 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                ShopFlow brings products, orders, inventory and
                customer operations into one structured workspace.
              </p>
            </div>

            <div className="border-t border-slate-200 pt-6 dark:border-slate-800">
              <div className="grid grid-cols-3 gap-4">

                <div>
                  <p className="text-lg font-black text-slate-900 dark:text-white">
                    Fast
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Operations
                  </p>
                </div>

                <div>
                  <p className="text-lg font-black text-slate-900 dark:text-white">
                    Secure
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Authentication
                  </p>
                </div>

                <div>
                  <p className="text-lg font-black text-slate-900 dark:text-white">
                    Live
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Order updates
                  </p>
                </div>

              </div>
            </div>

          </section>

          {/* Login */}
          <section className="p-6 sm:p-9">

            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">
                Welcome back
              </p>

              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Sign in to ShopFlow
              </h2>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Enter your account details to continue.
              </p>
            </div>

            {serverError && (
              <div
                role="alert"
                className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
              >
                {serverError}
              </div>
            )}

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
            >

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  className={`w-full rounded-lg border bg-white px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:ring-2 dark:bg-slate-950 ${
                    errors.email
                      ? "border-red-400 focus:border-red-500 focus:ring-red-100 dark:focus:ring-red-950"
                      : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100 dark:border-slate-700 dark:focus:ring-indigo-950"
                  }`}
                />

                {errors.email && (
                  <p className="mt-1.5 text-xs font-medium text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    {...register("password")}
                    className={`w-full rounded-lg border bg-white px-3.5 py-3 pr-11 text-sm outline-none transition placeholder:text-slate-400 focus:ring-2 dark:bg-slate-950 ${
                      errors.password
                        ? "border-red-400 focus:border-red-500 focus:ring-red-100 dark:focus:ring-red-950"
                        : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100 dark:border-slate-700 dark:focus:ring-indigo-950"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((value) => !value)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700 dark:hover:text-slate-200"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-1.5 text-xs font-medium text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Role */}
              <fieldset>
                <legend className="mb-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                  Account type
                </legend>

                <div className="grid grid-cols-2 gap-3">

                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      value="user"
                      {...register("role")}
                      className="peer sr-only"
                    />

                    <div className="rounded-lg border border-slate-300 px-4 py-3 transition peer-checked:border-indigo-500 peer-checked:bg-indigo-50 peer-checked:text-indigo-700 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 dark:peer-checked:border-indigo-500 dark:peer-checked:bg-indigo-950/40 dark:peer-checked:text-indigo-300">
                      <p className="text-sm font-bold">
                        User
                      </p>

                      <p className="mt-0.5 text-[11px] text-slate-400">
                        Shop & track orders
                      </p>
                    </div>
                  </label>

                  <label className="cursor-pointer">
                    <input
                      type="radio"
                      value="admin"
                      {...register("role")}
                      className="peer sr-only"
                    />

                    <div className="rounded-lg border border-slate-300 px-4 py-3 transition peer-checked:border-indigo-500 peer-checked:bg-indigo-50 peer-checked:text-indigo-700 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 dark:peer-checked:border-indigo-500 dark:peer-checked:bg-indigo-950/40 dark:peer-checked:text-indigo-300">
                      <p className="text-sm font-bold">
                        Admin
                      </p>

                      <p className="mt-0.5 text-[11px] text-slate-400">
                        Manage the platform
                      </p>
                    </div>
                  </label>

                </div>
              </fieldset>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-offset-slate-900"
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>

            </form>

            {/* Registration */}
            <div className="mt-6 border-t border-slate-200 pt-5 text-center dark:border-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                >
                  Create an account
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-slate-400">
                © 2026 ShopFlow. All rights reserved.
              </p>
            </div>

          </section>
        </div>
      </main>
    </div>
  );
}

