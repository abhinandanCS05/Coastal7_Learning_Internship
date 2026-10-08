import { Bell, CheckCheck, X } from "lucide-react";
import { useState } from "react";
import { useNotificationStore } from "../store/notificationStore";

export default function NotificationPanel() {
  const [open, setOpen] = useState(false);

  const {
    notifications,
    markAllRead,
    removeNotification,
  } = useNotificationStore();

  const unread = notifications.filter((item) => !item.read).length;

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => setOpen((value) => !value)}
        className="relative rounded-xl border p-2 transition hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <Bell size={18} />

        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-80 rounded-2xl border bg-white p-3 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold">Notifications</h3>
              <p className="text-xs text-slate-500">
                Real-time ShopFlow updates
              </p>
            </div>

            <button
              type="button"
              onClick={markAllRead}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Mark all as read"
            >
              <CheckCheck size={17} />
            </button>
          </div>

          {notifications.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500">
              No new notifications
            </div>
          ) : (
            <div className="max-h-80 space-y-2 overflow-y-auto">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-xl border p-3 ${
                    item.read
                      ? "opacity-70"
                      : "bg-indigo-50 dark:bg-indigo-950/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold">
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                        {item.message}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-400">
                        {new Date(item.createdAt).toLocaleTimeString()}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeNotification(item.id)}
                      aria-label="Dismiss notification"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
