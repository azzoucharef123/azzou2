import type { Metadata } from "next";
import { BellRing } from "lucide-react";
import { getSession } from "@/lib/auth";
import { listNotificationsForSession } from "@/lib/services/notification-service";
import { Button } from "@/components/ui/button";
import { FilterChipBar } from "@/components/platform/filter-chip-bar";
import { NotificationList } from "@/components/platform/notification-list";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Notification Center",
  description: "Operational alerts, editorial signals, and role-aware notifications across the publishing platform."
};

export default async function PlatformNotificationsPage() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const items = await listNotificationsForSession(session);

  return (
    <div className="space-y-6">
      <Reveal>
        <SectionHeading
          description="A unified alert surface for review notes, approval movement, publication changes, and desk-wide operational signals."
          eyebrow="Notifications"
          title="A quiet, high-signal notification center."
        />
      </Reveal>
      <Reveal delay={0.04}>
        <FilterChipBar
          items={[
            { label: "All notices", meta: String(items.length), active: true },
            { label: "Role filtered", meta: "Current desk" },
            { label: "Digest ready", meta: "Daily" }
          ]}
        />
      </Reveal>
      <div className="grid gap-6 2xl:grid-cols-[1.05fr_0.95fr]">
        <Reveal>
          <NotificationList items={items} />
        </Reveal>
        <Reveal delay={0.08}>
          <div className="space-y-6">
            <div className="platform-panel rounded-[2rem] p-6">
              <p className="inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
                <BellRing className="h-4 w-4" />
                Delivery preferences
              </p>
              <div className="mt-5 grid gap-4">
                {[
                  "Immediate alerts for approval changes and revision requests.",
                  "Morning digest for queue movement and issue readiness.",
                  "Muted marketing notifications to keep editorial attention focused."
                ].map((item) => (
                  <label className="flex items-start gap-3 rounded-[1.4rem] border border-border bg-white/70 p-4 text-sm leading-6 text-muted dark:bg-slate-950/35" key={item}>
                    <input className="mt-1 h-4 w-4 rounded border-border" defaultChecked type="checkbox" />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
              <Button className="mt-6" type="button">
                Save preferences
              </Button>
            </div>
            <div className="platform-panel rounded-[2rem] p-6">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Triage guidance</p>
              <div className="mt-5 space-y-3">
                {[
                  "Warnings signal live editorial blockers or evidence-risk issues.",
                  "Success notices confirm approvals, queue readiness, or completed package steps.",
                  "Info notices carry operational context without requiring action."
                ].map((item) => (
                  <div className="rounded-[1.3rem] border border-border bg-white/70 p-4 text-sm leading-6 text-muted dark:bg-slate-950/35" key={item}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
