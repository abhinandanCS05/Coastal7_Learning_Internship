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

type TaskStarter = () => Promise<{ task_id: string; status?: string }>;

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
        const token = localStorage.getItem("zetA_token");
        const response = await fetch(
          `${baseUrl}/day18/tasks/${encodeURIComponent(taskId)}`,
          {
            headers: token
              ? { Authorization: `Bearer ${token}` }
              : {},
          }
        );

        if (!response.ok) {
          throw new Error(`Unable to fetch task status (${response.status})`);
        }

        const data: BackgroundTaskState = await response.json();
        setTask(data);

        if (!data.ready) {
          timer.current = window.setTimeout(() => {
            void poll(taskId);
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

  const startTask = useCallback(
    async (starter: TaskStarter) => {
      stopPolling();
      const data = await starter();

      if (!data.task_id) {
        throw new Error("The server did not return a task ID.");
      }

      setTask({
        task_id: data.task_id,
        status: data.status || "QUEUED",
        ready: false,
      });

      void poll(data.task_id);
      return data;
    },
    [poll, stopPolling]
  );

  const start = useCallback(async () => {
    const token = localStorage.getItem("zetA_token");

    return startTask(async () => {
      const response = await fetch(`${baseUrl}/day18/tasks/demo`, {
        method: "POST",
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : {},
      });

      if (!response.ok) {
        throw new Error(`Unable to start background task (${response.status})`);
      }

      return response.json();
    });
  }, [baseUrl, startTask]);

  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return {
    task,
    start,
    startTask,
    poll,
    stop: stopPolling,
  };
}
