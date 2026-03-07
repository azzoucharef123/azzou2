import Link from "next/link";
import { Atom, ChevronRight, FlaskConical, Microscope } from "lucide-react";
import { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/button";
import { ScienceCover } from "@/components/ui/science-cover";

export function AuthShell({
  eyebrow,
  title,
  description,
  helperLabel,
  helperHref,
  helperText,
  children
}: {
  eyebrow: string;
  title: string;
  description: string;
  helperLabel: string;
  helperHref: string;
  helperText: string;
  children: ReactNode;
}) {
  return (
    <div className="shell pt-14 pb-20 sm:pt-16 sm:pb-24">
      <div className="glass-panel overflow-hidden rounded-[2.5rem]">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative overflow-hidden border-b border-border px-6 py-10 sm:px-10 lg:border-b-0 lg:border-r lg:py-14">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(23,78,207,.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,.12),transparent_24%)]" />
            <div className="relative space-y-7">
              <span className="eyebrow">{eyebrow}</span>
              <div className="space-y-4">
                <h1 className="display-title text-5xl font-semibold leading-[0.94] tracking-[-0.05em]">{title}</h1>
                <p className="body-copy max-w-xl text-xl leading-8 text-foreground/82">{description}</p>
              </div>
              <ScienceCover
                category="Secure platform access"
                className="aspect-[16/11] min-h-[20rem]"
                motif="atoms"
                title="Access the protected submission desk, review workflows, and editorial operations."
                tone="blue"
              />
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { icon: Microscope, label: "Protected publishing workspace" },
                  { icon: FlaskConical, label: "Submission and review workflows" },
                  { icon: Atom, label: "Premium scientific journal experience" }
                ].map((item) => (
                  <div className="rounded-[1.5rem] border border-border bg-white/70 p-4 dark:bg-slate-950/40" key={item.label}>
                    <item.icon className="mb-3 h-5 w-5 text-blue-700 dark:text-sky-300" />
                    <p className="text-sm leading-6 text-muted">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="px-6 py-10 sm:px-10 lg:py-14">
            <div className="mx-auto max-w-xl">
              {children}
              <div className="mt-8 border-t border-border pt-6 text-sm text-muted">
                {helperText}
                {" "}
                <Link className="focus-ring font-semibold text-foreground" href={helperHref}>
                  {helperLabel}
                </Link>
                <ChevronRight className="ml-1 inline h-4 w-4" />
              </div>
              <div className="mt-8">
                <ButtonLink href="/" variant="ghost">
                  Back to home
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
