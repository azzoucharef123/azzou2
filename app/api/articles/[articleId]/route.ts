import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api";
import { requireAuthenticatedSession } from "@/lib/auth";
import { getArticleDetail, updateArticleMetadata } from "@/lib/services/article-service";
import { updateArticleSchema } from "@/lib/validators/article";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ articleId: string }> }
) {
  try {
    const { articleId } = await params;
    const article = await getArticleDetail(articleId);

    return apiSuccess(article);
  } catch (error) {
    return apiError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ articleId: string }> }
) {
  try {
    const session = await requireAuthenticatedSession();
    const { articleId } = await params;
    const payload = updateArticleSchema.parse(await request.json());
    const article = await updateArticleMetadata(session, articleId, payload);

    return apiSuccess(article);
  } catch (error) {
    return apiError(error);
  }
}
