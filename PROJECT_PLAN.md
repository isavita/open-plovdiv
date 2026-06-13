# Project naming

## Naming principles

The name should be:

* **Neutral** — not anti-government, not party-political.
* **Local-first** — clearly connected to Plovdiv.
* **Expandable** — should work later for Sofia, Varna, Burgas, etc.
* **Simple in Bulgarian and English**.
* **Trustworthy** — sounds like public information, not activism only.
* **Not accusatory** — avoid words like “corruption”, “mafia”, “scandal”, “expose”.

## Recommended project names

### Best option

```text
Open Plovdiv
```

Bulgarian:

```text
Отворен Пловдив
```

Why this works:

* simple
* neutral
* expandable later to “Open Bulgaria”
* clear civic-tech meaning
* sounds like transparency, not conflict

Suggested tagline:

```text
Public projects, public money, public problems — made easier to understand.
```

Bulgarian:

```text
Обществени проекти, публични средства и градски проблеми — представени ясно.
```

---

## Other good options

| Name                   | Bulgarian                   | Notes                        |
| ---------------------- | --------------------------- | ---------------------------- |
| **Open Plovdiv**       | Отворен Пловдив             | Best overall                 |
| **Plovdiv Monitor**    | Пловдив Монитор             | Slightly more watchdog-style |
| **Clear Plovdiv**      | Ясен Пловдив                | Friendly, simple             |
| **Plovdiv Public Map** | Обществена карта на Пловдив | Very descriptive             |
| **My Plovdiv Map**     | Моята карта на Пловдив      | More citizen-focused         |
| **Plovdiv in Public**  | Пловдив публично            | Good transparency feel       |

## Names to avoid

Avoid names like:

```text
Corrupt Plovdiv
Where They Steal
Government Watchdog Bulgaria
Expose Plovdiv
```

They create legal, political, and trust problems. Better to show facts clearly and let users draw conclusions.

---

# Recommended MVP name

```text
Open Plovdiv
```

Repository name:

```text
open-plovdiv
```

Domain ideas:

```text
openplovdiv.bg
otvorenplovdiv.bg
plovdiv.public.bg
```

---

# Product plan: Open Plovdiv

## 0. Project goal

Build a nonprofit, public-data-based website for Plovdiv that helps citizens understand:

* what needs fixing in the city
* what public projects are planned or active
* where local public money is going
* which project relates to which place, budget line, and public source

The project should start simple, avoid storing user data, and avoid a normal database where possible.

---

# 1. Product scope

## Included in MVP

* [x] Fix Map
* [x] Local taxes / budget explorer
* [x] Public project pages
* [x] Public source links for every claim
* [x] Static or mostly-static data files
* [x] Admin-free or minimal-admin workflow
* [x] Bulgarian-first interface
* [x] English optional later (Bulgarian at the root, English under `/en/`, with a language switcher)

## Excluded from MVP

* [x] User accounts
* [x] Comments
* [x] Voting
* [x] Political party ratings
* [x] Corruption scoring
* [x] National municipality comparison
* [x] Private personal data storage
* [x] Postgres or heavy database setup

Acceptance criteria:

* The MVP can be run locally.
* The website works without login.
* All displayed public data has a source URL.
* No private user data is required to use the site.

---

# 2. Suggested simple architecture

## Preferred architecture

```text
Public data sources
        ↓
Ingestion scripts
        ↓
Raw files in repo or object storage
        ↓
Normalized JSON files
        ↓
Static website reads JSON
        ↓
Map, budget pages, project pages
```

## Recommended stack

### Frontend

Use one of:

* **Astro** — best for static content and simple pages.
* **Next.js static export** — good if you prefer React and future flexibility.
* **SvelteKit static adapter** — also good, but only if you prefer Svelte.

Recommended:

```text
Astro + TypeScript
```

Reason:

* simple static site
* fast
* low hosting cost
* easy to generate pages from JSON
* no backend required for MVP

### Data scripts

Use:

```text
Python
```

For:

* downloading public files
* parsing CSV/XLSX/PDF
* calling AI models for summaries
* generating clean JSON

### Data storage

Start with files:

```text
/data/raw
/data/processed
/data/curated
/public/data
```

Use Redis only later for:

* caching external API responses
* job queues
* rate limiting
* temporary AI extraction state

Do **not** use Redis as the primary long-term source of truth unless necessary. For this project, versioned JSON files are better at the beginning.

---

# 3. Repository structure

Create this structure:

```text
open-plovdiv/
  README.md
  PROJECT_PLAN.md
  package.json
  apps/
    web/
      src/
      public/
        data/
  data/
    raw/
    processed/
    curated/
    schemas/
  scripts/
    ingest/
    normalize/
    ai/
    validate/
  docs/
    methodology.md
    data-sources.md
    privacy.md
    moderation.md
  tests/
```

Acceptance criteria:

* The repository has the folders above.
* `README.md` explains how to run the project.
* `PROJECT_PLAN.md` contains this checklist.
* `docs/data-sources.md` lists all initial source URLs.
* `docs/privacy.md` explains that the project avoids personal data.

---

# 4. Data model

Create simple JSON schemas first.

## 4.1 Project schema

File:

```text
data/schemas/project.schema.json
```

Example:

```json
{
  "id": "plovdiv-2025-road-001",
  "title_bg": "Ремонт на улица ...",
  "title_en": "Repair of street ...",
  "summary_bg": "Кратко описание на проекта.",
  "category": "roads",
  "status": "planned",
  "municipality": "plovdiv",
  "district": null,
  "location": {
    "lat": 42.1354,
    "lng": 24.7453,
    "address_bg": "Пловдив"
  },
  "budget": {
    "amount_bgn": 100000,
    "year": 2025,
    "funding_source": "municipal_budget"
  },
  "sources": [
    {
      "title": "Budget 2025 attachment",
      "url": "https://...",
      "accessed_at": "2026-06-13"
    }
  ],
  "updated_at": "2026-06-13"
}
```

Acceptance criteria:

* Every project has a stable `id`.
* Every project has at least one source URL.
* Every money amount includes currency.
* Every generated project page uses this schema.

---

## 4.2 Fix report schema

For MVP, avoid storing personal data. Allow only public issue data.

File:

```text
data/schemas/fix-report.schema.json
```

Example:

```json
{
  "id": "fix-plovdiv-0001",
  "title_bg": "Счупена настилка",
  "description_bg": "Пешеходната настилка е повредена.",
  "category": "pavement",
  "status": "unverified",
  "location": {
    "lat": 42.141,
    "lng": 24.75,
    "address_bg": "Пловдив"
  },
  "photo_url": null,
  "submitted_source": "manual_seed",
  "sources": [],
  "created_at": "2026-06-13",
  "updated_at": "2026-06-13"
}
```

Important MVP decision:

Do **not** allow public user submissions immediately unless you are ready for moderation.

Start with:

```text
manual_seed
```

That means you manually add 20–50 example reports.

Acceptance criteria:

* No name, email, phone, IP address, or account data is stored.
* Reports can be displayed on a map.
* Reports can be filtered by category and status.
* Each report has a clear status: `unverified`, `verified`, `sent_to_municipality`, `fixed`, or `closed`.

---

## 4.3 Budget item schema

File:

```text
data/schemas/budget-item.schema.json
```

Example:

```json
{
  "id": "budget-plovdiv-2025-transport-001",
  "year": 2025,
  "municipality": "plovdiv",
  "category": "transport",
  "title_bg": "Транспортна инфраструктура",
  "amount_bgn": 5000000,
  "source_document": {
    "title": "Budget 2025",
    "url": "https://...",
    "accessed_at": "2026-06-13"
  }
}
```

Acceptance criteria:

* Budget items are grouped by year.
* Amounts are displayed in BGN.
* Every item links to a public source.
* The UI can show totals by category.

---

# 5. Website pages

## 5.1 Homepage

Path:

```text
/
```

Content:

* short explanation of the project
* link to Fix Map
* link to Budget Explorer
* link to Projects
* latest updated projects
* latest added fix reports
* explanation that the site uses public data

Checklist:

* [x] Create homepage layout.
* [x] Add project mission.
* [x] Add three main cards:

  * Fix Map
  * Where did my local taxes go?
  * Public Projects
* [x] Add “Data sources and methodology” link.
* [x] Add nonprofit/public-data disclaimer.

Acceptance criteria:

* A new visitor understands the website in under 10 seconds.
* The homepage does not make accusations.
* The homepage links to all main MVP sections.

---

## 5.2 Fix Map

Path:

```text
/fix-map
```

Features:

* map of Plovdiv
* issue markers
* category filter
* status filter
* issue detail panel
* nearby project links

Categories:

```text
roads
pavement
street_lighting
parks
waste
public_transport
accessibility
drainage
other
```

Statuses:

```text
unverified
verified
sent_to_municipality
in_progress
fixed
closed
```

Checklist:

* [x] Add OpenStreetMap-based map.
* [x] Load reports from `/data/fix-reports.json`.
* [x] Show markers by category.
* [x] Add filter by category.
* [x] Add filter by status.
* [x] Add issue detail drawer/card.
* [x] Show nearby public projects within a configurable radius.
* [x] Add explanation of report statuses.
* [x] Add “How to report officially to the municipality” section.

Acceptance criteria:

* The map loads without a backend.
* At least 20 seed issues are visible.
* Clicking a marker opens a clear detail view.
* Reports do not include personal data.
* The page clearly says whether a report is verified or unverified.

---

## 5.3 Where did my local taxes go?

Path:

```text
/budget
```

Features:

* budget by year
* spending categories
* simple charts
* plain-language explanation
* source links
* related public projects

Checklist:

* [x] Load budget data from `/data/budget-items.json`.
* [x] Add year selector.
* [x] Add category cards.
* [x] Add total amount display.
* [x] Add simple bar chart or table.
* [x] Add “plain language explanation” section.
* [x] Link budget categories to relevant projects.
* [x] Show source documents.

Acceptance criteria:

* User can choose a year.
* User can see spending grouped by category.
* All amounts are formatted in BGN.
* Every category links to source data.
* Budget page works from static JSON.

---

## 5.4 Public projects list

Path:

```text
/projects
```

Features:

* list of projects
* filters by category, status, year
* search by title
* map/list toggle optional

Checklist:

* [x] Load projects from `/data/projects.json`.
* [x] Add search by title.
* [x] Add category filter.
* [x] Add status filter.
* [x] Add year filter.
* [x] Add project cards.
* [x] Add links to project pages.

Acceptance criteria:

* At least 20 seed projects are visible.
* Search works client-side.
* Filters work client-side.
* Each project links to its own page.

---

## 5.5 Public project page

Path:

```text
/projects/[project-id]
```

Each project page should show:

* title
* summary
* category
* location
* budget amount
* year
* status
* source documents
* related fix reports nearby
* timeline, if available

Checklist:

* [x] Generate static page for each project.
* [x] Show project title and summary.
* [x] Show budget amount.
* [x] Show status.
* [x] Show map location, if available.
* [x] Show related budget item.
* [x] Show nearby fix reports.
* [x] Show source links.
* [x] Show “last updated” date.

Acceptance criteria:

* Each project page can be opened directly by URL.
* Every displayed fact has a source or is clearly marked as estimated/manual.
* Nearby fix reports are shown only by location matching.
* Page does not contain unsupported claims.

---

# 6. Data ingestion plan

## 6.1 Manual MVP ingestion first

Do not over-automate immediately.

Start with:

```text
data/curated/projects.json
data/curated/budget-items.json
data/curated/fix-reports.json
```

Checklist:

* [ ] Manually collect 20–50 public projects from Plovdiv sources.
* [x] Manually collect budget categories for one year.
* [x] Manually create 20–50 seed fix reports from visible/publicly known issues or demo examples.
* [x] Add source URLs for every project and budget item.
* [x] Mark manually created fix reports as `unverified`.

Acceptance criteria:

* The website works with curated JSON only.
* No scraping is required for the first version.
* All data can be reviewed in Git.

---

## 6.2 Add ingestion scripts later

Scripts folder:

```text
scripts/ingest/
```

Possible scripts:

```text
download_plovdiv_budget.py
parse_budget_xlsx.py
normalize_projects.py
generate_public_data.py
validate_data.py
```

Checklist:

* [ ] Add script to download source files.
* [ ] Save original files to `/data/raw`.
* [ ] Parse source files into `/data/processed`.
* [x] Validate processed files against schemas.
* [x] Generate final files into `apps/web/public/data`.

Acceptance criteria:

* Running one command regenerates public JSON.
* Raw source files are preserved.
* Generated data is deterministic.
* Invalid records fail validation.

Suggested command:

```bash
make data
```

Expected result:

```text
apps/web/public/data/projects.json
apps/web/public/data/budget-items.json
apps/web/public/data/fix-reports.json
```

---

# 7. AI usage plan

AI should assist, not become the source of truth.

Use AI for:

* summarising budget lines
* translating bureaucratic text into clear Bulgarian
* classifying project categories
* extracting possible locations from text
* creating draft descriptions

Do not use AI for:

* making accusations
* inventing missing values
* estimating corruption
* claiming a project is failed without evidence

Checklist:

* [x] Add `scripts/ai/summarize_project.py`.
* [x] Add `scripts/ai/classify_project.py`.
* [x] Add `scripts/ai/extract_location.py`.
* [ ] Store AI output as draft fields.
* [ ] Mark AI-generated fields clearly in data.
* [ ] Require human review before publishing AI-generated summaries.

Acceptance criteria:

* AI-generated summaries are stored separately or marked as reviewed.
* AI never creates facts without a source.
* The website can display whether a summary is AI-assisted.

---

# 8. No-database strategy

## MVP storage

Use static files:

```text
projects.json
budget-items.json
fix-reports.json
sources.json
```

Benefits:

* simple hosting
* cheap
* transparent
* easy to review in Git
* no user data risk
* easy for agents to modify

## When Redis may be used

Only add Redis if needed for:

* caching downloaded public data
* storing temporary background job state
* rate limiting public submission forms
* queueing AI processing jobs

Do not use Redis for:

* permanent project records
* source-of-truth data
* user accounts
* long-term audit history

Checklist:

* [x] Start with JSON files only.
* [x] Do not add database dependency in MVP.
* [ ] Add Redis only behind an optional feature flag.
* [x] Keep generated JSON as the public source of truth.

Acceptance criteria:

* Site can run without Redis.
* Build can run without Redis.
* Public pages are generated from JSON files.
* Redis is optional and not required for deployment.

---

# 9. Privacy and safety rules

Checklist:

* [x] No user accounts.
* [x] No public comments in MVP.
* [x] No personal names in fix reports unless already official public data.
* [x] No private phone numbers or emails.
* [x] No exact private addresses for citizen-submitted issues.
* [ ] Blur or reject photos containing faces, children, car plates, or private interiors.
* [x] Add moderation rules before enabling submissions.
* [x] Add clear correction request process.
* [x] Add source links for all official data.

Acceptance criteria:

* `docs/privacy.md` exists.
* `docs/moderation.md` exists.
* The site explains what data is collected.
* The MVP can work without collecting any personal data.

---

# 10. Design requirements

Style:

* clean
* civic
* trustworthy
* not aggressive
* mobile-first
* Bulgarian-first

Pages should use:

* simple cards
* clear maps
* source badges
* status badges
* readable money amounts
* minimal animation

Checklist:

* [x] Add consistent layout.
* [x] Add mobile navigation.
* [x] Add status badge component.
* [x] Add source link component.
* [x] Add money formatter.
* [x] Add category icons.
* [x] Add empty states.
* [x] Add loading states.
* [x] Add error states.

Acceptance criteria:

* Works well on mobile.
* Budget numbers are easy to read.
* Source links are visible.
* Status is visually clear.
* No page feels like a political attack site.

---

# 11. Status definitions

Use clear, non-accusatory statuses.

## Project statuses

```text
planned
funded
contracted
in_progress
completed
delayed
unknown
```

## Fix report statuses

```text
unverified
verified
sent_to_municipality
in_progress
fixed
closed
```

Checklist:

* [x] Define statuses in shared constants.
* [x] Display status explanation in UI.
* [x] Use the same statuses across pages.
* [x] Avoid emotional labels like “ignored” or “scandal”.

Acceptance criteria:

* Every project has exactly one status.
* Every fix report has exactly one status.
* Users can understand what each status means.

---

# 12. Source and methodology pages

## Data sources page

Path:

```text
/data-sources
```

Checklist:

* [x] List all source websites.
* [x] Show access date.
* [x] Show what each source is used for.
* [x] Explain limitations.
* [x] Link to raw source where possible.

Acceptance criteria:

* Every dataset shown on the website appears on this page.
* Users can verify the original source.

## Methodology page

Path:

```text
/methodology
```

Checklist:

* [x] Explain how data is collected.
* [x] Explain how data is cleaned.
* [x] Explain how AI is used.
* [x] Explain how errors can be corrected.
* [x] Explain what the website does not claim.

Acceptance criteria:

* The site clearly separates facts, summaries, and manual interpretation.
* The site avoids unsupported conclusions.

---

# 13. Development milestones

## Milestone 1 — Static prototype

Goal:

Build the website with fake/sample JSON.

Checklist:

* [x] Create project repo.
* [x] Add Astro/Next/SvelteKit app.
* [x] Add sample JSON files.
* [x] Build homepage.
* [x] Build Fix Map.
* [x] Build Budget page.
* [x] Build Projects list.
* [x] Build Project detail page.

Done when:

* The website runs locally.
* All main pages exist.
* Sample data appears correctly.
* No backend is needed.

---

## Milestone 2 — Real Plovdiv seed data

Goal:

Replace fake data with manually curated real public data.

Checklist:

* [ ] Collect 20–50 Plovdiv projects.
* [ ] Collect one year of budget category data.
* [ ] Add source URLs.
* [ ] Add project summaries.
* [ ] Add approximate locations where safe.
* [ ] Add 20–50 seed fix reports.
* [ ] Validate all JSON.

Done when:

* Site uses real Plovdiv data.
* Every official claim has a source.
* Data passes schema validation.

---

## Milestone 3 — Data validation

Goal:

Make data safe and consistent.

Checklist:

* [x] Add JSON schemas.
* [x] Add validation script.
* [x] Add CI check.
* [x] Validate required fields.
* [x] Validate URLs.
* [x] Validate coordinates.
* [x] Validate money amounts.
* [x] Validate status values.

Done when:

* Pull requests fail if data is invalid.
* Public JSON cannot be generated from invalid records.

---

## Milestone 4 — AI-assisted summaries

Goal:

Use AI credits to make public data easier to understand.

Checklist:

* [x] Add AI summary script.
* [x] Add category classification script.
* [x] Add location extraction script.
* [ ] Store AI outputs as draft.
* [ ] Add human-reviewed flag.
* [ ] Publish only reviewed summaries.

Done when:

* AI can generate summaries from source text.
* AI output is not treated as fact without review.
* Published summaries are readable in Bulgarian.

---

## Milestone 5 — Public deployment

Goal:

Deploy the static website.

Checklist:

* [ ] Choose hosting.
* [x] Add production build.
* [ ] Add domain.
* [x] Add analytics without personal tracking, or skip analytics.
* [x] Add privacy page.
* [ ] Add correction request email or form.
* [ ] Add GitHub link.
* [ ] Add license.

Done when:

* Site is publicly available.
* Pages load quickly.
* Source and methodology pages are visible.
* Users can report corrections.

---

# 14. Commands the agent should create

Recommended commands:

```bash
make dev
make build
make data
make validate
make test
```

Acceptance criteria:

* `make dev` starts the website.
* `make build` builds the static site.
* `make data` regenerates public JSON.
* `make validate` checks all data files.
* `make test` runs unit tests.

---

# 15. First agent task

Give the product agent this first instruction:

```text
Create the initial Open Plovdiv repository structure.

Use a simple static-first architecture. Prefer Astro + TypeScript unless there is a strong reason not to. Do not add a database. Do not add user accounts. Create sample JSON data for projects, budget items, and fix reports. Build the first version of the homepage, fix map, budget page, projects list, and project detail page. Add PROJECT_PLAN.md, docs/data-sources.md, docs/methodology.md, docs/privacy.md, and docs/moderation.md. Add validation schemas for the JSON data. The site must run locally and build without external services.
```

## Completion criteria for the first agent task

* [x] Repository has clean folder structure.
* [x] Website runs locally.
* [x] Website builds successfully.
* [x] Homepage exists.
* [x] Fix Map exists.
* [x] Budget page exists.
* [x] Projects list exists.
* [x] Project detail page exists.
* [x] Sample JSON data exists.
* [x] JSON schemas exist.
* [x] Validation command exists.
* [x] No database is used.
* [x] No user accounts are implemented.
* [x] Documentation pages exist.
* [x] All MVP pages work from local static JSON.

Status note: the first agent task and static prototype are complete. Remaining unchecked items are
future work for real official Plovdiv data, full ingestion automation, AI-assisted publishing,
public deployment, and public-submission moderation.

---

# 16. Recommended first version summary

Build this first:

```text
Open Plovdiv
A static civic-transparency website for Plovdiv.
No accounts.
No database.
Public data only.
JSON files as source of truth.
Map of city problems.
Budget explorer.
Project pages.
Clear source links.
AI-assisted summaries later.
```
