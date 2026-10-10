import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Bot, Check, ChevronRight, CircleHelp, LoaderCircle, Send, Sparkles, UserRound, X } from "lucide-react";

type Source = {
  product_id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  distance?: number | null;
};
type Message = {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  provider?: string;
  pending?: boolean;
};

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const SUGGESTIONS = [
  "Show me the best-rated products",
  "Find products under Rs. 2,000",
  "Compare products in the same category",
  "Which products have discounts?",
];

function money(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm the zetA AI Shopping Assistant. Ask me about products, prices, categories, stock, ratings, or offers. I'll retrieve catalogue records and show the sources used for my answer.",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [provider, setProvider] = useState("");
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  useEffect(() => () => abortRef.current?.abort(), []);

  async function sendMessage(text: string) {
    const question = text.trim();
    if (!question || sending) return;
    const token = localStorage.getItem("zetA_token");
    if (!token) {
      setError("Your session is missing. Please sign in again to use the AI assistant.");
      return;
    }

    setError("");
    setInput("");
    setSending(true);
    setProvider("");
    const history = messages
      .filter((item) => !item.pending && item.content.trim())
      .slice(-8)
      .map(({ role, content }) => ({ role, content }));
    setMessages((current) => [
      ...current,
      { role: "user", content: question },
      { role: "assistant", content: "", sources: [], pending: true },
    ]);

    const controller = new AbortController();
    abortRef.current = controller;
    let answer = "";
    let sources: Source[] = [];
    let activeProvider = "";

    try {
      const response = await fetch(`${API_URL}/ai/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "text/event-stream",
        },
        body: JSON.stringify({ message: question, history }),
        signal: controller.signal,
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.detail || `AI request failed (${response.status})`);
      }
      if (!response.body) throw new Error("Streaming is not supported by this response.");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let finished = false;

      while (!finished) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const frames = buffer.split("\n\n");
        buffer = frames.pop() || "";

        for (const frame of frames) {
          const line = frame.split("\n").find((entry) => entry.startsWith("data: "));
          if (!line) continue;
          let event: any;
          try {
            event = JSON.parse(line.slice(6));
          } catch {
            continue;
          }
          if (event.type === "sources") {
            sources = event.sources || [];
            setMessages((current) => current.map((item, index) =>
              index === current.length - 1 && item.role === "assistant"
                ? { ...item, sources }
                : item
            ));
          } else if (event.type === "provider") {
            activeProvider = event.provider || "";
            setProvider(activeProvider);
          } else if (event.type === "token") {
            answer += event.content || "";
            const currentAnswer = answer;
            setMessages((current) => current.map((item, index) =>
              index === current.length - 1 && item.role === "assistant"
                ? { ...item, content: currentAnswer, pending: true, sources }
                : item
            ));
          } else if (event.type === "error") {
            throw new Error(event.message || "AI provider failed.");
          } else if (event.type === "done") {
            finished = true;
          }
        }
      }

      setMessages((current) => current.map((item, index) =>
        index === current.length - 1 && item.role === "assistant"
          ? { ...item, content: answer || "I couldn't generate an answer for that question.", sources, provider: activeProvider, pending: false }
          : item
      ));
    } catch (err: any) {
      if (err?.name !== "AbortError") {
        const message = err?.message || "Unable to reach the AI service.";
        setError(message);
        setMessages((current) => {
          const last = current[current.length - 1];
          if (last?.role === "assistant" && last.pending) {
            const partial = last.content ? `${last.content}\\n\\n[Stream interrupted: ${message}]` : `I couldn't complete that request. ${message}`;
            return [...current.slice(0, -1), { role: "assistant", content: partial, sources, provider: activeProvider, pending: false }];
          }
          return current;
        });
      }
    } finally {
      setSending(false);
      abortRef.current = null;
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  function stopGeneration() {
    abortRef.current?.abort();
    setSending(false);
    setMessages((current) => current.map((item, index) =>
      index === current.length - 1 && item.role === "assistant" && item.pending
        ? { ...item, pending: false, content: item.content || "Generation stopped." }
        : item
    ));
  }

  return (
    <div className="mx-auto grid min-h-[calc(100vh-150px)] max-w-7xl gap-5 px-3 py-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:px-6">
      <section className="flex min-h-[72vh] min-w-0 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <header className="flex items-center gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lime-200 text-slate-950">
            <Sparkles size={21} />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-bold tracking-tight">AI Product Assistant</h1>
            <p className="text-xs text-slate-500">Catalogue-grounded answers - live streaming</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            RAG enabled
          </span>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">
          {messages.map((message, index) => (
            <div key={`${index}-${message.role}`} className={`flex items-start gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${message.role === "assistant" ? "bg-slate-950 text-lime-200 dark:bg-slate-800" : "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-200"}`}>
                {message.role === "assistant" ? <Bot size={18} /> : <UserRound size={18} />}
              </div>
              <div className={`min-w-0 max-w-[88%] ${message.role === "user" ? "text-right" : ""}`}>
                <div className={`inline-block whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-left text-sm leading-6 ${message.role === "user" ? "rounded-tr-md bg-indigo-600 text-white" : "rounded-tl-md bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100"}`}>
                  {message.content || (message.pending ? <span className="inline-flex items-center gap-2 text-slate-500"><LoaderCircle size={15} className="animate-spin" />Thinking through the catalogue...</span> : "")}
                  {message.pending && message.content && <span className="ml-1 inline-block h-4 w-1 animate-pulse rounded bg-lime-500 align-middle" />}
                </div>
                {message.role === "assistant" && message.sources && message.sources.length > 0 && (
                  <div className="mt-3 space-y-2 text-left">
                    <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500"><Check size={13} /> Sources from product catalogue</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {message.sources.map((source) => (
                        <div key={source.product_id} className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-semibold">{source.name}</p>
                            <span className="shrink-0 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">#{source.product_id}</span>
                          </div>
                          <p className="mt-1 text-xs text-slate-500">{source.category || "Catalogue item"} - {money(source.price)}</p>
                          <p className="mt-1 text-xs text-slate-500">{source.stock > 0 ? `${source.stock} in stock` : "Stock unavailable"}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {message.role === "assistant" && message.provider && !message.pending && (
                  <p className="mt-2 text-[11px] text-slate-400">Answered by {message.provider} - sourced from catalogue retrieval</p>
                )}
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>

        {error && (
          <div role="alert" className="mx-4 mb-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
            <CircleHelp size={17} className="mt-0.5 shrink-0" />
            <span>{error}</span>
            <button onClick={() => setError("")} className="ml-auto" aria-label="Dismiss error"><X size={16} /></button>
          </div>
        )}

        <div className="border-t border-slate-200 p-3 sm:p-4 dark:border-slate-800">
          <form onSubmit={onSubmit} className="flex items-end gap-2 rounded-2xl border border-slate-300 bg-slate-50 p-2 focus-within:border-indigo-400 dark:border-slate-700 dark:bg-slate-950">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void sendMessage(input);
                }
              }}
              rows={1}
              maxLength={1500}
              placeholder="Ask about products, prices, stock or offers..."
              aria-label="Ask the AI product assistant"
              className="max-h-32 min-h-10 flex-1 resize-y bg-transparent px-3 py-2 text-sm outline-none"
              disabled={sending}
            />
            {sending ? (
              <button type="button" onClick={stopGeneration} title="Stop generation" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-white"><X size={18} /></button>
            ) : (
              <button type="submit" disabled={!input.trim()} title="Send message" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-lime-200 transition hover:bg-indigo-600 disabled:opacity-40 dark:bg-lime-300 dark:text-slate-950"><Send size={17} /></button>
            )}
          </form>
          <p className="mt-2 px-1 text-[11px] text-slate-400">AI answers can be imperfect. Check the linked product details before purchasing. Press Enter to send, Shift+Enter for a new line.</p>
        </div>
      </section>

      <aside className="space-y-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 text-sm font-bold"><Sparkles size={17} className="text-indigo-600" /> Try asking</div>
          <div className="mt-3 space-y-2">
            {SUGGESTIONS.map((suggestion) => (
              <button key={suggestion} disabled={sending} onClick={() => void sendMessage(suggestion)} className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 px-3 py-3 text-left text-xs font-medium transition hover:border-indigo-300 hover:bg-indigo-50 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800">
                {suggestion}<ChevronRight size={14} className="shrink-0" />
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-3xl bg-slate-950 p-5 text-white dark:bg-slate-800">
          <div className="flex items-center gap-2 font-bold"><Check size={17} className="text-lime-300" /> How it works</div>
          <ol className="mt-4 space-y-3 text-xs leading-5 text-slate-300">
            <li><span className="mr-2 font-bold text-lime-300">01</span> Your question is embedded and matched against catalogue records in ChromaDB.</li>
            <li><span className="mr-2 font-bold text-lime-300">02</span> Retrieved product context is added to a grounded prompt.</li>
            <li><span className="mr-2 font-bold text-lime-300">03</span> The selected LLM streams its answer over Server-Sent Events.</li>
            <li><span className="mr-2 font-bold text-lime-300">04</span> Product sources are shown beside the answer for traceability.</li>
          </ol>
        </div>
      </aside>
    </div>
  );
}
