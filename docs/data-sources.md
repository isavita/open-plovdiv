# Data Sources

Open Plovdiv uses reviewed JSON files for project and budget records, not live scraping. Every record links to a public source. Citizen problem reports are stored separately and appear publicly only after moderation.

## Sources used

| Source | URL | Used for | Accessed |
| --- | --- | --- | --- |
| Община Пловдив — бюджет 2025 | https://www.plovdiv.bg/presentation-budget-2025/ | 2025 total budget, capital programme and sector shares | 2026-06-14 |
| Община Пловдив — текущи проекти | https://www.plovdiv.bg/en/item/projects/current_projects/ | Current municipal projects | 2026-06-14 |
| Общински съвет — Пловдив | http://plovdiv.bg/obs/ | Budget and capital-programme decisions | 2026-06-14 |
| TrafficNews | https://trafficnews.bg/plovdiv/obshtina-plovdiv-shte-harchi-715-mln-leva-prez-2025-a-chaka-341501/ | 2025 budget total and projects | 2026-06-14 |
| Под тепето | https://podtepeto.com/aktualno/obsthina-plovdiv-planira-blizo-87-mln-evro-za-kapitalovi-razhodi-prez-2026-g/ | Provisional 2026 capital programme, funding sources and two state-subsidy projects | 2026-06-14 |
| TrafficNews — проектобюджет 2026 | https://trafficnews.bg/plovdiv/bez-promiana-plovdiv-noviia-byudzhet-no-zamraziha-15-golemi-363745/ | Expected 2026 funding, new 2026 starts and postponed projects (BGN 0 for 2025–2026) | 2026-06-14 |
| Дарик | https://darik.bg/parvi-budzet-v-evro-za-plovdiv-vliza-na-glasuvane-v-obstinskia-savet~503815.html | 2026 budget context (first in euros) | 2026-06-14 |
| Регистър на обществените поръчки (АОП) | https://www.aop.bg/ | Procurement and contract verification | 2026-06-14 |
| OpenStreetMap | https://www.openstreetmap.org/ | Map tiles and spatial context | 2026-06-14 |
| Citizen submissions | /fix-map/report | Public problem reports after moderator approval | 2026-06-14 |

The same list is shown to visitors at `/data-sources` (and `/en/data-sources`).

## Known limitations (June 2026)

- **2026 is provisional.** The 2026 capital programme was adopted as a forecast estimate (прогнозен разчет) and is given here in euros; figures may change once the state budget is adopted. Such records are marked `provisional`.
- **2025 sector amounts are approximate.** The per-sector lev figures are derived from the published percentage shares of the ~139.6M лв capital programme, not from a line-by-line table.
- **No per-project completion list.** The municipality does not publish a single, citable "completed in 2025" status per project. Statuses here reflect what is sourced and each project page shows a source-backed timeline where available: started/continuing, new for 2026, or postponed (frozen with BGN 0 for 2025–2026).
- **Locations are approximate**, placed by street/district and marked as such on each project.
- `data/curated/fix-reports.json` is intentionally empty; the live map uses approved citizen reports from the report store.
