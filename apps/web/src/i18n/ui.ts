// Central bilingual (BG / EN) string dictionary for Open Plovdiv.
// `bg` is the source of truth for the shape; `en` is typed against it so the
// two locales can never drift out of sync.

export const languages = {
  bg: "Български",
  en: "English"
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = "bg";

const bg = {
  site: {
    name: "Отворен Пловдив",
    short: "ОП",
    tagline:
      "Обществени проекти, публични средства и градски проблеми — представени ясно.",
    sampleData: "Примерни данни",
    skip: "Към съдържанието",
    menu: "Меню",
    close: "Затвори",
    theme: "Светла / тъмна тема",
    langName: "English",
    langSwitch: "Смени езика на английски"
  },
  nav: {
    home: "Начало",
    fixMap: "Карта",
    budget: "Бюджет",
    projects: "Проекти",
    sources: "Източници",
    methodology: "Методология"
  },
  footer: {
    blurb:
      "Нестопански прототип с обществени данни. Без профили, без коментари, без база данни.",
    explore: "Разглеждане",
    about: "За проекта",
    privacy: "Поверителност",
    moderation: "Модерация",
    methodology: "Методология",
    sources: "Източници",
    note: "Open Plovdiv · обществен прототип за данни",
    sampleNote:
      "Всички записи в момента са примерни и са маркирани като прототипни.",
    rights: "Обществени данни"
  },
  common: {
    all: "Всички",
    accessed: "достъп",
    source: "Източник",
    loading: "Зареждане…",
    error: "Възникна грешка.",
    sampleBadge: "Примерни данни",
    backHome: "Към началото",
    noSource: "Няма публичен източник."
  },
  home: {
    eyebrow: "Обществени данни · статичен прототип",
    lead:
      "Обществени проекти, публични средства и градски проблеми — представени ясно, с видими източници и без потребителски профили.",
    ctaMap: "Виж картата на проблемите",
    ctaBudget: "Къде отиват местните данъци?",
    statsLabel: "Данни в прототипа",
    statProjects: "примерни проекта",
    statReports: "примерни сигнала",
    statBudget: "бюджетни категории",
    statTotal: "примерен общ размер",
    exploreTitle: "Откъде да започнете",
    cardMapEyebrow: "Карта",
    cardMapTitle: "Карта на проблемите",
    cardMapText:
      "Вижте примерни градски проблеми по категория и статус, с близки публични проекти.",
    cardBudgetEyebrow: "Бюджет",
    cardBudgetTitle: "Местни данъци",
    cardBudgetText:
      "Преглед на примерни бюджетни категории, суми, източници и свързани проекти.",
    cardProjectsEyebrow: "Проекти",
    cardProjectsTitle: "Публични проекти",
    cardProjectsText:
      "Търсене и филтриране на проектни записи с бюджет, статус и източници.",
    latestProjects: "Последно обновени проекти",
    latestReports: "Последно добавени сигнали",
    viewAll: "Виж всички",
    noticeTitle: "Прототипни данни",
    notice:
      "Тази версия използва примерни записи. Преди публично ползване те трябва да се заменят с проверени публични документи.",
    noticeSources: "Вижте източниците",
    noticeMethodology: "методологията"
  },
  budget: {
    eyebrow: "Къде отиват местните данъци?",
    title: "Бюджетен преглед",
    lead:
      "Примерни бюджетни категории с ясно показани суми, източници и свързани проектни записи.",
    year: "Година",
    total: "Общо за годината",
    notice:
      "Това са примерни бюджетни редове за тестване на интерфейса. Реална версия трябва да сочи към конкретен бюджетен документ за всеки ред.",
    categories: "Категории",
    distribution: "Разпределение",
    sourcesTitle: "Източници и свързани проекти",
    relatedProjects: "Свързани проекти",
    noRelated: "Няма свързани проекти.",
    shareOfTotal: "дял от бюджета",
    loadError: "Бюджетните данни не се заредиха.",
    chartError: "Графиката не може да бъде показана.",
    sourcesError: "Източниците не могат да бъдат показани."
  },
  projects: {
    eyebrow: "Публични проекти",
    title: "Проекти",
    lead:
      "Търсете по заглавие и филтрирайте по категория, статус и година. Всеки проект има отделна страница.",
    search: "Търсене",
    searchPlaceholder: "Напр. тротоар, парк, спирка",
    category: "Категория",
    status: "Статус",
    year: "Година",
    reset: "Изчисти филтрите",
    count: (n: number) => `${n} ${plural(n, "проект", "проекта")}`,
    countFiltered: (visible: number, total: number) =>
      `${visible} от ${total} ${plural(total, "проект", "проекта")}`,
    empty: "Няма проекти с избраните филтри."
  },
  project: {
    breadcrumb: "Проекти",
    keyFacts: "Основни данни",
    budget: "Бюджет",
    year: "Година",
    funding: "Финансиране",
    status: "Статус",
    district: "Район",
    location: "Локация",
    notSpecified: "Не е посочен",
    sources: "Източници",
    sourcesNote:
      "Този запис е маркиран като примерен и не трябва да се третира като официално твърдение.",
    relatedBudget: "Свързан бюджетен ред",
    noRelatedBudget: "Няма свързан бюджетен ред.",
    nearbyReports: "Близки сигнали",
    noNearby: "Няма примерни сигнали в радиус 1 км.",
    timeline: "Хронология",
    noTimeline: "Няма добавена хронология.",
    updated: "Обновено",
    mapLabel: "Карта на проекта"
  },
  fixMap: {
    eyebrow: "Карта на проблемите",
    title: "Карта на градски проблеми",
    lead:
      "Примерни сигнали без лични данни. Филтрирайте по категория и статус, вижте детайли и близки публични проекти.",
    notice:
      "Сигналите в тази версия са примерни. Статусът показва дали записът е проверен, изпратен, в процес или затворен.",
    category: "Категория",
    allCategories: "Всички категории",
    status: "Статус",
    allStatuses: "Всички статуси",
    radius: "Близки проекти",
    radius500: "до 500 м",
    radius1: "до 1 км",
    radius2: "до 2 км",
    visible: "Видими записи",
    selectTitle: "Изберете сигнал",
    selectHint:
      "Кликнете върху маркер, за да видите детайли, статус и близки проекти.",
    legend: "Легенда",
    statusesTitle: "Какво означават статусите",
    officialTitle: "Официално подаване",
    officialText:
      "За реални сигнали използвайте официалните канали на общината или районната администрация. Open Plovdiv не заменя официалното подаване и в тази версия не приема публични сигнали.",
    officialLink: "Община Пловдив",
    statusLabel: "Статус",
    nearbyProjects: "Близки проекти",
    noNearbyRadius: "Няма проект в избрания радиус.",
    loadErrorTitle: "Данните не се заредиха",
    loadErrorText:
      "Проверете дали публичните JSON файлове са генерирани с make data."
  },
  sources: {
    eyebrow: "Проверимост",
    title: "Източници на данни",
    lead:
      "Всеки официален запис трябва да сочи към публичен документ. Текущите записи са примерни и са маркирани като прототипни.",
    colSource: "Източник",
    colUsedFor: "Използва се за",
    colLimits: "Ограничения",
    colAccessed: "Достъп"
  },
  methodology: {
    eyebrow: "Как работи",
    title: "Методология",
    lead:
      "Данните минават през преглед, схема и публични източници, преди да бъдат публикувани като факти. AI може да помага за чернови, но не е източник на истина.",
    collectTitle: "Събиране",
    collectText:
      "Версията е manual-first. Редактор добавя записи в data/curated, а оригинални документи могат да се пазят в data/raw.",
    verifyTitle: "Проверка",
    verifyText:
      "Валидират се задължителни полета, статуси, URL адреси, суми, координати и липса на лични данни в сигналите.",
    aiTitle: "AI",
    aiText:
      "AI изходът трябва да бъде чернова или човешки прегледан. Той не може да измисля факти, обвинения или липсващи стойности.",
    correctTitle: "Корекции",
    correctText:
      "Корекцията трябва да добави или смени публичен източник, да обнови curated JSON и да мине през validation и build."
  },
  privacy: {
    eyebrow: "Без лични данни в прототипа",
    title: "Поверителност",
    lead:
      "Първата версия работи без потребителски профили, коментари, гласуване и публично събиране на лични данни.",
    notCollectTitle: "Какво не събираме",
    notCollectText:
      "Няма имена, имейли, телефони, IP адреси, акаунти или точни частни адреси в сигналите.",
    beforeTitle: "Преди публични сигнали",
    beforeText:
      "Нужни са правила за модерация, снимки, злоупотреби и корекции, преди да се позволят обществени подавания."
  },
  moderation: {
    eyebrow: "Без публични подавания в прототипа",
    title: "Модерация",
    lead:
      "Публични сигнали не са включени в първата версия. Преди това е нужен процес за лични данни, снимки, неточности и злоупотреби.",
    notice:
      "Модерацията трябва да бъде консервативна: публикуват се проверими градски проблеми, не обиди, обвинения или политическа кампания."
  },
  notFound: {
    eyebrow: "Грешка 404",
    title: "Страницата не е намерена",
    text: "Връзката може да е остаряла или сгрешена. Върнете се към началото или изберете секция."
  }
};

function plural(n: number, one: string, many: string): string {
  return n === 1 ? one : many;
}

const en: typeof bg = {
  site: {
    name: "Open Plovdiv",
    short: "OP",
    tagline:
      "Public projects, public money, public problems — made easier to understand.",
    sampleData: "Sample data",
    skip: "Skip to content",
    menu: "Menu",
    close: "Close",
    theme: "Light / dark theme",
    langName: "Български",
    langSwitch: "Switch language to Bulgarian"
  },
  nav: {
    home: "Home",
    fixMap: "Map",
    budget: "Budget",
    projects: "Projects",
    sources: "Sources",
    methodology: "Methodology"
  },
  footer: {
    blurb:
      "A non-profit public-data prototype. No accounts, no comments, no database.",
    explore: "Explore",
    about: "About",
    privacy: "Privacy",
    moderation: "Moderation",
    methodology: "Methodology",
    sources: "Sources",
    note: "Open Plovdiv · public data prototype",
    sampleNote:
      "All records are currently samples and are clearly marked as prototype data.",
    rights: "Public data"
  },
  common: {
    all: "All",
    accessed: "accessed",
    source: "Source",
    loading: "Loading…",
    error: "Something went wrong.",
    sampleBadge: "Sample data",
    backHome: "Back to home",
    noSource: "No public source."
  },
  home: {
    eyebrow: "Public data · static prototype",
    lead:
      "Public projects, public money and city problems — shown clearly, with visible sources and no user accounts.",
    ctaMap: "Open the problem map",
    ctaBudget: "Where do local taxes go?",
    statsLabel: "Data in the prototype",
    statProjects: "sample projects",
    statReports: "sample reports",
    statBudget: "budget categories",
    statTotal: "sample total",
    exploreTitle: "Where to start",
    cardMapEyebrow: "Map",
    cardMapTitle: "Problem map",
    cardMapText:
      "See sample city problems by category and status, with nearby public projects.",
    cardBudgetEyebrow: "Budget",
    cardBudgetTitle: "Local taxes",
    cardBudgetText:
      "Browse sample budget categories, amounts, sources and related projects.",
    cardProjectsEyebrow: "Projects",
    cardProjectsTitle: "Public projects",
    cardProjectsText:
      "Search and filter project records with budget, status and sources.",
    latestProjects: "Recently updated projects",
    latestReports: "Recently added reports",
    viewAll: "View all",
    noticeTitle: "Prototype data",
    notice:
      "This version uses sample records. Before public use they must be replaced with reviewed public documents.",
    noticeSources: "See the sources",
    noticeMethodology: "the methodology"
  },
  budget: {
    eyebrow: "Where do local taxes go?",
    title: "Budget overview",
    lead:
      "Sample budget categories with clearly shown amounts, sources and related project records.",
    year: "Year",
    total: "Total for the year",
    notice:
      "These are sample budget lines for testing the interface. A real version must point to a specific budget document for each line.",
    categories: "Categories",
    distribution: "Distribution",
    sourcesTitle: "Sources and related projects",
    relatedProjects: "Related projects",
    noRelated: "No related projects.",
    shareOfTotal: "share of budget",
    loadError: "Budget data failed to load.",
    chartError: "The chart cannot be shown.",
    sourcesError: "The sources cannot be shown."
  },
  projects: {
    eyebrow: "Public projects",
    title: "Projects",
    lead:
      "Search by title and filter by category, status and year. Each project has its own page.",
    search: "Search",
    searchPlaceholder: "e.g. pavement, park, stop",
    category: "Category",
    status: "Status",
    year: "Year",
    reset: "Clear filters",
    count: (n: number) => `${n} ${plural(n, "project", "projects")}`,
    countFiltered: (visible: number, total: number) =>
      `${visible} of ${total} ${plural(total, "project", "projects")}`,
    empty: "No projects match the selected filters."
  },
  project: {
    breadcrumb: "Projects",
    keyFacts: "Key facts",
    budget: "Budget",
    year: "Year",
    funding: "Funding",
    status: "Status",
    district: "District",
    location: "Location",
    notSpecified: "Not specified",
    sources: "Sources",
    sourcesNote:
      "This record is marked as a sample and must not be treated as an official statement.",
    relatedBudget: "Related budget line",
    noRelatedBudget: "No related budget line.",
    nearbyReports: "Nearby reports",
    noNearby: "No sample reports within 1 km.",
    timeline: "Timeline",
    noTimeline: "No timeline added.",
    updated: "Updated",
    mapLabel: "Project map"
  },
  fixMap: {
    eyebrow: "Problem map",
    title: "City problem map",
    lead:
      "Sample reports with no personal data. Filter by category and status, see details and nearby public projects.",
    notice:
      "Reports in this version are samples. The status shows whether a record is verified, sent, in progress or closed.",
    category: "Category",
    allCategories: "All categories",
    status: "Status",
    allStatuses: "All statuses",
    radius: "Nearby projects",
    radius500: "within 500 m",
    radius1: "within 1 km",
    radius2: "within 2 km",
    visible: "Visible records",
    selectTitle: "Select a report",
    selectHint:
      "Click a marker to see details, status and nearby projects.",
    legend: "Legend",
    statusesTitle: "What the statuses mean",
    officialTitle: "Official reporting",
    officialText:
      "For real issues, use the official channels of the municipality or district administration. Open Plovdiv does not replace official reporting and does not accept public reports in this version.",
    officialLink: "Plovdiv Municipality",
    statusLabel: "Status",
    nearbyProjects: "Nearby projects",
    noNearbyRadius: "No project within the selected radius.",
    loadErrorTitle: "Data failed to load",
    loadErrorText:
      "Check that the public JSON files were generated with make data."
  },
  sources: {
    eyebrow: "Verifiability",
    title: "Data sources",
    lead:
      "Every official record should point to a public document. Current records are samples and are marked as prototype data.",
    colSource: "Source",
    colUsedFor: "Used for",
    colLimits: "Limitations",
    colAccessed: "Accessed"
  },
  methodology: {
    eyebrow: "How it works",
    title: "Methodology",
    lead:
      "Data goes through review, a schema and public sources before being published as fact. AI can help draft, but is not a source of truth.",
    collectTitle: "Collection",
    collectText:
      "The version is manual-first. An editor adds records to data/curated, and original documents can be kept in data/raw.",
    verifyTitle: "Verification",
    verifyText:
      "Required fields, statuses, URLs, amounts, coordinates and the absence of personal data in reports are validated.",
    aiTitle: "AI",
    aiText:
      "AI output must be a draft or human-reviewed. It cannot invent facts, accusations or missing values.",
    correctTitle: "Corrections",
    correctText:
      "A correction must add or change a public source, update the curated JSON and pass validation and build."
  },
  privacy: {
    eyebrow: "No personal data in the prototype",
    title: "Privacy",
    lead:
      "The first version works without user accounts, comments, voting or public collection of personal data.",
    notCollectTitle: "What we don't collect",
    notCollectText:
      "No names, emails, phone numbers, IP addresses, accounts or exact private addresses in reports.",
    beforeTitle: "Before public reports",
    beforeText:
      "Rules for moderation, photos, abuse and corrections are needed before public submissions can be allowed."
  },
  moderation: {
    eyebrow: "No public submissions in the prototype",
    title: "Moderation",
    lead:
      "Public reports are not included in the first version. A process for personal data, photos, inaccuracies and abuse is needed first.",
    notice:
      "Moderation must be conservative: verifiable city problems are published, not insults, accusations or political campaigning."
  },
  notFound: {
    eyebrow: "Error 404",
    title: "Page not found",
    text: "The link may be outdated or mistyped. Return home or choose a section."
  }
};

export const ui = { bg, en } as const;

export type CategoryKey =
  | "roads"
  | "pavement"
  | "street_lighting"
  | "parks"
  | "waste"
  | "public_transport"
  | "accessibility"
  | "drainage"
  | "culture"
  | "education"
  | "other";

export const categoryLabels: Record<Lang, Record<string, string>> = {
  bg: {
    roads: "Улици",
    pavement: "Тротоари",
    street_lighting: "Осветление",
    parks: "Паркове",
    waste: "Чистота",
    public_transport: "Транспорт",
    accessibility: "Достъпност",
    drainage: "Отводняване",
    culture: "Култура",
    education: "Образование",
    other: "Друго"
  },
  en: {
    roads: "Roads",
    pavement: "Pavements",
    street_lighting: "Lighting",
    parks: "Parks",
    waste: "Waste",
    public_transport: "Transport",
    accessibility: "Accessibility",
    drainage: "Drainage",
    culture: "Culture",
    education: "Education",
    other: "Other"
  }
};

// Accent colour per category, used for map pins and category dots.
export const categoryColors: Record<string, string> = {
  roads: "#3f6f9f",
  pavement: "#8a6d3b",
  street_lighting: "#b07d1a",
  parks: "#3f8a5b",
  waste: "#6b8f3d",
  public_transport: "#5b6bb0",
  accessibility: "#1f8a8a",
  drainage: "#2f7fb0",
  culture: "#9a5b8f",
  education: "#a85a4a",
  other: "#6b7280"
};

export const projectStatusLabels: Record<Lang, Record<string, string>> = {
  bg: {
    planned: "Планиран",
    funded: "Финансиран",
    contracted: "Договорен",
    in_progress: "В процес",
    completed: "Завършен",
    delayed: "Забавен",
    unknown: "Неизвестен"
  },
  en: {
    planned: "Planned",
    funded: "Funded",
    contracted: "Contracted",
    in_progress: "In progress",
    completed: "Completed",
    delayed: "Delayed",
    unknown: "Unknown"
  }
};

export const fixStatusLabels: Record<Lang, Record<string, string>> = {
  bg: {
    unverified: "Непроверен",
    verified: "Проверен",
    sent_to_municipality: "Изпратен",
    in_progress: "В процес",
    fixed: "Поправен",
    closed: "Затворен"
  },
  en: {
    unverified: "Unverified",
    verified: "Verified",
    sent_to_municipality: "Sent",
    in_progress: "In progress",
    fixed: "Fixed",
    closed: "Closed"
  }
};

export const fixStatusDescriptions: Record<Lang, Record<string, string>> = {
  bg: {
    unverified: "Сигналът е примерен или очаква проверка.",
    verified: "Проверен е от редактор или публичен източник.",
    sent_to_municipality: "Маркиран е като изпратен към институция.",
    in_progress: "Има отбелязан текущ ремонт или проверка.",
    fixed: "Маркиран е като поправен.",
    closed: "Затворен е без активен следващ етап."
  },
  en: {
    unverified: "The report is a sample or awaits verification.",
    verified: "Verified by an editor or a public source.",
    sent_to_municipality: "Marked as sent to an institution.",
    in_progress: "An ongoing repair or check is noted.",
    fixed: "Marked as fixed.",
    closed: "Closed with no active next step."
  }
};

export const districtLabels: Record<string, string> = {
  Централен: "Tsentralen",
  Северен: "Severen",
  Южен: "Yuzhen",
  Тракия: "Trakiya",
  Западен: "Zapaden",
  Източен: "Iztochen",
  "Стар град": "Old Town"
};

export const fundingSourceLabels: Record<Lang, Record<string, string>> = {
  bg: { municipal_budget: "Общински бюджет" },
  en: { municipal_budget: "Municipal budget" }
};

// Citation titles embedded in records (project sources, budget source documents).
// Real public documents keep their original-language name; our own sample/system
// labels get an English equivalent so the EN site reads cleanly.
export const sourceTitleLabels: Record<Lang, Record<string, string>> = {
  bg: {},
  en: {
    "Примерни данни за прототип": "Prototype sample data",
    "Община Пловдив - публична информация": "Plovdiv Municipality — public information"
  }
};
