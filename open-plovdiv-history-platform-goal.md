# Goal — Make Open Plovdiv the definitive digital history of Plovdiv

**Mission.** Turn Open Plovdiv into the most complete, rigorously sourced, bilingual (BG/EN) open-knowledge platform on the 8,000-year history of one of the world's oldest cities — trusted by citizens, schools, journalists and researchers, with **every claim traceable to a source**.

## Workstream A — Data (the foundation)
Build a normalized, cross-linked knowledge base of five entity types — **Events, People, Places, Organizations, Sources** — each with stable IDs, BG+EN fields, geo-coordinates where relevant, era tags, media and full provenance.
- **Timeline:** grow from ~22 to **≥300 dated events**, prehistory → today; every entry cites ≥1 public source (≥2 independent sources for any contested date/figure), with conflicts noted.
- **People (prosopography):** all 66 mayors fully profiled **plus ≥200 notable Plovdivians** (revolutionaries, architects, clergy, artists, benefactors), interlinked by family, succession, mentorship and organization.
- **Places:** grow from 6 to **≥150 landmarks/sites**, each with coordinates, build/era dates, architect/builder, current status and ≥1 rights-cleared image.
- **Archival layer:** georeference **≥30 historical maps/photographs**, assemble **≥20 then/now pairs**, and transcribe a starter set of primary documents (council minutes, period press).
- **Open data:** publish the whole base as versioned JSON/CSV + a documented public REST API; **100% schema-validated in CI**; every record carries source URL, license and accessed date.

## Workstream B — Sections (the experience)
- **Interactive historical map** — per-era layers, the seven hills, old-map overlays, themed walking routes.
- **Deep timeline** — filterable by era/theme/place/person, with "on this day".
- **People graph** — the mayor arc-diagram expanded to all notable people and their relationships.
- **Landmark pages** — then/now sliders, panoramas where available, visiting info.
- **Story longreads** — **≥10** illustrated features (Trimontium, the Revival houses, the Unification, the 1928 earthquake, ECoC 2019…).
- **Education hub** — **≥5** lesson plans, quizzes, printable + audio guided tours (BG/EN narration).
- **Community contributions** — citizens submit photos/memories through the existing moderation pipeline, sourced before publishing.

## Definition of done (acceptance criteria)
- [ ] ≥300 events, ≥200 people, ≥150 places — all cited and interlinked; **zero uncited claims**.
- [ ] Interactive map + people graph + filtered timeline live, in **full BG/EN parity**.
- [ ] ≥10 longreads, education hub, and the then/now + georeferenced archive online.
- [ ] Public open-data export + documented API; CI data-validation green on every commit.
- [ ] WCAG 2.1 AA; Lighthouse ≥95 mobile; **every image license-cleared** (PD/CC) with credits.
- [ ] Independent editorial sign-off logged for 100% of published content.
