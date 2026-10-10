import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  RefreshCw,
} from "lucide-react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useCartStore } from "../store/cartStore";
import api, { mediaUrl } from "../services/api";

export default function Cart() {
  const nav = useNavigate();
  const queryClient = useQueryClient();
  const setCartCount = useCartStore((state) => state.setCartCount);

  const cartQuery = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const { data } = await api.get("/cart");
      return data;
    },
    staleTime: 30 * 1000,
  });

  useEffect(() => {
    if (cartQuery.data) {
      setCartCount(cartQuery.data.count || 0);
    }
  }, [cartQuery.data, setCartCount]);

  const updateMutation = useMutation({
    mutationFn: async ({ id, quantity }) => {
      const { data } = await api.patch(`/cart/items/${id}`, {
        product_id: id,
        quantity,
      });
      return data;
    },

    onMutate: async ({ id, quantity }) => {
      await queryClient.cancelQueries({
        queryKey: ["cart"],
      });

      const previousCart = queryClient.getQueryData(["cart"]);

      queryClient.setQueryData(["cart"], (current) => {
        if (!current) return current;

        const items = current.items.map((item) => {
          if (item.product.id !== id) return item;

          const lineTotal = item.product.price * quantity;

          return {
            ...item,
            quantity,
            line_total: lineTotal,
          };
        });

        const subtotal = items.reduce(
          (sum, item) => sum + item.line_total,
          0
        );

        return {
          ...current,
          items,
          count: items.reduce(
            (sum, item) => sum + item.quantity,
            0
          ),
          subtotal,
        };
      });

      return { previousCart };
    },

    onError: (error, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(
          ["cart"],
          context.previousCart
        );
      }

      alert(
        error.response?.data?.detail ||
          "Unable to update cart"
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/cart/items/${id}`);
      return id;
    },

    onMutate: async (id) => {
      await queryClient.cancelQueries({
        queryKey: ["cart"],
      });

      const previousCart = queryClient.getQueryData(["cart"]);

      queryClient.setQueryData(["cart"], (current) => {
        if (!current) return current;

        const items = current.items.filter(
          (item) => item.product.id !== id
        );

        const subtotal = items.reduce(
          (sum, item) => sum + item.line_total,
          0
        );

        return {
          ...current,
          items,
          count: items.reduce(
            (sum, item) => sum + item.quantity,
            0
          ),
          subtotal,
        };
      });

      return { previousCart };
    },

    onError: (error, id, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(
          ["cart"],
          context.previousCart
        );
      }

      alert(
        error.response?.data?.detail ||
          "Unable to remove item"
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });

  if (cartQuery.isLoading) {
    return (
      <main className="zeta-page zeta-cart py-20 text-center">
        Loading cartï¿½
      </main>
    );
  }

  if (cartQuery.isError) {
    return (
      <main className="zeta-page zeta-cart py-20 text-center">
        <p className="text-red-600">
          {cartQuery.error.response?.data?.detail ||
            "Unable to load cart."}
        </p>

        <button
          onClick={() => cartQuery.refetch()}
          className="mt-4 rounded-xl border px-4 py-2"
        >
          <RefreshCw
            className="mr-2 inline"
            size={15}
          />
          Retry
        </button>
      </main>
    );
  }

  const c = cartQuery.data;

  if (!c.items.length) {
    return (
      <main className="zeta-page zeta-cart py-20 text-center">
        <ShoppingBag
          className="mx-auto text-slate-300"
          size={54}
        />

        <h1 className="mt-4 text-2xl font-bold">
          Your cart is waiting for something good
        </h1>

        <Link
          to="/app/products"
          className="mt-5 inline-block rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white"
        >
          Start shopping
        </Link>
      </main>
    );
  }

  const discount =
    c.subtotal >= 7999
      ? 500
      : c.subtotal >= 999
        ? c.subtotal * 0.1
        : 0;

  const shipping = c.subtotal >= 499 ? 0 : 49;

  const total = Math.max(
    0,
    c.subtotal - discount + shipping
  );

  return (
    <main className="zeta-page zeta-cart py-8">
      <h1 className="text-3xl font-black">
        Shopping Cart
      </h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="space-y-3">
          {c.items.map((x) => (
            <div
              key={x.product.id}
              className="flex gap-4 rounded-2xl border bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
            >
              <img
                src={mediaUrl(x.product.image_url)}
                alt={x.product.name}
                className="h-28 w-28 rounded-xl object-cover"
              />

              <div className="min-w-0 flex-1">
                <Link
                  to={`/app/products/${x.product.id}`}
                  className="font-bold"
                >
                  {x.product.name}
                </Link>

                <p className="mt-1 text-sm text-slate-500">
                  {x.product.price.toLocaleString("en-IN")}
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    disabled={
                      x.quantity <= 1 ||
                      updateMutation.isPending
                    }
                    onClick={() =>
                      updateMutation.mutate({
                        id: x.product.id,
                        quantity: x.quantity - 1,
                      })
                    }
                    className="rounded-lg border p-1 disabled:opacity-40"
                  >
                    <Minus size={15} />
                  </button>

                  <span>{x.quantity}</span>

                  <button
                    disabled={
                      x.quantity >= x.product.stock ||
                      updateMutation.isPending
                    }
                    onClick={() =>
                      updateMutation.mutate({
                        id: x.product.id,
                        quantity: x.quantity + 1,
                      })
                    }
                    className="rounded-lg border p-1 disabled:opacity-40"
                  >
                    <Plus size={15} />
                  </button>

                  <button
                    disabled={removeMutation.isPending}
                    onClick={() =>
                      removeMutation.mutate(x.product.id)
                    }
                    className="ml-3 text-red-500 disabled:opacity-40"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>

                {x.product.stock < 10 && (
                  <p className="mt-2 text-xs font-bold text-red-600">
                    Only {x.product.stock} left
                  </p>
                )}
              </div>

              <b>
                {x.line_total.toLocaleString("en-IN")}
              </b>
            </div>
          ))}
        </section>

        <aside className="h-fit rounded-2xl border bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-bold">
            Order Summary
          </h2>

          <div className="mt-4 flex justify-between">
            <span>Subtotal</span>
            <span>
              {c.subtotal.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="mt-2 flex justify-between text-green-600">
            <span>Offer discount</span>
            <span>
              - 
              {discount.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          <div className="mt-2 flex justify-between">
            <span>Delivery</span>
            <span className="text-green-600">
              {shipping ? "49" : "FREE"}
            </span>
          </div>

          <div className="my-4 border-t" />

          <div className="flex justify-between text-xl font-black">
            <span>Total</span>
            <span>
              
              {total.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          <button
            onClick={() => nav("/app/checkout")}
            className="mt-5 w-full rounded-xl bg-indigo-600 py-3.5 font-bold text-white"
          >
            Proceed to Checkout
          </button>
        </aside>
      </div>
    </main>
  );
}
