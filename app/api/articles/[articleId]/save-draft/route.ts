import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api";
import { requireAuthenticatedSession } from "@/lib/auth";
import { saveArticleDraft } from "@/lib/services/article-service";
import { saveDraftSchema } from "@/lib/validators/article";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ articleId: string }> }
) {
  try {
    const session = await requireAuthenticatedSession();
    const { articleId } = await params;
    const payload = saveDraftSchema.parse(await request.json());
    const version = await saveArticleDraft(session, articleId, payload);

    return apiSuccess(version);
  } catch (error) {
    return apiError(error);
  }
}
