import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { PersonCard } from "@/components/ui/person-card";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { getTeamMembers } from "@/lib/content";

export const metadata: Metadata = {
  title: "Editorial Team",
  description: "Meet the editorial leadership, managing editors, scientific reviewers, and contributors behind the magazine."
};

export default function TeamPage() {
  const grouped = Object.entries(
    getTeamMembers().reduce<Record<string, ReturnType<typeof getTeamMembers>>>((acc, member) => {
      acc[member.group] = [...(acc[member.group] ?? []), member];
      return acc;
    }, {})
  );

  return (
    <div className="shell pt-14 pb-20 sm:pt-16 sm:pb-24">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Editorial Team" }]} />
      <Reveal>
        <SectionHeading
          description="The magazine combines editorial craft with scientific review so that style, credibility, and explanatory clarity reinforce each other."
          eyebrow="Editorial Team"
          title="Editors, reviewers, and contributors shaping the publication."
        />
      </Reveal>
      <div className="mt-12 space-y-12">
        {grouped.map(([group, members]) => (
          <Reveal key={group}>
            <section className="space-y-6">
              <h2 className="display-title text-4xl font-semibold">{group}</h2>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {members.map((member) => (
                  <PersonCard key={member.slug} person={member} />
                ))}
              </div>
            </section>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
