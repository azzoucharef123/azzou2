"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { EyeOff, RotateCcw, Trash2 } from "lucide-react";
import { HomepagePublicationManagerItem } from "@/types/accepted-manuscript";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/platform/status-badge";
import { formatDate } from "@/lib/utils";

type PublicationGroups = {
  visible: HomepagePublicationManagerItem[];
  hidden: HomepagePublicationManagerItem[];
  deleted: HomepagePublicationManagerItem[];
};

export function HomepagePublicationManager({
  groups,
  canPersist
}: {
  groups: PublicationGroups;
  canPersist: boolean;
}) {
  const router = useRouter();
  const [pendingSlug, setPendingSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function updatePublication(slug: string, action: "hide" | "delete" | "restore") {
    if (!canPersist) {
      setError("DATABASE_URL is not configured, so homepage publication controls are read-only.");
      return;
    }

    setPendingSlug(slug);
    setError(null);

    try {
      const response = await fetch("/api/homepage-publications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ slug, action })
      });

      const payload = (await response.json()) as { error?: { message?: string } };

      if (!response.ok) {
        throw new Error(payload.error?.message ?? "Unable to update homepage publication visibility.");
      }

      router.refresh();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Unable to update homepage publication visibility.");
    } finally {
      setPendingSlug(null);
    }
  }

  return (
    <div className="space-y-6">
      {error ? <p className="text-sm text-rose-700 dark:text-rose-300">{error}</p> : null}

      {[
        {
          title: "Currently on homepage",
          description: "These articles are visible on the homepage right now.",
          items: groups.visible
        },
        {
          title: "Hidden from homepage",
          description: "These articles are still available in the magazine, but they no longer appear on the homepage.",
          items: groups.hidden
        },
        {
          title: "Removed from homepage",
          description: "These articles were removed from homepage surfaces and can still be restored if needed.",
          items: groups.deleted
        }
      ].map((group) => (
        <section className="platform-panel rounded-[2rem] p-6 sm:p-7" key={group.title}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-2">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Homepage publications</p>
              <h2 className="display-title text-3xl font-semibold leading-[0.98]">{group.title}</h2>
              <p className="max-w-3xl text-sm leading-7 text-muted">{group.description}</p>
            </div>
            <StatusBadge label={String(group.items.length).padStart(2, "0")} tone={group.title === "Currently on homepage" ? "emerald" : group.title === "Hidden from homepage" ? "amber" : "rose"} />
          </div>

          <div className="mt-6 space-y-4">
            {group.items.length ? (
              group.items.map((item) => (
                <article className="rounded-[1.5rem] border border-border bg-white/70 p-5 dark:bg-slate-950/35" key={`${group.title}-${item.slug}`}>
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge label={item.categorySlug.replaceAll("-", " ")} tone="blue" />
                        <StatusBadge label={item.visibility} tone={item.visibility === "visible" ? "emerald" : item.visibility === "hidden" ? "amber" : "rose"} />
                      </div>
                      <div>
                        <h3 className="display-title text-[1.9rem] font-semibold leading-[0.98]">{item.title}</h3>
                        <p className="mt-2 text-sm leading-7 text-muted">
                          {item.authorName} · Published {formatDate(item.publishedAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {item.visibility === "visible" ? (
                        <>
                          <Button
                            disabled={pendingSlug === item.slug || !canPersist}
                            onClick={() => updatePublication(item.slug, "hide")}
                            type="button"
                            variant="secondary"
                          >
                            <EyeOff className="mr-2 h-4 w-4" />
                            Hide
                          </Button>
                          <Button
                            className="border-rose-300/40 text-rose-800 dark:text-rose-200"
                            disabled={pendingSlug === item.slug || !canPersist}
                            onClick={() => updatePublication(item.slug, "delete")}
                            type="button"
                            variant="secondary"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        </>
                      ) : (
                        <Button
                          disabled={pendingSlug === item.slug || !canPersist}
                          onClick={() => updatePublication(item.slug, "restore")}
                          type="button"
                          variant="secondary"
                        >
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Restore
                        </Button>
                      )}
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[1.4rem] border border-dashed border-border bg-white/60 p-5 text-sm leading-7 text-muted dark:bg-slate-950/25">
                No articles are currently listed in this state.
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
