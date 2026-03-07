"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <form className="editorial-card space-y-5 rounded-[2rem] p-6 sm:p-8" onSubmit={handleSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-foreground">
          Full name
          <input className="focus-ring h-12 w-full rounded-2xl border border-border bg-white/80 px-4 outline-none dark:bg-slate-950/45" required type="text" />
        </label>
        <label className="space-y-2 text-sm font-medium text-foreground">
          Email address
          <input className="focus-ring h-12 w-full rounded-2xl border border-border bg-white/80 px-4 outline-none dark:bg-slate-950/45" required type="email" />
        </label>
      </div>
      <label className="space-y-2 text-sm font-medium text-foreground">
        Subject
        <input className="focus-ring h-12 w-full rounded-2xl border border-border bg-white/80 px-4 outline-none dark:bg-slate-950/45" required type="text" />
      </label>
      <label className="space-y-2 text-sm font-medium text-foreground">
        Message
        <textarea className="focus-ring min-h-40 w-full rounded-[1.5rem] border border-border bg-white/80 px-4 py-3 outline-none dark:bg-slate-950/45" required />
      </label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          {submitted
            ? "Message captured in the current frontend layer. Connect this form to the profile and notification services to route inquiries to the editorial desk."
            : "Use this form for editorial questions, partnership requests, or speaking opportunities."}
        </p>
        <Button type="submit">Send message</Button>
      </div>
    </form>
  );
}
