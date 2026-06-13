# Data Sources

Open Plovdiv starts with reviewed JSON files for project and budget records, not live scraping. Citizen problem reports are stored separately and appear publicly only after moderation.

## Initial Sources

| Source | URL | Used for | Accessed |
| --- | --- | --- | --- |
| Община Пловдив | https://www.plovdiv.bg/ | Future official project, budget, and municipal documents | 2026-06-13 |
| Регистър на обществените поръчки | https://www2.aop.bg/ | Future procurement and contract verification | 2026-06-13 |
| OpenStreetMap | https://www.openstreetmap.org/ | Map tiles and spatial context | 2026-06-13 |
| Citizen submissions | /fix-map/report | Public problem reports after moderator approval | 2026-06-13 |

## Current Limitation

The project and budget records in `data/curated` are marked `sample`. They are not official claims about active Plovdiv projects or municipal spending. Before public launch, each project and budget item should link to the exact source document used to support it. `data/curated/fix-reports.json` is intentionally empty; the live signal map uses approved citizen reports from the report store.
