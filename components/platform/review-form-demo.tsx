"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";

export function ReviewFormDemo() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <form className="platform-panel rounded-[2rem] p-6 sm:p-7" onSubmit={handleSubmit}>
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Review form</p>
      <h2 className="display-title mt-3 text-3xl font-semibold leading-[0.98]">Confidential recommendation worksheet</h2>
      <div className="mt-6 grid gap-5">
        <label className="space-y-2 text-sm font-medium text-foreground">
          Recommendation
          <select className="focus-ring h-12 w-full rounded-2xl border border-border bg-white/80 px-4 outline-none dark:bg-slate-950/45" defaultValue="Minor revision">
            <option>Accept</option>
            <option>Minor revision</option>
            <option>Major revision</option>
          </select>
        </label>
        <label className="space-y-2 text-sm font-medium text-foreground">
          Confidence level
          <select className="focus-ring h-12 w-full rounded-2xl border border-border bg-white/80 px-4 outline-none dark:bg-slate-950/45" defaultValue="High">
            <option>High</option>
            <option>Moderate</option>
            <option>Exploratory</option>
          </select>
        </label>
        <label className="space-y-2 text-sm font-medium text-foreground">
          Notes to author
          <textarea
            className="focus-ring min-h-32 w-full rounded-[1.5rem] border border-border bg-white/80 px-4 py-3 outline-none dark:bg-slate-950/45"
            defaultValue="The framing is strong overall. Please tighten the paragraph on operational noise so that benchmark claims remain proportionate to the evidence cited."
          />
        </label>
        <label className="space-y-2 text-sm font-medium text-foreground">
          Confidential editor note
          <textarea
            className="focus-ring min-h-28 w-full rounded-[1.5rem] border border-border bg-white/80 px-4 py-3 outline-none dark:bg-slate-950/45"
            defaultValue="Recommend minor revision. The opening is excellent, but one sentence risks sounding stronger than the methods section supports."
          />
        </label>
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-muted">
          {submitted
            ? "The review packet has been marked as submitted in the current workflow layer."
            : "This reviewer form is structured to connect directly to the review submission API and service layer."}
        </p>
        <Button type="submit">Submit review</Button>
      </div>
    </form>
  );
}
