// Central multilingual string dictionary for Open Plovdiv. `bg` is the source
// of truth for the shape; every other locale is typed against it (`typeof bg`)
// so the locales can never drift out of sync.

export const languages = {
  bg: "Български",
  en: "English",
  de: "Deutsch",
  fr: "Français",
  it: "Italiano",
  tr: "Türkçe",
  es: "Español"
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = "bg";

const bg = {
  site: {
    name: "Отворен Пловдив",
    short: "ОП",
    tagline:
      "Обществени проекти, публични средства и градски проблеми — представени ясно.",
    skip: "Към съдържанието",
    menu: "Меню",
    close: "Затвори",
    theme: "Светла / тъмна тема",
    langName: "Език",
    langSwitch: "Избор на език"
  },
  nav: {
    home: "Начало",
    history: "История",
    mayors: "Кметове",
    people: "Хора",
    places: "Места",
    stories: "Разкази",
    education: "Образование",
    overview: "Преглед",
    fixMap: "Карта",
    budget: "Бюджет",
    projects: "Проекти",
    community: "Доброволци",
    archive: "Архив",
    sources: "Източници"
  },
  overview: {
    eyebrow: "Графичен преглед",
    title: "Преглед в графики",
    lead:
      "Обобщен поглед върху проследяваните проекти и публичните средства за Пловдив — по статус, категория и година, с източници.",
    asOf: "Данни към юни 2026 г.",
    statProjects: "проследявани проекта",
    statPostponed: "отложени проекта",
    statCapital2025: "капиталова програма 2025",
    statCapital2026: "капиталова програма 2026 (прогнозна)",
    unitProjects: "Брой проследявани проекти",
    unitSharePercent: "Дял от капиталовата програма (%)",
    unitEur: "Суми в евро (€)",
    byStatusTitle: "Проекти по статус",
    byCategoryTitle: "Проекти по категория",
    byYearTitle: "Проекти по бюджетна година",
    sector2025Title: "Капиталова програма 2025 по сектори",
    funding2026Title: "Финансиране на капиталовата програма за 2026 г.",
    capitalTrendTitle: "Капиталова програма по години",
    capitalTrendNote:
      "Капиталова програма по години (в лева). Данните за 2013-2018 г. са от решения на Общинския съвет, а по-новите години са от официални страници и публични публикации. 2026 г. е прогнозна и е преизчислена от около 87 млн. евро по курс 1,95583 лв.",
    totalTrendTitle: "Общ бюджет на Пловдив по години",
    totalTrendNote:
      "Общ годишен бюджет на Община Пловдив (в лева). Архивът включва отчетено изпълнение за 2010 г. и приети бюджети за 2011-2018 г.; стойностите за 2020, 2022 и 2024 г. остават приблизителни/закръглени. Всяка година сочи към публичен източник.",
    historyNote:
      "Числата са от публични източници (бюджети на общината и медийни публикации). Сверявайте с оригиналните документи, преди да цитирате конкретна стойност.",
    year2025: "2025 г.",
    year2026: "2026 г. (прогнозно)",
    sourcesNote: "Всички стойности са с публични източници.",
    viewBudget: "Към бюджета",
    viewProjects: "Към проектите"
  },
  footer: {
    blurb:
      "Нестопански проект с обществени данни за Пловдив. Без профили, без коментари, без база данни.",
    explore: "Разглеждане",
    civic: "Граждански данни",
    about: "За проекта",
    privacy: "Поверителност",
    moderation: "Модерация",
    community: "Доброволци",
    methodology: "Методология",
    sources: "Източници",
    note: "Open Plovdiv · обществени данни за Пловдив",
    dataNote: "Данни от публични източници · актуални към юни 2026 г.",
    rights: "Обществени данни"
  },
  common: {
    all: "Всички",
    accessed: "достъп",
    source: "Източник",
    loading: "Зареждане…",
    error: "Възникна грешка.",
    backHome: "Към началото",
    noSource: "Няма публичен източник."
  },
  home: {
    eyebrow: "Един от най-старите градове в света",
    lead:
      "Пловдив е жив от над 8000 години. Тракийска Евмолпия, Филипопол на Филип II Македонски, римски Тримонциум, османско Филибе — и градът на Съединението.",
    ctaHistory: "Разгледай хронологията",
    ctaMayors: "Кметовете на Пловдив",
    statYearsValue: "8000+",
    statYears: "години история",
    statEras: "епохи",
    statMayors: "кметове",
    statLandmarks: "забележителности",
    featuredTitle: "Моменти от историята",
    civicTitle: "Граждански данни за днешния град",
    civicLead:
      "Освен историята, Open Plovdiv поддържа и обществени данни за съвременния Пловдив — бюджет, проекти, граждански сигнали и доброволци, всяко с публичен източник.",
    ctaMap: "Виж картата на проблемите",
    ctaBudget: "Къде отиват местните данъци?",
    statsLabel: "Проследявани данни",
    statProjects: "проследявани проекта",
    statReportsValue: "На живо",
    statReports: "модерирани сигнали",
    statCommunity: "доброволчески инициативи",
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
    cardCommunityEyebrow: "Доброволци",
    cardCommunityTitle: "Граждански инициативи",
    cardCommunityText:
      "Групи и кампании, които организират почиствания, грижа за спирки, паркове и квартали.",
    cardArchiveEyebrow: "Архив",
    cardArchiveTitle: "Кметове и исторически данни",
    cardArchiveText:
      "Пълна вътрешна хронология на кметските мандати, стари финансови записи и градски програми.",
    cardMayorsEyebrow: "Кметове",
    cardMayorsTitle: "Всички кметове на Пловдив",
    cardMayorsText:
      "Подробна хронология от 1878 г. до действащия мандат, с търсене, векове и източници.",
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
  history: {
    eyebrow: "Хронология на града",
    title: "Историята на Пловдив",
    lead:
      "Над осем хилядолетия върху седем хълма — от тракийската Евмолпия и римския Тримонциум, през османското Филибе и Възраждането, до Съединението и наши дни.",
    timelineTitle: "Хронология",
    timelineLead:
      "Ключови моменти от историята на града, подредени по епохи. Всеки запис сочи към публичен източник.",
    erasTitle: "Епохите на Пловдив",
    erasNav: "Епохи",
    landmarksTitle: "Забележителности",
    landmarksLead:
      "Паметници, които разказват историята на града — от тракийската крепост до възрожденския Стар град.",
    mayorsTitle: "Кметовете на Пловдив",
    mayorsLead:
      "68 мандата от Освобождението до днес — подробна хронология с биографии и публични източници.",
    mayorsCta: "Виж всички кметове",
    sourceNote:
      "Историческите данни са обобщени от публични източници (Уикипедия и официални страници). Сверявайте с първоизточника, преди да цитирате конкретен факт.",
    statYears: "години история",
    statEras: "епохи",
    statLandmarks: "забележителности",
    eraLabels: {
      prehistory: "Праистория",
      thracian: "Тракийска епоха",
      roman: "Римски период",
      medieval: "Средновековие",
      ottoman: "Османски период",
      revival: "Възраждане",
      liberation: "Освобождение и Съединение",
      modern: "Нова история"
    },
    eraBlurbs: {
      prehistory: "Селища върху тепетата още от VI хилядолетие пр.н.е.",
      thracian: "Тракийската Евмолпия и Филипопол на Филип II Македонски.",
      roman: "Тримонциум — блестящ римски град с театър и стадион.",
      medieval: "Векове на сменящо се владение между България и Византия.",
      ottoman: "Пет века като Филибе — кръстопът на Балканите.",
      revival: "Българското просветно и църковно пробуждане.",
      liberation: "Освобождението, столица на Източна Румелия и Съединението.",
      modern: "Панаирният град и Европейска столица на културата."
    }
  },
  budget: {
    eyebrow: "Къде отиват местните данъци?",
    title: "Бюджет и капиталова програма",
    lead:
      "Бюджетът за 2025 г., прогнозната капиталова програма за 2026 г. и исторически архив за управлението на града — с ясно показани суми, дялове и публични източници.",
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
    historyTitle: "Исторически бюджетен архив",
    historyLead:
      "Добавени са приет бюджет за 2002 г., реализирани капиталови разходи за 2005-2007 г., отчет за 2010 г., приети бюджетни стойности назад до 2011 г. и капиталови програми от по-старите решения, когато са публикувани отделно.",
    totalHistoryTitle: "Общ бюджет и отчетено изпълнение",
    capitalHistoryTitle: "Капиталова програма",
    historyNote:
      "2008 г. е проектобюджет от вторичен източник и е маркирана като прогнозна/проектна стойност. 2005-2007 г. в капиталовата графика и 2010 г. в общата графика са отчетени/реализирани стойности, а не първоначално приети рамки. По-старите решения понякога са сканирани документи и различават делегирани, местни и капиталови разходи. Затова графиките са насочващ архив, а конкретна стойност трябва да се цитира от оригиналния документ.",
    executedShort: "отчет",
    provisionalShort: "проект",
    mayorsTitle: "Кой управлява града",
    mayorsLead:
      "Архивът включва официално публикуваните кметски мандати от 1878 г. насам и текущия кмет, проверен в Административния регистър.",
    mayorTermCount: "кметски мандата в архива",
    currentMayorLabel: "действащ кмет",
    recentMayorsTitle: "Последни мандати",
    earlyMayorsTitle: "Първи записи след Освобождението",
    fullMayorArchive: "Пълен списък на кметовете",
    eventsTitle: "Събития и програми",
    eventsLead:
      "Кратък архив на значими градски инициативи, които помагат да се свържат бюджетните години с публични програми и културни събития.",
    sourceLabel: "Източник"
  },
  archive: {
    eyebrow: "Исторически архив",
    title: "Кметове, бюджети и градски програми",
    lead:
      "Вътрешен архив на управлението на Пловдив: кметски мандати, исторически финансови записи, културни и социални програми, с видими източници.",
    statMayors: "кметски мандата",
    statFinance: "финансови исторически записи",
    statProgrammes: "програми и събития",
    statDocuments: "първични документа",
    currentMayor: "Действащ кмет",
    financeTitle: "Финансови архивни снимки",
    financeLead:
      "Номинални стойности от исторически източници. Старите левове не са директно сравними със съвременния BGN и са показани като архивни ориентири.",
    programmesTitle: "Какво е организирала общината",
    programmesLead:
      "Подбрани записи за социални, културни и управленски действия, които свързват хората начело на града с реални публични програми.",
    documentsTitle: "Първични документи",
    documentsLead:
      "Начален слой с кратки транскрибирани откъси от общински актове и Държавен вестник. Всеки откъс сочи към пълния публичен документ и свързани записи.",
    transcriptLabel: "Транскрибиран откъс",
    linkedRecords: "Свързани записи",
    documentTypes: {
      municipal_decision: "общинско решение",
      state_gazette_decree: "държавен акт",
      municipal_rule: "общински правилник",
      council_minutes: "протокол",
      period_press: "периодичен печат",
      other: "документ"
    },
    transcriptionTypes: {
      excerpt: "откъс",
      full: "пълен текст",
      diplomatic_excerpt: "дипломатичен откъс"
    },
    mayorsTitle: "Пълна хронология на кметовете",
    mayorsLead:
      "Списъкът е вътрешно копие на официалния архив на Община Пловдив, допълнен с текущия мандат от Административния регистър.",
    amountLabel: "Сума",
    yearLabel: "Година",
    sourceLabel: "Източник",
    noAmount: "без публикувана сума",
    viewBudget: "Към бюджетните графики"
  },
  mayors: {
    eyebrow: "Управление на града",
    title: "Всички кметове на Пловдив",
    lead:
      "Пълна хронология на кметските мандати от първия кмет след Освобождението през 1878 г. до действащия кмет през 2026 г.",
    sourceNote:
      "Основата е официалната страница „Кметове на Пловдив“ на Община Пловдив. Действащият мандат е добавен от Административния регистър, защото общинският исторически списък все още спира при мандата 2019-2023.",
    statTerms: "кметски мандата",
    statPeople: "различни личности",
    statYears: "години хронология",
    statCurrent: "действащ кмет",
    search: "Търсене",
    searchPlaceholder: "Име, година или период",
    century: "Век",
    status: "Статус",
    allCenturies: "Всички векове",
    allStatuses: "Всички",
    currentOnly: "Само действащ",
    actingOnly: "Само и.д. кметове",
    reset: "Изчисти филтрите",
    count: (n: number) => `${n} ${plural(n, "мандат", "мандата")}`,
    countFiltered: (visible: number, total: number) =>
      `${visible} от ${total} ${plural(total, "мандат", "мандата")}`,
    empty: "Няма мандати с избраните филтри.",
    timelineTitle: "Скролируема времева линия",
    timelineLead:
      "Плъзнете хоризонтално, за да минете през всички мандати. Подробният списък отдолу остава филтрируем.",
    detailsTitle: "Подробен списък",
    sourcesTitle: "Проверка на обхвата",
    sourcesText:
      "В локалния архив има всички 65 мандата от официалния общински списък плюс действащия мандат на Костадин Димитров.",
    termNumber: "Мандат",
    years: "Години",
    duration: "Прибл. продължителност",
    source: "Източник / повече информация",
    currentBadge: "Действащ",
    actingBadge: "и.д. кмет",
    officialArchive: "Официален списък",
    currentRegistry: "Административен регистър",
    yearsApprox: (n: number) => `${n} ${plural(n, "година", "години")}`,
    centuryLabel: (century: number) => `${century} век`,
    centuryRange: (start: number, end: number) => `${start}–${end}`,
    openSource: "Отвори източника",
    profile: "Профил",
    backToAll: "Към всички кметове",
    otherTerms: "Други мандати на същата личност",
    moreInfo: "Повече информация",
    biography: "Биография",
    imageCredit: "Кредит за изображение",
    officialProfile: "Официален източник",
    referenceSource: "Допълнителен източник",
    moreInfoLink: "Повече информация",
    wikipediaArticle: "Статия в Уикипедия",
    wikipediaSearch: "Търсене в Уикипедия",
    birthplaceLabel: "Месторождение",
    educationLabel: "Образование",
    rolesLabel: "Други длъжности",
    profileLinks: "Профил и връзки",
    connectionsTitle: "Връзки между кметовете",
    connectionsLead:
      "Кои кметове са управлявали по няколко пъти и кои са свързани роднински.",
    multiTermTitle: "Многомандатни кметове",
    familyTitle: "Родове и семейства",
    legendSame: "Същият кмет (повторен мандат)",
    legendFamily: "Роднинска връзка",
    legendKilled: "Убит",
    legendCurrent: "Действащ",
    fateHeading: "Съдба",
    fateLabels: {
      killed: "Убит",
      executed: "Екзекутиран",
      assassinated: "Убит при атентат",
      died_in_office: "Починал в длъжност"
    },
    portraitNote: "Историческите портрети са в обществено достояние.",
    portraitAlt: (name: string) => `Портрет на ${name}`,
    birthTitle: "Къде са родени кметовете",
    birthLead:
      "Родните места на проучените кметове, нанесени на картата. Щракнете върху точка, за да видите имената.",
    birthByTown: "Родни места по брой кметове",
    birthStatTowns: "населени места",
    birthStatCountries: "държави",
    birthPopupMayors: "Кметове",
    prevTerm: "Предишен",
    nextTerm: "Следващ"
  },
  projects: {
    eyebrow: "Публични проекти",
    title: "Проекти",
    lead:
      "Търсете по заглавие и филтрирайте по категория, статус и година. Всеки проект има отделна страница.",
    dataNotice:
      "Няма публикуван единен официален списък „завършени през 2025 г.“. Затова проектите са означени само според източника: започнал/очаква финансиране през 2026 г., нов за 2026 г. или отложен с 0 лв. за 2025-2026 г.",
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
  community: {
    eyebrow: "Гражданско участие",
    title: "Доброволчески инициативи",
    lead:
      "Реални пловдивски групи и кампании, които организират доброволци за почистване, обновяване и грижа за публични места.",
    dataNotice:
      "Записите са открити чрез AI търсене в публични източници или са добавени от администратор. Всяка инициатива трябва да има видими линкове към група, сайт или публикация, за да не изглежда като официален общински проект без източник.",
    search: "Търсене",
    searchPlaceholder: "Напр. спирки, Марица, Лаута",
    category: "Категория",
    status: "Статус",
    organizer: "Организатор",
    links: "Връзки",
    sources: "Източници",
    relatedProjects: "Свързани публични проекти",
    noRelatedProjects: "Няма свързан публичен проект.",
    discovered: "Намерено чрез",
    lastChecked: "Последна проверка",
    viewSource: "Източник",
    contact: "Контакт / група",
    reset: "Изчисти филтрите",
    count: (n: number) => `${n} ${plural(n, "инициатива", "инициативи")}`,
    countFiltered: (visible: number, total: number) =>
      `${visible} от ${total} ${plural(total, "инициатива", "инициативи")}`,
    empty: "Няма инициативи с избраните филтри.",
    adminCta: "Админ: добави или провери инициатива",
    seeProblems: "Виж проблеми, с които можеш да помогнеш",
    donate: "Дарете на организацията",
    acceptsDonations: "Приема дарения",
    donationsFilter: "Само приемащи дарения",
    donationDisclaimer: "Open Plovdiv не приема и не обработва дарения. Връзките „Дарете“ водят директно към сайтовете на самите организации."
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
    communityInitiatives: "Доброволчески инициативи",
    communityInitiativesText:
      "Граждански групи или кампании, които са свързани с тази зона или тема. Това не е официален статус на проекта.",
    noCommunityInitiatives: "Няма свързана доброволческа инициатива.",
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
  civic: {
    title: "Как можете да помогнете",
    lead:
      "Различните проблеми изискват различни действия. Някои са отговорност на общината, други могат да бъдат подобрени и от граждани и доброволци.",
    trackOfficial: "Изисква официална намеса",
    trackOfficialText:
      "Опасни пътища, осветление, отводняване и инфраструктурни ремонти трябва да се поемат от общината или съответната институция.",
    trackCivic: "Подходящо за гражданско участие",
    trackCivicText:
      "Почистване на отпадъци, малки зелени подобрения, картографиране на пречки за достъпност и документиране могат да се организират от граждани и групи.",
    trackBoth: "Споделена отговорност",
    whatYouCanDo: "Какво можете да направите",
    actReportOfficial: "Подайте сигнал до общината",
    actJoinGroup: "Включете се в гражданска група",
    actAddReport: "Отбележете проблема на картата",
    actDocument: "Помогнете с документиране и снимки",
    actFollow: "Следете развитието",
    groupsTitle: "Групи, които могат да помогнат",
    noGroups: "Все още няма вписана група за тази категория.",
    seeAllGroups: "Вижте всички доброволчески групи"
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
      "AI търси публични източници, извлича проектни и бюджетни записи и ги проверява срещу схеми, URL адреси, суми и координати преди публикуване. Източниците остават видими, защото AI може да сгреши.",
    collectTitle: "AI търсене",
    collectText:
      "AI намира и сравнява публични източници — бюджета и решенията на Община Пловдив, капиталовата програма и местни медии — и добавя към всеки запис линк към използвания източник.",
    verifyTitle: "AI проверка",
    verifyText:
      "AI извлича и сверява полета, статуси, URL адреси, суми, години, координати и липса на лични данни в сигналите. След това JSON схемите валидират структурата преди билд.",
    aiTitle: "AI",
    aiText:
      "Търсенето, обобщаването и проверката се извършват от AI. Когато източникът не публикува сума, статус или завършване, сайтът трябва да го показва като липсващи или прогнозни данни, а не да го измисля.",
    correctTitle: "Корекции",
    correctText:
      "Корекцията трябва да добави или смени публичен източник, да обнови curated JSON и да мине през автоматична валидация и билд."
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
    kind: "Тип запис",
    kindFix: "Градски сигнал",
    kindHistory: "Исторически принос",
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
  },
  adminCommunity: {
    title: "Доброволчески инициативи",
    lead:
      "Добавяне и обновяване на реални граждански групи и доброволчески кампании с публични линкове.",
    tokenLabel: "Администраторски ключ",
    tokenPlaceholder: "Въведете ключ",
    signIn: "Вход",
    signOut: "Изход",
    authError: "Невалиден ключ.",
    refresh: "Опресни",
    discoveryTitle: "AI/онлайн търсене",
    discoveryLead:
      "Потърсете публични страници и публикации. Резултатът само предлага източници; администраторът избира какво да запази.",
    queryLabel: "Търсене",
    queryPlaceholder: "Напр. доброволци почистване спирки Пловдив",
    find: "Намери онлайн",
    sourceUrl: "URL на източник",
    inspectUrl: "Провери URL",
    noCandidates: "Няма намерени резултати.",
    useCandidate: "Използвай като източник",
    formTitle: "Добави или обнови инициатива",
    id: "ID (по избор)",
    titleBg: "Заглавие (BG)",
    titleEn: "Заглавие (EN)",
    summaryBg: "Описание (BG)",
    summaryEn: "Описание (EN, по избор)",
    category: "Категория",
    status: "Статус",
    organizerBg: "Организатор (BG)",
    organizerEn: "Организатор (EN, по избор)",
    organizerType: "Тип организатор",
    website: "Уебсайт",
    facebook: "Facebook",
    donationUrl: "Връзка за дарение (по избор)",
    callToActionBg: "Призив (BG, по избор)",
    callToActionEn: "Призив (EN, по избор)",
    addressBg: "Адрес/район (BG)",
    addressEn: "Адрес/район (EN, по избор)",
    latitude: "Ширина",
    longitude: "Дължина",
    relatedProjects: "Свързани project ID-та (разделени със запетая)",
    tags: "Тагове (разделени със запетая)",
    sourceTitle: "Заглавие на източник",
    sourceUrlLabel: "Линк към източник",
    save: "Запази инициатива",
    saved: "Инициативата е запазена.",
    existingTitle: "Записани инициативи",
    noExisting: "Няма записани инициативи.",
    edit: "Редактирай",
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
    skip: "Skip to content",
    menu: "Menu",
    close: "Close",
    theme: "Light / dark theme",
    langName: "Language",
    langSwitch: "Choose language"
  },
  nav: {
    home: "Home",
    history: "History",
    mayors: "Mayors",
    people: "People",
    places: "Places",
    stories: "Stories",
    education: "Education",
    overview: "Overview",
    fixMap: "Map",
    budget: "Budget",
    projects: "Projects",
    community: "Volunteers",
    archive: "Archive",
    sources: "Sources"
  },
  overview: {
    eyebrow: "Visual overview",
    title: "Overview in charts",
    lead:
      "A summary view of the tracked projects and public money for Plovdiv — by status, category and year, with sources.",
    asOf: "Data as of June 2026",
    statProjects: "tracked projects",
    statPostponed: "postponed projects",
    statCapital2025: "2025 capital programme",
    statCapital2026: "2026 capital programme (provisional)",
    unitProjects: "Number of tracked projects",
    unitSharePercent: "Share of the capital programme (%)",
    unitEur: "Amounts in euro (€)",
    byStatusTitle: "Projects by status",
    byCategoryTitle: "Projects by category",
    byYearTitle: "Projects by budget year",
    sector2025Title: "2025 capital programme by sector",
    funding2026Title: "2026 capital programme funding",
    capitalTrendTitle: "Capital programme by year",
    capitalTrendNote:
      "Capital programme by year (in BGN). The 2013-2018 figures come from Municipal Council decisions; newer years use official pages and public reports. 2026 is provisional and converted from about EUR 87M at 1.95583.",
    totalTrendTitle: "Plovdiv total budget by year",
    totalTrendNote:
      "Plovdiv Municipality's total annual budget (in BGN). The archive includes executed 2010 figures and adopted budgets for 2011-2018; 2020, 2022 and 2024 remain approximate/rounded. Every year links to a public source.",
    historyNote:
      "Figures come from public sources (municipal budgets and media reports). Verify against the original documents before quoting a specific value.",
    year2025: "2025",
    year2026: "2026 (provisional)",
    sourcesNote: "All values have public sources.",
    viewBudget: "Go to budget",
    viewProjects: "Go to projects"
  },
  footer: {
    blurb:
      "A non-profit public-data project for Plovdiv. No accounts, no comments, no database.",
    explore: "Explore",
    civic: "Civic data",
    about: "About",
    privacy: "Privacy",
    moderation: "Moderation",
    community: "Volunteers",
    methodology: "Methodology",
    sources: "Sources",
    note: "Open Plovdiv · public data for Plovdiv",
    dataNote: "Data from public sources · updated June 2026.",
    rights: "Public data"
  },
  common: {
    all: "All",
    accessed: "accessed",
    source: "Source",
    loading: "Loading…",
    error: "Something went wrong.",
    backHome: "Back to home",
    noSource: "No public source."
  },
  home: {
    eyebrow: "One of the oldest cities in the world",
    lead:
      "Plovdiv has been alive for over 8,000 years. Thracian Eumolpias, Philip II of Macedon's Philippopolis, Roman Trimontium, Ottoman Filibe — and the city of the Unification.",
    ctaHistory: "Explore the timeline",
    ctaMayors: "The mayors of Plovdiv",
    statYearsValue: "8000+",
    statYears: "years of history",
    statEras: "eras",
    statMayors: "mayors",
    statLandmarks: "landmarks",
    featuredTitle: "Moments from history",
    civicTitle: "Civic data on the city today",
    civicLead:
      "Beyond history, Open Plovdiv also keeps public data on the modern city — budget, projects, citizen reports and volunteers, each with a public source.",
    ctaMap: "Open the problem map",
    ctaBudget: "Where do local taxes go?",
    statsLabel: "Tracked data",
    statProjects: "tracked projects",
    statReportsValue: "Live",
    statReports: "moderated reports",
    statCommunity: "volunteer initiatives",
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
    cardCommunityEyebrow: "Volunteers",
    cardCommunityTitle: "Civic initiatives",
    cardCommunityText:
      "Groups and campaigns organising cleanups, bus-stop care, parks and neighbourhood work.",
    cardArchiveEyebrow: "Archive",
    cardArchiveTitle: "Mayors and historical data",
    cardArchiveText:
      "A full internal timeline of mayoral terms, old finance records and city programmes.",
    cardMayorsEyebrow: "Mayors",
    cardMayorsTitle: "Every mayor of Plovdiv",
    cardMayorsText:
      "Detailed chronology from 1878 to the incumbent term, with search, centuries and sources.",
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
  history: {
    eyebrow: "The city's timeline",
    title: "The history of Plovdiv",
    lead:
      "Over eight millennia on seven hills — from Thracian Eumolpias and Roman Trimontium, through Ottoman Filibe and the National Revival, to the Unification and the present day.",
    timelineTitle: "Timeline",
    timelineLead:
      "Key moments in the city's history, arranged by era. Every entry links to a public source.",
    erasTitle: "The eras of Plovdiv",
    erasNav: "Eras",
    landmarksTitle: "Landmarks",
    landmarksLead:
      "Monuments that tell the city's story — from the Thracian citadel to the Revival-era Old Town.",
    mayorsTitle: "The mayors of Plovdiv",
    mayorsLead:
      "68 terms from the Liberation to today — a detailed chronology with biographies and public sources.",
    mayorsCta: "See all mayors",
    sourceNote:
      "The historical data is summarised from public sources (Wikipedia and official pages). Check the original source before quoting a specific fact.",
    statYears: "years of history",
    statEras: "eras",
    statLandmarks: "landmarks",
    eraLabels: {
      prehistory: "Prehistory",
      thracian: "Thracian era",
      roman: "Roman period",
      medieval: "Middle Ages",
      ottoman: "Ottoman period",
      revival: "National Revival",
      liberation: "Liberation & Unification",
      modern: "Modern era"
    },
    eraBlurbs: {
      prehistory: "Settlements on the hills as early as the 6th millennium BC.",
      thracian: "Thracian Eumolpias and Philip II of Macedon's Philippopolis.",
      roman: "Trimontium — a brilliant Roman city with a theatre and stadium.",
      medieval: "Centuries of control alternating between Bulgaria and Byzantium.",
      ottoman: "Five centuries as Filibe — a crossroads of the Balkans.",
      revival: "The Bulgarian educational and church awakening.",
      liberation: "Liberation, the capital of Eastern Rumelia and the Unification.",
      modern: "The fair city and a European Capital of Culture."
    }
  },
  budget: {
    eyebrow: "Where do local taxes go?",
    title: "Budget and capital programme",
    lead:
      "The 2025 budget, provisional 2026 capital programme and historical archive of city governance — with clearly shown amounts, shares and public sources.",
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
    historyTitle: "Historical budget archive",
    historyLead:
      "The archive now includes the adopted 2002 budget, executed capital expenditure for 2005-2007, 2010 execution, adopted budget totals back to 2011 and older capital-programme figures where decisions publish them separately.",
    totalHistoryTitle: "Total budget and execution",
    capitalHistoryTitle: "Capital programme",
    historyNote:
      "2008 is a draft-budget value from a secondary source and is marked as provisional/draft. The 2005-2007 capital chart values and the 2010 total chart value are executed figures, not initially adopted envelopes. Older decisions are sometimes scanned documents and separate delegated, local and capital spending differently. Treat the charts as a navigable archive and quote exact figures from the original document.",
    executedShort: "exec.",
    provisionalShort: "draft",
    mayorsTitle: "Who governed the city",
    mayorsLead:
      "The archive includes officially published mayoral terms since 1878 and the current mayor checked against the Bulgarian Administrative Register.",
    mayorTermCount: "mayoral terms in the archive",
    currentMayorLabel: "incumbent mayor",
    recentMayorsTitle: "Recent terms",
    earlyMayorsTitle: "First post-Liberation records",
    fullMayorArchive: "Full mayor archive",
    eventsTitle: "Events and programmes",
    eventsLead:
      "A short archive of notable city initiatives that helps connect budget years with public programmes and cultural events.",
    sourceLabel: "Source"
  },
  archive: {
    eyebrow: "Historical archive",
    title: "Mayors, budgets and city programmes",
    lead:
      "An internal archive of Plovdiv governance: mayoral terms, historical finance records, cultural and social programmes, with visible sources.",
    statMayors: "mayoral terms",
    statFinance: "historical finance records",
    statProgrammes: "programmes and events",
    statDocuments: "primary documents",
    currentMayor: "Incumbent mayor",
    financeTitle: "Financial archive snapshots",
    financeLead:
      "Nominal values from historical sources. Old lev amounts are not directly comparable with modern BGN and are shown as archival markers.",
    programmesTitle: "What the municipality organised",
    programmesLead:
      "Selected records for social, cultural and governance actions that connect city leaders with real public programmes.",
    documentsTitle: "Primary documents",
    documentsLead:
      "A starter layer of short transcribed excerpts from municipal acts and the State Gazette. Each excerpt points to the full public document and linked records.",
    transcriptLabel: "Transcribed excerpt",
    linkedRecords: "Linked records",
    documentTypes: {
      municipal_decision: "municipal decision",
      state_gazette_decree: "state decree",
      municipal_rule: "municipal rule",
      council_minutes: "minutes",
      period_press: "period press",
      other: "document"
    },
    transcriptionTypes: {
      excerpt: "excerpt",
      full: "full text",
      diplomatic_excerpt: "diplomatic excerpt"
    },
    mayorsTitle: "Full mayoral chronology",
    mayorsLead:
      "This is an internal copy of Plovdiv Municipality's official archive, supplemented with the incumbent term from the Administrative Register.",
    amountLabel: "Amount",
    yearLabel: "Year",
    sourceLabel: "Source",
    noAmount: "no published amount",
    viewBudget: "Open budget charts"
  },
  mayors: {
    eyebrow: "City governance",
    title: "Every mayor of Plovdiv",
    lead:
      "A complete chronology of mayoral terms from the first post-Liberation mayor in 1878 to the incumbent mayor in 2026.",
    sourceNote:
      "The base is Plovdiv Municipality's official “Mayors of Plovdiv” page. The incumbent term is added from Bulgaria's Administrative Register because the municipal historical list still stops at the 2019-2023 term.",
    statTerms: "mayoral terms",
    statPeople: "different people",
    statYears: "years covered",
    statCurrent: "incumbent mayor",
    search: "Search",
    searchPlaceholder: "Name, year or period",
    century: "Century",
    status: "Status",
    allCenturies: "All centuries",
    allStatuses: "All",
    currentOnly: "Incumbent only",
    actingOnly: "Acting mayors only",
    reset: "Clear filters",
    count: (n: number) => `${n} ${plural(n, "term", "terms")}`,
    countFiltered: (visible: number, total: number) =>
      `${visible} of ${total} ${plural(total, "term", "terms")}`,
    empty: "No terms match the selected filters.",
    timelineTitle: "Scrollable timeline",
    timelineLead:
      "Scroll horizontally to move through every term. The detailed list below remains filterable.",
    detailsTitle: "Detailed list",
    sourcesTitle: "Coverage check",
    sourcesText:
      "The local archive contains all 65 terms from the official municipal list plus the incumbent term of Kostadin Dimitrov.",
    termNumber: "Term",
    years: "Years",
    duration: "Approx. duration",
    source: "Source / more information",
    currentBadge: "Incumbent",
    actingBadge: "Acting mayor",
    officialArchive: "Official list",
    currentRegistry: "Administrative Register",
    yearsApprox: (n: number) => `${n} ${plural(n, "year", "years")}`,
    centuryLabel: (century: number) => {
      const mod10 = century % 10;
      const mod100 = century % 100;
      const suffix = mod10 === 1 && mod100 !== 11 ? "st" : mod10 === 2 && mod100 !== 12 ? "nd" : mod10 === 3 && mod100 !== 13 ? "rd" : "th";
      return `${century}${suffix} century`;
    },
    centuryRange: (start: number, end: number) => `${start}–${end}`,
    openSource: "Open source",
    profile: "Profile",
    backToAll: "Back to all mayors",
    otherTerms: "Other terms by the same person",
    moreInfo: "More information",
    biography: "Biography",
    imageCredit: "Image credit",
    officialProfile: "Official source",
    referenceSource: "Additional source",
    moreInfoLink: "More information",
    wikipediaArticle: "Wikipedia article",
    wikipediaSearch: "Search Wikipedia",
    birthplaceLabel: "Birthplace",
    educationLabel: "Education",
    rolesLabel: "Other roles held",
    profileLinks: "Profile and links",
    connectionsTitle: "Connections between the mayors",
    connectionsLead:
      "Which mayors served more than once and which are related by family.",
    multiTermTitle: "Multi-term mayors",
    familyTitle: "Families & dynasties",
    legendSame: "Same mayor (repeat term)",
    legendFamily: "Family tie",
    legendKilled: "Killed",
    legendCurrent: "Incumbent",
    fateHeading: "Fate",
    fateLabels: {
      killed: "Killed",
      executed: "Executed",
      assassinated: "Assassinated",
      died_in_office: "Died in office"
    },
    portraitNote: "The historical portraits are in the public domain.",
    portraitAlt: (name: string) => `Portrait of ${name}`,
    birthTitle: "Where the mayors were born",
    birthLead:
      "The birthplaces of the documented mayors, mapped. Click a point to see the names.",
    birthByTown: "Birthplaces by number of mayors",
    birthStatTowns: "birth towns",
    birthStatCountries: "countries",
    birthPopupMayors: "Mayors",
    prevTerm: "Previous",
    nextTerm: "Next"
  },
  projects: {
    eyebrow: "Public projects",
    title: "Projects",
    lead:
      "Search by title and filter by category, status and year. Each project has its own page.",
    dataNotice:
      "There is no single official public list of projects completed in 2025. Projects are therefore labelled only according to the available source: started/expected 2026 funding, new for 2026, or postponed with BGN 0 for 2025-2026.",
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
  community: {
    eyebrow: "Civic participation",
    title: "Volunteer initiatives",
    lead:
      "Real Plovdiv groups and campaigns organising volunteers for cleaning, renewal and care of public places.",
    dataNotice:
      "Records are discovered through AI search of public sources or added by an admin. Every initiative must keep visible links to a group, website or public post so it is not mistaken for an unsourced official municipal project.",
    search: "Search",
    searchPlaceholder: "e.g. stops, Maritsa, Lauta",
    category: "Category",
    status: "Status",
    organizer: "Organizer",
    links: "Links",
    sources: "Sources",
    relatedProjects: "Related public projects",
    noRelatedProjects: "No related public project.",
    discovered: "Discovered by",
    lastChecked: "Last checked",
    viewSource: "Source",
    contact: "Contact / group",
    reset: "Clear filters",
    count: (n: number) => `${n} ${plural(n, "initiative", "initiatives")}`,
    countFiltered: (visible: number, total: number) =>
      `${visible} of ${total} ${plural(total, "initiative", "initiatives")}`,
    empty: "No initiatives match the selected filters.",
    adminCta: "Admin: add or verify initiative",
    seeProblems: "See problems you can help with",
    donate: "Donate to the organisation",
    acceptsDonations: "Accepts donations",
    donationsFilter: "Only accepting donations",
    donationDisclaimer: "Open Plovdiv does not accept or process donations. The “Donate” links go directly to the organisations' own pages."
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
    communityInitiatives: "Volunteer initiatives",
    communityInitiativesText:
      "Civic groups or campaigns related to this area or theme. This is not an official project status.",
    noCommunityInitiatives: "No related volunteer initiative.",
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
  civic: {
    title: "How you can help",
    lead:
      "Different problems need different actions. Some are the municipality's responsibility; others can also be improved by citizens and volunteers.",
    trackOfficial: "Requires official action",
    trackOfficialText:
      "Dangerous roads, lighting, drainage and infrastructure repairs must be handled by the municipality or the responsible institution.",
    trackCivic: "Open to civic participation",
    trackCivicText:
      "Litter clean-ups, small green improvements, mapping accessibility barriers and documenting can be organised by citizens and groups.",
    trackBoth: "Shared responsibility",
    whatYouCanDo: "What you can do",
    actReportOfficial: "Report it to the municipality",
    actJoinGroup: "Join a citizen group",
    actAddReport: "Mark the problem on the map",
    actDocument: "Help document it with photos",
    actFollow: "Follow progress",
    groupsTitle: "Groups that can help",
    noGroups: "No group is listed for this category yet.",
    seeAllGroups: "See all volunteer groups"
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
      "AI searches public sources, extracts project and budget records, and checks them against schemas, URLs, amounts and coordinates before publication. Sources stay visible because AI can still be wrong.",
    collectTitle: "AI search",
    collectText:
      "AI finds and compares public sources — Plovdiv Municipality's budget and decisions, the capital programme and local media — and each record includes a link to the source used.",
    verifyTitle: "AI verification",
    verifyText:
      "AI extracts and checks fields, statuses, URLs, amounts, years, coordinates and the absence of personal data in reports. JSON schemas then validate structure before the build.",
    aiTitle: "AI",
    aiText:
      "Search, summarisation and verification are performed by AI. When a source does not publish an amount, status or completion record, the site must show that as missing or provisional data instead of inventing it.",
    correctTitle: "Corrections",
    correctText:
      "A correction must add or change a public source, update the curated JSON and pass automated validation and build."
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
    kind: "Record type",
    kindFix: "Fix report",
    kindHistory: "Historical contribution",
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
  },
  adminCommunity: {
    title: "Volunteer initiatives",
    lead:
      "Add and update real civic groups and volunteer campaigns with public links.",
    tokenLabel: "Admin token",
    tokenPlaceholder: "Enter token",
    signIn: "Sign in",
    signOut: "Sign out",
    authError: "Invalid token.",
    refresh: "Refresh",
    discoveryTitle: "AI/online search",
    discoveryLead:
      "Search public pages and posts. Results only suggest sources; an admin chooses what to save.",
    queryLabel: "Search",
    queryPlaceholder: "e.g. Plovdiv volunteers cleaning bus stops",
    find: "Find online",
    sourceUrl: "Source URL",
    inspectUrl: "Inspect URL",
    noCandidates: "No results found.",
    useCandidate: "Use as source",
    formTitle: "Add or update initiative",
    id: "ID (optional)",
    titleBg: "Title (BG)",
    titleEn: "Title (EN)",
    summaryBg: "Summary (BG)",
    summaryEn: "Summary (EN, optional)",
    category: "Category",
    status: "Status",
    organizerBg: "Organizer (BG)",
    organizerEn: "Organizer (EN, optional)",
    organizerType: "Organizer type",
    website: "Website",
    facebook: "Facebook",
    donationUrl: "Donation link (optional)",
    callToActionBg: "Call to action (BG, optional)",
    callToActionEn: "Call to action (EN, optional)",
    addressBg: "Address/area (BG)",
    addressEn: "Address/area (EN, optional)",
    latitude: "Latitude",
    longitude: "Longitude",
    relatedProjects: "Related project IDs (comma-separated)",
    tags: "Tags (comma-separated)",
    sourceTitle: "Source title",
    sourceUrlLabel: "Source link",
    save: "Save initiative",
    saved: "Initiative saved.",
    existingTitle: "Saved initiatives",
    noExisting: "No saved initiatives.",
    edit: "Edit",
    loading: "Loading…",
    actionError: "The action failed."
  }
};

const de: typeof bg = {
  site: {
    name: "Open Plovdiv",
    short: "OP",
    tagline:
      "Öffentliche Projekte, öffentliche Gelder, öffentliche Probleme — verständlich aufbereitet.",
    skip: "Zum Inhalt springen",
    menu: "Menü",
    close: "Schließen",
    theme: "Helles / dunkles Thema",
    langName: "Sprache",
    langSwitch: "Sprache wählen"
  },
  nav: {
    home: "Start",
    history: "Geschichte",
    mayors: "Bürgermeister",
    people: "Personen",
    places: "Orte",
    stories: "Geschichten",
    education: "Bildung",
    overview: "Überblick",
    fixMap: "Karte",
    budget: "Haushalt",
    projects: "Projekte",
    community: "Freiwillige",
    archive: "Archiv",
    sources: "Quellen"
  },
  overview: {
    eyebrow: "Visueller Überblick",
    title: "Überblick in Diagrammen",
    lead:
      "Eine zusammenfassende Ansicht der erfassten Projekte und öffentlichen Gelder für Plovdiv — nach Status, Kategorie und Jahr, mit Quellen.",
    asOf: "Daten Stand Juni 2026",
    statProjects: "erfasste Projekte",
    statPostponed: "verschobene Projekte",
    statCapital2025: "Investitionsprogramm 2025",
    statCapital2026: "Investitionsprogramm 2026 (vorläufig)",
    unitProjects: "Anzahl erfasster Projekte",
    unitSharePercent: "Anteil am Investitionsprogramm (%)",
    unitEur: "Beträge in Euro (€)",
    byStatusTitle: "Projekte nach Status",
    byCategoryTitle: "Projekte nach Kategorie",
    byYearTitle: "Projekte nach Haushaltsjahr",
    sector2025Title: "Investitionsprogramm 2025 nach Sektor",
    funding2026Title: "Finanzierung des Investitionsprogramms 2026",
    capitalTrendTitle: "Investitionsprogramm nach Jahr",
    capitalTrendNote:
      "Investitionsprogramm nach Jahr (in BGN). Die Werte für 2013-2018 stammen aus Beschlüssen des Gemeinderats; neuere Jahre nutzen offizielle Seiten und öffentliche Berichte. 2026 ist vorläufig und aus etwa 87 Mio. EUR zum Kurs 1,95583 umgerechnet.",
    totalTrendTitle: "Gesamthaushalt von Plovdiv nach Jahr",
    totalTrendNote:
      "Der jährliche Gesamthaushalt der Gemeinde Plovdiv (in BGN). Das Archiv enthält die ausgeführten Zahlen für 2010 und die beschlossenen Haushalte für 2011-2018; 2020, 2022 und 2024 bleiben näherungsweise/gerundet. Jedes Jahr verweist auf eine öffentliche Quelle.",
    historyNote:
      "Die Zahlen stammen aus öffentlichen Quellen (Gemeindehaushalte und Medienberichte). Prüfen Sie die Originaldokumente, bevor Sie einen konkreten Wert zitieren.",
    year2025: "2025",
    year2026: "2026 (vorläufig)",
    sourcesNote: "Alle Werte haben öffentliche Quellen.",
    viewBudget: "Zum Haushalt",
    viewProjects: "Zu den Projekten"
  },
  footer: {
    blurb:
      "Ein gemeinnütziges Projekt mit öffentlichen Daten für Plovdiv. Keine Konten, keine Kommentare, keine Datenbank.",
    explore: "Entdecken",
    civic: "Bürgerdaten",
    about: "Über das Projekt",
    privacy: "Datenschutz",
    moderation: "Moderation",
    community: "Freiwillige",
    methodology: "Methodik",
    sources: "Quellen",
    note: "Open Plovdiv · öffentliche Daten für Plovdiv",
    dataNote: "Daten aus öffentlichen Quellen · aktualisiert Juni 2026.",
    rights: "Öffentliche Daten"
  },
  common: {
    all: "Alle",
    accessed: "abgerufen",
    source: "Quelle",
    loading: "Wird geladen…",
    error: "Etwas ist schiefgelaufen.",
    backHome: "Zurück zur Startseite",
    noSource: "Keine öffentliche Quelle."
  },
  home: {
    eyebrow: "Eine der ältesten Städte der Welt",
    lead:
      "Plovdiv lebt seit über 8.000 Jahren. Das thrakische Eumolpia, das Philippopolis von Philipp II. von Makedonien, das römische Trimontium, das osmanische Filibe — und die Stadt der Vereinigung.",
    ctaHistory: "Die Zeitleiste erkunden",
    ctaMayors: "Die Bürgermeister von Plovdiv",
    statYearsValue: "8000+",
    statYears: "Jahre Geschichte",
    statEras: "Epochen",
    statMayors: "Bürgermeister",
    statLandmarks: "Wahrzeichen",
    featuredTitle: "Momente aus der Geschichte",
    civicTitle: "Bürgerdaten zur heutigen Stadt",
    civicLead:
      "Über die Geschichte hinaus führt Open Plovdiv auch öffentliche Daten zur heutigen Stadt — Haushalt, Projekte, Bürgermeldungen und Freiwillige, jeweils mit öffentlicher Quelle.",
    ctaMap: "Die Problemkarte öffnen",
    ctaBudget: "Wohin fließen die kommunalen Steuern?",
    statsLabel: "Erfasste Daten",
    statProjects: "erfasste Projekte",
    statReportsValue: "Live",
    statReports: "moderierte Meldungen",
    statCommunity: "Freiwilligeninitiativen",
    statBudget: "Haushaltssektoren",
    statTotal: "Investitionsprogramm 2025",
    exploreTitle: "Wo anfangen",
    cardMapEyebrow: "Karte",
    cardMapTitle: "Problemkarte",
    cardMapText:
      "Sehen Sie veröffentlichte Bürgermeldungen nach Kategorie und Status, mit nahegelegenen öffentlichen Projekten.",
    cardBudgetEyebrow: "Haushalt",
    cardBudgetTitle: "Kommunale Steuern",
    cardBudgetText:
      "Haushalt 2025 und vorläufiges Investitionsprogramm 2026 — Beträge, Anteile und öffentliche Quellen.",
    cardProjectsEyebrow: "Projekte",
    cardProjectsTitle: "Öffentliche Projekte",
    cardProjectsText:
      "Durchsuchen und filtern Sie Projektdatensätze mit Budget, Status und Quellen.",
    cardCommunityEyebrow: "Freiwillige",
    cardCommunityTitle: "Bürgerinitiativen",
    cardCommunityText:
      "Gruppen und Kampagnen, die Aufräumaktionen, Haltestellenpflege, Parks und Stadtteilarbeit organisieren.",
    cardArchiveEyebrow: "Archiv",
    cardArchiveTitle: "Bürgermeister und historische Daten",
    cardArchiveText:
      "Eine vollständige interne Zeitleiste der Amtszeiten, alter Finanzdaten und städtischer Programme.",
    cardMayorsEyebrow: "Bürgermeister",
    cardMayorsTitle: "Jeder Bürgermeister von Plovdiv",
    cardMayorsText:
      "Detaillierte Chronologie von 1878 bis zur aktuellen Amtszeit, mit Suche, Jahrhunderten und Quellen.",
    latestProjects: "Kürzlich aktualisierte Projekte",
    latestReports: "Kürzlich hinzugefügte Meldungen",
    liveReportsTitle: "Echte Meldungen nach Moderation",
    liveReportsText:
      "Die Karte zeigt jetzt nur Bürgermeldungen, die über das Formular eingereicht und von einem Moderator freigegeben wurden.",
    viewAll: "Alle ansehen",
    noticeTitle: "Daten und Quellen",
    notice:
      "Die Daten haben den Stand Juni 2026. Der Haushalt 2025 ist beschlossen, das Investitionsprogramm 2026 ist vorläufig. Jeder Datensatz verweist auf eine öffentliche Quelle.",
    noticeSources: "Die Quellen ansehen",
    noticeMethodology: "die Methodik"
  },
  history: {
    eyebrow: "Die Zeitleiste der Stadt",
    title: "Die Geschichte von Plovdiv",
    lead:
      "Über acht Jahrtausende auf sieben Hügeln — vom thrakischen Eumolpia und römischen Trimontium über das osmanische Filibe und die Nationale Wiedergeburt bis zur Vereinigung und Gegenwart.",
    timelineTitle: "Zeitleiste",
    timelineLead:
      "Schlüsselmomente der Stadtgeschichte, nach Epoche geordnet. Jeder Eintrag verweist auf eine öffentliche Quelle.",
    erasTitle: "Die Epochen von Plovdiv",
    erasNav: "Epochen",
    landmarksTitle: "Wahrzeichen",
    landmarksLead:
      "Denkmäler, die die Geschichte der Stadt erzählen — von der thrakischen Zitadelle bis zur Altstadt der Wiedergeburt.",
    mayorsTitle: "Die Bürgermeister von Plovdiv",
    mayorsLead:
      "68 Amtszeiten von der Befreiung bis heute — eine detaillierte Chronologie mit Biografien und öffentlichen Quellen.",
    mayorsCta: "Alle Bürgermeister ansehen",
    sourceNote:
      "Die historischen Daten sind aus öffentlichen Quellen zusammengefasst (Wikipedia und offizielle Seiten). Prüfen Sie die Originalquelle, bevor Sie eine konkrete Tatsache zitieren.",
    statYears: "Jahre Geschichte",
    statEras: "Epochen",
    statLandmarks: "Wahrzeichen",
    eraLabels: {
      prehistory: "Vorgeschichte",
      thracian: "Thrakische Epoche",
      roman: "Römische Zeit",
      medieval: "Mittelalter",
      ottoman: "Osmanische Zeit",
      revival: "Nationale Wiedergeburt",
      liberation: "Befreiung & Vereinigung",
      modern: "Moderne"
    },
    eraBlurbs: {
      prehistory: "Siedlungen auf den Hügeln bereits im 6. Jahrtausend v. Chr.",
      thracian: "Das thrakische Eumolpia und das Philippopolis von Philipp II. von Makedonien.",
      roman: "Trimontium — eine glänzende römische Stadt mit Theater und Stadion.",
      medieval: "Jahrhunderte wechselnder Herrschaft zwischen Bulgarien und Byzanz.",
      ottoman: "Fünf Jahrhunderte als Filibe — eine Kreuzung des Balkans.",
      revival: "Das bulgarische Bildungs- und Kirchenerwachen.",
      liberation: "Befreiung, Hauptstadt Ostrumeliens und die Vereinigung.",
      modern: "Die Messestadt und Kulturhauptstadt Europas."
    }
  },
  budget: {
    eyebrow: "Wohin fließen die kommunalen Steuern?",
    title: "Haushalt und Investitionsprogramm",
    lead:
      "Der Haushalt 2025, das vorläufige Investitionsprogramm 2026 und das historische Archiv der Stadtverwaltung — mit klar dargestellten Beträgen, Anteilen und öffentlichen Quellen.",
    totalLabel: "Gesamthaushalt 2025",
    capitalLabel: "Investitionsprogramm 2025",
    sectorTitle: "Investitionsprogramm 2025 nach Sektor",
    approxNote:
      "Die Sektorwerte sind näherungsweise — abgeleitet aus den veröffentlichten Anteilen des Investitionsprogramms.",
    shareOfTotal: "Anteil am Investitionsprogramm",
    provTitle: "Investitionsprogramm 2026 (vorläufig)",
    provText:
      "2026 ist der erste Haushalt von Plovdiv in Euro. Das vorläufige Investitionsprogramm beträgt etwa 87 Millionen EUR. Die Zahlen sind vorläufig und können sich nach Verabschiedung des Staatshaushalts ändern.",
    fundingTitle: "Finanzierungsquellen 2026",
    fundEu: "EU-Mittel",
    fundOwn: "Eigene Einnahmen und Übertrag",
    fundOpco: "Programm-Kofinanzierung",
    fundState: "Zweckgebundene staatliche Zuweisung",
    fundOther: "Sonstiges (Spenden, Darlehen)",
    historyTitle: "Historisches Haushaltsarchiv",
    historyLead:
      "Das Archiv umfasst nun den beschlossenen Haushalt 2002, die ausgeführten Investitionsausgaben 2005-2007, die Ausführung 2010, beschlossene Haushaltssummen bis 2011 zurück und ältere Investitionsprogramm-Zahlen, sofern Beschlüsse sie gesondert veröffentlichen.",
    totalHistoryTitle: "Gesamthaushalt und Ausführung",
    capitalHistoryTitle: "Investitionsprogramm",
    historyNote:
      "2008 ist ein Entwurfswert aus einer Sekundärquelle und als vorläufig/Entwurf gekennzeichnet. Die Investitionswerte 2005-2007 und der Gesamtwert 2010 sind ausgeführte Zahlen, keine ursprünglich beschlossenen Rahmen. Ältere Beschlüsse sind teils eingescannte Dokumente und trennen delegierte, lokale und Investitionsausgaben unterschiedlich. Betrachten Sie die Diagramme als navigierbares Archiv und zitieren Sie genaue Zahlen aus dem Originaldokument.",
    executedShort: "ausgef.",
    provisionalShort: "Entwurf",
    mayorsTitle: "Wer die Stadt regierte",
    mayorsLead:
      "Das Archiv umfasst die offiziell veröffentlichten Amtszeiten seit 1878 und den aktuellen Bürgermeister, abgeglichen mit dem bulgarischen Verwaltungsregister.",
    mayorTermCount: "Amtszeiten im Archiv",
    currentMayorLabel: "amtierender Bürgermeister",
    recentMayorsTitle: "Jüngste Amtszeiten",
    earlyMayorsTitle: "Erste Aufzeichnungen nach der Befreiung",
    fullMayorArchive: "Vollständiges Bürgermeister-Archiv",
    eventsTitle: "Ereignisse und Programme",
    eventsLead:
      "Ein kurzes Archiv bemerkenswerter städtischer Initiativen, das hilft, Haushaltsjahre mit öffentlichen Programmen und Kulturereignissen zu verbinden.",
    sourceLabel: "Quelle"
  },
  archive: {
    eyebrow: "Historisches Archiv",
    title: "Bürgermeister, Haushalte und Stadtprogramme",
    lead:
      "Ein internes Archiv der Verwaltung Plovdivs: Amtszeiten, historische Finanzdaten, Kultur- und Sozialprogramme, mit sichtbaren Quellen.",
    statMayors: "Amtszeiten",
    statFinance: "historische Finanzdaten",
    statProgrammes: "Programme und Ereignisse",
    statDocuments: "Primärdokumente",
    currentMayor: "Amtierender Bürgermeister",
    financeTitle: "Finanzarchiv-Momentaufnahmen",
    financeLead:
      "Nominalwerte aus historischen Quellen. Alte Lewa-Beträge sind nicht direkt mit modernen BGN vergleichbar und werden als Archivmarken gezeigt.",
    programmesTitle: "Was die Gemeinde organisierte",
    programmesLead:
      "Ausgewählte Aufzeichnungen zu sozialen, kulturellen und Verwaltungsmaßnahmen, die Stadtoberhäupter mit realen öffentlichen Programmen verbinden.",
    documentsTitle: "Primärdokumente",
    documentsLead:
      "Eine Ausgangsschicht kurzer transkribierter Auszüge aus Gemeindeakten und dem Staatsanzeiger. Jeder Auszug verweist auf das vollständige öffentliche Dokument und verknüpfte Datensätze.",
    transcriptLabel: "Transkribierter Auszug",
    linkedRecords: "Verknüpfte Datensätze",
    documentTypes: {
      municipal_decision: "Gemeindebeschluss",
      state_gazette_decree: "Staatsdekret",
      municipal_rule: "Gemeindeverordnung",
      council_minutes: "Protokoll",
      period_press: "zeitgenössische Presse",
      other: "Dokument"
    },
    transcriptionTypes: {
      excerpt: "Auszug",
      full: "Volltext",
      diplomatic_excerpt: "diplomatischer Auszug"
    },
    mayorsTitle: "Vollständige Bürgermeister-Chronologie",
    mayorsLead:
      "Dies ist eine interne Kopie des offiziellen Archivs der Gemeinde Plovdiv, ergänzt um die aktuelle Amtszeit aus dem Verwaltungsregister.",
    amountLabel: "Betrag",
    yearLabel: "Jahr",
    sourceLabel: "Quelle",
    noAmount: "kein veröffentlichter Betrag",
    viewBudget: "Haushaltsdiagramme öffnen"
  },
  mayors: {
    eyebrow: "Stadtverwaltung",
    title: "Jeder Bürgermeister von Plovdiv",
    lead:
      "Eine vollständige Chronologie der Amtszeiten vom ersten Bürgermeister nach der Befreiung 1878 bis zum amtierenden Bürgermeister 2026.",
    sourceNote:
      "Grundlage ist die offizielle Seite „Bürgermeister von Plovdiv“ der Gemeinde Plovdiv. Die aktuelle Amtszeit wird aus dem bulgarischen Verwaltungsregister ergänzt, weil die kommunale historische Liste noch bei der Amtszeit 2019-2023 endet.",
    statTerms: "Amtszeiten",
    statPeople: "verschiedene Personen",
    statYears: "abgedeckte Jahre",
    statCurrent: "amtierender Bürgermeister",
    search: "Suche",
    searchPlaceholder: "Name, Jahr oder Zeitraum",
    century: "Jahrhundert",
    status: "Status",
    allCenturies: "Alle Jahrhunderte",
    allStatuses: "Alle",
    currentOnly: "Nur amtierende",
    actingOnly: "Nur geschäftsführende",
    reset: "Filter zurücksetzen",
    count: (n: number) => `${n} ${plural(n, "Amtszeit", "Amtszeiten")}`,
    countFiltered: (visible: number, total: number) =>
      `${visible} von ${total} ${plural(total, "Amtszeit", "Amtszeiten")}`,
    empty: "Keine Amtszeiten entsprechen den gewählten Filtern.",
    timelineTitle: "Scrollbare Zeitleiste",
    timelineLead:
      "Scrollen Sie horizontal durch alle Amtszeiten. Die detaillierte Liste unten bleibt filterbar.",
    detailsTitle: "Detaillierte Liste",
    sourcesTitle: "Abdeckungsprüfung",
    sourcesText:
      "Das lokale Archiv enthält alle 65 Amtszeiten der offiziellen Gemeindeliste plus die Amtszeit des amtierenden Kostadin Dimitrov.",
    termNumber: "Amtszeit",
    years: "Jahre",
    duration: "Ungefähre Dauer",
    source: "Quelle / weitere Informationen",
    currentBadge: "Amtierend",
    actingBadge: "Geschäftsführender Bürgermeister",
    officialArchive: "Offizielle Liste",
    currentRegistry: "Verwaltungsregister",
    yearsApprox: (n: number) => `${n} ${plural(n, "Jahr", "Jahre")}`,
    centuryLabel: (century: number) => `${century}. Jahrhundert`,
    centuryRange: (start: number, end: number) => `${start}–${end}`,
    openSource: "Quelle öffnen",
    profile: "Profil",
    backToAll: "Zurück zu allen Bürgermeistern",
    otherTerms: "Weitere Amtszeiten derselben Person",
    moreInfo: "Weitere Informationen",
    biography: "Biografie",
    imageCredit: "Bildnachweis",
    officialProfile: "Offizielle Quelle",
    referenceSource: "Zusätzliche Quelle",
    moreInfoLink: "Weitere Informationen",
    wikipediaArticle: "Wikipedia-Artikel",
    wikipediaSearch: "Wikipedia durchsuchen",
    birthplaceLabel: "Geburtsort",
    educationLabel: "Ausbildung",
    rolesLabel: "Weitere ausgeübte Ämter",
    profileLinks: "Profil und Links",
    connectionsTitle: "Verbindungen zwischen den Bürgermeistern",
    connectionsLead:
      "Welche Bürgermeister mehrfach amtierten und welche verwandt sind.",
    multiTermTitle: "Bürgermeister mit mehreren Amtszeiten",
    familyTitle: "Familien & Dynastien",
    legendSame: "Derselbe Bürgermeister (erneute Amtszeit)",
    legendFamily: "Verwandtschaft",
    legendKilled: "Getötet",
    legendCurrent: "Amtierend",
    fateHeading: "Schicksal",
    fateLabels: {
      killed: "Getötet",
      executed: "Hingerichtet",
      assassinated: "Ermordet",
      died_in_office: "Im Amt verstorben"
    },
    portraitNote: "Die historischen Porträts sind gemeinfrei.",
    portraitAlt: (name: string) => `Porträt von ${name}`,
    birthTitle: "Wo die Bürgermeister geboren wurden",
    birthLead:
      "Die Geburtsorte der dokumentierten Bürgermeister, kartiert. Klicken Sie auf einen Punkt, um die Namen zu sehen.",
    birthByTown: "Geburtsorte nach Anzahl der Bürgermeister",
    birthStatTowns: "Geburtsorte",
    birthStatCountries: "Länder",
    birthPopupMayors: "Bürgermeister",
    prevTerm: "Zurück",
    nextTerm: "Weiter"
  },
  projects: {
    eyebrow: "Öffentliche Projekte",
    title: "Projekte",
    lead:
      "Nach Titel suchen und nach Kategorie, Status und Jahr filtern. Jedes Projekt hat eine eigene Seite.",
    dataNotice:
      "Es gibt keine einzige offizielle öffentliche Liste der 2025 abgeschlossenen Projekte. Projekte werden daher nur nach der verfügbaren Quelle gekennzeichnet: begonnen/erwartete Finanzierung 2026, neu für 2026 oder verschoben mit 0 BGN für 2025-2026.",
    search: "Suche",
    searchPlaceholder: "z. B. Gehweg, Park, Haltestelle",
    category: "Kategorie",
    status: "Status",
    year: "Jahr",
    reset: "Filter zurücksetzen",
    count: (n: number) => `${n} ${plural(n, "Projekt", "Projekte")}`,
    countFiltered: (visible: number, total: number) =>
      `${visible} von ${total} ${plural(total, "Projekt", "Projekte")}`,
    empty: "Keine Projekte entsprechen den gewählten Filtern."
  },
  community: {
    eyebrow: "Bürgerbeteiligung",
    title: "Freiwilligeninitiativen",
    lead:
      "Echte Plovdiver Gruppen und Kampagnen, die Freiwillige für Reinigung, Erneuerung und Pflege öffentlicher Orte organisieren.",
    dataNotice:
      "Datensätze werden durch KI-Suche in öffentlichen Quellen entdeckt oder von einem Administrator hinzugefügt. Jede Initiative muss sichtbare Links zu einer Gruppe, Website oder einem öffentlichen Beitrag behalten, damit sie nicht mit einem unbelegten offiziellen Gemeindeprojekt verwechselt wird.",
    search: "Suche",
    searchPlaceholder: "z. B. Haltestellen, Mariza, Lauta",
    category: "Kategorie",
    status: "Status",
    organizer: "Organisator",
    links: "Links",
    sources: "Quellen",
    relatedProjects: "Verwandte öffentliche Projekte",
    noRelatedProjects: "Kein verwandtes öffentliches Projekt.",
    discovered: "Entdeckt von",
    lastChecked: "Zuletzt geprüft",
    viewSource: "Quelle",
    contact: "Kontakt / Gruppe",
    reset: "Filter zurücksetzen",
    count: (n: number) => `${n} ${plural(n, "Initiative", "Initiativen")}`,
    countFiltered: (visible: number, total: number) =>
      `${visible} von ${total} ${plural(total, "Initiative", "Initiativen")}`,
    empty: "Keine Initiativen entsprechen den gewählten Filtern.",
    adminCta: "Admin: Initiative hinzufügen oder prüfen",
    seeProblems: "Probleme ansehen, bei denen Sie helfen können",
    donate: "An die Organisation spenden",
    acceptsDonations: "Nimmt Spenden an",
    donationsFilter: "Nur spendenannehmende",
    donationDisclaimer: "Open Plovdiv nimmt keine Spenden an und verarbeitet keine. Die „Spenden“-Links führen direkt zu den eigenen Seiten der Organisationen."
  },
  project: {
    breadcrumb: "Projekte",
    keyFacts: "Wichtige Fakten",
    budget: "Budget",
    year: "Jahr",
    funding: "Finanzierung",
    status: "Status",
    district: "Stadtbezirk",
    location: "Standort",
    notSpecified: "Nicht angegeben",
    sources: "Quellen",
    sourcesNote:
      "Die Projektdaten stammen aus öffentlichen Quellen. Für offizielle Angaben prüfen Sie die Originalquelle.",
    noteLabel: "Hinweis",
    noAmount: "Betrag nicht veröffentlicht.",
    approxLocation: "Ungefährer Standort (nach Stadtbezirk).",
    provisional: "Vorläufige Daten",
    relatedBudget: "Zugehörige Haushaltsposition",
    noRelatedBudget: "Keine zugehörige Haushaltsposition.",
    communityInitiatives: "Freiwilligeninitiativen",
    communityInitiativesText:
      "Bürgergruppen oder Kampagnen mit Bezug zu diesem Gebiet oder Thema. Dies ist kein offizieller Projektstatus.",
    noCommunityInitiatives: "Keine zugehörige Freiwilligeninitiative.",
    nearbyReports: "Meldungen in der Nähe",
    noNearby: "Keine veröffentlichten Meldungen im Umkreis von 1 km.",
    nearbyReportsText:
      "Die öffentliche Karte zeigt nur moderierte Bürgermeldungen. Öffnen Sie die Karte, um aktuell veröffentlichte Meldungen in diesem Bereich zu sehen.",
    timeline: "Zeitleiste",
    noTimeline: "Keine Zeitleiste hinzugefügt.",
    updated: "Aktualisiert",
    mapLabel: "Projektkarte"
  },
  fixMap: {
    eyebrow: "Problemkarte",
    title: "Stadt-Problemkarte",
    lead:
      "Veröffentlichte Bürgermeldungen ohne personenbezogene Daten. Filtern Sie nach Kategorie und Status, sehen Sie Details und nahegelegene öffentliche Projekte.",
    notice:
      "Die Karte zeigt nur Meldungen, die über das Formular eingereicht und von einem Moderator freigegeben wurden. Der Status zeigt, ob ein Datensatz verifiziert, gesendet, in Bearbeitung oder geschlossen ist.",
    category: "Kategorie",
    allCategories: "Alle Kategorien",
    status: "Status",
    allStatuses: "Alle Status",
    radius: "Projekte in der Nähe",
    radius500: "im Umkreis von 500 m",
    radius1: "im Umkreis von 1 km",
    radius2: "im Umkreis von 2 km",
    visible: "Sichtbare Datensätze",
    selectTitle: "Eine Meldung auswählen",
    selectHint:
      "Klicken Sie auf eine Markierung, um Details, Status und nahegelegene Projekte zu sehen.",
    emptyTitle: "Noch keine veröffentlichten Meldungen",
    emptyText:
      "Eingereichte Meldungen erscheinen hier nach Prüfung und Freigabe durch einen Moderator.",
    noFilterResults: "Keine Meldungen entsprechen diesen Filtern",
    legend: "Legende",
    statusesTitle: "Was die Status bedeuten",
    officialTitle: "Offizielle Meldung",
    officialText:
      "Nutzen Sie für reale Probleme die offiziellen Kanäle der Gemeinde oder der Bezirksverwaltung. Open Plovdiv nimmt Bürgermeldungen an, die vor der Veröffentlichung geprüft werden, ersetzt aber keine offizielle Meldung.",
    officialLink: "Gemeinde Plovdiv",
    statusLabel: "Status",
    nearbyProjects: "Projekte in der Nähe",
    noNearbyRadius: "Kein Projekt im gewählten Umkreis.",
    loadErrorTitle: "Daten konnten nicht geladen werden",
    loadErrorText:
      "Prüfen Sie, ob die öffentlichen JSON-Dateien mit make data erzeugt wurden.",
    reportCta: "Ein Problem melden",
    communityBadge: "Bürgermeldung",
    lastUpdated: "Aktualisiert",
    justNow: "gerade eben",
    liveNote: "Die Karte aktualisiert sich automatisch alle 30 Sekunden.",
    newReports: "Neue Meldungen: {count}",
    downloadCommunityData: "Daten der Bürgermeldungen herunterladen"
  },
  civic: {
    title: "Wie Sie helfen können",
    lead:
      "Verschiedene Probleme erfordern verschiedene Maßnahmen. Manche liegen in der Verantwortung der Gemeinde; andere können auch von Bürgern und Freiwilligen verbessert werden.",
    trackOfficial: "Erfordert offizielles Handeln",
    trackOfficialText:
      "Gefährliche Straßen, Beleuchtung, Entwässerung und Infrastrukturreparaturen müssen von der Gemeinde oder der zuständigen Institution erledigt werden.",
    trackCivic: "Offen für Bürgerbeteiligung",
    trackCivicText:
      "Müllsammelaktionen, kleine Begrünungen, das Kartieren von Barrieren und das Dokumentieren können von Bürgern und Gruppen organisiert werden.",
    trackBoth: "Geteilte Verantwortung",
    whatYouCanDo: "Was Sie tun können",
    actReportOfficial: "Bei der Gemeinde melden",
    actJoinGroup: "Einer Bürgergruppe beitreten",
    actAddReport: "Das Problem auf der Karte markieren",
    actDocument: "Mit Fotos dokumentieren helfen",
    actFollow: "Den Fortschritt verfolgen",
    groupsTitle: "Gruppen, die helfen können",
    noGroups: "Für diese Kategorie ist noch keine Gruppe gelistet.",
    seeAllGroups: "Alle Freiwilligengruppen ansehen"
  },
  sources: {
    eyebrow: "Überprüfbarkeit",
    title: "Datenquellen",
    lead:
      "Jeder Datensatz auf der Seite verweist auf eine öffentliche Quelle. Unten sind die wichtigsten verwendeten Quellen und wofür sie dienen.",
    colSource: "Quelle",
    colUsedFor: "Verwendet für",
    colLimits: "Einschränkungen",
    colAccessed: "Abgerufen"
  },
  methodology: {
    eyebrow: "Wie es funktioniert",
    title: "Methodik",
    lead:
      "KI durchsucht öffentliche Quellen, extrahiert Projekt- und Haushaltsdaten und prüft sie vor der Veröffentlichung gegen Schemata, URLs, Beträge und Koordinaten. Quellen bleiben sichtbar, weil KI sich dennoch irren kann.",
    collectTitle: "KI-Suche",
    collectText:
      "KI findet und vergleicht öffentliche Quellen — Haushalt und Beschlüsse der Gemeinde Plovdiv, das Investitionsprogramm und lokale Medien — und jeder Datensatz enthält einen Link zur verwendeten Quelle.",
    verifyTitle: "KI-Überprüfung",
    verifyText:
      "KI extrahiert und prüft Felder, Status, URLs, Beträge, Jahre, Koordinaten und das Fehlen personenbezogener Daten in Meldungen. JSON-Schemata validieren dann die Struktur vor dem Build.",
    aiTitle: "KI",
    aiText:
      "Suche, Zusammenfassung und Überprüfung werden von KI durchgeführt. Wenn eine Quelle keinen Betrag, Status oder Abschluss veröffentlicht, muss die Seite dies als fehlende oder vorläufige Daten anzeigen, statt sie zu erfinden.",
    correctTitle: "Korrekturen",
    correctText:
      "Eine Korrektur muss eine öffentliche Quelle hinzufügen oder ändern, das kuratierte JSON aktualisieren und die automatische Validierung und den Build bestehen."
  },
  privacy: {
    eyebrow: "Keine personenbezogenen Daten",
    title: "Datenschutz",
    lead:
      "Die erste Version funktioniert ohne Benutzerkonten, Kommentare, Abstimmungen oder öffentliche Erfassung personenbezogener Daten.",
    notCollectTitle: "Was wir nicht erfassen",
    notCollectText:
      "Keine Namen, E-Mails, Telefonnummern, Konten oder genauen privaten Adressen in Meldungen.",
    beforeTitle: "Bürgermeldungen",
    beforeText:
      "Meldungen erfassen eine Kategorie, einen kurzen Text, einen ungefähren Punkt auf der Karte und optionale Fotos. IP-Adressen werden nur als temporärer Hash zur Ratenbegrenzung verwendet und niemals im Klartext gespeichert."
  },
  moderation: {
    eyebrow: "Geprüfte Bürgermeldungen",
    title: "Moderation",
    lead:
      "Bürger können Meldungen über Stadtprobleme einreichen. Jede Meldung wird von einem Redakteur geprüft und nur veröffentlicht, wenn sie sicher und von öffentlichem Interesse ist.",
    notice:
      "Die Moderation ist zurückhaltend: überprüfbare Stadtprobleme ohne personenbezogene Daten werden veröffentlicht — keine Beleidigungen, Anschuldigungen oder politische Wahlwerbung. Fotos werden erst nach Prüfung veröffentlicht und können ausgeblendet werden."
  },
  notFound: {
    eyebrow: "Fehler 404",
    title: "Seite nicht gefunden",
    text: "Der Link ist möglicherweise veraltet oder falsch geschrieben. Kehren Sie zur Startseite zurück oder wählen Sie einen Bereich."
  },
  reportForm: {
    eyebrow: "Bürgermeldung",
    title: "Eine Meldung einreichen",
    lead:
      "Beschreiben Sie ein öffentliches Stadtproblem und markieren Sie seinen Ort auf der Karte. Ein Redakteur prüft jede Meldung, bevor sie auf der Karte erscheint.",
    notice:
      "Geben Sie keine personenbezogenen Daten ein — Namen, Telefonnummern, E-Mails oder genaue private Adressen. Fotos werden manuell geprüft und nicht vor der Freigabe veröffentlicht.",
    category: "Kategorie",
    titleLabel: "Kurzer Titel",
    titlePlaceholder: "z. B. unebener Gehweg nahe einer Haltestelle",
    description: "Beschreibung",
    descriptionPlaceholder: "Beschreiben Sie das Problem kurz und sachlich.",
    photos: "Fotos",
    photoHint:
      "Optional, bis zu 3 Fotos, je maximal 5 MB. EXIF/GPS-Metadaten werden entfernt und Fotos vor der Prüfung konvertiert.",
    location: "Standort",
    locationHint: "Klicken Sie auf die Karte, um den Ort zu markieren.",
    selected: "Ausgewählter Punkt",
    noLocation: "Noch kein Punkt ausgewählt",
    confirmNoPersonal: "Ich bestätige, dass diese Meldung keine personenbezogenen Daten enthält.",
    confirmPublicInterest: "Ich bestätige, dass dies ein Anliegen von öffentlichem Interesse ist.",
    submit: "Meldung absenden",
    submitting: "Wird gesendet…",
    successTitle: "Vielen Dank!",
    successText:
      "Ihre Meldung ist eingegangen und wird vor der Veröffentlichung geprüft. Referenznummer:",
    submitAnother: "Eine weitere Meldung einreichen",
    backToMap: "Zurück zur Karte",
    errorGeneric: "Die Meldung konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
    errRateLimited: "Zu viele Meldungen in kurzer Zeit. Bitte später versuchen.",
    errCategory: "Wählen Sie eine gültige Kategorie.",
    errTitle: "Der Titel muss zwischen 3 und 120 Zeichen lang sein.",
    errDescription: "Die Beschreibung muss zwischen 10 und 1000 Zeichen lang sein.",
    errPersonalData: "Der Text enthält etwas, das wie personenbezogene Daten aussieht.",
    errLocation: "Wählen Sie einen Punkt innerhalb von Plovdiv.",
    errConfirmation: "Bitte beide Bestätigungen ankreuzen.",
    errTooManyPhotos: "Laden Sie höchstens 3 Fotos hoch.",
    errPhotoLarge: "Jedes Foto darf höchstens 5 MB groß sein.",
    errPhotoType: "Nur JPEG-, PNG- oder WebP-Fotos sind erlaubt.",
    errPhotoInvalid: "Das Foto konnte nicht verarbeitet werden."
  },
  admin: {
    title: "Meldungsmoderation",
    lead: "Bürgermeldungen vor der Veröffentlichung prüfen. Der Zugang ist geschützt.",
    tokenLabel: "Admin-Token",
    tokenPlaceholder: "Token eingeben",
    signIn: "Anmelden",
    signOut: "Abmelden",
    authError: "Ungültiges Token.",
    refresh: "Aktualisieren",
    pendingTitle: "Ausstehende Prüfung",
    noPending: "Keine ausstehenden Meldungen.",
    publicStatus: "Öffentlicher Status",
    rejectReason: "Ablehnungsgrund (optional)",
    approve: "Freigeben & veröffentlichen",
    reject: "Ablehnen",
    publishedTitle: "Veröffentlichte Meldungen",
    noPublished: "Keine veröffentlichten Bürgermeldungen.",
    saveStatus: "Status speichern",
    editDetails: "Meldungsdetails",
    kind: "Datensatztyp",
    kindFix: "Problemmeldung",
    kindHistory: "Historischer Beitrag",
    saveDetails: "Details speichern",
    titleBg: "Titel (BG)",
    titleEn: "Titel (EN, optional)",
    descriptionBg: "Beschreibung (BG)",
    descriptionEn: "Beschreibung (EN, optional)",
    category: "Kategorie",
    latitude: "Breitengrad",
    longitude: "Längengrad",
    addressBg: "Adresse/Wahrzeichen (BG, optional)",
    addressEn: "Adresse/Wahrzeichen (EN, optional)",
    photos: "Fotos",
    hidePhoto: "Foto ausblenden",
    hiddenPhoto: "Ausgeblendetes Foto",
    moderationWarning:
      "Veröffentlichen Sie Fotos nur, wenn sie keine Gesichter, Kinder, Kennzeichen, Dokumente, private Innenräume oder persönlichen Informationen enthalten.",
    submitted: "Eingereicht",
    loading: "Wird geladen…",
    actionError: "Die Aktion ist fehlgeschlagen."
  },
  adminCommunity: {
    title: "Freiwilligeninitiativen",
    lead:
      "Echte Bürgergruppen und Freiwilligenkampagnen mit öffentlichen Links hinzufügen und aktualisieren.",
    tokenLabel: "Admin-Token",
    tokenPlaceholder: "Token eingeben",
    signIn: "Anmelden",
    signOut: "Abmelden",
    authError: "Ungültiges Token.",
    refresh: "Aktualisieren",
    discoveryTitle: "KI-/Online-Suche",
    discoveryLead:
      "Öffentliche Seiten und Beiträge durchsuchen. Ergebnisse schlagen nur Quellen vor; ein Administrator wählt, was gespeichert wird.",
    queryLabel: "Suche",
    queryPlaceholder: "z. B. Plovdiv Freiwillige Reinigung Haltestellen",
    find: "Online finden",
    sourceUrl: "Quell-URL",
    inspectUrl: "URL prüfen",
    noCandidates: "Keine Ergebnisse gefunden.",
    useCandidate: "Als Quelle verwenden",
    formTitle: "Initiative hinzufügen oder aktualisieren",
    id: "ID (optional)",
    titleBg: "Titel (BG)",
    titleEn: "Titel (EN)",
    summaryBg: "Zusammenfassung (BG)",
    summaryEn: "Zusammenfassung (EN, optional)",
    category: "Kategorie",
    status: "Status",
    organizerBg: "Organisator (BG)",
    organizerEn: "Organisator (EN, optional)",
    organizerType: "Organisatortyp",
    website: "Website",
    facebook: "Facebook",
    donationUrl: "Spendenlink (optional)",
    callToActionBg: "Handlungsaufruf (BG, optional)",
    callToActionEn: "Handlungsaufruf (EN, optional)",
    addressBg: "Adresse/Gebiet (BG)",
    addressEn: "Adresse/Gebiet (EN, optional)",
    latitude: "Breitengrad",
    longitude: "Längengrad",
    relatedProjects: "Zugehörige Projekt-IDs (kommagetrennt)",
    tags: "Tags (kommagetrennt)",
    sourceTitle: "Quelltitel",
    sourceUrlLabel: "Quelllink",
    save: "Initiative speichern",
    saved: "Initiative gespeichert.",
    existingTitle: "Gespeicherte Initiativen",
    noExisting: "Keine gespeicherten Initiativen.",
    edit: "Bearbeiten",
    loading: "Wird geladen…",
    actionError: "Die Aktion ist fehlgeschlagen."
  }
};

const fr: typeof bg = {
  site: {
    name: "Open Plovdiv",
    short: "OP",
    tagline:
      "Projets publics, argent public, problèmes publics — présentés clairement.",
    skip: "Aller au contenu",
    menu: "Menu",
    close: "Fermer",
    theme: "Thème clair / sombre",
    langName: "Langue",
    langSwitch: "Choisir la langue"
  },
  nav: {
    home: "Accueil",
    history: "Histoire",
    mayors: "Maires",
    people: "Personnalités",
    places: "Lieux",
    stories: "Récits",
    education: "Éducation",
    overview: "Aperçu",
    fixMap: "Carte",
    budget: "Budget",
    projects: "Projets",
    community: "Bénévoles",
    archive: "Archives",
    sources: "Sources"
  },
  overview: {
    eyebrow: "Aperçu visuel",
    title: "Aperçu en graphiques",
    lead:
      "Une vue d'ensemble des projets suivis et de l'argent public de Plovdiv — par statut, catégorie et année, avec sources.",
    asOf: "Données à jour en juin 2026",
    statProjects: "projets suivis",
    statPostponed: "projets reportés",
    statCapital2025: "programme d'investissement 2025",
    statCapital2026: "programme d'investissement 2026 (provisoire)",
    unitProjects: "Nombre de projets suivis",
    unitSharePercent: "Part du programme d'investissement (%)",
    unitEur: "Montants en euros (€)",
    byStatusTitle: "Projets par statut",
    byCategoryTitle: "Projets par catégorie",
    byYearTitle: "Projets par année budgétaire",
    sector2025Title: "Programme d'investissement 2025 par secteur",
    funding2026Title: "Financement du programme d'investissement 2026",
    capitalTrendTitle: "Programme d'investissement par année",
    capitalTrendNote:
      "Programme d'investissement par année (en BGN). Les chiffres 2013-2018 proviennent de décisions du Conseil municipal ; les années plus récentes utilisent des pages officielles et des publications publiques. 2026 est provisoire et convertie depuis environ 87 M€ au taux de 1,95583.",
    totalTrendTitle: "Budget total de Plovdiv par année",
    totalTrendNote:
      "Budget annuel total de la municipalité de Plovdiv (en BGN). Les archives incluent l'exécution de 2010 et les budgets adoptés pour 2011-2018 ; les valeurs de 2020, 2022 et 2024 restent approximatives/arrondies. Chaque année renvoie à une source publique.",
    historyNote:
      "Les chiffres proviennent de sources publiques (budgets municipaux et publications médiatiques). Vérifiez auprès des documents originaux avant de citer une valeur précise.",
    year2025: "2025",
    year2026: "2026 (provisoire)",
    sourcesNote: "Toutes les valeurs ont des sources publiques.",
    viewBudget: "Voir le budget",
    viewProjects: "Voir les projets"
  },
  footer: {
    blurb:
      "Un projet de données publiques à but non lucratif pour Plovdiv. Sans comptes, sans commentaires, sans base de données.",
    explore: "Explorer",
    civic: "Données citoyennes",
    about: "À propos",
    privacy: "Confidentialité",
    moderation: "Modération",
    community: "Bénévoles",
    methodology: "Méthodologie",
    sources: "Sources",
    note: "Open Plovdiv · données publiques pour Plovdiv",
    dataNote: "Données issues de sources publiques · mises à jour en juin 2026.",
    rights: "Données publiques"
  },
  common: {
    all: "Tous",
    accessed: "consulté",
    source: "Source",
    loading: "Chargement…",
    error: "Une erreur est survenue.",
    backHome: "Retour à l'accueil",
    noSource: "Aucune source publique."
  },
  home: {
    eyebrow: "L'une des plus anciennes villes du monde",
    lead:
      "Plovdiv est vivante depuis plus de 8 000 ans. Eumolpias thrace, Philippopolis de Philippe II de Macédoine, Trimontium romaine, Filibe ottomane — et la ville de l'Unification.",
    ctaHistory: "Explorer la chronologie",
    ctaMayors: "Les maires de Plovdiv",
    statYearsValue: "8000+",
    statYears: "ans d'histoire",
    statEras: "époques",
    statMayors: "maires",
    statLandmarks: "monuments",
    featuredTitle: "Moments d'histoire",
    civicTitle: "Données citoyennes sur la ville d'aujourd'hui",
    civicLead:
      "Au-delà de l'histoire, Open Plovdiv tient aussi des données publiques sur la ville moderne — budget, projets, signalements citoyens et bénévoles, chacun avec une source publique.",
    ctaMap: "Ouvrir la carte des problèmes",
    ctaBudget: "Où vont les impôts locaux ?",
    statsLabel: "Données suivies",
    statProjects: "projets suivis",
    statReportsValue: "En direct",
    statReports: "signalements modérés",
    statCommunity: "initiatives bénévoles",
    statBudget: "secteurs budgétaires",
    statTotal: "programme d'investissement 2025",
    exploreTitle: "Par où commencer",
    cardMapEyebrow: "Carte",
    cardMapTitle: "Carte des problèmes",
    cardMapText:
      "Consultez les signalements citoyens publiés par catégorie et statut, avec les projets publics à proximité.",
    cardBudgetEyebrow: "Budget",
    cardBudgetTitle: "Impôts locaux",
    cardBudgetText:
      "Budget 2025 et programme d'investissement provisoire 2026 — montants, parts et sources publiques.",
    cardProjectsEyebrow: "Projets",
    cardProjectsTitle: "Projets publics",
    cardProjectsText:
      "Recherchez et filtrez les fiches de projet avec budget, statut et sources.",
    cardCommunityEyebrow: "Bénévoles",
    cardCommunityTitle: "Initiatives citoyennes",
    cardCommunityText:
      "Groupes et campagnes organisant nettoyages, entretien des arrêts, parcs et travaux de quartier.",
    cardArchiveEyebrow: "Archives",
    cardArchiveTitle: "Maires et données historiques",
    cardArchiveText:
      "Une chronologie interne complète des mandats de maire, anciens états financiers et programmes municipaux.",
    cardMayorsEyebrow: "Maires",
    cardMayorsTitle: "Tous les maires de Plovdiv",
    cardMayorsText:
      "Chronologie détaillée de 1878 au mandat en cours, avec recherche, siècles et sources.",
    latestProjects: "Projets récemment mis à jour",
    latestReports: "Signalements récemment ajoutés",
    liveReportsTitle: "De vrais signalements après modération",
    liveReportsText:
      "La carte n'affiche désormais que les signalements citoyens soumis via le formulaire et approuvés par un modérateur.",
    viewAll: "Tout voir",
    noticeTitle: "Données et sources",
    notice:
      "Les données sont à jour en juin 2026. Le budget 2025 est adopté, tandis que le programme d'investissement 2026 est provisoire. Chaque fiche renvoie à une source publique.",
    noticeSources: "Voir les sources",
    noticeMethodology: "la méthodologie"
  },
  history: {
    eyebrow: "La chronologie de la ville",
    title: "L'histoire de Plovdiv",
    lead:
      "Plus de huit millénaires sur sept collines — de l'Eumolpias thrace et de la Trimontium romaine, en passant par la Filibe ottomane et la Renaissance nationale, jusqu'à l'Unification et nos jours.",
    timelineTitle: "Chronologie",
    timelineLead:
      "Les moments clés de l'histoire de la ville, classés par époque. Chaque entrée renvoie à une source publique.",
    erasTitle: "Les époques de Plovdiv",
    erasNav: "Époques",
    landmarksTitle: "Monuments",
    landmarksLead:
      "Des monuments qui racontent l'histoire de la ville — de la citadelle thrace à la vieille ville de la Renaissance.",
    mayorsTitle: "Les maires de Plovdiv",
    mayorsLead:
      "68 mandats de la Libération à aujourd'hui — une chronologie détaillée avec biographies et sources publiques.",
    mayorsCta: "Voir tous les maires",
    sourceNote:
      "Les données historiques sont synthétisées à partir de sources publiques (Wikipédia et pages officielles). Vérifiez la source originale avant de citer un fait précis.",
    statYears: "ans d'histoire",
    statEras: "époques",
    statLandmarks: "monuments",
    eraLabels: {
      prehistory: "Préhistoire",
      thracian: "Époque thrace",
      roman: "Époque romaine",
      medieval: "Moyen Âge",
      ottoman: "Époque ottomane",
      revival: "Renaissance nationale",
      liberation: "Libération et Unification",
      modern: "Époque moderne"
    },
    eraBlurbs: {
      prehistory: "Des établissements sur les collines dès le 6e millénaire av. J.-C.",
      thracian: "L'Eumolpias thrace et la Philippopolis de Philippe II de Macédoine.",
      roman: "Trimontium — une brillante cité romaine avec théâtre et stade.",
      medieval: "Des siècles de contrôle alternant entre la Bulgarie et Byzance.",
      ottoman: "Cinq siècles sous le nom de Filibe — un carrefour des Balkans.",
      revival: "L'éveil éducatif et ecclésiastique bulgare.",
      liberation: "La Libération, la capitale de la Roumélie orientale et l'Unification.",
      modern: "La ville des foires et une capitale européenne de la culture."
    }
  },
  budget: {
    eyebrow: "Où vont les impôts locaux ?",
    title: "Budget et programme d'investissement",
    lead:
      "Le budget 2025, le programme d'investissement provisoire 2026 et les archives historiques de la gouvernance municipale — avec montants, parts et sources publiques clairement indiqués.",
    totalLabel: "Budget total 2025",
    capitalLabel: "Programme d'investissement 2025",
    sectorTitle: "Programme d'investissement 2025 par secteur",
    approxNote:
      "Les valeurs par secteur sont approximatives — dérivées des parts publiées du programme d'investissement.",
    shareOfTotal: "part du programme d'investissement",
    provTitle: "Programme d'investissement 2026 (provisoire)",
    provText:
      "2026 est le premier budget de Plovdiv en euros. Le programme d'investissement provisoire s'élève à environ 87 millions d'euros. Les chiffres sont provisoires et peuvent évoluer une fois le budget de l'État adopté.",
    fundingTitle: "Sources de financement 2026",
    fundEu: "Fonds européens",
    fundOwn: "Recettes propres et report",
    fundOpco: "Cofinancement de programmes",
    fundState: "Subvention ciblée de l'État",
    fundOther: "Autres (dons, emprunts)",
    historyTitle: "Archives budgétaires historiques",
    historyLead:
      "Les archives incluent désormais le budget adopté de 2002, les dépenses d'investissement exécutées pour 2005-2007, l'exécution de 2010, les totaux des budgets adoptés depuis 2011 et d'anciens chiffres de programmes d'investissement lorsque les décisions les publient séparément.",
    totalHistoryTitle: "Budget total et exécution",
    capitalHistoryTitle: "Programme d'investissement",
    historyNote:
      "2008 est une valeur de projet de budget issue d'une source secondaire et marquée comme provisoire/projet. Les valeurs du graphique d'investissement 2005-2007 et la valeur du graphique du total 2010 sont des chiffres exécutés, et non des enveloppes initialement adoptées. Les décisions plus anciennes sont parfois des documents numérisés qui ventilent différemment les dépenses déléguées, locales et d'investissement. Considérez les graphiques comme des archives consultables et citez les chiffres exacts depuis le document original.",
    executedShort: "exéc.",
    provisionalShort: "projet",
    mayorsTitle: "Qui a gouverné la ville",
    mayorsLead:
      "Les archives incluent les mandats de maire officiellement publiés depuis 1878 et le maire actuel vérifié dans le Registre administratif bulgare.",
    mayorTermCount: "mandats de maire dans les archives",
    currentMayorLabel: "maire en exercice",
    recentMayorsTitle: "Mandats récents",
    earlyMayorsTitle: "Premières fiches après la Libération",
    fullMayorArchive: "Archives complètes des maires",
    eventsTitle: "Événements et programmes",
    eventsLead:
      "Une courte archive d'initiatives municipales notables qui aide à relier les années budgétaires aux programmes publics et événements culturels.",
    sourceLabel: "Source"
  },
  archive: {
    eyebrow: "Archives historiques",
    title: "Maires, budgets et programmes municipaux",
    lead:
      "Une archive interne de la gouvernance de Plovdiv : mandats de maire, états financiers historiques, programmes culturels et sociaux, avec sources visibles.",
    statMayors: "mandats de maire",
    statFinance: "états financiers historiques",
    statProgrammes: "programmes et événements",
    statDocuments: "documents primaires",
    currentMayor: "Maire en exercice",
    financeTitle: "Instantanés des archives financières",
    financeLead:
      "Valeurs nominales issues de sources historiques. Les anciens montants en levs ne sont pas directement comparables au BGN moderne et sont présentés comme repères d'archives.",
    programmesTitle: "Ce que la municipalité a organisé",
    programmesLead:
      "Une sélection de fiches d'actions sociales, culturelles et de gouvernance reliant les dirigeants de la ville à de vrais programmes publics.",
    documentsTitle: "Documents primaires",
    documentsLead:
      "Une première couche de courts extraits transcrits d'actes municipaux et du Journal officiel. Chaque extrait renvoie au document public complet et aux fiches liées.",
    transcriptLabel: "Extrait transcrit",
    linkedRecords: "Fiches liées",
    documentTypes: {
      municipal_decision: "décision municipale",
      state_gazette_decree: "décret d'État",
      municipal_rule: "règlement municipal",
      council_minutes: "procès-verbal",
      period_press: "presse d'époque",
      other: "document"
    },
    transcriptionTypes: {
      excerpt: "extrait",
      full: "texte intégral",
      diplomatic_excerpt: "extrait diplomatique"
    },
    mayorsTitle: "Chronologie complète des maires",
    mayorsLead:
      "Il s'agit d'une copie interne des archives officielles de la municipalité de Plovdiv, complétée par le mandat en cours issu du Registre administratif.",
    amountLabel: "Montant",
    yearLabel: "Année",
    sourceLabel: "Source",
    noAmount: "montant non publié",
    viewBudget: "Ouvrir les graphiques du budget"
  },
  mayors: {
    eyebrow: "Gouvernance municipale",
    title: "Tous les maires de Plovdiv",
    lead:
      "Une chronologie complète des mandats de maire, du premier maire après la Libération en 1878 jusqu'au maire en exercice en 2026.",
    sourceNote:
      "La base est la page officielle « Maires de Plovdiv » de la municipalité de Plovdiv. Le mandat en cours est ajouté depuis le Registre administratif de Bulgarie, car la liste historique municipale s'arrête encore au mandat 2019-2023.",
    statTerms: "mandats de maire",
    statPeople: "personnes différentes",
    statYears: "années couvertes",
    statCurrent: "maire en exercice",
    search: "Rechercher",
    searchPlaceholder: "Nom, année ou période",
    century: "Siècle",
    status: "Statut",
    allCenturies: "Tous les siècles",
    allStatuses: "Tous",
    currentOnly: "Maire en exercice seulement",
    actingOnly: "Maires par intérim seulement",
    reset: "Effacer les filtres",
    count: (n: number) => `${n} ${plural(n, "mandat", "mandats")}`,
    countFiltered: (visible: number, total: number) =>
      `${visible} sur ${total} ${plural(total, "mandat", "mandats")}`,
    empty: "Aucun mandat ne correspond aux filtres sélectionnés.",
    timelineTitle: "Chronologie défilante",
    timelineLead:
      "Faites défiler horizontalement pour parcourir chaque mandat. La liste détaillée ci-dessous reste filtrable.",
    detailsTitle: "Liste détaillée",
    sourcesTitle: "Vérification de la couverture",
    sourcesText:
      "Les archives locales contiennent les 65 mandats de la liste municipale officielle, plus le mandat en cours de Kostadin Dimitrov.",
    termNumber: "Mandat",
    years: "Années",
    duration: "Durée approx.",
    source: "Source / plus d'informations",
    currentBadge: "En exercice",
    actingBadge: "Maire par intérim",
    officialArchive: "Liste officielle",
    currentRegistry: "Registre administratif",
    yearsApprox: (n: number) => `${n} ${plural(n, "an", "ans")}`,
    centuryLabel: (century: number) => `${century}e siècle`,
    centuryRange: (start: number, end: number) => `${start}–${end}`,
    openSource: "Ouvrir la source",
    profile: "Profil",
    backToAll: "Retour à tous les maires",
    otherTerms: "Autres mandats de la même personne",
    moreInfo: "Plus d'informations",
    biography: "Biographie",
    imageCredit: "Crédit photo",
    officialProfile: "Source officielle",
    referenceSource: "Source complémentaire",
    moreInfoLink: "Plus d'informations",
    wikipediaArticle: "Article Wikipédia",
    wikipediaSearch: "Rechercher sur Wikipédia",
    birthplaceLabel: "Lieu de naissance",
    educationLabel: "Formation",
    rolesLabel: "Autres fonctions exercées",
    profileLinks: "Profil et liens",
    connectionsTitle: "Liens entre les maires",
    connectionsLead:
      "Quels maires ont servi plusieurs fois et lesquels sont liés par la famille.",
    multiTermTitle: "Maires à mandats multiples",
    familyTitle: "Familles et dynasties",
    legendSame: "Même maire (mandat répété)",
    legendFamily: "Lien familial",
    legendKilled: "Tué",
    legendCurrent: "En exercice",
    fateHeading: "Destin",
    fateLabels: {
      killed: "Tué",
      executed: "Exécuté",
      assassinated: "Assassiné",
      died_in_office: "Décédé en fonction"
    },
    portraitNote: "Les portraits historiques sont dans le domaine public.",
    portraitAlt: (name: string) => `Portrait de ${name}`,
    birthTitle: "Où sont nés les maires",
    birthLead:
      "Les lieux de naissance des maires documentés, sur la carte. Cliquez sur un point pour voir les noms.",
    birthByTown: "Lieux de naissance par nombre de maires",
    birthStatTowns: "villes de naissance",
    birthStatCountries: "pays",
    birthPopupMayors: "Maires",
    prevTerm: "Précédent",
    nextTerm: "Suivant"
  },
  projects: {
    eyebrow: "Projets publics",
    title: "Projets",
    lead:
      "Recherchez par titre et filtrez par catégorie, statut et année. Chaque projet a sa propre page.",
    dataNotice:
      "Il n'existe pas de liste publique officielle unique des projets achevés en 2025. Les projets sont donc étiquetés uniquement selon la source disponible : financement démarré/attendu en 2026, nouveau pour 2026, ou reporté avec 0 BGN pour 2025-2026.",
    search: "Rechercher",
    searchPlaceholder: "ex. trottoir, parc, arrêt",
    category: "Catégorie",
    status: "Statut",
    year: "Année",
    reset: "Effacer les filtres",
    count: (n: number) => `${n} ${plural(n, "projet", "projets")}`,
    countFiltered: (visible: number, total: number) =>
      `${visible} sur ${total} ${plural(total, "projet", "projets")}`,
    empty: "Aucun projet ne correspond aux filtres sélectionnés."
  },
  community: {
    eyebrow: "Participation citoyenne",
    title: "Initiatives bénévoles",
    lead:
      "De vrais groupes et campagnes de Plovdiv qui mobilisent des bénévoles pour le nettoyage, la rénovation et l'entretien des lieux publics.",
    dataNotice:
      "Les fiches sont découvertes par recherche IA dans des sources publiques ou ajoutées par un administrateur. Chaque initiative doit conserver des liens visibles vers un groupe, un site web ou une publication publique afin de ne pas être confondue avec un projet municipal officiel sans source.",
    search: "Rechercher",
    searchPlaceholder: "ex. arrêts, Maritsa, Lauta",
    category: "Catégorie",
    status: "Statut",
    organizer: "Organisateur",
    links: "Liens",
    sources: "Sources",
    relatedProjects: "Projets publics liés",
    noRelatedProjects: "Aucun projet public lié.",
    discovered: "Découvert par",
    lastChecked: "Dernière vérification",
    viewSource: "Source",
    contact: "Contact / groupe",
    reset: "Effacer les filtres",
    count: (n: number) => `${n} ${plural(n, "initiative", "initiatives")}`,
    countFiltered: (visible: number, total: number) =>
      `${visible} sur ${total} ${plural(total, "initiative", "initiatives")}`,
    empty: "Aucune initiative ne correspond aux filtres sélectionnés.",
    adminCta: "Admin : ajouter ou vérifier une initiative",
    seeProblems: "Voir les problèmes où vous pouvez aider",
    donate: "Faire un don à l'organisation",
    acceptsDonations: "Accepte les dons",
    donationsFilter: "Seulement celles acceptant des dons",
    donationDisclaimer: "Open Plovdiv n'accepte ni ne traite aucun don. Les liens « Faire un don » mènent directement aux pages propres aux organisations."
  },
  project: {
    breadcrumb: "Projets",
    keyFacts: "Faits clés",
    budget: "Budget",
    year: "Année",
    funding: "Financement",
    status: "Statut",
    district: "Arrondissement",
    location: "Emplacement",
    notSpecified: "Non précisé",
    sources: "Sources",
    sourcesNote:
      "Les données du projet sont collectées à partir de sources publiques. Pour les détails officiels, consultez la source originale.",
    noteLabel: "Remarque",
    noAmount: "Montant non publié.",
    approxLocation: "Emplacement approximatif (par arrondissement).",
    provisional: "Données provisoires",
    relatedBudget: "Ligne budgétaire liée",
    noRelatedBudget: "Aucune ligne budgétaire liée.",
    communityInitiatives: "Initiatives bénévoles",
    communityInitiativesText:
      "Groupes ou campagnes citoyennes liés à ce secteur ou à ce thème. Ce n'est pas un statut officiel de projet.",
    noCommunityInitiatives: "Aucune initiative bénévole liée.",
    nearbyReports: "Signalements à proximité",
    noNearby: "Aucun signalement publié dans un rayon de 1 km.",
    nearbyReportsText:
      "La carte publique n'affiche que les signalements citoyens modérés. Ouvrez la carte pour voir les signalements actuellement publiés autour de cette zone.",
    timeline: "Chronologie",
    noTimeline: "Aucune chronologie ajoutée.",
    updated: "Mis à jour",
    mapLabel: "Carte du projet"
  },
  fixMap: {
    eyebrow: "Carte des problèmes",
    title: "Carte des problèmes de la ville",
    lead:
      "Signalements citoyens publiés sans données personnelles. Filtrez par catégorie et statut, consultez les détails et les projets publics à proximité.",
    notice:
      "La carte n'affiche que les signalements soumis via le formulaire et approuvés par un modérateur. Le statut indique si une fiche est vérifiée, envoyée, en cours ou close.",
    category: "Catégorie",
    allCategories: "Toutes les catégories",
    status: "Statut",
    allStatuses: "Tous les statuts",
    radius: "Projets à proximité",
    radius500: "dans un rayon de 500 m",
    radius1: "dans un rayon de 1 km",
    radius2: "dans un rayon de 2 km",
    visible: "Fiches visibles",
    selectTitle: "Sélectionnez un signalement",
    selectHint:
      "Cliquez sur un marqueur pour voir les détails, le statut et les projets à proximité.",
    emptyTitle: "Aucun signalement publié pour l'instant",
    emptyText:
      "Les signalements soumis apparaissent ici après examen et approbation par un modérateur.",
    noFilterResults: "Aucun signalement ne correspond à ces filtres",
    legend: "Légende",
    statusesTitle: "Ce que signifient les statuts",
    officialTitle: "Signalement officiel",
    officialText:
      "Pour les vrais problèmes, utilisez les canaux officiels de la municipalité ou de l'administration d'arrondissement. Open Plovdiv accepte les signalements citoyens examinés avant publication, mais ne remplace pas le signalement officiel.",
    officialLink: "Municipalité de Plovdiv",
    statusLabel: "Statut",
    nearbyProjects: "Projets à proximité",
    noNearbyRadius: "Aucun projet dans le rayon sélectionné.",
    loadErrorTitle: "Échec du chargement des données",
    loadErrorText:
      "Vérifiez que les fichiers JSON publics ont été générés avec make data.",
    reportCta: "Signaler un problème",
    communityBadge: "Signalement citoyen",
    lastUpdated: "Mis à jour",
    justNow: "à l'instant",
    liveNote: "La carte se rafraîchit automatiquement toutes les 30 secondes.",
    newReports: "Nouveaux signalements : {count}",
    downloadCommunityData: "Télécharger les données des signalements citoyens"
  },
  civic: {
    title: "Comment vous pouvez aider",
    lead:
      "Des problèmes différents appellent des actions différentes. Certains relèvent de la municipalité ; d'autres peuvent aussi être améliorés par les citoyens et les bénévoles.",
    trackOfficial: "Nécessite une action officielle",
    trackOfficialText:
      "Les routes dangereuses, l'éclairage, le drainage et les réparations d'infrastructure doivent être pris en charge par la municipalité ou l'institution responsable.",
    trackCivic: "Ouvert à la participation citoyenne",
    trackCivicText:
      "Les nettoyages de déchets, les petites améliorations vertes, le repérage des obstacles à l'accessibilité et la documentation peuvent être organisés par les citoyens et les groupes.",
    trackBoth: "Responsabilité partagée",
    whatYouCanDo: "Ce que vous pouvez faire",
    actReportOfficial: "Le signaler à la municipalité",
    actJoinGroup: "Rejoindre un groupe citoyen",
    actAddReport: "Marquer le problème sur la carte",
    actDocument: "Aider à le documenter avec des photos",
    actFollow: "Suivre les progrès",
    groupsTitle: "Groupes qui peuvent aider",
    noGroups: "Aucun groupe n'est encore répertorié pour cette catégorie.",
    seeAllGroups: "Voir tous les groupes de bénévoles"
  },
  sources: {
    eyebrow: "Vérifiabilité",
    title: "Sources des données",
    lead:
      "Chaque fiche du site renvoie à une source publique. Voici les principales sources utilisées et à quoi elles servent.",
    colSource: "Source",
    colUsedFor: "Utilisée pour",
    colLimits: "Limites",
    colAccessed: "Consultée"
  },
  methodology: {
    eyebrow: "Comment ça marche",
    title: "Méthodologie",
    lead:
      "L'IA recherche des sources publiques, extrait des fiches de projet et de budget, et les vérifie au regard des schémas, URL, montants et coordonnées avant publication. Les sources restent visibles, car l'IA peut toujours se tromper.",
    collectTitle: "Recherche par IA",
    collectText:
      "L'IA trouve et compare des sources publiques — le budget et les décisions de la municipalité de Plovdiv, le programme d'investissement et les médias locaux — et chaque fiche inclut un lien vers la source utilisée.",
    verifyTitle: "Vérification par IA",
    verifyText:
      "L'IA extrait et vérifie les champs, statuts, URL, montants, années, coordonnées et l'absence de données personnelles dans les signalements. Les schémas JSON valident ensuite la structure avant la construction.",
    aiTitle: "IA",
    aiText:
      "La recherche, la synthèse et la vérification sont effectuées par l'IA. Lorsqu'une source ne publie pas de montant, de statut ou de fiche d'achèvement, le site doit l'indiquer comme donnée manquante ou provisoire au lieu de l'inventer.",
    correctTitle: "Corrections",
    correctText:
      "Une correction doit ajouter ou modifier une source publique, mettre à jour le JSON organisé et réussir la validation automatisée et la construction."
  },
  privacy: {
    eyebrow: "Aucune donnée personnelle",
    title: "Confidentialité",
    lead:
      "La première version fonctionne sans comptes d'utilisateur, sans commentaires, sans votes ni collecte publique de données personnelles.",
    notCollectTitle: "Ce que nous ne collectons pas",
    notCollectText:
      "Aucun nom, e-mail, numéro de téléphone, compte ni adresse privée exacte dans les signalements.",
    beforeTitle: "Signalements citoyens",
    beforeText:
      "Les signalements collectent une catégorie, un court texte, un point approximatif sur la carte et des photos facultatives. Les adresses IP ne servent qu'à un hachage temporaire pour limiter le débit et ne sont jamais stockées en clair."
  },
  moderation: {
    eyebrow: "Signalements citoyens examinés",
    title: "Modération",
    lead:
      "Les citoyens peuvent soumettre des signalements sur des problèmes de la ville. Chaque signalement est examiné par un éditeur et publié uniquement s'il est sûr et d'intérêt public.",
    notice:
      "La modération est prudente : les problèmes urbains vérifiables et sans données personnelles sont publiés — pas les insultes, accusations ou campagnes politiques. Les photos ne sont publiées qu'après examen et peuvent être masquées."
  },
  notFound: {
    eyebrow: "Erreur 404",
    title: "Page introuvable",
    text: "Le lien est peut-être obsolète ou mal saisi. Revenez à l'accueil ou choisissez une section."
  },
  reportForm: {
    eyebrow: "Signalement citoyen",
    title: "Soumettre un signalement",
    lead:
      "Décrivez un problème public de la ville et marquez son emplacement sur la carte. Un éditeur examine chaque signalement avant qu'il n'apparaisse sur la carte.",
    notice:
      "N'inscrivez aucune donnée personnelle — noms, numéros de téléphone, e-mails ou adresses privées exactes. Les photos sont examinées manuellement et ne sont pas publiées avant approbation.",
    category: "Catégorie",
    titleLabel: "Titre court",
    titlePlaceholder: "ex. trottoir inégal près d'un arrêt",
    description: "Description",
    descriptionPlaceholder: "Décrivez le problème brièvement et objectivement.",
    photos: "Photos",
    photoHint:
      "Facultatif, jusqu'à 3 photos, 5 Mo maximum chacune. Les métadonnées EXIF/GPS sont supprimées et les photos converties avant examen.",
    location: "Emplacement",
    locationHint: "Cliquez sur la carte pour marquer l'emplacement.",
    selected: "Point sélectionné",
    noLocation: "Aucun point sélectionné pour l'instant",
    confirmNoPersonal: "Je confirme que ce signalement ne contient aucune donnée personnelle.",
    confirmPublicInterest: "Je confirme qu'il s'agit d'une question d'intérêt public.",
    submit: "Soumettre le signalement",
    submitting: "Envoi…",
    successTitle: "Merci !",
    successText:
      "Votre signalement a été reçu et sera examiné avant publication. Numéro de référence :",
    submitAnother: "Soumettre un autre signalement",
    backToMap: "Retour à la carte",
    errorGeneric: "Le signalement n'a pas pu être envoyé. Veuillez réessayer.",
    errRateLimited: "Trop de signalements en peu de temps. Veuillez réessayer plus tard.",
    errCategory: "Choisissez une catégorie valide.",
    errTitle: "Le titre doit comporter entre 3 et 120 caractères.",
    errDescription: "La description doit comporter entre 10 et 1000 caractères.",
    errPersonalData: "Le texte contient quelque chose qui ressemble à une donnée personnelle.",
    errLocation: "Choisissez un point situé dans Plovdiv.",
    errConfirmation: "Veuillez cocher les deux confirmations.",
    errTooManyPhotos: "Téléversez au maximum 3 photos.",
    errPhotoLarge: "Chaque photo doit faire 5 Mo ou moins.",
    errPhotoType: "Seules les photos JPEG, PNG ou WebP sont autorisées.",
    errPhotoInvalid: "La photo n'a pas pu être traitée."
  },
  admin: {
    title: "Modération des signalements",
    lead: "Examinez les signalements citoyens avant publication. L'accès est protégé.",
    tokenLabel: "Jeton administrateur",
    tokenPlaceholder: "Saisir le jeton",
    signIn: "Se connecter",
    signOut: "Se déconnecter",
    authError: "Jeton invalide.",
    refresh: "Actualiser",
    pendingTitle: "En attente d'examen",
    noPending: "Aucun signalement en attente.",
    publicStatus: "Statut public",
    rejectReason: "Motif de rejet (facultatif)",
    approve: "Approuver et publier",
    reject: "Rejeter",
    publishedTitle: "Signalements publiés",
    noPublished: "Aucun signalement citoyen publié.",
    saveStatus: "Enregistrer le statut",
    editDetails: "Détails du signalement",
    kind: "Type de fiche",
    kindFix: "Signalement de problème",
    kindHistory: "Contribution historique",
    saveDetails: "Enregistrer les détails",
    titleBg: "Titre (BG)",
    titleEn: "Titre (EN, facultatif)",
    descriptionBg: "Description (BG)",
    descriptionEn: "Description (EN, facultatif)",
    category: "Catégorie",
    latitude: "Latitude",
    longitude: "Longitude",
    addressBg: "Adresse/repère (BG, facultatif)",
    addressEn: "Adresse/repère (EN, facultatif)",
    photos: "Photos",
    hidePhoto: "Masquer la photo",
    hiddenPhoto: "Photo masquée",
    moderationWarning:
      "Ne publiez les photos que si elles ne contiennent ni visages, ni enfants, ni plaques d'immatriculation, ni documents, ni intérieurs privés, ni informations personnelles.",
    submitted: "Soumis",
    loading: "Chargement…",
    actionError: "L'action a échoué."
  },
  adminCommunity: {
    title: "Initiatives bénévoles",
    lead:
      "Ajoutez et mettez à jour de vrais groupes citoyens et campagnes de bénévoles avec des liens publics.",
    tokenLabel: "Jeton administrateur",
    tokenPlaceholder: "Saisir le jeton",
    signIn: "Se connecter",
    signOut: "Se déconnecter",
    authError: "Jeton invalide.",
    refresh: "Actualiser",
    discoveryTitle: "Recherche IA/en ligne",
    discoveryLead:
      "Recherchez des pages et publications publiques. Les résultats ne font que suggérer des sources ; un administrateur choisit ce qu'il enregistre.",
    queryLabel: "Rechercher",
    queryPlaceholder: "ex. bénévoles Plovdiv nettoyage arrêts de bus",
    find: "Rechercher en ligne",
    sourceUrl: "URL de la source",
    inspectUrl: "Inspecter l'URL",
    noCandidates: "Aucun résultat trouvé.",
    useCandidate: "Utiliser comme source",
    formTitle: "Ajouter ou mettre à jour une initiative",
    id: "ID (facultatif)",
    titleBg: "Titre (BG)",
    titleEn: "Titre (EN)",
    summaryBg: "Résumé (BG)",
    summaryEn: "Résumé (EN, facultatif)",
    category: "Catégorie",
    status: "Statut",
    organizerBg: "Organisateur (BG)",
    organizerEn: "Organisateur (EN, facultatif)",
    organizerType: "Type d'organisateur",
    website: "Site web",
    facebook: "Facebook",
    donationUrl: "Lien de don (facultatif)",
    callToActionBg: "Appel à l'action (BG, facultatif)",
    callToActionEn: "Appel à l'action (EN, facultatif)",
    addressBg: "Adresse/zone (BG)",
    addressEn: "Adresse/zone (EN, facultatif)",
    latitude: "Latitude",
    longitude: "Longitude",
    relatedProjects: "ID de projets liés (séparés par des virgules)",
    tags: "Étiquettes (séparées par des virgules)",
    sourceTitle: "Titre de la source",
    sourceUrlLabel: "Lien de la source",
    save: "Enregistrer l'initiative",
    saved: "Initiative enregistrée.",
    existingTitle: "Initiatives enregistrées",
    noExisting: "Aucune initiative enregistrée.",
    edit: "Modifier",
    loading: "Chargement…",
    actionError: "L'action a échoué."
  }
};

const it: typeof bg = {
  site: {
    name: "Open Plovdiv",
    short: "OP",
    tagline:
      "Progetti pubblici, denaro pubblico, problemi pubblici — presentati con chiarezza.",
    skip: "Vai al contenuto",
    menu: "Menu",
    close: "Chiudi",
    theme: "Tema chiaro / scuro",
    langName: "Lingua",
    langSwitch: "Scegli la lingua"
  },
  nav: {
    home: "Inizio",
    history: "Storia",
    mayors: "Sindaci",
    people: "Personalità",
    places: "Luoghi",
    stories: "Racconti",
    education: "Istruzione",
    overview: "Panoramica",
    fixMap: "Mappa",
    budget: "Bilancio",
    projects: "Progetti",
    community: "Volontari",
    archive: "Archivio",
    sources: "Fonti"
  },
  overview: {
    eyebrow: "Panoramica visiva",
    title: "Panoramica in grafici",
    lead:
      "Una visione d'insieme dei progetti monitorati e del denaro pubblico di Plovdiv — per stato, categoria e anno, con le fonti.",
    asOf: "Dati aggiornati a giugno 2026",
    statProjects: "progetti monitorati",
    statPostponed: "progetti rinviati",
    statCapital2025: "programma d'investimenti 2025",
    statCapital2026: "programma d'investimenti 2026 (provvisorio)",
    unitProjects: "Numero di progetti monitorati",
    unitSharePercent: "Quota del programma d'investimenti (%)",
    unitEur: "Importi in euro (€)",
    byStatusTitle: "Progetti per stato",
    byCategoryTitle: "Progetti per categoria",
    byYearTitle: "Progetti per anno di bilancio",
    sector2025Title: "Programma d'investimenti 2025 per settore",
    funding2026Title: "Finanziamento del programma d'investimenti 2026",
    capitalTrendTitle: "Programma d'investimenti per anno",
    capitalTrendNote:
      "Programma d'investimenti per anno (in BGN). I dati 2013-2018 provengono da delibere del Consiglio comunale; gli anni più recenti usano pagine ufficiali e pubblicazioni pubbliche. Il 2026 è provvisorio e convertito da circa 87 M€ al tasso di 1,95583.",
    totalTrendTitle: "Bilancio totale di Plovdiv per anno",
    totalTrendNote:
      "Bilancio annuale totale del Comune di Plovdiv (in BGN). L'archivio include l'esecuzione del 2010 e i bilanci adottati per il 2011-2018; i valori del 2020, 2022 e 2024 restano approssimativi/arrotondati. Ogni anno rimanda a una fonte pubblica.",
    historyNote:
      "Le cifre provengono da fonti pubbliche (bilanci comunali e pubblicazioni dei media). Verificate i documenti originali prima di citare un valore preciso.",
    year2025: "2025",
    year2026: "2026 (provvisorio)",
    sourcesNote: "Tutti i valori hanno fonti pubbliche.",
    viewBudget: "Vai al bilancio",
    viewProjects: "Vai ai progetti"
  },
  footer: {
    blurb:
      "Un progetto di dati pubblici senza scopo di lucro per Plovdiv. Senza account, senza commenti, senza database.",
    explore: "Esplora",
    civic: "Dati civici",
    about: "Informazioni",
    privacy: "Privacy",
    moderation: "Moderazione",
    community: "Volontari",
    methodology: "Metodologia",
    sources: "Fonti",
    note: "Open Plovdiv · dati pubblici per Plovdiv",
    dataNote: "Dati da fonti pubbliche · aggiornati a giugno 2026.",
    rights: "Dati pubblici"
  },
  common: {
    all: "Tutti",
    accessed: "consultato",
    source: "Fonte",
    loading: "Caricamento…",
    error: "Si è verificato un errore.",
    backHome: "Torna alla home",
    noSource: "Nessuna fonte pubblica."
  },
  home: {
    eyebrow: "Una delle città più antiche del mondo",
    lead:
      "Plovdiv è viva da oltre 8.000 anni. L'Eumolpiade tracia, la Filippopoli di Filippo II di Macedonia, la Trimontium romana, la Filibe ottomana — e la città dell'Unificazione.",
    ctaHistory: "Esplora la cronologia",
    ctaMayors: "I sindaci di Plovdiv",
    statYearsValue: "8000+",
    statYears: "anni di storia",
    statEras: "epoche",
    statMayors: "sindaci",
    statLandmarks: "monumenti",
    featuredTitle: "Momenti di storia",
    civicTitle: "Dati civici sulla città di oggi",
    civicLead:
      "Oltre alla storia, Open Plovdiv tiene anche dati pubblici sulla città moderna — bilancio, progetti, segnalazioni dei cittadini e volontari, ognuno con una fonte pubblica.",
    ctaMap: "Apri la mappa dei problemi",
    ctaBudget: "Dove vanno le tasse locali?",
    statsLabel: "Dati monitorati",
    statProjects: "progetti monitorati",
    statReportsValue: "In diretta",
    statReports: "segnalazioni moderate",
    statCommunity: "iniziative di volontariato",
    statBudget: "settori di bilancio",
    statTotal: "programma d'investimenti 2025",
    exploreTitle: "Da dove iniziare",
    cardMapEyebrow: "Mappa",
    cardMapTitle: "Mappa dei problemi",
    cardMapText:
      "Consulta le segnalazioni dei cittadini pubblicate per categoria e stato, con i progetti pubblici nelle vicinanze.",
    cardBudgetEyebrow: "Bilancio",
    cardBudgetTitle: "Tasse locali",
    cardBudgetText:
      "Bilancio 2025 e programma d'investimenti provvisorio 2026 — importi, quote e fonti pubbliche.",
    cardProjectsEyebrow: "Progetti",
    cardProjectsTitle: "Progetti pubblici",
    cardProjectsText:
      "Cerca e filtra le schede dei progetti con bilancio, stato e fonti.",
    cardCommunityEyebrow: "Volontari",
    cardCommunityTitle: "Iniziative civiche",
    cardCommunityText:
      "Gruppi e campagne che organizzano pulizie, cura delle fermate, parchi e lavori di quartiere.",
    cardArchiveEyebrow: "Archivio",
    cardArchiveTitle: "Sindaci e dati storici",
    cardArchiveText:
      "Una cronologia interna completa dei mandati dei sindaci, vecchi documenti finanziari e programmi comunali.",
    cardMayorsEyebrow: "Sindaci",
    cardMayorsTitle: "Tutti i sindaci di Plovdiv",
    cardMayorsText:
      "Cronologia dettagliata dal 1878 al mandato in corso, con ricerca, secoli e fonti.",
    latestProjects: "Progetti aggiornati di recente",
    latestReports: "Segnalazioni aggiunte di recente",
    liveReportsTitle: "Segnalazioni reali dopo la moderazione",
    liveReportsText:
      "La mappa mostra ora solo le segnalazioni dei cittadini inviate tramite il modulo e approvate da un moderatore.",
    viewAll: "Vedi tutto",
    noticeTitle: "Dati e fonti",
    notice:
      "I dati sono aggiornati a giugno 2026. Il bilancio 2025 è adottato, mentre il programma d'investimenti 2026 è provvisorio. Ogni scheda rimanda a una fonte pubblica.",
    noticeSources: "Vedi le fonti",
    noticeMethodology: "la metodologia"
  },
  history: {
    eyebrow: "La cronologia della città",
    title: "La storia di Plovdiv",
    lead:
      "Oltre otto millenni su sette colli — dall'Eumolpiade tracia e dalla Trimontium romana, passando per la Filibe ottomana e la Rinascita nazionale, fino all'Unificazione e ai giorni nostri.",
    timelineTitle: "Cronologia",
    timelineLead:
      "I momenti chiave della storia della città, ordinati per epoca. Ogni voce rimanda a una fonte pubblica.",
    erasTitle: "Le epoche di Plovdiv",
    erasNav: "Epoche",
    landmarksTitle: "Monumenti",
    landmarksLead:
      "Monumenti che raccontano la storia della città — dalla cittadella tracia alla città vecchia della Rinascita.",
    mayorsTitle: "I sindaci di Plovdiv",
    mayorsLead:
      "68 mandati dalla Liberazione a oggi — una cronologia dettagliata con biografie e fonti pubbliche.",
    mayorsCta: "Vedi tutti i sindaci",
    sourceNote:
      "I dati storici sono sintetizzati da fonti pubbliche (Wikipedia e pagine ufficiali). Verificate la fonte originale prima di citare un fatto preciso.",
    statYears: "anni di storia",
    statEras: "epoche",
    statLandmarks: "monumenti",
    eraLabels: {
      prehistory: "Preistoria",
      thracian: "Epoca tracia",
      roman: "Epoca romana",
      medieval: "Medioevo",
      ottoman: "Epoca ottomana",
      revival: "Rinascita nazionale",
      liberation: "Liberazione e Unificazione",
      modern: "Epoca moderna"
    },
    eraBlurbs: {
      prehistory: "Insediamenti sui colli già dal VI millennio a.C.",
      thracian: "L'Eumolpiade tracia e la Filippopoli di Filippo II di Macedonia.",
      roman: "Trimontium — una splendida città romana con teatro e stadio.",
      medieval: "Secoli di controllo alternato tra la Bulgaria e Bisanzio.",
      ottoman: "Cinque secoli con il nome di Filibe — un crocevia dei Balcani.",
      revival: "Il risveglio educativo ed ecclesiastico bulgaro.",
      liberation: "La Liberazione, la capitale della Rumelia orientale e l'Unificazione.",
      modern: "La città delle fiere e una capitale europea della cultura."
    }
  },
  budget: {
    eyebrow: "Dove vanno le tasse locali?",
    title: "Bilancio e programma d'investimenti",
    lead:
      "Il bilancio 2025, il programma d'investimenti provvisorio 2026 e l'archivio storico del governo cittadino — con importi, quote e fonti pubbliche chiaramente indicati.",
    totalLabel: "Bilancio totale 2025",
    capitalLabel: "Programma d'investimenti 2025",
    sectorTitle: "Programma d'investimenti 2025 per settore",
    approxNote:
      "I valori per settore sono approssimativi — ricavati dalle quote pubblicate del programma d'investimenti.",
    shareOfTotal: "quota del programma d'investimenti",
    provTitle: "Programma d'investimenti 2026 (provvisorio)",
    provText:
      "Il 2026 è il primo bilancio di Plovdiv in euro. Il programma d'investimenti provvisorio ammonta a circa 87 milioni di euro. Le cifre sono provvisorie e potrebbero cambiare una volta adottato il bilancio dello Stato.",
    fundingTitle: "Fonti di finanziamento 2026",
    fundEu: "Fondi europei",
    fundOwn: "Entrate proprie e riporto",
    fundOpco: "Cofinanziamento di programmi",
    fundState: "Sovvenzione mirata dello Stato",
    fundOther: "Altro (donazioni, prestiti)",
    historyTitle: "Archivio storico del bilancio",
    historyLead:
      "L'archivio include ora il bilancio adottato del 2002, le spese d'investimento eseguite per il 2005-2007, l'esecuzione del 2010, i totali dei bilanci adottati dal 2011 e vecchie cifre del programma d'investimenti quando le delibere le pubblicano separatamente.",
    totalHistoryTitle: "Bilancio totale ed esecuzione",
    capitalHistoryTitle: "Programma d'investimenti",
    historyNote:
      "Il 2008 è un valore di progetto di bilancio da una fonte secondaria ed è contrassegnato come provvisorio/bozza. I valori del grafico d'investimenti 2005-2007 e il valore del grafico del totale 2010 sono cifre eseguite, non dotazioni inizialmente adottate. Le delibere più vecchie sono talvolta documenti digitalizzati che ripartiscono diversamente le spese delegate, locali e d'investimento. Considerate i grafici come un archivio consultabile e citate le cifre esatte dal documento originale.",
    executedShort: "esec.",
    provisionalShort: "bozza",
    mayorsTitle: "Chi ha governato la città",
    mayorsLead:
      "L'archivio include i mandati dei sindaci ufficialmente pubblicati dal 1878 e il sindaco attuale verificato nel Registro amministrativo bulgaro.",
    mayorTermCount: "mandati di sindaco nell'archivio",
    currentMayorLabel: "sindaco in carica",
    recentMayorsTitle: "Mandati recenti",
    earlyMayorsTitle: "Prime schede dopo la Liberazione",
    fullMayorArchive: "Archivio completo dei sindaci",
    eventsTitle: "Eventi e programmi",
    eventsLead:
      "Un breve archivio di iniziative comunali di rilievo che aiuta a collegare gli anni di bilancio ai programmi pubblici e agli eventi culturali.",
    sourceLabel: "Fonte"
  },
  archive: {
    eyebrow: "Archivio storico",
    title: "Sindaci, bilanci e programmi comunali",
    lead:
      "Un archivio interno del governo di Plovdiv: mandati dei sindaci, documenti finanziari storici, programmi culturali e sociali, con fonti visibili.",
    statMayors: "mandati di sindaco",
    statFinance: "documenti finanziari storici",
    statProgrammes: "programmi ed eventi",
    statDocuments: "documenti primari",
    currentMayor: "Sindaco in carica",
    financeTitle: "Istantanee dell'archivio finanziario",
    financeLead:
      "Valori nominali da fonti storiche. I vecchi importi in lev non sono direttamente comparabili con il BGN moderno e sono mostrati come riferimenti d'archivio.",
    programmesTitle: "Cosa ha organizzato il comune",
    programmesLead:
      "Una selezione di schede di azioni sociali, culturali e di governo che collegano i leader cittadini a veri programmi pubblici.",
    documentsTitle: "Documenti primari",
    documentsLead:
      "Un primo strato di brevi estratti trascritti da atti comunali e dalla Gazzetta ufficiale. Ogni estratto rimanda al documento pubblico completo e alle schede collegate.",
    transcriptLabel: "Estratto trascritto",
    linkedRecords: "Schede collegate",
    documentTypes: {
      municipal_decision: "delibera comunale",
      state_gazette_decree: "decreto statale",
      municipal_rule: "regolamento comunale",
      council_minutes: "verbale",
      period_press: "stampa d'epoca",
      other: "documento"
    },
    transcriptionTypes: {
      excerpt: "estratto",
      full: "testo integrale",
      diplomatic_excerpt: "estratto diplomatico"
    },
    mayorsTitle: "Cronologia completa dei sindaci",
    mayorsLead:
      "È una copia interna dell'archivio ufficiale del Comune di Plovdiv, integrata con il mandato in corso dal Registro amministrativo.",
    amountLabel: "Importo",
    yearLabel: "Anno",
    sourceLabel: "Fonte",
    noAmount: "importo non pubblicato",
    viewBudget: "Apri i grafici del bilancio"
  },
  mayors: {
    eyebrow: "Governo cittadino",
    title: "Tutti i sindaci di Plovdiv",
    lead:
      "Una cronologia completa dei mandati dei sindaci, dal primo sindaco dopo la Liberazione nel 1878 al sindaco in carica nel 2026.",
    sourceNote:
      "La base è la pagina ufficiale « Sindaci di Plovdiv » del Comune di Plovdiv. Il mandato in corso è aggiunto dal Registro amministrativo della Bulgaria, poiché l'elenco storico comunale si ferma ancora al mandato 2019-2023.",
    statTerms: "mandati di sindaco",
    statPeople: "persone diverse",
    statYears: "anni coperti",
    statCurrent: "sindaco in carica",
    search: "Cerca",
    searchPlaceholder: "Nome, anno o periodo",
    century: "Secolo",
    status: "Stato",
    allCenturies: "Tutti i secoli",
    allStatuses: "Tutti",
    currentOnly: "Solo sindaco in carica",
    actingOnly: "Solo sindaci facenti funzione",
    reset: "Cancella i filtri",
    count: (n: number) => `${n} ${plural(n, "mandato", "mandati")}`,
    countFiltered: (visible: number, total: number) =>
      `${visible} di ${total} ${plural(total, "mandato", "mandati")}`,
    empty: "Nessun mandato corrisponde ai filtri selezionati.",
    timelineTitle: "Cronologia scorrevole",
    timelineLead:
      "Scorri orizzontalmente per percorrere ogni mandato. L'elenco dettagliato qui sotto resta filtrabile.",
    detailsTitle: "Elenco dettagliato",
    sourcesTitle: "Verifica della copertura",
    sourcesText:
      "L'archivio locale contiene tutti i 65 mandati dell'elenco comunale ufficiale, più il mandato in corso di Kostadin Dimitrov.",
    termNumber: "Mandato",
    years: "Anni",
    duration: "Durata appross.",
    source: "Fonte / maggiori informazioni",
    currentBadge: "In carica",
    actingBadge: "Sindaco facente funzione",
    officialArchive: "Elenco ufficiale",
    currentRegistry: "Registro amministrativo",
    yearsApprox: (n: number) => `${n} ${plural(n, "anno", "anni")}`,
    centuryLabel: (century: number) => `${century}° secolo`,
    centuryRange: (start: number, end: number) => `${start}–${end}`,
    openSource: "Apri la fonte",
    profile: "Profilo",
    backToAll: "Torna a tutti i sindaci",
    otherTerms: "Altri mandati della stessa persona",
    moreInfo: "Maggiori informazioni",
    biography: "Biografia",
    imageCredit: "Crediti foto",
    officialProfile: "Fonte ufficiale",
    referenceSource: "Fonte aggiuntiva",
    moreInfoLink: "Maggiori informazioni",
    wikipediaArticle: "Articolo di Wikipedia",
    wikipediaSearch: "Cerca su Wikipedia",
    birthplaceLabel: "Luogo di nascita",
    educationLabel: "Formazione",
    rolesLabel: "Altre cariche ricoperte",
    profileLinks: "Profilo e link",
    connectionsTitle: "Legami tra i sindaci",
    connectionsLead:
      "Quali sindaci hanno governato più volte e quali sono legati da vincoli familiari.",
    multiTermTitle: "Sindaci con più mandati",
    familyTitle: "Famiglie e dinastie",
    legendSame: "Stesso sindaco (mandato ripetuto)",
    legendFamily: "Legame familiare",
    legendKilled: "Ucciso",
    legendCurrent: "In carica",
    fateHeading: "Destino",
    fateLabels: {
      killed: "Ucciso",
      executed: "Giustiziato",
      assassinated: "Assassinato",
      died_in_office: "Morto in carica"
    },
    portraitNote: "I ritratti storici sono di pubblico dominio.",
    portraitAlt: (name: string) => `Ritratto di ${name}`,
    birthTitle: "Dove sono nati i sindaci",
    birthLead:
      "I luoghi di nascita dei sindaci documentati, sulla mappa. Clicca su un punto per vedere i nomi.",
    birthByTown: "Luoghi di nascita per numero di sindaci",
    birthStatTowns: "città di nascita",
    birthStatCountries: "paesi",
    birthPopupMayors: "Sindaci",
    prevTerm: "Precedente",
    nextTerm: "Successivo"
  },
  projects: {
    eyebrow: "Progetti pubblici",
    title: "Progetti",
    lead:
      "Cerca per titolo e filtra per categoria, stato e anno. Ogni progetto ha la propria pagina.",
    dataNotice:
      "Non esiste un unico elenco pubblico ufficiale dei progetti completati nel 2025. I progetti sono quindi etichettati solo in base alla fonte disponibile: finanziamento avviato/previsto nel 2026, nuovo per il 2026, o rinviato con 0 BGN per il 2025-2026.",
    search: "Cerca",
    searchPlaceholder: "es. marciapiede, parco, fermata",
    category: "Categoria",
    status: "Stato",
    year: "Anno",
    reset: "Cancella i filtri",
    count: (n: number) => `${n} ${plural(n, "progetto", "progetti")}`,
    countFiltered: (visible: number, total: number) =>
      `${visible} di ${total} ${plural(total, "progetto", "progetti")}`,
    empty: "Nessun progetto corrisponde ai filtri selezionati."
  },
  community: {
    eyebrow: "Partecipazione civica",
    title: "Iniziative di volontariato",
    lead:
      "Veri gruppi e campagne di Plovdiv che mobilitano volontari per la pulizia, il rinnovo e la cura dei luoghi pubblici.",
    dataNotice:
      "Le schede sono individuate tramite ricerca IA di fonti pubbliche o aggiunte da un amministratore. Ogni iniziativa deve conservare link visibili a un gruppo, un sito web o un post pubblico, per non essere confusa con un progetto comunale ufficiale privo di fonte.",
    search: "Cerca",
    searchPlaceholder: "es. fermate, Maritsa, Lauta",
    category: "Categoria",
    status: "Stato",
    organizer: "Organizzatore",
    links: "Link",
    sources: "Fonti",
    relatedProjects: "Progetti pubblici collegati",
    noRelatedProjects: "Nessun progetto pubblico collegato.",
    discovered: "Individuato da",
    lastChecked: "Ultima verifica",
    viewSource: "Fonte",
    contact: "Contatto / gruppo",
    reset: "Cancella i filtri",
    count: (n: number) => `${n} ${plural(n, "iniziativa", "iniziative")}`,
    countFiltered: (visible: number, total: number) =>
      `${visible} di ${total} ${plural(total, "iniziativa", "iniziative")}`,
    empty: "Nessuna iniziativa corrisponde ai filtri selezionati.",
    adminCta: "Admin: aggiungi o verifica un'iniziativa",
    seeProblems: "Vedi i problemi in cui puoi aiutare",
    donate: "Fai una donazione all'organizzazione",
    acceptsDonations: "Accetta donazioni",
    donationsFilter: "Solo chi accetta donazioni",
    donationDisclaimer: "Open Plovdiv non accetta né elabora donazioni. I link « Fai una donazione » rimandano direttamente alle pagine proprie delle organizzazioni."
  },
  project: {
    breadcrumb: "Progetti",
    keyFacts: "Dati chiave",
    budget: "Bilancio",
    year: "Anno",
    funding: "Finanziamento",
    status: "Stato",
    district: "Distretto",
    location: "Posizione",
    notSpecified: "Non specificato",
    sources: "Fonti",
    sourcesNote:
      "I dati del progetto sono raccolti da fonti pubbliche. Per i dettagli ufficiali, consultate la fonte originale.",
    noteLabel: "Nota",
    noAmount: "Importo non pubblicato.",
    approxLocation: "Posizione approssimativa (per distretto).",
    provisional: "Dati provvisori",
    relatedBudget: "Voce di bilancio collegata",
    noRelatedBudget: "Nessuna voce di bilancio collegata.",
    communityInitiatives: "Iniziative di volontariato",
    communityInitiativesText:
      "Gruppi o campagne civiche legati a questa zona o tema. Non è uno stato ufficiale del progetto.",
    noCommunityInitiatives: "Nessuna iniziativa di volontariato collegata.",
    nearbyReports: "Segnalazioni nelle vicinanze",
    noNearby: "Nessuna segnalazione pubblicata entro 1 km.",
    nearbyReportsText:
      "La mappa pubblica mostra solo le segnalazioni dei cittadini moderate. Apri la mappa per vedere le segnalazioni attualmente pubblicate intorno a quest'area.",
    timeline: "Cronologia",
    noTimeline: "Nessuna cronologia aggiunta.",
    updated: "Aggiornato",
    mapLabel: "Mappa del progetto"
  },
  fixMap: {
    eyebrow: "Mappa dei problemi",
    title: "Mappa dei problemi della città",
    lead:
      "Segnalazioni dei cittadini pubblicate senza dati personali. Filtra per categoria e stato, consulta i dettagli e i progetti pubblici nelle vicinanze.",
    notice:
      "La mappa mostra solo le segnalazioni inviate tramite il modulo e approvate da un moderatore. Lo stato indica se una scheda è verificata, inviata, in corso o chiusa.",
    category: "Categoria",
    allCategories: "Tutte le categorie",
    status: "Stato",
    allStatuses: "Tutti gli stati",
    radius: "Progetti nelle vicinanze",
    radius500: "entro 500 m",
    radius1: "entro 1 km",
    radius2: "entro 2 km",
    visible: "Schede visibili",
    selectTitle: "Seleziona una segnalazione",
    selectHint:
      "Clicca su un indicatore per vedere dettagli, stato e progetti nelle vicinanze.",
    emptyTitle: "Ancora nessuna segnalazione pubblicata",
    emptyText:
      "Le segnalazioni inviate compaiono qui dopo l'esame e l'approvazione da parte di un moderatore.",
    noFilterResults: "Nessuna segnalazione corrisponde a questi filtri",
    legend: "Legenda",
    statusesTitle: "Cosa significano gli stati",
    officialTitle: "Segnalazione ufficiale",
    officialText:
      "Per problemi reali, usate i canali ufficiali del comune o dell'amministrazione distrettuale. Open Plovdiv accetta segnalazioni dei cittadini esaminate prima della pubblicazione, ma non sostituisce la segnalazione ufficiale.",
    officialLink: "Comune di Plovdiv",
    statusLabel: "Stato",
    nearbyProjects: "Progetti nelle vicinanze",
    noNearbyRadius: "Nessun progetto entro il raggio selezionato.",
    loadErrorTitle: "Caricamento dei dati non riuscito",
    loadErrorText:
      "Verifica che i file JSON pubblici siano stati generati con make data.",
    reportCta: "Segnala un problema",
    communityBadge: "Segnalazione cittadina",
    lastUpdated: "Aggiornato",
    justNow: "proprio ora",
    liveNote: "La mappa si aggiorna automaticamente ogni 30 secondi.",
    newReports: "Nuove segnalazioni: {count}",
    downloadCommunityData: "Scarica i dati delle segnalazioni dei cittadini"
  },
  civic: {
    title: "Come puoi aiutare",
    lead:
      "Problemi diversi richiedono azioni diverse. Alcuni sono di competenza del comune; altri possono essere migliorati anche dai cittadini e dai volontari.",
    trackOfficial: "Richiede un intervento ufficiale",
    trackOfficialText:
      "Strade pericolose, illuminazione, drenaggio e riparazioni infrastrutturali devono essere gestiti dal comune o dall'istituzione responsabile.",
    trackCivic: "Aperto alla partecipazione civica",
    trackCivicText:
      "Pulizie dai rifiuti, piccoli miglioramenti del verde, mappatura delle barriere all'accessibilità e documentazione possono essere organizzati da cittadini e gruppi.",
    trackBoth: "Responsabilità condivisa",
    whatYouCanDo: "Cosa puoi fare",
    actReportOfficial: "Segnalarlo al comune",
    actJoinGroup: "Unirti a un gruppo di cittadini",
    actAddReport: "Segnare il problema sulla mappa",
    actDocument: "Aiutare a documentarlo con foto",
    actFollow: "Seguire i progressi",
    groupsTitle: "Gruppi che possono aiutare",
    noGroups: "Nessun gruppo è ancora elencato per questa categoria.",
    seeAllGroups: "Vedi tutti i gruppi di volontari"
  },
  sources: {
    eyebrow: "Verificabilità",
    title: "Fonti dei dati",
    lead:
      "Ogni scheda del sito rimanda a una fonte pubblica. Di seguito le principali fonti usate e a cosa servono.",
    colSource: "Fonte",
    colUsedFor: "Usata per",
    colLimits: "Limiti",
    colAccessed: "Consultata"
  },
  methodology: {
    eyebrow: "Come funziona",
    title: "Metodologia",
    lead:
      "L'IA cerca fonti pubbliche, estrae schede di progetto e di bilancio e le verifica rispetto a schemi, URL, importi e coordinate prima della pubblicazione. Le fonti restano visibili, perché l'IA può comunque sbagliare.",
    collectTitle: "Ricerca con l'IA",
    collectText:
      "L'IA trova e confronta fonti pubbliche — il bilancio e le delibere del Comune di Plovdiv, il programma d'investimenti e i media locali — e ogni scheda include un link alla fonte usata.",
    verifyTitle: "Verifica con l'IA",
    verifyText:
      "L'IA estrae e verifica campi, stati, URL, importi, anni, coordinate e l'assenza di dati personali nelle segnalazioni. Gli schemi JSON validano poi la struttura prima della build.",
    aiTitle: "IA",
    aiText:
      "Ricerca, sintesi e verifica sono eseguite dall'IA. Quando una fonte non pubblica un importo, uno stato o una scheda di completamento, il sito deve indicarlo come dato mancante o provvisorio invece di inventarlo.",
    correctTitle: "Correzioni",
    correctText:
      "Una correzione deve aggiungere o modificare una fonte pubblica, aggiornare il JSON curato e superare la validazione automatica e la build."
  },
  privacy: {
    eyebrow: "Nessun dato personale",
    title: "Privacy",
    lead:
      "La prima versione funziona senza account utente, senza commenti, senza votazioni né raccolta pubblica di dati personali.",
    notCollectTitle: "Cosa non raccogliamo",
    notCollectText:
      "Nessun nome, e-mail, numero di telefono, account o indirizzo privato esatto nelle segnalazioni.",
    beforeTitle: "Segnalazioni dei cittadini",
    beforeText:
      "Le segnalazioni raccolgono una categoria, un breve testo, un punto approssimativo sulla mappa e foto facoltative. Gli indirizzi IP sono usati solo come hash temporaneo per limitare la frequenza e non sono mai memorizzati in chiaro."
  },
  moderation: {
    eyebrow: "Segnalazioni dei cittadini esaminate",
    title: "Moderazione",
    lead:
      "I cittadini possono inviare segnalazioni sui problemi della città. Ogni segnalazione è esaminata da un redattore e pubblicata solo se è sicura e di interesse pubblico.",
    notice:
      "La moderazione è prudente: si pubblicano i problemi urbani verificabili e privi di dati personali — non insulti, accuse o campagne politiche. Le foto sono pubblicate solo dopo l'esame e possono essere nascoste."
  },
  notFound: {
    eyebrow: "Errore 404",
    title: "Pagina non trovata",
    text: "Il link potrebbe essere obsoleto o digitato male. Torna alla home o scegli una sezione."
  },
  reportForm: {
    eyebrow: "Segnalazione cittadina",
    title: "Invia una segnalazione",
    lead:
      "Descrivi un problema pubblico della città e segna la sua posizione sulla mappa. Un redattore esamina ogni segnalazione prima che compaia sulla mappa.",
    notice:
      "Non inserire dati personali — nomi, numeri di telefono, e-mail o indirizzi privati esatti. Le foto sono esaminate manualmente e non sono pubblicate prima dell'approvazione.",
    category: "Categoria",
    titleLabel: "Titolo breve",
    titlePlaceholder: "es. marciapiede irregolare vicino a una fermata",
    description: "Descrizione",
    descriptionPlaceholder: "Descrivi il problema in modo breve e oggettivo.",
    photos: "Foto",
    photoHint:
      "Facoltativo, fino a 3 foto, massimo 5 MB ciascuna. I metadati EXIF/GPS sono rimossi e le foto convertite prima dell'esame.",
    location: "Posizione",
    locationHint: "Clicca sulla mappa per segnare la posizione.",
    selected: "Punto selezionato",
    noLocation: "Nessun punto ancora selezionato",
    confirmNoPersonal: "Confermo che questa segnalazione non contiene dati personali.",
    confirmPublicInterest: "Confermo che si tratta di una questione di interesse pubblico.",
    submit: "Invia la segnalazione",
    submitting: "Invio…",
    successTitle: "Grazie!",
    successText:
      "La tua segnalazione è stata ricevuta e sarà esaminata prima della pubblicazione. Numero di riferimento:",
    submitAnother: "Invia un'altra segnalazione",
    backToMap: "Torna alla mappa",
    errorGeneric: "Impossibile inviare la segnalazione. Riprova.",
    errRateLimited: "Troppe segnalazioni in poco tempo. Riprova più tardi.",
    errCategory: "Scegli una categoria valida.",
    errTitle: "Il titolo deve avere tra 3 e 120 caratteri.",
    errDescription: "La descrizione deve avere tra 10 e 1000 caratteri.",
    errPersonalData: "Il testo contiene qualcosa che sembra un dato personale.",
    errLocation: "Scegli un punto all'interno di Plovdiv.",
    errConfirmation: "Spunta entrambe le conferme.",
    errTooManyPhotos: "Carica al massimo 3 foto.",
    errPhotoLarge: "Ogni foto deve essere di 5 MB o meno.",
    errPhotoType: "Sono ammesse solo foto JPEG, PNG o WebP.",
    errPhotoInvalid: "Impossibile elaborare la foto."
  },
  admin: {
    title: "Moderazione delle segnalazioni",
    lead: "Esamina le segnalazioni dei cittadini prima della pubblicazione. L'accesso è protetto.",
    tokenLabel: "Token amministratore",
    tokenPlaceholder: "Inserisci il token",
    signIn: "Accedi",
    signOut: "Esci",
    authError: "Token non valido.",
    refresh: "Aggiorna",
    pendingTitle: "In attesa di esame",
    noPending: "Nessuna segnalazione in attesa.",
    publicStatus: "Stato pubblico",
    rejectReason: "Motivo del rifiuto (facoltativo)",
    approve: "Approva e pubblica",
    reject: "Rifiuta",
    publishedTitle: "Segnalazioni pubblicate",
    noPublished: "Nessuna segnalazione cittadina pubblicata.",
    saveStatus: "Salva lo stato",
    editDetails: "Dettagli della segnalazione",
    kind: "Tipo di scheda",
    kindFix: "Segnalazione di problema",
    kindHistory: "Contributo storico",
    saveDetails: "Salva i dettagli",
    titleBg: "Titolo (BG)",
    titleEn: "Titolo (EN, facoltativo)",
    descriptionBg: "Descrizione (BG)",
    descriptionEn: "Descrizione (EN, facoltativo)",
    category: "Categoria",
    latitude: "Latitudine",
    longitude: "Longitudine",
    addressBg: "Indirizzo/punto di riferimento (BG, facoltativo)",
    addressEn: "Indirizzo/punto di riferimento (EN, facoltativo)",
    photos: "Foto",
    hidePhoto: "Nascondi la foto",
    hiddenPhoto: "Foto nascosta",
    moderationWarning:
      "Pubblica le foto solo se non contengono volti, bambini, targhe, documenti, interni privati o informazioni personali.",
    submitted: "Inviato",
    loading: "Caricamento…",
    actionError: "L'azione non è riuscita."
  },
  adminCommunity: {
    title: "Iniziative di volontariato",
    lead:
      "Aggiungi e aggiorna veri gruppi di cittadini e campagne di volontariato con link pubblici.",
    tokenLabel: "Token amministratore",
    tokenPlaceholder: "Inserisci il token",
    signIn: "Accedi",
    signOut: "Esci",
    authError: "Token non valido.",
    refresh: "Aggiorna",
    discoveryTitle: "Ricerca IA/online",
    discoveryLead:
      "Cerca pagine e post pubblici. I risultati si limitano a suggerire fonti; un amministratore sceglie cosa salvare.",
    queryLabel: "Cerca",
    queryPlaceholder: "es. volontari Plovdiv pulizia fermate dell'autobus",
    find: "Cerca online",
    sourceUrl: "URL della fonte",
    inspectUrl: "Ispeziona l'URL",
    noCandidates: "Nessun risultato trovato.",
    useCandidate: "Usa come fonte",
    formTitle: "Aggiungi o aggiorna un'iniziativa",
    id: "ID (facoltativo)",
    titleBg: "Titolo (BG)",
    titleEn: "Titolo (EN)",
    summaryBg: "Riassunto (BG)",
    summaryEn: "Riassunto (EN, facoltativo)",
    category: "Categoria",
    status: "Stato",
    organizerBg: "Organizzatore (BG)",
    organizerEn: "Organizzatore (EN, facoltativo)",
    organizerType: "Tipo di organizzatore",
    website: "Sito web",
    facebook: "Facebook",
    donationUrl: "Link per donazioni (facoltativo)",
    callToActionBg: "Invito all'azione (BG, facoltativo)",
    callToActionEn: "Invito all'azione (EN, facoltativo)",
    addressBg: "Indirizzo/zona (BG)",
    addressEn: "Indirizzo/zona (EN, facoltativo)",
    latitude: "Latitudine",
    longitude: "Longitudine",
    relatedProjects: "ID dei progetti collegati (separati da virgole)",
    tags: "Tag (separati da virgole)",
    sourceTitle: "Titolo della fonte",
    sourceUrlLabel: "Link della fonte",
    save: "Salva l'iniziativa",
    saved: "Iniziativa salvata.",
    existingTitle: "Iniziative salvate",
    noExisting: "Nessuna iniziativa salvata.",
    edit: "Modifica",
    loading: "Caricamento…",
    actionError: "L'azione non è riuscita."
  }
};

const tr: typeof bg = {
  site: {
    name: "Open Plovdiv",
    short: "OP",
    tagline:
      "Kamu projeleri, kamu parası, kamu sorunları — açıkça sunuldu.",
    skip: "İçeriğe geç",
    menu: "Menü",
    close: "Kapat",
    theme: "Açık / koyu tema",
    langName: "Dil",
    langSwitch: "Dil seç"
  },
  nav: {
    home: "Ana sayfa",
    history: "Tarih",
    mayors: "Belediye başkanları",
    people: "Kişiler",
    places: "Yerler",
    stories: "Anlatılar",
    education: "Eğitim",
    overview: "Genel bakış",
    fixMap: "Harita",
    budget: "Bütçe",
    projects: "Projeler",
    community: "Gönüllüler",
    archive: "Arşiv",
    sources: "Kaynaklar"
  },
  overview: {
    eyebrow: "Görsel genel bakış",
    title: "Grafiklerle genel bakış",
    lead:
      "Plovdiv için izlenen projelere ve kamu parasına genel bir bakış — duruma, kategoriye ve yıla göre, kaynaklarıyla birlikte.",
    asOf: "Veriler Haziran 2026 itibarıyla",
    statProjects: "izlenen proje",
    statPostponed: "ertelenen proje",
    statCapital2025: "2025 yatırım programı",
    statCapital2026: "2026 yatırım programı (geçici)",
    unitProjects: "İzlenen proje sayısı",
    unitSharePercent: "Yatırım programındaki pay (%)",
    unitEur: "Avro cinsinden tutarlar (€)",
    byStatusTitle: "Duruma göre projeler",
    byCategoryTitle: "Kategoriye göre projeler",
    byYearTitle: "Bütçe yılına göre projeler",
    sector2025Title: "Sektöre göre 2025 yatırım programı",
    funding2026Title: "2026 yatırım programının finansmanı",
    capitalTrendTitle: "Yıla göre yatırım programı",
    capitalTrendNote:
      "Yıla göre yatırım programı (BGN cinsinden). 2013-2018 rakamları Belediye Meclisi kararlarından gelir; daha yeni yıllar resmî sayfaları ve kamuya açık yayınları kullanır. 2026 geçicidir ve yaklaşık 87 milyon avrodan 1,95583 kuruyla dönüştürülmüştür.",
    totalTrendTitle: "Yıla göre Plovdiv toplam bütçesi",
    totalTrendNote:
      "Plovdiv Belediyesi'nin toplam yıllık bütçesi (BGN cinsinden). Arşiv 2010 yılının gerçekleşmesini ve 2011-2018 için kabul edilen bütçeleri içerir; 2020, 2022 ve 2024 değerleri yaklaşık/yuvarlanmış kalır. Her yıl kamuya açık bir kaynağa bağlanır.",
    historyNote:
      "Rakamlar kamuya açık kaynaklardan gelir (belediye bütçeleri ve medya yayınları). Belirli bir değeri alıntılamadan önce orijinal belgelerle doğrulayın.",
    year2025: "2025",
    year2026: "2026 (geçici)",
    sourcesNote: "Tüm değerlerin kamuya açık kaynakları vardır.",
    viewBudget: "Bütçeye git",
    viewProjects: "Projelere git"
  },
  footer: {
    blurb:
      "Plovdiv için kâr amacı gütmeyen bir kamu verisi projesi. Hesap yok, yorum yok, veri tabanı yok.",
    explore: "Keşfet",
    civic: "Yurttaş verileri",
    about: "Hakkında",
    privacy: "Gizlilik",
    moderation: "Moderasyon",
    community: "Gönüllüler",
    methodology: "Yöntem",
    sources: "Kaynaklar",
    note: "Open Plovdiv · Plovdiv için kamu verileri",
    dataNote: "Kamuya açık kaynaklardan veriler · Haziran 2026'da güncellendi.",
    rights: "Kamu verileri"
  },
  common: {
    all: "Tümü",
    accessed: "erişildi",
    source: "Kaynak",
    loading: "Yükleniyor…",
    error: "Bir hata oluştu.",
    backHome: "Ana sayfaya dön",
    noSource: "Kamuya açık kaynak yok."
  },
  home: {
    eyebrow: "Dünyanın en eski şehirlerinden biri",
    lead:
      "Plovdiv 8.000 yılı aşkın süredir yaşıyor. Trak Eumolpias'ı, Makedonyalı II. Filip'in Philippopolis'i, Roma Trimontium'u, Osmanlı Filibe'si — ve Birleşme'nin şehri.",
    ctaHistory: "Zaman çizelgesini keşfet",
    ctaMayors: "Plovdiv'in belediye başkanları",
    statYearsValue: "8000+",
    statYears: "yıllık tarih",
    statEras: "dönem",
    statMayors: "belediye başkanı",
    statLandmarks: "anıt",
    featuredTitle: "Tarihten anlar",
    civicTitle: "Bugünün şehrine dair yurttaş verileri",
    civicLead:
      "Tarihin yanı sıra Open Plovdiv modern şehre dair kamu verilerini de tutar — bütçe, projeler, yurttaş bildirimleri ve gönüllüler, her biri kamuya açık bir kaynakla.",
    ctaMap: "Sorun haritasını aç",
    ctaBudget: "Yerel vergiler nereye gidiyor?",
    statsLabel: "İzlenen veriler",
    statProjects: "izlenen proje",
    statReportsValue: "Canlı",
    statReports: "moderasyondan geçmiş bildirim",
    statCommunity: "gönüllü girişimi",
    statBudget: "bütçe sektörü",
    statTotal: "2025 yatırım programı",
    exploreTitle: "Nereden başlamalı",
    cardMapEyebrow: "Harita",
    cardMapTitle: "Sorun haritası",
    cardMapText:
      "Yayımlanan yurttaş bildirimlerini kategoriye ve duruma göre, yakındaki kamu projeleriyle birlikte görün.",
    cardBudgetEyebrow: "Bütçe",
    cardBudgetTitle: "Yerel vergiler",
    cardBudgetText:
      "2025 bütçesi ve geçici 2026 yatırım programı — tutarlar, paylar ve kamuya açık kaynaklar.",
    cardProjectsEyebrow: "Projeler",
    cardProjectsTitle: "Kamu projeleri",
    cardProjectsText:
      "Bütçe, durum ve kaynaklarla proje kayıtlarını arayın ve filtreleyin.",
    cardCommunityEyebrow: "Gönüllüler",
    cardCommunityTitle: "Yurttaş girişimleri",
    cardCommunityText:
      "Temizlik, durak bakımı, parklar ve mahalle çalışmaları düzenleyen gruplar ve kampanyalar.",
    cardArchiveEyebrow: "Arşiv",
    cardArchiveTitle: "Belediye başkanları ve tarihsel veriler",
    cardArchiveText:
      "Belediye başkanlığı görev sürelerinin, eski mali kayıtların ve şehir programlarının eksiksiz bir iç zaman çizelgesi.",
    cardMayorsEyebrow: "Belediye başkanları",
    cardMayorsTitle: "Plovdiv'in tüm belediye başkanları",
    cardMayorsText:
      "1878'den günümüzdeki göreve kadar ayrıntılı kronoloji; arama, yüzyıllar ve kaynaklarla.",
    latestProjects: "Yakın zamanda güncellenen projeler",
    latestReports: "Yakın zamanda eklenen bildirimler",
    liveReportsTitle: "Moderasyon sonrası gerçek bildirimler",
    liveReportsText:
      "Harita artık yalnızca form aracılığıyla gönderilen ve bir moderatör tarafından onaylanan yurttaş bildirimlerini gösterir.",
    viewAll: "Tümünü gör",
    noticeTitle: "Veriler ve kaynaklar",
    notice:
      "Veriler Haziran 2026 itibarıyla günceldir. 2025 bütçesi kabul edilmiştir, 2026 yatırım programı ise geçicidir. Her kayıt kamuya açık bir kaynağa bağlanır.",
    noticeSources: "Kaynaklara bakın",
    noticeMethodology: "yöntem"
  },
  history: {
    eyebrow: "Şehrin zaman çizelgesi",
    title: "Plovdiv'in tarihi",
    lead:
      "Yedi tepe üzerinde sekiz binyılı aşkın bir süre — Trak Eumolpias'ı ve Roma Trimontium'undan, Osmanlı Filibe'si ve Ulusal Uyanış'tan geçerek Birleşme'ye ve günümüze kadar.",
    timelineTitle: "Zaman çizelgesi",
    timelineLead:
      "Şehrin tarihindeki kilit anlar, döneme göre düzenlenmiştir. Her kayıt kamuya açık bir kaynağa bağlanır.",
    erasTitle: "Plovdiv'in dönemleri",
    erasNav: "Dönemler",
    landmarksTitle: "Anıtlar",
    landmarksLead:
      "Şehrin hikâyesini anlatan anıtlar — Trak kalesinden Uyanış dönemi Eski Şehir'e kadar.",
    mayorsTitle: "Plovdiv'in belediye başkanları",
    mayorsLead:
      "Kurtuluş'tan bugüne 68 görev süresi — biyografiler ve kamuya açık kaynaklarla ayrıntılı bir kronoloji.",
    mayorsCta: "Tüm belediye başkanlarını gör",
    sourceNote:
      "Tarihsel veriler kamuya açık kaynaklardan (Wikipedia ve resmî sayfalar) derlenmiştir. Belirli bir olguyu alıntılamadan önce orijinal kaynağı doğrulayın.",
    statYears: "yıllık tarih",
    statEras: "dönem",
    statLandmarks: "anıt",
    eraLabels: {
      prehistory: "Tarih öncesi",
      thracian: "Trak dönemi",
      roman: "Roma dönemi",
      medieval: "Orta Çağ",
      ottoman: "Osmanlı dönemi",
      revival: "Ulusal Uyanış",
      liberation: "Kurtuluş ve Birleşme",
      modern: "Modern dönem"
    },
    eraBlurbs: {
      prehistory: "Tepelerde daha MÖ 6. binyıldan itibaren yerleşimler.",
      thracian: "Trak Eumolpias'ı ve Makedonyalı II. Filip'in Philippopolis'i.",
      roman: "Trimontium — tiyatrosu ve stadyumuyla görkemli bir Roma şehri.",
      medieval: "Bulgaristan ile Bizans arasında dönüşümlü yüzyıllarca süren egemenlik.",
      ottoman: "Filibe adıyla beş yüzyıl — Balkanların bir kavşağı.",
      revival: "Bulgar eğitim ve kilise uyanışı.",
      liberation: "Kurtuluş, Doğu Rumeli'nin başkenti ve Birleşme.",
      modern: "Fuarlar şehri ve bir Avrupa Kültür Başkenti."
    }
  },
  budget: {
    eyebrow: "Yerel vergiler nereye gidiyor?",
    title: "Bütçe ve yatırım programı",
    lead:
      "2025 bütçesi, geçici 2026 yatırım programı ve şehir yönetiminin tarihsel arşivi — tutarlar, paylar ve kamuya açık kaynaklar açıkça gösterilmiştir.",
    totalLabel: "Toplam 2025 bütçesi",
    capitalLabel: "2025 yatırım programı",
    sectorTitle: "Sektöre göre 2025 yatırım programı",
    approxNote:
      "Sektör değerleri yaklaşıktır — yatırım programının yayımlanan paylarından türetilmiştir.",
    shareOfTotal: "yatırım programındaki pay",
    provTitle: "2026 yatırım programı (geçici)",
    provText:
      "2026, Plovdiv'in avro cinsinden ilk bütçesidir. Geçici yatırım programı yaklaşık 87 milyon avrodur. Rakamlar geçicidir ve devlet bütçesi kabul edildiğinde değişebilir.",
    fundingTitle: "2026 finansman kaynakları",
    fundEu: "AB fonları",
    fundOwn: "Öz gelirler ve devir",
    fundOpco: "Program eş finansmanı",
    fundState: "Devletin amaca yönelik desteği",
    fundOther: "Diğer (bağışlar, krediler)",
    historyTitle: "Tarihsel bütçe arşivi",
    historyLead:
      "Arşiv artık 2002 kabul bütçesini, 2005-2007 için gerçekleşen yatırım harcamalarını, 2010 gerçekleşmesini, 2011'den itibaren kabul edilen bütçe toplamlarını ve kararların ayrı yayımladığı durumlarda eski yatırım programı rakamlarını içerir.",
    totalHistoryTitle: "Toplam bütçe ve gerçekleşme",
    capitalHistoryTitle: "Yatırım programı",
    historyNote:
      "2008, ikincil bir kaynaktan gelen bir bütçe taslağı değeridir ve geçici/taslak olarak işaretlenmiştir. 2005-2007 yatırım grafiği değerleri ve 2010 toplam grafiği değeri gerçekleşen rakamlardır, başlangıçta kabul edilen ödenekler değildir. Daha eski kararlar bazen taranmış belgelerdir ve devredilen, yerel ve yatırım harcamalarını farklı şekilde ayırır. Grafikleri gezilebilir bir arşiv olarak değerlendirin ve kesin rakamları orijinal belgeden alıntılayın.",
    executedShort: "gerçek.",
    provisionalShort: "taslak",
    mayorsTitle: "Şehri kim yönetti",
    mayorsLead:
      "Arşiv 1878'den itibaren resmen yayımlanan belediye başkanlığı görev sürelerini ve Bulgar İdari Sicili'nde doğrulanan mevcut belediye başkanını içerir.",
    mayorTermCount: "arşivdeki belediye başkanlığı görev süresi",
    currentMayorLabel: "görevdeki belediye başkanı",
    recentMayorsTitle: "Son görev süreleri",
    earlyMayorsTitle: "Kurtuluş'tan sonraki ilk kayıtlar",
    fullMayorArchive: "Belediye başkanlarının tam arşivi",
    eventsTitle: "Etkinlikler ve programlar",
    eventsLead:
      "Bütçe yıllarını kamu programlarına ve kültürel etkinliklere bağlamaya yardımcı olan, dikkate değer belediye girişimlerinin kısa bir arşivi.",
    sourceLabel: "Kaynak"
  },
  archive: {
    eyebrow: "Tarihsel arşiv",
    title: "Belediye başkanları, bütçeler ve şehir programları",
    lead:
      "Plovdiv yönetiminin iç arşivi: belediye başkanlığı görev süreleri, tarihsel mali kayıtlar, kültürel ve sosyal programlar; görünür kaynaklarla.",
    statMayors: "belediye başkanlığı görev süresi",
    statFinance: "tarihsel mali kayıt",
    statProgrammes: "program ve etkinlik",
    statDocuments: "birincil belge",
    currentMayor: "Görevdeki belediye başkanı",
    financeTitle: "Mali arşiv anlık görüntüleri",
    financeLead:
      "Tarihsel kaynaklardan nominal değerler. Eski leva tutarları modern BGN ile doğrudan karşılaştırılamaz ve arşiv işaretleri olarak gösterilir.",
    programmesTitle: "Belediyenin düzenledikleri",
    programmesLead:
      "Şehir yöneticilerini gerçek kamu programlarına bağlayan sosyal, kültürel ve yönetimsel eylem kayıtlarından bir seçki.",
    documentsTitle: "Birincil belgeler",
    documentsLead:
      "Belediye kararlarından ve Resmî Gazete'den çevriyazısı yapılmış kısa alıntılardan oluşan ilk katman. Her alıntı tam kamuya açık belgeye ve bağlantılı kayıtlara yönlendirir.",
    transcriptLabel: "Çevriyazısı yapılmış alıntı",
    linkedRecords: "Bağlantılı kayıtlar",
    documentTypes: {
      municipal_decision: "belediye kararı",
      state_gazette_decree: "devlet kararnamesi",
      municipal_rule: "belediye yönetmeliği",
      council_minutes: "tutanak",
      period_press: "dönem basını",
      other: "belge"
    },
    transcriptionTypes: {
      excerpt: "alıntı",
      full: "tam metin",
      diplomatic_excerpt: "diplomatik alıntı"
    },
    mayorsTitle: "Belediye başkanlarının tam kronolojisi",
    mayorsLead:
      "Bu, Plovdiv Belediyesi'nin resmî arşivinin bir iç kopyasıdır; İdari Sicil'den alınan mevcut görev süresiyle tamamlanmıştır.",
    amountLabel: "Tutar",
    yearLabel: "Yıl",
    sourceLabel: "Kaynak",
    noAmount: "tutar yayımlanmadı",
    viewBudget: "Bütçe grafiklerini aç"
  },
  mayors: {
    eyebrow: "Şehir yönetimi",
    title: "Plovdiv'in tüm belediye başkanları",
    lead:
      "Belediye başkanlığı görev sürelerinin eksiksiz bir kronolojisi; 1878'de Kurtuluş'tan sonraki ilk başkandan 2026'daki görevdeki başkana kadar.",
    sourceNote:
      "Temel, Plovdiv Belediyesi'nin resmî « Plovdiv Belediye Başkanları » sayfasıdır. Belediyenin tarihsel listesi hâlâ 2019-2023 görev süresinde durduğundan, mevcut görev süresi Bulgaristan İdari Sicili'nden eklenmiştir.",
    statTerms: "belediye başkanlığı görev süresi",
    statPeople: "farklı kişi",
    statYears: "kapsanan yıl",
    statCurrent: "görevdeki belediye başkanı",
    search: "Ara",
    searchPlaceholder: "Ad, yıl veya dönem",
    century: "Yüzyıl",
    status: "Durum",
    allCenturies: "Tüm yüzyıllar",
    allStatuses: "Tümü",
    currentOnly: "Yalnızca görevdeki başkan",
    actingOnly: "Yalnızca vekil başkanlar",
    reset: "Filtreleri temizle",
    count: (n: number) => `${n} ${plural(n, "görev süresi", "görev süresi")}`,
    countFiltered: (visible: number, total: number) =>
      `${total} ${plural(total, "görev süresi", "görev süresi")} içinden ${visible}`,
    empty: "Seçili filtrelere uyan görev süresi yok.",
    timelineTitle: "Kaydırılabilir zaman çizelgesi",
    timelineLead:
      "Her görev süresi arasında ilerlemek için yatay olarak kaydırın. Aşağıdaki ayrıntılı liste filtrelenebilir kalır.",
    detailsTitle: "Ayrıntılı liste",
    sourcesTitle: "Kapsam denetimi",
    sourcesText:
      "Yerel arşiv, resmî belediye listesindeki 65 görev süresinin tümünü ve Kostadin Dimitrov'un mevcut görev süresini içerir.",
    termNumber: "Görev süresi",
    years: "Yıllar",
    duration: "Yakl. süre",
    source: "Kaynak / daha fazla bilgi",
    currentBadge: "Görevde",
    actingBadge: "Vekil belediye başkanı",
    officialArchive: "Resmî liste",
    currentRegistry: "İdari Sicil",
    yearsApprox: (n: number) => `${n} ${plural(n, "yıl", "yıl")}`,
    centuryLabel: (century: number) => `${century}. yüzyıl`,
    centuryRange: (start: number, end: number) => `${start}–${end}`,
    openSource: "Kaynağı aç",
    profile: "Profil",
    backToAll: "Tüm belediye başkanlarına dön",
    otherTerms: "Aynı kişinin diğer görev süreleri",
    moreInfo: "Daha fazla bilgi",
    biography: "Biyografi",
    imageCredit: "Görsel kaynağı",
    officialProfile: "Resmî kaynak",
    referenceSource: "Ek kaynak",
    moreInfoLink: "Daha fazla bilgi",
    wikipediaArticle: "Wikipedia makalesi",
    wikipediaSearch: "Wikipedia'da ara",
    birthplaceLabel: "Doğum yeri",
    educationLabel: "Eğitim",
    rolesLabel: "Üstlenilen diğer görevler",
    profileLinks: "Profil ve bağlantılar",
    connectionsTitle: "Belediye başkanları arasındaki bağlar",
    connectionsLead:
      "Hangi başkanlar birden çok kez görev yaptı ve hangileri aileyle bağlı.",
    multiTermTitle: "Birden çok görev süreli başkanlar",
    familyTitle: "Aileler ve hanedanlar",
    legendSame: "Aynı başkan (tekrarlanan görev süresi)",
    legendFamily: "Aile bağı",
    legendKilled: "Öldürüldü",
    legendCurrent: "Görevde",
    fateHeading: "Akıbet",
    fateLabels: {
      killed: "Öldürüldü",
      executed: "İdam edildi",
      assassinated: "Suikaste uğradı",
      died_in_office: "Görevde öldü"
    },
    portraitNote: "Tarihsel portreler kamu malıdır.",
    portraitAlt: (name: string) => `${name} portresi`,
    birthTitle: "Belediye başkanları nerede doğdu",
    birthLead:
      "Belgelenmiş belediye başkanlarının doğum yerleri, haritada. Adları görmek için bir noktaya tıklayın.",
    birthByTown: "Belediye başkanı sayısına göre doğum yerleri",
    birthStatTowns: "doğum şehri",
    birthStatCountries: "ülke",
    birthPopupMayors: "Belediye başkanları",
    prevTerm: "Önceki",
    nextTerm: "Sonraki"
  },
  projects: {
    eyebrow: "Kamu projeleri",
    title: "Projeler",
    lead:
      "Başlığa göre arayın; kategoriye, duruma ve yıla göre filtreleyin. Her projenin kendi sayfası vardır.",
    dataNotice:
      "2025'te tamamlanan projelerin tek bir resmî kamu listesi yoktur. Bu nedenle projeler yalnızca mevcut kaynağa göre etiketlenir: 2026'da başlatılan/beklenen finansman, 2026 için yeni veya 2025-2026 için 0 BGN ile ertelenmiş.",
    search: "Ara",
    searchPlaceholder: "örn. kaldırım, park, durak",
    category: "Kategori",
    status: "Durum",
    year: "Yıl",
    reset: "Filtreleri temizle",
    count: (n: number) => `${n} ${plural(n, "proje", "proje")}`,
    countFiltered: (visible: number, total: number) =>
      `${total} ${plural(total, "proje", "proje")} içinden ${visible}`,
    empty: "Seçili filtrelere uyan proje yok."
  },
  community: {
    eyebrow: "Yurttaş katılımı",
    title: "Gönüllü girişimleri",
    lead:
      "Kamusal alanların temizliği, yenilenmesi ve bakımı için gönüllüleri harekete geçiren gerçek Plovdiv grupları ve kampanyaları.",
    dataNotice:
      "Kayıtlar kamuya açık kaynakların yapay zekâ aramasıyla bulunur veya bir yönetici tarafından eklenir. Her girişim, kaynaksız bir resmî belediye projesiyle karıştırılmaması için bir gruba, web sitesine veya kamuya açık bir gönderiye görünür bağlantılar tutmalıdır.",
    search: "Ara",
    searchPlaceholder: "örn. duraklar, Maritsa, Lauta",
    category: "Kategori",
    status: "Durum",
    organizer: "Düzenleyen",
    links: "Bağlantılar",
    sources: "Kaynaklar",
    relatedProjects: "İlgili kamu projeleri",
    noRelatedProjects: "İlgili kamu projesi yok.",
    discovered: "Bulan",
    lastChecked: "Son kontrol",
    viewSource: "Kaynak",
    contact: "İletişim / grup",
    reset: "Filtreleri temizle",
    count: (n: number) => `${n} ${plural(n, "girişim", "girişim")}`,
    countFiltered: (visible: number, total: number) =>
      `${total} ${plural(total, "girişim", "girişim")} içinden ${visible}`,
    empty: "Seçili filtrelere uyan girişim yok.",
    adminCta: "Yönetici: girişim ekle veya doğrula",
    seeProblems: "Yardım edebileceğin sorunları gör",
    donate: "Kuruluşa bağış yap",
    acceptsDonations: "Bağış kabul ediyor",
    donationsFilter: "Yalnızca bağış kabul edenler",
    donationDisclaimer: "Open Plovdiv bağış kabul etmez veya işlemez. « Bağış yap » bağlantıları doğrudan kuruluşların kendi sayfalarına yönlendirir."
  },
  project: {
    breadcrumb: "Projeler",
    keyFacts: "Temel bilgiler",
    budget: "Bütçe",
    year: "Yıl",
    funding: "Finansman",
    status: "Durum",
    district: "İlçe",
    location: "Konum",
    notSpecified: "Belirtilmemiş",
    sources: "Kaynaklar",
    sourcesNote:
      "Proje verileri kamuya açık kaynaklardan toplanır. Resmî ayrıntılar için orijinal kaynağa bakın.",
    noteLabel: "Not",
    noAmount: "Tutar yayımlanmadı.",
    approxLocation: "Yaklaşık konum (ilçeye göre).",
    provisional: "Geçici veriler",
    relatedBudget: "İlgili bütçe kalemi",
    noRelatedBudget: "İlgili bütçe kalemi yok.",
    communityInitiatives: "Gönüllü girişimleri",
    communityInitiativesText:
      "Bu alana veya konuya bağlı yurttaş grupları veya kampanyaları. Bu, resmî bir proje durumu değildir.",
    noCommunityInitiatives: "İlgili gönüllü girişimi yok.",
    nearbyReports: "Yakındaki bildirimler",
    noNearby: "1 km içinde yayımlanmış bildirim yok.",
    nearbyReportsText:
      "Kamuya açık harita yalnızca moderasyondan geçmiş yurttaş bildirimlerini gösterir. Bu alanın çevresinde şu anda yayımlanan bildirimleri görmek için haritayı açın.",
    timeline: "Zaman çizelgesi",
    noTimeline: "Zaman çizelgesi eklenmedi.",
    updated: "Güncellendi",
    mapLabel: "Proje haritası"
  },
  fixMap: {
    eyebrow: "Sorun haritası",
    title: "Şehir sorun haritası",
    lead:
      "Kişisel veri içermeyen yayımlanmış yurttaş bildirimleri. Kategoriye ve duruma göre filtreleyin, ayrıntıları ve yakındaki kamu projelerini görün.",
    notice:
      "Harita yalnızca form aracılığıyla gönderilen ve bir moderatör tarafından onaylanan bildirimleri gösterir. Durum, bir kaydın doğrulanmış, gönderilmiş, sürmekte veya kapalı olduğunu gösterir.",
    category: "Kategori",
    allCategories: "Tüm kategoriler",
    status: "Durum",
    allStatuses: "Tüm durumlar",
    radius: "Yakındaki projeler",
    radius500: "500 m içinde",
    radius1: "1 km içinde",
    radius2: "2 km içinde",
    visible: "Görünür kayıtlar",
    selectTitle: "Bir bildirim seçin",
    selectHint:
      "Ayrıntıları, durumu ve yakındaki projeleri görmek için bir işaretçiye tıklayın.",
    emptyTitle: "Henüz yayımlanmış bildirim yok",
    emptyText:
      "Gönderilen bildirimler bir moderatörün incelemesi ve onayından sonra burada görünür.",
    noFilterResults: "Bu filtrelere uyan bildirim yok",
    legend: "Açıklama",
    statusesTitle: "Durumların anlamı",
    officialTitle: "Resmî bildirim",
    officialText:
      "Gerçek sorunlar için belediyenin veya ilçe yönetiminin resmî kanallarını kullanın. Open Plovdiv, yayımlanmadan önce incelenen yurttaş bildirimlerini kabul eder, ancak resmî bildirimin yerini tutmaz.",
    officialLink: "Plovdiv Belediyesi",
    statusLabel: "Durum",
    nearbyProjects: "Yakındaki projeler",
    noNearbyRadius: "Seçili yarıçap içinde proje yok.",
    loadErrorTitle: "Veriler yüklenemedi",
    loadErrorText:
      "Kamuya açık JSON dosyalarının make data ile oluşturulduğunu kontrol edin.",
    reportCta: "Bir sorun bildir",
    communityBadge: "Yurttaş bildirimi",
    lastUpdated: "Güncellendi",
    justNow: "az önce",
    liveNote: "Harita her 30 saniyede bir otomatik olarak yenilenir.",
    newReports: "Yeni bildirimler: {count}",
    downloadCommunityData: "Yurttaş bildirimi verilerini indir"
  },
  civic: {
    title: "Nasıl yardım edebilirsin",
    lead:
      "Farklı sorunlar farklı eylemler gerektirir. Bazıları belediyenin sorumluluğundadır; bazıları ise yurttaşlar ve gönüllüler tarafından da iyileştirilebilir.",
    trackOfficial: "Resmî müdahale gerektirir",
    trackOfficialText:
      "Tehlikeli yollar, aydınlatma, drenaj ve altyapı onarımları belediye veya sorumlu kurum tarafından ele alınmalıdır.",
    trackCivic: "Yurttaş katılımına açık",
    trackCivicText:
      "Çöp temizliği, küçük yeşil iyileştirmeler, erişilebilirlik engellerinin haritalanması ve belgeleme yurttaşlar ve gruplarca düzenlenebilir.",
    trackBoth: "Paylaşılan sorumluluk",
    whatYouCanDo: "Neler yapabilirsin",
    actReportOfficial: "Belediyeye bildir",
    actJoinGroup: "Bir yurttaş grubuna katıl",
    actAddReport: "Sorunu haritada işaretle",
    actDocument: "Fotoğraflarla belgelemeye yardım et",
    actFollow: "Gelişmeleri takip et",
    groupsTitle: "Yardımcı olabilecek gruplar",
    noGroups: "Bu kategori için henüz bir grup listelenmedi.",
    seeAllGroups: "Tüm gönüllü gruplarını gör"
  },
  sources: {
    eyebrow: "Doğrulanabilirlik",
    title: "Veri kaynakları",
    lead:
      "Sitedeki her kayıt kamuya açık bir kaynağa bağlanır. Aşağıda kullanılan başlıca kaynaklar ve ne için kullanıldıkları yer alır.",
    colSource: "Kaynak",
    colUsedFor: "Kullanım amacı",
    colLimits: "Sınırlamalar",
    colAccessed: "Erişildi"
  },
  methodology: {
    eyebrow: "Nasıl çalışır",
    title: "Yöntem",
    lead:
      "Yapay zekâ kamuya açık kaynakları arar, proje ve bütçe kayıtlarını çıkarır ve yayımlamadan önce bunları şemalara, URL'lere, tutarlara ve koordinatlara göre doğrular. Yapay zekâ yine de yanılabileceği için kaynaklar görünür kalır.",
    collectTitle: "Yapay zekâ araması",
    collectText:
      "Yapay zekâ kamuya açık kaynakları — Plovdiv Belediyesi'nin bütçesini ve kararlarını, yatırım programını ve yerel medyayı — bulur ve karşılaştırır; her kayıt kullanılan kaynağa bir bağlantı içerir.",
    verifyTitle: "Yapay zekâ doğrulaması",
    verifyText:
      "Yapay zekâ alanları, durumları, URL'leri, tutarları, yılları, koordinatları ve bildirimlerde kişisel veri bulunmadığını çıkarır ve doğrular. Ardından JSON şemaları yapıyı yapımdan önce doğrular.",
    aiTitle: "Yapay zekâ",
    aiText:
      "Arama, özetleme ve doğrulama yapay zekâ tarafından gerçekleştirilir. Bir kaynak bir tutarı, durumu veya tamamlanma kaydını yayımlamadığında, site bunu uydurmak yerine eksik veya geçici veri olarak göstermelidir.",
    correctTitle: "Düzeltmeler",
    correctText:
      "Bir düzeltme, kamuya açık bir kaynak eklemeli veya değiştirmeli, düzenlenmiş JSON'u güncellemeli ve otomatik doğrulamayı ve yapımı geçmelidir."
  },
  privacy: {
    eyebrow: "Kişisel veri yok",
    title: "Gizlilik",
    lead:
      "İlk sürüm kullanıcı hesapları, yorumlar, oylamalar veya kişisel verilerin kamuya açık toplanması olmadan çalışır.",
    notCollectTitle: "Toplamadıklarımız",
    notCollectText:
      "Bildirimlerde ad, e-posta, telefon numarası, hesap veya kesin özel adres yok.",
    beforeTitle: "Yurttaş bildirimleri",
    beforeText:
      "Bildirimler bir kategori, kısa bir metin, haritada yaklaşık bir nokta ve isteğe bağlı fotoğraflar toplar. IP adresleri yalnızca hız sınırlaması için geçici bir karma olarak kullanılır ve hiçbir zaman açık metin olarak saklanmaz."
  },
  moderation: {
    eyebrow: "İncelenen yurttaş bildirimleri",
    title: "Moderasyon",
    lead:
      "Yurttaşlar şehir sorunları hakkında bildirim gönderebilir. Her bildirim bir editör tarafından incelenir ve yalnızca güvenliyse ve kamu yararınaysa yayımlanır.",
    notice:
      "Moderasyon ihtiyatlıdır: doğrulanabilir ve kişisel veri içermeyen şehir sorunları yayımlanır — hakaretler, suçlamalar veya siyasi kampanyalar değil. Fotoğraflar yalnızca incelemeden sonra yayımlanır ve gizlenebilir."
  },
  notFound: {
    eyebrow: "Hata 404",
    title: "Sayfa bulunamadı",
    text: "Bağlantı eski veya yanlış yazılmış olabilir. Ana sayfaya dönün ya da bir bölüm seçin."
  },
  reportForm: {
    eyebrow: "Yurttaş bildirimi",
    title: "Bir bildirim gönder",
    lead:
      "Bir kamusal şehir sorununu açıklayın ve konumunu haritada işaretleyin. Bir editör, haritada görünmeden önce her bildirimi inceler.",
    notice:
      "Kişisel veri girmeyin — adlar, telefon numaraları, e-postalar veya kesin özel adresler. Fotoğraflar elle incelenir ve onaylanmadan önce yayımlanmaz.",
    category: "Kategori",
    titleLabel: "Kısa başlık",
    titlePlaceholder: "örn. bir durağın yakınında bozuk kaldırım",
    description: "Açıklama",
    descriptionPlaceholder: "Sorunu kısaca ve nesnel olarak açıklayın.",
    photos: "Fotoğraflar",
    photoHint:
      "İsteğe bağlı, en fazla 3 fotoğraf, her biri en çok 5 MB. EXIF/GPS meta verileri kaldırılır ve fotoğraflar incelemeden önce dönüştürülür.",
    location: "Konum",
    locationHint: "Konumu işaretlemek için haritaya tıklayın.",
    selected: "Seçili nokta",
    noLocation: "Henüz nokta seçilmedi",
    confirmNoPersonal: "Bu bildirimin kişisel veri içermediğini onaylıyorum.",
    confirmPublicInterest: "Bunun kamu yararına bir konu olduğunu onaylıyorum.",
    submit: "Bildirimi gönder",
    submitting: "Gönderiliyor…",
    successTitle: "Teşekkürler!",
    successText:
      "Bildiriminiz alındı ve yayımlanmadan önce incelenecek. Referans numarası:",
    submitAnother: "Başka bir bildirim gönder",
    backToMap: "Haritaya dön",
    errorGeneric: "Bildirim gönderilemedi. Lütfen tekrar deneyin.",
    errRateLimited: "Kısa sürede çok fazla bildirim. Lütfen daha sonra deneyin.",
    errCategory: "Geçerli bir kategori seçin.",
    errTitle: "Başlık 3 ile 120 karakter arasında olmalıdır.",
    errDescription: "Açıklama 10 ile 1000 karakter arasında olmalıdır.",
    errPersonalData: "Metin kişisel veriye benzeyen bir şey içeriyor.",
    errLocation: "Plovdiv içinde bir nokta seçin.",
    errConfirmation: "Lütfen her iki onayı da işaretleyin.",
    errTooManyPhotos: "En fazla 3 fotoğraf yükleyin.",
    errPhotoLarge: "Her fotoğraf 5 MB veya daha küçük olmalıdır.",
    errPhotoType: "Yalnızca JPEG, PNG veya WebP fotoğraflara izin verilir.",
    errPhotoInvalid: "Fotoğraf işlenemedi."
  },
  admin: {
    title: "Bildirim moderasyonu",
    lead: "Yurttaş bildirimlerini yayımlamadan önce inceleyin. Erişim korumalıdır.",
    tokenLabel: "Yönetici belirteci",
    tokenPlaceholder: "Belirteci girin",
    signIn: "Giriş yap",
    signOut: "Çıkış yap",
    authError: "Geçersiz belirteç.",
    refresh: "Yenile",
    pendingTitle: "İnceleme bekliyor",
    noPending: "Bekleyen bildirim yok.",
    publicStatus: "Genel durum",
    rejectReason: "Reddetme nedeni (isteğe bağlı)",
    approve: "Onayla ve yayımla",
    reject: "Reddet",
    publishedTitle: "Yayımlanan bildirimler",
    noPublished: "Yayımlanmış yurttaş bildirimi yok.",
    saveStatus: "Durumu kaydet",
    editDetails: "Bildirim ayrıntıları",
    kind: "Kayıt türü",
    kindFix: "Sorun bildirimi",
    kindHistory: "Tarihsel katkı",
    saveDetails: "Ayrıntıları kaydet",
    titleBg: "Başlık (BG)",
    titleEn: "Başlık (EN, isteğe bağlı)",
    descriptionBg: "Açıklama (BG)",
    descriptionEn: "Açıklama (EN, isteğe bağlı)",
    category: "Kategori",
    latitude: "Enlem",
    longitude: "Boylam",
    addressBg: "Adres/yer imi (BG, isteğe bağlı)",
    addressEn: "Adres/yer imi (EN, isteğe bağlı)",
    photos: "Fotoğraflar",
    hidePhoto: "Fotoğrafı gizle",
    hiddenPhoto: "Gizlenmiş fotoğraf",
    moderationWarning:
      "Fotoğrafları yalnızca yüz, çocuk, plaka, belge, özel iç mekân veya kişisel bilgi içermiyorsa yayımlayın.",
    submitted: "Gönderildi",
    loading: "Yükleniyor…",
    actionError: "Eylem başarısız oldu."
  },
  adminCommunity: {
    title: "Gönüllü girişimleri",
    lead:
      "Kamuya açık bağlantılarla gerçek yurttaş gruplarını ve gönüllü kampanyalarını ekleyin ve güncelleyin.",
    tokenLabel: "Yönetici belirteci",
    tokenPlaceholder: "Belirteci girin",
    signIn: "Giriş yap",
    signOut: "Çıkış yap",
    authError: "Geçersiz belirteç.",
    refresh: "Yenile",
    discoveryTitle: "Yapay zekâ/çevrim içi arama",
    discoveryLead:
      "Kamuya açık sayfaları ve gönderileri arayın. Sonuçlar yalnızca kaynak önerir; bir yönetici neyi kaydedeceğini seçer.",
    queryLabel: "Ara",
    queryPlaceholder: "örn. Plovdiv gönüllüler otobüs durağı temizliği",
    find: "Çevrim içi ara",
    sourceUrl: "Kaynak URL'si",
    inspectUrl: "URL'yi incele",
    noCandidates: "Sonuç bulunamadı.",
    useCandidate: "Kaynak olarak kullan",
    formTitle: "Girişim ekle veya güncelle",
    id: "Kimlik (isteğe bağlı)",
    titleBg: "Başlık (BG)",
    titleEn: "Başlık (EN)",
    summaryBg: "Özet (BG)",
    summaryEn: "Özet (EN, isteğe bağlı)",
    category: "Kategori",
    status: "Durum",
    organizerBg: "Düzenleyen (BG)",
    organizerEn: "Düzenleyen (EN, isteğe bağlı)",
    organizerType: "Düzenleyen türü",
    website: "Web sitesi",
    facebook: "Facebook",
    donationUrl: "Bağış bağlantısı (isteğe bağlı)",
    callToActionBg: "Eylem çağrısı (BG, isteğe bağlı)",
    callToActionEn: "Eylem çağrısı (EN, isteğe bağlı)",
    addressBg: "Adres/bölge (BG)",
    addressEn: "Adres/bölge (EN, isteğe bağlı)",
    latitude: "Enlem",
    longitude: "Boylam",
    relatedProjects: "İlgili proje kimlikleri (virgülle ayrılmış)",
    tags: "Etiketler (virgülle ayrılmış)",
    sourceTitle: "Kaynak başlığı",
    sourceUrlLabel: "Kaynak bağlantısı",
    save: "Girişimi kaydet",
    saved: "Girişim kaydedildi.",
    existingTitle: "Kaydedilen girişimler",
    noExisting: "Kaydedilmiş girişim yok.",
    edit: "Düzenle",
    loading: "Yükleniyor…",
    actionError: "Eylem başarısız oldu."
  }
};

const es: typeof bg = {
  site: {
    name: "Open Plovdiv",
    short: "OP",
    tagline:
      "Proyectos públicos, dinero público, problemas públicos — presentados con claridad.",
    skip: "Ir al contenido",
    menu: "Menú",
    close: "Cerrar",
    theme: "Tema claro / oscuro",
    langName: "Idioma",
    langSwitch: "Elegir idioma"
  },
  nav: {
    home: "Inicio",
    history: "Historia",
    mayors: "Alcaldes",
    people: "Personas",
    places: "Lugares",
    stories: "Relatos",
    education: "Educación",
    overview: "Resumen",
    fixMap: "Mapa",
    budget: "Presupuesto",
    projects: "Proyectos",
    community: "Voluntarios",
    archive: "Archivo",
    sources: "Fuentes"
  },
  overview: {
    eyebrow: "Resumen visual",
    title: "Resumen en gráficos",
    lead:
      "Una visión de conjunto de los proyectos seguidos y del dinero público de Plovdiv — por estado, categoría y año, con fuentes.",
    asOf: "Datos a junio de 2026",
    statProjects: "proyectos seguidos",
    statPostponed: "proyectos aplazados",
    statCapital2025: "programa de inversiones 2025",
    statCapital2026: "programa de inversiones 2026 (provisional)",
    unitProjects: "Número de proyectos seguidos",
    unitSharePercent: "Cuota del programa de inversiones (%)",
    unitEur: "Importes en euros (€)",
    byStatusTitle: "Proyectos por estado",
    byCategoryTitle: "Proyectos por categoría",
    byYearTitle: "Proyectos por año presupuestario",
    sector2025Title: "Programa de inversiones 2025 por sector",
    funding2026Title: "Financiación del programa de inversiones 2026",
    capitalTrendTitle: "Programa de inversiones por año",
    capitalTrendNote:
      "Programa de inversiones por año (en BGN). Las cifras de 2013-2018 proceden de decisiones del Consejo Municipal; los años más recientes usan páginas oficiales y publicaciones públicas. 2026 es provisional y se ha convertido desde unos 87 M€ al cambio de 1,95583.",
    totalTrendTitle: "Presupuesto total de Plovdiv por año",
    totalTrendNote:
      "Presupuesto anual total del Municipio de Plovdiv (en BGN). El archivo incluye la ejecución de 2010 y los presupuestos aprobados de 2011-2018; los valores de 2020, 2022 y 2024 siguen siendo aproximados/redondeados. Cada año enlaza con una fuente pública.",
    historyNote:
      "Las cifras proceden de fuentes públicas (presupuestos municipales y publicaciones de los medios). Verifique con los documentos originales antes de citar un valor concreto.",
    year2025: "2025",
    year2026: "2026 (provisional)",
    sourcesNote: "Todos los valores tienen fuentes públicas.",
    viewBudget: "Ir al presupuesto",
    viewProjects: "Ir a los proyectos"
  },
  footer: {
    blurb:
      "Un proyecto de datos públicos sin ánimo de lucro para Plovdiv. Sin cuentas, sin comentarios, sin base de datos.",
    explore: "Explorar",
    civic: "Datos ciudadanos",
    about: "Acerca de",
    privacy: "Privacidad",
    moderation: "Moderación",
    community: "Voluntarios",
    methodology: "Metodología",
    sources: "Fuentes",
    note: "Open Plovdiv · datos públicos para Plovdiv",
    dataNote: "Datos de fuentes públicas · actualizado en junio de 2026.",
    rights: "Datos públicos"
  },
  common: {
    all: "Todos",
    accessed: "consultado",
    source: "Fuente",
    loading: "Cargando…",
    error: "Algo salió mal.",
    backHome: "Volver al inicio",
    noSource: "Sin fuente pública."
  },
  home: {
    eyebrow: "Una de las ciudades más antiguas del mundo",
    lead:
      "Plovdiv vive desde hace más de 8000 años. La Eumolpíade tracia, la Filipópolis de Filipo II de Macedonia, la Trimontium romana, la Filibe otomana — y la ciudad de la Unificación.",
    ctaHistory: "Explorar la cronología",
    ctaMayors: "Los alcaldes de Plovdiv",
    statYearsValue: "8000+",
    statYears: "años de historia",
    statEras: "épocas",
    statMayors: "alcaldes",
    statLandmarks: "monumentos",
    featuredTitle: "Momentos de la historia",
    civicTitle: "Datos ciudadanos sobre la ciudad de hoy",
    civicLead:
      "Más allá de la historia, Open Plovdiv también mantiene datos públicos sobre la ciudad moderna — presupuesto, proyectos, avisos ciudadanos y voluntarios, cada uno con una fuente pública.",
    ctaMap: "Abrir el mapa de problemas",
    ctaBudget: "¿Adónde van los impuestos locales?",
    statsLabel: "Datos seguidos",
    statProjects: "proyectos seguidos",
    statReportsValue: "En directo",
    statReports: "avisos moderados",
    statCommunity: "iniciativas de voluntariado",
    statBudget: "sectores del presupuesto",
    statTotal: "programa de inversiones 2025",
    exploreTitle: "Por dónde empezar",
    cardMapEyebrow: "Mapa",
    cardMapTitle: "Mapa de problemas",
    cardMapText:
      "Vea los avisos ciudadanos publicados por categoría y estado, con los proyectos públicos cercanos.",
    cardBudgetEyebrow: "Presupuesto",
    cardBudgetTitle: "Impuestos locales",
    cardBudgetText:
      "Presupuesto 2025 y programa de inversiones provisional 2026 — importes, cuotas y fuentes públicas.",
    cardProjectsEyebrow: "Proyectos",
    cardProjectsTitle: "Proyectos públicos",
    cardProjectsText:
      "Busque y filtre las fichas de proyecto con presupuesto, estado y fuentes.",
    cardCommunityEyebrow: "Voluntarios",
    cardCommunityTitle: "Iniciativas ciudadanas",
    cardCommunityText:
      "Grupos y campañas que organizan limpiezas, cuidado de paradas, parques y trabajos de barrio.",
    cardArchiveEyebrow: "Archivo",
    cardArchiveTitle: "Alcaldes y datos históricos",
    cardArchiveText:
      "Una cronología interna completa de los mandatos de los alcaldes, antiguos registros financieros y programas municipales.",
    cardMayorsEyebrow: "Alcaldes",
    cardMayorsTitle: "Todos los alcaldes de Plovdiv",
    cardMayorsText:
      "Cronología detallada desde 1878 hasta el mandato actual, con búsqueda, siglos y fuentes.",
    latestProjects: "Proyectos actualizados recientemente",
    latestReports: "Avisos añadidos recientemente",
    liveReportsTitle: "Avisos reales tras la moderación",
    liveReportsText:
      "El mapa ahora muestra solo los avisos ciudadanos enviados mediante el formulario y aprobados por un moderador.",
    viewAll: "Ver todo",
    noticeTitle: "Datos y fuentes",
    notice:
      "Los datos están actualizados a junio de 2026. El presupuesto de 2025 está aprobado, mientras que el programa de inversiones de 2026 es provisional. Cada ficha enlaza con una fuente pública.",
    noticeSources: "Ver las fuentes",
    noticeMethodology: "la metodología"
  },
  history: {
    eyebrow: "La cronología de la ciudad",
    title: "La historia de Plovdiv",
    lead:
      "Más de ocho milenios sobre siete colinas — desde la Eumolpíade tracia y la Trimontium romana, pasando por la Filibe otomana y el Renacimiento Nacional, hasta la Unificación y nuestros días.",
    timelineTitle: "Cronología",
    timelineLead:
      "Los momentos clave de la historia de la ciudad, ordenados por época. Cada entrada enlaza con una fuente pública.",
    erasTitle: "Las épocas de Plovdiv",
    erasNav: "Épocas",
    landmarksTitle: "Monumentos",
    landmarksLead:
      "Monumentos que cuentan la historia de la ciudad — desde la ciudadela tracia hasta el casco antiguo del Renacimiento.",
    mayorsTitle: "Los alcaldes de Plovdiv",
    mayorsLead:
      "68 mandatos desde la Liberación hasta hoy — una cronología detallada con biografías y fuentes públicas.",
    mayorsCta: "Ver todos los alcaldes",
    sourceNote:
      "Los datos históricos se resumen a partir de fuentes públicas (Wikipedia y páginas oficiales). Compruebe la fuente original antes de citar un dato concreto.",
    statYears: "años de historia",
    statEras: "épocas",
    statLandmarks: "monumentos",
    eraLabels: {
      prehistory: "Prehistoria",
      thracian: "Época tracia",
      roman: "Época romana",
      medieval: "Edad Media",
      ottoman: "Época otomana",
      revival: "Renacimiento Nacional",
      liberation: "Liberación y Unificación",
      modern: "Época moderna"
    },
    eraBlurbs: {
      prehistory: "Asentamientos en las colinas ya desde el VI milenio a. C.",
      thracian: "La Eumolpíade tracia y la Filipópolis de Filipo II de Macedonia.",
      roman: "Trimontium — una espléndida ciudad romana con teatro y estadio.",
      medieval: "Siglos de control alternado entre Bulgaria y Bizancio.",
      ottoman: "Cinco siglos con el nombre de Filibe — una encrucijada de los Balcanes.",
      revival: "El despertar educativo y eclesiástico búlgaro.",
      liberation: "La Liberación, la capital de Rumelia Oriental y la Unificación.",
      modern: "La ciudad de las ferias y una Capital Europea de la Cultura."
    }
  },
  budget: {
    eyebrow: "¿Adónde van los impuestos locales?",
    title: "Presupuesto y programa de inversiones",
    lead:
      "El presupuesto de 2025, el programa de inversiones provisional de 2026 y el archivo histórico del gobierno municipal — con importes, cuotas y fuentes públicas claramente indicados.",
    totalLabel: "Presupuesto total 2025",
    capitalLabel: "Programa de inversiones 2025",
    sectorTitle: "Programa de inversiones 2025 por sector",
    approxNote:
      "Los valores por sector son aproximados — derivados de las cuotas publicadas del programa de inversiones.",
    shareOfTotal: "cuota del programa de inversiones",
    provTitle: "Programa de inversiones 2026 (provisional)",
    provText:
      "2026 es el primer presupuesto de Plovdiv en euros. El programa de inversiones provisional es de unos 87 millones de euros. Las cifras son provisionales y pueden cambiar una vez aprobado el presupuesto del Estado.",
    fundingTitle: "Fuentes de financiación 2026",
    fundEu: "Fondos de la UE",
    fundOwn: "Ingresos propios y remanente",
    fundOpco: "Cofinanciación de programas",
    fundState: "Subvención específica del Estado",
    fundOther: "Otros (donaciones, préstamos)",
    historyTitle: "Archivo histórico del presupuesto",
    historyLead:
      "El archivo incluye ahora el presupuesto aprobado de 2002, el gasto de inversión ejecutado de 2005-2007, la ejecución de 2010, los totales de presupuestos aprobados desde 2011 y cifras más antiguas del programa de inversiones cuando las decisiones las publican por separado.",
    totalHistoryTitle: "Presupuesto total y ejecución",
    capitalHistoryTitle: "Programa de inversiones",
    historyNote:
      "2008 es un valor de anteproyecto de presupuesto de una fuente secundaria y está marcado como provisional/borrador. Los valores del gráfico de inversiones de 2005-2007 y el valor del gráfico del total de 2010 son cifras ejecutadas, no dotaciones aprobadas inicialmente. Las decisiones más antiguas son a veces documentos escaneados que reparten de forma distinta el gasto delegado, local y de inversión. Considere los gráficos como un archivo navegable y cite las cifras exactas del documento original.",
    executedShort: "ejec.",
    provisionalShort: "borrador",
    mayorsTitle: "Quién gobernó la ciudad",
    mayorsLead:
      "El archivo incluye los mandatos de alcalde publicados oficialmente desde 1878 y el alcalde actual verificado en el Registro Administrativo búlgaro.",
    mayorTermCount: "mandatos de alcalde en el archivo",
    currentMayorLabel: "alcalde en funciones",
    recentMayorsTitle: "Mandatos recientes",
    earlyMayorsTitle: "Primeros registros tras la Liberación",
    fullMayorArchive: "Archivo completo de alcaldes",
    eventsTitle: "Eventos y programas",
    eventsLead:
      "Un breve archivo de iniciativas municipales destacadas que ayuda a relacionar los años presupuestarios con los programas públicos y los eventos culturales.",
    sourceLabel: "Fuente"
  },
  archive: {
    eyebrow: "Archivo histórico",
    title: "Alcaldes, presupuestos y programas municipales",
    lead:
      "Un archivo interno del gobierno de Plovdiv: mandatos de alcalde, registros financieros históricos, programas culturales y sociales, con fuentes visibles.",
    statMayors: "mandatos de alcalde",
    statFinance: "registros financieros históricos",
    statProgrammes: "programas y eventos",
    statDocuments: "documentos primarios",
    currentMayor: "Alcalde en funciones",
    financeTitle: "Instantáneas del archivo financiero",
    financeLead:
      "Valores nominales de fuentes históricas. Los importes antiguos en levas no son directamente comparables con el BGN moderno y se muestran como marcadores de archivo.",
    programmesTitle: "Lo que organizó el municipio",
    programmesLead:
      "Una selección de fichas de acciones sociales, culturales y de gobierno que relacionan a los líderes de la ciudad con programas públicos reales.",
    documentsTitle: "Documentos primarios",
    documentsLead:
      "Una primera capa de breves extractos transcritos de actos municipales y del Boletín Oficial del Estado. Cada extracto remite al documento público completo y a las fichas relacionadas.",
    transcriptLabel: "Extracto transcrito",
    linkedRecords: "Registros relacionados",
    documentTypes: {
      municipal_decision: "decisión municipal",
      state_gazette_decree: "decreto estatal",
      municipal_rule: "reglamento municipal",
      council_minutes: "acta",
      period_press: "prensa de la época",
      other: "documento"
    },
    transcriptionTypes: {
      excerpt: "extracto",
      full: "texto completo",
      diplomatic_excerpt: "extracto diplomático"
    },
    mayorsTitle: "Cronología completa de los alcaldes",
    mayorsLead:
      "Es una copia interna del archivo oficial del Municipio de Plovdiv, completada con el mandato actual del Registro Administrativo.",
    amountLabel: "Importe",
    yearLabel: "Año",
    sourceLabel: "Fuente",
    noAmount: "importe no publicado",
    viewBudget: "Abrir los gráficos del presupuesto"
  },
  mayors: {
    eyebrow: "Gobierno municipal",
    title: "Todos los alcaldes de Plovdiv",
    lead:
      "Una cronología completa de los mandatos de alcalde, desde el primer alcalde tras la Liberación en 1878 hasta el alcalde en funciones en 2026.",
    sourceNote:
      "La base es la página oficial « Alcaldes de Plovdiv » del Municipio de Plovdiv. El mandato actual se añade desde el Registro Administrativo de Bulgaria, porque la lista histórica municipal todavía se detiene en el mandato 2019-2023.",
    statTerms: "mandatos de alcalde",
    statPeople: "personas distintas",
    statYears: "años cubiertos",
    statCurrent: "alcalde en funciones",
    search: "Buscar",
    searchPlaceholder: "Nombre, año o periodo",
    century: "Siglo",
    status: "Estado",
    allCenturies: "Todos los siglos",
    allStatuses: "Todos",
    currentOnly: "Solo alcalde en funciones",
    actingOnly: "Solo alcaldes en funciones interinas",
    reset: "Borrar filtros",
    count: (n: number) => `${n} ${plural(n, "mandato", "mandatos")}`,
    countFiltered: (visible: number, total: number) =>
      `${visible} de ${total} ${plural(total, "mandato", "mandatos")}`,
    empty: "Ningún mandato coincide con los filtros seleccionados.",
    timelineTitle: "Cronología desplazable",
    timelineLead:
      "Desplácese horizontalmente para recorrer cada mandato. La lista detallada de abajo sigue siendo filtrable.",
    detailsTitle: "Lista detallada",
    sourcesTitle: "Comprobación de cobertura",
    sourcesText:
      "El archivo local contiene los 65 mandatos de la lista municipal oficial, más el mandato actual de Kostadin Dimitrov.",
    termNumber: "Mandato",
    years: "Años",
    duration: "Duración aprox.",
    source: "Fuente / más información",
    currentBadge: "En funciones",
    actingBadge: "Alcalde interino",
    officialArchive: "Lista oficial",
    currentRegistry: "Registro Administrativo",
    yearsApprox: (n: number) => `${n} ${plural(n, "año", "años")}`,
    centuryLabel: (century: number) => `siglo ${century}`,
    centuryRange: (start: number, end: number) => `${start}–${end}`,
    openSource: "Abrir la fuente",
    profile: "Perfil",
    backToAll: "Volver a todos los alcaldes",
    otherTerms: "Otros mandatos de la misma persona",
    moreInfo: "Más información",
    biography: "Biografía",
    imageCredit: "Crédito de la imagen",
    officialProfile: "Fuente oficial",
    referenceSource: "Fuente adicional",
    moreInfoLink: "Más información",
    wikipediaArticle: "Artículo de Wikipedia",
    wikipediaSearch: "Buscar en Wikipedia",
    birthplaceLabel: "Lugar de nacimiento",
    educationLabel: "Formación",
    rolesLabel: "Otros cargos ocupados",
    profileLinks: "Perfil y enlaces",
    connectionsTitle: "Conexiones entre los alcaldes",
    connectionsLead:
      "Qué alcaldes ejercieron más de una vez y cuáles están emparentados.",
    multiTermTitle: "Alcaldes con varios mandatos",
    familyTitle: "Familias y dinastías",
    legendSame: "Mismo alcalde (mandato repetido)",
    legendFamily: "Vínculo familiar",
    legendKilled: "Asesinado",
    legendCurrent: "En funciones",
    fateHeading: "Destino",
    fateLabels: {
      killed: "Asesinado",
      executed: "Ejecutado",
      assassinated: "Asesinado",
      died_in_office: "Falleció en el cargo"
    },
    portraitNote: "Los retratos históricos son de dominio público.",
    portraitAlt: (name: string) => `Retrato de ${name}`,
    birthTitle: "Dónde nacieron los alcaldes",
    birthLead:
      "Los lugares de nacimiento de los alcaldes documentados, en el mapa. Haga clic en un punto para ver los nombres.",
    birthByTown: "Lugares de nacimiento por número de alcaldes",
    birthStatTowns: "ciudades de nacimiento",
    birthStatCountries: "países",
    birthPopupMayors: "Alcaldes",
    prevTerm: "Anterior",
    nextTerm: "Siguiente"
  },
  projects: {
    eyebrow: "Proyectos públicos",
    title: "Proyectos",
    lead:
      "Busque por título y filtre por categoría, estado y año. Cada proyecto tiene su propia página.",
    dataNotice:
      "No existe una única lista pública oficial de los proyectos completados en 2025. Por eso los proyectos se etiquetan solo según la fuente disponible: financiación iniciada/prevista en 2026, nuevo para 2026, o aplazado con 0 BGN para 2025-2026.",
    search: "Buscar",
    searchPlaceholder: "p. ej. acera, parque, parada",
    category: "Categoría",
    status: "Estado",
    year: "Año",
    reset: "Borrar filtros",
    count: (n: number) => `${n} ${plural(n, "proyecto", "proyectos")}`,
    countFiltered: (visible: number, total: number) =>
      `${visible} de ${total} ${plural(total, "proyecto", "proyectos")}`,
    empty: "Ningún proyecto coincide con los filtros seleccionados."
  },
  community: {
    eyebrow: "Participación ciudadana",
    title: "Iniciativas de voluntariado",
    lead:
      "Grupos y campañas reales de Plovdiv que movilizan voluntarios para la limpieza, la renovación y el cuidado de los espacios públicos.",
    dataNotice:
      "Las fichas se descubren mediante búsqueda con IA en fuentes públicas o las añade un administrador. Cada iniciativa debe conservar enlaces visibles a un grupo, un sitio web o una publicación pública, para no confundirse con un proyecto municipal oficial sin fuente.",
    search: "Buscar",
    searchPlaceholder: "p. ej. paradas, Maritsa, Lauta",
    category: "Categoría",
    status: "Estado",
    organizer: "Organizador",
    links: "Enlaces",
    sources: "Fuentes",
    relatedProjects: "Proyectos públicos relacionados",
    noRelatedProjects: "Ningún proyecto público relacionado.",
    discovered: "Descubierto por",
    lastChecked: "Última comprobación",
    viewSource: "Fuente",
    contact: "Contacto / grupo",
    reset: "Borrar filtros",
    count: (n: number) => `${n} ${plural(n, "iniciativa", "iniciativas")}`,
    countFiltered: (visible: number, total: number) =>
      `${visible} de ${total} ${plural(total, "iniciativa", "iniciativas")}`,
    empty: "Ninguna iniciativa coincide con los filtros seleccionados.",
    adminCta: "Admin: añadir o verificar iniciativa",
    seeProblems: "Ver problemas en los que puedes ayudar",
    donate: "Donar a la organización",
    acceptsDonations: "Acepta donaciones",
    donationsFilter: "Solo las que aceptan donaciones",
    donationDisclaimer: "Open Plovdiv no acepta ni gestiona donaciones. Los enlaces « Donar » llevan directamente a las propias páginas de las organizaciones."
  },
  project: {
    breadcrumb: "Proyectos",
    keyFacts: "Datos clave",
    budget: "Presupuesto",
    year: "Año",
    funding: "Financiación",
    status: "Estado",
    district: "Distrito",
    location: "Ubicación",
    notSpecified: "Sin especificar",
    sources: "Fuentes",
    sourcesNote:
      "Los datos del proyecto se recopilan de fuentes públicas. Para detalles oficiales, consulte la fuente original.",
    noteLabel: "Nota",
    noAmount: "Importe no publicado.",
    approxLocation: "Ubicación aproximada (por distrito).",
    provisional: "Datos provisionales",
    relatedBudget: "Partida presupuestaria relacionada",
    noRelatedBudget: "Ninguna partida presupuestaria relacionada.",
    communityInitiatives: "Iniciativas de voluntariado",
    communityInitiativesText:
      "Grupos o campañas ciudadanas relacionados con esta zona o tema. No es un estado oficial del proyecto.",
    noCommunityInitiatives: "Ninguna iniciativa de voluntariado relacionada.",
    nearbyReports: "Avisos cercanos",
    noNearby: "Sin avisos publicados en un radio de 1 km.",
    nearbyReportsText:
      "El mapa público muestra solo los avisos ciudadanos moderados. Abra el mapa para ver los avisos publicados actualmente en torno a esta zona.",
    timeline: "Cronología",
    noTimeline: "Sin cronología añadida.",
    updated: "Actualizado",
    mapLabel: "Mapa del proyecto"
  },
  fixMap: {
    eyebrow: "Mapa de problemas",
    title: "Mapa de problemas de la ciudad",
    lead:
      "Avisos ciudadanos publicados sin datos personales. Filtre por categoría y estado, vea los detalles y los proyectos públicos cercanos.",
    notice:
      "El mapa muestra solo los avisos enviados mediante el formulario y aprobados por un moderador. El estado indica si una ficha está verificada, enviada, en curso o cerrada.",
    category: "Categoría",
    allCategories: "Todas las categorías",
    status: "Estado",
    allStatuses: "Todos los estados",
    radius: "Proyectos cercanos",
    radius500: "en 500 m",
    radius1: "en 1 km",
    radius2: "en 2 km",
    visible: "Fichas visibles",
    selectTitle: "Seleccione un aviso",
    selectHint:
      "Haga clic en un marcador para ver detalles, estado y proyectos cercanos.",
    emptyTitle: "Aún no hay avisos publicados",
    emptyText:
      "Los avisos enviados aparecen aquí tras la revisión y aprobación por un moderador.",
    noFilterResults: "Ningún aviso coincide con estos filtros",
    legend: "Leyenda",
    statusesTitle: "Qué significan los estados",
    officialTitle: "Aviso oficial",
    officialText:
      "Para problemas reales, use los canales oficiales del municipio o de la administración del distrito. Open Plovdiv acepta avisos ciudadanos que se revisan antes de publicarse, pero no sustituye al aviso oficial.",
    officialLink: "Municipio de Plovdiv",
    statusLabel: "Estado",
    nearbyProjects: "Proyectos cercanos",
    noNearbyRadius: "Ningún proyecto dentro del radio seleccionado.",
    loadErrorTitle: "No se pudieron cargar los datos",
    loadErrorText:
      "Compruebe que los archivos JSON públicos se generaron con make data.",
    reportCta: "Informar de un problema",
    communityBadge: "Aviso ciudadano",
    lastUpdated: "Actualizado",
    justNow: "ahora mismo",
    liveNote: "El mapa se actualiza automáticamente cada 30 segundos.",
    newReports: "Nuevos avisos: {count}",
    downloadCommunityData: "Descargar los datos de avisos ciudadanos"
  },
  civic: {
    title: "Cómo puedes ayudar",
    lead:
      "Problemas distintos requieren acciones distintas. Algunos son responsabilidad del municipio; otros también pueden mejorarlos los ciudadanos y los voluntarios.",
    trackOfficial: "Requiere acción oficial",
    trackOfficialText:
      "Las carreteras peligrosas, la iluminación, el drenaje y las reparaciones de infraestructura deben gestionarlos el municipio o la institución responsable.",
    trackCivic: "Abierto a la participación ciudadana",
    trackCivicText:
      "Las limpiezas de basura, las pequeñas mejoras verdes, el mapeo de barreras de accesibilidad y la documentación pueden organizarlos los ciudadanos y los grupos.",
    trackBoth: "Responsabilidad compartida",
    whatYouCanDo: "Qué puedes hacer",
    actReportOfficial: "Informar al municipio",
    actJoinGroup: "Unirte a un grupo ciudadano",
    actAddReport: "Marcar el problema en el mapa",
    actDocument: "Ayudar a documentarlo con fotos",
    actFollow: "Seguir los avances",
    groupsTitle: "Grupos que pueden ayudar",
    noGroups: "Todavía no hay ningún grupo listado para esta categoría.",
    seeAllGroups: "Ver todos los grupos de voluntarios"
  },
  sources: {
    eyebrow: "Verificabilidad",
    title: "Fuentes de datos",
    lead:
      "Cada ficha del sitio enlaza con una fuente pública. A continuación se indican las principales fuentes usadas y para qué sirven.",
    colSource: "Fuente",
    colUsedFor: "Usada para",
    colLimits: "Limitaciones",
    colAccessed: "Consultada"
  },
  methodology: {
    eyebrow: "Cómo funciona",
    title: "Metodología",
    lead:
      "La IA busca en fuentes públicas, extrae fichas de proyecto y de presupuesto y las comprueba frente a esquemas, URL, importes y coordenadas antes de la publicación. Las fuentes siguen visibles porque la IA aún puede equivocarse.",
    collectTitle: "Búsqueda con IA",
    collectText:
      "La IA encuentra y compara fuentes públicas — el presupuesto y las decisiones del Municipio de Plovdiv, el programa de inversiones y los medios locales — y cada ficha incluye un enlace a la fuente usada.",
    verifyTitle: "Verificación con IA",
    verifyText:
      "La IA extrae y comprueba campos, estados, URL, importes, años, coordenadas y la ausencia de datos personales en los avisos. Luego los esquemas JSON validan la estructura antes de la compilación.",
    aiTitle: "IA",
    aiText:
      "La búsqueda, el resumen y la verificación los realiza la IA. Cuando una fuente no publica un importe, un estado o una ficha de finalización, el sitio debe mostrarlo como dato faltante o provisional en lugar de inventarlo.",
    correctTitle: "Correcciones",
    correctText:
      "Una corrección debe añadir o cambiar una fuente pública, actualizar el JSON curado y pasar la validación automática y la compilación."
  },
  privacy: {
    eyebrow: "Sin datos personales",
    title: "Privacidad",
    lead:
      "La primera versión funciona sin cuentas de usuario, comentarios, votaciones ni recopilación pública de datos personales.",
    notCollectTitle: "Lo que no recopilamos",
    notCollectText:
      "Sin nombres, correos, números de teléfono, cuentas ni direcciones privadas exactas en los avisos.",
    beforeTitle: "Avisos ciudadanos",
    beforeText:
      "Los avisos recopilan una categoría, un texto breve, un punto aproximado en el mapa y fotos opcionales. Las direcciones IP se usan solo como un hash temporal para limitar la frecuencia y nunca se almacenan en texto claro."
  },
  moderation: {
    eyebrow: "Avisos ciudadanos revisados",
    title: "Moderación",
    lead:
      "Los ciudadanos pueden enviar avisos sobre problemas de la ciudad. Cada aviso lo revisa un editor y solo se publica si es seguro y de interés público.",
    notice:
      "La moderación es prudente: se publican los problemas urbanos verificables y sin datos personales — no insultos, acusaciones ni campañas políticas. Las fotos se publican solo tras la revisión y pueden ocultarse."
  },
  notFound: {
    eyebrow: "Error 404",
    title: "Página no encontrada",
    text: "El enlace puede estar obsoleto o mal escrito. Vuelva al inicio o elija una sección."
  },
  reportForm: {
    eyebrow: "Aviso ciudadano",
    title: "Enviar un aviso",
    lead:
      "Describa un problema público de la ciudad y marque su ubicación en el mapa. Un editor revisa cada aviso antes de que aparezca en el mapa.",
    notice:
      "No introduzca datos personales — nombres, números de teléfono, correos o direcciones privadas exactas. Las fotos se revisan manualmente y no se publican antes de su aprobación.",
    category: "Categoría",
    titleLabel: "Título breve",
    titlePlaceholder: "p. ej. acera irregular cerca de una parada",
    description: "Descripción",
    descriptionPlaceholder: "Describa el problema de forma breve y objetiva.",
    photos: "Fotos",
    photoHint:
      "Opcional, hasta 3 fotos, máximo 5 MB cada una. Los metadatos EXIF/GPS se eliminan y las fotos se convierten antes de la revisión.",
    location: "Ubicación",
    locationHint: "Haga clic en el mapa para marcar el lugar.",
    selected: "Punto seleccionado",
    noLocation: "Aún no hay ningún punto seleccionado",
    confirmNoPersonal: "Confirmo que este aviso no contiene datos personales.",
    confirmPublicInterest: "Confirmo que es una cuestión de interés público.",
    submit: "Enviar aviso",
    submitting: "Enviando…",
    successTitle: "¡Gracias!",
    successText:
      "Su aviso se ha recibido y se revisará antes de publicarse. Número de referencia:",
    submitAnother: "Enviar otro aviso",
    backToMap: "Volver al mapa",
    errorGeneric: "No se pudo enviar el aviso. Inténtelo de nuevo.",
    errRateLimited: "Demasiados avisos en poco tiempo. Inténtelo más tarde.",
    errCategory: "Elija una categoría válida.",
    errTitle: "El título debe tener entre 3 y 120 caracteres.",
    errDescription: "La descripción debe tener entre 10 y 1000 caracteres.",
    errPersonalData: "El texto contiene algo que parece un dato personal.",
    errLocation: "Elija un punto dentro de Plovdiv.",
    errConfirmation: "Marque ambas confirmaciones.",
    errTooManyPhotos: "Suba como máximo 3 fotos.",
    errPhotoLarge: "Cada foto debe ser de 5 MB o menos.",
    errPhotoType: "Solo se permiten fotos JPEG, PNG o WebP.",
    errPhotoInvalid: "No se pudo procesar la foto."
  },
  admin: {
    title: "Moderación de avisos",
    lead: "Revise los avisos ciudadanos antes de publicarlos. El acceso está protegido.",
    tokenLabel: "Token de administrador",
    tokenPlaceholder: "Introduzca el token",
    signIn: "Iniciar sesión",
    signOut: "Cerrar sesión",
    authError: "Token no válido.",
    refresh: "Actualizar",
    pendingTitle: "Pendientes de revisión",
    noPending: "No hay avisos pendientes.",
    publicStatus: "Estado público",
    rejectReason: "Motivo del rechazo (opcional)",
    approve: "Aprobar y publicar",
    reject: "Rechazar",
    publishedTitle: "Avisos publicados",
    noPublished: "No hay avisos ciudadanos publicados.",
    saveStatus: "Guardar estado",
    editDetails: "Detalles del aviso",
    kind: "Tipo de ficha",
    kindFix: "Aviso de problema",
    kindHistory: "Contribución histórica",
    saveDetails: "Guardar detalles",
    titleBg: "Título (BG)",
    titleEn: "Título (EN, opcional)",
    descriptionBg: "Descripción (BG)",
    descriptionEn: "Descripción (EN, opcional)",
    category: "Categoría",
    latitude: "Latitud",
    longitude: "Longitud",
    addressBg: "Dirección/punto de referencia (BG, opcional)",
    addressEn: "Dirección/punto de referencia (EN, opcional)",
    photos: "Fotos",
    hidePhoto: "Ocultar foto",
    hiddenPhoto: "Foto oculta",
    moderationWarning:
      "Publique fotos solo si no contienen caras, niños, matrículas, documentos, interiores privados ni información personal.",
    submitted: "Enviado",
    loading: "Cargando…",
    actionError: "La acción falló."
  },
  adminCommunity: {
    title: "Iniciativas de voluntariado",
    lead:
      "Añada y actualice grupos ciudadanos reales y campañas de voluntariado con enlaces públicos.",
    tokenLabel: "Token de administrador",
    tokenPlaceholder: "Introduzca el token",
    signIn: "Iniciar sesión",
    signOut: "Cerrar sesión",
    authError: "Token no válido.",
    refresh: "Actualizar",
    discoveryTitle: "Búsqueda con IA/en línea",
    discoveryLead:
      "Busque páginas y publicaciones públicas. Los resultados solo sugieren fuentes; un administrador elige qué guardar.",
    queryLabel: "Buscar",
    queryPlaceholder: "p. ej. voluntarios de Plovdiv limpiando paradas de autobús",
    find: "Buscar en línea",
    sourceUrl: "URL de la fuente",
    inspectUrl: "Inspeccionar URL",
    noCandidates: "No se encontraron resultados.",
    useCandidate: "Usar como fuente",
    formTitle: "Añadir o actualizar iniciativa",
    id: "ID (opcional)",
    titleBg: "Título (BG)",
    titleEn: "Título (EN)",
    summaryBg: "Resumen (BG)",
    summaryEn: "Resumen (EN, opcional)",
    category: "Categoría",
    status: "Estado",
    organizerBg: "Organizador (BG)",
    organizerEn: "Organizador (EN, opcional)",
    organizerType: "Tipo de organizador",
    website: "Sitio web",
    facebook: "Facebook",
    donationUrl: "Enlace de donación (opcional)",
    callToActionBg: "Llamada a la acción (BG, opcional)",
    callToActionEn: "Llamada a la acción (EN, opcional)",
    addressBg: "Dirección/zona (BG)",
    addressEn: "Dirección/zona (EN, opcional)",
    latitude: "Latitud",
    longitude: "Longitud",
    relatedProjects: "ID de proyectos relacionados (separados por comas)",
    tags: "Etiquetas (separadas por comas)",
    sourceTitle: "Título de la fuente",
    sourceUrlLabel: "Enlace de la fuente",
    save: "Guardar iniciativa",
    saved: "Iniciativa guardada.",
    existingTitle: "Iniciativas guardadas",
    noExisting: "No hay iniciativas guardadas.",
    edit: "Editar",
    loading: "Cargando…",
    actionError: "La acción falló."
  }
};

export const ui = { bg, en, de, fr, it, tr, es } as const;

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
  | "environment"
  | "social"
  | "sport"
  | "civic"
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
    civic: "Граждански инициативи",
    environment: "Околна среда",
    social: "Социални дейности",
    sport: "Спорт",
    historic_photo: "Историческа снимка",
    oral_memory: "Устен спомен",
    source_tip: "Източник/архивна следа",
    history_correction: "Историческа корекция",
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
    civic: "Civic initiatives",
    environment: "Environment",
    social: "Social",
    sport: "Sport",
    historic_photo: "Historical photo",
    oral_memory: "Oral memory",
    source_tip: "Source/archive lead",
    history_correction: "History correction",
    other: "Other"
  },
  de: {
    roads: "Straßen",
    pavement: "Gehwege",
    street_lighting: "Beleuchtung",
    parks: "Parks",
    waste: "Abfall",
    public_transport: "Verkehr",
    accessibility: "Barrierefreiheit",
    drainage: "Entwässerung",
    culture: "Kultur",
    education: "Bildung",
    civic: "Bürgerinitiativen",
    environment: "Umwelt",
    social: "Soziales",
    sport: "Sport",
    historic_photo: "Historisches Foto",
    oral_memory: "Mündliche Erinnerung",
    source_tip: "Quelle/Archivhinweis",
    history_correction: "Historische Korrektur",
    other: "Sonstiges"
  },
  fr: {
    roads: "Voirie",
    pavement: "Trottoirs",
    street_lighting: "Éclairage",
    parks: "Parcs",
    waste: "Propreté",
    public_transport: "Transports",
    accessibility: "Accessibilité",
    drainage: "Drainage",
    culture: "Culture",
    education: "Éducation",
    civic: "Initiatives citoyennes",
    environment: "Environnement",
    social: "Action sociale",
    sport: "Sport",
    historic_photo: "Photo historique",
    oral_memory: "Témoignage oral",
    source_tip: "Source/piste d'archives",
    history_correction: "Correction historique",
    other: "Autre"
  },
  it: {
    roads: "Strade",
    pavement: "Marciapiedi",
    street_lighting: "Illuminazione",
    parks: "Parchi",
    waste: "Pulizia",
    public_transport: "Trasporti",
    accessibility: "Accessibilità",
    drainage: "Drenaggio",
    culture: "Cultura",
    education: "Istruzione",
    civic: "Iniziative civiche",
    environment: "Ambiente",
    social: "Azione sociale",
    sport: "Sport",
    historic_photo: "Foto storica",
    oral_memory: "Testimonianza orale",
    source_tip: "Fonte/traccia d'archivio",
    history_correction: "Correzione storica",
    other: "Altro"
  },
  tr: {
    roads: "Yollar",
    pavement: "Kaldırımlar",
    street_lighting: "Aydınlatma",
    parks: "Parklar",
    waste: "Temizlik",
    public_transport: "Ulaşım",
    accessibility: "Erişilebilirlik",
    drainage: "Drenaj",
    culture: "Kültür",
    education: "Eğitim",
    civic: "Yurttaş girişimleri",
    environment: "Çevre",
    social: "Sosyal hizmet",
    sport: "Spor",
    historic_photo: "Tarihsel fotoğraf",
    oral_memory: "Sözlü anı",
    source_tip: "Kaynak/arşiv ipucu",
    history_correction: "Tarihsel düzeltme",
    other: "Diğer"
  },
  es: {
    roads: "Calles",
    pavement: "Aceras",
    street_lighting: "Iluminación",
    parks: "Parques",
    waste: "Limpieza",
    public_transport: "Transporte",
    accessibility: "Accesibilidad",
    drainage: "Drenaje",
    culture: "Cultura",
    education: "Educación",
    civic: "Iniciativas ciudadanas",
    environment: "Medio ambiente",
    social: "Acción social",
    sport: "Deporte",
    historic_photo: "Foto histórica",
    oral_memory: "Memoria oral",
    source_tip: "Fuente/pista de archivo",
    history_correction: "Corrección histórica",
    other: "Otro"
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
  civic: "#a45f2a",
  environment: "#3f8a5b",
  social: "#7a5ca8",
  sport: "#2f7fb0",
  historic_photo: "#8a6d3b",
  oral_memory: "#7a5ca8",
  source_tip: "#2f7d6b",
  history_correction: "#a23b2d",
  other: "#6b7280"
};

// Civic-action track per problem category: whether a problem typically needs
// official (municipal) action, is open to civic participation, or both.
export const categoryActionTrack: Record<string, "municipal" | "civic" | "both"> = {
  roads: "municipal",
  pavement: "municipal",
  street_lighting: "municipal",
  drainage: "municipal",
  education: "municipal",
  public_transport: "both",
  accessibility: "both",
  parks: "both",
  waste: "both",
  culture: "both",
  other: "civic"
};

// Which community-initiative categories are relevant to each problem category,
// used to surface volunteer groups that can help with a given issue.
export const categoryHelpGroups: Record<string, string[]> = {
  roads: ["civic"],
  pavement: ["civic"],
  street_lighting: ["civic"],
  drainage: ["civic", "environment"],
  public_transport: ["public_transport", "civic"],
  accessibility: ["civic", "social"],
  parks: ["parks", "environment", "civic"],
  waste: ["waste", "environment", "civic"],
  culture: ["civic", "social"],
  other: ["civic", "environment", "social", "other"]
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
  },
  de: {
    planned: "Geplant",
    funded: "Finanziert",
    contracted: "Beauftragt",
    in_progress: "In Bearbeitung",
    completed: "Abgeschlossen",
    delayed: "Verzögert",
    postponed: "Verschoben",
    unknown: "Unbekannt"
  },
  fr: {
    planned: "Planifié",
    funded: "Financé",
    contracted: "Sous contrat",
    in_progress: "En cours",
    completed: "Achevé",
    delayed: "Retardé",
    postponed: "Reporté",
    unknown: "Inconnu"
  },
  it: {
    planned: "Pianificato",
    funded: "Finanziato",
    contracted: "Appaltato",
    in_progress: "In corso",
    completed: "Completato",
    delayed: "In ritardo",
    postponed: "Rinviato",
    unknown: "Sconosciuto"
  },
  tr: {
    planned: "Planlandı",
    funded: "Finanse edildi",
    contracted: "Sözleşmeye bağlandı",
    in_progress: "Sürüyor",
    completed: "Tamamlandı",
    delayed: "Gecikti",
    postponed: "Ertelendi",
    unknown: "Bilinmiyor"
  },
  es: {
    planned: "Planificado",
    funded: "Financiado",
    contracted: "Contratado",
    in_progress: "En curso",
    completed: "Completado",
    delayed: "Retrasado",
    postponed: "Aplazado",
    unknown: "Desconocido"
  }
};

export const communityStatusLabels: Record<Lang, Record<string, string>> = {
  bg: {
    active: "Активна",
    recurring: "Повтаряща се",
    completed: "Завършена",
    planned: "Планирана",
    unknown: "Неясен статус"
  },
  en: {
    active: "Active",
    recurring: "Recurring",
    completed: "Completed",
    planned: "Planned",
    unknown: "Unknown status"
  },
  de: {
    active: "Aktiv",
    recurring: "Wiederkehrend",
    completed: "Abgeschlossen",
    planned: "Geplant",
    unknown: "Unbekannter Status"
  },
  fr: {
    active: "Active",
    recurring: "Récurrente",
    completed: "Achevée",
    planned: "Planifiée",
    unknown: "Statut inconnu"
  },
  it: {
    active: "Attiva",
    recurring: "Ricorrente",
    completed: "Completata",
    planned: "Pianificata",
    unknown: "Stato sconosciuto"
  },
  tr: {
    active: "Etkin",
    recurring: "Yinelenen",
    completed: "Tamamlandı",
    planned: "Planlandı",
    unknown: "Bilinmeyen durum"
  },
  es: {
    active: "Activa",
    recurring: "Recurrente",
    completed: "Completada",
    planned: "Planificada",
    unknown: "Estado desconocido"
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
  },
  de: {
    unverified: "Ungeprüft",
    verified: "Geprüft",
    sent_to_municipality: "Gesendet",
    in_progress: "In Bearbeitung",
    fixed: "Behoben",
    closed: "Geschlossen"
  },
  fr: {
    unverified: "Non vérifié",
    verified: "Vérifié",
    sent_to_municipality: "Envoyé",
    in_progress: "En cours",
    fixed: "Résolu",
    closed: "Clôturé"
  },
  it: {
    unverified: "Non verificato",
    verified: "Verificato",
    sent_to_municipality: "Inviato",
    in_progress: "In corso",
    fixed: "Risolto",
    closed: "Chiuso"
  },
  tr: {
    unverified: "Doğrulanmadı",
    verified: "Doğrulandı",
    sent_to_municipality: "Gönderildi",
    in_progress: "Sürüyor",
    fixed: "Giderildi",
    closed: "Kapatıldı"
  },
  es: {
    unverified: "Sin verificar",
    verified: "Verificado",
    sent_to_municipality: "Enviado",
    in_progress: "En curso",
    fixed: "Resuelto",
    closed: "Cerrado"
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
  },
  de: {
    unverified: "Die Meldung ist veröffentlicht, aber noch nicht unabhängig geprüft.",
    verified: "Von einem Redakteur oder einer öffentlichen Quelle geprüft.",
    sent_to_municipality: "Als an eine Institution gesendet markiert.",
    in_progress: "Eine laufende Reparatur oder Prüfung ist vermerkt.",
    fixed: "Als behoben markiert.",
    closed: "Ohne aktiven nächsten Schritt geschlossen."
  },
  fr: {
    unverified: "Le signalement est publié mais pas encore vérifié de manière indépendante.",
    verified: "Vérifié par un éditeur ou une source publique.",
    sent_to_municipality: "Marqué comme envoyé à une institution.",
    in_progress: "Une réparation ou une vérification en cours est notée.",
    fixed: "Marqué comme résolu.",
    closed: "Clôturé sans étape suivante active."
  },
  it: {
    unverified: "La segnalazione è pubblicata ma non ancora verificata in modo indipendente.",
    verified: "Verificata da un redattore o da una fonte pubblica.",
    sent_to_municipality: "Contrassegnata come inviata a un'istituzione.",
    in_progress: "È annotata una riparazione o una verifica in corso.",
    fixed: "Contrassegnata come risolta.",
    closed: "Chiusa senza un passo successivo attivo."
  },
  tr: {
    unverified: "Bildirim yayımlandı ancak henüz bağımsız olarak doğrulanmadı.",
    verified: "Bir editör veya kamuya açık bir kaynak tarafından doğrulandı.",
    sent_to_municipality: "Bir kuruma gönderilmiş olarak işaretlendi.",
    in_progress: "Sürmekte olan bir onarım veya kontrol kaydedildi.",
    fixed: "Giderilmiş olarak işaretlendi.",
    closed: "Etkin bir sonraki adım olmadan kapatıldı."
  },
  es: {
    unverified: "El aviso está publicado pero aún no se ha verificado de forma independiente.",
    verified: "Verificado por un editor o una fuente pública.",
    sent_to_municipality: "Marcado como enviado a una institución.",
    in_progress: "Se ha anotado una reparación o comprobación en curso.",
    fixed: "Marcado como resuelto.",
    closed: "Cerrado sin un paso siguiente activo."
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
  },
  de: {
    municipal_budget: "Gemeindehaushalt",
    municipal_capital: "Investitionsprogramm (kommunal)",
    state_subsidy: "Zweckgebundene staatliche Zuweisung",
    eu_program: "EU-Programm"
  },
  fr: {
    municipal_budget: "Budget municipal",
    municipal_capital: "Programme d'investissement municipal",
    state_subsidy: "Subvention ciblée de l'État",
    eu_program: "Programme de l'UE"
  },
  it: {
    municipal_budget: "Bilancio comunale",
    municipal_capital: "Programma d'investimenti comunale",
    state_subsidy: "Sovvenzione mirata dello Stato",
    eu_program: "Programma dell'UE"
  },
  tr: {
    municipal_budget: "Belediye bütçesi",
    municipal_capital: "Belediye yatırım programı",
    state_subsidy: "Devletin amaca yönelik desteği",
    eu_program: "AB programı"
  },
  es: {
    municipal_budget: "Presupuesto municipal",
    municipal_capital: "Programa de inversiones municipal",
    state_subsidy: "Subvención específica del Estado",
    eu_program: "Programa de la UE"
  }
};

// Citation titles embedded in records (project sources, budget source documents).
// Original public-source titles get English equivalents so the EN site reads cleanly.
export const sourceTitleLabels: Record<Lang, Record<string, string>> = {
  bg: {},
  en: {
    "Община Пловдив — представяне на Бюджет 2025": "Plovdiv Municipality — 2025 budget presentation",
    "TrafficNews — бюджет на Пловдив за 2025 г.": "TrafficNews — Plovdiv 2025 budget",
    "TrafficNews — проектобюджет 2026 и замразени проекти": "TrafficNews — 2026 draft budget and frozen projects",
    "Под тепето — капиталова програма за 2026 г.": "Pod tepeto — 2026 capital programme",
    "Община Пловдив - Кметове на Пловдив": "Plovdiv Municipality — Mayors of Plovdiv",
    "Административен регистър - кмет на Община Пловдив": "Administrative Register — Mayor of Plovdiv Municipality",
    "Plovdiv24 — доброволци се заемат с реновирането на спирки": "Plovdiv24 — volunteers start renovating bus stops",
    "NOVA — доброволци реновират автобусни спирки": "NOVA — volunteers renovate bus stops",
    "Plovdiv24 — търсят се доброволци за почистване на 11 км от река Марица": "Plovdiv24 — volunteers wanted for cleaning 11 km of the Maritsa river",
    "BG Be Active — контакт": "BG Be Active — contact",
    "Красив Пловдив — будни граждани с кауза": "Krasiv Plovdiv — active citizens with a cause",
    "Красив Пловдив — начало": "Krasiv Plovdiv — home",
    "Община Пловдив — „Мисия Лаута 5“": "Plovdiv Municipality — Mission Lauta 5",
    "TrafficNews — рекорден брой доброволци на „Мисия Лаута“ 5": "TrafficNews — record number of volunteers at Mission Lauta 5",
    "БНТ — почистват квартал „Столипиново“": "BNT — cleanup in Stolipinovo",
    "Радио Пловдив — доброволци чистят и облагородяват Столипиново": "Radio Plovdiv — volunteers clean and improve Stolipinovo"
  },
  de: {
    "Община Пловдив — представяне на Бюджет 2025": "Gemeinde Plovdiv — Vorstellung des Haushalts 2025",
    "TrafficNews — бюджет на Пловдив за 2025 г.": "TrafficNews — Haushalt von Plovdiv für 2025",
    "TrafficNews — проектобюджет 2026 и замразени проекти": "TrafficNews — Haushaltsentwurf 2026 und eingefrorene Projekte",
    "Под тепето — капиталова програма за 2026 г.": "Pod tepeto — Investitionsprogramm 2026",
    "Община Пловдив - Кметове на Пловдив": "Gemeinde Plovdiv — Bürgermeister von Plovdiv",
    "Административен регистър - кмет на Община Пловдив": "Verwaltungsregister — Bürgermeister der Gemeinde Plovdiv",
    "Plovdiv24 — доброволци се заемат с реновирането на спирки": "Plovdiv24 — Freiwillige beginnen mit der Renovierung von Haltestellen",
    "NOVA — доброволци реновират автобусни спирки": "NOVA — Freiwillige renovieren Bushaltestellen",
    "Plovdiv24 — търсят се доброволци за почистване на 11 км от река Марица": "Plovdiv24 — Freiwillige für die Reinigung von 11 km der Mariza gesucht",
    "BG Be Active — контакт": "BG Be Active — Kontakt",
    "Красив Пловдив — будни граждани с кауза": "Krasiv Plovdiv — engagierte Bürger mit einem Anliegen",
    "Красив Пловдив — начало": "Krasiv Plovdiv — Startseite",
    "Община Пловдив — „Мисия Лаута 5“": "Gemeinde Plovdiv — „Mission Lauta 5“",
    "TrafficNews — рекорден брой доброволци на „Мисия Лаута“ 5": "TrafficNews — Rekordzahl an Freiwilligen bei „Mission Lauta“ 5",
    "БНТ — почистват квартал „Столипиново“": "BNT — Reinigung im Viertel Stolipinovo",
    "Радио Пловдив — доброволци чистят и облагородяват Столипиново": "Radio Plovdiv — Freiwillige reinigen und verschönern Stolipinovo"
  },
  fr: {
    "Община Пловдив — представяне на Бюджет 2025": "Municipalité de Plovdiv — présentation du budget 2025",
    "TrafficNews — бюджет на Пловдив за 2025 г.": "TrafficNews — budget de Plovdiv pour 2025",
    "TrafficNews — проектобюджет 2026 и замразени проекти": "TrafficNews — projet de budget 2026 et projets gelés",
    "Под тепето — капиталова програма за 2026 г.": "Pod tepeto — programme d'investissement 2026",
    "Община Пловдив - Кметове на Пловдив": "Municipalité de Plovdiv — Maires de Plovdiv",
    "Административен регистър - кмет на Община Пловдив": "Registre administratif — Maire de la municipalité de Plovdiv",
    "Plovdiv24 — доброволци се заемат с реновирането на спирки": "Plovdiv24 — des bénévoles entreprennent la rénovation des arrêts",
    "NOVA — доброволци реновират автобусни спирки": "NOVA — des bénévoles rénovent les arrêts de bus",
    "Plovdiv24 — търсят се доброволци за почистване на 11 км от река Марица": "Plovdiv24 — recherche de bénévoles pour nettoyer 11 km de la rivière Maritsa",
    "BG Be Active — контакт": "BG Be Active — contact",
    "Красив Пловдив — будни граждани с кауза": "Krasiv Plovdiv — des citoyens engagés avec une cause",
    "Красив Пловдив — начало": "Krasiv Plovdiv — accueil",
    "Община Пловдив — „Мисия Лаута 5“": "Municipalité de Plovdiv — « Mission Lauta 5 »",
    "TrafficNews — рекорден брой доброволци на „Мисия Лаута“ 5": "TrafficNews — un nombre record de bénévoles à « Mission Lauta » 5",
    "БНТ — почистват квартал „Столипиново“": "BNT — nettoyage du quartier Stolipinovo",
    "Радио Пловдив — доброволци чистят и облагородяват Столипиново": "Radio Plovdiv — des bénévoles nettoient et embellissent Stolipinovo"
  },
  it: {
    "Община Пловдив — представяне на Бюджет 2025": "Comune di Plovdiv — presentazione del bilancio 2025",
    "TrafficNews — бюджет на Пловдив за 2025 г.": "TrafficNews — bilancio di Plovdiv per il 2025",
    "TrafficNews — проектобюджет 2026 и замразени проекти": "TrafficNews — progetto di bilancio 2026 e progetti congelati",
    "Под тепето — капиталова програма за 2026 г.": "Pod tepeto — programma d'investimenti 2026",
    "Община Пловдив - Кметове на Пловдив": "Comune di Plovdiv — Sindaci di Plovdiv",
    "Административен регистър - кмет на Община Пловдив": "Registro amministrativo — Sindaco del Comune di Plovdiv",
    "Plovdiv24 — доброволци се заемат с реновирането на спирки": "Plovdiv24 — volontari avviano la ristrutturazione delle fermate",
    "NOVA — доброволци реновират автобусни спирки": "NOVA — volontari ristrutturano le fermate degli autobus",
    "Plovdiv24 — търсят се доброволци за почистване на 11 км от река Марица": "Plovdiv24 — cercasi volontari per pulire 11 km del fiume Maritsa",
    "BG Be Active — контакт": "BG Be Active — contatto",
    "Красив Пловдив — будни граждани с кауза": "Krasiv Plovdiv — cittadini attivi con una causa",
    "Красив Пловдив — начало": "Krasiv Plovdiv — home",
    "Община Пловдив — „Мисия Лаута 5“": "Comune di Plovdiv — « Missione Lauta 5 »",
    "TrafficNews — рекорден брой доброволци на „Мисия Лаута“ 5": "TrafficNews — numero record di volontari alla « Missione Lauta » 5",
    "БНТ — почистват квартал „Столипиново“": "BNT — pulizia del quartiere Stolipinovo",
    "Радио Пловдив — доброволци чистят и облагородяват Столипиново": "Radio Plovdiv — volontari puliscono e abbelliscono Stolipinovo"
  },
  tr: {
    "Община Пловдив — представяне на Бюджет 2025": "Plovdiv Belediyesi — 2025 bütçesinin sunumu",
    "TrafficNews — бюджет на Пловдив за 2025 г.": "TrafficNews — Plovdiv'in 2025 bütçesi",
    "TrafficNews — проектобюджет 2026 и замразени проекти": "TrafficNews — 2026 bütçe taslağı ve dondurulan projeler",
    "Под тепето — капиталова програма за 2026 г.": "Pod tepeto — 2026 yatırım programı",
    "Община Пловдив - Кметове на Пловдив": "Plovdiv Belediyesi — Plovdiv Belediye Başkanları",
    "Административен регистър - кмет на Община Пловдив": "İdari Sicil — Plovdiv Belediyesi Belediye Başkanı",
    "Plovdiv24 — доброволци се заемат с реновирането на спирки": "Plovdiv24 — gönüllüler durakların yenilenmesine başlıyor",
    "NOVA — доброволци реновират автобусни спирки": "NOVA — gönüllüler otobüs duraklarını yeniliyor",
    "Plovdiv24 — търсят се доброволци за почистване на 11 км от река Марица": "Plovdiv24 — Maritsa nehrinin 11 km'sini temizlemek için gönüllü aranıyor",
    "BG Be Active — контакт": "BG Be Active — iletişim",
    "Красив Пловдив — будни граждани с кауза": "Krasiv Plovdiv — bir davası olan duyarlı yurttaşlar",
    "Красив Пловдив — начало": "Krasiv Plovdiv — ana sayfa",
    "Община Пловдив — „Мисия Лаута 5“": "Plovdiv Belediyesi — « Görev Lauta 5 »",
    "TrafficNews — рекорден брой доброволци на „Мисия Лаута“ 5": "TrafficNews — « Görev Lauta » 5'te rekor sayıda gönüllü",
    "БНТ — почистват квартал „Столипиново“": "BNT — Stolipinovo mahallesinin temizliği",
    "Радио Пловдив — доброволци чистят и облагородяват Столипиново": "Radyo Plovdiv — gönüllüler Stolipinovo'yu temizliyor ve güzelleştiriyor"
  },
  es: {
    "Община Пловдив — представяне на Бюджет 2025": "Municipio de Plovdiv — presentación del presupuesto 2025",
    "TrafficNews — бюджет на Пловдив за 2025 г.": "TrafficNews — presupuesto de Plovdiv para 2025",
    "TrafficNews — проектобюджет 2026 и замразени проекти": "TrafficNews — anteproyecto de presupuesto 2026 y proyectos congelados",
    "Под тепето — капиталова програма за 2026 г.": "Pod tepeto — programa de inversiones 2026",
    "Община Пловдив - Кметове на Пловдив": "Municipio de Plovdiv — Alcaldes de Plovdiv",
    "Административен регистър - кмет на Община Пловдив": "Registro Administrativo — Alcalde del Municipio de Plovdiv",
    "Plovdiv24 — доброволци се заемат с реновирането на спирки": "Plovdiv24 — voluntarios emprenden la renovación de las paradas",
    "NOVA — доброволци реновират автобусни спирки": "NOVA — voluntarios renuevan las paradas de autobús",
    "Plovdiv24 — търсят се доброволци за почистване на 11 км от река Марица": "Plovdiv24 — se buscan voluntarios para limpiar 11 km del río Maritsa",
    "BG Be Active — контакт": "BG Be Active — contacto",
    "Красив Пловдив — будни граждани с кауза": "Krasiv Plovdiv — ciudadanos comprometidos con una causa",
    "Красив Пловдив — начало": "Krasiv Plovdiv — inicio",
    "Община Пловдив — „Мисия Лаута 5“": "Municipio de Plovdiv — « Misión Lauta 5 »",
    "TrafficNews — рекорден брой доброволци на „Мисия Лаута“ 5": "TrafficNews — cifra récord de voluntarios en « Misión Lauta » 5",
    "БНТ — почистват квартал „Столипиново“": "BNT — limpieza del barrio de Stolipinovo",
    "Радио Пловдив — доброволци чистят и облагородяват Столипиново": "Radio Plovdiv — voluntarios limpian y embellecen Stolipinovo"
  }
};

// Shared person-role tags (objective: one source of truth for People + History).
// Adding a locale to `Lang` forces a translation here via the Record<Lang> type.
export const roleLabels: Record<string, Record<Lang, string>> = {
  academic: { bg: "академик", en: "academic", de: "Akademiker", fr: "académicien", it: "accademico", tr: "akademisyen", es: "académico" },
  actor: { bg: "актьор", en: "actor", de: "Schauspieler", fr: "acteur", it: "attore", tr: "aktör", es: "actor" },
  art_historian: { bg: "изкуствовед", en: "art historian", de: "Kunsthistoriker", fr: "historien de l'art", it: "storico dell'arte", tr: "sanat tarihçisi", es: "historiador del arte" },
  artist: { bg: "художник", en: "artist", de: "Künstler", fr: "artiste", it: "artista", tr: "sanatçı", es: "artista" },
  athlete: { bg: "спортист", en: "athlete", de: "Sportler", fr: "athlète", it: "atleta", tr: "atlet", es: "atleta" },
  basketball_player: { bg: "баскетболист", en: "basketball player", de: "Basketballspieler", fr: "basketteur", it: "cestista", tr: "basketbolcu", es: "baloncestista" },
  boxer: { bg: "боксьор", en: "boxer", de: "Boxer", fr: "boxeur", it: "pugile", tr: "boksör", es: "boxeador" },
  canoeist: { bg: "кануист", en: "canoeist", de: "Kanute", fr: "canoéiste", it: "canoista", tr: "kanocu", es: "piragüista" },
  chef: { bg: "готвач", en: "chef", de: "Koch", fr: "chef cuisinier", it: "chef", tr: "aşçı", es: "chef" },
  chess_player: { bg: "шахматист", en: "chess player", de: "Schachspieler", fr: "joueur d'échecs", it: "scacchista", tr: "satranç oyuncusu", es: "ajedrecista" },
  choreographer: { bg: "хореограф", en: "choreographer", de: "Choreograf", fr: "chorégraphe", it: "coreografo", tr: "koreograf", es: "coreógrafo" },
  clergy: { bg: "духовник", en: "clergy", de: "Geistlicher", fr: "ecclésiastique", it: "religioso", tr: "din adamı", es: "clérigo" },
  composer: { bg: "композитор", en: "composer", de: "Komponist", fr: "compositeur", it: "compositore", tr: "besteci", es: "compositor" },
  conductor: { bg: "диригент", en: "conductor", de: "Dirigent", fr: "chef d'orchestre", it: "direttore d'orchestra", tr: "orkestra şefi", es: "director de orquesta" },
  cultural_manager: { bg: "културен мениджър", en: "cultural manager", de: "Kulturmanager", fr: "gestionnaire culturel", it: "manager culturale", tr: "kültür yöneticisi", es: "gestor cultural" },
  designer: { bg: "дизайнер", en: "designer", de: "Designer", fr: "designer", it: "designer", tr: "tasarımcı", es: "diseñador" },
  diplomat: { bg: "дипломат", en: "diplomat", de: "Diplomat", fr: "diplomate", it: "diplomatico", tr: "diplomat", es: "diplomático" },
  economist: { bg: "икономист", en: "economist", de: "Ökonom", fr: "économiste", it: "economista", tr: "iktisatçı", es: "economista" },
  educator: { bg: "педагог", en: "educator", de: "Pädagoge", fr: "pédagogue", it: "pedagogo", tr: "eğitimci", es: "pedagogo" },
  electrical_engineer: { bg: "електроинженер", en: "electrical engineer", de: "Elektroingenieur", fr: "ingénieur électricien", it: "ingegnere elettrico", tr: "elektrik mühendisi", es: "ingeniero eléctrico" },
  engineer: { bg: "инженер", en: "engineer", de: "Ingenieur", fr: "ingénieur", it: "ingegnere", tr: "mühendis", es: "ingeniero" },
  equestrian: { bg: "състезател по конен спорт", en: "equestrian", de: "Reitsportler", fr: "cavalier", it: "cavaliere", tr: "binici", es: "jinete" },
  fencer: { bg: "фехтовач", en: "fencer", de: "Fechter", fr: "escrimeur", it: "schermidore", tr: "eskrimci", es: "esgrimista" },
  film_director: { bg: "филмов режисьор", en: "film director", de: "Filmregisseur", fr: "réalisateur", it: "regista cinematografico", tr: "film yönetmeni", es: "director de cine" },
  first_lady: { bg: "първа дама", en: "first lady", de: "First Lady", fr: "première dame", it: "first lady", tr: "first lady", es: "primera dama" },
  football_referee: { bg: "футболен съдия", en: "football referee", de: "Fußballschiedsrichter", fr: "arbitre de football", it: "arbitro di calcio", tr: "futbol hakemi", es: "árbitro de fútbol" },
  footballer: { bg: "футболист", en: "footballer", de: "Fußballspieler", fr: "footballeur", it: "calciatore", tr: "futbolcu", es: "futbolista" },
  general: { bg: "генерал", en: "general", de: "General", fr: "général", it: "generale", tr: "general", es: "general" },
  geographer: { bg: "географ", en: "geographer", de: "Geograf", fr: "géographe", it: "geografo", tr: "coğrafyacı", es: "geógrafo" },
  gymnast: { bg: "гимнастик", en: "gymnast", de: "Turner", fr: "gymnaste", it: "ginnasta", tr: "jimnastikçi", es: "gimnasta" },
  high_jumper: { bg: "скачач на височина", en: "high jumper", de: "Hochspringer", fr: "sauteur en hauteur", it: "saltatore in alto", tr: "yüksek atlamacı", es: "saltador de altura" },
  illustrator: { bg: "илюстратор", en: "illustrator", de: "Illustrator", fr: "illustrateur", it: "illustratore", tr: "illüstratör", es: "ilustrador" },
  javelin_thrower: { bg: "копиехвъргач", en: "javelin thrower", de: "Speerwerfer", fr: "lanceur de javelot", it: "lanciatore di giavellotto", tr: "cirit atıcısı", es: "lanzador de jabalina" },
  journalist: { bg: "журналист", en: "journalist", de: "Journalist", fr: "journaliste", it: "giornalista", tr: "gazeteci", es: "periodista" },
  jurist: { bg: "юрист", en: "jurist", de: "Jurist", fr: "juriste", it: "giurista", tr: "hukukçu", es: "jurista" },
  martial_artist: { bg: "състезател по бойни изкуства", en: "martial artist", de: "Kampfsportler", fr: "artiste martial", it: "artista marziale", tr: "dövüş sanatçısı", es: "artista marcial" },
  mathematician: { bg: "математик", en: "mathematician", de: "Mathematiker", fr: "mathématicien", it: "matematico", tr: "matematikçi", es: "matemático" },
  mayor: { bg: "кмет", en: "mayor", de: "Bürgermeister", fr: "maire", it: "sindaco", tr: "belediye başkanı", es: "alcalde" },
  merchant: { bg: "търговец", en: "merchant", de: "Kaufmann", fr: "marchand", it: "mercante", tr: "tüccar", es: "comerciante" },
  military_officer: { bg: "офицер", en: "military officer", de: "Offizier", fr: "officier", it: "ufficiale", tr: "subay", es: "oficial" },
  mineralogist: { bg: "минералог", en: "mineralogist", de: "Mineraloge", fr: "minéralogiste", it: "mineralogista", tr: "mineralog", es: "mineralogista" },
  missionary: { bg: "мисионер", en: "missionary", de: "Missionar", fr: "missionnaire", it: "missionario", tr: "misyoner", es: "misionero" },
  model: { bg: "модел", en: "model", de: "Model", fr: "mannequin", it: "modella", tr: "manken", es: "modelo" },
  modern_pentathlete: { bg: "състезател по модерен петобой", en: "modern pentathlete", de: "Moderner Fünfkämpfer", fr: "pentathlonien moderne", it: "pentatleta moderno", tr: "modern pentatlet", es: "pentatleta moderno" },
  musician: { bg: "музикант", en: "musician", de: "Musiker", fr: "musicien", it: "musicista", tr: "müzisyen", es: "músico" },
  opera_singer: { bg: "оперен певец", en: "opera singer", de: "Opernsänger", fr: "chanteur d'opéra", it: "cantante lirico", tr: "opera sanatçısı", es: "cantante de ópera" },
  painter: { bg: "живописец", en: "painter", de: "Maler", fr: "peintre", it: "pittore", tr: "ressam", es: "pintor" },
  paleontologist: { bg: "палеонтолог", en: "paleontologist", de: "Paläontologe", fr: "paléontologue", it: "paleontologo", tr: "paleontolog", es: "paleontólogo" },
  patriarch: { bg: "патриарх", en: "patriarch", de: "Patriarch", fr: "patriarche", it: "patriarca", tr: "patrik", es: "patriarca" },
  philosopher: { bg: "философ", en: "philosopher", de: "Philosoph", fr: "philosophe", it: "filosofo", tr: "filozof", es: "filósofo" },
  physicist: { bg: "физик", en: "physicist", de: "Physiker", fr: "physicien", it: "fisico", tr: "fizikçi", es: "físico" },
  pianist: { bg: "пианист", en: "pianist", de: "Pianist", fr: "pianiste", it: "pianista", tr: "piyanist", es: "pianista" },
  poet: { bg: "поет", en: "poet", de: "Dichter", fr: "poète", it: "poeta", tr: "şair", es: "poeta" },
  politician: { bg: "политик", en: "politician", de: "Politiker", fr: "politicien", it: "politico", tr: "siyasetçi", es: "político" },
  priest: { bg: "свещеник", en: "priest", de: "Priester", fr: "prêtre", it: "sacerdote", tr: "rahip", es: "sacerdote" },
  printmaker: { bg: "график", en: "printmaker", de: "Grafiker", fr: "graveur", it: "incisore", tr: "gravürcü", es: "grabador" },
  producer: { bg: "продуцент", en: "producer", de: "Produzent", fr: "producteur", it: "produttore", tr: "yapımcı", es: "productor" },
  public_figure: { bg: "обществена фигура", en: "public figure", de: "Person des öffentlichen Lebens", fr: "personnalité publique", it: "personaggio pubblico", tr: "kamusal figür", es: "figura pública" },
  racing_driver: { bg: "автомобилен състезател", en: "racing driver", de: "Rennfahrer", fr: "pilote automobile", it: "pilota automobilistico", tr: "yarış pilotu", es: "piloto de carreras" },
  revolutionary: { bg: "революционер", en: "revolutionary", de: "Revolutionär", fr: "révolutionnaire", it: "rivoluzionario", tr: "devrimci", es: "revolucionario" },
  rower: { bg: "гребец", en: "rower", de: "Ruderer", fr: "rameur", it: "canottiere", tr: "kürekçi", es: "remero" },
  saint: { bg: "светец", en: "saint", de: "Heiliger", fr: "saint", it: "santo", tr: "aziz", es: "santo" },
  scholar: { bg: "учен", en: "scholar", de: "Gelehrter", fr: "érudit", it: "studioso", tr: "âlim", es: "erudito" },
  scientist: { bg: "учен", en: "scientist", de: "Wissenschaftler", fr: "scientifique", it: "scienziato", tr: "bilim insanı", es: "científico" },
  screenwriter: { bg: "сценарист", en: "screenwriter", de: "Drehbuchautor", fr: "scénariste", it: "sceneggiatore", tr: "senarist", es: "guionista" },
  sculptor: { bg: "скулптор", en: "sculptor", de: "Bildhauer", fr: "sculpteur", it: "scultore", tr: "heykeltıraş", es: "escultor" },
  singer: { bg: "певец", en: "singer", de: "Sänger", fr: "chanteur", it: "cantante", tr: "şarkıcı", es: "cantante" },
  sports_shooter: { bg: "спортен стрелец", en: "sport shooter", de: "Sportschütze", fr: "tireur sportif", it: "tiratore sportivo", tr: "atıcı", es: "tirador deportivo" },
  swimmer: { bg: "плувец", en: "swimmer", de: "Schwimmer", fr: "nageur", it: "nuotatore", tr: "yüzücü", es: "nadador" },
  tennis_player: { bg: "тенисист", en: "tennis player", de: "Tennisspieler", fr: "joueur de tennis", it: "tennista", tr: "tenisçi", es: "tenista" },
  theatre_director: { bg: "театрален режисьор", en: "theatre director", de: "Theaterregisseur", fr: "metteur en scène", it: "regista teatrale", tr: "tiyatro yönetmeni", es: "director de teatro" },
  violinist: { bg: "цигулар", en: "violinist", de: "Geiger", fr: "violoniste", it: "violinista", tr: "kemancı", es: "violinista" },
  visual_artist: { bg: "визуален художник", en: "visual artist", de: "Bildender Künstler", fr: "artiste visuel", it: "artista visivo", tr: "görsel sanatçı", es: "artista visual" },
  volleyball_player: { bg: "волейболист", en: "volleyball player", de: "Volleyballspieler", fr: "volleyeur", it: "pallavolista", tr: "voleybolcu", es: "voleibolista" },
  weightlifter: { bg: "щангист", en: "weightlifter", de: "Gewichtheber", fr: "haltérophile", it: "sollevatore di pesi", tr: "halterci", es: "halterófilo" },
  wrestler: { bg: "борец", en: "wrestler", de: "Ringer", fr: "lutteur", it: "lottatore", tr: "güreşçi", es: "luchador" },
  writer: { bg: "писател", en: "writer", de: "Schriftsteller", fr: "écrivain", it: "scrittore", tr: "yazar", es: "escritor" },
  zoologist: { bg: "зоолог", en: "zoologist", de: "Zoologe", fr: "zoologiste", it: "zoologo", tr: "zoolog", es: "zoólogo" }
};
