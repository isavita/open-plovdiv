import { categoryLabels, ui, type Lang } from "../i18n/ui";
import { field, localizePath } from "../i18n/utils";
import {
  communityInitiatives,
  historyKnowledgeEvents,
  historyKnowledgePeople,
  historyKnowledgePlaces,
  projects,
  storyLongreads
} from "./data";
import { neighbourhoodHistories } from "./neighbourhoods";
import { neighbourhoodLabels } from "./neighbourhoodLabels";
import { editorialReviewStatusLabel } from "./editorial";
import { routeLabels } from "./routeLabels";
import { walkingRoutes } from "./routes";
import {
  normalizeSearchText,
  type SiteSearchItem,
  type SiteSearchKind
} from "./searchCore";
import { siteSearchKindLabel } from "./siteSearchI18n";

export type SiteSearchIndex = {
  count: number;
  suggestions: string[];
  items: SiteSearchItem[];
};

type SearchItemInput = {
  id: string;
  kind: SiteSearchKind;
  title: string;
  description?: string;
  href: string;
  meta?: string;
  titleAliases?: string[];
  aliases?: unknown[];
  weight?: number;
};

const kindWeights: Record<SiteSearchKind, number> = {
  page: 30,
  route: 22,
  place: 18,
  story: 16,
  neighbourhood: 15,
  person: 12,
  project: 10,
  initiative: 9,
  event: 2
};

const governanceTitles: Record<Lang, string> = {
  bg: "Управление",
  en: "Governance",
  de: "Verwaltung",
  fr: "Gouvernance",
  it: "Governo",
  tr: "Yönetim",
  es: "Gobernanza",
  el: "Διακυβέρνηση",
  ja: "統治",
  tl: "Pamamahala",
  uk: "Управління",
  ru: "Управление",
  pl: "Zarządzanie"
};

function localized(record: unknown, base: string, lang: Lang): string {
  return field(record as Record<string, unknown>, base, lang).trim();
}

function collectStrings(value: unknown, limit = 32): string[] {
  const result: string[] = [];
  const visit = (entry: unknown, depth: number) => {
    if (result.length >= limit || depth > 3 || entry == null) return;
    if (typeof entry === "string") {
      const clean = entry.trim();
      if (clean && !/^https?:\/\//i.test(clean)) result.push(clean.slice(0, 260));
      return;
    }
    if (typeof entry === "number") {
      result.push(String(entry));
      return;
    }
    if (Array.isArray(entry)) {
      entry.slice(0, limit).forEach((item) => visit(item, depth + 1));
      return;
    }
    if (typeof entry === "object") {
      Object.values(entry as Record<string, unknown>)
        .slice(0, limit)
        .forEach((item) => visit(item, depth + 1));
    }
  };
  visit(value, 0);
  return result;
}

const localeKeySuffix = /_(bg|en|de|fr|it|tr|es|el|ja|tl|uk|ru|pl)$/;

/**
 * Like collectStrings, but object fields carrying another locale's suffix are
 * skipped, so each locale's index ships long-form text (place histories,
 * story sections, quarter timelines) only in its own language. Cross-language
 * findability stays with names and titles, which are indexed as aliases.
 */
function collectLocalizedStrings(value: unknown, lang: Lang, limit = 24): string[] {
  const result: string[] = [];
  const visit = (entry: unknown, depth: number) => {
    if (result.length >= limit || depth > 3 || entry == null) return;
    if (typeof entry === "string") {
      const clean = entry.trim();
      if (clean && !/^https?:\/\//i.test(clean)) result.push(clean.slice(0, 200));
      return;
    }
    if (typeof entry === "number") {
      result.push(String(entry));
      return;
    }
    if (Array.isArray(entry)) {
      entry.slice(0, limit).forEach((item) => visit(item, depth + 1));
      return;
    }
    if (typeof entry === "object") {
      for (const [key, item] of Object.entries(entry as Record<string, unknown>).slice(0, 48)) {
        const suffix = localeKeySuffix.exec(key)?.[1];
        if (suffix && suffix !== lang) continue;
        visit(item, depth + 1);
      }
    }
  };
  visit(value, 0);
  return result;
}

function localizedVariants(record: unknown, bases: string[], lang: Lang): string[] {
  const source = record as Record<string, unknown>;
  const values = bases.flatMap((base) => [
    localized(source, base, lang),
    typeof source[base] === "string" ? source[base] : "",
    typeof source[`${base}_bg`] === "string" ? source[`${base}_bg`] : "",
    typeof source[`${base}_en`] === "string" ? source[`${base}_en`] : ""
  ]);
  return [...new Set(values.filter((value): value is string => Boolean(value)))];
}

function excerpt(value: string, maximum = 190): string {
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length <= maximum) return clean;
  const cut = clean.slice(0, maximum + 1);
  const boundary = cut.lastIndexOf(" ");
  return `${cut.slice(0, boundary > maximum * 0.65 ? boundary : maximum).trim()}…`;
}

function makeItem(input: SearchItemInput, lang: Lang): SiteSearchItem {
  const title = input.title.trim();
  const description = excerpt(input.description ?? "");
  const aliasText = collectStrings(input.aliases ?? [], 56).join(" ");
  // The ranker matches word by word, so the payload only needs each word once.
  const searchWords = [
    ...new Set(
      normalizeSearchText(
        `${title} ${description} ${input.meta ?? ""} ${input.id.replaceAll("-", " ")} ${aliasText}`
      ).split(" ")
    )
  ].filter(Boolean);
  return {
    id: input.id,
    kind: input.kind,
    typeLabel: siteSearchKindLabel(input.kind, lang),
    title,
    description,
    href: input.href,
    meta: input.meta,
    titleSearch: normalizeSearchText(title),
    titleAliases: [...new Set((input.titleAliases ?? []).map(normalizeSearchText).filter(Boolean))],
    searchText: searchWords.slice(0, 150).join(" "),
    weight: input.weight ?? kindWeights[input.kind]
  };
}

function buildPageItems(lang: Lang): SiteSearchItem[] {
  const t = ui[lang] as unknown as Record<string, any>;
  const routes = routeLabels(lang);
  const neighbourhoods = neighbourhoodLabels(lang);
  const fallback = String(t.site.tagline);
  const pages: Array<[string, string, string, unknown[]?]> = [
    ["/", t.site.name, t.site.tagline, [t.nav.home]],
    ["/history", t.nav.history, t.history?.lead ?? fallback],
    ["/routes", routes.indexTitle, routes.indexLead],
    ["/places", t.nav.places, t.history?.mapLead ?? fallback],
    ["/stories", t.nav.stories, t.history?.storiesLead ?? fallback],
    ["/neighbourhoods", neighbourhoods.indexTitle, neighbourhoods.indexLead],
    ["/mayors", t.mayors.title, t.mayors.lead],
    ["/people", t.nav.people, t.history?.peopleLead ?? fallback],
    ["/governance", governanceTitles[lang], t.history?.governanceLead ?? fallback],
    ["/overview", t.nav.overview, t.overview.lead],
    ["/projects", t.nav.projects, t.projects.lead],
    ["/community", t.nav.community, t.community.lead],
    ["/archive", t.nav.archive, t.archive?.lead ?? fallback],
    ["/data-sources", t.footer.sources, t.footer.dataNote],
    [
      "/history/editorial-review",
      editorialReviewStatusLabel(lang),
      t.history?.sourceNote ?? fallback
    ],
    ["/privacy", t.privacy.title, t.privacy.lead]
  ];
  return pages.map(([path, title, description, aliases]) =>
    makeItem(
      {
        id: `page:${path === "/" ? "home" : path.slice(1)}`,
        kind: "page",
        title: String(title),
        description: String(description),
        href: localizePath(path, lang),
        aliases
      },
      lang
    )
  );
}

export function buildSiteSearchIndex(lang: Lang): SiteSearchIndex {
  const t = ui[lang] as unknown as Record<string, any>;
  const peopleNames = new Map(
    historyKnowledgePeople.map((person) => [person.id, localized(person, "name", lang)])
  );
  const placeNames = new Map(
    historyKnowledgePlaces.map((place) => [place.id, localized(place, "name", lang)])
  );
  const items: SiteSearchItem[] = [...buildPageItems(lang)];

  for (const route of walkingRoutes) {
    const stopNames = route.stops.map((stop) => placeNames.get(stop.place_id)).filter(Boolean);
    items.push(
      makeItem(
        {
          id: `route:${route.id}`,
          kind: "route",
          title: localized(route, "title", lang),
          description: localized(route, "summary", lang),
          href: localizePath(`/routes/${route.id}`, lang),
          meta: `${route.duration_minutes} min`,
          titleAliases: localizedVariants(route, ["title", "short_title"], lang),
          aliases: [
            localizedVariants(route, ["short_title"], lang),
            localized(route, "tagline", lang),
            localized(route, "summary", lang),
            localized(route, "best_time", lang),
            stopNames,
            route.category,
            route.duration_band,
            route.difficulty
          ]
        },
        lang
      )
    );
  }

  for (const place of historyKnowledgePlaces) {
    const eraLabel = t.history?.eraLabels?.[place.era] ?? localized(place, "era", lang) ?? place.era;
    items.push(
      makeItem(
        {
          id: `place:${place.id}`,
          kind: "place",
          title: localized(place, "name", lang),
          description: localized(place, "summary", lang),
          href: localizePath(`/places/${place.id}`, lang),
          meta: eraLabel,
          titleAliases: localizedVariants(place, ["name"], lang),
          aliases: [
            localizedVariants(place, ["name", "architect", "builder"], lang),
            localized(place, "summary", lang),
            localized(place, "current_status", lang),
            place.category,
            place.era,
            place.built_date,
            place.built_year,
            collectLocalizedStrings(place.history, lang, 16)
          ]
        },
        lang
      )
    );
  }

  for (const person of historyKnowledgePeople) {
    const life = [person.birth_year, person.death_year].filter((year) => year != null).join("–");
    items.push(
      makeItem(
        {
          id: `person:${person.id}`,
          kind: "person",
          title: localized(person, "name", lang),
          description: localized(person, "summary", lang),
          href: localizePath(`/people/${person.id}`, lang),
          meta: life || undefined,
          titleAliases: localizedVariants(person, ["name"], lang),
          aliases: [
            localizedVariants(person, ["name"], lang),
            localized(person, "summary", lang),
            person.roles
          ]
        },
        lang
      )
    );
  }

  for (const story of storyLongreads) {
    items.push(
      makeItem(
        {
          id: `story:${story.id}`,
          kind: "story",
          title: localized(story, "title", lang),
          description: localized(story, "dek", lang),
          href: localizePath(`/stories/${story.id}`, lang),
          meta: `${story.reading_minutes} min`,
          titleAliases: localizedVariants(story, ["title"], lang),
          aliases: [
            localized(story, "dek", lang),
            story.era_tags,
            story.theme_tags,
            collectLocalizedStrings(story.sections, lang, 12)
          ]
        },
        lang
      )
    );
  }

  for (const neighbourhood of neighbourhoodHistories) {
    items.push(
      makeItem(
        {
          id: `neighbourhood:${neighbourhood.id}`,
          kind: "neighbourhood",
          title: localized(neighbourhood, "name", lang),
          description: localized(neighbourhood, "summary", lang),
          href: localizePath(`/neighbourhoods/${neighbourhood.id}`, lang),
          meta: localized(neighbourhood, "district", lang) || neighbourhood.area,
          titleAliases: [
            ...localizedVariants(neighbourhood, ["name"], lang),
            ...collectStrings(neighbourhood.alt_names, 8)
          ],
          aliases: [
            localizedVariants(neighbourhood, ["name"], lang),
            localized(neighbourhood, "tagline", lang),
            localized(neighbourhood, "summary", lang),
            localized(neighbourhood, "why", lang),
            localized(neighbourhood, "name_origin", lang),
            localized(neighbourhood, "getting_there", lang),
            collectStrings(neighbourhood.alt_names, 12),
            collectLocalizedStrings(neighbourhood.fabric, lang, 10),
            collectLocalizedStrings(neighbourhood.timeline, lang, 12),
            neighbourhood.era_tags,
            neighbourhood.area
          ]
        },
        lang
      )
    );
  }

  for (const project of projects) {
    items.push(
      makeItem(
        {
          id: `project:${project.id}`,
          kind: "project",
          title: localized(project, "title", lang),
          description: localized(project, "summary", lang),
          href: localizePath(`/projects/${project.id}`, lang),
          meta: String(project.budget.year),
          titleAliases: localizedVariants(project, ["title"], lang),
          aliases: [
            localized(project, "summary", lang),
            localized(project, "note", lang),
            localized(project.location, "address", lang),
            project.category,
            project.status,
            project.district,
            project.budget.year
          ]
        },
        lang
      )
    );
  }

  for (const initiative of communityInitiatives) {
    items.push(
      makeItem(
        {
          id: `initiative:${initiative.id}`,
          kind: "initiative",
          title: localized(initiative, "title", lang),
          description: localized(initiative, "summary", lang),
          href: `${localizePath("/community", lang)}?q=${encodeURIComponent(localized(initiative, "title", lang))}`,
          meta: localized(initiative.organizer, "name", lang),
          titleAliases: localizedVariants(initiative, ["title"], lang),
          aliases: [
            localized(initiative, "summary", lang),
            localized(initiative, "call_to_action", lang),
            localizedVariants(initiative.organizer, ["name"], lang),
            initiative.category,
            initiative.status,
            initiative.tags
          ]
        },
        lang
      )
    );
  }

  for (const event of historyKnowledgeEvents) {
    const title = localized(event, "title", lang);
    const date = localized(event.date, "display", lang) || String(event.date.year);
    const linkedNames = [
      ...event.person_ids.map((id) => peopleNames.get(id)),
      ...event.place_ids.map((id) => placeNames.get(id))
    ].filter(Boolean);
    items.push(
      makeItem(
        {
          id: `event:${event.id}`,
          kind: "event",
          title,
          description: localized(event, "summary", lang),
          href: `${localizePath("/history", lang)}?q=${encodeURIComponent(title)}#timeline`,
          meta: date,
          titleAliases: localizedVariants(event, ["title"], lang),
          aliases: [
            localized(event, "summary", lang),
            localized(event, "conflict_notes", lang),
            linkedNames,
            categoryLabels[lang]?.[event.category] ?? event.category,
            event.category,
            event.era,
            event.theme_tags,
            event.date.year
          ]
        },
        lang
      )
    );
  }

  const suggestionIds = [
    "place:place-ancient-theatre",
    "route:first-day-plovdiv",
    "place:place-kapana-q12282547",
    "story:story-roman-philippopolis",
    "page:mayors"
  ];
  const suggestions = suggestionIds
    .map((id) => items.find((item) => item.id === id)?.title)
    .filter((title): title is string => Boolean(title))
    .filter((title, index, all) => all.indexOf(title) === index)
    .slice(0, 5);

  return { count: items.length, suggestions, items };
}
