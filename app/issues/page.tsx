import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { IssueCard } from "@/components/ui/issue-card";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { getIssues } from "@/lib/content";

export const metadata: Metadata = {
  title: "Magazine Issues",
  description: "Browse curated digital issues of Physics & Chemistry Under the Microscope, including editor’s notes, issue highlights, and article selections."
};

export default function IssuesPage() {
  const issues = getIssues();

  return (
    <div className="shell pt-14 pb-20 sm:pt-16 sm:pb-24">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Issues" }]} />
      <Reveal>
        <SectionHeading
          description="Issue packages bring features, interviews, educational essays, and research summaries into cohesive editorial editions."
          eyebrow="Magazine Issues"
          title="A print-inspired structure for the digital edition."
        />
      </Reveal>
      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {issues.map((issue, index) => (
          <Reveal delay={index * 0.06} key={issue.slug}>
            <IssueCard issue={issue} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
