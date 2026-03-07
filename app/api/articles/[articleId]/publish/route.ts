import { apiError, apiSuccess } from "@/lib/api";
import { requireAuthenticatedSession } from "@/lib/auth";
import { markArticlePublished } from "@/lib/services/article-service";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ articleId: string }> }
) {
  try {
    const session = await requireAuthenticatedSession();
    const { articleId } = await params;
    await markArticlePublished(session, articleId);

    return apiSuccess({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
