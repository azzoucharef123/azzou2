import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { getArticlesByCategory, getCategories } from "@/lib/content";

export const metadata: Metadata = {
  title: "Categories",
  description: "Explore the science magazine by category, from physics and chemistry to interviews, education, and laboratory culture."
};

export default function CategoriesPage() {
  const categories = getCategories();

  return (
    <div className="shell pt-14 pb-20 sm:pt-16 sm:pb-24">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Categories" }]} />
      <Reveal>
        <SectionHeading
          description="Each category is edited as a distinct scientific mode, with its own tempo, questions, and visual rhythm."
          eyebrow="Categories"
          title="A structured editorial map of the magazine."
        />
      </Reveal>
      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category, index) => (
          <Reveal delay={index * 0.04} key={category.slug}>
            <Link className="editorial-card block rounded-[2rem] p-6 hover:-translate-y-1" href={`/categories/${category.slug}`}>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700 dark:text-sky-300">{category.accent}</p>
              <h2 className="display-title mt-4 text-3xl font-semibold">{category.name}</h2>
              <p className="mt-3 text-sm leading-7 text-muted">{category.description}</p>
              <div className="mt-6 border-t border-border pt-4 text-sm text-muted">
                {getArticlesByCategory(category.slug).length} published articles
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
