# Open Plovdiv

Open Plovdiv is a civic-transparency prototype for Plovdiv. It helps people browse public projects, budget categories, and reviewed citizen-submitted city-fix reports without accounts or comments.

The current repository still uses sample project and budget data. The public signal map is driven by moderated citizen submissions, not seed/demo signal records.

## Stack

- Astro + TypeScript for the static website
- Bilingual interface: Bulgarian at the root, English under `/en/`, with a language switcher and light/dark themes
- JSON files as the source of truth (each record carries Bulgarian and English text)
- Node scripts for validation and public data generation
- Existing project and budget data remains static JSON
- Citizen reports use a dynamic layer with Redis when configured, or a local file store in development
- No user accounts and no contact details in report submissions

## Run Locally

```bash
npm install
make data
make dev
```

The development server starts the website from `apps/web`.

## Deploy on Railway

This repository is an npm workspace monorepo. Deploy it from the repository
root, not from `apps/web`, so the root data-generation step runs before the
Astro build.

If Railway's monorepo import stages a service for `apps/web`, open that
service's settings and keep Root Directory as `/` (or blank/default). If you
need to point Railway at the config file manually, use `/railway.json`.

Railway can read `railway.json`, which sets:

- Build command: `npm run build`
- Start command: `npm start`
- Healthcheck path: `/`

Set production variables in Railway before opening moderation publicly:

- `ADMIN_TOKEN`: required for `/admin/reports`
- `IP_HASH_SALT`: stable random salt for rate-limit hashes
- `PUBLIC_SITE_URL`: optional canonical URL, for example your Railway domain
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`: recommended for
  persistent reports across redeploys
- `REPORT_IMAGE_*`: recommended S3/R2-backed public image storage for approved
  photos

Without Redis or external image storage, the app falls back to Railway's
container filesystem, which is useful for smoke tests but not durable across
redeploys.

## Common Commands

```bash
make dev       # start the Astro development server
make build     # regenerate public JSON and build the static site
make data      # copy curated JSON into apps/web/public/data
make validate  # validate curated data against JSON schemas
make export-reports # export approved citizen reports to public JSON
make test      # run validation and unit tests
```

## Citizen Reports

The report layer adds:

- `/fix-map/report` for citizen submissions
- `/admin/reports` for moderation
- `POST /api/reports` for submission
- `GET /api/reports/public` for approved map reports
- `GET /api/reports/stream` for Server-Sent Events
- admin-only approve, reject, edit details, hide-photo, and status update endpoints

Set `ADMIN_TOKEN` before using the admin dashboard outside local development. With no Redis environment variables, reports are stored locally under `apps/web/.data/`. With `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`, metadata is stored in Redis. Moderators can update report text, category, coordinates, address, public status, and photo visibility. Uploaded photos are converted to WebP with metadata stripped, kept private until approval, and then copied to the configured public uploads directory.

## Repository Layout

```text
apps/web/              Astro static website
data/curated/          reviewed source JSON used by the site
data/schemas/          JSON schemas for public data records
scripts/normalize/     deterministic public JSON generation
scripts/validate/      data validation checks
docs/                  methodology, privacy, sources, moderation docs
tests/                 shared test fixtures or future integration tests
```

## Data Safety

The MVP avoids private contact data. Citizen reports reject text that looks like email or phone details, store only a temporary salted IP hash for rate limiting, and never publish reports or photos before moderation.
