import { useCallback, useEffect, useState } from "react";
import { Activity, Sparkles, LoaderCircle, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import api from "../services/api";

export default function Day22AdminPanel() {
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [task, setTask] = useState(null);
  const [taskError, setTaskError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [usage, setUsage] = useState(null);
  const [usageError, setUsageError] = useState("");
  const [loadingUsage, setLoadingUsage] = useState(false);

  const refreshUsage = useCallback(async () => {
    setLoadingUsage(true); setUsageError("");
    try {
      const { data } = await api.get("/ai/day22/usage");
      setUsage(data);
    } catch (e) {
      setUsageError(e?.response?.data?.detail || "Usage information is temporarily unavailable.");
    } finally { setLoadingUsage(false); }
  }, []);

  useEffect(() => { void refreshUsage(); }, [refreshUsage]);

  async function queueDescription(event) {
    event.preventDefault();
    if (!name.trim() || !details.trim() || submitting) return;
    setSubmitting(true); setTask(null); setTaskError("");
    try {
      const { data } = await api.post("/ai/day22/tasks/description", {
        product_name: name.trim(), product_details: details.trim()
      });
      setTask(data);
    } catch (e) {
      setTaskError(e?.response?.data?.detail || "Couldn't start description generation. Please try again.");
    } finally { setSubmitting(false); }
  }

  const metricEntries = usage && typeof usage === "object"
    ? Object.entries(usage).filter(([, value]) => ["string", "number", "boolean"].includes(typeof value)).slice(0, 6)
    : [];

  return <section className="space-y-5 rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950"><Sparkles size={21} /></span>
        <div><p className="text-xs font-bold uppercase tracking-wider text-indigo-600">AI operations</p><h2 className="text-xl font-black">Content studio & usage</h2><p className="mt-1 text-sm text-slate-500">Create product content and keep an eye on AI activity.</p></div>
      </div>
      <button type="button" onClick={() => void refreshUsage()} disabled={loadingUsage} className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800">
        <RefreshCw size={15} className={loadingUsage ? "animate-spin" : ""} /> Refresh usage
      </button>
    </div>

    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,.8fr)]">
      <form onSubmit={queueDescription} className="space-y-3 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
        <h3 className="font-bold">Generate a product description</h3>
        <p className="text-sm text-slate-500">Describe the product and send the writing task to the background worker.</p>
        <label className="block text-sm font-semibold">Product name<input value={name} onChange={(e) => setName(e.target.value)} maxLength={200} required className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-normal outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950" placeholder="e.g. Wireless headphones" /></label>
        <label className="block text-sm font-semibold">Product details<textarea value={details} onChange={(e) => setDetails(e.target.value)} maxLength={3000} required rows={4} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 font-normal outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950" placeholder="Features, specifications, and intended use…" /></label>
        <button disabled={submitting || !name.trim() || !details.trim()} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50">{submitting ? <LoaderCircle size={16} className="animate-spin" /> : <Sparkles size={16} />}{submitting ? "Queueing…" : "Generate in background"}</button>
        {taskError && <p role="alert" className="flex items-start gap-2 text-sm text-red-600"><AlertCircle size={16} className="mt-0.5 shrink-0" />{taskError}</p>}
        {task && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
          <p className="flex items-center gap-2 font-bold"><CheckCircle2 size={17} /> Generation queued</p>
          <p className="mt-1">The background worker accepted your request. This confirms submission, not completion.</p>
          {task.task_id && <p className="mt-2 break-all text-xs opacity-75">Reference: {task.task_id}</p>}
        </div>}
      </form>

      <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
        <div className="flex items-center gap-2"><Activity size={18} className="text-indigo-600" /><h3 className="font-bold">AI usage overview</h3></div>
        {loadingUsage && !usage && <p className="mt-4 text-sm text-slate-500">Loading usage information…</p>}
        {usageError && <p role="alert" className="mt-3 text-sm text-amber-700 dark:text-amber-300">{usageError}</p>}
        {metricEntries.length > 0 ? <dl className="mt-4 space-y-3">
          {metricEntries.map(([key, value]) => <div key={key} className="flex items-start justify-between gap-3 border-b border-slate-100 pb-2 last:border-0 dark:border-slate-800">
            <dt className="text-sm text-slate-500">{key.replace(/[_-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</dt><dd className="max-w-[55%] break-words text-right text-sm font-bold">{String(value)}</dd>
          </div>)}
        </dl> : !loadingUsage && !usageError && <p className="mt-4 text-sm text-slate-500">Usage metrics will appear here when available.</p>}
        <p className="mt-4 text-xs leading-5 text-slate-400">These are application-level estimates, not billing statements. Values may reset when the backend process restarts.</p>
      </div>
    </div>
  </section>;
}
