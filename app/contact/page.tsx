import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ContactForm } from "@/components/ui/contact-form";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact the editorial desk for general enquiries, collaborations, partnerships, and scientific publishing conversations."
};

export default function ContactPage() {
  return (
    <div className="shell pt-14 pb-20 sm:pt-16 sm:pb-24">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
      <Reveal>
        <SectionHeading
          description="For editorial correspondence, collaborations, institutional partnerships, or speaking requests, contact the magazine directly."
          eyebrow="Contact"
          title="Reach the editorial desk."
        />
      </Reveal>
      <div className="mt-12 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <Reveal>
          <ContactForm />
        </Reveal>
        <Reveal delay={0.08}>
          <div className="space-y-6">
            <div className="editorial-card rounded-[2rem] p-7">
              <h2 className="display-title text-3xl font-semibold">Editorial email</h2>
              <p className="mt-4 text-base leading-8 text-muted">
                The editorial desk reviews commissioning requests, interview proposals, fact-checking questions, and issue partnerships.
              </p>
              <a className="mt-5 inline-block font-semibold text-blue-700 dark:text-sky-300" href={`mailto:${siteConfig.contactEmail}`}>
                {siteConfig.contactEmail}
              </a>
            </div>
            <div className="editorial-card rounded-[2rem] p-7">
              <h2 className="display-title text-3xl font-semibold">Partnerships & collaborations</h2>
              <p className="mt-4 text-base leading-8 text-muted">
                We collaborate with universities, scientific societies, laboratories, and educational institutions on issue sponsorships, themed dossiers, and expert-led editorial packages.
              </p>
            </div>
            <div className="editorial-card rounded-[2rem] p-7">
              <h2 className="display-title text-3xl font-semibold">Social channels</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {siteConfig.socials.map((item) => (
                  <a
                    className="focus-ring rounded-full border border-border bg-white/70 px-4 py-2 text-sm font-medium dark:bg-slate-950/45"
                    href={item.href}
                    key={item.label}
                    target="_blank"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
