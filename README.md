# Open Plovdiv

Open Plovdiv is an informational, source-backed website about Plovdiv: its history, places, people, neighbourhoods, walking routes, governance, public projects and community initiatives.

The public site is deliberately read-only. It has no user accounts, comments, complaint forms, initiative submissions, moderation dashboard or public administration area. Community pages are an editorial directory of existing initiatives and link visitors directly to organisers and public sources.

## Stack

- Astro + TypeScript
- Bulgarian at the root plus English, German, French, Italian, Turkish, Spanish, Greek, Japanese, Simplified Chinese, Filipino, Ukrainian, Russian, Polish and Portuguese locale routes
- Curated JSON as the source of truth
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

The site provides an [`/llms.txt`](https://openplovdiv.com/llms.txt) guide and a Markdown alternate for each public page, linked from its HTML. For example, `/en/places.md` and `/en/places/index.md` both provide the English places page, `/zh/places.md` provides the Simplified Chinese places page, and the root page uses `/index.md`. The production server derives Markdown from the corresponding prerendered page on demand, so it follows content updates; interactive or client-loaded content may be absent. Source links and the original HTML remain important context. These endpoints follow the [llms.txt proposal](https://llmstxt.org/) and do not change crawler access rules.

### IndexNow

The IndexNow workflow runs after a successful Railway production deployment, retries every six hours, and can also be started manually from GitHub Actions. It verifies the latest production deployment and compares rendered page content, search metadata and referenced local JSON data with its last saved snapshot. It notifies participating search engines only about added, changed or removed canonical pages. The first run establishes a baseline without automatically submitting the whole sitemap. Content loaded dynamically from sources not referenced in a page's JSON configuration may not be detected. The primary endpoint is `api.indexnow.org`; if it returns HTTP 403, the workflow tries the Yandex IndexNow endpoint. Participating engines are expected to share submissions, but a Yandex HTTP 200 confirms only that Yandex accepted the batch, not that Bing received or indexed it. IndexNow does not guarantee crawling or indexing, and Google does not use this integration.

The same random `INDEXNOW_KEY` is stored as a Railway service variable and a GitHub Actions secret. Railway's build writes the required public key file to the built site; the key is not committed to this repository. The six-hour job retries outstanding changes even if there has been no later deployment; when the current deployment is already submitted, it refreshes the unchanged snapshot before GitHub's 90-day artifact expiry without resubmitting URLs. If the latest snapshot is deleted or expires—for example if GitHub disables schedules after prolonged inactivity—the workflow fails closed rather than guessing which changes were missed. Review unsent changes and restore or deliberately re-establish the baseline before resuming notifications. Failed batches do not advance the snapshot; retrying can resend an already accepted batch. An HTTP 202 means provider key validation is pending. The workflow retries twice and fails without advancing the snapshot if validation remains pending; re-run it after validation is complete. A later successful deployment or the next scheduled run compares against the retained snapshot and retries outstanding changes. You can also run the IndexNow workflow manually from the Actions tab.

If Bing returns 403, first verify the deployed root key file is publicly reachable and exactly matches the key used by the workflow. If it still rejects the correct key, coordinate a new random key in both the Railway variable and GitHub Actions secret without printing or committing its value, then deploy so Railway writes the new public key file. A 202 response means Bing's validation is still pending, not that submission is confirmed; wait and verify direct Bing acceptance with HTTP 200. The Yandex fallback remains available, but its acceptance alone does not confirm Bing received the URLs.

During key rotation, an optional GitHub Actions secret `INDEXNOW_PREVIOUS_KEY` can hold the previous key until the new Railway deployment is live. If the new key's public file is absent or mismatched, the workflow uses the previous key only when its own public file matches; network errors and other unexpected responses fail closed. Once the new public file is verified and submissions are working, remove the transitional secret. Neither key belongs in the repository or workflow logs.

Some older runs saved a snapshot after HTTP 202. That response did not confirm ownership validation. If such a run may not have completed validation, compare the current deployment with the last retained snapshot from before the uncertain submission and replay all added, changed and removed URLs after the key is verified. Do not assume that the latest saved snapshot proves those earlier notifications were processed.

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

Translated content uses dictionaries in `data/translations/`; reviewed corrections are also kept in `reviewed-overrides.json` (and `zh-reviewed.json` for Chinese) so the translation generator retains them. Literal image filenames remain unchanged as source identifiers. Translation checks catch specific known mistakes and structural problems, but do not replace review of historical meaning, names and dates by a fluent reader.
