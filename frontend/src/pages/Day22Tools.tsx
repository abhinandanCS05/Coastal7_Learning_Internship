import { useCallback, useEffect, useState } from "react";
import api from "../services/api";

const card: React.CSSProperties = { border: "1px solid #e2e8f0", borderRadius: 14, padding: 18, background: "var(--card, #fff)", minWidth: 0 };
const field: React.CSSProperties = { width: "100%", boxSizing: "border-box", padding: "10px 12px", marginTop: 6, marginBottom: 12, border: "1px solid #cbd5e1", borderRadius: 8, font: "inherit" };
const btn: React.CSSProperties = { background: "#2563eb", color: "white", border: 0, borderRadius: 8, padding: "10px 14px", cursor: "pointer", fontWeight: 600 };
const json = (v: unknown) => typeof v === "string" ? v : JSON.stringify(v, null, 2);
const errorText = (e: any) => json(e?.response?.data?.detail ?? e?.message ?? "Request failed");

function Output({ value }: { value: unknown }) {
  return <pre style={{ background: "#0f172a", color: "#e2e8f0", padding: 12, borderRadius: 8, whiteSpace: "pre-wrap", overflowWrap: "anywhere", overflowX: "auto", fontSize: 13 }}>{json(value)}</pre>;
}

export default function Day22Tools() {
  const [userId, setUserId] = useState(localStorage.getItem("zetA_user_id") || "shopflow-user");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<unknown>(null);
  const [streamStatus, setStreamStatus] = useState("Idle");
  const [streamBusy, setStreamBusy] = useState(false);

  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(5);
  const [searchResult, setSearchResult] = useState<unknown>(null);
  const [searchBusy, setSearchBusy] = useState(false);

  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [draft, setDraft] = useState<unknown>(null);
  const [draftBusy, setDraftBusy] = useState(false);
  const [task, setTask] = useState<unknown>(null);
  const [taskBusy, setTaskBusy] = useState(false);

  const [usage, setUsage] = useState<unknown>(null);
  const [usageError, setUsageError] = useState("");
  const [usageBusy, setUsageBusy] = useState(false);

  const [orderId, setOrderId] = useState("");
  const [wsStatus, setWsStatus] = useState("Disconnected");
  const [events, setEvents] = useState<unknown[]>([]);
  const [wsError, setWsError] = useState("");
  const [reconnect, setReconnect] = useState(0);

  const stream = useCallback(async () => {
    if (!question.trim()) return;
    setStreamBusy(true); setAnswer(""); setSources(null); setStreamStatus("Connecting…");
    try {
      const base = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
      const token = localStorage.getItem("zetA_token");
      const res = await fetch(`${base}/ai/day22/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ question: question.trim(), user_id: userId.trim() || "shopflow-user" }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
      if (!res.body) throw new Error("Streaming body unavailable.");
      const reader = res.body.getReader(), decoder = new TextDecoder();
      let buffer = "", completed = false;
      setStreamStatus("Streaming");
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const frames = buffer.split(/\r?\n\r?\n/); buffer = frames.pop() ?? "";
        for (const frame of frames) {
          const data = frame.split(/\r?\n/).filter((line) => line.startsWith("data:")).map((line) => line.slice(5).trim()).join("\n");
          if (!data) continue;
          let event: any; try { event = JSON.parse(data); } catch { continue; }
          if (event.type === "token") setAnswer((old) => old + String(event.content ?? ""));
          else if (event.type === "sources") setSources(event.sources ?? event.content ?? []);
          else if (event.type === "done") { completed = true; setStreamStatus("Completed"); }
          else if (event.type === "error") throw new Error(String(event.message ?? event.content ?? "Stream failed"));
        }
      }
      if (!completed) setStreamStatus("Stream ended");
    } catch (e) { setStreamStatus("Failed"); setAnswer((old) => old || errorText(e)); }
    finally { setStreamBusy(false); }
  }, [question, userId]);

  const refreshUsage = useCallback(async () => {
    setUsageBusy(true); setUsageError("");
    try { const { data } = await api.get("/ai/day22/usage"); setUsage(data); }
    catch (e) { setUsageError(errorText(e)); }
    finally { setUsageBusy(false); }
  }, []);
  useEffect(() => { void refreshUsage(); }, [refreshUsage]);

  useEffect(() => {
    if (!orderId.trim()) return;
    const base = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
    const wsBase = base.replace(/^https:/, "wss:").replace(/^http:/, "ws:");
    const socket = new WebSocket(`${wsBase}/ai/day22/orders/${encodeURIComponent(orderId.trim())}`);
    setWsStatus("Connecting…"); setWsError("");
    socket.onopen = () => setWsStatus("Connected");
    socket.onmessage = (e) => { let value: unknown = e.data; try { value = JSON.parse(String(e.data)); } catch {} setEvents((old) => [value, ...old].slice(0, 30)); };
    socket.onerror = () => { setWsStatus("Connection error"); setWsError("Check the backend and order ID. Use only in a trusted development environment until WebSocket authorization is enforced."); };
    socket.onclose = () => setWsStatus((old) => old === "Connected" ? "Disconnected" : old);
    return () => socket.close();
  }, [reconnect]);

  const generateDraft = async () => {
    setDraftBusy(true); setDraft(null);
    try { const { data } = await api.post("/ai/day22/descriptions", { product_name: name.trim(), product_details: details.trim() }); setDraft(data); }
    catch (e) { setDraft({ error: errorText(e) }); } finally { setDraftBusy(false); }
  };
  const queueTask = async () => {
    setTaskBusy(true); setTask(null);
    try { const { data } = await api.post("/ai/day22/tasks/description", { product_name: name.trim(), product_details: details.trim() }); setTask(data); }
    catch (e) { setTask({ error: errorText(e) }); } finally { setTaskBusy(false); }
  };

  return <main style={{ maxWidth: 1280, margin: "0 auto", padding: 24, color: "var(--text, #0f172a)" }}>
    <header style={{ marginBottom: 22 }}>
      <p style={{ color: "#2563eb", fontWeight: 700, marginBottom: 6 }}>SHOPFLOW · DAY 22</p>
      <h1 style={{ fontSize: "clamp(26px, 4vw, 36px)", margin: "0 0 8px" }}>AI Integration & Live Operations</h1>
      <p style={{ color: "#64748b" }}>Streaming assistant, semantic search, description generation, Celery tasks, usage visibility, and live order events.</p>
    </header>
    <section style={{ ...card, marginBottom: 18 }}>
      <label>User ID for rate/usage tracking<input style={field} value={userId} onChange={(e) => setUserId(e.target.value)} /></label>
      <small style={{ color: "#64748b" }}>Use the user ID expected by your backend; this is not necessarily the login token.</small>
    </section>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 420px), 1fr))", gap: 18 }}>
      <section style={card}>
        <h2>1. Streaming AI assistant</h2><p>POST <code>/ai/day22/stream</code></p>
        <textarea style={field} rows={3} value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask a shopping or product question…" />
        <button style={btn} disabled={streamBusy || !question.trim()} onClick={() => void stream()}>{streamBusy ? "Receiving…" : "Ask with streaming"}</button>
        <p><b>Status:</b> {streamStatus}</p>{answer && <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{answer}</div>}
        {sources !== null && <><h3>Sources</h3><Output value={sources} /></>}
      </section>
      <section style={card}>
        <h2>2. Semantic product search</h2><p>POST <code>/ai/day22/search</code></p>
        <label>Query<input style={field} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. lightweight headphones for travel" /></label>
        <label>Result limit<input style={field} type="number" min={1} max={20} value={limit} onChange={(e) => setLimit(Number(e.target.value))} /></label>
        <button style={btn} disabled={searchBusy || !query.trim()} onClick={async () => { setSearchBusy(true); setSearchResult(null); try { const { data } = await api.post("/ai/day22/search", { query: query.trim(), limit: Math.min(20, Math.max(1, limit || 5)) }); setSearchResult(data); } catch (e) { setSearchResult({ error: errorText(e) }); } finally { setSearchBusy(false); } }}>{searchBusy ? "Searching…" : "Search products"}</button>
        {searchResult !== null && <Output value={searchResult} />}
      </section>
      <section style={card}>
        <h2>3. AI product description draft</h2><p>POST <code>/ai/day22/descriptions</code></p>
        <label>Product name<input style={field} value={name} onChange={(e) => setName(e.target.value)} placeholder="Wireless Bluetooth Headphones" /></label>
        <label>Product details<textarea style={field} rows={4} value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Features, specifications, audience, and use cases…" /></label>
        <button style={btn} disabled={draftBusy || !name.trim() || !details.trim()} onClick={() => void generateDraft()}>{draftBusy ? "Generating…" : "Generate draft"}</button>
        {draft !== null && <Output value={draft} />}
        <small style={{ color: "#64748b" }}>Generates a draft; does not save it to the catalogue.</small>
      </section>
      <section style={card}>
        <h2>4. Celery background generation</h2><p>POST <code>/ai/day22/tasks/description</code></p>
        <p>Queue the product description using the same product details above.</p>
        <button style={btn} disabled={taskBusy || !name.trim() || !details.trim()} onClick={() => void queueTask()}>{taskBusy ? "Queueing…" : "Queue description task"}</button>
        {task !== null && <Output value={task} />}
        <small style={{ color: "#64748b" }}>The task ID confirms queueing only. This router does not currently expose task status/completion.</small>
      </section>
      <section style={card}>
        <h2>5. Usage & quota visibility</h2><p>GET <code>/ai/day22/usage</code></p>
        <button style={btn} disabled={usageBusy} onClick={() => void refreshUsage()}>{usageBusy ? "Refreshing…" : "Refresh usage"}</button>
        {usageError && <p role="alert" style={{ color: "#b91c1c" }}>{usageError}</p>}
        {usage !== null && <Output value={usage} />}
        <small style={{ color: "#64748b" }}>Backend counters are process-local estimates, not billing-grade shared totals.</small>
      </section>
      <section style={card}>
        <h2>6. Live order updates</h2><p>WebSocket <code>/ai/day22/orders/{"{order_id}"}</code></p>
        <label>Order ID<input style={field} value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="Enter an order ID" /></label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button style={btn} disabled={!orderId.trim()} onClick={() => { setEvents([]); setReconnect((n) => n + 1); }}>Connect / reconnect</button>
          <button style={{ ...btn, background: "#475569" }} onClick={() => setEvents([])}>Clear events</button>
        </div>
        <p><b>Connection:</b> {wsStatus}</p>{wsError && <p role="alert" style={{ color: "#b91c1c" }}>{wsError}</p>}
        {events.length ? <Output value={events} /> : <p style={{ color: "#64748b" }}>Incoming order events appear here.</p>}
        <small style={{ color: "#b45309" }}>Keep this in a trusted development environment until WebSocket order authorization is enforced.</small>
      </section>
    </div>
  </main>;
}
