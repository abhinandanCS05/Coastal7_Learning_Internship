import { useState } from "react";
import { Search, ShieldCheck, Bot, Sparkles, LoaderCircle } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
type Mode = "search" | "moderate" | "ask" | "agent";

const options: { id: Mode; label: string }[] = [
  { id: "search", label: "Semantic search" },
  { id: "moderate", label: "Content moderation" },
  { id: "ask", label: "Cached AI answer" },
  { id: "agent", label: "Shopping agent" },
];

export default function Day21Tools() {
  const [mode, setMode] = useState<Mode>("search");
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function runTool() {
    const value = text.trim();
    if (value.length < 2 || loading) return;
    const token = localStorage.getItem("zetA_token");
    if (!token) {
      setError("Please sign in again to use Day 21 tools.");
      return;
    }

    const endpoint: Record<Mode, string> = {
      search: "/ai/day21/search",
      moderate: "/ai/day21/moderate",
      ask: "/ai/day21/ask",
      agent: "/ai/day21/agent",
    };
    const payload = mode === "search"
      ? { query: value, top_k: 5 }
      : mode === "moderate"
        ? { text: value }
        : { message: value };

    setLoading(true);
    setError("");
    setResult("");
    try {
      const response = await fetch(`${API_URL}${endpoint[mode]}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.detail || `Request failed (${response.status})`);
      setResult(JSON.stringify(data, null, 2));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Day 21 request failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2 font-bold">
        <Sparkles size={18} /> AI Tools
      </div>
      <p className="mt-1 text-xs text-slate-500">
        Try semantic retrieval, baseline safety checks, cached answers, and bounded tool-using agents.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {options.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => { setMode(item.id); setResult(""); setError(""); }}
            className={`rounded-xl border px-3 py-2 text-left text-xs font-semibold ${
              mode === item.id
                ? "border-indigo-500 bg-indigo-50 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200"
                : "border-slate-200 dark:border-slate-700"
            }`}
          >
            {item.id === "search" ? <Search size={14} className="mr-1 inline" /> :
             item.id === "moderate" ? <ShieldCheck size={14} className="mr-1 inline" /> :
             <Bot size={14} className="mr-1 inline" />}
            {item.label}
          </button>
        ))}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={mode === "moderate" ? 2000 : mode === "search" ? 300 : mode === "agent" ? 1000 : 1200}
        rows={3}
        placeholder={mode === "search" ? "e.g. accessories for a study desk" :
          mode === "moderate" ? "Enter text to check against baseline safety rules" :
          "Ask for product recommendations or comparisons"}
        className="mt-3 w-full rounded-xl border border-slate-300 bg-slate-50 p-3 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-950"
      />
      <button
        type="button"
        onClick={() => void runTool()}
        disabled={loading || text.trim().length < 2}
        className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50 dark:bg-lime-300 dark:text-slate-950"
      >
        {loading ? <LoaderCircle size={16} className="animate-spin" /> : null}
        {loading ? "Running..." : "Run tool"}
      </button>
      {error && <p role="alert" className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-100">{error}</p>}
      {result && <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-slate-100 p-3 text-xs leading-5 dark:bg-slate-950">{result}</pre>}
    </section>
  );
}

