import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "About",
  description: "Learn the vision, mission, editorial values, and scientific purpose behind Physics & Chemistry Under the Microscope."
};

const principles = [
  {
    title: "Vision",
    body: "To build a science magazine that treats physics and chemistry as living, contested, creative disciplines, and to present them with the visual and intellectual standards of a premium international publication."
  },
  {
    title: "Mission",
    body: "To publish elegant, evidence-led journalism and educational material that helps readers understand what researchers know, how they know it, and where uncertainty still matters."
  },
  {
    title: "Goals",
    body: "We aim to commission strong long-form features, issue-based curation, rigorous research summaries, and educational essays that remain useful to students, educators, and active scientists."
  },
  {
    title: "Editorial values",
    body: "Precision before hype, narrative without distortion, beautiful design without theatrical excess, and scientific credibility grounded in method rather than prestige alone."
  }
];

export default function AboutPage() {
  return (
    <div className="shell pt-14 pb-20 sm:pt-16 sm:pb-24">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
      <Reveal>
        <div className="glass-panel rounded-[2.25rem] px-6 py-10 sm:px-10">
          <SectionHeading
            description="Physics & Chemistry Under the Microscope is an editorial magazine built to serve readers who want scientific writing with rigor, proportion, and atmosphere."
            eyebrow="About"
            title="A premium magazine for the physical sciences."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {principles.map((principle) => (
              <div className="editorial-card rounded-[1.8rem] p-6" key={principle.title}>
                <h2 className="display-title text-3xl font-semibold">{principle.title}</h2>
                <p className="mt-4 body-copy text-lg leading-8 text-foreground/84">{principle.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Reveal>
          <div className="editorial-card rounded-[2rem] p-7">
            <h2 className="display-title text-4xl font-semibold">Scientific and educational purpose</h2>
            <p className="mt-5 body-copy text-lg leading-9 text-foreground/84">
              The magazine exists to close a persistent gap. Research journals are essential, but they are not built for reflective editorial synthesis. General media often moves quickly, but sometimes trims away the methodological and historical context readers need. We occupy the middle ground with intention.
            </p>
            <p className="mt-4 text-base leading-8 text-muted">
              Our educational work is equally central. We publish explanatory essays that clarify core concepts, laboratory routines, and the interpretive frameworks behind modern research so that learning can remain connected to current scientific practice.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="editorial-card rounded-[2rem] p-7">
            <h2 className="display-title text-4xl font-semibold">Why the magazine matters</h2>
            <p className="mt-5 text-base leading-8 text-muted">
              Physics and chemistry increasingly shape public life through energy, materials, diagnostics, computation, climate technology, and education. A serious magazine in this space should do more than celebrate novelty. It should teach readers how to judge claims, appreciate uncertainty, and recognise the craft that makes evidence durable.
            </p>
            <p className="mt-4 text-base leading-8 text-muted">
              That is the role this publication is built to serve: a trustworthy editorial home for scientific readers who want depth without opacity.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
