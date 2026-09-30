import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";

import api from "../services/api";


export default function Checkout() {
  const [cart, setCart] = useState({
    items: [],
  });

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();


  // ==========================================================
  // LOAD CART
  // ==========================================================

  async function loadCart() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/cart");

      setCart(response.data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Unable to load cart",
      );
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    loadCart();
  }, []);


  // ==========================================================
  // PLACE ORDER
  // ==========================================================

  async function placeOrder() {
    if (!cart.items?.length) {
      setError("Your cart is empty.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      const payload = {
        items: cart.items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
      };

      const response = await api.post(
        "/orders",
        payload,
      );

      setOrderId(response.data.id);
      setDone(true);

    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Unable to place order",
      );
    } finally {
      setBusy(false);
    }
  }


  // ==========================================================
  // ORDER SUCCESS
  // ==========================================================

  if (done) {
    return (
      <div className="mx-auto max-w-xl rounded-[2rem] bg-white p-10 text-center shadow-sm">

        <CheckCircle
          className="mx-auto text-emerald-500"
          size={65}
        />

        <h1 className="mt-5 text-3xl font-black">
          Order placed!
        </h1>

        <p className="mt-3 text-slate-500">
          Your order has been successfully created.
        </p>

        {orderId && (
          <div className="mx-auto mt-5 w-fit rounded-xl bg-indigo-50 px-5 py-3 font-bold text-indigo-700">
            Order #{orderId}
          </div>
        )}

        <p className="mt-4 text-sm text-slate-500">
          The admin has been notified in real time.
        </p>

        <button
          onClick={() => navigate("/app/orders")}
          className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white transition hover:bg-indigo-700"
        >
          Track order
        </button>

      </div>
    );
  }


  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl rounded-[2rem] bg-white p-10 text-center">

        <ShoppingBag
          className="mx-auto animate-pulse text-indigo-500"
          size={45}
        />

        <p className="mt-4 font-semibold text-slate-500">
          Loading your cart...
        </p>

      </div>
    );
  }


  // ==========================================================
  // EMPTY CART
  // ==========================================================

  if (!cart.items?.length) {
    return (
      <div className="mx-auto max-w-2xl rounded-[2rem] bg-white p-10 text-center">

        <ShoppingBag
          className="mx-auto text-slate-300"
          size={55}
        />

        <h1 className="mt-4 text-2xl font-black">
          Your cart is empty
        </h1>

        <p className="mt-2 text-slate-500">
          Add products before proceeding to checkout.
        </p>

        <button
          onClick={() => navigate("/app/products")}
          className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white"
        >
          Continue shopping
        </button>

      </div>
    );
  }


  // ==========================================================
  // CHECKOUT
  // ==========================================================

  return (
    <div className="mx-auto max-w-2xl rounded-[2rem] bg-white p-8 shadow-sm">

      <h1 className="text-3xl font-black">
        Checkout
      </h1>


      {/* CART SUMMARY */}

      <div className="mt-6 rounded-2xl border bg-slate-50 p-5">

        <h2 className="font-black">
          Order Summary
        </h2>

        <div className="mt-4 space-y-3">

          {cart.items.map((item) => (

            <div
              key={item.product_id}
              className="flex items-center justify-between rounded-xl bg-white p-4"
            >

              <div>

                <p className="font-bold">
                  Product #{item.product_id}
                </p>

                <p className="text-sm text-slate-500">
                  Quantity: {item.quantity}
                </p>

              </div>

              <span className="font-bold">
                × {item.quantity}
              </span>

            </div>

          ))}

        </div>

      </div>


      {/* SECURITY */}

      <div className="my-7 rounded-2xl bg-indigo-50 p-5 text-indigo-900">

        <ShieldCheck />

        <b className="mt-2 block">
          Secure stock validation
        </b>

        <p className="text-sm">
          FastAPI validates product availability and
          stock before creating the order.
        </p>

      </div>


      {/* ERROR */}

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}


      {/* PLACE ORDER */}

      <button
        disabled={busy}
        onClick={placeOrder}
        className="w-full rounded-xl bg-indigo-600 p-3 font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy
          ? "Placing order..."
          : "Place order"}
      </button>

    </div>
  );
}