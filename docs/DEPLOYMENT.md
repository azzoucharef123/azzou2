# Deployment Guide

This project is structured for a hosted deployment using Vercel for the Next.js app and Supabase for authentication, Postgres, and file storage.

## Environment Strategy

Set these variables in local development and in Vercel:

```env
DATABASE_URL=
DIRECT_URL=
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
EMAIL_FROM=
DEV_ENABLE_PLATFORM_IMPERSONATION=false
```

Guidance:

- `DATABASE_URL`: pooled Supabase Postgres connection string used by Prisma at runtime.
- `DIRECT_URL`: direct Postgres connection string used by Prisma migrations.
- `NEXT_PUBLIC_SITE_URL`: canonical app URL. Use `http://localhost:3000` locally and the Vercel production domain in production.
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: public Supabase browser key.
- `SUPABASE_SERVICE_ROLE_KEY`: server-only key for seed/bootstrap/admin tasks. Never expose this in client code.
- `RESEND_API_KEY`: optional until transactional email is connected.
- `EMAIL_FROM`: verified sender identity for email delivery.
- `DEV_ENABLE_PLATFORM_IMPERSONATION`: keep `false` outside isolated development.

## Database Connection Notes

For Supabase Postgres:

- Use the pooled connection string for `DATABASE_URL`.
- Use the direct connection string for `DIRECT_URL`.
- Keep both values server-side only.
- Do not expose Prisma or database credentials to the browser.

Typical split:

- `DATABASE_URL`: connection pooler for app traffic
- `DIRECT_URL`: direct database host for migrations

## Migration Workflow

Local development:

```bash
npm run db:generate
npm run db:migrate
```

If you need a quick non-migration sync in early development:

```bash
npm run db:push
```

Production deployment:

```bash
npm run db:migrate:deploy
```

Recommended process:

1. Create and test migrations locally.
2. Commit the Prisma schema and migration files.
3. Run `npm run db:migrate:deploy` in the production environment before or during rollout.

## Seed Workflow

Local/dev seed:

```bash
npm run db:seed
```

Seed behavior:

- Seeds editorial categories, tags, issues, articles, workflow records, notifications, and email templates.
- If `SUPABASE_SERVICE_ROLE_KEY` is configured, it also attempts to create real Supabase auth users for each seeded role.
- If Supabase admin creation is unavailable, database profiles are still created with deterministic ids for development.

Do not run the sample seed unmodified in production.

## Vercel Deployment Notes

Recommended setup:

1. Create the Supabase project first.
2. Configure all required environment variables in Vercel.
3. Connect the repository to Vercel.
4. Ensure the build command remains:

```bash
npm run build
```

5. Run Prisma deployment migrations as part of the deployment pipeline or a pre-deploy step:

```bash
npm run db:migrate:deploy
```

Operational notes:

- Vercel server functions should use `DATABASE_URL`.
- Keep `SUPABASE_SERVICE_ROLE_KEY` marked as a sensitive server environment variable.
- Set `NEXT_PUBLIC_SITE_URL` to the exact production URL to avoid auth redirect mismatches.
- Configure Supabase Auth redirect URLs to include local, preview, and production callback origins.

## Supabase Notes

Configure these areas in Supabase:

- Auth providers: email/password enabled
- Auth redirect URLs: local and deployed app URLs
- Database: Postgres project initialized
- Storage buckets: avatars, article assets, issue assets
- Security: add RLS where client-side access is introduced later

Current architecture keeps most business writes server-side through route handlers and services.

## Real Email Provider Next Steps

Recommended provider: Resend

Suggested rollout:

1. Add a mailer module that maps notification and workflow events to provider sends.
2. Use the existing `EmailTemplate` and `EmailLog` models as the source of truth.
3. Trigger sends from service-layer workflow events, not directly from UI components.
4. Persist provider response ids and delivery states back into `EmailLog`.
5. Add retry handling for transient failures.
6. Add provider webhooks later for delivered, bounced, and complained statuses.

Minimum first integration:

- wire `RESEND_API_KEY`
- send submission confirmation emails
- send reviewer assignment emails
- send chief editor decision emails
- log every outbound send to `EmailLog`
