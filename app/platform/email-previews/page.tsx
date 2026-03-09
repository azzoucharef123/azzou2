import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { getEmailPreviews } from "@/lib/platform";
import { PlatformRole } from "@/types/platform";
import { EmailPreviewCard } from "@/components/platform/email-preview-card";
import { FilterChipBar } from "@/components/platform/filter-chip-bar";
import { PlatformAccessState } from "@/components/platform/platform-access-state";
import { TableCard } from "@/components/platform/table-card";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export const metadata: Metadata = {
  title: "Email Previews",
  description: "Premium editorial email preview templates for issue launches, author communication, and subscriber touchpoints."
};

const allowedRoles: PlatformRole[] = ["editor"];

export default async function PlatformEmailPreviewsPage() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  if (!allowedRoles.includes(session.activeRole)) {
    return (
        <PlatformAccessState
          allowedRoles={[...allowedRoles]}
          description="Email preview templates are handled by editors coordinating launches, revision requests, and subscriber communications."
          title="Email proofs require an editor account."
        />
    );
  }

  const previews = getEmailPreviews();

  return (
    <div className="space-y-6">
      <Reveal>
        <SectionHeading
          description="Review outbound editorial emails with the same care applied to headlines, issue pacing, and production polish."
          eyebrow="Email Previews"
          title="Subscriber and author email templates with editorial discipline."
        />
      </Reveal>
      <Reveal delay={0.04}>
        <FilterChipBar
          items={[
            { label: "Launch", meta: "Issue", active: true },
            { label: "Operational", meta: "Author" },
            { label: "Proofed", meta: String(previews.length) }
          ]}
        />
      </Reveal>
      <div className="grid gap-6 xl:grid-cols-2">
        {previews.map((preview, index) => (
          <Reveal delay={index * 0.05} key={preview.slug}>
            <EmailPreviewCard preview={preview} />
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.1}>
        <TableCard description="Operational checkpoints before email release." title="Email delivery checklist">
          <table>
            <thead>
              <tr>
                <th>Template</th>
                <th>Audience</th>
                <th>Editorial note</th>
              </tr>
            </thead>
            <tbody>
              {previews.map((preview) => (
                <tr key={preview.slug}>
                  <td>
                    <p className="font-semibold text-foreground">{preview.name}</p>
                    <p className="mt-1 text-sm text-muted">{preview.subject}</p>
                  </td>
                  <td>{preview.audience}</td>
                  <td>{preview.preheader}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableCard>
      </Reveal>
    </div>
  );
}
