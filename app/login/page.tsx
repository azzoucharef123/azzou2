import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { loginAction } from "@/app/actions/auth";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { getSafeRedirectTarget, getSession } from "@/lib/auth";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: "Login",
  description: "Login as an author to access the submission desk for Physics & Chemistry Under the Microscope."
};

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; notice?: string; redirectTo?: string }>;
}) {
  const { error, notice, redirectTo } = await searchParams;
  const session = await getSession();
  const safeRedirect = getSafeRedirectTarget(redirectTo);

  if (session) {
    redirect(safeRedirect);
  }

  return (
    <AuthShell
      description="Login is required before contributors and editorial staff can access the protected publishing platform, submission desk, and workflow operations."
      eyebrow="Platform Login"
      helperHref="/signup"
      helperLabel="Create an author account"
      helperText="Need publishing access?"
      title="Enter the scientific publishing platform."
    >
      <div className="space-y-5">
        <div className="space-y-2">
          <h2 className="display-title text-4xl font-semibold">Login</h2>
          <p className="text-sm leading-7 text-muted">
            Authenticate with your Supabase-backed account to open author, reviewer, and editorial workflows.
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
        {notice ? (
          <div className="rounded-[1.4rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-200">
            {notice}
          </div>
        ) : null}
        {error ? (
          <div className="rounded-[1.4rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-200">
            {error}
          </div>
        ) : null}
        <form action={loginAction} className="space-y-5">
          <input name="redirectTo" type="hidden" value={safeRedirect} />
          <label className="block space-y-2 text-sm font-medium text-foreground">
            Email address
            <input autoComplete="email" className="focus-ring h-12 w-full rounded-2xl border border-border bg-white/80 px-4 outline-none dark:bg-slate-950/45" name="email" required type="email" />
          </label>
          <label className="block space-y-2 text-sm font-medium text-foreground">
            Password
            <input autoComplete="current-password" className="focus-ring h-12 w-full rounded-2xl border border-border bg-white/80 px-4 outline-none dark:bg-slate-950/45" name="password" required type="password" />
          </label>
          <div className="rounded-[1.4rem] border border-border bg-white/70 px-4 py-3 text-sm leading-7 text-muted dark:bg-slate-950/35">
            Production note: this form now delegates to Supabase Auth. Seeded development accounts should be created through the provided database and auth setup flow.
          </div>
          <Button className="w-full" type="submit">
            Login
          </Button>
        </form>
        <p className="text-sm text-muted">
          No account yet?
          {" "}
          <Link className="focus-ring font-semibold text-foreground" href={`/signup?redirectTo=${encodeURIComponent(safeRedirect)}`}>
            Sign up as an author
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
