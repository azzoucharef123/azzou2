"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ensureProfileForSupabaseUser } from "@/lib/services/auth-service";
import { getSafeRedirectTarget, requireSupabaseAuthConfigured, resolveCanonicalRole } from "@/lib/auth";
import { loginSchema, signupSchema } from "@/lib/validators/auth";

function getField(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function loginAction(formData: FormData) {
  const payload = loginSchema.safeParse({
    email: getField(formData, "email").toLowerCase(),
    password: getField(formData, "password"),
    redirectTo: getField(formData, "redirectTo")
  });

  if (!payload.success) {
    redirect("/login?error=Please enter a valid email and password.");
  }

  const redirectTo = getSafeRedirectTarget(payload.data.redirectTo);

  try {
    requireSupabaseAuthConfigured();
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: payload.data.email,
      password: payload.data.password
    });

    if (error || !data.user) {
      redirect(`/login?error=${encodeURIComponent(error?.message ?? "Unable to login.")}&redirectTo=${encodeURIComponent(redirectTo)}`);
    }

    await ensureProfileForSupabaseUser(data.user);
    redirect(redirectTo);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to login.";
    redirect(`/login?error=${encodeURIComponent(message)}&redirectTo=${encodeURIComponent(redirectTo)}`);
  }
}

export async function signupAction(formData: FormData) {
  const payload = signupSchema.safeParse({
    fullName: getField(formData, "fullName"),
    affiliation: getField(formData, "affiliation"),
    headline: getField(formData, "headline"),
    email: getField(formData, "email").toLowerCase(),
    password: getField(formData, "password"),
    redirectTo: getField(formData, "redirectTo")
  });

  if (!payload.success) {
    redirect("/signup?error=Please complete every field with a valid password.");
  }

  const redirectTo = getSafeRedirectTarget(payload.data.redirectTo);
  const assignedRole = resolveCanonicalRole(payload.data.email, "author");

  try {
    requireSupabaseAuthConfigured();
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signUp({
      email: payload.data.email,
      password: payload.data.password,
      options: {
        data: {
          full_name: payload.data.fullName,
          role: assignedRole,
          affiliation: payload.data.affiliation,
          headline: payload.data.headline
        }
      }
    });

    if (error || !data.user) {
      redirect(`/signup?error=${encodeURIComponent(error?.message ?? "Unable to create your account.")}&redirectTo=${encodeURIComponent(redirectTo)}`);
    }

    await ensureProfileForSupabaseUser(data.user, assignedRole);

    if (!data.session) {
      redirect(`/login?notice=${encodeURIComponent("Account created. Check your email to confirm your address, then sign in.")}&redirectTo=${encodeURIComponent(redirectTo)}`);
    }

    redirect(redirectTo);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create your account.";
    redirect(`/signup?error=${encodeURIComponent(message)}&redirectTo=${encodeURIComponent(redirectTo)}`);
  }
}

export async function logoutAction() {
  try {
    requireSupabaseAuthConfigured();
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  } catch {
    // Redirect regardless so the UI does not hang on sign-out failures.
  }

  redirect("/");
}
