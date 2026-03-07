import { apiError, apiSuccess } from "@/lib/api";
import { requireAuthenticatedSession } from "@/lib/auth";
import { listNotificationsForSession } from "@/lib/services/notification-service";

export async function GET() {
  try {
    const session = await requireAuthenticatedSession();
    const notifications = await listNotificationsForSession(session);

    return apiSuccess(notifications);
  } catch (error) {
    return apiError(error);
  }
}
