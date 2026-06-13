# Open Plovdiv

Open Plovdiv is a static civic-transparency prototype for Plovdiv. It helps people browse public projects, budget categories, and city-fix reports without accounts, comments, or a database.

The current repository uses sample data that is clearly labeled as prototype data. Replace the curated JSON files with reviewed public records before treating the site as a live public-information service.

## Stack

- Astro + TypeScript for the static website
- JSON files as the source of truth
- Node scripts for validation and public data generation
- No database, no user accounts, no personal data collection

## Run Locally

```bash
npm install
make data
make dev
```

The development server starts the website from `apps/web`.

## Common Commands

```bash
make dev       # start the Astro development server
make build     # regenerate public JSON and build the static site
make data      # copy curated JSON into apps/web/public/data
make validate  # validate curated data against JSON schemas
make test      # run validation and unit tests
```

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

The MVP avoids private user data. Fix reports are seed records only and do not include names, emails, phone numbers, IP addresses, account identifiers, or exact private addresses.
