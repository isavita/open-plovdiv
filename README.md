# Open Plovdiv

Open Plovdiv is an informational, source-backed website about Plovdiv: its history, places, people, neighbourhoods, walking routes, governance, public projects and community initiatives.

The public site is deliberately read-only. It has no user accounts, comments, complaint forms, initiative submissions, moderation dashboard or public administration area. Community pages are an editorial directory of existing initiatives and link visitors directly to organisers and public sources.

## Stack

- Astro + TypeScript
- Bulgarian at the root plus English, German, French, Italian, Turkish, Spanish, Greek, Japanese, Filipino, Ukrainian, Russian and Polish locale routes
- Reviewed JSON as the source of truth
- Node scripts for validation, normalization and public-data generation
- Public source links and visible media attribution

## Run locally

```bash
npm install
make data
make dev
```

The development server starts the website from `apps/web`.

## Deploy on Railway

This repository is an npm workspace monorepo. Deploy it from the repository root so data generation runs before the Astro build. `railway.json` defines the build, start command and health check.

Railway supplies `RAILWAY_PUBLIC_DOMAIN` during the build automatically. For
other production environments, configure the canonical origin explicitly:

- `PUBLIC_SITE_URL`: the required canonical public URL, for example `https://openplovdiv.example.org`

Local production builds must also provide an origin, for example:

```bash
PUBLIC_SITE_URL=http://localhost:4321 npm run build
```

## Common commands

```bash
make dev       # start the Astro development server
make build     # regenerate public JSON and build the site
make data      # copy curated JSON into apps/web/public/data
make validate  # validate curated data against JSON schemas
make test      # run validation and unit tests
```

## Repository layout

```text
apps/web/              Astro website
data/curated/          reviewed source JSON used by the site
data/generated/        normalized history knowledge exports
data/schemas/          JSON schemas for curated records
scripts/normalize/     deterministic public JSON generation
scripts/validate/      data and surface checks
docs/                  methodology, privacy and source documentation
tests/                 shared test fixtures
```

## Editorial model

Open Plovdiv does not accept public submissions. Changes are made in the curated source files, must retain a public source where possible, and must pass validation and the production build before publication. Community initiatives remain external: Open Plovdiv neither operates them nor processes their donations.
