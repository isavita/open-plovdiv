import type { Lang } from "../i18n/ui";
import type { NeighbourhoodArea, NeighbourhoodEraTag } from "./neighbourhoods";

/**
 * UI strings for the neighbourhood-histories surface, in the site's canonical
 * 12-locale order. Neighbourhood CONTENT (names, summaries, timelines) lives
 * in data/curated/neighbourhood-histories.json and flows through the
 * translation maps; the strings here are pure interface labels.
 */

const tr = (
  bg: string,
  en: string,
  de: string,
  fr: string,
  it: string,
  trk: string,
  es: string,
  el: string,
  ja: string,
  tl: string,
  uk: string,
  ru: string
): Record<Lang, string> => ({ bg, en, de, fr, it, tr: trk, es, el, ja, tl, uk, ru });

const pick = (table: Record<string, Record<Lang, string>>, lang: Lang): Record<string, string> =>
  Object.fromEntries(Object.entries(table).map(([key, values]) => [key, values[lang]]));

const eraTable: Record<NeighbourhoodEraTag, Record<Lang, string>> = {
  ottoman: tr(
    "Османска епоха",
    "Ottoman era",
    "Osmanische Zeit",
    "Époque ottomane",
    "Epoca ottomana",
    "Osmanlı dönemi",
    "Época otomana",
    "Οθωμανική εποχή",
    "オスマン時代",
    "Panahong Ottoman",
    "Османська доба",
    "Османская эпоха"
  ),
  revival: tr(
    "Възраждане",
    "Revival",
    "Wiedergeburt",
    "Renaissance bulgare",
    "Rinascita nazionale",
    "Uyanış dönemi",
    "Renacimiento",
    "Αναγέννηση",
    "民族復興期",
    "Muling Pagsilang",
    "Відродження",
    "Возрождение"
  ),
  modern: tr(
    "Модерна епоха",
    "Modern era",
    "Moderne",
    "Époque moderne",
    "Età moderna",
    "Modern dönem",
    "Época moderna",
    "Νεότερη εποχή",
    "近代",
    "Makabagong panahon",
    "Модерна доба",
    "Новое время"
  ),
  socialist: tr(
    "Социалистическа епоха",
    "Socialist era",
    "Sozialistische Zeit",
    "Époque socialiste",
    "Epoca socialista",
    "Sosyalist dönem",
    "Época socialista",
    "Σοσιαλιστική εποχή",
    "社会主義期",
    "Panahong sosyalista",
    "Соціалістична доба",
    "Социалистическая эпоха"
  )
};

const areaTable: Record<NeighbourhoodArea, Record<Lang, string>> = {
  centre: tr("Център", "Centre", "Zentrum", "Centre", "Centro", "Merkez", "Centro", "Κέντρο", "中心部", "Sentro", "Центр", "Центр"),
  north: tr("Север", "North", "Norden", "Nord", "Nord", "Kuzey", "Norte", "Βόρεια", "北部", "Hilaga", "Північ", "Север"),
  east: tr("Изток", "East", "Osten", "Est", "Est", "Doğu", "Este", "Ανατολικά", "東部", "Silangan", "Схід", "Восток"),
  south: tr("Юг", "South", "Süden", "Sud", "Sud", "Güney", "Sur", "Νότια", "南部", "Timog", "Південь", "Юг"),
  west: tr("Запад", "West", "Westen", "Ouest", "Ovest", "Batı", "Oeste", "Δυτικά", "西部", "Kanluran", "Захід", "Запад")
};

const fabricKindTable: Record<string, Record<Lang, string>> = {
  people: tr("Личности", "People", "Personen", "Personnalités", "Persone", "Kişiler", "Personas", "Πρόσωπα", "人物", "Mga tao", "Постаті", "Личности"),
  community: tr("Общност", "Community", "Gemeinschaft", "Communauté", "Comunità", "Topluluk", "Comunidad", "Κοινότητα", "コミュニティ", "Komunidad", "Громада", "Община"),
  industry: tr("Индустрия", "Industry", "Industrie", "Industrie", "Industria", "Sanayi", "Industria", "Βιομηχανία", "産業", "Industriya", "Промисловість", "Промышленность"),
  institution: tr("Институция", "Institution", "Institution", "Institution", "Istituzione", "Kurum", "Institución", "Θεσμός", "施設・機関", "Institusyon", "Установа", "Учреждение"),
  faith: tr("Вяра", "Faith", "Glaube", "Religion", "Fede", "İnanç", "Fe", "Πίστη", "信仰", "Pananampalataya", "Віра", "Вера")
};

const labelTable = {
  indexTitle: tr(
    "Кварталните истории на Пловдив",
    "Neighbourhood Histories of Plovdiv",
    "Viertelgeschichten von Plovdiv",
    "Histoires des quartiers de Plovdiv",
    "Storie dei quartieri di Plovdiv",
    "Plovdiv'in mahalle tarihçeleri",
    "Historias de los barrios de Plovdiv",
    "Ιστορίες των συνοικιών του Plovdiv",
    "Plovdivの街区の歴史",
    "Mga kasaysayan ng mga purok ng Plovdiv",
    "Історії кварталів Пловдива",
    "Истории кварталов Пловдива"
  ),
  indexEyebrow: tr(
    "Градът по квартали",
    "The city by quarter",
    "Die Stadt nach Vierteln",
    "La ville par quartiers",
    "La città per quartieri",
    "Mahalle mahalle şehir",
    "La ciudad por barrios",
    "Η πόλη ανά συνοικία",
    "街区ごとのプロヴディフ",
    "Ang lungsod ayon sa purok",
    "Місто за кварталами",
    "Город по кварталам"
  ),
  indexLead: tr(
    "Кварталите на града като живи исторически пластове: от махалите на Филибе до панелна „Тракия“. Всяко твърдение стъпва на посочен източник, а празнините са назовани честно.",
    "The city's quarters as living historical layers: from the mahalas of Filibe to panel-built Trakiya. Every claim rests on a cited source, and the gaps are named honestly.",
    "Die Viertel der Stadt als lebendige Geschichtsschichten: von den Mahallas von Filibe bis zur Plattenbausiedlung Trakiya. Jede Aussage stützt sich auf eine genannte Quelle, und die Lücken werden ehrlich benannt.",
    "Les quartiers de la ville comme des couches historiques vivantes : des mahallas de Filibe aux barres de Trakiya. Chaque affirmation s'appuie sur une source citée, et les lacunes sont nommées honnêtement.",
    "I quartieri della città come strati storici viventi: dalle mahalla di Filibe ai prefabbricati di Trakiya. Ogni affermazione poggia su una fonte citata e le lacune sono dichiarate onestamente.",
    "Yaşayan tarih katmanları olarak şehrin mahalleleri: Filibe mahallelerinden panel Trakiya'ya. Her iddia belirtilen bir kaynağa dayanır; boşluklar dürüstçe belirtilir.",
    "Los barrios de la ciudad como capas históricas vivas: de las mahalas de Filibe a los paneles de Trakiya. Cada afirmación se apoya en una fuente citada y los vacíos se nombran con honestidad.",
    "Οι συνοικίες της πόλης ως ζωντανά ιστορικά στρώματα: από τους μαχαλάδες του Filibe ως την πάνελ Τρακίγια. Κάθε ισχυρισμός στηρίζεται σε αναφερόμενη πηγή και τα κενά δηλώνονται με ειλικρίνεια.",
    "生きた歴史の層としての街区。フィリベのマハレからパネル造のトラキヤまで。すべての記述は出典に基づき、資料の空白も正直に示します。",
    "Ang mga purok ng lungsod bilang buhay na yugto ng kasaysayan: mula sa mga mahala ng Filibe hanggang sa panel na Trakiya. Bawat pahayag ay nakabatay sa binanggit na pinagmulan, at tapat na sinasabi ang mga puwang.",
    "Квартали міста як живі історичні шари: від махаль Філібе до панельної Тракії. Кожне твердження спирається на вказане джерело, а прогалини названі чесно.",
    "Кварталы города как живые исторические слои: от махалей Филибе до панельной Тракии. Каждое утверждение опирается на указанный источник, а пробелы названы честно."
  ),
  quarters: tr("квартала", "quarters", "Viertel", "quartiers", "quartieri", "mahalle", "barrios", "συνοικίες", "街区", "purok", "квартали", "кварталов"),
  placesStat: tr("свързани места", "linked places", "verknüpfte Orte", "lieux liés", "luoghi collegati", "bağlı yerler", "lugares vinculados", "συνδεδεμένες τοποθεσίες", "関連する場所", "kaugnay na lugar", "пов'язані місця", "связанные места"),
  timelineStat: tr("датирани събития", "dated events", "datierte Ereignisse", "événements datés", "eventi datati", "tarihli olaylar", "eventos fechados", "χρονολογημένα γεγονότα", "年代付きの出来事", "may petsang pangyayari", "датовані події", "датированные события"),
  sourcesStat: tr("източници", "sources", "Quellen", "sources", "fonti", "kaynak", "fuentes", "πηγές", "出典", "pinagmulan", "джерела", "источники"),
  searchLabel: tr(
    "Търсене на квартал",
    "Search quarters",
    "Viertel suchen",
    "Rechercher un quartier",
    "Cerca un quartiere",
    "Mahalle ara",
    "Buscar un barrio",
    "Αναζήτηση συνοικίας",
    "街区を検索",
    "Maghanap ng purok",
    "Пошук кварталу",
    "Поиск квартала"
  ),
  filterEra: tr("Епоха", "Era", "Epoche", "Époque", "Epoca", "Dönem", "Época", "Εποχή", "時代", "Panahon", "Доба", "Эпоха"),
  filterArea: tr("Част от града", "Part of the city", "Stadtteil", "Partie de la ville", "Parte della città", "Şehrin bölgesi", "Parte de la ciudad", "Μέρος της πόλης", "エリア", "Bahagi ng lungsod", "Частина міста", "Часть города"),
  filterAll: tr("Всички", "All", "Alle", "Tous", "Tutti", "Tümü", "Todos", "Όλες", "すべて", "Lahat", "Усі", "Все"),
  noMatches: tr(
    "Няма квартал по тези критерии — изчистете търсенето или филтрите.",
    "No quarter matches — clear the search or filters.",
    "Kein Viertel entspricht den Kriterien — Suche oder Filter zurücksetzen.",
    "Aucun quartier ne correspond — effacez la recherche ou les filtres.",
    "Nessun quartiere corrisponde — azzera la ricerca o i filtri.",
    "Eşleşen mahalle yok — aramayı veya filtreleri temizleyin.",
    "Ningún barrio coincide — borra la búsqueda o los filtros.",
    "Καμία συνοικία δεν ταιριάζει — καθαρίστε την αναζήτηση ή τα φίλτρα.",
    "条件に合う街区がありません。検索やフィルターをクリアしてください。",
    "Walang tumutugmang purok — burahin ang paghahanap o mga filter.",
    "Жоден квартал не відповідає — очистіть пошук або фільтри.",
    "Ни один квартал не подходит — очистите поиск или фильтры."
  ),
  resetFilters: tr("Изчисти", "Reset", "Zurücksetzen", "Réinitialiser", "Azzera", "Sıfırla", "Restablecer", "Επαναφορά", "リセット", "I-reset", "Скинути", "Сбросить"),
  openQuarter: tr(
    "Отвори квартала",
    "Open quarter",
    "Viertel öffnen",
    "Ouvrir le quartier",
    "Apri il quartiere",
    "Mahalleyi aç",
    "Abrir el barrio",
    "Άνοιγμα συνοικίας",
    "街区を開く",
    "Buksan ang purok",
    "Відкрити квартал",
    "Открыть квартал"
  ),
  mapTitle: tr(
    "Кварталите на картата",
    "The quarters on the map",
    "Die Viertel auf der Karte",
    "Les quartiers sur la carte",
    "I quartieri sulla mappa",
    "Haritada mahalleler",
    "Los barrios en el mapa",
    "Οι συνοικίες στον χάρτη",
    "地図で見る街区",
    "Mga purok sa mapa",
    "Квартали на карті",
    "Кварталы на карте"
  ),
  approxNote: tr(
    "Точките показват приблизително разположение, а не официални граници.",
    "Markers show approximate locations, not official boundaries.",
    "Die Markierungen zeigen ungefähre Lagen, keine amtlichen Grenzen.",
    "Les repères indiquent des emplacements approximatifs, pas des limites officielles.",
    "I segnaposto indicano posizioni approssimative, non confini ufficiali.",
    "İşaretler resmi sınırları değil yaklaşık konumları gösterir.",
    "Los marcadores muestran ubicaciones aproximadas, no límites oficiales.",
    "Οι δείκτες δείχνουν κατά προσέγγιση θέσεις, όχι επίσημα όρια.",
    "マーカーはおおよその位置を示すもので、公式な境界ではありません。",
    "Ipinapakita ng mga marker ang tinatayang lokasyon, hindi opisyal na hangganan.",
    "Позначки показують приблизне розташування, а не офіційні межі.",
    "Метки показывают примерное расположение, а не официальные границы."
  ),
  backToIndex: tr(
    "Всички квартали",
    "All quarters",
    "Alle Viertel",
    "Tous les quartiers",
    "Tutti i quartieri",
    "Tüm mahalleler",
    "Todos los barrios",
    "Όλες οι συνοικίες",
    "すべての街区",
    "Lahat ng purok",
    "Усі квартали",
    "Все кварталы"
  ),
  atGlance: tr("Накратко", "At a glance", "Auf einen Blick", "En un coup d'œil", "In breve", "Bir bakışta", "De un vistazo", "Με μια ματιά", "ひと目でわかる", "Sa isang tingin", "Стисло", "Кратко"),
  areaLabel: tr("Част от града", "Part of the city", "Stadtteil", "Partie de la ville", "Parte della città", "Şehrin bölgesi", "Parte de la ciudad", "Μέρος της πόλης", "エリア", "Bahagi ng lungsod", "Частина міста", "Часть города"),
  districtLabel: tr("Район", "District", "Bezirk", "Arrondissement", "Distretto", "İlçe", "Distrito", "Δήμος-διαμέρισμα", "行政区", "Distrito", "Район", "Район"),
  erasLabel: tr("Формиращи епохи", "Formative eras", "Prägende Epochen", "Époques formatrices", "Epoche formative", "Belirleyici dönemler", "Épocas formativas", "Διαμορφωτικές εποχές", "形成期", "Mga bumuo na panahon", "Формувальні доби", "Формирующие эпохи"),
  firstRecord: tr("Най-ранна дата", "Earliest date", "Frühestes Datum", "Date la plus ancienne", "Data più antica", "En erken tarih", "Fecha más antigua", "Παλαιότερη χρονολογία", "最も古い記録", "Pinakamaagang petsa", "Найдавніша дата", "Самая ранняя дата"),
  nameOriginTitle: tr(
    "Откъде идва името",
    "Where the name comes from",
    "Woher der Name kommt",
    "D'où vient le nom",
    "Da dove viene il nome",
    "İsim nereden geliyor",
    "De dónde viene el nombre",
    "Από πού προέρχεται το όνομα",
    "名前の由来",
    "Saan nagmula ang pangalan",
    "Звідки походить назва",
    "Откуда происходит название"
  ),
  timelineTitle: tr(
    "Хронология на квартала",
    "Quarter timeline",
    "Chronik des Viertels",
    "Chronologie du quartier",
    "Cronologia del quartiere",
    "Mahalle kronolojisi",
    "Cronología del barrio",
    "Χρονολόγιο της συνοικίας",
    "街区の年表",
    "Kronolohiya ng purok",
    "Хронологія кварталу",
    "Хронология квартала"
  ),
  keyPlaces: tr(
    "Ключови места",
    "Key places",
    "Wichtige Orte",
    "Lieux clés",
    "Luoghi chiave",
    "Önemli yerler",
    "Lugares clave",
    "Βασικές τοποθεσίες",
    "主要スポット",
    "Mahahalagang lugar",
    "Ключові місця",
    "Ключевые места"
  ),
  linkedStories: tr(
    "Свързани разкази",
    "Linked stories",
    "Verknüpfte Geschichten",
    "Récits liés",
    "Racconti collegati",
    "Bağlantılı anlatılar",
    "Relatos vinculados",
    "Συνδεδεμένες αφηγήσεις",
    "関連ストーリー",
    "Kaugnay na kuwento",
    "Пов'язані розповіді",
    "Связанные истории"
  ),
  archiveTitle: tr(
    "Архив и тогава/сега",
    "Archive and then/now",
    "Archiv und damals/heute",
    "Archives et avant/après",
    "Archivio e prima/dopo",
    "Arşiv ve önce/sonra",
    "Archivo y antes/después",
    "Αρχείο και πριν/μετά",
    "アーカイブと今昔比較",
    "Arkibo at noon/ngayon",
    "Архів і тоді/тепер",
    "Архив и тогда/сейчас"
  ),
  civicTitle: tr(
    "Общински проекти в района",
    "Municipal projects in the district",
    "Kommunale Projekte im Bezirk",
    "Projets municipaux de l'arrondissement",
    "Progetti comunali nel distretto",
    "İlçedeki belediye projeleri",
    "Proyectos municipales del distrito",
    "Δημοτικά έργα στο διαμέρισμα",
    "行政区の市の事業",
    "Mga proyektong munisipal sa distrito",
    "Муніципальні проєкти району",
    "Муниципальные проекты района"
  ),
  gettingThereTitle: tr(
    "Как да стигнете",
    "Getting there",
    "Anreise",
    "S'y rendre",
    "Come arrivare",
    "Nasıl gidilir",
    "Cómo llegar",
    "Πώς να φτάσετε",
    "アクセス",
    "Papaano pumunta",
    "Як дістатися",
    "Как добраться"
  ),
  routesTitle: tr(
    "Маршрути през квартала",
    "Routes through the quarter",
    "Routen durch das Viertel",
    "Parcours dans le quartier",
    "Percorsi nel quartiere",
    "Mahalleden geçen rotalar",
    "Rutas por el barrio",
    "Διαδρομές μέσα στη συνοικία",
    "街区を通るルート",
    "Mga rutang dumadaan sa purok",
    "Маршрути кварталом",
    "Маршруты по кварталу"
  ),
  sourcesTitle: tr("Източници", "Sources", "Quellen", "Sources", "Fonti", "Kaynaklar", "Fuentes", "Πηγές", "出典", "Mga pinagmulan", "Джерела", "Источники"),
  coverageTitle: tr(
    "Какво още не е документирано",
    "What is not yet documented",
    "Was noch nicht dokumentiert ist",
    "Ce qui n'est pas encore documenté",
    "Cosa non è ancora documentato",
    "Henüz belgelenmemiş olanlar",
    "Lo que aún no está documentado",
    "Τι δεν έχει τεκμηριωθεί ακόμη",
    "まだ記録されていないこと",
    "Ang hindi pa nadodokumento",
    "Що ще не задокументовано",
    "Что ещё не задокументировано"
  ),
  minutes: tr("мин", "min", "Min.", "min", "min", "dk", "min", "λεπ.", "分", "min", "хв", "мин"),
  km: tr("км", "km", "km", "km", "km", "km", "km", "χλμ.", "km", "km", "км", "км"),
  stops: tr("спирки", "stops", "Stationen", "étapes", "tappe", "durak", "paradas", "στάσεις", "地点", "hintuan", "зупинки", "остановки"),
  openPlace: tr("Отвори мястото", "Open place", "Ort öffnen", "Ouvrir le lieu", "Apri il luogo", "Yeri aç", "Abrir lugar", "Άνοιγμα τοποθεσίας", "場所を開く", "Buksan ang lugar", "Відкрити місце", "Открыть место"),
  openStory: tr("Отвори разказа", "Open story", "Geschichte öffnen", "Ouvrir le récit", "Apri il racconto", "Anlatıyı aç", "Abrir relato", "Άνοιγμα αφήγησης", "ストーリーを開く", "Buksan ang kuwento", "Відкрити розповідь", "Открыть историю"),
  openRoute: tr("Отвори маршрута", "Open route", "Route öffnen", "Ouvrir le parcours", "Apri il percorso", "Rotayı aç", "Abrir la ruta", "Άνοιγμα διαδρομής", "ルートを開く", "Buksan ang ruta", "Відкрити маршрут", "Открыть маршрут"),
  allProjects: tr("Всички проекти", "All projects", "Alle Projekte", "Tous les projets", "Tutti i progetti", "Tüm projeler", "Todos los proyectos", "Όλα τα έργα", "すべての事業", "Lahat ng proyekto", "Усі проєкти", "Все проекты"),
  thenNow: tr("тогава/сега", "then/now", "damals/heute", "avant/après", "prima/dopo", "önce/sonra", "antes/después", "πριν/μετά", "今昔比較", "noon/ngayon", "тоді/тепер", "тогда/сейчас"),
  archiveWord: tr("архив", "archive", "Archiv", "archives", "archivio", "arşiv", "archivo", "αρχείο", "アーカイブ", "arkibo", "архів", "архив"),
  updatedWord: tr("Обновено", "Updated", "Aktualisiert", "Mis à jour", "Aggiornato", "Güncellendi", "Actualizado", "Ενημερώθηκε", "更新日", "Na-update", "Оновлено", "Обновлено"),
  whyTitle: tr(
    "Защо този квартал е важен",
    "Why this quarter matters",
    "Warum dieses Viertel zählt",
    "Pourquoi ce quartier compte",
    "Perché questo quartiere conta",
    "Bu mahalle neden önemli",
    "Por qué importa este barrio",
    "Γιατί μετράει αυτή η συνοικία",
    "この街区が重要な理由",
    "Bakit mahalaga ang purok na ito",
    "Чому цей квартал важливий",
    "Почему этот квартал важен"
  ),
  altNamesTitle: tr(
    "Други имена",
    "Also known as",
    "Auch bekannt als",
    "Autres noms",
    "Altri nomi",
    "Diğer adları",
    "Otros nombres",
    "Άλλες ονομασίες",
    "別名",
    "Iba pang tawag",
    "Інші назви",
    "Другие названия"
  ),
  fabricTitle: tr(
    "Хора, общности и институции",
    "People, communities and institutions",
    "Menschen, Gemeinschaften und Institutionen",
    "Personnes, communautés et institutions",
    "Persone, comunità e istituzioni",
    "İnsanlar, topluluklar ve kurumlar",
    "Personas, comunidades e instituciones",
    "Άνθρωποι, κοινότητες και θεσμοί",
    "人・コミュニティ・機関",
    "Mga tao, komunidad at institusyon",
    "Люди, громади та установи",
    "Люди, общины и учреждения"
  ),
  visitTitle: tr(
    "За посетителя",
    "For the visitor",
    "Für Besucher",
    "Pour le visiteur",
    "Per chi visita",
    "Ziyaretçi için",
    "Para el visitante",
    "Για τον επισκέπτη",
    "訪れる人へ",
    "Para sa bisita",
    "Для відвідувача",
    "Для посетителя"
  ),
  visitSee: tr("Какво да видите", "What to see", "Was ansehen", "Que voir", "Cosa vedere", "Ne görmeli", "Qué ver", "Τι να δείτε", "見どころ", "Ano ang makikita", "Що подивитися", "Что посмотреть"),
  visitTime: tr("Колко време", "How long", "Wie lange", "Combien de temps", "Quanto tempo", "Ne kadar süre", "Cuánto tiempo", "Πόσος χρόνος", "所要時間", "Gaano katagal", "Скільки часу", "Сколько времени"),
  visitBest: tr("Кога да дойдете", "When to come", "Wann kommen", "Quand venir", "Quando venire", "Ne zaman gelmeli", "Cuándo venir", "Πότε να έρθετε", "おすすめの時間", "Kailan pupunta", "Коли приходити", "Когда приходить"),
  visitFood: tr("Храна наблизо", "Food nearby", "Essen in der Nähe", "Où manger", "Dove mangiare", "Yakında yemek", "Comida cerca", "Φαγητό κοντά", "近くの食事", "Pagkain sa malapit", "Їжа поруч", "Еда рядом"),
  respectTitle: tr(
    "Посещавайте с уважение",
    "Visit with respect",
    "Mit Respekt besuchen",
    "Visiter avec respect",
    "Visitare con rispetto",
    "Saygıyla ziyaret edin",
    "Visitar con respeto",
    "Επισκεφθείτε με σεβασμό",
    "敬意をもって訪れる",
    "Bumisita nang may paggalang",
    "Відвідуйте з повагою",
    "Посещайте с уважением"
  ),
  tnTitle: tr(
    "Тогава и сега",
    "Then and now",
    "Damals und heute",
    "Hier et aujourd'hui",
    "Ieri e oggi",
    "Dün ve bugün",
    "Antes y ahora",
    "Τότε και τώρα",
    "今と昔",
    "Noon at ngayon",
    "Тоді й тепер",
    "Тогда и сейчас"
  ),
  contextBadge: tr(
    "Исторически контекст — малко картирани места",
    "Historical context — few mapped stops",
    "Historischer Kontext — wenige kartierte Orte",
    "Contexte historique — peu de lieux cartographiés",
    "Contesto storico — pochi luoghi mappati",
    "Tarihsel bağlam — az sayıda haritalanmış yer",
    "Contexto histórico — pocos lugares cartografiados",
    "Ιστορικό πλαίσιο — λίγες χαρτογραφημένες στάσεις",
    "歴史的背景ページ — 地図上のスポットは少なめ",
    "Kontekstong pangkasaysayan — kaunting naka-mapang lugar",
    "Історичний контекст — мало картованих місць",
    "Исторический контекст — мало отмеченных мест"
  ),
  tnThen: tr("Тогава", "Then", "Damals", "Hier", "Ieri", "Dün", "Antes", "Τότε", "昔", "Noon", "Тоді", "Тогда"),
  tnNow: tr("Референтна снимка", "Reference photo", "Referenzfoto", "Photo de référence", "Foto di riferimento", "Referans fotoğrafı", "Foto de referencia", "Φωτογραφία αναφοράς", "参照写真", "Larawang sanggunian", "Довідкове фото", "Справочное фото"),
  dataBoundary: tr(
    "Кварталните записи преизползват съществуващи места, разкази и източници; където документацията е откъслечна, това е казано изрично.",
    "Quarter records reuse existing places, stories and sources; where documentation is fragmentary, this is said explicitly.",
    "Die Vierteleinträge nutzen vorhandene Orte, Geschichten und Quellen; wo die Dokumentation lückenhaft ist, wird dies ausdrücklich gesagt.",
    "Les fiches de quartier réutilisent des lieux, récits et sources existants ; là où la documentation est fragmentaire, cela est dit explicitement.",
    "Le schede dei quartieri riusano luoghi, racconti e fonti esistenti; dove la documentazione è frammentaria, lo si dichiara esplicitamente.",
    "Mahalle kayıtları mevcut yerleri, anlatıları ve kaynakları yeniden kullanır; belgelerin eksik olduğu yerlerde bu açıkça belirtilir.",
    "Las fichas de barrio reutilizan lugares, relatos y fuentes existentes; donde la documentación es fragmentaria, se dice explícitamente.",
    "Οι εγγραφές των συνοικιών επαναχρησιμοποιούν υπάρχουσες τοποθεσίες, αφηγήσεις και πηγές· όπου η τεκμηρίωση είναι αποσπασματική, αυτό δηλώνεται ρητά.",
    "街区の記録は既存の場所・ストーリー・出典を再利用しています。資料が断片的な箇所は、その旨を明記しています。",
    "Muling ginagamit ng mga talaan ng purok ang umiiral na mga lugar, kuwento at pinagmulan; kung saan pira-piraso ang dokumentasyon, tahasang sinasabi ito.",
    "Записи кварталів повторно використовують наявні місця, розповіді та джерела; де документація фрагментарна, це сказано прямо.",
    "Записи кварталов используют существующие места, истории и источники; где документация фрагментарна, это сказано прямо."
  )
} satisfies Record<string, Record<Lang, string>>;

export type NeighbourhoodLabelKey = keyof typeof labelTable;

export function neighbourhoodLabels(lang: Lang): Record<NeighbourhoodLabelKey, string> {
  return pick(labelTable, lang) as Record<NeighbourhoodLabelKey, string>;
}

export function neighbourhoodEraLabels(lang: Lang): Record<NeighbourhoodEraTag, string> {
  return pick(eraTable, lang) as Record<NeighbourhoodEraTag, string>;
}

export function neighbourhoodAreaLabels(lang: Lang): Record<NeighbourhoodArea, string> {
  return pick(areaTable, lang) as Record<NeighbourhoodArea, string>;
}

export function neighbourhoodFabricKindLabels(lang: Lang): Record<string, string> {
  return pick(fabricKindTable, lang);
}
