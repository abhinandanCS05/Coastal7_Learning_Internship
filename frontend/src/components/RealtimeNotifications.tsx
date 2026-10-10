import { useCallback } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { useNotificationStore } from "../store/notificationStore";
import { useAuth } from "../context/AuthContext";

export default function RealtimeNotifications() {
  const auth = useAuth() as {
    user?: {
      role?: string;
      full_name?: string;
    };
  } | null;

  const user = auth?.user;

  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );

  const handleMessage = useCallback(
    (data: unknown) => {
      if (!data || typeof data !== "object") return;

      const event = data as Record<string, unknown>;

      const eventName =
        typeof event.event === "string"
          ? event.event
          : typeof event.type === "string"
            ? event.type
            : "system";

      if (
        eventName === "order_updated" ||
        eventName === "order_update" ||
        eventName === "order_status" ||
        eventName === "notification" ||
        eventName === "chat_message"
      ) {
        const order =
          event.order && typeof event.order === "object"
            ? (event.order as Record<string, unknown>)
            : null;

        const orderStatus =
          order && typeof order.status === "string"
            ? order.status
            : typeof event.status === "string"
              ? event.status
              : null;

        addNotification({
          title:
            typeof event.title === "string"
              ? event.title
              : eventName === "order_updated" ||
                  eventName === "order_update" ||
                  eventName === "order_status"
                ? "Order updated"
                : eventName === "chat_message"
                  ? "New support message"
                  : "zetA update",

          message:
            typeof event.message === "string"
              ? event.message
              : orderStatus
                ? `Order status changed to ${orderStatus}`
                : eventName === "order_updated"
                  ? "Your order has been updated."
                  : "You have a new real-time update.",

          type:
            eventName === "chat_message"
              ? "chat"
              : eventName === "order_updated" ||
                  eventName === "order_update" ||
                  eventName === "order_status"
                ? "order"
                : "system",
        });
      }
    },
    [addNotification]
  );

  const wsPath = user?.role === "admin" ? "/ws/admin" : "/ws/orders";

  useWebSocket(wsPath, {
    enabled: Boolean(localStorage.getItem("zetA_token")) && Boolean(user),
    reconnect: true,
    maxRetries: 8,
    baseDelay: 1000,
    maxDelay: 30000,
    onMessage: handleMessage,
  });

  return null;
}