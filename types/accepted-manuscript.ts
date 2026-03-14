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

export type HomepagePublicationAction = "hide" | "delete" | "restore";

export type HomepagePublicationManagerItem = {
  slug: string;
  title: string;
  authorName: string;
  publishedAt: string;
  categorySlug: string;
  visibility: "visible" | "hidden" | "deleted";
};
