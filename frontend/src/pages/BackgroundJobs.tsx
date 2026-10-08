import { useState } from "react";
import { useBackgroundTask } from "../hooks/useBackgroundTask";

export default function BackgroundJobs() {
  const { task, start } = useBackgroundTask();
  const [starting, setStarting] = useState(false);

  const runJob = async () => {
    setStarting(true);

    try {
      await start();
    } catch (error) {
      console.error("Failed to start background job:", error);
    } finally {
      setStarting(false);
    }
  };

  const progress =
    task?.ready && task?.status === "SUCCESS"
      ? 100
      : Math.max(
          0,
          Math.min(100, task?.progress?.percent ?? 0)
        );

  const isRunning = Boolean(task && !task.ready);

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Background Jobs
        </h1>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Track asynchronous Celery jobs directly from the React UI.
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Demo Background Task
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Trigger → queue → process → poll → complete
            </p>
          </div>

          <button
            type="button"
            onClick={runJob}
            disabled={starting || isRunning}
            className="rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {starting || isRunning
              ? "Processing..."
              : "Run Background Job"}
          </button>
        </div>

        {task && (
          <div className="mt-6 space-y-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-300">
                Status:{" "}
                <strong className="text-slate-900 dark:text-white">
                  {task.status}
                </strong>
              </span>

              <span className="font-semibold text-indigo-600">
                {progress}%
              </span>
            </div>

            <div className="h-4 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            {task.progress?.message && (
              <div className="rounded-xl bg-indigo-50 p-4 text-sm text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
                {task.progress.message}
              </div>
            )}

            {task.result !== undefined && (
              <div className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                <div className="font-semibold">
                  ✓ Background task completed successfully
                </div>

                <div className="mt-1">
                  Celery worker finished the job and returned a result.
                </div>
              </div>
            )}

            {task.error && (
              <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
                <div className="font-semibold">
                  Background task failed
                </div>

                <div className="mt-1">
                  {task.error}
                </div>
              </div>
            )}

            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Task ID
              </div>

              <div className="mt-1 break-all font-mono text-xs text-slate-700 dark:text-slate-300">
                {task.task_id}
              </div>
            </div>
          </div>
        )}

        {!task && (
          <div className="mt-6 rounded-xl border border-dashed p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            No background jobs running.
            <br />
            Click <strong>Run Background Job</strong> to start a Celery task.
          </div>
        )}
      </div>
    </div>
  );
}
