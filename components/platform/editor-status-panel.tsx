"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

const STATUS_OPTIONS = [
  { value: "pending_editorial_check", label: "Pending" },
  { value: "under_review", label: "Under Review" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
  { value: "published", label: "Published" }
] as const;

type EditorStatusValue = (typeof STATUS_OPTIONS)[number]["value"];

export function EditorStatusPanel({
  articleId,
  currentStatus
}: {
  articleId?: string;
  currentStatus: EditorStatusValue | string;
}) {
  const router = useRouter();
  const [nextStatus, setNextStatus] = useState<EditorStatusValue>(
    (STATUS_OPTIONS.find((item) => item.value === currentStatus)?.value ?? "pending_editorial_check") as EditorStatusValue
  );
  const [note, setNote] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const isDisabled = useMemo(() => !articleId, [articleId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!articleId) {
      setError("Status editing requires a database-backed article record.");
      return;
    }

    setPending(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch(`/api/articles/${articleId}/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status: nextStatus,
          note: note.trim() || undefined
        })
      });

      const payload = (await response.json()) as { error?: { message?: string } };

      if (!response.ok) {
        throw new Error(payload.error?.message ?? "Unable to update article status.");
      }

      setMessage("Article status updated.");
      setNote("");
      router.refresh();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Unable to update article status.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="platform-panel rounded-[2rem] p-6 sm:p-7" onSubmit={handleSubmit}>
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Editor controls</p>
      <h2 className="display-title mt-3 text-3xl font-semibold leading-[0.98]">Manage article status</h2>
      <p className="mt-4 text-sm leading-7 text-muted">
        Editors can move submissions through the active publishing flow without switching desks or relying on removed multi-role review steps.
      </p>
      <div className="mt-6 grid gap-5">
        <label className="space-y-2 text-sm font-medium text-foreground">
          New status
          <select
            className="focus-ring h-12 w-full rounded-2xl border border-border bg-white/80 px-4 outline-none dark:bg-slate-950/45"
            disabled={pending || isDisabled}
            name="status"
            onChange={(event) => setNextStatus(event.target.value as EditorStatusValue)}
            value={nextStatus}
          >
            {STATUS_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm font-medium text-foreground">
          Editorial note
          <textarea
            className="focus-ring min-h-32 w-full rounded-[1.5rem] border border-border bg-white/80 px-4 py-3 outline-none dark:bg-slate-950/45"
            disabled={pending || isDisabled}
            name="note"
            onChange={(event) => setNote(event.target.value)}
            placeholder="Summarise why the status changed and what the author should expect next."
            value={note}
          />
        </label>
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-muted">
          {error ? (
            <span className="text-rose-700 dark:text-rose-300">{error}</span>
          ) : message ? (
            <span className="text-emerald-700 dark:text-emerald-300">{message}</span>
          ) : isDisabled ? (
            "This fallback workflow preview is read-only until the article is backed by the database."
          ) : (
            "Use this panel to keep the author-facing submission state aligned with editorial reality."
          )}
        </p>
        <Button disabled={pending || isDisabled} type="submit">
          {pending ? "Saving..." : "Update status"}
        </Button>
      </div>
    </form>
  );
}
