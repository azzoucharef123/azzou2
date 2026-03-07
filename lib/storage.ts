import { AttachmentKind } from "@prisma/client";

export function buildStoragePath(kind: AttachmentKind, identifier: string, fileName: string) {
  switch (kind) {
    case "avatar":
      return `avatars/${identifier}/${fileName}`;
    case "featured_image":
      return `articles/${identifier}/featured/${fileName}`;
    case "article_attachment":
      return `articles/${identifier}/attachments/${fileName}`;
    case "issue_cover":
      return `issues/${identifier}/covers/${fileName}`;
    case "issue_pdf":
      return `issues/${identifier}/pdf/${fileName}`;
    default:
      return `uploads/${identifier}/${fileName}`;
  }
}
