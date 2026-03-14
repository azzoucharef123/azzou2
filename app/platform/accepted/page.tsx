
import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { env } from "@/lib/env";
import { getHomepageAcceptedManuscript } from "@/lib/services/accepted-manuscript-service";
import { PlatformRole } from "@/types/platform";
import { AcceptedManuscriptForm } from "@/components/platform/accepted-manuscript-form";
import { FilterChipBar } from "@/components/platform/filter-chip-bar";
import { PlatformAccessState } from "@/components/platform/platform-access-state";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Accepted Manuscripts",
  description: "Editor workspace for preparing an accepted manuscript spotlight for the homepage."
};

const allowedRoles: PlatformRole[] = ["editor"];

export default async function PlatformAcceptedManuscriptsPage() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  if (!allowedRoles.includes(session.activeRole)) {
    return (
      <PlatformAccessState
        allowedRoles={[...allowedRoles]}
        description="The accepted manuscript publishing surface is reserved for editors preparing homepage publication details."
        title="Accepted manuscripts require an editor account."
      />
    );
  }

  const manuscript = await getHomepageAcceptedManuscript();

  return (
    <div className="space-y-6">
      <Reveal>
        <SectionHeading
          description="This page controls the accepted manuscript block that appears on the public homepage. Editors can enter the full publication metadata and update it whenever the homepage spotlight changes."
          eyebrow="Accepted Manuscripts"
          title="Prepare the manuscript you want to publish on the homepage."
        />
      </Reveal>
      <Reveal delay={0.04}>
        <FilterChipBar
          items={[
            { label: manuscript ? "Configured" : "Empty", meta: "Homepage spotlight", active: true },
            { label: env.hasDatabaseUrl ? "Database" : "No database", meta: env.hasDatabaseUrl ? "Connected" : "Read-only" },
            { label: "Editor only", meta: "Protected" }
          ]}
        />
      </Reveal>
      <Reveal delay={0.08}>
        <AcceptedManuscriptForm canPersist={env.hasDatabaseUrl} initialData={manuscript} />
      </Reveal>
    </div>
  );
}
