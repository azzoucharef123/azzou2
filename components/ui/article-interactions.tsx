"use client";

import dynamic from "next/dynamic";

const ReadingProgress = dynamic(() => import("@/components/ui/reading-progress").then((mod) => mod.ReadingProgress), {
  ssr: false
});

export function ArticleInteractions() {
  return <ReadingProgress />;
}
