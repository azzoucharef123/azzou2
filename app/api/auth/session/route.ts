import { apiSuccess } from "@/lib/api";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();

  return apiSuccess(session, {
    headers: {
      "Cache-Control": "no-store"
    }
  });
}
