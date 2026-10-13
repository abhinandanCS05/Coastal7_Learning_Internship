import { useState } from "react";
import { Search, Sparkles, ArrowUpRight, LoaderCircle } from "lucide-react";
import api from "../services/api";

const money = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(value || 0));

export default function SemanticProductSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event?.preventDefault();
    if (!query.trim() || busy) return;
    setBusy(true); setError(""); setSearched(false);
    try {
      const { data } = await api.post("/ai/day22/search", { query: query.trim(), limit: 5 });
      const list = Array.isArray(data?.results) ? data.results : [];
      setResults(list); setSearched(true);
    } catch (e) {
      setError(e?.response?.data?.detail || "Product discovery is temporarily unavailable. Please try again.");
    } finally { setBusy(false); }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950"><Sparkles size={17} /></span>
        <div><h2 className="font-bold">Discover products</h2><p className="text-xs text-slate-500">Describe what you're looking for</p></div>
      </div>
      <form onSubmit={submit} className="mt-4 flex gap-2">
        <input value={query} onChange={(e) => setQuery(e.target.value)} maxLength={300} placeholder="e.g. lightweight headphones for travel" className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950" />
        <button type="submit" disabled={busy || !query.trim()} aria-label="Search products" className="flex items-center justify-center rounded-xl bg-indigo-600 px-3 text-white disabled:opacity-50">{busy ? <LoaderCircle size={18} className="animate-spin" /> : <Search size={18} />}</button>
      </form>
      {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}
      {searched && results.length === 0 && <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">No matching products were found. Try describing the product differently.</p>}
      {results.length > 0 && <div className="mt-4 space-y-2">
        {results.map((item, i) => {
          const id = item.id ?? item.product_id ?? item.productId ?? i;
          const name = item.name ?? item.title ?? item.product_name ?? "Recommended product";
          const price = item.price ?? item.display_price;
          const category = item.category ?? item.subcategory;
          const stock = item.stock;
          return <article key={`${id}-${i}`} className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
            <div className="flex items-start justify-between gap-2"><h3 className="text-sm font-semibold">{name}</h3><ArrowUpRight size={15} className="shrink-0 text-slate-400" /></div>
            {category && <p className="mt-1 text-xs text-slate-500">{category}</p>}
            {price != null && <p className="mt-2 text-sm font-bold text-indigo-600">{money(price)}</p>}
            {stock != null && <p className="mt-1 text-xs text-slate-500">{Number(stock) > 0 ? "In stock" : "Currently unavailable"}</p>}
            {item.description && <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-600 dark:text-slate-300">{item.description}</p>}
          </article>;
        })}
      </div>}
    </section>
  );
}
