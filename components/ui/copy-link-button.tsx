"use client";

import { Copy, Link2 } from "lucide-react";
import { useEffect, useState } from "react";

export function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const timeout = window.setTimeout(() => setCopied(false), 2000);
      return () => window.clearTimeout(timeout);
    }
  }, [copied]);

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
  }

  return (
    <button
      className="focus-ring inline-flex h-11 items-center gap-2 rounded-full border border-border bg-white/70 px-4 text-sm font-medium text-foreground/80 hover:bg-white dark:bg-slate-950/45 dark:hover:bg-slate-900"
      onClick={copyLink}
      type="button"
    >
      {copied ? <Copy className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
      {copied ? "Copied" : "Copy link"}
    </button>
  );
}
