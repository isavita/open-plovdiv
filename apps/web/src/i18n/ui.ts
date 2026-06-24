// Central multilingual string dictionary for Open Plovdiv (BG / EN / DE; Greek
// is the next planned locale). `bg` is the source of truth for the shape; every
// other locale is typed against it (`typeof bg`) so the locales can never drift
// out of sync — adding a key to `bg` forces it in `en` and `de` too.

export const languages = {
  bg: "Български",
  en: "English",
  de: "Deutsch"
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

export const ui = { bg, en, de } as const;

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
  }
};

// Shared person-role tags (objective: one source of truth for People + History).
// Adding a locale to `Lang` forces a translation here via the Record<Lang> type.
export const roleLabels: Record<string, Record<Lang, string>> = {
  academic: { bg: "академик", en: "academic", de: "Akademiker" },
  actor: { bg: "актьор", en: "actor", de: "Schauspieler" },
  art_historian: { bg: "изкуствовед", en: "art historian", de: "Kunsthistoriker" },
  artist: { bg: "художник", en: "artist", de: "Künstler" },
  athlete: { bg: "спортист", en: "athlete", de: "Sportler" },
  basketball_player: { bg: "баскетболист", en: "basketball player", de: "Basketballspieler" },
  boxer: { bg: "боксьор", en: "boxer", de: "Boxer" },
  canoeist: { bg: "кануист", en: "canoeist", de: "Kanute" },
  chef: { bg: "готвач", en: "chef", de: "Koch" },
  chess_player: { bg: "шахматист", en: "chess player", de: "Schachspieler" },
  choreographer: { bg: "хореограф", en: "choreographer", de: "Choreograf" },
  clergy: { bg: "духовник", en: "clergy", de: "Geistlicher" },
  composer: { bg: "композитор", en: "composer", de: "Komponist" },
  conductor: { bg: "диригент", en: "conductor", de: "Dirigent" },
  cultural_manager: { bg: "културен мениджър", en: "cultural manager", de: "Kulturmanager" },
  designer: { bg: "дизайнер", en: "designer", de: "Designer" },
  diplomat: { bg: "дипломат", en: "diplomat", de: "Diplomat" },
  economist: { bg: "икономист", en: "economist", de: "Ökonom" },
  educator: { bg: "педагог", en: "educator", de: "Pädagoge" },
  electrical_engineer: { bg: "електроинженер", en: "electrical engineer", de: "Elektroingenieur" },
  engineer: { bg: "инженер", en: "engineer", de: "Ingenieur" },
  equestrian: { bg: "състезател по конен спорт", en: "equestrian", de: "Reitsportler" },
  fencer: { bg: "фехтовач", en: "fencer", de: "Fechter" },
  film_director: { bg: "филмов режисьор", en: "film director", de: "Filmregisseur" },
  first_lady: { bg: "първа дама", en: "first lady", de: "First Lady" },
  football_referee: { bg: "футболен съдия", en: "football referee", de: "Fußballschiedsrichter" },
  footballer: { bg: "футболист", en: "footballer", de: "Fußballspieler" },
  general: { bg: "генерал", en: "general", de: "General" },
  geographer: { bg: "географ", en: "geographer", de: "Geograf" },
  gymnast: { bg: "гимнастик", en: "gymnast", de: "Turner" },
  high_jumper: { bg: "скачач на височина", en: "high jumper", de: "Hochspringer" },
  illustrator: { bg: "илюстратор", en: "illustrator", de: "Illustrator" },
  javelin_thrower: { bg: "копиехвъргач", en: "javelin thrower", de: "Speerwerfer" },
  journalist: { bg: "журналист", en: "journalist", de: "Journalist" },
  jurist: { bg: "юрист", en: "jurist", de: "Jurist" },
  martial_artist: { bg: "състезател по бойни изкуства", en: "martial artist", de: "Kampfsportler" },
  mathematician: { bg: "математик", en: "mathematician", de: "Mathematiker" },
  mayor: { bg: "кмет", en: "mayor", de: "Bürgermeister" },
  merchant: { bg: "търговец", en: "merchant", de: "Kaufmann" },
  military_officer: { bg: "офицер", en: "military officer", de: "Offizier" },
  mineralogist: { bg: "минералог", en: "mineralogist", de: "Mineraloge" },
  missionary: { bg: "мисионер", en: "missionary", de: "Missionar" },
  model: { bg: "модел", en: "model", de: "Model" },
  modern_pentathlete: { bg: "състезател по модерен петобой", en: "modern pentathlete", de: "Moderner Fünfkämpfer" },
  musician: { bg: "музикант", en: "musician", de: "Musiker" },
  opera_singer: { bg: "оперен певец", en: "opera singer", de: "Opernsänger" },
  painter: { bg: "живописец", en: "painter", de: "Maler" },
  paleontologist: { bg: "палеонтолог", en: "paleontologist", de: "Paläontologe" },
  patriarch: { bg: "патриарх", en: "patriarch", de: "Patriarch" },
  philosopher: { bg: "философ", en: "philosopher", de: "Philosoph" },
  physicist: { bg: "физик", en: "physicist", de: "Physiker" },
  pianist: { bg: "пианист", en: "pianist", de: "Pianist" },
  poet: { bg: "поет", en: "poet", de: "Dichter" },
  politician: { bg: "политик", en: "politician", de: "Politiker" },
  priest: { bg: "свещеник", en: "priest", de: "Priester" },
  printmaker: { bg: "график", en: "printmaker", de: "Grafiker" },
  producer: { bg: "продуцент", en: "producer", de: "Produzent" },
  public_figure: { bg: "обществена фигура", en: "public figure", de: "Person des öffentlichen Lebens" },
  racing_driver: { bg: "автомобилен състезател", en: "racing driver", de: "Rennfahrer" },
  revolutionary: { bg: "революционер", en: "revolutionary", de: "Revolutionär" },
  rower: { bg: "гребец", en: "rower", de: "Ruderer" },
  saint: { bg: "светец", en: "saint", de: "Heiliger" },
  scholar: { bg: "учен", en: "scholar", de: "Gelehrter" },
  scientist: { bg: "учен", en: "scientist", de: "Wissenschaftler" },
  screenwriter: { bg: "сценарист", en: "screenwriter", de: "Drehbuchautor" },
  sculptor: { bg: "скулптор", en: "sculptor", de: "Bildhauer" },
  singer: { bg: "певец", en: "singer", de: "Sänger" },
  sports_shooter: { bg: "спортен стрелец", en: "sport shooter", de: "Sportschütze" },
  swimmer: { bg: "плувец", en: "swimmer", de: "Schwimmer" },
  tennis_player: { bg: "тенисист", en: "tennis player", de: "Tennisspieler" },
  theatre_director: { bg: "театрален режисьор", en: "theatre director", de: "Theaterregisseur" },
  violinist: { bg: "цигулар", en: "violinist", de: "Geiger" },
  visual_artist: { bg: "визуален художник", en: "visual artist", de: "Bildender Künstler" },
  volleyball_player: { bg: "волейболист", en: "volleyball player", de: "Volleyballspieler" },
  weightlifter: { bg: "щангист", en: "weightlifter", de: "Gewichtheber" },
  wrestler: { bg: "борец", en: "wrestler", de: "Ringer" },
  writer: { bg: "писател", en: "writer", de: "Schriftsteller" },
  zoologist: { bg: "зоолог", en: "zoologist", de: "Zoologe" }
};
