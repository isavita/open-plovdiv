# Open Plovdiv

Open Plovdiv is an informational, source-backed website about Plovdiv: its history, places, people, neighbourhoods, walking routes, governance, public projects and community initiatives.

The public site is deliberately read-only. It has no user accounts, comments, complaint forms, initiative submissions, moderation dashboard or public administration area. Community pages are an editorial directory of existing initiatives and link visitors directly to organisers and public sources.

## Stack

- Astro + TypeScript
- Bulgarian at the root plus English, German, French, Italian, Turkish, Spanish, Greek, Japanese, Filipino, Ukrainian, Russian, Polish and Portuguese locale routes
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

This repository is an npm workspace monorepo. Deploy it from the repository root so data generation runs before the Astro build. The Railway Infrastructure as Code definition in `.railway/railway.ts` manages this service as a named partial; variables remain managed in Railway. Keep secrets there, not in the repository.

Changes to `.railway/railway.ts` require a Railway plan and apply: pushing the file alone does not apply infrastructure changes. With the Railway CLI linked to the correct project and production environment, run `railway config plan` and review the entire result, including domains, variables, services, volumes and databases. Apply only the intended changes with `railway config apply`; if the plan contains unexpected changes, stop and investigate. A saved plan (`railway config plan --out railway-plan.json`, followed by `railway config apply --plan railway-plan.json`) can pin the reviewed changes to the configuration and environment state. Do not commit the plan file, which may contain sensitive operational details.

The GitHub integration deploys watched changes on `main` separately from applying the infrastructure definition. Railpack uses the Node version pinned in `.node-version`. Before any redeployment, check for persistent volumes, databases and any temporary data in the running container, and preserve anything needed. Review any new paid resources and their cost before adding them.

CI uses that same Node version and checks the generated sitemap, language alternatives and representative page metadata after the build. Dependabot checks npm packages and GitHub Actions weekly; its pull requests still need review and CI before merging. Update the Node pin separately as new supported releases become available.

The site provides an [`/llms.txt`](https://openplovdiv.com/llms.txt) guide and a Markdown alternate for each public page, linked from its HTML. The production server derives Markdown from the corresponding prerendered page on demand, so it follows content updates; interactive or client-loaded content may be absent. Source links and the original HTML remain important context. These endpoints follow the [llms.txt proposal](https://llmstxt.org/) and do not change crawler access rules.

If a plan repeatedly reports `ON_FAILURE` / 10 restart-policy drift, verify the resolved service instance through Railway's API before interpreting it as an unapplied change; see [Railway CLI issue 1184](https://github.com/railwayapp/cli/issues/1184).

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
npm run validate:seo  # check generated SEO artifacts after a production build
npm run validate:llms # check the llms.txt guide and Markdown pages after a build
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
