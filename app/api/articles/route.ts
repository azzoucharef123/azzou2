import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/api";
import { requireAuthenticatedSession } from "@/lib/auth";
import { createArticleDraft, listArticleSummaries } from "@/lib/services/article-service";
import { articleListQuerySchema, createArticleSchema } from "@/lib/validators/article";

export async function GET(request: NextRequest) {
  try {
    const params = Object.fromEntries(request.nextUrl.searchParams.entries());
    const query = articleListQuerySchema.parse(params);
    const articles = await listArticleSummaries({
      categorySlug: query.category,
      query: query.q
    });

    return apiSuccess(articles);
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuthenticatedSession();
    const payload = createArticleSchema.parse(await request.json());
    const article = await createArticleDraft(session, payload);

    return apiSuccess(article, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
