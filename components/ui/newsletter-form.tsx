"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";

export function NewsletterForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="editorial-card relative overflow-hidden rounded-[2.3rem] p-6 sm:p-9">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(23,78,207,.12),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,.12),transparent_24%)]" />
      <div className="relative space-y-4">
        <span className="eyebrow">Newsletter</span>
        <h3 className="display-title text-4xl font-semibold leading-[0.96] sm:text-[3.3rem]">Receive each issue’s sharpest reporting first.</h3>
        <p className="max-w-2xl body-copy text-lg leading-8 text-muted">
          Weekly editorial notes, selected research briefings, and issue releases delivered in measured language for readers who prefer signal over noise.
        </p>
      </div>
      <form className="relative mt-8 flex flex-col gap-4 sm:flex-row" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="newsletter-email">
          Email address
        </label>
        <input
          className="focus-ring h-12 flex-1 rounded-full border border-border bg-white/80 px-5 text-sm outline-none placeholder:text-muted dark:bg-slate-950/45"
          id="newsletter-email"
          name="email"
          placeholder="Enter your editorial email"
          required
          type="email"
        />
        <Button className="h-12 px-6" type="submit">
          Subscribe
        </Button>
      </form>
      <p className="relative mt-4 text-sm text-muted">
        {submitted
          ? "Subscription captured in the current frontend layer. Connect this form to the notification and email services to persist subscriber records."
          : "By subscribing you agree to receive editorial updates. No multilingual content, promotional clutter, or generic digests."}
      </p>
    </div>
  );
}
