import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PlatformLayoutShell } from "@/components/platform/platform-layout-shell";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Publishing Platform",
  description: "Protected editorial workspace for authors and editors."
};

export default async function PlatformLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect("/login?redirectTo=/platform");
  }

  return <PlatformLayoutShell session={session}>{children}</PlatformLayoutShell>;
}
