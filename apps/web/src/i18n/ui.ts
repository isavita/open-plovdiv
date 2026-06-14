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
      "Нестопански проект с обществени данни за Пловдив. Без профили, без коментари, без база данни.",
    explore: "Разглеждане",
    about: "За проекта",
    privacy: "Поверителност",
    moderation: "Модерация",
    methodology: "Методология",
    sources: "Източници",
    note: "Open Plovdiv · обществени данни за Пловдив",
    sampleNote: "Данни от публични източници · актуални към юни 2026 г.",
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
    eyebrow: "Обществени данни · Пловдив",
    lead:
      "Обществени проекти, публични средства и градски проблеми — представени ясно, с видими източници и без потребителски профили.",
    ctaMap: "Виж картата на проблемите",
    ctaBudget: "Къде отиват местните данъци?",
    statsLabel: "Проследявани данни",
    statProjects: "проследявани проекта",
    statReportsValue: "На живо",
    statReports: "модерирани сигнали",
    statBudget: "бюджетни сектора",
    statTotal: "капиталова програма 2025",
    exploreTitle: "Откъде да започнете",
    cardMapEyebrow: "Карта",
    cardMapTitle: "Карта на проблемите",
    cardMapText:
      "Вижте публикувани граждански сигнали по категория и статус, с близки публични проекти.",
    cardBudgetEyebrow: "Бюджет",
    cardBudgetTitle: "Местни данъци",
    cardBudgetText:
      "Бюджет 2025 и прогнозна капиталова програма 2026 — суми, дялове и публични източници.",
    cardProjectsEyebrow: "Проекти",
    cardProjectsTitle: "Публични проекти",
    cardProjectsText:
      "Търсене и филтриране на проектни записи с бюджет, статус и източници.",
    latestProjects: "Последно обновени проекти",
    latestReports: "Последно добавени сигнали",
    liveReportsTitle: "Реални сигнали след модерация",
    liveReportsText:
      "Картата вече показва само граждански сигнали, които са подадени през формата и одобрени от модератор.",
    viewAll: "Виж всички",
    noticeTitle: "Данни и източници",
    notice:
      "Данните са актуални към юни 2026 г. Бюджетът за 2025 г. е приет, а капиталовата програма за 2026 г. е прогнозна. Всеки запис сочи към публичен източник.",
    noticeSources: "Вижте източниците",
    noticeMethodology: "методологията"
  },
  budget: {
    eyebrow: "Къде отиват местните данъци?",
    title: "Бюджет и капиталова програма",
    lead:
      "Бюджетът за 2025 г. и прогнозната капиталова програма за 2026 г. — с ясно показани суми, дялове и публични източници.",
    totalLabel: "Общ бюджет за 2025 г.",
    capitalLabel: "Капиталова програма за 2025 г.",
    sectorTitle: "Капиталова програма за 2025 г. по сектори",
    approxNote:
      "Стойностите по сектори са приблизителни — изчислени от публикуваните дялове на капиталовата програма.",
    shareOfTotal: "дял от капиталовата програма",
    provTitle: "Капиталова програма за 2026 г. (прогнозна)",
    provText:
      "2026 г. е първият бюджет на Пловдив в евро. Прогнозната капиталова програма е около 87 млн. евро. Стойностите са прогнозни и подлежат на промяна с приемането на държавния бюджет.",
    fundingTitle: "Източници на финансиране за 2026 г.",
    fundEu: "Европейски средства",
    fundOwn: "Собствени приходи и преходен остатък",
    fundOpco: "Съфинансиране по програми",
    fundState: "Целева държавна субсидия",
    fundOther: "Други (дарения, заеми)",
    sourceLabel: "Източник"
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
      "Данните за проекта са събрани от публични източници. За официални детайли проверете първоизточника.",
    noteLabel: "Бележка",
    noAmount: "Сумата не е публикувана.",
    approxLocation: "Приблизително местоположение (по район).",
    provisional: "Прогнозни данни",
    relatedBudget: "Свързан бюджетен ред",
    noRelatedBudget: "Няма свързан бюджетен ред.",
    nearbyReports: "Близки сигнали",
    noNearby: "Няма публикувани сигнали в радиус 1 км.",
    nearbyReportsText:
      "Публичната карта показва само модерирани граждански сигнали. Отворете картата, за да видите текущите публикувани сигнали около този район.",
    timeline: "Хронология",
    noTimeline: "Няма добавена хронология.",
    updated: "Обновено",
    mapLabel: "Карта на проекта"
  },
  fixMap: {
    eyebrow: "Карта на проблемите",
    title: "Карта на градски проблеми",
    lead:
      "Публикувани граждански сигнали без лични данни. Филтрирайте по категория и статус, вижте детайли и близки публични проекти.",
    notice:
      "Картата показва само сигнали, които са подадени през формата и одобрени от модератор. Статусът показва дали записът е проверен, изпратен, в процес или затворен.",
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
    emptyTitle: "Все още няма публикувани сигнали",
    emptyText:
      "Подадените сигнали се появяват тук след преглед и одобрение от модератор.",
    noFilterResults: "Няма сигнали с тези филтри",
    legend: "Легенда",
    statusesTitle: "Какво означават статусите",
    officialTitle: "Официално подаване",
    officialText:
      "За реални сигнали използвайте официалните канали на общината или районната администрация. Open Plovdiv приема граждански сигнали, които се преглеждат преди публикуване, но не заменя официалното подаване.",
    officialLink: "Община Пловдив",
    statusLabel: "Статус",
    nearbyProjects: "Близки проекти",
    noNearbyRadius: "Няма проект в избрания радиус.",
    loadErrorTitle: "Данните не се заредиха",
    loadErrorText:
      "Проверете дали публичните JSON файлове са генерирани с make data.",
    reportCta: "Подай сигнал",
    communityBadge: "Граждански сигнал",
    lastUpdated: "Обновено",
    justNow: "току-що",
    liveNote: "Картата се обновява автоматично на всеки 30 секунди.",
    newReports: "Нови сигнали: {count}",
    downloadCommunityData: "Изтегли гражданските сигнали"
  },
  sources: {
    eyebrow: "Проверимост",
    title: "Източници на данни",
    lead:
      "Всеки запис на сайта сочи към публичен източник. По-долу са основните използвани източници и за какво служат.",
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
      "Данните се събират ръчно от публични източници — бюджета и решенията на Община Пловдив, капиталовата програма и местни медии — и всеки запис се въвежда с препратка към източника.",
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
    eyebrow: "Без лични данни",
    title: "Поверителност",
    lead:
      "Първата версия работи без потребителски профили, коментари, гласуване и публично събиране на лични данни.",
    notCollectTitle: "Какво не събираме",
    notCollectText:
      "Няма имена, имейли, телефони, акаунти или точни частни адреси в сигналите.",
    beforeTitle: "Граждански сигнали",
    beforeText:
      "Сигналите събират категория, кратък текст, приблизителна точка на картата и по избор снимки. IP адресите се използват само като временен хеш за ограничаване на честотата и не се съхраняват в явен вид."
  },
  moderation: {
    eyebrow: "Граждански сигнали с преглед",
    title: "Модерация",
    lead:
      "Гражданите могат да подават сигнали за градски проблеми. Всеки сигнал се преглежда от редактор и се публикува само ако е безопасен и от обществен интерес.",
    notice:
      "Модерацията е консервативна: публикуват се проверими градски проблеми без лични данни — не обиди, обвинения или политическа кампания. Снимките се публикуват само след преглед и могат да бъдат скрити."
  },
  notFound: {
    eyebrow: "Грешка 404",
    title: "Страницата не е намерена",
    text: "Връзката може да е остаряла или сгрешена. Върнете се към началото или изберете секция."
  },
  reportForm: {
    eyebrow: "Граждански сигнал",
    title: "Подаване на сигнал",
    lead:
      "Опишете публичен градски проблем и посочете мястото на картата. Сигналът се преглежда от редактор, преди да се появи на картата.",
    notice:
      "Не въвеждайте лични данни — имена, телефони, имейли или точни частни адреси. Снимките се преглеждат ръчно и не се публикуват преди одобрение.",
    category: "Категория",
    titleLabel: "Кратко заглавие",
    titlePlaceholder: "Напр. неравна настилка до спирка",
    description: "Описание",
    descriptionPlaceholder: "Опишете проблема накратко и обективно.",
    photos: "Снимки",
    photoHint:
      "По избор, до 3 снимки, максимум 5 MB всяка. EXIF/GPS данните се премахват и снимките се конвертират преди преглед.",
    location: "Локация",
    locationHint: "Кликнете върху картата, за да отбележите мястото.",
    selected: "Избрана точка",
    noLocation: "Все още не е избрана точка",
    confirmNoPersonal: "Потвърждавам, че сигналът не съдържа лични данни.",
    confirmPublicInterest: "Потвърждавам, че това е въпрос от обществен интерес.",
    submit: "Изпрати сигнала",
    submitting: "Изпращане…",
    successTitle: "Благодарим!",
    successText:
      "Сигналът е получен и ще бъде прегледан преди публикуване. Номер за справка:",
    submitAnother: "Подай нов сигнал",
    backToMap: "Към картата",
    errorGeneric: "Сигналът не можа да бъде изпратен. Опитайте отново.",
    errRateLimited: "Твърде много сигнали за кратко време. Опитайте по-късно.",
    errCategory: "Изберете валидна категория.",
    errTitle: "Заглавието трябва да е между 3 и 120 знака.",
    errDescription: "Описанието трябва да е между 10 и 1000 знака.",
    errPersonalData: "Текстът съдържа нещо, което прилича на лични данни.",
    errLocation: "Изберете точка в рамките на Пловдив.",
    errConfirmation: "Моля, отметнете двете потвърждения.",
    errTooManyPhotos: "Качете най-много 3 снимки.",
    errPhotoLarge: "Всяка снимка трябва да е до 5 MB.",
    errPhotoType: "Позволени са само JPEG, PNG или WebP снимки.",
    errPhotoInvalid: "Снимката не може да бъде обработена."
  },
  admin: {
    title: "Модерация на сигнали",
    lead: "Преглед на граждански сигнали преди публикуване. Достъпът е защитен.",
    tokenLabel: "Администраторски ключ",
    tokenPlaceholder: "Въведете ключ",
    signIn: "Вход",
    signOut: "Изход",
    authError: "Невалиден ключ.",
    refresh: "Опресни",
    pendingTitle: "Чакащи преглед",
    noPending: "Няма чакащи сигнали.",
    publicStatus: "Публичен статус",
    rejectReason: "Причина за отхвърляне (по избор)",
    approve: "Одобри и публикувай",
    reject: "Отхвърли",
    publishedTitle: "Публикувани сигнали",
    noPublished: "Няма публикувани граждански сигнали.",
    saveStatus: "Запази статус",
    editDetails: "Данни за сигнала",
    saveDetails: "Запази данни",
    titleBg: "Заглавие (BG)",
    titleEn: "Заглавие (EN, по избор)",
    descriptionBg: "Описание (BG)",
    descriptionEn: "Описание (EN, по избор)",
    category: "Категория",
    latitude: "Ширина",
    longitude: "Дължина",
    addressBg: "Адрес/ориентир (BG, по избор)",
    addressEn: "Адрес/ориентир (EN, по избор)",
    photos: "Снимки",
    hidePhoto: "Скрий снимка",
    hiddenPhoto: "Скрита снимка",
    moderationWarning:
      "Публикувайте снимки само ако не съдържат лица, деца, регистрационни номера, документи, частни интериори или лична информация.",
    submitted: "Подаден",
    loading: "Зареждане…",
    actionError: "Действието не бе успешно."
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
      "A non-profit public-data project for Plovdiv. No accounts, no comments, no database.",
    explore: "Explore",
    about: "About",
    privacy: "Privacy",
    moderation: "Moderation",
    methodology: "Methodology",
    sources: "Sources",
    note: "Open Plovdiv · public data for Plovdiv",
    sampleNote: "Data from public sources · updated June 2026.",
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
    eyebrow: "Public data · Plovdiv",
    lead:
      "Public projects, public money and city problems — shown clearly, with visible sources and no user accounts.",
    ctaMap: "Open the problem map",
    ctaBudget: "Where do local taxes go?",
    statsLabel: "Tracked data",
    statProjects: "tracked projects",
    statReportsValue: "Live",
    statReports: "moderated reports",
    statBudget: "budget sectors",
    statTotal: "2025 capital programme",
    exploreTitle: "Where to start",
    cardMapEyebrow: "Map",
    cardMapTitle: "Problem map",
    cardMapText:
      "See published citizen reports by category and status, with nearby public projects.",
    cardBudgetEyebrow: "Budget",
    cardBudgetTitle: "Local taxes",
    cardBudgetText:
      "2025 budget and provisional 2026 capital programme — amounts, shares and public sources.",
    cardProjectsEyebrow: "Projects",
    cardProjectsTitle: "Public projects",
    cardProjectsText:
      "Search and filter project records with budget, status and sources.",
    latestProjects: "Recently updated projects",
    latestReports: "Recently added reports",
    liveReportsTitle: "Real reports after moderation",
    liveReportsText:
      "The map now shows only citizen reports submitted through the form and approved by a moderator.",
    viewAll: "View all",
    noticeTitle: "Data and sources",
    notice:
      "Data is current as of June 2026. The 2025 budget is adopted, while the 2026 capital programme is provisional. Every record links to a public source.",
    noticeSources: "See the sources",
    noticeMethodology: "the methodology"
  },
  budget: {
    eyebrow: "Where do local taxes go?",
    title: "Budget and capital programme",
    lead:
      "The 2025 budget and the provisional 2026 capital programme — with clearly shown amounts, shares and public sources.",
    totalLabel: "Total 2025 budget",
    capitalLabel: "2025 capital programme",
    sectorTitle: "2025 capital programme by sector",
    approxNote:
      "Sector values are approximate — derived from the published shares of the capital programme.",
    shareOfTotal: "share of the capital programme",
    provTitle: "2026 capital programme (provisional)",
    provText:
      "2026 is Plovdiv's first budget in euros. The provisional capital programme is about EUR 87 million. Figures are provisional and may change once the state budget is adopted.",
    fundingTitle: "2026 funding sources",
    fundEu: "EU funds",
    fundOwn: "Own revenue and carry-over",
    fundOpco: "Programme co-financing",
    fundState: "State targeted subsidy",
    fundOther: "Other (donations, loans)",
    sourceLabel: "Source"
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
      "The project data is collected from public sources. For official details, check the original source.",
    noteLabel: "Note",
    noAmount: "Amount not published.",
    approxLocation: "Approximate location (by district).",
    provisional: "Provisional data",
    relatedBudget: "Related budget line",
    noRelatedBudget: "No related budget line.",
    nearbyReports: "Nearby reports",
    noNearby: "No published reports within 1 km.",
    nearbyReportsText:
      "The public map shows only moderated citizen reports. Open the map to see currently published reports around this area.",
    timeline: "Timeline",
    noTimeline: "No timeline added.",
    updated: "Updated",
    mapLabel: "Project map"
  },
  fixMap: {
    eyebrow: "Problem map",
    title: "City problem map",
    lead:
      "Published citizen reports with no personal data. Filter by category and status, see details and nearby public projects.",
    notice:
      "The map shows only reports submitted through the form and approved by a moderator. The status shows whether a record is verified, sent, in progress or closed.",
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
    emptyTitle: "No published reports yet",
    emptyText:
      "Submitted reports appear here after review and approval by a moderator.",
    noFilterResults: "No reports match these filters",
    legend: "Legend",
    statusesTitle: "What the statuses mean",
    officialTitle: "Official reporting",
    officialText:
      "For real issues, use the official channels of the municipality or district administration. Open Plovdiv accepts citizen reports that are reviewed before publishing, but does not replace official reporting.",
    officialLink: "Plovdiv Municipality",
    statusLabel: "Status",
    nearbyProjects: "Nearby projects",
    noNearbyRadius: "No project within the selected radius.",
    loadErrorTitle: "Data failed to load",
    loadErrorText:
      "Check that the public JSON files were generated with make data.",
    reportCta: "Report a problem",
    communityBadge: "Citizen report",
    lastUpdated: "Updated",
    justNow: "just now",
    liveNote: "The map refreshes automatically every 30 seconds.",
    newReports: "New reports: {count}",
    downloadCommunityData: "Download citizen report data"
  },
  sources: {
    eyebrow: "Verifiability",
    title: "Data sources",
    lead:
      "Every record on the site links to a public source. Below are the main sources used and what they are for.",
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
      "Data is collected manually from public sources — Plovdiv Municipality's budget and decisions, the capital programme and local media — and each record is entered with a link to its source.",
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
    eyebrow: "No personal data",
    title: "Privacy",
    lead:
      "The first version works without user accounts, comments, voting or public collection of personal data.",
    notCollectTitle: "What we don't collect",
    notCollectText:
      "No names, emails, phone numbers, accounts or exact private addresses in reports.",
    beforeTitle: "Citizen reports",
    beforeText:
      "Reports collect a category, short text, an approximate point on the map and optional photos. IP addresses are used only as a temporary hash for rate limiting and are never stored in clear text."
  },
  moderation: {
    eyebrow: "Reviewed citizen reports",
    title: "Moderation",
    lead:
      "Citizens can submit reports about city problems. Each report is reviewed by an editor and published only if it is safe and in the public interest.",
    notice:
      "Moderation is conservative: verifiable city problems with no personal data are published — not insults, accusations or political campaigning. Photos are published only after review and can be hidden."
  },
  notFound: {
    eyebrow: "Error 404",
    title: "Page not found",
    text: "The link may be outdated or mistyped. Return home or choose a section."
  },
  reportForm: {
    eyebrow: "Citizen report",
    title: "Submit a report",
    lead:
      "Describe a public city problem and mark its place on the map. An editor reviews each report before it appears on the map.",
    notice:
      "Do not enter personal data — names, phone numbers, emails or exact private addresses. Photos are reviewed manually and are not published before approval.",
    category: "Category",
    titleLabel: "Short title",
    titlePlaceholder: "e.g. uneven pavement near a stop",
    description: "Description",
    descriptionPlaceholder: "Describe the problem briefly and objectively.",
    photos: "Photos",
    photoHint:
      "Optional, up to 3 photos, maximum 5 MB each. EXIF/GPS metadata is removed and photos are converted before review.",
    location: "Location",
    locationHint: "Click on the map to mark the place.",
    selected: "Selected point",
    noLocation: "No point selected yet",
    confirmNoPersonal: "I confirm this report contains no personal data.",
    confirmPublicInterest: "I confirm this is a public-interest issue.",
    submit: "Submit report",
    submitting: "Submitting…",
    successTitle: "Thank you!",
    successText:
      "Your report was received and will be reviewed before publishing. Reference number:",
    submitAnother: "Submit another report",
    backToMap: "Back to the map",
    errorGeneric: "The report could not be sent. Please try again.",
    errRateLimited: "Too many reports in a short time. Please try later.",
    errCategory: "Choose a valid category.",
    errTitle: "The title must be between 3 and 120 characters.",
    errDescription: "The description must be between 10 and 1000 characters.",
    errPersonalData: "The text contains something that looks like personal data.",
    errLocation: "Choose a point within Plovdiv.",
    errConfirmation: "Please tick both confirmations.",
    errTooManyPhotos: "Upload at most 3 photos.",
    errPhotoLarge: "Each photo must be 5 MB or smaller.",
    errPhotoType: "Only JPEG, PNG or WebP photos are allowed.",
    errPhotoInvalid: "The photo could not be processed."
  },
  admin: {
    title: "Report moderation",
    lead: "Review citizen reports before publishing. Access is protected.",
    tokenLabel: "Admin token",
    tokenPlaceholder: "Enter token",
    signIn: "Sign in",
    signOut: "Sign out",
    authError: "Invalid token.",
    refresh: "Refresh",
    pendingTitle: "Pending review",
    noPending: "No pending reports.",
    publicStatus: "Public status",
    rejectReason: "Rejection reason (optional)",
    approve: "Approve & publish",
    reject: "Reject",
    publishedTitle: "Published reports",
    noPublished: "No published citizen reports.",
    saveStatus: "Save status",
    editDetails: "Report details",
    saveDetails: "Save details",
    titleBg: "Title (BG)",
    titleEn: "Title (EN, optional)",
    descriptionBg: "Description (BG)",
    descriptionEn: "Description (EN, optional)",
    category: "Category",
    latitude: "Latitude",
    longitude: "Longitude",
    addressBg: "Address/landmark (BG, optional)",
    addressEn: "Address/landmark (EN, optional)",
    photos: "Photos",
    hidePhoto: "Hide photo",
    hiddenPhoto: "Hidden photo",
    moderationWarning:
      "Publish photos only if they contain no faces, children, license plates, documents, private interiors or personal information.",
    submitted: "Submitted",
    loading: "Loading…",
    actionError: "The action failed."
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
    environment: "Околна среда",
    social: "Социални дейности",
    sport: "Спорт",
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
    environment: "Environment",
    social: "Social",
    sport: "Sport",
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
  environment: "#3f8a5b",
  social: "#7a5ca8",
  sport: "#2f7fb0",
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
    postponed: "Отложен",
    unknown: "Неизвестен"
  },
  en: {
    planned: "Planned",
    funded: "Funded",
    contracted: "Contracted",
    in_progress: "In progress",
    completed: "Completed",
    delayed: "Delayed",
    postponed: "Postponed",
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
    unverified: "Сигналът е публикуван, но още не е независимо проверен.",
    verified: "Проверен е от редактор или публичен източник.",
    sent_to_municipality: "Маркиран е като изпратен към институция.",
    in_progress: "Има отбелязан текущ ремонт или проверка.",
    fixed: "Маркиран е като поправен.",
    closed: "Затворен е без активен следващ етап."
  },
  en: {
    unverified: "The report is published but not yet independently verified.",
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
  bg: {
    municipal_budget: "Общински бюджет",
    municipal_capital: "Капиталова програма (общинска)",
    state_subsidy: "Целева държавна субсидия",
    eu_program: "Европейска програма"
  },
  en: {
    municipal_budget: "Municipal budget",
    municipal_capital: "Municipal capital programme",
    state_subsidy: "State targeted subsidy",
    eu_program: "EU programme"
  }
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
