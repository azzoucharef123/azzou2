"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";

export function SubmissionForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <form className="editorial-card space-y-5 rounded-[2rem] p-6 sm:p-8" onSubmit={handleSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-foreground">
          Contributor name
          <input className="focus-ring h-12 w-full rounded-2xl border border-border bg-white/80 px-4 outline-none dark:bg-slate-950/45" required type="text" />
        </label>
        <label className="space-y-2 text-sm font-medium text-foreground">
          Email address
          <input className="focus-ring h-12 w-full rounded-2xl border border-border bg-white/80 px-4 outline-none dark:bg-slate-950/45" required type="email" />
        </label>
      </div>
      <label className="space-y-2 text-sm font-medium text-foreground">
        Proposed topic area
        <select className="focus-ring h-12 w-full rounded-2xl border border-border bg-white/80 px-4 outline-none dark:bg-slate-950/45" defaultValue="Physics">
          <option>Physics</option>
          <option>Chemistry</option>
          <option>Research Summaries</option>
          <option>Technology & Innovation</option>
          <option>Laboratory World</option>
          <option>Education</option>
        </select>
      </label>
      <label className="space-y-2 text-sm font-medium text-foreground">
        Proposed title
        <input className="focus-ring h-12 w-full rounded-2xl border border-border bg-white/80 px-4 outline-none dark:bg-slate-950/45" required type="text" />
      </label>
      <label className="space-y-2 text-sm font-medium text-foreground">
        Target audience
        <input className="focus-ring h-12 w-full rounded-2xl border border-border bg-white/80 px-4 outline-none dark:bg-slate-950/45" placeholder="e.g. General public, Researchers, Students" type="text" />
      </label>
      <label className="space-y-2 text-sm font-medium text-foreground">
        Abstract or pitch
        <textarea className="focus-ring min-h-40 w-full rounded-[1.5rem] border border-border bg-white/80 px-4 py-3 outline-none dark:bg-slate-950/45" required />
      </label>
      <label className="space-y-2 text-sm font-medium text-foreground">
        Full manuscript
        <input
          accept=".pdf,.docx,.doc"
          className="focus-ring h-14 w-full rounded-2xl border border-border bg-white/80 px-4 py-3 text-sm outline-none file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-blue-700 hover:file:bg-blue-100 dark:bg-slate-950/45 dark:file:bg-slate-900 dark:file:text-sky-300"
          type="file"
        />
      </label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          {submitted
            ? "Submission captured in the current frontend layer. Connect this form to the article creation and submission API routes to persist the manuscript."
            : "Short, evidence-led pitches are preferred. Include your angle, sources, and why the subject matters now."}
        </p>
        <Button type="submit">Submit pitch</Button>
      </div>
    </form>
  );
}
