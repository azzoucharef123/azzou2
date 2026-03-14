
"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AcceptedManuscriptRecord } from "@/types/accepted-manuscript";

const EMPTY_STATE: AcceptedManuscriptRecord = {
  title: "",
  authors: "",
  submissionDate: "",
  reviewDate: "",
  acceptanceDate: "",
  publicationDate: "",
  abstract: "",
  purchasePrice: ""
};

export function AcceptedManuscriptForm({
  initialData,
  canPersist
}: {
  initialData: AcceptedManuscriptRecord | null;
  canPersist: boolean;
}) {
  const router = useRouter();
  const [form, setForm] = useState<AcceptedManuscriptRecord>(initialData ?? EMPTY_STATE);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const metadata = useMemo(
    () => [
      ["Authors", form.authors || "Not entered yet"],
      ["Submission date", form.submissionDate || "Not entered yet"],
      ["Review date", form.reviewDate || "Not entered yet"],
      ["Acceptance date", form.acceptanceDate || "Not entered yet"],
      ["Publication date", form.publicationDate || "Not entered yet"],
      ["Purchase price", form.purchasePrice || "Not entered yet"]
    ],
    [form]
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canPersist) {
      setError("DATABASE_URL is not configured, so the homepage manuscript cannot be saved yet.");
      return;
    }

    setIsSaving(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/accepted-manuscript", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const payload = (await response.json()) as { error?: { message?: string } };

      if (!response.ok) {
        throw new Error(payload.error?.message ?? "Unable to save the accepted manuscript.");
      }

      setMessage("The accepted manuscript has been updated on the homepage.");
      router.refresh();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Unable to save the accepted manuscript.");
    } finally {
      setIsSaving(false);
    }
  }

  function updateField<Key extends keyof AcceptedManuscriptRecord>(key: Key, value: AcceptedManuscriptRecord[Key]) {
    setForm((current) => ({
      ...current,
      [key]: value
    }));
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <form className="platform-panel rounded-[2rem] p-6 sm:p-7" onSubmit={handleSubmit}>
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Homepage publishing form</p>
        <h2 className="display-title mt-3 text-3xl font-semibold leading-[0.98]">Accepted manuscript details</h2>
        <p className="mt-4 text-sm leading-7 text-muted">
          Enter the manuscript data exactly as you want it to appear on the homepage spotlight.
        </p>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-foreground md:col-span-2">
            Title
            <input className="focus-ring h-12 w-full rounded-2xl border border-border bg-white/80 px-4 outline-none dark:bg-slate-950/45" onChange={(event) => updateField("title", event.target.value)} required type="text" value={form.title} />
          </label>
          <label className="space-y-2 text-sm font-medium text-foreground md:col-span-2">
            Authors
            <input className="focus-ring h-12 w-full rounded-2xl border border-border bg-white/80 px-4 outline-none dark:bg-slate-950/45" onChange={(event) => updateField("authors", event.target.value)} required type="text" value={form.authors} />
          </label>
          <label className="space-y-2 text-sm font-medium text-foreground">
            Submission date
            <input className="focus-ring h-12 w-full rounded-2xl border border-border bg-white/80 px-4 outline-none dark:bg-slate-950/45" onChange={(event) => updateField("submissionDate", event.target.value)} required type="date" value={form.submissionDate} />
          </label>
          <label className="space-y-2 text-sm font-medium text-foreground">
            Review date
            <input className="focus-ring h-12 w-full rounded-2xl border border-border bg-white/80 px-4 outline-none dark:bg-slate-950/45" onChange={(event) => updateField("reviewDate", event.target.value)} required type="date" value={form.reviewDate} />
          </label>
          <label className="space-y-2 text-sm font-medium text-foreground">
            Acceptance date
            <input className="focus-ring h-12 w-full rounded-2xl border border-border bg-white/80 px-4 outline-none dark:bg-slate-950/45" onChange={(event) => updateField("acceptanceDate", event.target.value)} required type="date" value={form.acceptanceDate} />
          </label>
          <label className="space-y-2 text-sm font-medium text-foreground">
            Publication date
            <input className="focus-ring h-12 w-full rounded-2xl border border-border bg-white/80 px-4 outline-none dark:bg-slate-950/45" onChange={(event) => updateField("publicationDate", event.target.value)} required type="date" value={form.publicationDate} />
          </label>
          <label className="space-y-2 text-sm font-medium text-foreground md:col-span-2">
            Abstract
            <textarea className="focus-ring min-h-40 w-full rounded-[1.5rem] border border-border bg-white/80 px-4 py-3 outline-none dark:bg-slate-950/45" onChange={(event) => updateField("abstract", event.target.value)} required value={form.abstract} />
          </label>
          <label className="space-y-2 text-sm font-medium text-foreground md:col-span-2">
            Purchase price
            <input className="focus-ring h-12 w-full rounded-2xl border border-border bg-white/80 px-4 outline-none dark:bg-slate-950/45" onChange={(event) => updateField("purchasePrice", event.target.value)} required type="text" value={form.purchasePrice} />
          </label>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-muted">
            {error ? (
              <span className="text-rose-700 dark:text-rose-300">{error}</span>
            ) : message ? (
              <span className="text-emerald-700 dark:text-emerald-300">{message}</span>
            ) : canPersist ? (
              "Saving updates the public homepage spotlight immediately for future visitors."
            ) : (
              "The form is ready, but database configuration is still required before saving becomes available."
            )}
          </p>
          <Button disabled={isSaving || !canPersist} type="submit">
            {isSaving ? "Saving..." : "Save to homepage"}
          </Button>
        </div>
      </form>

      <div className="platform-panel rounded-[2rem] p-6 sm:p-7">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Live preview</p>
        <h2 className="display-title mt-3 text-3xl font-semibold leading-[0.98]">Homepage manuscript card</h2>
        <div className="mt-6 space-y-5 rounded-[1.6rem] border border-border bg-white/70 p-5 dark:bg-slate-950/35">
          <div className="space-y-3">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-blue-700 dark:text-sky-300">Accepted manuscript</p>
            <h3 className="display-title text-[2rem] font-semibold leading-[0.98]">{form.title || "Your manuscript title will appear here"}</h3>
            <p className="text-sm leading-7 text-muted">{form.abstract || "The manuscript abstract will appear here once you enter it."}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {metadata.map(([label, value]) => (
              <div className="rounded-[1.2rem] border border-border bg-white/75 p-4 dark:bg-slate-950/40" key={label}>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted">{label}</p>
                <p className="mt-2 text-sm leading-6 text-foreground/84">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
