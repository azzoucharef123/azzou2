import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api";
import { requireAuthenticatedSession } from "@/lib/auth";
import { updateProfileByAuthUserId } from "@/lib/repositories/profile-repository";
import { updateProfileSchema } from "@/lib/validators/profile";

export async function GET() {
  try {
    const session = await requireAuthenticatedSession();
    return apiSuccess(session.profile);
  } catch (error) {
    return apiError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireAuthenticatedSession();
    const payload = updateProfileSchema.parse(await request.json());
    const profile = await updateProfileByAuthUserId(session.userId, payload);

    return apiSuccess(profile);
  } catch (error) {
    return apiError(error);
  }
}
