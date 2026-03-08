# Physics & Chemistry Under the Microscope

Premium scientific magazine and editorial publishing platform built with Next.js, TypeScript, Tailwind CSS, Supabase Auth, and Prisma.

## Project Overview

Physics & Chemistry Under the Microscope is a premium editorial platform for publishing scientific reporting, long-form features, research summaries, interviews, issues, and internal publishing workflows. The repository includes both the public-facing magazine experience and a backend-ready editorial operations layer for submissions, review, approval, and publication.

The frontend is intentionally polished and publication-driven. The backend foundation is structured for real production development without replacing the current UI.

## Features

- Premium editorial homepage, article pages, issue pages, author pages, and team pages
- Protected publishing platform with dashboards, workflow detail pages, review screens, approvals, queue views, notifications, and email previews
- Supabase Auth integration for login, signup, logout, and session-aware route protection
- Prisma data model for articles, issues, reviews, decisions, notifications, attachments, and editorial operations
- Route-handler API scaffolding under the App Router
- Zod validation and service-layer workflow rules
- Role-aware access for authors, reviewers, editors, chief editors, and admins
- Seed strategy for realistic local development data

## Screenshots

Add project screenshots before publishing:

- `[Screenshot Placeholder] Public homepage`
- `[Screenshot Placeholder] Single article page`
- `[Screenshot Placeholder] Publishing platform dashboard`
- `[Screenshot Placeholder] Review workflow detail`

## Tech Stack

- Next.js 16 App Router
- React
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase Postgres and Storage
- Prisma ORM
- Zod
- Framer Motion

## Architecture Overview

The repository is split into a premium presentation layer and a backend-ready application layer:

- Public experience: magazine pages, issues, authors, article reading experience, and contact/submission surfaces
- Platform experience: dashboards, review workflows, approvals, publication queue, notifications, and email previews
- Auth and infrastructure: Supabase SSR helpers, middleware route protection, server actions, and profile bootstrap
- Data layer: Prisma models, repositories, services, and route handlers

Business logic is intentionally kept out of page components. Route handlers remain thin; orchestration lives in `lib/services/*`.

## Folder Structure

Core structure in this repository:

```text
app/                Next.js routes, layouts, pages, platform UI, and app/api route handlers
components/         Reusable UI, layout, auth, and platform components
data/               Editorial sample content and fallback demo data
docs/               Deployment and operational notes
lib/                Auth, Supabase, Prisma, services, repositories, validation, permissions
prisma/             Prisma schema and seed script
public/             Static public assets
types/              Shared TypeScript domain and UI types
```

Structure notes:

- Dashboard surfaces live in `app/platform`
- API routes live in `app/api`
- Global styles currently live in `app/globals.css` to align with the App Router

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values.

Required:

- `DATABASE_URL`
- `DIRECT_URL`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Optional:

- `SUPABASE_SERVICE_ROLE_KEY` (required only for Supabase Admin operations such as seed-user creation or future role management)
- `RESEND_API_KEY`
- `EMAIL_FROM`
- `DEV_ENABLE_PLATFORM_IMPERSONATION`
- `PORT`

Security notes:

- Never commit real environment files
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client
- Use the Supabase pooler connection string for `DATABASE_URL`
- Use the direct database connection string for `DIRECT_URL`
- Railway provides `PORT` automatically in production; the local default is `3000`

## Setup Instructions

1. Install dependencies

```bash
npm install
```

2. Create local environment variables

```bash
cp .env.example .env.local
```

3. Generate Prisma client

```bash
npm run db:generate
```

4. Apply schema locally

```bash
npm run db:migrate
```

If you want a schema sync during early local development:

```bash
npm run db:push
```

5. Seed development data

```bash
npm run db:seed
```

6. Start the application

```bash
npm run dev
```

## Running Locally

Recommended local workflow:

```bash
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Quality checks:

```bash
npm run lint
npm run typecheck
npm run build
```

## Development Notes

- The UI is production-quality, but some content is still seeded or fallback-driven for local development convenience
- Middleware protects `/submit`, `/platform`, and mutating API routes
- Service-layer workflow rules enforce article lifecycle transitions
- If Supabase or the database is not configured, some read paths fall back to editorial sample data while protected actions fail safely

## Deployment Guidance

Recommended production setup:

- Vercel for the Next.js application
- Supabase for Auth, Postgres, and Storage
- Resend or another transactional email provider for outbound notifications

Deployment workflow:

1. Create the Supabase project
2. Configure all required environment variables in Vercel
3. Set `NEXT_PUBLIC_SITE_URL` to the deployed domain
4. Add local, preview, and production auth redirect URLs in Supabase
5. Run production migrations:

```bash
npm run db:migrate:deploy
```

6. Deploy to Vercel

More deployment detail is available in [docs/DEPLOYMENT.md](/d:/journal%202/docs/DEPLOYMENT.md).

## Deploying on Railway

This repository is prepared to run on Railway with `npm run build` and `npm run start`.

What is already configured:

- [railway.json](/d:/journal%202/railway.json) defines the build command, start command, pre-deploy migration command, and health check path
- [scripts/start.mjs](/d:/journal%202/scripts/start.mjs) starts Next.js with `process.env.PORT || 3000`
- [app/api/healthz/route.ts](/d:/journal%202/app/api/healthz/route.ts) provides a startup-friendly health check
- production migrations are available through `npm run db:migrate:deploy`

Railway deployment steps:

1. Push the repository to GitHub.
2. Create a new Railway project and connect the GitHub repository.
3. Add the required environment variables from `.env.example`.
4. Ensure `DATABASE_URL` uses your production Postgres runtime connection and `DIRECT_URL` uses the direct migration connection.
5. Deploy the service. Railway will build with `npm run build`, run `node scripts/railway-predeploy.mjs` (which executes `prisma migrate deploy` only when DB env vars are real), and start the app with `npm run start`.

Manual actions you still need:

- create the Supabase project and configure Auth redirect URLs
- provision the production database and set `DATABASE_URL` and `DIRECT_URL`
- optionally add `RESEND_API_KEY` and a verified `EMAIL_FROM` sender when enabling transactional email

Operational notes:

- the app binds to Railway's injected `PORT` automatically
- the health endpoint is available at `/api/healthz`
- if auth or database env vars are incomplete, the app starts in a degraded but non-crashing state and protected features fail with clear configuration errors

## API and Backend Notes

Backend-ready pieces already included:

- `app/api/*` route handlers
- Prisma schema for publishing workflows
- repository and service layers
- role and capability checks
- Zod request validation
- notification and email-log scaffolding

This repository is ready for real backend development, but a real Supabase project and database migration run are still required before live deployment.
