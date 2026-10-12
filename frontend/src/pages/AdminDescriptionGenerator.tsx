import { useState } from "react";
import { Sparkles, Save, LoaderCircle } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type GeneratedDescription = {
  product_id: number;
  product_name: string;
  description: string;
  provider: string;
  cached: boolean;
};

export default function AdminDescriptionGenerator() {
  const [productId, setProductId] = useState("");
  const [draft, setDraft] = useState<GeneratedDescription | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function authHeaders() {
    const token = localStorage.getItem("zetA_token");
    if (!token) throw new Error("Please sign in again.");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  async function generate() {
    const id = Number(productId);
    if (!Number.isInteger(id) || id < 1) {
      setError("Enter a valid product ID.");
      return;
    }

    setLoading(true);
    setError("");
    setNotice("");
    setDraft(null);
    try {
      const response = await fetch(
        `${API_URL}/ai/day21/products/${id}/description`,
        { method: "POST", headers: authHeaders() }
      );
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.detail || `Generation failed (${response.status})`);

      const description = String(data.description || "").trim();
      if (description.split(/\s+/).filter(Boolean).length < 40) {
        throw new Error("The provider returned an incomplete description. Nothing was saved; please retry later.");
      }
      setDraft(data as GeneratedDescription);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Description generation failed.");
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    if (!draft) return;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch(
        `${API_URL}/ai/day21/products/${draft.product_id}/description/save`,
        {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({ description: draft.description }),
        }
      );
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.detail || `Save failed (${response.status})`);
      setNotice("Description saved to the product catalogue.");
      setDraft(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save the description.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2 font-bold">
        <Sparkles size={18} /> AI Product Description Generator
      </div>
      <p className="mt-1 text-sm text-slate-500">
        Generate a factual draft, review it, and explicitly save it before customers see it.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <input
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          type="number"
          min="1"
          placeholder="Product ID"
          className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-transparent px-3 py-2 text-sm dark:border-slate-700"
          aria-label="Product ID"
        />
        <button
          type="button"
          onClick={() => void generate()}
          disabled={loading || saving}
          className="flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 dark:bg-lime-300 dark:text-slate-950"
        >
          {loading ? <LoaderCircle size={15} className="animate-spin" /> : <Sparkles size={15} />}
          Generate
        </button>
      </div>
      {draft && (
        <div className="mt-4 space-y-3">
          <div className="text-sm font-semibold">{draft.product_name} · Provider: {draft.provider}</div>
          <textarea
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            rows={6}
            maxLength={3000}
            className="w-full rounded-xl border border-slate-300 bg-transparent p-3 text-sm leading-6 dark:border-slate-700"
            aria-label="Review and edit generated product description"
          />
          <p className="text-xs text-slate-500">
            Review the facts and edit the draft before saving. Saving replaces the product description.
          </p>
          <button
            type="button"
            onClick={() => void save()}
            disabled={saving || draft.description.trim().split(/\s+/).filter(Boolean).length < 40}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? <LoaderCircle size={15} className="animate-spin" /> : <Save size={15} />}
            Review complete — Save description
          </button>
        </div>
      )}
      {error && <p role="alert" className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-100">{error}</p>}
      {notice && <p role="status" className="mt-3 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">{notice}</p>}
    </section>
  );
}
