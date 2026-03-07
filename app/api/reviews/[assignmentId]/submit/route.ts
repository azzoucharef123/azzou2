import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api";
import { requireAuthenticatedSession } from "@/lib/auth";
import { submitAssignedReview } from "@/lib/services/article-service";
import { submitReviewSchema } from "@/lib/validators/review";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ assignmentId: string }> }
) {
  try {
    const session = await requireAuthenticatedSession();
    const { assignmentId } = await params;
    const payload = submitReviewSchema.parse(await request.json());
    const review = await submitAssignedReview(session, assignmentId, payload);

    return apiSuccess(review);
  } catch (error) {
    return apiError(error);
  }
}
