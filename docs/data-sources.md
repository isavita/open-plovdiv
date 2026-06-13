# Data Sources

Open Plovdiv starts with reviewed JSON files, not live scraping. The first implementation uses prototype records so the interface can be tested before official data is imported.

## Initial Sources

| Source | URL | Used for | Accessed |
| --- | --- | --- | --- |
| Община Пловдив | https://www.plovdiv.bg/ | Future official project, budget, and municipal documents | 2026-06-13 |
| Регистър на обществените поръчки | https://www2.aop.bg/ | Future procurement and contract verification | 2026-06-13 |
| OpenStreetMap | https://www.openstreetmap.org/ | Map tiles and spatial context | 2026-06-13 |
| Prototype seed data | https://openplovdiv.example/methodology | Sample records used only to test the MVP | 2026-06-13 |

## Current Limitation

The records in `data/curated` are marked `sample`. They are not official claims about active Plovdiv projects or municipal spending. Before public launch, each project and budget item should link to the exact source document used to support it.
