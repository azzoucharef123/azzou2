import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api";
import { requireAuthenticatedSession } from "@/lib/auth";
import { changeArticleStatus } from "@/lib/services/article-service";
import { changeArticleStatusSchema } from "@/lib/validators/article";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ articleId: string }> }
) {
  try {
    const session = await requireAuthenticatedSession();
    const { articleId } = await params;
    const payload = changeArticleStatusSchema.parse(await request.json());
    const article = await changeArticleStatus(session, articleId, payload);

    return apiSuccess(article);
  } catch (error) {
    return apiError(error);
  }
}
