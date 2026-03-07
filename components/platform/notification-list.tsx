import { NotificationItem } from "@/types/platform";
import { getPlatformRoleLabel } from "@/lib/platform";
import { StatusBadge } from "@/components/platform/status-badge";

const toneMap = {
  info: "blue",
  warning: "amber",
  success: "emerald"
} as const;

export function NotificationList({ items }: { items: NotificationItem[] }) {
  return (
    <div className="platform-panel rounded-[2rem] p-6 sm:p-7">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Notification center</p>
          <h2 className="display-title mt-3 text-3xl font-semibold leading-[0.98]">Editorial signals and platform alerts</h2>
        </div>
        <p className="text-sm text-muted">{items.length} live notices</p>
      </div>
      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <article className="rounded-[1.5rem] border border-border bg-white/68 p-5 dark:bg-slate-950/35" key={item.id}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-3">
                <StatusBadge label={item.tone} tone={toneMap[item.tone]} />
                <div>
                  <h3 className="display-title text-[1.6rem] font-semibold leading-[1.02]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted">{item.body}</p>
                </div>
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{item.when}</p>
            </div>
            <div className="soft-divider mt-4 pt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Audience</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.audience.map((role) => (
                  <span className="rounded-full border border-border bg-white/72 px-3 py-1 text-xs font-medium text-muted dark:bg-slate-950/40" key={role}>
                    {getPlatformRoleLabel(role)}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
