import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Star,
  ShieldCheck,
  Truck,
  PackageCheck,
  Minus,
  Plus,
} from "lucide-react";
import api, { mediaUrl } from "../services/api";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [wishlist, setWishlist] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    setNotice("");

    Promise.all([
      api.get(`/products/${id}`),
      api.get("/wishlist").catch(() => ({ data: { product_ids: [] } })),
    ])
      .then(([productResponse, wishlistResponse]) => {
        if (!active) return;
        setProduct(productResponse.data);
        setWishlist(
          (wishlistResponse.data?.product_ids || []).includes(Number(id))
        );
      })
      .catch((requestError) => {
        if (!active) return;
        setError(
          requestError.response?.data?.detail ||
            "We couldn't load this product. Please try again."
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  async function toggleWishlist() {
    if (!product || busy) return;
    setBusy(true);
    setNotice("");
    try {
      const response = await api.post(`/wishlist/${product.id}`);
      setWishlist(response.data.action === "added");
      setNotice(
        response.data.action === "added"
          ? "Added to your wishlist."
          : "Removed from your wishlist."
      );
    } catch (requestError) {
      setNotice(
        requestError.response?.data?.detail ||
          "Please sign in to update your wishlist."
      );
    } finally {
      setBusy(false);
    }
  }

  async function addToCart() {
    if (!product || busy) return;
    setBusy(true);
    setNotice("");
    try {
      await api.post("/cart/items", {
        product_id: product.id,
        quantity,
      });
      setNotice("Added to your cart.");
    } catch (requestError) {
      setNotice(
        requestError.response?.data?.detail ||
          "Please sign in before adding items to your cart."
      );
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <main className="zeta-page zeta-product-details py-20" aria-live="polite">
        <div className="mx-auto max-w-xl animate-pulse rounded-3xl border border-slate-200 p-8 text-center dark:border-slate-800">
          <div className="mx-auto mb-4 aspect-square max-w-56 rounded-2xl bg-slate-100 dark:bg-slate-800" />
          <div className="mx-auto h-5 w-2/3 rounded bg-slate-100 dark:bg-slate-800" />
          <div className="mx-auto mt-3 h-4 w-1/3 rounded bg-slate-100 dark:bg-slate-800" />
          <p className="mt-5 text-sm text-slate-500">Loading product details…</p>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="zeta-page zeta-product-details py-20">
        <section className="mx-auto max-w-xl rounded-3xl border border-slate-200 p-8 text-center dark:border-slate-800">
          <PackageCheck className="mx-auto text-slate-400" size={36} />
          <h1 className="mt-4 text-2xl font-black">Product unavailable</h1>
          <p className="mt-2 text-sm text-slate-500">{error || "This product could not be found."}</p>
          <Link
            to="/app/products"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white"
          >
            <ArrowLeft size={16} /> Back to products
          </Link>
        </section>
      </main>
    );
  }

  const price = Number(product.price || 0);
  const mrp = Number(product.mrp || product.price || 0);
  const discount = mrp > price && mrp > 0
    ? Math.round(((mrp - price) / mrp) * 100)
    : 0;

  return (
    <main className="zeta-page zeta-product-details py-7">
      <Link
        to="/app/products"
        className="inline-flex items-center gap-2 rounded-lg py-2 text-sm font-semibold text-slate-500 hover:text-indigo-600"
      >
        <ArrowLeft size={16} /> Back to products
      </Link>

      <div className="mt-4 grid gap-8 overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2 md:gap-12 md:p-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex min-h-72 items-center justify-center overflow-hidden rounded-2xl bg-slate-50 p-4 md:min-h-[480px] dark:bg-slate-950">
          <img
            src={mediaUrl(product.image_url)}
            alt={product.name}
            className="max-h-[560px] w-full object-contain"
          />
        </div>

        <section className="flex flex-col justify-center py-2 md:py-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              {product.category}
            </span>
            {product.badge && (
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                {product.badge}
              </span>
            )}
          </div>

          <p className="mt-4 text-sm font-medium text-slate-500">
            {product.subcategory}
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <Star className="fill-amber-400 text-amber-400" size={18} />
            <strong>{Number(product.rating || 0).toFixed(1)}</strong>
            <span className="text-slate-500">
              ({product.reviews || 0} reviews)
            </span>
            <span className="text-slate-300">•</span>
            <span className={product.stock > 0 ? "font-semibold text-emerald-600" : "font-semibold text-red-500"}>
              {product.stock > 0 ? `${product.stock} in stock` : "Currently out of stock"}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-black">
              ₹{price.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
            </span>
            {mrp > price && (
              <>
                <span className="text-lg text-slate-400 line-through">
                  ₹{mrp.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </span>
                {discount > 0 && (
                  <span className="rounded-lg bg-emerald-50 px-2 py-1 text-sm font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    {discount}% off
                  </span>
                )}
              </>
            )}
          </div>

          <p className="mt-6 whitespace-pre-line leading-7 text-slate-600 dark:text-slate-300">
            {product.description || "A thoughtful pick for your everyday needs."}
          </p>

          {product.stock > 0 && (
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center rounded-xl border border-slate-200 p-1 dark:border-slate-700">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  disabled={quantity <= 1 || busy}
                  className="rounded-lg p-2 hover:bg-slate-100 disabled:opacity-40 dark:hover:bg-slate-800"
                >
                  <Minus size={16} />
                </button>
                <span className="min-w-10 text-center font-bold" aria-live="polite">{quantity}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity((value) => Math.min(Number(product.stock), value + 1))}
                  disabled={quantity >= Number(product.stock) || busy}
                  className="rounded-lg p-2 hover:bg-slate-100 disabled:opacity-40 dark:hover:bg-slate-800"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                type="button"
                onClick={addToCart}
                disabled={busy || product.stock < 1}
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ShoppingCart size={18} />
                {busy ? "Please wait…" : "Add to cart"}
              </button>
              <button
                type="button"
                onClick={toggleWishlist}
                disabled={busy}
                aria-pressed={wishlist}
                aria-label={wishlist ? "Remove from wishlist" : "Add to wishlist"}
                className={`grid min-h-12 min-w-12 place-items-center rounded-xl border ${wishlist ? "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900 dark:bg-rose-950" : "border-slate-200 text-slate-600 hover:border-rose-200 hover:text-rose-600 dark:border-slate-700"}`}
              >
                <Heart size={19} className={wishlist ? "fill-current" : ""} />
              </button>
            </div>
          )}

          {notice && (
            <p role="status" className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {notice}
            </p>
          )}

          <div className="mt-8 grid gap-3 border-t border-slate-100 pt-6 sm:grid-cols-2 dark:border-slate-800">
            <div className="flex items-start gap-3">
              <Truck className="mt-0.5 text-indigo-600" size={20} />
              <div>
                <p className="text-sm font-bold">Reliable delivery</p>
                <p className="mt-1 text-xs text-slate-500">Order updates in your account</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 text-indigo-600" size={20} />
              <div>
                <p className="text-sm font-bold">Secure checkout</p>
                <p className="mt-1 text-xs text-slate-500">Your checkout details stay protected</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
