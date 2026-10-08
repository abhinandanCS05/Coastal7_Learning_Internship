import { useCallback, useEffect, useRef, useState } from "react";

export type BackgroundTaskState = {
  task_id: string;
  status: string;
  ready: boolean;
  progress?: {
    current?: number;
    total?: number;
    percent?: number;
    message?: string;
  };
  result?: unknown;
  error?: string;
};

export function useBackgroundTask(
  baseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"
) {
  const [task, setTask] = useState<BackgroundTaskState | null>(null);
  const timer = useRef<number | null>(null);

  const stopPolling = useCallback(() => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const poll = useCallback(
    async (taskId: string) => {
      try {
        const token = localStorage.getItem("shopflow_token");

        const response = await fetch(
          `${baseUrl}/day18/tasks/${taskId}`,
          {
            headers: token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {},
          }
        );

        if (!response.ok) {
          throw new Error("Unable to fetch task status");
        }

        const data = await response.json();

        setTask(data);

        if (!data.ready) {
          timer.current = window.setTimeout(() => {
            poll(taskId);
          }, 1000);
        } else {
          timer.current = null;
        }
      } catch (error) {
        setTask({
          task_id: taskId,
          status: "ERROR",
          ready: true,
          error:
            error instanceof Error
              ? error.message
              : "Task polling failed",
        });

        timer.current = null;
      }
    },
    [baseUrl]
  );

  const start = useCallback(async () => {
    stopPolling();

    const token = localStorage.getItem("shopflow_token");

    const response = await fetch(
      `${baseUrl}/day18/tasks/demo`,
      {
        method: "POST",
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      }
    );

    if (!response.ok) {
      throw new Error("Unable to start background task");
    }

    const data = await response.json();

    setTask({
      task_id: data.task_id,
      status: data.status || "QUEUED",
      ready: false,
    });

    await poll(data.task_id);
  }, [baseUrl, poll, stopPolling]);

  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return {
    task,
    start,
    stop: stopPolling,
  };
}
