import Link from "next/link";
import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

const buttonStyles = {
  primary:
    "bg-[linear-gradient(135deg,#07152d,#12376a_45%,#2368c5)] text-white shadow-[0_18px_45px_rgba(10,28,60,0.22)] hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(10,28,60,0.28)] dark:bg-[linear-gradient(135deg,#f8fbff,#d7ebff_60%,#a9d7ff)] dark:text-slate-950",
  secondary:
    "border border-border bg-white/72 text-foreground shadow-[0_8px_28px_rgba(15,23,39,0.06)] hover:-translate-y-0.5 hover:bg-white dark:bg-slate-950/50 dark:hover:bg-slate-900",
  ghost: "text-foreground/80 hover:text-foreground hover:bg-white/60 dark:hover:bg-slate-950/35"
};

const sharedStyles =
  "focus-ring inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold tracking-[0.12em] uppercase";

type ButtonVariant = keyof typeof buttonStyles;

export function Button({
  className,
  children,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; variant?: ButtonVariant }) {
  return <button className={cn(sharedStyles, buttonStyles[variant], className)} {...props}>{children}</button>;
}

export function ButtonLink({
  className,
  children,
  variant = "primary",
  href,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode; href: string; variant?: ButtonVariant }) {
  return (
    <Link className={cn(sharedStyles, buttonStyles[variant], className)} href={href} {...props}>
      {children}
    </Link>
  );
}
