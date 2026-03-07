import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api";
import { requireAuthenticatedSession } from "@/lib/auth";
import { bootstrapProfileForAuthUser } from "@/lib/services/auth-service";
import { bootstrapProfileSchema } from "@/lib/validators/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuthenticatedSession();
    const payload = bootstrapProfileSchema.parse(await request.json());

    const profile = await bootstrapProfileForAuthUser({
      authUserId: session.userId,
      email: session.email,
      fullName: payload.fullName ?? session.name,
      role: payload.role
    });

    return apiSuccess(profile);
  } catch (error) {
    return apiError(error);
  }
}
