import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <span className="eyebrow">404</span>
      <h1 className="display-title mt-6 text-6xl font-semibold">Page not found</h1>
      <p className="mt-5 max-w-2xl text-base leading-8 text-muted">
        The page you requested is not in this edition of the magazine. Return to the homepage or continue into the editorial archive.
      </p>
      <div className="mt-8 flex gap-4">
        <Link className="focus-ring rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white dark:bg-white dark:text-slate-950" href="/">
          Back to home
        </Link>
        <Link className="focus-ring rounded-full border border-border px-5 py-3 text-sm font-semibold" href="/articles">
          Browse articles
        </Link>
      </div>
    </div>
  );
}
