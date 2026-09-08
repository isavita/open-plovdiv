# Visitor redesign — 8 September 2026

The homepage now introduces Plovdiv as a place to visit and a city to understand. Its reading order is: welcome, four essential places, three walks, historical chapters, practical travel information.

## Editorial decisions

- Replace the dense homepage with a photographic introduction, readable headings and one clear first-day route.
- Remove the mayor-era grid and civic/community promotions from the homepage. Keep those destinations in the menu and footer for readers interested in local government and civic life.
- Keep the historical chapters, archives, sources and stories. Group the history page's people, geography/climate, growth tables and data downloads in an expandable research section. Existing section links automatically open the relevant content.
- Use real route durations and distances, with direct links to the route pages. Promote the step-free, station-to-centre and rainy-day walks where they help a visitor make a decision.
- Add six practical topics in all 13 supported languages: currency, rail travel, terrain/accessibility, museums, tourist information and events. Link to the responsible organisations for changing details such as opening hours and timetables.

## Sources checked

- [European Central Bank: Bulgaria's euro changeover](https://www.ecb.europa.eu/euro/changeover/bulgaria/html/index.en.html): euro adoption on 1 January 2026.
- [Municipality: Nebet Tepe opening, 20 March 2025](https://www.plovdiv.bg/20250320/): restoration and reopening of the archaeological complex.
- [Old Plovdiv: Ancient Theatre](https://oldplovdiv.bg/en/sights/3): first-century construction and continued use as a performance venue.
- [Old Plovdiv: visitor tickets](https://oldplovdiv.bg/en/tickets): authoritative destination for current admission details.
- [Municipal tourist information](https://www.plovdiv.bg/en/tourists/plan-your-trip/tourist-information/), [BDZ](https://www.bdz.bg/en), and [Visit Plovdiv events](https://www.visitplovdiv.com/en/events): live visitor resources.

## Images and mobile behaviour

Six credited Commons photographs now have locally served, compressed derivatives: the Ancient Theatre, Old Town, Kapana, Nebet Tepe, the 1892 fair and the 1928 library photograph. The two main mobile hero images also have AVIF versions. The original images' dates and licenses remain distinct from the site's current visitor advice. See [image credits](../apps/web/public/images/plovdiv/README.md).

The design uses one-column cards on phones, wrapping navigation, large touch targets, visible keyboard focus, reduced-motion support, and immediate dark-mode navigation colours. Bulgarian, Japanese and long German/Polish labels were inspected at narrow widths. All 13 homepages were checked at 320 pixels without horizontal overflow.

## Validation scope

Validation covers the production build, TypeScript, data and unit tests, generated-page accessibility checks, history APIs and historical page surfaces. Browser checks cover phone-width Chromium and WebKit, menu/language/theme controls, search, place filtering, history deep links and the first-day route's map links.

Final checks passed: 110 tests, TypeScript, production build, static accessibility checks on 7,476 HTML pages, 15 history API endpoints/downloads and the history-surface suite. The mobile Lighthouse gate passed its 95 minimum across `/`, `/en/`, `/en/history/` and `/en/places/`: performance 95, 95, 98 and 98 respectively; accessibility and SEO 100 on all four. These are local simulated-mobile measurements, not field performance data.

This is a focused visitor and presentation redesign. It does not claim a fresh scholarly audit of every historical record, a native-speaker review of every existing translation, or testing on a physical iPhone. Changes are local; no deployment was made.
