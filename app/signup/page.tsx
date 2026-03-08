import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signupAction } from "@/app/actions/auth";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { getSafeRedirectTarget, getSession } from "@/lib/auth";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Register as an author to access the protected submission flow for Physics & Chemistry Under the Microscope."
};

export default async function SignupPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; redirectTo?: string }>;
}) {
  const { error, redirectTo } = await searchParams;
  const session = await getSession();
  const safeRedirect = getSafeRedirectTarget(redirectTo);

  if (session) {
    redirect(safeRedirect);
  }

  return (
    <AuthShell
      description="Create a real Supabase-backed author account to unlock the protected submission workflow and profile bootstrap."
      eyebrow="Author Registration"
      helperHref="/login"
      helperLabel="Login instead"
      helperText="Already registered on the platform?"
      title="Register for the editorial publishing platform."
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <h2 className="display-title text-4xl font-semibold">Sign Up</h2>
          <p className="text-sm leading-7 text-muted">
            Registration creates a real authentication record and bootstraps the linked publishing profile for author access.
          </p>
        </div>
        {!env.hasSupabaseAuth ? (
          <div className="rounded-[1.4rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-900 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-200">
            Supabase Auth is not configured for this deployment. Set real values for
            {" "}
            <span className="font-semibold">NEXT_PUBLIC_SUPABASE_URL</span>
            {" "}
            and
            {" "}
            <span className="font-semibold">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
            {" "}
            in your hosting provider, then redeploy.
          </div>
        ) : null}
        {error ? (
          <div className="rounded-[1.4rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-200">
            {error}
          </div>
        ) : null}
        <form action={signupAction} className="space-y-5">
          <input name="redirectTo" type="hidden" value={safeRedirect} />
          <label className="block space-y-2 text-sm font-medium text-foreground">
            Full name
            <input autoComplete="name" className="focus-ring h-12 w-full rounded-2xl border border-border bg-white/80 px-4 outline-none dark:bg-slate-950/45" name="fullName" required type="text" />
          </label>
          <label className="block space-y-2 text-sm font-medium text-foreground">
            Institutional affiliation
            <input
              autoComplete="organization"
              className="focus-ring h-12 w-full rounded-2xl border border-border bg-white/80 px-4 outline-none dark:bg-slate-950/45"
              name="affiliation"
              placeholder="e.g., Cavendish Laboratory, University of Cambridge"
              required
              type="text"
            />
          </label>
          <label className="block space-y-2 text-sm font-medium text-foreground">
            Professional headline (optional)
            <input
              autoComplete="organization-title"
              className="focus-ring h-12 w-full rounded-2xl border border-border bg-white/80 px-4 outline-none dark:bg-slate-950/45"
              name="headline"
              placeholder="e.g., Experimental physicist focused on quantum sensing"
              type="text"
            />
          </label>
          <label className="block space-y-2 text-sm font-medium text-foreground">
            Email address
            <input autoComplete="email" className="focus-ring h-12 w-full rounded-2xl border border-border bg-white/80 px-4 outline-none dark:bg-slate-950/45" name="email" required type="email" />
          </label>
          <label className="block space-y-2 text-sm font-medium text-foreground">
            Password
            <input autoComplete="new-password" className="focus-ring h-12 w-full rounded-2xl border border-border bg-white/80 px-4 outline-none dark:bg-slate-950/45" name="password" required type="password" />
          </label>
          <Button className="w-full" type="submit">
            Create account
          </Button>
        </form>
        <p className="text-sm text-muted">
          Already have access?
          {" "}
          <Link className="focus-ring font-semibold text-foreground" href={`/login?redirectTo=${encodeURIComponent(safeRedirect)}`}>
            Login
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
