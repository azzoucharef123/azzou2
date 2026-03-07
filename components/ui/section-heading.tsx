import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("section-frame flex flex-col gap-6 md:flex-row md:items-end md:justify-between", className)}>
      <div className="max-w-4xl space-y-5">
        <span className="eyebrow">{eyebrow}</span>
        <div className="space-y-4">
          <h2 className="display-title text-4xl font-semibold leading-[0.98] text-foreground sm:text-5xl lg:text-[3.65rem]">
            {title}
          </h2>
          {description ? <p className="max-w-3xl body-copy text-lg leading-8 text-muted">{description}</p> : null}
        </div>
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
