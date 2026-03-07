import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api";
import { requireAuthenticatedSession } from "@/lib/auth";
import { assignArticleReviewer } from "@/lib/services/article-service";
import { assignReviewerSchema } from "@/lib/validators/article";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ articleId: string }> }
) {
  try {
    const session = await requireAuthenticatedSession();
    const { articleId } = await params;
    const payload = assignReviewerSchema.parse(await request.json());
    const assignment = await assignArticleReviewer(session, articleId, payload);

    return apiSuccess(assignment);
  } catch (error) {
    return apiError(error);
  }
}
