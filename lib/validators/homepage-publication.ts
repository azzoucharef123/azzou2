import { z } from "zod";

export const homepagePublicationActionSchema = z.object({
  slug: z.string().min(1),
  action: z.enum(["hide", "delete", "restore"])
});
