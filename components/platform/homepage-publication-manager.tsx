"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { EyeOff, PencilLine, Plus, RotateCcw, Trash2 } from "lucide-react";
import {
  HomepagePublicationEditableFields,
  HomepagePublicationManagerData,
} from "@/types/accepted-manuscript";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/platform/status-badge";
import { formatDate } from "@/lib/utils";

function createDrafts(data: HomepagePublicationManagerData) {
  return Object.fromEntries(
    [...data.visible, ...data.hidden, ...data.deleted].map((item) => [
      item.slug,
      {
        title: item.title,
        subtitle: item.subtitle,
        excerpt: item.excerpt,
        authorName: item.authorName,
        publishedAt: item.publishedAt,
        coverTone: item.coverTone,
        coverMotif: item.coverMotif,
        order: item.order
      } satisfies HomepagePublicationEditableFields
    ])
  );
}

export function HomepagePublicationManager({
  data
}: {
  data: HomepagePublicationManagerData;
}) {
  const router = useRouter();
  const [selectedSlug, setSelectedSlug] = useState(data.available[0]?.slug ?? "");
  const [editorSlug, setEditorSlug] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, HomepagePublicationEditableFields>>(() => createDrafts(data));
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSelectedSlug(data.available[0]?.slug ?? "");
    setDrafts(createDrafts(data));
  }, [data]);

  const sections = useMemo(
    () => [
      { title: "Currently on homepage", description: "Only these articles render on the public homepage.", items: data.visible },
      { title: "Hidden from homepage", description: "These entries stay saved, but they no longer render publicly.", items: data.hidden },
      { title: "Removed from homepage", description: "These entries are removed from homepage surfaces until restored.", items: data.deleted }
    ],
    [data.deleted, data.hidden, data.visible]
  );

  function updateDraft<Key extends keyof HomepagePublicationEditableFields>(slug: string, key: Key, value: HomepagePublicationEditableFields[Key]) {
    setDrafts((current) => ({
      ...current,
      [slug]: {
        ...current[slug],
        [key]: value
      }
    }));
  }

  async function submitRequest(pendingLabel: string, init: RequestInit) {
    if (!data.canPersist) {
      setError("DATABASE_URL is not configured, so homepage publication controls are read-only.");
      return;
    }

    setPendingKey(pendingLabel);
    setError(null);

    try {
      const response = await fetch("/api/homepage-publications", init);
      const payload = (await response.json()) as { error?: { message?: string } };

      if (!response.ok) {
        throw new Error(payload.error?.message ?? "Unable to update homepage publications.");
      }

      router.refresh();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Unable to update homepage publications.");
    } finally {
      setPendingKey(null);
    }
  }

  async function addArticle() {
    if (!selectedSlug) {
      return;
    }

    await submitRequest(`add-${selectedSlug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: selectedSlug })
    });
  }

  async function saveArticle(slug: string) {
    await submitRequest(`save-${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, ...drafts[slug] })
    });

    setEditorSlug(null);
  }

  async function changeVisibility(slug: string, action: "hide" | "delete" | "restore") {
    await submitRequest(`${action}-${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, action })
    });
  }

  return (
    <div className="space-y-6">
      <section className="platform-panel rounded-[2rem] p-6 sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">Homepage publishing</p>
            <h2 className="display-title text-3xl font-semibold leading-[0.98]">Add an article to the homepage</h2>
            <p className="max-w-3xl text-sm leading-7 text-muted">Newly added articles are inserted at the top of the homepage order and render publicly immediately.</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row lg:max-w-xl">
            <select
              className="focus-ring h-12 w-full rounded-2xl border border-border bg-white/80 px-4 outline-none dark:bg-slate-950/45"
              onChange={(event) => setSelectedSlug(event.target.value)}
              value={selectedSlug}
            >
              {data.available.length ? (
                data.available.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.title} · {item.authorName}
                  </option>
                ))
              ) : (
                <option value="">All available archive articles are already managed</option>
              )}
            </select>
            <Button disabled={!selectedSlug || pendingKey === `add-${selectedSlug}` || !data.available.length} onClick={addArticle} type="button">
              <Plus className="mr-2 h-4 w-4" />
              Add to homepage
            </Button>
          </div>
        </div>
        {error ? <p className="mt-4 text-sm text-rose-700 dark:text-rose-300">{error}</p> : null}
      </section>

      {sections.map((group) => (
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
                        <StatusBadge label={`Order ${item.order + 1}`} tone="blue" />
                        <StatusBadge label={item.visibility} tone={item.visibility === "visible" ? "emerald" : item.visibility === "hidden" ? "amber" : "rose"} />
                      </div>
                      <div>
                        <h3 className="display-title text-[1.9rem] font-semibold leading-[0.98]">{item.title}</h3>
                        <p className="mt-2 text-sm leading-7 text-muted">
                          {item.authorName} · {item.categoryName} · Published {formatDate(item.publishedAt)}
                        </p>
                        <p className="mt-3 text-sm leading-7 text-muted">{item.excerpt}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Button disabled={!data.canPersist || pendingKey === `save-${item.slug}`} onClick={() => setEditorSlug(editorSlug === item.slug ? null : item.slug)} type="button" variant="secondary">
                        <PencilLine className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      {item.visibility === "visible" ? (
                        <>
                          <Button
                            disabled={!data.canPersist || pendingKey === `hide-${item.slug}`}
                            onClick={() => changeVisibility(item.slug, "hide")}
                            type="button"
                            variant="secondary"
                          >
                            <EyeOff className="mr-2 h-4 w-4" />
                            Hide
                          </Button>
                          <Button
                            className="border-rose-300/40 text-rose-800 dark:text-rose-200"
                            disabled={!data.canPersist || pendingKey === `delete-${item.slug}`}
                            onClick={() => changeVisibility(item.slug, "delete")}
                            type="button"
                            variant="secondary"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        </>
                      ) : (
                        <Button disabled={!data.canPersist || pendingKey === `restore-${item.slug}`} onClick={() => changeVisibility(item.slug, "restore")} type="button" variant="secondary">
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Restore
                        </Button>
                      )}
                    </div>
                  </div>

                  {editorSlug === item.slug ? (
                    <div className="mt-5 grid gap-4 rounded-[1.35rem] border border-border bg-white/75 p-4 dark:bg-slate-950/40 md:grid-cols-2">
                      <label className="space-y-2 text-sm font-medium md:col-span-2">
                        Homepage title
                        <input className="focus-ring h-12 w-full rounded-2xl border border-border bg-white/80 px-4 outline-none dark:bg-slate-950/45" onChange={(event) => updateDraft(item.slug, "title", event.target.value)} type="text" value={drafts[item.slug]?.title ?? ""} />
                      </label>
                      <label className="space-y-2 text-sm font-medium md:col-span-2">
                        Subtitle
                        <input className="focus-ring h-12 w-full rounded-2xl border border-border bg-white/80 px-4 outline-none dark:bg-slate-950/45" onChange={(event) => updateDraft(item.slug, "subtitle", event.target.value)} type="text" value={drafts[item.slug]?.subtitle ?? ""} />
                      </label>
                      <label className="space-y-2 text-sm font-medium md:col-span-2">
                        Homepage summary
                        <textarea className="focus-ring min-h-32 w-full rounded-[1.4rem] border border-border bg-white/80 px-4 py-3 outline-none dark:bg-slate-950/45" onChange={(event) => updateDraft(item.slug, "excerpt", event.target.value)} value={drafts[item.slug]?.excerpt ?? ""} />
                      </label>
                      <label className="space-y-2 text-sm font-medium">
                        Author display
                        <input className="focus-ring h-12 w-full rounded-2xl border border-border bg-white/80 px-4 outline-none dark:bg-slate-950/45" onChange={(event) => updateDraft(item.slug, "authorName", event.target.value)} type="text" value={drafts[item.slug]?.authorName ?? ""} />
                      </label>
                      <label className="space-y-2 text-sm font-medium">
                        Publication date
                        <input className="focus-ring h-12 w-full rounded-2xl border border-border bg-white/80 px-4 outline-none dark:bg-slate-950/45" onChange={(event) => updateDraft(item.slug, "publishedAt", event.target.value)} type="date" value={drafts[item.slug]?.publishedAt ?? ""} />
                      </label>
                      <label className="space-y-2 text-sm font-medium">
                        Display order
                        <input className="focus-ring h-12 w-full rounded-2xl border border-border bg-white/80 px-4 outline-none dark:bg-slate-950/45" min={0} onChange={(event) => updateDraft(item.slug, "order", Number(event.target.value))} type="number" value={drafts[item.slug]?.order ?? 0} />
                      </label>
                      <label className="space-y-2 text-sm font-medium">
                        Cover tone
                        <select className="focus-ring h-12 w-full rounded-2xl border border-border bg-white/80 px-4 outline-none dark:bg-slate-950/45" onChange={(event) => updateDraft(item.slug, "coverTone", event.target.value as HomepagePublicationEditableFields["coverTone"])} value={drafts[item.slug]?.coverTone ?? "blue"}>
                          {(["blue", "silver", "cyan", "amber", "violet", "emerald"] as const).map((tone) => (
                            <option key={tone} value={tone}>
                              {tone}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="space-y-2 text-sm font-medium">
                        Cover motif
                        <select className="focus-ring h-12 w-full rounded-2xl border border-border bg-white/80 px-4 outline-none dark:bg-slate-950/45" onChange={(event) => updateDraft(item.slug, "coverMotif", event.target.value as HomepagePublicationEditableFields["coverMotif"])} value={drafts[item.slug]?.coverMotif ?? "atoms"}>
                          {(["atoms", "waves", "lattice", "spectrum", "microscope", "crystal"] as const).map((motif) => (
                            <option key={motif} value={motif}>
                              {motif}
                            </option>
                          ))}
                        </select>
                      </label>
                      <div className="md:col-span-2 flex justify-end">
                        <Button disabled={!data.canPersist || pendingKey === `save-${item.slug}`} onClick={() => saveArticle(item.slug)} type="button">
                          Save homepage details
                        </Button>
                      </div>
                    </div>
                  ) : null}
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
