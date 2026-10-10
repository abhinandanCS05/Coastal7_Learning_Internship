import { MessageCircle, Send, X } from "lucide-react";
import { useCallback, useState } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { useAuth } from "../context/AuthContext";

type ChatMessage = {
  id: string;
  message: string;
  sender_name?: string;
  sender_role?: string;
};

export default function SupportChat({ placement = "floating" }: { placement?: "header" | "floating" } = {}) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const auth = useAuth() as { user?: { role?: string; full_name?: string } } | null;
  const user = auth?.user;
  const token = localStorage.getItem("zetA_token");
  const isAdmin = user?.role === "admin";

  const handleMessage = useCallback((data: unknown) => {
    if (!data || typeof data !== "object") return;

    const event = data as Record<string, unknown>;

    if (event.event !== "chat_message") return;

    setMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        message: String(event.message ?? ""),
        sender_name: String(event.sender_name ?? "Support"),
        sender_role: String(event.sender_role ?? ""),
      },
    ]);
  }, []);

  const wsPath = isAdmin ? "/ws/admin" : "/ws/orders";

  const { status, send } = useWebSocket(wsPath, {
    enabled: open && Boolean(token),
    reconnect: true,
    maxRetries: 8,
    baseDelay: 1000,
    maxDelay: 30000,
    onMessage: handleMessage,
  });

  const sendMessage = () => {
    const trimmed = message.trim();

    if (!trimmed) return;

    if (isAdmin) {
      const targetUserId = window.prompt("Enter customer User ID:");

      if (!targetUserId) return;

      const parsedUserId = Number(targetUserId);

      if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
        window.alert("Please enter a valid customer User ID.");
        return;
      }

      const sent = send({
        type: "chat_message",
        target_user_id: parsedUserId,
        message: trimmed,
      });

      if (sent) {
        setMessages((current) => [
          ...current,
          {
            id: crypto.randomUUID(),
            message: trimmed,
            sender_name: user?.full_name || "Admin",
            sender_role: "admin",
          },
        ]);
        setMessage("");
      }

      return;
    }

    const sent = send({
      type: "chat_message",
      message: trimmed,
    });

    if (sent) {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          message: trimmed,
          sender_name: "You",
          sender_role: "user",
        },
      ]);
      setMessage("");
    }
  };

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={placement === "header" ? "relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-indigo-200 bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 sm:px-4" : "fixed bottom-6 right-4 z-40 inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-700 sm:bottom-6 sm:right-6"}
        >
          <MessageCircle size={18} />
          {isAdmin ? "zetA Support" : "Support"}
        </button>
      )}

      {open && (
        <div className={placement === "header" ? "fixed right-4 top-20 z-[100] flex h-[min(520px,calc(100dvh-6rem))] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900 sm:right-6" : "fixed bottom-20 right-4 z-[100] flex h-[min(480px,calc(100vh-7rem))] w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900 sm:bottom-24 sm:right-6"}>
          <div className="flex items-center justify-between bg-indigo-600 px-4 py-3 text-white">
            <div>
              <div className="font-semibold">
                {isAdmin ? "Customer Support" : "zetA Support"}
              </div>
              <div className="text-xs opacity-80">
                {status === "connected"
                  ? "Connected"
                  : status === "connecting"
                    ? "Connecting..."
                    : status === "reconnecting"
                      ? "Reconnecting..."
                      : "Offline"}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded p-1 hover:bg-white/10"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.length === 0 && (
              <div className="py-16 text-center text-sm text-slate-500">
                {isAdmin
                  ? "Messages from customers will appear here."
                  : "Send a message to support."}
              </div>
            )}

            {messages.map((item) => (
              <div
                key={item.id}
                className="rounded-xl bg-slate-100 px-3 py-2 text-sm dark:bg-slate-800"
              >
                <div className="mb-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  {item.sender_name}
                </div>
                <div className="text-slate-700 dark:text-slate-200">
                  {item.message}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 border-t border-slate-200 p-3 dark:border-slate-700">
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") sendMessage();
              }}
              placeholder={
                isAdmin ? "Reply to customer..." : "Type your message..."
              }
              className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-600 dark:bg-slate-800"
            />

            <button
              type="button"
              onClick={sendMessage}
              disabled={status !== "connected"}
              className="rounded-lg bg-indigo-600 px-3 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send size={17} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}