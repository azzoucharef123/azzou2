"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";

export function ApprovalDecisionPanel() {
  const [state, setState] = useState<"idle" | "approved" | "held">("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const decision = String(formData.get("decision") ?? "hold");
    setState(decision === "approve" ? "approved" : "held");
  }

  return (
    <form className="platform-panel rounded-[2rem] p-6 sm:p-7" onSubmit={handleSubmit}>
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Chief editor decision</p>
      <h2 className="display-title mt-3 text-3xl font-semibold leading-[0.98]">Approval memorandum</h2>
      <div className="mt-6 grid gap-5">
        <label className="space-y-2 text-sm font-medium text-foreground">
          Decision
          <select className="focus-ring h-12 w-full rounded-2xl border border-border bg-white/80 px-4 outline-none dark:bg-slate-950/45" defaultValue="approve" name="decision">
            <option value="approve">Approve for production</option>
            <option value="hold">Hold for clarification</option>
          </select>
        </label>
        <label className="space-y-2 text-sm font-medium text-foreground">
          Final note
          <textarea
            className="focus-ring min-h-32 w-full rounded-[1.5rem] border border-border bg-white/80 px-4 py-3 outline-none dark:bg-slate-950/45"
            defaultValue="Proceed once the revised methods paragraph is integrated and the opening benchmark comparison is softened by one degree."
          />
        </label>
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-muted">
          {state === "approved"
            ? "The approval panel has recorded a production-ready state in the current workflow layer."
            : state === "held"
              ? "The approval panel has recorded a hold state pending further clarification."
              : "Use this decision panel as the frontend control surface for final editorial sign-off before production scheduling."}
        </p>
        <Button type="submit">Record decision</Button>
      </div>
    </form>
  );
}
