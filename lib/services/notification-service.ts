import "server-only";
import { env } from "@/lib/env";
import { listNotificationsForRecipient } from "@/lib/repositories/notification-repository";
import { notifications as fallbackNotifications } from "@/data/platform";
import { AuthSession } from "@/lib/auth";

export async function listNotificationsForSession(session: AuthSession) {
  if (!env.hasDatabaseUrl) {
    return fallbackNotifications.filter((item) => item.audience.includes(session.displayDesk));
  }

  const notifications = await listNotificationsForRecipient(session.profile.id);

  return notifications.map((item) => ({
    id: item.id,
    title: item.title,
    body: item.body,
    when: item.createdAt.toISOString(),
    audience: [session.displayDesk],
    tone: (item.type === "review" ? "warning" : item.type === "publication" ? "success" : "info") as "info" | "warning" | "success"
  }));
}
