import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { SubmissionForm } from "@/components/ui/submission-form";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Submit Article",
  description: "Read the magazine’s submission guidelines, accepted topics, editorial standards, and review process."
};

const guidance = [
  "Accepted topics include physics, chemistry, research summaries, experimental method, laboratory culture, scientific discoveries, technology, and educational essays.",
  "We prefer pitches that identify a clear argument, relevant sources, and why the subject matters beyond a narrow announcement cycle.",
  "Editorial standards emphasise factual precision, methodological awareness, transparent sourcing, and prose that remains elegant without becoming vague.",
  "Our review process includes editorial screening, scientific review when needed, structural editing, and final copy refinement for clarity and tone."
];

export default async function SubmitPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login?redirectTo=/submit");
  }

  if (session.activeRole !== "author") {
    redirect("/platform?notice=Only author accounts can access the submission desk.");
  }

  return (
    <div className="shell pt-14 pb-20 sm:pt-16 sm:pb-24">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Submit Article" }]} />
      <Reveal>
        <SectionHeading
          description={`Welcome back, ${session.name}. We welcome polished pitches that bring scientific depth, credible reporting, and an editorial point of view suited to a premium science magazine.`}
          eyebrow="Submit Article"
          title="Contribute to the magazine."
        />
      </Reveal>
      <div className="mt-12 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <Reveal>
          <div className="editorial-card rounded-[2rem] p-7">
            <h2 className="display-title text-3xl font-semibold">Submission guidelines</h2>
            <div className="mt-6 space-y-4">
              {guidance.map((item) => (
                <div className="rounded-[1.5rem] border border-border bg-white/70 p-4 text-sm leading-7 text-muted dark:bg-slate-950/40" key={item}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <SubmissionForm />
        </Reveal>
      </div>
    </div>
  );
}
