import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { platformRoles } from "@/data/platform";
import { PlatformRole } from "@/types/platform";
import { ButtonLink } from "@/components/ui/button";

export function PlatformAccessState({
  title,
  description,
  allowedRoles
}: {
  title: string;
  description: string;
  allowedRoles: PlatformRole[];
}) {
  return (
    <div className="platform-panel rounded-[2rem] p-8 sm:p-10">
      <div className="max-w-3xl space-y-5">
        <span className="eyebrow">Restricted surface</span>
        <div className="space-y-4">
          <h1 className="display-title text-4xl font-semibold leading-[0.96] sm:text-5xl">{title}</h1>
          <p className="body-copy text-lg leading-8 text-muted">{description}</p>
        </div>
        <div className="rounded-[1.6rem] border border-border bg-white/70 p-5 dark:bg-slate-950/35">
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-muted">
            <LockKeyhole className="h-4 w-4" />
            Allowed roles
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {allowedRoles.map((role) => (
              <span className="rounded-full border border-border bg-white/80 px-3 py-1 text-xs font-medium text-muted dark:bg-slate-950/40" key={role}>
                {platformRoles.find((item) => item.id === role)?.label ?? role}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/platform">Return to dashboard</ButtonLink>
          <Link className="focus-ring inline-flex items-center rounded-full px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-foreground/78 hover:text-foreground" href="/">
            Back to magazine
          </Link>
        </div>
      </div>
    </div>
  );
}
