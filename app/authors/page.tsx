import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { PersonCard } from "@/components/ui/person-card";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { getAuthors } from "@/lib/content";

export const metadata: Metadata = {
  title: "Authors",
  description: "Browse the magazine’s author directory, including biographies, expertise, and published articles."
};

export default function AuthorsPage() {
  const authors = getAuthors();

  return (
    <div className="shell pt-14 pb-20 sm:pt-16 sm:pb-24">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Authors" }]} />
      <Reveal>
        <SectionHeading
          description="Our contributors report from the intersection of method, discovery, teaching, and laboratory life."
          eyebrow="Authors"
          title="A directory of specialist writers and science editors."
        />
      </Reveal>
      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {authors.map((author, index) => (
          <Reveal delay={index * 0.05} key={author.slug}>
            <PersonCard href={`/authors/${author.slug}`} person={author} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
