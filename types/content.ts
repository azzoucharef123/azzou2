export type LinkItem = {
  label: string;
  href: string;
};

export type SocialLinks = {
  website?: string;
  linkedin?: string;
  x?: string;
  email?: string;
};

export type Category = {
  slug: string;
  name: string;
  description: string;
  accent: string;
  shortLabel: string;
  intro: string;
};

export type Author = {
  slug: string;
  name: string;
  role: string;
  biography: string;
  expertise: string[];
  location: string;
  social: SocialLinks;
  portraitTone: "blue" | "silver" | "cyan" | "amber" | "violet" | "emerald";
};

export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  group: "Leadership" | "Managing Editors" | "Scientific Reviewers" | "Contributors";
  biography: string;
  credentials: string;
  social: SocialLinks;
  portraitTone: Author["portraitTone"];
};

export type ArticleSection = {
  id: string;
  title: string;
  paragraphs: string[];
  pullQuote?: string;
  list?: string[];
};

export type Article = {
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  categorySlug: string;
  authorSlug: string;
  publishedAt: string;
  featured: boolean;
  editorsPick: boolean;
  hero: boolean;
  issueSlug?: string;
  tags: string[];
  coverTone: "blue" | "silver" | "cyan" | "amber" | "violet" | "emerald";
  coverMotif: "atoms" | "waves" | "lattice" | "spectrum" | "microscope" | "crystal";
  sections: ArticleSection[];
  references: string[];
};

export type Issue = {
  slug: string;
  issueNumber: string;
  title: string;
  releasedAt: string;
  description: string;
  editorNote: string;
  highlights: string[];
  articleSlugs: string[];
  coverTone: Article["coverTone"];
  coverMotif: Article["coverMotif"];
};
