import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const outDir = path.join(root, "data/generated/history-knowledge");
const csvDir = path.join(outDir, "csv");

const DATA_VERSION = "2026.06.19";
const GENERATED_AT = "2026-06-19T00:00:00.000Z";

const historyEntries = readJson("data/curated/plovdiv-history.json");
const landmarks = readJson("data/curated/plovdiv-landmarks.json");
const notablePeople = readJson("data/curated/notable-people.json");
const personRelationships = readJson("data/curated/person-relationships.json");
const cityArchive = readJson("data/curated/city-archive.json");
const historicalArchiveItems = readJson("data/curated/historical-archive-items.json");
const thenNowPairs = readJson("data/curated/then-now-pairs.json");
const primaryDocuments = readJson("data/curated/primary-documents.json");
const educationResources = readJson("data/curated/education-resources.json");
const storyLongreads = readJson("data/curated/story-longreads.json");
const editorialSignoffs = readJson("data/curated/editorial-signoffs.json");
const communityInitiatives = readJson("data/curated/community-initiatives.json");
const sourceRegistry = readJson("data/curated/sources.json");

const sourceByUrl = new Map();
const sourceById = new Map();

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function slug(input) {
  const translit = {
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ж: "zh",
    з: "z",
    и: "i",
    й: "y",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "h",
    ц: "ts",
    ч: "ch",
    ш: "sh",
    щ: "sht",
    ъ: "a",
    ь: "",
    ю: "yu",
    я: "ya"
  };
  return String(input)
    .toLocaleLowerCase("bg-BG")
    .replace(/[абвгдежзийклмнопрстуфхцчшщъьюя]/g, (char) => translit[char] ?? char)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function titleToPublisher(title) {
  return title.split(/[-—–]/u)[0]?.trim() || title;
}

function licenseFor(source) {
  if (source.license) return source.license;

  const url = source.url ?? "";
  const title = source.title ?? source.title_bg ?? "";
  if (url.includes("wikipedia.org")) {
    return {
      status: "open_license",
      label: "Creative Commons Attribution-ShareAlike 4.0 International",
      url: "https://creativecommons.org/licenses/by-sa/4.0/"
    };
  }
  if (url.includes("openstreetmap.org")) {
    return {
      status: "open_license",
      label: "Open Database License 1.0",
      url: "https://opendatacommons.org/licenses/odbl/1-0/"
    };
  }
  if (url.includes("wikidata.org")) {
    return {
      status: "open_license",
      label: "Creative Commons CC0 1.0 Universal",
      url: "https://creativecommons.org/publicdomain/zero/1.0/"
    };
  }
  if (title.toLocaleLowerCase("bg-BG").includes("wikimedia commons")) {
    return {
      status: "open_license",
      label: "Wikimedia Commons file license, verify per file",
      url: url
    };
  }
  return {
    status: "public_reference_terms_unverified",
    label: "Public web reference; reuse terms not verified",
    url: url
  };
}

function registerSource(source, usedForBg = "", usedForEn = "") {
  if (!source?.url) throw new Error(`source without URL: ${JSON.stringify(source)}`);
  if (sourceByUrl.has(source.url)) return sourceByUrl.get(source.url);

  const registryRecord = sourceRegistry.find((item) => item.url === source.url);
  const id = registryRecord
    ? `source-${registryRecord.id}`
    : `source-${slug(source.title ?? source.title_bg ?? source.url) || slug(new URL(source.url).hostname)}`;

  const record = {
    id,
    type: "source",
    title_bg: registryRecord?.title_bg ?? source.title_bg ?? source.title ?? source.url,
    title_en: registryRecord?.title_en ?? source.title_en ?? source.title ?? source.url,
    publisher: titleToPublisher(registryRecord?.title_bg ?? source.title_bg ?? source.title ?? source.url),
    url: source.url,
    accessed_at: registryRecord?.accessed_at ?? source.accessed_at,
    license: licenseFor(registryRecord ?? source),
    used_for_bg: registryRecord?.used_for ?? usedForBg,
    used_for_en: registryRecord?.used_for_en ?? usedForEn ?? usedForBg,
    limitations_bg:
      registryRecord?.limitations_bg ??
      source.limitations_bg ??
      "Източникът е публично достъпен, но условията за повторна употреба трябва да се проверят преди публикуване на медия или дълъг цитат.",
    limitations_en:
      registryRecord?.limitations_en ??
      source.limitations_en ??
      "The source is publicly accessible, but reuse terms should be checked before publishing media or long quotations."
  };

  sourceByUrl.set(source.url, record.id);
  sourceById.set(record.id, record);
  return record.id;
}

for (const source of sourceRegistry) {
  registerSource(
    source,
    source.used_for,
    source.used_for_en ?? source.used_for
  );
}

const osmSourceId = registerSource(
  {
    title: "OpenStreetMap",
    url: "https://www.openstreetmap.org/",
    accessed_at: "2026-06-14"
  },
  "Координати и картова основа.",
  "Coordinates and map base."
);

function provenance(sourceId, claimBg, claimEn, evidenceType = "public_source") {
  const source = sourceById.get(sourceId);
  return [
    {
      source_id: sourceId,
      evidence_type: evidenceType,
      claim_bg: claimBg,
      claim_en: claimEn,
      url: source.url,
      accessed_at: source.accessed_at,
      license_status: source.license.status
    }
  ];
}

function registerMediaSource(media, usedForBg, usedForEn) {
  return registerSource(
    {
      title: media.title,
      url: media.page_url,
      accessed_at: media.accessed_at,
      license: {
        status: "open_license",
        label: media.license,
        url: media.license_url
      }
    },
    usedForBg,
    usedForEn
  );
}

function editorial(status = "needs_editorial_signoff") {
  return {
    status,
    reviewed_by: null,
    reviewed_at: null,
    notes_bg:
      "Автоматично нормализиран запис от съществуващите курирани данни; изисква независим редакторски преглед преди да се брои като завършен.",
    notes_en:
      "Automatically normalized from the existing curated data; requires independent editorial review before counting as complete."
  };
}

function eraForYear(year) {
  if (year < -1200) return "prehistory";
  if (year < -46) return "thracian";
  if (year < 681) return "roman";
  if (year < 1364) return "medieval";
  if (year < 1762) return "ottoman";
  if (year < 1878) return "revival";
  if (year < 1886) return "liberation";
  return "modern";
}

function eraForLandmarkCategory(category) {
  const eras = {
    thracian: "thracian",
    roman: "roman",
    medieval: "medieval",
    ottoman: "ottoman",
    revival: "revival",
    religious: "ottoman",
    hill: "prehistory",
    civic: "modern",
    monument: "modern"
  };
  return eras[category] ?? "modern";
}

function formatYearBg(year) {
  if (year < 0) return `${Math.abs(year)} г. пр. Хр.`;
  return `${year} г.`;
}

function formatYearEn(year) {
  if (year < 0) return `${Math.abs(year)} BCE`;
  return String(year);
}

function formatIsoDateBg(value) {
  const match = /^(-?\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value;
  const [, rawYear, month, day] = match;
  const year = Number(rawYear);
  if (month === "01" && day === "01") return formatYearBg(year);
  return `${Number(day)}.${Number(month)}.${formatYearBg(year)}`;
}

function formatIsoDateEn(value) {
  const match = /^(-?\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value;
  const [, rawYear, month, day] = match;
  const year = Number(rawYear);
  if (month === "01" && day === "01") return formatYearEn(year);
  return `${formatYearEn(year)}-${month}-${day}`;
}

const englishMonthNumbers = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12
};

function archivePeriodDateParts(record) {
  const period = String(record.period_en ?? "");
  const matches = [
    ...period.matchAll(
      /\b(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)(?:\s+(\d{4}))?\b/giu
    )
  ].map((match) => ({
    day: Number(match[1]),
    month: englishMonthNumbers[match[2].toLocaleLowerCase("en-US")],
    year: match[3] ? Number(match[3]) : null
  }));

  if (!matches.length) return null;

  const start = matches[0];
  const end = record.year_end != null && matches.length > 1 ? matches[1] : null;
  const startYear = start.year ?? record.year_start;

  return {
    year: startYear,
    month: start.month,
    day: start.day,
    year_end: record.year_end ?? null,
    month_end: end?.month ?? null,
    day_end: end?.day ?? null,
    has_exact_end: Boolean(end)
  };
}

function placeDateContext(landmark, sourceId) {
  if (landmark.built_date) {
    return {
      precision: "date",
      display_bg: formatIsoDateBg(landmark.built_date),
      display_en: formatIsoDateEn(landmark.built_date),
      source_id: sourceId
    };
  }
  if (landmark.built_year != null) {
    return {
      precision: "year",
      display_bg: formatYearBg(landmark.built_year),
      display_en: formatYearEn(landmark.built_year),
      source_id: sourceId
    };
  }
  return {
    precision: "era",
    display_bg: landmark.era_bg,
    display_en: landmark.era_en,
    source_id: sourceId
  };
}

function placeCreatorContext(landmark, sourceId) {
  const architectBg = landmark.architect_bg ?? null;
  const architectEn = landmark.architect_en ?? architectBg;
  const builderBg = landmark.builder_bg ?? null;
  const builderEn = landmark.builder_en ?? builderBg;
  const partsBg = [
    architectBg ? `архитект: ${architectBg}` : null,
    builderBg ? `строител: ${builderBg}` : null
  ].filter(Boolean);
  const partsEn = [
    architectEn ? `architect: ${architectEn}` : null,
    builderEn ? `builder: ${builderEn}` : null
  ].filter(Boolean);

  if (partsBg.length > 0 || partsEn.length > 0) {
    return {
      status: "named",
      display_bg: partsBg.join("; "),
      display_en: partsEn.join("; "),
      source_id: sourceId
    };
  }

  if (landmark.category === "hill") {
    return {
      status: "not_applicable",
      display_bg: "неприложимо за природен хълм/терен",
      display_en: "not applicable for a natural hill or terrain feature",
      source_id: sourceId
    };
  }

  return {
    status: "not_identified",
    display_bg: "не е идентифициран в текущия публичен източник",
    display_en: "not identified in the current public source",
    source_id: sourceId
  };
}

const placeCoordinateHints = {
  "landmark-nebet-tepe": { lat: 42.1512, lng: 24.7513, accuracy: "approximate_site" },
  "landmark-ancient-theatre": { lat: 42.1468, lng: 24.7510, accuracy: "approximate_site" },
  "landmark-ancient-stadium": { lat: 42.1477, lng: 24.7472, accuracy: "approximate_site" },
  "landmark-dzhumaya-mosque": { lat: 42.1475, lng: 24.7475, accuracy: "approximate_site" },
  "landmark-old-town": { lat: 42.1500, lng: 24.7519, accuracy: "district_centroid" },
  "landmark-seven-hills": { lat: 42.1419, lng: 24.7494, accuracy: "citywide_reference" }
};

function placeLinksForText(...parts) {
  const text = parts.join(" ").toLocaleLowerCase("bg-BG");
  const links = [];
  const add = (id) => {
    if (!links.includes(id)) links.push(id);
  };
  if (text.includes("небет")) add("place-nebet-tepe");
  if (text.includes("теат") || text.includes("theatre")) add("place-ancient-theatre");
  if (text.includes("стадион") || text.includes("stadium")) add("place-ancient-stadium");
  if (text.includes("джумая") || text.includes("dzhumaya")) add("place-dzhumaya-mosque");
  if (text.includes("стар") || text.includes("old town") || text.includes("възрожден")) add("place-old-town");
  if (text.includes("пловдив") || text.includes("plovdiv") || text.includes("filibe")) add("place-plovdiv-city");
  if (text.includes("тепе") || text.includes("hill")) add("place-seven-hills");
  if (text.includes("форум") || text.includes("forum")) add("place-forum-philippopolis");
  if (text.includes("хисар") || text.includes("kapia")) add("place-hisar-kapia");
  if (text.includes("богород") || text.includes("mother of god")) add("place-holy-mother-of-god");
  if (text.includes("лудвиг") || text.includes("louis")) add("place-st-louis-cathedral");
  if (text.includes("ламартин") || text.includes("lamartine")) add("place-lamartine-house");
  if (text.includes("хамам") || text.includes("hamam") || text.includes("bath")) add("place-chifte-hamam");
  return links;
}

const organizations = [
  {
    id: "org-plovdiv-municipality",
    name_bg: "Община Пловдив",
    name_en: "Plovdiv Municipality",
    category: "municipality",
    sourceUrl: "https://www.plovdiv.bg/administration/mayor/mayors-of-plovdiv/"
  },
  {
    id: "org-plovdiv-municipal-council",
    name_bg: "Общински съвет — Пловдив",
    name_en: "Plovdiv Municipal Council",
    category: "public_institution",
    sourceUrl: "http://plovdiv.bg/obs/"
  },
  {
    id: "org-regional-history-museum-plovdiv",
    name_bg: "Регионален исторически музей — Пловдив",
    name_en: "Regional History Museum — Plovdiv",
    category: "museum",
    sourceUrl: "https://rimplovdiv.com/wp-content/uploads/2025/12/rolqta.pdf"
  },
  {
    id: "org-international-fair-plovdiv",
    name_bg: "Международен панаир Пловдив",
    name_en: "International Fair Plovdiv",
    category: "cultural_economic_institution",
    sourceUrl: "https://www.fair.bg/uploads/event/form/file/5d15dd4f521c7017390091.pdf"
  },
  {
    id: "org-plovdiv-2019-foundation",
    name_bg: "Фондация Пловдив 2019",
    name_en: "Plovdiv 2019 Foundation",
    category: "cultural_institution",
    sourceUrl: "https://plovdiv2019.eu/en"
  }
];

for (const initiative of communityInitiatives) {
  const name = initiative.organizer?.name_bg;
  if (!name) continue;
  const id = `org-${slug(name)}`;
  if (organizations.some((org) => org.id === id)) continue;
  organizations.push({
    id,
    name_bg: initiative.organizer.name_bg,
    name_en: initiative.organizer.name_en ?? initiative.organizer.name_bg,
    category: `civic_${initiative.organizer.type}`,
    sourceUrl: initiative.sources?.[0]?.url ?? "https://www.openstreetmap.org/"
  });
}

const organizationRecords = organizations.map((org) => {
  const source =
    sourceRegistry.find((item) => item.url === org.sourceUrl) ??
    cityArchive.find((item) => item.source_document?.url === org.sourceUrl)?.source_document ??
    communityInitiatives.flatMap((item) => item.sources).find((item) => item?.url === org.sourceUrl) ??
    { title: org.name_bg, url: org.sourceUrl, accessed_at: "2026-06-19" };
  const sourceId = registerSource(source, `Организация: ${org.name_bg}`, `Organization: ${org.name_en}`);
  return {
    id: org.id,
    type: "organization",
    category: org.category,
    name_bg: org.name_bg,
    name_en: org.name_en,
    summary_bg: `Нормализиран организационен запис, използван за връзки в историческата база: ${org.name_bg}.`,
    summary_en: `Normalized organization record used for links in the historical knowledge base: ${org.name_en}.`,
    event_ids: [],
    person_ids: [],
    place_ids: [],
    source_ids: [sourceId],
    provenance: provenance(sourceId, `Организационен контекст за ${org.name_bg}.`, `Organizational context for ${org.name_en}.`),
    editorial: editorial()
  };
});

const orgIdByText = [
  [/община|кмет|municipality|mayor/i, "org-plovdiv-municipality"],
  [/общински съвет|council/i, "org-plovdiv-municipal-council"],
  [/панаир|fair/i, "org-international-fair-plovdiv"],
  [/култур|culture|2019/i, "org-plovdiv-2019-foundation"],
  [/регионален исторически музей|рим|museum/i, "org-regional-history-museum-plovdiv"]
];

function organizationLinksForText(...parts) {
  const text = parts.join(" ");
  const links = [];
  for (const [pattern, id] of orgIdByText) {
    if (pattern.test(text) && !links.includes(id)) links.push(id);
  }
  return links;
}

const places = landmarks.map((landmark) => {
  const primarySourceId = registerSource(
    landmark.source,
    `Забележителност: ${landmark.name_bg}`,
    `Landmark: ${landmark.name_en}`
  );
  const id = `place-${landmark.id.replace(/^landmark-/, "")}`;
  const coordinate = landmark.coordinates ?? placeCoordinateHints[landmark.id] ?? null;
  const coordinateSourceId = landmark.coordinate_source
    ? registerSource(
        landmark.coordinate_source,
        `Координати за забележителност: ${landmark.name_bg}`,
        `Coordinates for landmark: ${landmark.name_en}`
      )
    : landmark.coordinates
      ? primarySourceId
      : coordinate
        ? osmSourceId
        : null;
  const media = (landmark.media ?? []).map((item) => {
    const mediaSourceId = registerSource(
      {
        title: `Wikimedia Commons — ${item.title}`,
        url: item.page_url,
        accessed_at: item.accessed_at,
        license: {
          status: "open_license",
          label: item.license,
          url: item.license_url
        },
        limitations_bg: "Медията е от Wikimedia Commons; спазвайте конкретния лиценз и атрибуция на файла.",
        limitations_en: "Media from Wikimedia Commons; follow the file-specific license and attribution."
      },
      `Медия за забележителност: ${landmark.name_bg}`,
      `Media for landmark: ${landmark.name_en}`
    );
    return {
      ...item,
      source_id: mediaSourceId
    };
  });
  const sourceIds = [
    ...new Set([
      primarySourceId,
      ...(coordinateSourceId && coordinateSourceId !== primarySourceId ? [coordinateSourceId] : []),
      ...media.map((item) => item.source_id)
    ])
  ];
  return {
    id,
    type: "place",
    category: landmark.category,
    era: eraForLandmarkCategory(landmark.category),
    era_bg: landmark.era_bg,
    era_en: landmark.era_en,
    name_bg: landmark.name_bg,
    name_en: landmark.name_en,
    summary_bg: landmark.summary_bg,
    summary_en: landmark.summary_en,
    wikidata_id: landmark.wikidata_id ?? null,
    built_year: landmark.built_year ?? null,
    built_date: landmark.built_date ?? null,
    date_context: placeDateContext(landmark, primarySourceId),
    architect_bg: landmark.architect_bg ?? null,
    architect_en: landmark.architect_en ?? landmark.architect_bg ?? null,
    builder_bg: landmark.builder_bg ?? null,
    builder_en: landmark.builder_en ?? landmark.builder_bg ?? null,
    creator_context: placeCreatorContext(landmark, primarySourceId),
    coordinates: coordinate
      ? {
          lat: coordinate.lat,
          lng: coordinate.lng,
          accuracy: coordinate.accuracy,
          source_id: coordinateSourceId
        }
      : null,
    current_status_bg:
      landmark.current_status_bg ??
      "Публично описан исторически обект; подробен статус за посещение предстои да бъде проверен.",
    current_status_en:
      landmark.current_status_en ??
      "Publicly documented historic site; detailed visiting status still needs verification.",
    media,
    event_ids: [],
    person_ids: [],
    organization_ids: [],
    archive_item_ids: [],
    then_now_pair_ids: [],
    source_ids: sourceIds,
    provenance: [
      ...provenance(
        primarySourceId,
        `Описание и исторически контекст за ${landmark.name_bg}.`,
        `Description and historical context for ${landmark.name_en}.`
      ),
      ...(coordinate && coordinateSourceId
        ? provenance(
            coordinateSourceId,
            `Координати за ${landmark.name_bg}.`,
            `Coordinates for ${landmark.name_en}.`,
            "map_reference"
          )
        : []),
      ...media.flatMap((item) =>
        provenance(
          item.source_id,
          `Медия и лиценз за ${landmark.name_bg}: ${item.title}.`,
          `Media and license for ${landmark.name_en}: ${item.title}.`,
          "media_reference"
        )
      )
    ],
    editorial: editorial(),
    ...(landmark.history ? { history: landmark.history } : {})
  };
});

const mayorTerms = cityArchive
  .filter((record) => record.kind === "mayor_term")
  .sort((a, b) => a.year_start - b.year_start || (a.year_end ?? 9999) - (b.year_end ?? 9999));

const roleLabels = {
  academic: { bg: "академик", en: "academic" },
  actor: { bg: "актьор", en: "actor" },
  art_historian: { bg: "изкуствовед", en: "art historian" },
  artist: { bg: "художник", en: "artist" },
  athlete: { bg: "спортист", en: "athlete" },
  basketball_player: { bg: "баскетболист", en: "basketball player" },
  boxer: { bg: "боксьор", en: "boxer" },
  canoeist: { bg: "кануист", en: "canoeist" },
  chef: { bg: "готвач", en: "chef" },
  chess_player: { bg: "шахматист", en: "chess player" },
  choreographer: { bg: "хореограф", en: "choreographer" },
  clergy: { bg: "духовник", en: "clergy" },
  composer: { bg: "композитор", en: "composer" },
  conductor: { bg: "диригент", en: "conductor" },
  cultural_manager: { bg: "културен мениджър", en: "cultural manager" },
  designer: { bg: "дизайнер", en: "designer" },
  diplomat: { bg: "дипломат", en: "diplomat" },
  economist: { bg: "икономист", en: "economist" },
  electrical_engineer: { bg: "електроинженер", en: "electrical engineer" },
  educator: { bg: "педагог", en: "educator" },
  engineer: { bg: "инженер", en: "engineer" },
  equestrian: { bg: "състезател по конен спорт", en: "equestrian" },
  fencer: { bg: "фехтовач", en: "fencer" },
  film_director: { bg: "филмов режисьор", en: "film director" },
  football_referee: { bg: "футболен съдия", en: "football referee" },
  footballer: { bg: "футболист", en: "footballer" },
  geographer: { bg: "географ", en: "geographer" },
  general: { bg: "генерал", en: "general" },
  gymnast: { bg: "гимнастик", en: "gymnast" },
  high_jumper: { bg: "скачач на височина", en: "high jumper" },
  illustrator: { bg: "илюстратор", en: "illustrator" },
  first_lady: { bg: "първа дама", en: "first lady" },
  javelin_thrower: { bg: "копиехвъргач", en: "javelin thrower" },
  journalist: { bg: "журналист", en: "journalist" },
  jurist: { bg: "юрист", en: "jurist" },
  martial_artist: { bg: "състезател по бойни изкуства", en: "martial artist" },
  mathematician: { bg: "математик", en: "mathematician" },
  mayor: { bg: "кмет", en: "mayor" },
  merchant: { bg: "търговец", en: "merchant" },
  military_officer: { bg: "офицер", en: "military officer" },
  mineralogist: { bg: "минералог", en: "mineralogist" },
  missionary: { bg: "мисионер", en: "missionary" },
  model: { bg: "модел", en: "model" },
  modern_pentathlete: { bg: "състезател по модерен петобой", en: "modern pentathlete" },
  musician: { bg: "музикант", en: "musician" },
  opera_singer: { bg: "оперен певец", en: "opera singer" },
  painter: { bg: "живописец", en: "painter" },
  patriarch: { bg: "патриарх", en: "patriarch" },
  paleontologist: { bg: "палеонтолог", en: "paleontologist" },
  philosopher: { bg: "философ", en: "philosopher" },
  pianist: { bg: "пианист", en: "pianist" },
  physicist: { bg: "физик", en: "physicist" },
  poet: { bg: "поет", en: "poet" },
  politician: { bg: "политик", en: "politician" },
  priest: { bg: "свещеник", en: "priest" },
  printmaker: { bg: "график", en: "printmaker" },
  producer: { bg: "продуцент", en: "producer" },
  public_figure: { bg: "обществена фигура", en: "public figure" },
  racing_driver: { bg: "автомобилен състезател", en: "racing driver" },
  revolutionary: { bg: "революционер", en: "revolutionary" },
  rower: { bg: "гребец", en: "rower" },
  saint: { bg: "светец", en: "saint" },
  scholar: { bg: "учен", en: "scholar" },
  scientist: { bg: "учен", en: "scientist" },
  screenwriter: { bg: "сценарист", en: "screenwriter" },
  sculptor: { bg: "скулптор", en: "sculptor" },
  singer: { bg: "певец", en: "singer" },
  sports_shooter: { bg: "спортен стрелец", en: "sport shooter" },
  swimmer: { bg: "плувец", en: "swimmer" },
  tennis_player: { bg: "тенисист", en: "tennis player" },
  theatre_director: { bg: "театрален режисьор", en: "theatre director" },
  violinist: { bg: "цигулар", en: "violinist" },
  visual_artist: { bg: "визуален художник", en: "visual artist" },
  volleyball_player: { bg: "волейболист", en: "volleyball player" },
  weightlifter: { bg: "щангист", en: "weightlifter" },
  wrestler: { bg: "борец", en: "wrestler" },
  zoologist: { bg: "зоолог", en: "zoologist" },
  writer: { bg: "писател", en: "writer" }
};

const relationshipTypeLabels = {
  succeeds: { bg: "наследява", en: "succeeds" },
  succeeded_by: { bg: "наследен/а от", en: "succeeded by" },
  spouse: { bg: "съпруг/съпруга", en: "spouse" },
  father: { bg: "баща", en: "father" },
  mother: { bg: "майка", en: "mother" },
  parent: { bg: "родител", en: "parent" },
  child: { bg: "дете", en: "child" },
  sibling: { bg: "роднина/брат или сестра", en: "sibling" },
  mentor: { bg: "ментор", en: "mentor" },
  student: { bg: "ученик", en: "student" },
  partner: { bg: "партньор", en: "partner" },
  influenced_by: { bg: "повлиян/а от", en: "influenced by" }
};

function roleList(roles, lang) {
  const key = lang === "bg" ? "bg" : "en";
  return roles.map((role) => roleLabels[role]?.[key] ?? role.replaceAll("_", " ")).join(", ");
}

function relationshipTypeLabel(type, lang) {
  const key = lang === "bg" ? "bg" : "en";
  return relationshipTypeLabels[type]?.[key] ?? type.replaceAll("_", " ");
}

function lifespan(person) {
  if (person.birth_year && person.death_year) return `${person.birth_year}–${person.death_year}`;
  if (person.birth_year) return `р. ${person.birth_year}`;
  return null;
}

function extractLifeYears(...texts) {
  for (const text of texts.filter(Boolean)) {
    const matches = String(text).matchAll(/\((р\.|b\.)?\s*(\d{4})(?:\s*[–-]\s*(\d{4}))?[^)]*\)/giu);
    for (const match of matches) {
      const hasBirthMarker = Boolean(match[1]);
      const birthYear = Number(match[2]);
      const deathYear = match[3] ? Number(match[3]) : null;
      if (deathYear && deathYear - birthYear >= 15 && deathYear - birthYear <= 125) {
        return { birth_year: birthYear, death_year: deathYear };
      }
      if (!deathYear && hasBirthMarker) {
        return { birth_year: birthYear, death_year: null };
      }
    }
  }
  return { birth_year: null, death_year: null };
}

function normalizePersonName(name) {
  return name
    .replace(/^(д-р|Д-р|инж\.|инж)\s+/u, "")
    .trim()
    .toLocaleLowerCase("bg-BG");
}

const personGroups = new Map();
for (const term of mayorTerms) {
  const key = normalizePersonName(term.actor_bg);
  if (!personGroups.has(key)) personGroups.set(key, []);
  personGroups.get(key).push(term);
}

const personIdByMayorTermId = new Map();
const mayorPersonRecords = [...personGroups.values()]
  .map((terms) => {
    const first = terms[0];
    const sourceId = registerSource(
      first.source_document,
      `Кметски мандат: ${first.actor_bg}`,
      `Mayoral term: ${first.actor_en ?? first.actor_bg}`
    );
    const personId = `person-${slug(first.actor_bg)}`;
    for (const term of terms) personIdByMayorTermId.set(term.id, personId);

    const allSourceIds = new Set([sourceId]);
    for (const term of terms) {
      if (term.more_url) {
        allSourceIds.add(
          registerSource(
            {
              title: `Wikipedia — ${term.actor_bg}`,
              url: term.more_url,
              accessed_at: term.source_document.accessed_at
            },
            `Биографична справка: ${term.actor_bg}`,
            `Biographical reference: ${term.actor_en ?? term.actor_bg}`
          )
        );
      }
    }

    const lifeYears = extractLifeYears(first.bio_bg, first.bio_en);

    return {
      id: personId,
      type: "person",
      wikidata_id: null,
      name_bg: first.actor_bg,
      name_en: first.actor_en ?? first.actor_bg,
      summary_bg:
        first.bio_bg ??
        `Кмет на Пловдив, засвидетелстван в официалния архив на кметските мандати. Броят на нормализираните мандати в базата е ${terms.length}.`,
      summary_en:
        first.bio_en ??
        `Mayor of Plovdiv attested in the official mayoral-term archive. Normalized terms in the knowledge base: ${terms.length}.`,
      roles: ["mayor"],
      birth_year: lifeYears.birth_year,
      death_year: lifeYears.death_year,
      image: first.image ?? null,
      image_credit: first.image_credit ?? null,
      term_events: terms.map((term) => `event-${term.id.replace(/^archive-plovdiv-/, "")}`),
      event_ids: [],
      place_ids: [],
      organization_ids: [],
      source_ids: [...allSourceIds],
      relationships: [],
      provenance: provenance(
        sourceId,
        `Кметски мандат/мандати на ${first.actor_bg}.`,
        `Mayoral term(s) for ${first.actor_en ?? first.actor_bg}.`
      ),
      editorial: editorial()
    };
  })
  .sort((a, b) => a.name_bg.localeCompare(b.name_bg, "bg-BG"));

const notablePersonRecords = notablePeople
  .map((person) => {
    const sourceId = registerSource(
      person.source,
      `Биографична справка: ${person.name_bg}`,
      `Biographical reference: ${person.name_en}`
    );
    const years = lifespan(person);
    const roleSummaryBg = roleList(person.roles, "bg");
    const roleSummaryEn = roleList(person.roles, "en");
    // Clean one-line bio: "Name (years) — description", falling back to the role
    // list when there is no Wikidata description. Replaces the old formulaic
    // "notable person born in Plovdiv / Primary roles:" boilerplate (the "born in
    // Plovdiv" claim was not true for every record, e.g. mayors born elsewhere).
    // drop a trailing parenthetical that just repeats the life years, e.g.
    // "(1849-1924)", "(born 1966)", "(c. 1843 – 1928)".
    const tidyDesc = (d) =>
      (d ?? "")
        .trim()
        .replace(/\s*\([^()]*\d{3,4}[^()]*\)\s*$/u, "")
        .replace(/[.\s]+$/u, "")
        .trim();
    const descBg = tidyDesc(person.description_bg);
    const descEn = tidyDesc(person.description_en);
    // BG keeps source case (nationality adjectives stay lowercase); EN gets a
    // capitalised first letter for the appositive.
    const tailBg = descBg || roleSummaryBg;
    const tailEnRaw = descEn || roleSummaryEn;
    const tailEn = tailEnRaw ? tailEnRaw.charAt(0).toLocaleUpperCase("en-US") + tailEnRaw.slice(1) : "";
    return {
      id: `person-${slug(person.name_en)}-${person.wikidata_id.toLocaleLowerCase("en-US")}`,
      type: "person",
      wikidata_id: person.wikidata_id,
      name_bg: person.name_bg,
      name_en: person.name_en,
      summary_bg: `${person.name_bg}${years ? ` (${years})` : ""}${tailBg ? ` — ${tailBg}` : ""}.`,
      summary_en: `${person.name_en}${years ? ` (${years.replace("р. ", "b. ")})` : ""}${tailEn ? ` — ${tailEn}` : ""}.`,
      roles: person.roles,
      birth_year: person.birth_year,
      death_year: person.death_year,
      image: null,
      image_credit: null,
      term_events: [],
      event_ids: [],
      place_ids: [],
      organization_ids: [],
      source_ids: [sourceId],
      relationships: [],
      provenance: provenance(
        sourceId,
        `Биографични данни и връзка с Пловдив за ${person.name_bg}.`,
        `Biographical data and Plovdiv birthplace link for ${person.name_en}.`
      ),
      editorial: editorial()
    };
  })
  .sort((a, b) => a.name_bg.localeCompare(b.name_bg, "bg-BG"));

const personRecords = [...mayorPersonRecords, ...notablePersonRecords].sort((a, b) =>
  a.name_bg.localeCompare(b.name_bg, "bg-BG")
);

for (let i = 0; i < mayorTerms.length; i += 1) {
  const term = mayorTerms[i];
  const person = personRecords.find((record) => record.id === personIdByMayorTermId.get(term.id));
  const previous = mayorTerms[i - 1] ? personIdByMayorTermId.get(mayorTerms[i - 1].id) : null;
  const next = mayorTerms[i + 1] ? personIdByMayorTermId.get(mayorTerms[i + 1].id) : null;
  if (!person) continue;
  if (previous && previous !== person.id) {
    person.relationships.push({
      type: "succeeds",
      person_id: previous,
      event_id: `event-${term.id.replace(/^archive-plovdiv-/, "")}`,
      source_id: person.source_ids[0]
    });
  }
  if (next && next !== person.id) {
    person.relationships.push({
      type: "succeeded_by",
      person_id: next,
      event_id: `event-${term.id.replace(/^archive-plovdiv-/, "")}`,
      source_id: person.source_ids[0]
    });
  }
}

const personByWikidataId = new Map(
  personRecords.filter((person) => person.wikidata_id).map((person) => [person.wikidata_id, person])
);

for (const relationship of personRelationships) {
  const from = personByWikidataId.get(relationship.from_wikidata_id);
  const to = personByWikidataId.get(relationship.to_wikidata_id);
  if (!from || !to) {
    throw new Error(
      `person relationship ${relationship.id} references missing Wikidata person ${relationship.from_wikidata_id} -> ${relationship.to_wikidata_id}`
    );
  }

  const sourceId = registerSource(
    relationship.source,
    `Връзка между личности: ${from.name_bg} -> ${to.name_bg}.`,
    `Person relationship: ${from.name_en} -> ${to.name_en}.`
  );
  if (!from.source_ids.includes(sourceId)) from.source_ids.push(sourceId);
  from.relationships.push({
    type: relationship.type,
    person_id: to.id,
    event_id: null,
    source_id: sourceId,
    evidence_property: relationship.evidence_property
  });
}

function timelineEntrySources(entry) {
  const sources = [entry.source, ...(entry.secondary_sources ?? [])].filter(Boolean);
  const seen = new Set();
  return sources.filter((source) => {
    if (!source?.url || seen.has(source.url)) return false;
    seen.add(source.url);
    return true;
  });
}

const timelineEvents = historyEntries.map((entry) => {
  const sourceIds = timelineEntrySources(entry).map((source) =>
    registerSource(
      source,
      `Хронология: ${entry.title_bg}`,
      `Timeline: ${entry.title_en}`
    )
  );
  return {
    id: `event-${entry.id.replace(/^history-/, "")}`,
    type: "event",
    category: "historical_timeline",
    era: entry.era,
    date: {
      year: entry.year,
      year_end: null,
      month: entry.date_month ?? null,
      day: entry.date_day ?? null,
      precision: entry.date_month && entry.date_day ? "day" : "display_period",
      display_bg: entry.period_bg,
      display_en: entry.period_en
    },
    title_bg: entry.title_bg,
    title_en: entry.title_en,
    summary_bg: entry.summary_bg,
    summary_en: entry.summary_en,
    conflict_notes_bg: entry.conflict_notes_bg ?? null,
    conflict_notes_en: entry.conflict_notes_en ?? null,
    theme_tags: [entry.era],
    person_ids: [],
    place_ids: placeLinksForText(entry.title_bg, entry.title_en, entry.summary_bg, entry.summary_en),
    organization_ids: organizationLinksForText(entry.title_bg, entry.title_en, entry.summary_bg, entry.summary_en),
    source_ids: sourceIds,
    provenance: provenanceForSourceIds(
      sourceIds,
      `Датиране и обобщение за хронологичния запис "${entry.title_bg}".`,
      `Dating and summary for timeline record "${entry.title_en}".`,
      "public_source"
    ),
    editorial: editorial()
  };
});

const archiveEvents = cityArchive.map((record) => {
  const sourceId = registerSource(
    record.source_document,
    `Градски архив: ${record.title_bg}`,
    `City archive: ${record.title_en ?? record.title_bg}`
  );
  const dateParts = archivePeriodDateParts(record);
  const datePrecision = dateParts
    ? dateParts.has_exact_end
      ? "date_range_or_year_range"
      : "day"
    : record.year_end
      ? "date_range_or_year_range"
      : "year";
  const date = {
    year: dateParts?.year ?? record.year_start,
    year_end: dateParts?.year_end ?? record.year_end ?? null,
    month: dateParts?.month ?? null,
    day: dateParts?.day ?? null,
    precision: datePrecision,
    display_bg: record.period_bg,
    display_en: record.period_en ?? record.period_bg
  };
  if (dateParts?.month_end && dateParts?.day_end) {
    date.month_end = dateParts.month_end;
    date.day_end = dateParts.day_end;
  }
  const isMayor = record.kind === "mayor_term";
  const personId = isMayor ? personIdByMayorTermId.get(record.id) : null;
  const textParts = [
    record.title_bg,
    record.title_en,
    record.summary_bg,
    record.summary_en,
    record.source_document?.title
  ];
  const organizationIds = isMayor
    ? ["org-plovdiv-municipality"]
    : organizationLinksForText(...textParts);
  return {
    id: `event-${record.id.replace(/^archive-plovdiv-/, "")}`,
    type: "event",
    category: isMayor ? "mayor_term" : record.kind,
    era: eraForYear(record.year_start),
    date,
    title_bg: record.title_bg,
    title_en: record.title_en ?? record.title_bg,
    summary_bg: record.summary_bg,
    summary_en: record.summary_en ?? record.summary_bg,
    theme_tags: [record.kind, eraForYear(record.year_start)],
    person_ids: personId ? [personId] : [],
    place_ids: placeLinksForText(...textParts),
    organization_ids: organizationIds,
    source_ids: [sourceId],
    provenance: provenance(
      sourceId,
      `Градски архивен запис "${record.title_bg}".`,
      `City archive record "${record.title_en ?? record.title_bg}".`
    ),
    editorial: editorial()
  };
});

const notableBirthEvents = notablePeople
  .filter((person) => person.birth_year)
  .map((person) => {
    const sourceId = registerSource(
      person.source,
      `Родно място и биографична справка: ${person.name_bg}`,
      `Birthplace and biographical reference: ${person.name_en}`
    );
    const personId = `person-${slug(person.name_en)}-${person.wikidata_id.toLocaleLowerCase("en-US")}`;
    return {
      id: `event-birth-${slug(person.name_en)}-${person.wikidata_id.toLocaleLowerCase("en-US")}`,
      type: "event",
      category: "notable_person_birth",
      era: eraForYear(person.birth_year),
      date: {
      year: person.birth_year,
      year_end: null,
      month: null,
      day: null,
      precision: "year",
      display_bg: `${person.birth_year} г.`,
      display_en: `${person.birth_year}`
      },
      title_bg: `Раждане на ${person.name_bg}`,
      title_en: `Birth of ${person.name_en}`,
      summary_bg: `Родното място на ${person.name_bg} е Пловдив; годината на раждане е ${person.birth_year} г.`,
      summary_en: `${person.name_en}'s birthplace is Plovdiv; the recorded birth year is ${person.birth_year}.`,
      theme_tags: ["people", "birth", ...person.roles],
      person_ids: [personId],
      place_ids: ["place-plovdiv-city"],
      organization_ids: [],
      source_ids: [sourceId],
      provenance: provenance(
        sourceId,
        `Година и място на раждане за ${person.name_bg}.`,
        `Birth year and birthplace for ${person.name_en}.`
      ),
      editorial: editorial()
    };
  });

const eventRecords = [...timelineEvents, ...archiveEvents, ...notableBirthEvents].sort(
  (a, b) =>
    a.date.year - b.date.year ||
    (a.date.year_end ?? a.date.year) - (b.date.year_end ?? b.date.year) ||
    a.id.localeCompare(b.id)
);

const thenNowPairRecords = thenNowPairs.map((pair) => {
  const thenSourceId = registerMediaSource(
    pair.then_media,
    `Архивен образ за двойка тогава/сега: ${pair.title_bg}`,
    `Historical image for then/now pair: ${pair.title_en}`
  );
  const nowSourceId = registerMediaSource(
    pair.now_media,
    `Съвременен образ за двойка тогава/сега: ${pair.title_bg}`,
    `Current comparison image for then/now pair: ${pair.title_en}`
  );
  const sourceIds = [...new Set([thenSourceId, nowSourceId])];
  const thenClaimBg = `Архивен образ, лиценз и източникова страница за двойката "${pair.title_bg}".`;
  const thenClaimEn = `Historical image, license and source page for then/now pair "${pair.title_en}".`;
  const nowClaimBg = `Съвременен образ, лиценз и източникова страница за двойката "${pair.title_bg}".`;
  const nowClaimEn = `Current comparison image, license and source page for then/now pair "${pair.title_en}".`;

  return {
    ...pair,
    then_media: {
      ...pair.then_media,
      source_id: thenSourceId
    },
    now_media: {
      ...pair.now_media,
      source_id: nowSourceId
    },
    source_ids: sourceIds,
    provenance: [
      provenance(thenSourceId, thenClaimBg, thenClaimEn, "then_now_historical_media")[0],
      provenance(nowSourceId, nowClaimBg, nowClaimEn, "then_now_current_media")[0]
    ]
  };
});

const placeBacklinkById = new Map(places.map((place) => [place.id, place]));
const placeEventOrder = new Map(eventRecords.map((event, index) => [event.id, index]));
const placePersonOrder = new Map(personRecords.map((person, index) => [person.id, index]));
const placeOrganizationOrder = new Map(organizationRecords.map((organization, index) => [organization.id, index]));
const placeArchiveItemOrder = new Map(historicalArchiveItems.map((item, index) => [item.id, index]));
const placeThenNowPairOrder = new Map(thenNowPairRecords.map((pair, index) => [pair.id, index]));
for (const place of places) {
  place.event_ids = [];
  place.person_ids = [];
  place.organization_ids = [];
  place.archive_item_ids = [];
  place.then_now_pair_ids = [];
}
for (const event of eventRecords) {
  for (const placeId of event.place_ids) {
    const place = placeBacklinkById.get(placeId);
    if (!place) continue;
    if (!place.event_ids.includes(event.id)) place.event_ids.push(event.id);
    for (const personId of event.person_ids) {
      if (!place.person_ids.includes(personId)) place.person_ids.push(personId);
    }
    for (const organizationId of event.organization_ids) {
      if (!place.organization_ids.includes(organizationId)) place.organization_ids.push(organizationId);
    }
  }
}
for (const item of historicalArchiveItems) {
  const place = placeBacklinkById.get(item.place_id);
  if (place && !place.archive_item_ids.includes(item.id)) place.archive_item_ids.push(item.id);
}
for (const pair of thenNowPairRecords) {
  const place = placeBacklinkById.get(pair.place_id);
  if (place && !place.then_now_pair_ids.includes(pair.id)) place.then_now_pair_ids.push(pair.id);
}
for (const place of places) {
  place.event_ids.sort((a, b) => (placeEventOrder.get(a) ?? 0) - (placeEventOrder.get(b) ?? 0));
  place.person_ids.sort((a, b) => (placePersonOrder.get(a) ?? 0) - (placePersonOrder.get(b) ?? 0));
  place.organization_ids.sort((a, b) => (placeOrganizationOrder.get(a) ?? 0) - (placeOrganizationOrder.get(b) ?? 0));
  place.archive_item_ids.sort((a, b) => (placeArchiveItemOrder.get(a) ?? 0) - (placeArchiveItemOrder.get(b) ?? 0));
  place.then_now_pair_ids.sort((a, b) => (placeThenNowPairOrder.get(a) ?? 0) - (placeThenNowPairOrder.get(b) ?? 0));
}

const personBacklinkById = new Map(personRecords.map((person) => [person.id, person]));
const personEventOrder = new Map(eventRecords.map((event, index) => [event.id, index]));
const personPlaceOrder = new Map(places.map((place, index) => [place.id, index]));
const personOrganizationOrder = new Map(organizationRecords.map((organization, index) => [organization.id, index]));
for (const person of personRecords) {
  person.event_ids = [];
  person.place_ids = [];
  person.organization_ids = [];
}
for (const event of eventRecords) {
  for (const personId of event.person_ids) {
    const person = personBacklinkById.get(personId);
    if (!person) continue;
    if (!person.event_ids.includes(event.id)) person.event_ids.push(event.id);
    for (const placeId of event.place_ids) {
      if (!person.place_ids.includes(placeId)) person.place_ids.push(placeId);
    }
    for (const organizationId of event.organization_ids) {
      if (!person.organization_ids.includes(organizationId)) person.organization_ids.push(organizationId);
    }
  }
}
for (const person of personRecords) {
  person.event_ids.sort((a, b) => (personEventOrder.get(a) ?? 0) - (personEventOrder.get(b) ?? 0));
  person.place_ids.sort((a, b) => (personPlaceOrder.get(a) ?? 0) - (personPlaceOrder.get(b) ?? 0));
  person.organization_ids.sort((a, b) => (personOrganizationOrder.get(a) ?? 0) - (personOrganizationOrder.get(b) ?? 0));
}

const organizationById = new Map(organizationRecords.map((organization) => [organization.id, organization]));
const organizationEventOrder = new Map(eventRecords.map((event, index) => [event.id, index]));
const organizationPersonOrder = new Map(personRecords.map((person, index) => [person.id, index]));
const organizationPlaceOrder = new Map(places.map((place, index) => [place.id, index]));
for (const organization of organizationRecords) {
  organization.event_ids = [];
  organization.person_ids = [];
  organization.place_ids = [];
}
for (const event of eventRecords) {
  for (const organizationId of event.organization_ids) {
    const organization = organizationById.get(organizationId);
    if (!organization) continue;
    if (!organization.event_ids.includes(event.id)) organization.event_ids.push(event.id);
    for (const personId of event.person_ids) {
      if (!organization.person_ids.includes(personId)) organization.person_ids.push(personId);
    }
    for (const placeId of event.place_ids) {
      if (!organization.place_ids.includes(placeId)) organization.place_ids.push(placeId);
    }
  }
}
for (const organization of organizationRecords) {
  organization.event_ids.sort((a, b) => (organizationEventOrder.get(a) ?? 0) - (organizationEventOrder.get(b) ?? 0));
  organization.person_ids.sort((a, b) => (organizationPersonOrder.get(a) ?? 0) - (organizationPersonOrder.get(b) ?? 0));
  organization.place_ids.sort((a, b) => (organizationPlaceOrder.get(a) ?? 0) - (organizationPlaceOrder.get(b) ?? 0));
}

const personById = new Map(personRecords.map((person) => [person.id, person]));
const personRelationshipIdCounts = new Map();
const personRelationshipRecords = personRecords
  .flatMap((fromPerson) =>
    fromPerson.relationships.map((relationship) => {
      const toPerson = personById.get(relationship.person_id);
      if (!toPerson) {
        throw new Error(
          `person relationship export: ${fromPerson.id} references missing person ${relationship.person_id}`
        );
      }
      if (!sourceById.has(relationship.source_id)) {
        throw new Error(
          `person relationship export: ${fromPerson.id} references missing source ${relationship.source_id}`
        );
      }
      const labelBg = relationshipTypeLabel(relationship.type, "bg");
      const labelEn = relationshipTypeLabel(relationship.type, "en");
      const baseId = [
        "person-rel",
        fromPerson.id.replace(/^person-/, ""),
        relationship.type.replaceAll("_", "-"),
        relationship.person_id.replace(/^person-/, ""),
        relationship.event_id?.replace(/^event-/, "") ?? relationship.evidence_property?.toLocaleLowerCase("en-US") ?? "source"
      ].join("-");
      const duplicateCount = personRelationshipIdCounts.get(baseId) ?? 0;
      personRelationshipIdCounts.set(baseId, duplicateCount + 1);
      const id = duplicateCount === 0 ? baseId : `${baseId}-${duplicateCount + 1}`;
      const evidenceKind = relationship.event_id ? "mayor_succession_event" : "biographical_relationship";

      return {
        id,
        type: "person_relationship",
        relationship_type: relationship.type,
        direction: "directed",
        from_person_id: fromPerson.id,
        to_person_id: relationship.person_id,
        event_id: relationship.event_id ?? null,
        evidence_property: relationship.evidence_property ?? null,
        title_bg: `${fromPerson.name_bg} — ${labelBg} — ${toPerson.name_bg}`,
        title_en: `${fromPerson.name_en} — ${labelEn} — ${toPerson.name_en}`,
        summary_bg: relationship.event_id
          ? `Кметската хронология свързва ${fromPerson.name_bg} с ${toPerson.name_bg} чрез връзка "${labelBg}".`
          : `Биографичен източник документира връзка "${labelBg}" между ${fromPerson.name_bg} и ${toPerson.name_bg}.`,
        summary_en: relationship.event_id
          ? `The mayoral chronology links ${fromPerson.name_en} with ${toPerson.name_en} through the relationship "${labelEn}".`
          : `A biographical source documents the relationship "${labelEn}" between ${fromPerson.name_en} and ${toPerson.name_en}.`,
        source_ids: [relationship.source_id],
        provenance: provenance(
          relationship.source_id,
          `Връзка между личности: ${fromPerson.name_bg} — ${labelBg} — ${toPerson.name_bg}.`,
          `Person relationship: ${fromPerson.name_en} — ${labelEn} — ${toPerson.name_en}.`,
          evidenceKind
        ),
        editorial: editorial()
      };
    })
  )
  .sort((a, b) => a.from_person_id.localeCompare(b.from_person_id) || a.id.localeCompare(b.id));

const primaryDocumentRecords = primaryDocuments
  .map((document) => {
    const sourceId = registerSource(
      document.source,
      `Първичен документ: ${document.title_bg}`,
      `Primary document: ${document.title_en}`
    );
    return {
      ...document,
      source_ids: [sourceId],
      provenance: provenance(
        sourceId,
        `Транскрибиран откъс и метаданни за първичния документ "${document.title_bg}".`,
        `Transcribed excerpt and metadata for primary document "${document.title_en}".`,
        "primary_document_transcription"
      )
    };
  })
  .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));

function provenanceForSourceIds(sourceIds, claimBg, claimEn, evidenceType) {
  return [...new Set(sourceIds)].map((sourceId) => {
    if (!sourceById.has(sourceId)) {
      throw new Error(`provenance export references missing source ${sourceId}`);
    }
    return provenance(sourceId, claimBg, claimEn, evidenceType)[0];
  });
}

const storyLongreadRecords = storyLongreads
  .map((story) => ({
    ...story,
    provenance: provenanceForSourceIds(
      story.source_ids,
      `Източници и редакционни твърдения за дългия разказ "${story.title_bg}".`,
      `Sources and editorial claims for story longread "${story.title_en}".`,
      "story_longread_source"
    )
  }))
  .sort((a, b) => a.id.localeCompare(b.id));

const educationResourceRecords = educationResources
  .map((resource) => ({
    ...resource,
    provenance: provenanceForSourceIds(
      resource.source_ids,
      `Източници и образователни твърдения за урока "${resource.title_bg}".`,
      `Sources and educational claims for lesson "${resource.title_en}".`,
      "education_resource_source"
    )
  }))
  .sort((a, b) => a.id.localeCompare(b.id));

const sourceRecords = [...sourceById.values()].sort((a, b) => a.id.localeCompare(b.id));
const editorialCollections = [
  {
    id: "events",
    label_bg: "Събития",
    label_en: "Events",
    role: "primary_entity",
    records: eventRecords,
    titleField: "title"
  },
  {
    id: "people",
    label_bg: "Хора",
    label_en: "People",
    role: "primary_entity",
    records: personRecords,
    titleField: "name"
  },
  {
    id: "person_relationships",
    label_bg: "Връзки между личности",
    label_en: "Person relationships",
    role: "relationship_entity",
    records: personRelationshipRecords,
    titleField: "title"
  },
  {
    id: "places",
    label_bg: "Места",
    label_en: "Places",
    role: "primary_entity",
    records: places,
    titleField: "name"
  },
  {
    id: "organizations",
    label_bg: "Организации",
    label_en: "Organizations",
    role: "primary_entity",
    records: organizationRecords,
    titleField: "name"
  },
  {
    id: "archive_items",
    label_bg: "Архивни обекти",
    label_en: "Archive items",
    role: "supporting_archive",
    records: historicalArchiveItems,
    titleField: "title"
  },
  {
    id: "then_now_pairs",
    label_bg: "Двойки тогава/сега",
    label_en: "Then/now pairs",
    role: "supporting_archive",
    records: thenNowPairRecords,
    titleField: "title"
  },
  {
    id: "primary_documents",
    label_bg: "Първични документи",
    label_en: "Primary documents",
    role: "primary_document",
    records: primaryDocumentRecords,
    titleField: "title"
  },
  {
    id: "story_longreads",
    label_bg: "Дълги разкази",
    label_en: "Story longreads",
    role: "editorial_feature",
    records: storyLongreadRecords,
    titleField: "title"
  },
  {
    id: "education_resources",
    label_bg: "Образователни ресурси",
    label_en: "Education resources",
    role: "education_material",
    records: educationResourceRecords,
    titleField: "title"
  }
];
const editorialCollectionById = new Map(editorialCollections.map((collection) => [collection.id, collection]));
const editorialSignoffByKey = new Map();

function signoffKey(collectionId, recordId) {
  return `${collectionId}:${recordId}`;
}

for (const signoff of editorialSignoffs) {
  const collection = editorialCollectionById.get(signoff.collection);
  if (!collection) {
    throw new Error(`editorial signoffs: ${signoff.id} references unknown collection ${signoff.collection}`);
  }
  const record = collection.records.find((item) => item.id === signoff.record_id);
  if (!record) {
    throw new Error(
      `editorial signoffs: ${signoff.id} references missing ${signoff.collection}:${signoff.record_id}`
    );
  }
  const key = signoffKey(signoff.collection, signoff.record_id);
  if (editorialSignoffByKey.has(key)) {
    throw new Error(`editorial signoffs: duplicate sign-off for ${key}`);
  }
  editorialSignoffByKey.set(key, signoff);
  record.editorial = {
    ...record.editorial,
    status: "signed_off",
    reviewed_by: signoff.reviewed_by,
    reviewed_at: signoff.reviewed_at,
    notes_bg: signoff.notes_bg,
    notes_en: signoff.notes_en
  };
}

function localizedField(record, base, lang) {
  return record[`${base}_${lang}`] ?? record[`${base}_bg`] ?? "";
}

function uniqueNonEmpty(values) {
  return [...new Set(values.filter(Boolean))];
}

function reviewPathFor(collectionId, record) {
  const apiPaths = {
    events: "/api/history/events.json",
    people: "/api/history/people.json",
    person_relationships: "/api/history/person-relationships.json",
    places: "/api/history/places.json",
    organizations: "/api/history/organizations.json",
    archive_items: "/api/history/archive-items.json",
    then_now_pairs: "/api/history/then-now-pairs.json",
    primary_documents: "/api/history/primary-documents.json",
    story_longreads: "/api/history/story-longreads.json",
    education_resources: "/api/history/education-resources.json"
  };
  const anchors = {
    events: `/history#${record.id}`,
    people: `/people/${record.id}/`,
    person_relationships: record.from_person_id ? `/people/${record.from_person_id}/#relationships` : "/people/",
    places: `/places/${record.id}/`,
    organizations: "/history#open-data",
    archive_items: "/history#archive",
    then_now_pairs: "/history#then-now",
    primary_documents: "/history#open-data",
    story_longreads: `/stories/${record.id}/`,
    education_resources: `/education#${record.id}`
  };
  const bg = anchors[collectionId] ?? "/history";
  const en = bg.startsWith("/en/") ? bg : `/en${bg}`;
  return {
    bg,
    en,
    api: apiPaths[collectionId] ?? "/api/history/index.json"
  };
}

function reviewSourceFromRegisteredSource(sourceId, provenanceEntry = {}) {
  const source = sourceById.get(sourceId);
  if (!source) return null;
  return {
    source_id: sourceId,
    title_bg: source.title_bg,
    title_en: source.title_en,
    url: source.url,
    accessed_at: source.accessed_at,
    license_status: source.license.status,
    license_label: source.license.label,
    license_url: source.license.url,
    evidence_type: provenanceEntry.evidence_type ?? null,
    claim_bg: provenanceEntry.claim_bg ?? source.used_for_bg ?? "",
    claim_en: provenanceEntry.claim_en ?? source.used_for_en ?? ""
  };
}

function reviewSourceFromDirectSource(source, fallbackId = null, evidenceType = "public_source") {
  if (!source?.url) return null;
  const license = source.license ?? {};
  return {
    source_id: fallbackId,
    title_bg: source.title_bg ?? source.title ?? source.url,
    title_en: source.title_en ?? source.title ?? source.url,
    url: source.url,
    accessed_at: source.accessed_at ?? "",
    license_status: license.status ?? null,
    license_label: license.label ?? null,
    license_url: license.url ?? null,
    evidence_type: evidenceType,
    claim_bg: "",
    claim_en: ""
  };
}

function reviewSourceFromMedia(media, fallbackId = null, evidenceType = "media_source") {
  if (!media?.page_url) return null;
  return {
    source_id: media.source_id ?? fallbackId,
    title_bg: media.title ?? media.page_url,
    title_en: media.title ?? media.page_url,
    url: media.page_url,
    accessed_at: media.accessed_at ?? "",
    license_status: media.license ? "open_license" : null,
    license_label: media.license ?? null,
    license_url: media.license_url ?? null,
    evidence_type: evidenceType,
    claim_bg: "",
    claim_en: ""
  };
}

function mediaEntries(media) {
  if (!media) return [];
  return Array.isArray(media) ? media : [media];
}

function reviewSourcesFor(record) {
  const sources = [];
  const seen = new Set();
  const add = (source) => {
    if (!source?.url) return;
    const key = source.source_id ? `id:${source.source_id}` : `url:${source.url}`;
    if (seen.has(key)) return;
    seen.add(key);
    sources.push(source);
  };

  for (const entry of record.provenance ?? []) {
    if (entry.source_id) {
      add(reviewSourceFromRegisteredSource(entry.source_id, entry));
    } else if (entry.url) {
      add({
        source_id: null,
        title_bg: entry.url,
        title_en: entry.url,
        url: entry.url,
        accessed_at: entry.accessed_at ?? "",
        license_status: entry.license_status ?? null,
        license_label: entry.license_label ?? null,
        license_url: entry.license_url ?? null,
        evidence_type: entry.evidence_type ?? null,
        claim_bg: entry.claim_bg ?? "",
        claim_en: entry.claim_en ?? ""
      });
    }
  }

  for (const sourceId of record.source_ids ?? []) {
    add(reviewSourceFromRegisteredSource(sourceId));
  }

  add(reviewSourceFromDirectSource(record.source));
  for (const media of mediaEntries(record.media)) add(reviewSourceFromMedia(media));
  add(reviewSourceFromMedia(record.then_media, null, "then_media_source"));
  add(reviewSourceFromMedia(record.now_media, null, "now_media_source"));

  return sources;
}

function editorialRecord(collection, record) {
  const titleField = collection.titleField;
  const status = record.editorial?.status ?? "missing_editorial_status";
  const reviewedBy = record.editorial?.reviewed_by ?? null;
  const reviewedAt = record.editorial?.reviewed_at ?? null;
  const signoff = editorialSignoffByKey.get(signoffKey(collection.id, record.id));
  const reviewUrls = reviewPathFor(collection.id, record);
  const reviewSources = reviewSourcesFor(record);
  const sourceIds = record.source_ids ?? [];
  const sourceUrl = record.source?.url ?? "";
  const mediaSources = [record.then_media, record.now_media].filter((media) => media?.page_url);
  const hasSource = reviewSources.length > 0 || sourceIds.length > 0 || Boolean(sourceUrl) || mediaSources.length > 0;
  const hasLicense =
    Boolean(record.source?.license?.url) ||
    sourceIds.some((id) => sourceById.get(id)?.license?.url) ||
    (mediaSources.length > 0 && mediaSources.every((media) => media.license_url)) ||
    (reviewSources.length > 0 &&
      reviewSources.every((source) => source.license_status || source.license_label || source.license_url));
  const blockers = [
    status !== "signed_off" ? "needs_independent_editorial_signoff" : null,
    status === "signed_off" && (!reviewedBy || !reviewedAt)
      ? "missing_independent_editorial_signoff_log"
      : null,
    status === "signed_off" && !signoff ? "missing_external_editorial_signoff_record" : null,
    signoff && (signoff.reviewed_by !== reviewedBy || signoff.reviewed_at !== reviewedAt)
      ? "editorial_signoff_log_mismatch"
      : null,
    hasSource ? null : "missing_source_reference",
    hasLicense ? null : "missing_license_or_reuse_status"
  ].filter(Boolean);

  return {
    id: record.id,
    collection: collection.id,
    role: collection.role,
    title_bg: localizedField(record, titleField, "bg"),
    title_en: localizedField(record, titleField, "en"),
    editorial_status: status,
    reviewed_by: reviewedBy,
    reviewed_at: reviewedAt,
    signoff_id: signoff?.id ?? null,
    reviewer_affiliation: signoff?.reviewer_affiliation ?? null,
    review_scope: signoff?.review_scope ?? [],
    review_artifact_url: signoff?.review_artifact_url ?? null,
    review_notes_bg: signoff?.notes_bg ?? null,
    review_notes_en: signoff?.notes_en ?? null,
    review_url_bg: reviewUrls.bg,
    review_url_en: reviewUrls.en,
    api_url: reviewUrls.api,
    review_sources: reviewSources,
    source_ids: uniqueNonEmpty(reviewSources.map((source) => source.source_id)),
    source_urls: uniqueNonEmpty(reviewSources.map((source) => source.url)),
    license_statuses: uniqueNonEmpty(reviewSources.map((source) => source.license_status)),
    source_count: reviewSources.length,
    has_license_or_reuse_status: hasLicense,
    blockers
  };
}

const editorialReviewRecords = editorialCollections.flatMap((collection) =>
  collection.records.map((record) => editorialRecord(collection, record))
);
const editorialCollectionSummary = Object.fromEntries(
  editorialCollections.map((collection) => {
    const records = editorialReviewRecords.filter((record) => record.collection === collection.id);
    const signedOff = records.filter((record) => record.editorial_status === "signed_off").length;
    const blocked = records.filter((record) => record.blockers.length > 0).length;
    return [
      collection.id,
      {
        label_bg: collection.label_bg,
        label_en: collection.label_en,
        role: collection.role,
        total_records: records.length,
        signed_off_records: signedOff,
        records_needing_review: records.length - signedOff,
        records_with_blockers: blocked
      }
    ];
  })
);
const editorialSignedOff = editorialReviewRecords.filter((record) => record.editorial_status === "signed_off").length;
const editorialBlocked = editorialReviewRecords.filter((record) => record.blockers.length > 0).length;
const editorialTrackingGaps = [];
const editorialReview = {
  version: DATA_VERSION,
  generated_at: GENERATED_AT,
  acceptance_requirement: "Independent editorial sign-off must be logged for 100% of published content before the history platform is complete.",
  status:
    editorialSignedOff === editorialReviewRecords.length &&
    editorialBlocked === 0 &&
    editorialTrackingGaps.length === 0
      ? "complete"
      : "incomplete",
  summary: {
    total_tracked_records: editorialReviewRecords.length,
    signed_off_records: editorialSignedOff,
    records_needing_review: editorialReviewRecords.length - editorialSignedOff,
    records_with_blockers: editorialBlocked,
    signed_off_percent: editorialReviewRecords.length
      ? Math.round((editorialSignedOff / editorialReviewRecords.length) * 100)
      : 100,
    tracking_gap_collections: editorialTrackingGaps.length
  },
  collections: editorialCollectionSummary,
  tracking_gaps: editorialTrackingGaps,
  records: editorialReviewRecords
};

function sourceCoverageSummary(records) {
  const recordsWithSources = records.filter((record) => record.source_count > 0).length;
  const recordsWithLicense = records.filter((record) => record.has_license_or_reuse_status).length;
  const singleSourceRecords = records.filter((record) => record.source_count === 1).length;
  const multiSourceRecords = records.filter((record) => record.source_count >= 2).length;
  const openLicenseRecords = records.filter((record) => record.license_statuses.includes("open_license")).length;
  const publicReferenceTermsRecords = records.filter((record) =>
    record.license_statuses.includes("public_reference_terms_unverified")
  ).length;

  return {
    total_records: records.length,
    records_with_sources: recordsWithSources,
    records_without_sources: records.length - recordsWithSources,
    records_with_license_or_reuse_status: recordsWithLicense,
    records_missing_license_or_reuse_status: records.length - recordsWithLicense,
    single_source_records: singleSourceRecords,
    multi_source_records: multiSourceRecords,
    needs_multi_source_review_records: singleSourceRecords,
    open_license_records: openLicenseRecords,
    public_reference_terms_records: publicReferenceTermsRecords
  };
}

const sourceCoverageRecords = editorialReviewRecords.map((record) => ({
  id: record.id,
  collection: record.collection,
  role: record.role,
  title_bg: record.title_bg,
  title_en: record.title_en,
  review_url_bg: record.review_url_bg,
  review_url_en: record.review_url_en,
  api_url: record.api_url,
  source_count: record.source_count,
  source_ids: record.source_ids,
  source_urls: record.source_urls,
  license_statuses: record.license_statuses,
  has_open_license: record.license_statuses.includes("open_license"),
  has_public_reference_terms: record.license_statuses.includes("public_reference_terms_unverified"),
  has_license_or_reuse_status: record.has_license_or_reuse_status,
  needs_multi_source_review: record.source_count < 2,
  editorial_status: record.editorial_status,
  blockers: record.blockers
}));

const sourceCoverage = {
  version: DATA_VERSION,
  generated_at: GENERATED_AT,
  purpose:
    "Public source and license/reuse-status coverage report for every editorially tracked history record. Single-source rows are a review queue for stronger evidence, not automatic publication blockers.",
  source_traceability_status:
    sourceCoverageSummary(sourceCoverageRecords).records_without_sources === 0 &&
    sourceCoverageSummary(sourceCoverageRecords).records_missing_license_or_reuse_status === 0
      ? "complete"
      : "incomplete",
  multi_source_review_status:
    sourceCoverageSummary(sourceCoverageRecords).needs_multi_source_review_records === 0 ? "complete" : "needs_review",
  summary: sourceCoverageSummary(sourceCoverageRecords),
  collections: Object.fromEntries(
    editorialCollections.map((collection) => {
      const records = sourceCoverageRecords.filter((record) => record.collection === collection.id);
      return [
        collection.id,
        {
          label_bg: collection.label_bg,
          label_en: collection.label_en,
          role: collection.role,
          ...sourceCoverageSummary(records)
        }
      ];
    })
  ),
  license_statuses: sourceCoverageRecords.reduce((counts, record) => {
    for (const status of record.license_statuses) {
      counts[status] = (counts[status] ?? 0) + 1;
    }
    return counts;
  }, {}),
  records: sourceCoverageRecords
};

const index = {
  version: DATA_VERSION,
  generated_at: GENERATED_AT,
  license_note:
    "Open Plovdiv normalizes public-source metadata. Each source record carries its own license or reuse-status field; image/media reuse must be verified per item before publication.",
  counts: {
    events: eventRecords.length,
    exact_date_events: eventRecords.filter((record) => record.date.month && record.date.day).length,
    people: personRecords.length,
    person_relationships: personRelationshipRecords.length,
    places: places.length,
    places_with_media: places.filter((record) => record.media.length > 0).length,
    place_media_items: places.reduce((sum, record) => sum + record.media.length, 0),
    organizations: organizationRecords.length,
    sources: sourceRecords.length,
    georeferenced_archive_items: historicalArchiveItems.filter((item) => item.coordinates).length,
    then_now_pairs: thenNowPairRecords.length,
    primary_documents: primaryDocumentRecords.length,
    story_longreads: storyLongreadRecords.length,
    lesson_plans: educationResourceRecords.length,
    audio_tour_scripts: educationResourceRecords.filter((resource) => resource.audio_tour?.production_status === "script_ready").length,
    editorial_tracked_records: editorialReview.summary.total_tracked_records,
    editorial_signed_off_records: editorialReview.summary.signed_off_records,
    editorial_signoff_logs: editorialSignoffs.length,
    editorial_records_needing_review: editorialReview.summary.records_needing_review,
    editorial_records_with_blockers: editorialReview.summary.records_with_blockers,
    source_coverage_records: sourceCoverage.summary.total_records
  },
  targets: {
    events: 300,
    exact_date_events: 60,
    people: 200,
    places: 150,
    places_with_media: 150,
    georeferenced_archive_items: 30,
    then_now_pairs: 20,
    longreads: 10,
    lesson_plans: 5
  },
  endpoints: {
    events: "/api/history/events.json",
    people: "/api/history/people.json",
    person_relationships: "/api/history/person-relationships.json",
    places: "/api/history/places.json",
    organizations: "/api/history/organizations.json",
    sources: "/api/history/sources.json",
    archive_items: "/api/history/archive-items.json",
    then_now_pairs: "/api/history/then-now-pairs.json",
    primary_documents: "/api/history/primary-documents.json",
    story_longreads: "/api/history/story-longreads.json",
    education_resources: "/api/history/education-resources.json",
    editorial_signoffs: "/api/history/editorial-signoffs.json",
    editorial_review: "/api/history/editorial-review.json",
    source_coverage: "/api/history/source-coverage.json"
  },
  downloads: {
    json_directory: "/data/history/",
    csv_directory: "/data/history/csv/",
    index_json: "/data/history/index.json",
    events_json: "/data/history/events.json",
    people_json: "/data/history/people.json",
    person_relationships_json: "/data/history/person-relationships.json",
    places_json: "/data/history/places.json",
    organizations_json: "/data/history/organizations.json",
    sources_json: "/data/history/sources.json",
    archive_items_json: "/data/history/archive-items.json",
    then_now_pairs_json: "/data/history/then-now-pairs.json",
    primary_documents_json: "/data/history/primary-documents.json",
    story_longreads_json: "/data/history/story-longreads.json",
    education_resources_json: "/data/history/education-resources.json",
    editorial_signoffs_json: "/data/history/editorial-signoffs.json",
    editorial_review_json: "/data/history/editorial-review.json",
    source_coverage_json: "/data/history/source-coverage.json",
    events_csv: "/data/history/csv/events.csv",
    people_csv: "/data/history/csv/people.csv",
    person_relationships_csv: "/data/history/csv/person-relationships.csv",
    places_csv: "/data/history/csv/places.csv",
    organizations_csv: "/data/history/csv/organizations.csv",
    sources_csv: "/data/history/csv/sources.csv",
    archive_items_csv: "/data/history/csv/archive-items.csv",
    then_now_pairs_csv: "/data/history/csv/then-now-pairs.csv",
    primary_documents_csv: "/data/history/csv/primary-documents.csv",
    story_longreads_csv: "/data/history/csv/story-longreads.csv",
    education_resources_csv: "/data/history/csv/education-resources.csv",
    editorial_signoffs_csv: "/data/history/csv/editorial-signoffs.csv",
    editorial_review_csv: "/data/history/csv/editorial-review.csv",
    source_coverage_csv: "/data/history/csv/source-coverage.csv"
  },
  editorial_review: editorialReview.summary,
  source_coverage: sourceCoverage.summary
};

function csvEscape(value) {
  if (value == null) return "";
  const text = Array.isArray(value) ? value.join("|") : String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function writeCsv(name, rows, columns) {
  const lines = [
    columns.map((column) => csvEscape(column)).join(","),
    ...rows.map((row) => columns.map((column) => csvEscape(row[column])).join(","))
  ];
  fs.mkdirSync(csvDir, { recursive: true });
  fs.writeFileSync(path.join(csvDir, `${name}.csv`), `${lines.join("\n")}\n`);
}

writeJson(path.join(outDir, "index.json"), index);
writeJson(path.join(outDir, "events.json"), eventRecords);
writeJson(path.join(outDir, "people.json"), personRecords);
writeJson(path.join(outDir, "person-relationships.json"), personRelationshipRecords);
writeJson(path.join(outDir, "places.json"), places);
writeJson(path.join(outDir, "organizations.json"), organizationRecords);
writeJson(path.join(outDir, "sources.json"), sourceRecords);
writeJson(path.join(outDir, "archive-items.json"), historicalArchiveItems);
writeJson(path.join(outDir, "then-now-pairs.json"), thenNowPairRecords);
writeJson(path.join(outDir, "primary-documents.json"), primaryDocumentRecords);
writeJson(path.join(outDir, "story-longreads.json"), storyLongreadRecords);
writeJson(path.join(outDir, "education-resources.json"), educationResourceRecords);
writeJson(path.join(outDir, "editorial-signoffs.json"), editorialSignoffs);
writeJson(path.join(outDir, "editorial-review.json"), editorialReview);
writeJson(path.join(outDir, "source-coverage.json"), sourceCoverage);

writeCsv(
  "events",
  eventRecords.map((event) => ({
    id: event.id,
    title_bg: event.title_bg,
    title_en: event.title_en,
    year: event.date.year,
    year_end: event.date.year_end,
    era: event.era,
    category: event.category,
    source_count: event.source_ids.length,
    conflict_notes_bg: event.conflict_notes_bg,
    conflict_notes_en: event.conflict_notes_en,
    person_ids: event.person_ids,
    place_ids: event.place_ids,
    organization_ids: event.organization_ids,
    source_ids: event.source_ids
  })),
  [
    "id",
    "title_bg",
    "title_en",
    "year",
    "year_end",
    "era",
    "category",
    "source_count",
    "conflict_notes_bg",
    "conflict_notes_en",
    "person_ids",
    "place_ids",
    "organization_ids",
    "source_ids"
  ]
);

writeCsv(
  "people",
  personRecords.map((person) => ({
    id: person.id,
    name_bg: person.name_bg,
    name_en: person.name_en,
    roles: person.roles,
    birth_year: person.birth_year,
    death_year: person.death_year,
    term_events: person.term_events,
    event_ids: person.event_ids,
    place_ids: person.place_ids,
    organization_ids: person.organization_ids,
    source_ids: person.source_ids,
    editorial_status: person.editorial.status
  })),
  [
    "id",
    "name_bg",
    "name_en",
    "roles",
    "birth_year",
    "death_year",
    "term_events",
    "event_ids",
    "place_ids",
    "organization_ids",
    "source_ids",
    "editorial_status"
  ]
);

writeCsv(
  "person-relationships",
  personRelationshipRecords.map((relationship) => ({
    id: relationship.id,
    relationship_type: relationship.relationship_type,
    direction: relationship.direction,
    from_person_id: relationship.from_person_id,
    to_person_id: relationship.to_person_id,
    event_id: relationship.event_id,
    evidence_property: relationship.evidence_property,
    source_ids: relationship.source_ids,
    editorial_status: relationship.editorial.status
  })),
  [
    "id",
    "relationship_type",
    "direction",
    "from_person_id",
    "to_person_id",
    "event_id",
    "evidence_property",
    "source_ids",
    "editorial_status"
  ]
);

writeCsv(
  "places",
  places.map((place) => ({
    id: place.id,
    name_bg: place.name_bg,
    name_en: place.name_en,
    category: place.category,
    era_bg: place.era_bg,
    date_context_bg: place.date_context.display_bg,
    date_context_en: place.date_context.display_en,
    date_precision: place.date_context.precision,
    creator_context_bg: place.creator_context.display_bg,
    creator_context_en: place.creator_context.display_en,
    creator_status: place.creator_context.status,
    lat: place.coordinates?.lat,
    lng: place.coordinates?.lng,
    event_ids: place.event_ids,
    person_ids: place.person_ids,
    organization_ids: place.organization_ids,
    archive_item_ids: place.archive_item_ids,
    then_now_pair_ids: place.then_now_pair_ids,
    source_ids: place.source_ids,
    editorial_status: place.editorial.status
  })),
  [
    "id",
    "name_bg",
    "name_en",
    "category",
    "era_bg",
    "date_context_bg",
    "date_context_en",
    "date_precision",
    "creator_context_bg",
    "creator_context_en",
    "creator_status",
    "lat",
    "lng",
    "event_ids",
    "person_ids",
    "organization_ids",
    "archive_item_ids",
    "then_now_pair_ids",
    "source_ids",
    "editorial_status"
  ]
);

writeCsv(
  "organizations",
  organizationRecords.map((org) => ({
    id: org.id,
    name_bg: org.name_bg,
    name_en: org.name_en,
    category: org.category,
    event_ids: org.event_ids,
    person_ids: org.person_ids,
    place_ids: org.place_ids,
    source_ids: org.source_ids,
    editorial_status: org.editorial.status
  })),
  ["id", "name_bg", "name_en", "category", "event_ids", "person_ids", "place_ids", "source_ids", "editorial_status"]
);

writeCsv(
  "sources",
  sourceRecords.map((source) => ({
    id: source.id,
    title_bg: source.title_bg,
    title_en: source.title_en,
    publisher: source.publisher,
    url: source.url,
    accessed_at: source.accessed_at,
    license_status: source.license.status,
    license_label: source.license.label
  })),
  ["id", "title_bg", "title_en", "publisher", "url", "accessed_at", "license_status", "license_label"]
);

writeCsv(
  "archive-items",
  historicalArchiveItems.map((item) => ({
    id: item.id,
    kind: item.kind,
    title_bg: item.title_bg,
    title_en: item.title_en,
    date_year: item.date_year,
    place_id: item.place_id,
    lat: item.coordinates?.lat,
    lng: item.coordinates?.lng,
    georeference_method: item.georeference?.method,
    source_url: item.source?.url,
    media_page_url: item.media?.page_url,
    media_license: item.media?.license,
    editorial_status: item.editorial?.status
  })),
  [
    "id",
    "kind",
    "title_bg",
    "title_en",
    "date_year",
    "place_id",
    "lat",
    "lng",
    "georeference_method",
    "source_url",
    "media_page_url",
    "media_license",
    "editorial_status"
  ]
);

writeCsv(
  "then-now-pairs",
  thenNowPairRecords.map((pair) => ({
    id: pair.id,
    title_bg: pair.title_bg,
    title_en: pair.title_en,
    place_id: pair.place_id,
    historical_archive_item_id: pair.historical_archive_item_id,
    match_quality: pair.match_quality,
    then_url: pair.then_media?.page_url,
    now_url: pair.now_media?.page_url,
    then_license: pair.then_media?.license,
    now_license: pair.now_media?.license,
    source_ids: pair.source_ids,
    provenance_urls: pair.provenance?.map((entry) => entry.url),
    editorial_status: pair.editorial?.status
  })),
  [
    "id",
    "title_bg",
    "title_en",
    "place_id",
    "historical_archive_item_id",
    "match_quality",
    "then_url",
    "now_url",
    "then_license",
    "now_license",
    "source_ids",
    "provenance_urls",
    "editorial_status"
  ]
);

writeCsv(
  "primary-documents",
  primaryDocumentRecords.map((document) => ({
    id: document.id,
    kind: document.kind,
    date: document.date,
    title_bg: document.title_bg,
    title_en: document.title_en,
    transcription_type: document.transcription.type,
    original_language: document.transcription.original_language,
    linked_event_ids: document.linked_event_ids,
    linked_budget_item_ids: document.linked_budget_item_ids,
    linked_place_ids: document.linked_place_ids,
    linked_organization_ids: document.linked_organization_ids,
    source_ids: document.source_ids,
    source_url: document.source.url,
    source_license_status: document.source.license.status,
    editorial_status: document.editorial?.status
  })),
  [
    "id",
    "kind",
    "date",
    "title_bg",
    "title_en",
    "transcription_type",
    "original_language",
    "linked_event_ids",
    "linked_budget_item_ids",
    "linked_place_ids",
    "linked_organization_ids",
    "source_ids",
    "source_url",
    "source_license_status",
    "editorial_status"
  ]
);

writeCsv(
  "education-resources",
  educationResourceRecords.map((resource) => ({
    id: resource.id,
    title_bg: resource.title_bg,
    title_en: resource.title_en,
    audience_bg: resource.audience_bg,
    audience_en: resource.audience_en,
    duration_minutes: resource.duration_minutes,
    era_tags: resource.era_tags,
    subject_tags: resource.subject_tags,
    linked_event_ids: resource.linked_event_ids,
    linked_place_ids: resource.linked_place_ids,
    linked_archive_item_ids: resource.linked_archive_item_ids,
    linked_then_now_pair_ids: resource.linked_then_now_pair_ids,
    source_ids: resource.source_ids,
    audio_tour_status: resource.audio_tour?.production_status,
    editorial_status: resource.editorial?.status
  })),
  [
    "id",
    "title_bg",
    "title_en",
    "audience_bg",
    "audience_en",
    "duration_minutes",
    "era_tags",
    "subject_tags",
    "linked_event_ids",
    "linked_place_ids",
    "linked_archive_item_ids",
    "linked_then_now_pair_ids",
    "source_ids",
    "audio_tour_status",
    "editorial_status"
  ]
);

writeCsv(
  "story-longreads",
  storyLongreadRecords.map((story) => ({
    id: story.id,
    title_bg: story.title_bg,
    title_en: story.title_en,
    reading_minutes: story.reading_minutes,
    era_tags: story.era_tags,
    theme_tags: story.theme_tags,
    linked_event_ids: story.linked_event_ids,
    linked_place_ids: story.linked_place_ids,
    linked_archive_item_ids: story.linked_archive_item_ids,
    linked_then_now_pair_ids: story.linked_then_now_pair_ids,
    source_ids: story.source_ids,
    editorial_status: story.editorial?.status
  })),
  [
    "id",
    "title_bg",
    "title_en",
    "reading_minutes",
    "era_tags",
    "theme_tags",
    "linked_event_ids",
    "linked_place_ids",
    "linked_archive_item_ids",
    "linked_then_now_pair_ids",
    "source_ids",
    "editorial_status"
  ]
);

writeCsv(
  "editorial-signoffs",
  editorialSignoffs.map((signoff) => ({
    id: signoff.id,
    collection: signoff.collection,
    record_id: signoff.record_id,
    decision: signoff.decision,
    reviewed_by: signoff.reviewed_by,
    reviewer_affiliation: signoff.reviewer_affiliation,
    reviewed_at: signoff.reviewed_at,
    review_scope: signoff.review_scope,
    review_artifact_url: signoff.review_artifact_url,
    notes_bg: signoff.notes_bg,
    notes_en: signoff.notes_en
  })),
  [
    "id",
    "collection",
    "record_id",
    "decision",
    "reviewed_by",
    "reviewer_affiliation",
    "reviewed_at",
    "review_scope",
    "review_artifact_url",
    "notes_bg",
    "notes_en"
  ]
);

writeCsv(
  "editorial-review",
  editorialReviewRecords.map((record) => ({
    id: record.id,
    collection: record.collection,
    role: record.role,
    title_bg: record.title_bg,
    title_en: record.title_en,
    editorial_status: record.editorial_status,
    reviewed_by: record.reviewed_by,
    reviewed_at: record.reviewed_at,
    signoff_id: record.signoff_id,
    reviewer_affiliation: record.reviewer_affiliation,
    review_scope: record.review_scope,
    review_artifact_url: record.review_artifact_url,
    review_url_bg: record.review_url_bg,
    review_url_en: record.review_url_en,
    api_url: record.api_url,
    source_ids: record.source_ids,
    source_urls: record.source_urls,
    license_statuses: record.license_statuses,
    source_count: record.source_count,
    has_license_or_reuse_status: record.has_license_or_reuse_status,
    blockers: record.blockers
  })),
  [
    "id",
    "collection",
    "role",
    "title_bg",
    "title_en",
    "editorial_status",
    "reviewed_by",
    "reviewed_at",
    "signoff_id",
    "reviewer_affiliation",
    "review_scope",
    "review_artifact_url",
    "review_url_bg",
    "review_url_en",
    "api_url",
    "source_ids",
    "source_urls",
    "license_statuses",
    "source_count",
    "has_license_or_reuse_status",
    "blockers"
  ]
);

writeCsv(
  "source-coverage",
  sourceCoverageRecords.map((record) => ({
    id: record.id,
    collection: record.collection,
    role: record.role,
    title_bg: record.title_bg,
    title_en: record.title_en,
    review_url_bg: record.review_url_bg,
    review_url_en: record.review_url_en,
    api_url: record.api_url,
    source_count: record.source_count,
    source_ids: record.source_ids,
    source_urls: record.source_urls,
    license_statuses: record.license_statuses,
    has_open_license: record.has_open_license,
    has_public_reference_terms: record.has_public_reference_terms,
    has_license_or_reuse_status: record.has_license_or_reuse_status,
    needs_multi_source_review: record.needs_multi_source_review,
    editorial_status: record.editorial_status,
    blockers: record.blockers
  })),
  [
    "id",
    "collection",
    "role",
    "title_bg",
    "title_en",
    "review_url_bg",
    "review_url_en",
    "api_url",
    "source_count",
    "source_ids",
    "source_urls",
    "license_statuses",
    "has_open_license",
    "has_public_reference_terms",
    "has_license_or_reuse_status",
    "needs_multi_source_review",
    "editorial_status",
    "blockers"
  ]
);

console.log(
  `generated history knowledge base: ${eventRecords.length} events, ${personRecords.length} people, ${personRelationshipRecords.length} person relationships, ${places.length} places, ${organizationRecords.length} organizations, ${sourceRecords.length} sources, ${historicalArchiveItems.length} archive items, ${thenNowPairRecords.length} then/now pairs, ${primaryDocumentRecords.length} primary documents, ${storyLongreadRecords.length} longreads, ${educationResourceRecords.length} lesson plans`
);
