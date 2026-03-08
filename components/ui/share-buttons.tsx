import { Facebook, Linkedin, Twitter } from "lucide-react";
import { CopyLinkButton } from "@/components/ui/copy-link-button";

export function ShareButtons({ title, url }: { title: string; url: string }) {
  const items = [
    {
      label: "X",
      icon: <Twitter className="h-4 w-4" />,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
    },
    {
      label: "LinkedIn",
      icon: <Linkedin className="h-4 w-4" />,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    },
    {
      label: "Facebook",
      icon: <Facebook className="h-4 w-4" />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    }
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
      <CopyLinkButton url={url} />
    </div>
  );
}
