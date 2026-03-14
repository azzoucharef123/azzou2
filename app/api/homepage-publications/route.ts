import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api";
import { requireAuthenticatedSession } from "@/lib/auth";
import { updateHomepagePublicationVisibility } from "@/lib/services/homepage-publication-service";
import { homepagePublicationActionSchema } from "@/lib/validators/homepage-publication";

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireAuthenticatedSession();
    const payload = homepagePublicationActionSchema.parse(await request.json());
    const preferences = await updateHomepagePublicationVisibility(session, payload);

    return apiSuccess(preferences);
  } catch (error) {
    return apiError(error);
  }
}
