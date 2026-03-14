import { Article } from "@/types/content";

export type AcceptedManuscriptRecord = {
  title: string;
  authors: string;
  submissionDate: string;
  reviewDate: string;
  acceptanceDate: string;
  publicationDate: string;
  abstract: string;
  purchasePrice: string;
};

export type HomepagePublicationVisibility = "visible" | "hidden" | "deleted";
export type HomepagePublicationAction = "hide" | "delete" | "restore";

export type HomepagePublicationEditableFields = {
  title: string;
  subtitle: string;
  excerpt: string;
  authorName: string;
  publishedAt: string;
  coverTone: Article["coverTone"];
  coverMotif: Article["coverMotif"];
  order: number;
};

export type HomepagePublicationEntry = {
  slug: string;
  visibility: HomepagePublicationVisibility;
  order: number;
  overrides?: Partial<Omit<HomepagePublicationEditableFields, "order">>;
};

export type HomepagePublicationManagerItem = {
  slug: string;
  sourceTitle: string;
  title: string;
  subtitle: string;
  excerpt: string;
  authorName: string;
  publishedAt: string;
  categorySlug: string;
  categoryName: string;
  coverTone: Article["coverTone"];
  coverMotif: Article["coverMotif"];
  visibility: HomepagePublicationVisibility;
  order: number;
};

export type HomepagePublicationCandidateItem = {
  slug: string;
  title: string;
  authorName: string;
  publishedAt: string;
  categorySlug: string;
  categoryName: string;
};

export type HomepagePublicationManagerData = {
  visible: HomepagePublicationManagerItem[];
  hidden: HomepagePublicationManagerItem[];
  deleted: HomepagePublicationManagerItem[];
  available: HomepagePublicationCandidateItem[];
  canPersist: boolean;
};

export type HomepagePublicationView = {
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  authorName: string;
  publishedAt: string;
  categorySlug: string;
  categoryName: string;
  coverTone: Article["coverTone"];
  coverMotif: Article["coverMotif"];
  order: number;
};
