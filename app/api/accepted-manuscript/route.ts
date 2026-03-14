import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api";
import { requireAuthenticatedSession } from "@/lib/auth";
import { getHomepageAcceptedManuscript, saveHomepageAcceptedManuscript } from "@/lib/services/accepted-manuscript-service";
import { acceptedManuscriptSchema } from "@/lib/validators/accepted-manuscript";

export async function GET() {
  try {
    const manuscript = await getHomepageAcceptedManuscript();
    return apiSuccess(manuscript);
  } catch (error) {
    return apiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await requireAuthenticatedSession();
    const payload = acceptedManuscriptSchema.parse(await request.json());
    const manuscript = await saveHomepageAcceptedManuscript(session, payload);

    return apiSuccess(manuscript);
  } catch (error) {
    return apiError(error);
  }
}
