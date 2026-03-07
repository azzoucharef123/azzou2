"use client";

import { Copy, Facebook, Linkedin, Link2, Twitter } from "lucide-react";
import { useState } from "react";

export function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  const items = [
    { label: "X", icon: <Twitter className="h-4 w-4" />, href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}` },
    { label: "LinkedIn", icon: <Linkedin className="h-4 w-4" />, href: "https://linkedin.com" },
    { label: "Facebook", icon: <Facebook className="h-4 w-4" />, href: "https://facebook.com" }
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      {items.map((item) => (
        <a
          className="focus-ring inline-flex h-11 items-center gap-2 rounded-full border border-border bg-white/70 px-4 text-sm font-medium text-foreground/80 hover:bg-white dark:bg-slate-950/45 dark:hover:bg-slate-900"
          href={item.href}
          key={item.label}
          rel="noreferrer"
          target="_blank"
        >
          {item.icon}
          {item.label}
        </a>
      ))}
      <button
        className="focus-ring inline-flex h-11 items-center gap-2 rounded-full border border-border bg-white/70 px-4 text-sm font-medium text-foreground/80 hover:bg-white dark:bg-slate-950/45 dark:hover:bg-slate-900"
        onClick={copyLink}
        type="button"
      >
        {copied ? <Copy className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
