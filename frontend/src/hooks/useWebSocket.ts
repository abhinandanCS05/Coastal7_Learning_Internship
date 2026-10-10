import { useCallback, useEffect, useRef, useState } from "react";

type WebSocketStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "disconnected"
  | "error";

type UseWebSocketOptions = {
  enabled?: boolean;
  reconnect?: boolean;
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  onMessage?: (data: unknown) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: () => void;
};

const WS_BASE =
  import.meta.env.VITE_WS_URL || "ws://127.0.0.1:8000";

export function useWebSocket(
  path: string,
  options: UseWebSocketOptions = {}
) {
  const {
    enabled = true,
    reconnect = true,
    maxRetries = 6,
    baseDelay = 1000,
    maxDelay = 30000,
    onMessage,
    onOpen,
    onClose,
    onError,
  } = options;

  const socketRef = useRef<WebSocket | null>(null);
  const retryRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stoppedRef = useRef(false);

  const [status, setStatus] = useState<WebSocketStatus>("idle");

  const connect = useCallback(() => {
    if (!enabled || stoppedRef.current) return;

    const token = localStorage.getItem("zetA_token");

    if (!token) {
      setStatus("disconnected");
      return;
    }

    if (
      socketRef.current &&
      socketRef.current.readyState === WebSocket.OPEN
    ) {
      return;
    }

    setStatus(retryRef.current > 0 ? "reconnecting" : "connecting");

    const separator = path.includes("?") ? "&" : "?";
    const url = `${WS_BASE}${path}${separator}token=${encodeURIComponent(token)}`;

    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => {
      retryRef.current = 0;
      setStatus("connected");
      onOpen?.();
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage?.(data);
      } catch {
        onMessage?.(event.data);
      }
    };

    socket.onerror = () => {
      setStatus("error");
      onError?.();
    };

    socket.onclose = () => {
      socketRef.current = null;
      onClose?.();

      if (
        !stoppedRef.current &&
        enabled &&
        reconnect &&
        retryRef.current < maxRetries
      ) {
        const delay = Math.min(
          baseDelay * Math.pow(2, retryRef.current),
          maxDelay
        );

        retryRef.current += 1;
        setStatus("reconnecting");

        timerRef.current = setTimeout(() => {
          connect();
        }, delay);
      } else {
        setStatus("disconnected");
      }
    };
  }, [
    enabled,
    path,
    reconnect,
    maxRetries,
    baseDelay,
    maxDelay,
    onMessage,
    onOpen,
    onClose,
    onError,
  ]);

  const send = useCallback((data: unknown) => {
    const socket = socketRef.current;

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      return false;
    }

    socket.send(
      typeof data === "string" ? data : JSON.stringify(data)
    );

    return true;
  }, []);

  const disconnect = useCallback(() => {
    stoppedRef.current = true;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    socketRef.current?.close();
    socketRef.current = null;
    setStatus("disconnected");
  }, []);

  useEffect(() => {
    stoppedRef.current = false;
    retryRef.current = 0;

    connect();

    return () => {
      stoppedRef.current = true;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [connect]);

  return {
    status,
    send,
    connect,
    disconnect,
    reconnectCount: retryRef.current,
  };
}
