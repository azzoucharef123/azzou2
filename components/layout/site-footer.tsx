import Link from "next/link";
import { mainNavigation, siteConfig } from "@/data/site";
import { NewsletterForm } from "@/components/ui/newsletter-form";

export function SiteFooter() {
  return (
    <footer className="mt-32">
      <div className="shell-wide space-y-12 pb-14 pt-6">
        <NewsletterForm />
        <div className="glass-panel rounded-[2.2rem] p-7 sm:p-9">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="space-y-4">
            <p className="display-title text-4xl font-semibold">{siteConfig.name}</p>
            <p className="max-w-xl text-sm leading-7 text-muted">{siteConfig.description}</p>
            <p className="text-sm text-muted">
              Editorial enquiries:
              {" "}
              <a className="focus-ring font-medium text-foreground hover:text-blue-700 dark:hover:text-sky-300" href={`mailto:${siteConfig.contactEmail}`}>
                {siteConfig.contactEmail}
              </a>
            </p>
          </div>
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-muted">Navigation</p>
            <ul className="space-y-3">
              {mainNavigation.map((item) => (
                <li key={item.href}>
                  <Link className="focus-ring text-sm text-foreground/80 hover:text-foreground" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-muted">Social</p>
            <ul className="space-y-3">
              {siteConfig.socials.map((item) => (
                <li key={item.label}>
                  <Link className="focus-ring text-sm text-foreground/80 hover:text-foreground" href={item.href} target="_blank">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>English-language digital edition. Crafted for physics and chemistry readers.</p>
          <p>© 2026 Physics & Chemistry Under the Microscope</p>
        </div>
        </div>
      </div>
    </footer>
  );
}
