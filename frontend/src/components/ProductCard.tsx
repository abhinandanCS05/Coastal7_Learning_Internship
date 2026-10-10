import type { Product } from "../types/api";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  isWishlisted?: boolean;
}

export default function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
}: ProductCardProps) {
  const imageSource = product.image_url || product.image;

  return (
    <article
      data-testid="product-card"
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        {imageSource ? (
          <img
            src={imageSource}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div
            data-testid="product-image-placeholder"
            className="flex h-full items-center justify-center text-sm text-slate-400"
          >
            No image
          </div>
        )}

        {product.badge && (
          <span
            data-testid="product-badge"
            className="absolute left-3 top-3 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white"
          >
            {product.badge}
          </span>
        )}

        {product.stock > 0 && product.stock < 10 && (
          <span
            data-testid="low-stock"
            className="absolute bottom-3 left-3 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700"
          >
            Only {product.stock} left
          </span>
        )}
      </div>

      <div className="space-y-3 p-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {product.category}
          </p>

          <h3
            data-testid="product-name"
            className="mt-1 line-clamp-2 font-semibold text-slate-900"
          >
            {product.name}
          </h3>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-slate-900">
              {product.price.toLocaleString("en-IN")}
            </p>

            {product.mrp && product.mrp > product.price && (
              <p className="text-sm text-slate-400 line-through">
                {product.mrp.toLocaleString("en-IN")}
              </p>
            )}
          </div>

          {product.rating !== undefined && (
            <span className="text-sm font-medium text-slate-600">
              ★ {product.rating}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          {onAddToCart && (
            <button
              type="button"
              onClick={() => onAddToCart(product)}
              disabled={product.stock <= 0}
              className="flex-1 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
            </button>
          )}

          {onToggleWishlist && (
            <button
              type="button"
              aria-label={
                isWishlisted ? "Remove from wishlist" : "Add to wishlist"
              }
              onClick={() => onToggleWishlist(product)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm transition hover:bg-slate-50"
            >
              {isWishlisted ? "♥" : "♡"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
