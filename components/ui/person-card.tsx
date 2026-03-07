import Link from "next/link";
import { Mail, Linkedin, Globe, Twitter } from "lucide-react";
import { Author, TeamMember } from "@/types/content";
import { cn } from "@/lib/utils";

const portraitTones = {
  blue: "from-blue-950 via-blue-700 to-sky-300",
  silver: "from-slate-950 via-slate-600 to-slate-200",
  cyan: "from-cyan-950 via-cyan-700 to-sky-200",
  amber: "from-slate-950 via-amber-600 to-amber-200",
  violet: "from-violet-950 via-violet-700 to-fuchsia-200",
  emerald: "from-emerald-950 via-emerald-600 to-teal-200"
};

function IconLink({ href, label }: { href?: string; label: "website" | "linkedin" | "x" | "email" }) {
  if (!href) {
    return null;
  }

  const icon =
    label === "website" ? <Globe className="h-4 w-4" /> : label === "linkedin" ? <Linkedin className="h-4 w-4" /> : label === "x" ? <Twitter className="h-4 w-4" /> : <Mail className="h-4 w-4" />;

  return (
    <Link
      aria-label={label}
      className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white/70 text-foreground/80 hover:bg-white dark:bg-slate-950/40 dark:hover:bg-slate-900"
      href={label === "email" ? `mailto:${href}` : href}
      target={label === "email" ? undefined : "_blank"}
    >
      {icon}
    </Link>
  );
}

export function PersonCard({
  person,
  href
}: {
  person: Author | TeamMember;
  href?: string;
}) {
  return (
    <article className="editorial-card flex h-full flex-col gap-5 rounded-[2.15rem] p-6">
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex h-[4.85rem] w-[4.85rem] shrink-0 items-end rounded-[1.55rem] bg-gradient-to-br p-3 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(4,12,28,0.24)]",
            portraitTones[person.portraitTone]
          )}
        >
          {person.name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)}
        </div>
        <div className="space-y-2">
          {href ? (
            <Link className="focus-ring block" href={href}>
              <h3 className="display-title text-[2rem] font-semibold leading-[0.98]">{person.name}</h3>
            </Link>
          ) : (
            <h3 className="display-title text-[2rem] font-semibold leading-[0.98]">{person.name}</h3>
          )}
          <p className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-muted">{person.role}</p>
        </div>
      </div>
      <p className="body-copy text-[1.02rem] leading-8 text-muted">{person.biography}</p>
      {"expertise" in person ? (
        <div className="flex flex-wrap gap-2">
          {person.expertise.map((item) => (
            <span
              className="rounded-full border border-border bg-white/70 px-3 py-1 text-xs font-medium text-muted dark:bg-slate-950/40"
              key={item}
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted">{person.credentials}</p>
      )}
      <div className="mt-auto flex items-center gap-2">
        <IconLink href={person.social.website} label="website" />
        <IconLink href={person.social.linkedin} label="linkedin" />
        <IconLink href={person.social.x} label="x" />
        <IconLink href={person.social.email} label="email" />
      </div>
    </article>
  );
}
