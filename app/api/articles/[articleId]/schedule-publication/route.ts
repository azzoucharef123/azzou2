import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api";
import { requireAuthenticatedSession } from "@/lib/auth";
import { scheduleArticlePublication } from "@/lib/services/article-service";
import { schedulePublicationSchema } from "@/lib/validators/article";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ articleId: string }> }
) {
  try {
    const session = await requireAuthenticatedSession();
    const { articleId } = await params;
    const payload = schedulePublicationSchema.parse(await request.json());
    await scheduleArticlePublication(session, articleId, payload);

    return apiSuccess({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
