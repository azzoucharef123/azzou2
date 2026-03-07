import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api";
import { requireAuthenticatedSession } from "@/lib/auth";
import { recordChiefEditorDecision } from "@/lib/services/article-service";
import { chiefEditorDecisionSchema } from "@/lib/validators/article";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ articleId: string }> }
) {
  try {
    const session = await requireAuthenticatedSession();
    const { articleId } = await params;
    const payload = chiefEditorDecisionSchema.parse(await request.json());
    const decision = await recordChiefEditorDecision(session, articleId, payload);

    return apiSuccess(decision);
  } catch (error) {
    return apiError(error);
  }
}
