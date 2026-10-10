import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Heart,
  SlidersHorizontal,
  Star,
  ShoppingCart,
} from "lucide-react";
import api, { mediaUrl } from "../services/api";
import { useDebounce } from "../hooks/useDebounce";

const Card = memo(function Card({ p, wished, toggle, add }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
      <Link to={`/app/products/${p.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <img
            src={mediaUrl(p.image_url)}
            alt={p.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />

          {p.stock < 10 && (
            <span className="absolute left-3 top-3 rounded-full bg-red-600 px-2.5 py-1 text-xs font-bold text-white">
              Only {p.stock} left
            </span>
          )}

          {p.badge && (
            <span className="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-slate-800">
              {p.badge}
            </span>
          )}
        </div>
      </Link>

      <div className="p-4">
        <div className="text-xs font-medium text-indigo-600">
          {p.category} ï¿½ {p.subcategory}
        </div>

        <div className="mt-1 flex items-start justify-between gap-2">
          <Link
            to={`/app/products/${p.id}`}
            className="line-clamp-2 font-semibold hover:text-indigo-600"
          >
            {p.name}
          </Link>

          <button
            onClick={() => toggle(p.id)}
            className="shrink-0"
            aria-label={
              wished
                ? "Remove from wishlist"
                : "Add to wishlist"
            }
          >
            <Heart
              size={19}
              className={
                wished
                  ? "fill-red-500 text-red-500"
                  : ""
              }
            />
          </button>
        </div>

        <div className="mt-2 flex items-center gap-1 text-sm">
          <Star
            size={15}
            className="fill-amber-400 text-amber-400"
          />
          {p.rating}
          <span className="text-slate-400">
            ({p.reviews})
          </span>
        </div>

        <div className="mt-2 flex items-end gap-2">
          <span className="text-xl font-black">
            {p.price.toLocaleString("en-IN")}
          </span>

          <span className="text-sm text-slate-400 line-through">
            {p.mrp.toLocaleString("en-IN")}
          </span>

          <span className="text-xs font-bold text-green-600">
            {p.discount_percent}% off
          </span>
        </div>

        <p className="mt-1 text-xs text-green-600">
          {p.offer_text}
        </p>

        <button
          onClick={() => add(p.id)}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 py-2.5 text-sm font-semibold text-white hover:bg-indigo-600 dark:bg-white dark:text-slate-950"
        >
          <ShoppingCart size={16} />
          Add to cart
        </button>
      </div>
    </article>
  );
});

export default function Products() {
  const [params] = useSearchParams();
  const queryClient = useQueryClient();
  const loadMoreRef = useRef(null);

  const [search, setSearch] = useState(
    params.get("search") || ""
  );
  const [cat, setCat] = useState(
    params.get("category") || ""
  );
  const [sub, setSub] = useState(
    params.get("subcategory") || ""
  );
  const [sort, setSort] = useState("relevance");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [wish, setWish] = useState([]);

  const debouncedSearch = useDebounce(search, 350);

  const filters = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      category: cat || undefined,
      subcategory: sub || undefined,
      sort,
      min_price: min || undefined,
      max_price: max || undefined,
    }),
    [
      debouncedSearch,
      cat,
      sub,
      sort,
      min,
      max,
    ]
  );

  const productsQuery = useInfiniteQuery({
    queryKey: ["products", filters],
    initialPageParam: 1,

    queryFn: async ({ pageParam }) => {
      const { data } = await api.get("/products", {
        params: {
          ...filters,
          page: pageParam,
          page_size: 20,
        },
      });

      return data;
    },

    getNextPageParam: (lastPage) =>
      lastPage.has_next
        ? lastPage.page + 1
        : undefined,

    staleTime: 60 * 1000,
  });

  const categoriesQuery = useQuery({
    queryKey: ["categories"],

    queryFn: async () => {
      const { data } = await api.get("/categories");
      return data;
    },

    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    api
      .get("/wishlist")
      .then((r) => setWish(r.data.product_ids))
      .catch(() => {});
  }, []);

  const items = useMemo(
    () =>
      productsQuery.data?.pages.flatMap(
        (page) => page.items
      ) || [],
    [productsQuery.data]
  );

  const total =
    productsQuery.data?.pages[0]?.total || 0;

  const cats = categoriesQuery.data || {};

  const loading =
    productsQuery.isLoading ||
    categoriesQuery.isLoading;

  const toggle = useCallback(
    async (id) => {
      try {
        const r = await api.post(`/wishlist/${id}`);

        setWish((w) =>
          r.data.action === "added"
            ? [...w, id]
            : w.filter((x) => x !== id)
        );

        queryClient.invalidateQueries({
          queryKey: ["wishlist"],
        });
      } catch (e) {
        alert(
          e.response?.data?.detail ||
            "Please login to manage wishlist"
        );
      }
    },
    [queryClient]
  );

  const add = useCallback(
    async (id) => {
      try {
        await api.post("/cart/items", {
          product_id: id,
          quantity: 1,
        });

        queryClient.invalidateQueries({
          queryKey: ["cart"],
        });

        alert("Added to cart");
      } catch (e) {
        alert(
          e.response?.data?.detail ||
            "Please login to add items"
        );
      }
    },
    [queryClient]
  );

  const clearFilters = useCallback(() => {
    setCat("");
    setSub("");
    setMin("");
    setMax("");
    setSearch("");
  }, []);

  useEffect(() => {
    const target = loadMoreRef.current;

    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];

        if (
          firstEntry.isIntersecting &&
          productsQuery.hasNextPage &&
          !productsQuery.isFetchingNextPage
        ) {
          productsQuery.fetchNextPage();
        }
      },
      {
        rootMargin: "500px",
      }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [
    productsQuery.hasNextPage,
    productsQuery.isFetchingNextPage,
    productsQuery.fetchNextPage,
  ]);

  return (
    <main className="zeta-page zeta-products zeta-page py-7">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-indigo-600">
            SHOP / CATALOG
          </p>

          <h1 className="text-3xl font-black">
            Discover products
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Showing {items.length} of {total} products
          </p>
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-xl border bg-white px-4 py-2.5 dark:border-slate-700 dark:bg-slate-900"
        >
          <option value="relevance">
            Sort: Relevance
          </option>
          <option value="price_asc">
            Price: Low to High
          </option>
          <option value="price_desc">
            Price: High to Low
          </option>
          <option value="rating">
            Customer Rating
          </option>
          <option value="discount">
            Best Discount
          </option>
          <option value="newest">
            Newest
          </option>
        </select>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="h-fit rounded-2xl border bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between font-bold">
            <span className="flex items-center gap-2">
              <SlidersHorizontal size={17} />
              Filters
            </span>

            <button
              onClick={clearFilters}
              className="text-xs text-indigo-600"
            >
              Clear
            </button>
          </div>

          <label className="mt-5 block text-sm font-semibold">
            Search

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="mt-1 w-full rounded-lg border p-2.5 dark:bg-slate-950"
            />
          </label>

          <label className="mt-4 block text-sm font-semibold">
            Category

            <select
              value={cat}
              onChange={(e) => {
                setCat(e.target.value);
                setSub("");
              }}
              className="mt-1 w-full rounded-lg border p-2.5 dark:bg-slate-950"
            >
              <option value="">
                All categories
              </option>

              {Object.keys(cats).map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>

          {cat && (
            <label className="mt-4 block text-sm font-semibold">
              Subcategory

              <select
                value={sub}
                onChange={(e) =>
                  setSub(e.target.value)
                }
                className="mt-1 w-full rounded-lg border p-2.5 dark:bg-slate-950"
              >
                <option value="">
                  All subcategories
                </option>

                {cats[cat]?.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
          )}

          <div className="mt-4 grid grid-cols-2 gap-2">
            <input
              value={min}
              onChange={(e) =>
                setMin(e.target.value)
              }
              placeholder="Min "
              className="rounded-lg border p-2.5"
            />

            <input
              value={max}
              onChange={(e) =>
                setMax(e.target.value)
              }
              placeholder="Max "
              className="rounded-lg border p-2.5"
            />
          </div>
        </aside>

        <section>
          {productsQuery.isError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-red-600">
              <h2 className="font-bold">
                Unable to load products
              </h2>

              <p className="mt-2 text-sm">
                Please check that the FastAPI backend is running.
              </p>

              <button
                onClick={() =>
                  productsQuery.refetch()
                }
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
              >
                Retry
              </button>
            </div>
          ) : loading ? (
            <div className="py-20 text-center text-slate-500">
              Loading productsï¿½
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border bg-white p-16 text-center dark:border-slate-800 dark:bg-slate-900">
              <h2 className="font-bold">
                No products found
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Try clearing your filters.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                {items.map((p) => (
                  <Card
                    key={p.id}
                    p={p}
                    wished={wish.includes(p.id)}
                    toggle={toggle}
                    add={add}
                  />
                ))}
              </div>

              <div
                ref={loadMoreRef}
                className="mt-8 flex min-h-16 items-center justify-center"
              >
                {productsQuery.isFetchingNextPage && (
                  <p className="text-sm text-slate-500">
                    Loading more productsï¿½
                  </p>
                )}

                {!productsQuery.hasNextPage &&
                  items.length > 0 && (
                    <p className="text-sm text-slate-400">
                      You've reached the end of the catalog.
                    </p>
                  )}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
