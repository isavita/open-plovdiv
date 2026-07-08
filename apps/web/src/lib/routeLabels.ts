import type { Lang } from "../i18n/ui";
import type {
  RouteCategory,
  RouteDifficulty,
  RouteDurationBand,
  RoutePracticalKind,
  RouteWheelchair
} from "./routes";

/**
 * UI strings shared by the routes index and the per-route detail pages, in
 * the site's canonical 12-locale order. Route CONTENT (titles, notes,
 * guidance) lives in data/curated/walking-routes.json and flows through the
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

const categoryTable: Record<RouteCategory, Record<Lang, string>> = {
  "first-visit": tr(
    "За първо посещение",
    "First visit",
    "Erster Besuch",
    "Première visite",
    "Prima visita",
    "İlk ziyaret",
    "Primera visita",
    "Πρώτη επίσκεψη",
    "初めての訪問",
    "Unang pagbisita",
    "Перший візит",
    "Первый визит"
  ),
  "history-layers": tr(
    "Исторически пластове",
    "Historic layers",
    "Historische Schichten",
    "Couches historiques",
    "Strati storici",
    "Tarihi katmanlar",
    "Capas históricas",
    "Ιστορικά στρώματα",
    "歴史の積み重ね",
    "Mga yugto ng kasaysayan",
    "Історичні шари",
    "Исторические слои"
  ),
  sacred: tr(
    "Храмове и общности",
    "Sacred & communities",
    "Sakralorte & Gemeinschaften",
    "Sacré & communautés",
    "Sacro e comunità",
    "Kutsal ve topluluklar",
    "Sagrado y comunidades",
    "Ιερά και κοινότητες",
    "聖地とコミュニティ",
    "Sagrado at mga komunidad",
    "Святині та громади",
    "Святыни и общины"
  ),
  creative: tr(
    "Изкуство и музеи",
    "Creative & museums",
    "Kreatives & Museen",
    "Créatif & musées",
    "Creatività e musei",
    "Yaratıcılık ve müzeler",
    "Creatividad y museos",
    "Δημιουργία και μουσεία",
    "アートと博物館",
    "Sining at mga museo",
    "Творчість і музеї",
    "Творчество и музеи"
  ),
  nature: tr(
    "Тепета, паркове и река",
    "Hills, parks & river",
    "Hügel, Parks & Fluss",
    "Collines, parcs & rivière",
    "Colline, parchi e fiume",
    "Tepeler, parklar ve nehir",
    "Colinas, parques y río",
    "Λόφοι, πάρκα και ποτάμι",
    "丘と公園と川",
    "Mga burol, parke at ilog",
    "Пагорби, парки та річка",
    "Холмы, парки и река"
  )
};

const durationBandTable: Record<RouteDurationBand, Record<Lang, string>> = {
  short: tr(
    "до около час",
    "about an hour",
    "rund eine Stunde",
    "environ une heure",
    "circa un'ora",
    "yaklaşık bir saat",
    "alrededor de una hora",
    "περίπου μία ώρα",
    "1時間前後",
    "mga isang oras",
    "близько години",
    "около часа"
  ),
  "half-day": tr(
    "половин ден",
    "half a day",
    "ein halber Tag",
    "une demi-journée",
    "mezza giornata",
    "yarım gün",
    "media jornada",
    "μισή μέρα",
    "半日",
    "kalahating araw",
    "півдня",
    "полдня"
  ),
  "full-day": tr(
    "цял ден",
    "a full day",
    "ein ganzer Tag",
    "une journée entière",
    "una giornata intera",
    "tam gün",
    "un día completo",
    "ολόκληρη μέρα",
    "終日",
    "buong araw",
    "цілий день",
    "весь день"
  )
};

const difficultyTable: Record<RouteDifficulty, Record<Lang, string>> = {
  easy: tr("лек", "easy", "leicht", "facile", "facile", "kolay", "fácil", "εύκολη", "楽", "madali", "легкий", "лёгкий"),
  moderate: tr(
    "умерен",
    "moderate",
    "mittel",
    "modéré",
    "moderato",
    "orta",
    "moderado",
    "μέτρια",
    "ふつう",
    "katamtaman",
    "помірний",
    "умеренный"
  ),
  steep: tr(
    "стръмен",
    "steep",
    "steil",
    "escarpé",
    "ripido",
    "dik",
    "empinado",
    "απότομη",
    "急坂あり",
    "matarik",
    "крутий",
    "крутой"
  )
};

const wheelchairTable: Record<RouteWheelchair, Record<Lang, string>> = {
  good: tr(
    "на равно, без стъпала",
    "level, step-free",
    "eben, stufenfrei",
    "plat, sans marches",
    "in piano, senza gradini",
    "düz, basamaksız",
    "llano, sin escalones",
    "επίπεδη, χωρίς σκαλοπάτια",
    "平坦・段差なし",
    "patag, walang hagdan",
    "рівний, без сходинок",
    "ровный, без ступеней"
  ),
  partial: tr(
    "частично на равно",
    "partly level",
    "teilweise eben",
    "partiellement plat",
    "in parte in piano",
    "kısmen düz",
    "parcialmente llano",
    "εν μέρει επίπεδη",
    "一部平坦",
    "bahagyang patag",
    "частково рівний",
    "частично ровный"
  ),
  hard: tr(
    "калдъръм и стълби",
    "cobbles and stairs",
    "Kopfsteinpflaster und Treppen",
    "pavés et escaliers",
    "ciottoli e scale",
    "arnavut kaldırımı ve merdivenler",
    "adoquines y escaleras",
    "λιθόστρωτα και σκάλες",
    "石畳と階段",
    "cobblestone at hagdan",
    "бруківка та сходи",
    "булыжник и лестницы"
  )
};

const practicalKindTable: Record<RoutePracticalKind, Record<Lang, string>> = {
  food: tr("Храна", "Food", "Essen", "Restauration", "Cibo", "Yemek", "Comida", "Φαγητό", "食事", "Pagkain", "Їжа", "Еда"),
  water: tr("Вода", "Water", "Wasser", "Eau", "Acqua", "Su", "Agua", "Νερό", "水分", "Tubig", "Вода", "Вода"),
  terrain: tr("Терен", "Terrain", "Gelände", "Terrain", "Terreno", "Zemin", "Terreno", "Έδαφος", "路面", "Terrain", "Рельєф", "Рельеф"),
  transit: tr(
    "Градски транспорт",
    "Public transport",
    "Nahverkehr",
    "Transports publics",
    "Trasporto pubblico",
    "Toplu taşıma",
    "Transporte público",
    "Συγκοινωνίες",
    "公共交通",
    "Pampublikong transportasyon",
    "Громадський транспорт",
    "Общественный транспорт"
  ),
  luggage: tr("Багаж", "Luggage", "Gepäck", "Bagages", "Bagagli", "Bagaj", "Equipaje", "Αποσκευές", "荷物", "Bagahe", "Багаж", "Багаж"),
  toilets: tr("Тоалетни", "Toilets", "Toiletten", "Toilettes", "Servizi", "Tuvaletler", "Aseos", "Τουαλέτες", "トイレ", "Palikuran", "Туалети", "Туалеты"),
  shade: tr("Сянка", "Shade", "Schatten", "Ombre", "Ombra", "Gölge", "Sombra", "Σκιά", "日陰", "Lilim", "Тінь", "Тень"),
  safety: tr("Внимание", "Take care", "Beachten", "À noter", "Attenzione", "Dikkat", "Atención", "Προσοχή", "注意", "Paalala", "Зверніть увагу", "Обратите внимание")
};

const labelTable = {
  // routes index -------------------------------------------------------------
  indexTitle: tr(
    "Маршрути за разходка в Пловдив",
    "Walking Routes in Plovdiv",
    "Spazierwege in Plovdiv",
    "Parcours à pied à Plovdiv",
    "Percorsi a piedi a Plovdiv",
    "Plovdiv yürüyüş rotaları",
    "Rutas a pie en Plovdiv",
    "Περιπατητικές διαδρομές στο Plovdiv",
    "Plovdivの散策ルート",
    "Mga Ruta na Lalakaran sa Plovdiv",
    "Пішохідні маршрути Пловдива",
    "Пешеходные маршруты Пловдива"
  ),
  indexEyebrow: tr(
    "За посетители",
    "For visitors",
    "Für Besucher",
    "Pour les visiteurs",
    "Per visitatori",
    "Ziyaretçiler için",
    "Para visitantes",
    "Για επισκέπτες",
    "訪問者向け",
    "Para sa mga bisita",
    "Для відвідувачів",
    "Для гостей города"
  ),
  indexLead: tr(
    "Шестнадесет самостоятелни маршрута с реална пешеходна линия, времена и практични бележки — изградени от документираните места, разкази и източници на Open Plovdiv.",
    "Sixteen self-guided routes with real walking lines, timings and practical notes — built from the documented places, stories and sources of Open Plovdiv.",
    "Sechzehn selbstgeführte Routen mit echten Gehlinien, Zeiten und praktischen Hinweisen — aufgebaut aus den dokumentierten Orten, Geschichten und Quellen von Open Plovdiv.",
    "Seize parcours autonomes avec tracés piétons réels, durées et notes pratiques — construits à partir des lieux, récits et sources documentés d'Open Plovdiv.",
    "Sedici percorsi autoguidati con tracciati pedonali reali, tempi e note pratiche — costruiti dai luoghi, racconti e fonti documentati di Open Plovdiv.",
    "Gerçek yürüyüş hatları, süreler ve pratik notlarla on altı rota — Open Plovdiv'in belgelenmiş yerleri, anlatıları ve kaynaklarından oluşturuldu.",
    "Dieciséis rutas autoguiadas con trazados peatonales reales, tiempos y notas prácticas — creadas a partir de los lugares, relatos y fuentes documentados de Open Plovdiv.",
    "Δεκαέξι αυτοκαθοδηγούμενες διαδρομές με πραγματικές πεζοπορικές γραμμές, χρόνους και πρακτικές σημειώσεις — χτισμένες από τις τεκμηριωμένες τοποθεσίες, αφηγήσεις και πηγές του Open Plovdiv.",
    "実際の歩行ルート・所要時間・実用メモを備えた16のセルフガイドルート。Open Plovdivの記録済みの場所、ストーリー、出典から組み立てています。",
    "Labing-anim na rutang self-guided na may totoong linya ng lakad, oras at praktikal na tala — hango sa mga dokumentadong lugar, kuwento at pinagmulan ng Open Plovdiv.",
    "Шістнадцять маршрутів для самостійних прогулянок зі справжніми пішохідними лініями, часом і практичними порадами — на основі задокументованих місць, розповідей і джерел Open Plovdiv.",
    "Шестнадцать самостоятельных маршрутов с реальными пешеходными линиями, временем и практичными заметками — на основе задокументированных мест, историй и источников Open Plovdiv."
  ),
  routes: tr("маршрута", "routes", "Routen", "parcours", "percorsi", "rota", "rutas", "διαδρομές", "ルート", "ruta", "маршрути", "маршрутов"),
  stops: tr("спирки", "stops", "Stationen", "étapes", "tappe", "durak", "paradas", "στάσεις", "地点", "hintuan", "зупинки", "остановки"),
  totalKm: tr("км общо", "km in total", "km insgesamt", "km au total", "km in totale", "km toplam", "km en total", "χλμ. συνολικά", "km合計", "km kabuuan", "км загалом", "км всего"),
  sources: tr("източници", "sources", "Quellen", "sources", "fonti", "kaynak", "fuentes", "πηγές", "出典", "pinagmulan", "джерела", "источники"),
  filterTitle: tr(
    "Намерете своя маршрут",
    "Find your route",
    "Finden Sie Ihre Route",
    "Trouvez votre parcours",
    "Trova il tuo percorso",
    "Rotanızı bulun",
    "Encuentra tu ruta",
    "Βρείτε τη διαδρομή σας",
    "ルートを探す",
    "Hanapin ang iyong ruta",
    "Знайдіть свій маршрут",
    "Найдите свой маршрут"
  ),
  filterLead: tr(
    "Филтрирайте по тема, продължителност и терен. Всеки маршрут показва реално изчислено разстояние и практични бележки.",
    "Filter by theme, length and terrain. Every route shows a real computed distance and practical notes.",
    "Filtern Sie nach Thema, Länge und Gelände. Jede Route zeigt eine real berechnete Distanz und praktische Hinweise.",
    "Filtrez par thème, durée et terrain. Chaque parcours affiche une distance réellement calculée et des notes pratiques.",
    "Filtra per tema, durata e terreno. Ogni percorso mostra una distanza calcolata realmente e note pratiche.",
    "Tema, süre ve zemine göre filtreleyin. Her rota gerçek hesaplanmış mesafe ve pratik notlar gösterir.",
    "Filtra por tema, duración y terreno. Cada ruta muestra una distancia calculada real y notas prácticas.",
    "Φιλτράρετε ανά θέμα, διάρκεια και έδαφος. Κάθε διαδρομή δείχνει πραγματικά υπολογισμένη απόσταση και πρακτικές σημειώσεις.",
    "テーマ・所要時間・路面で絞り込めます。各ルートには実測ベースの距離と実用メモが付いています。",
    "Mag-filter ayon sa tema, haba at terrain. Bawat ruta ay may totoong kalkuladong distansya at praktikal na tala.",
    "Фільтруйте за темою, тривалістю та рельєфом. Кожен маршрут показує реально обчислену відстань і практичні поради.",
    "Фильтруйте по теме, длительности и рельефу. Каждый маршрут показывает реально рассчитанное расстояние и практичные заметки."
  ),
  filterAll: tr("Всички", "All", "Alle", "Tous", "Tutti", "Tümü", "Todas", "Όλες", "すべて", "Lahat", "Усі", "Все"),
  filterTheme: tr("Тема", "Theme", "Thema", "Thème", "Tema", "Tema", "Tema", "Θέμα", "テーマ", "Tema", "Тема", "Тема"),
  filterLength: tr("Продължителност", "Length", "Dauer", "Durée", "Durata", "Süre", "Duración", "Διάρκεια", "所要時間", "Tagal", "Тривалість", "Длительность"),
  filterMore: tr("Подходящи за", "Good for", "Geeignet für", "Adapté pour", "Adatto per", "Uygun", "Ideal para", "Κατάλληλη για", "こんな時に", "Angkop para sa", "Підходить для", "Подходит для"),
  toggleStepFree: tr(
    "Без стъпала",
    "Step-free",
    "Stufenfrei",
    "Sans marches",
    "Senza gradini",
    "Basamaksız",
    "Sin escalones",
    "Χωρίς σκαλοπάτια",
    "段差なし",
    "Walang hagdan",
    "Без сходинок",
    "Без ступеней"
  ),
  toggleFamily: tr("С деца", "With kids", "Mit Kindern", "Avec enfants", "Con bambini", "Çocuklarla", "Con niños", "Με παιδιά", "子ども連れ", "May mga bata", "З дітьми", "С детьми"),
  toggleRainy: tr("При дъжд", "Rainy day", "Bei Regen", "Jour de pluie", "Giorno di pioggia", "Yağmurlu gün", "Día de lluvia", "Βροχερή μέρα", "雨の日", "Maulan na araw", "У дощ", "В дождь"),
  toggleTransit: tr(
    "С транспорт",
    "Uses transit",
    "Mit Nahverkehr",
    "Avec transports",
    "Con mezzi pubblici",
    "Toplu taşımalı",
    "Con transporte",
    "Με συγκοινωνία",
    "交通機関利用",
    "May transportasyon",
    "З транспортом",
    "С транспортом"
  ),
  noMatches: tr(
    "Няма маршрут с тази комбинация от филтри — премахнете един-два.",
    "No route matches this filter combination — clear one or two.",
    "Keine Route entspricht dieser Filterkombination — entfernen Sie ein bis zwei Filter.",
    "Aucun parcours ne correspond à cette combinaison — retirez un ou deux filtres.",
    "Nessun percorso corrisponde a questa combinazione — togli uno o due filtri.",
    "Bu filtre kombinasyonuna uyan rota yok — bir ikisini kaldırın.",
    "Ninguna ruta coincide con esta combinación — quita uno o dos filtros.",
    "Καμία διαδρομή δεν ταιριάζει σε αυτόν τον συνδυασμό — αφαιρέστε ένα δύο φίλτρα.",
    "この条件に合うルートがありません。フィルターを1〜2個外してください。",
    "Walang rutang tumutugma sa kombinasyong ito — alisin ang isa o dalawa.",
    "Жоден маршрут не відповідає цій комбінації — приберіть один-два фільтри.",
    "Ни один маршрут не подходит под эту комбинацию — уберите один-два фильтра."
  ),
  resetFilters: tr(
    "Изчисти филтрите",
    "Reset filters",
    "Filter zurücksetzen",
    "Réinitialiser les filtres",
    "Azzera i filtri",
    "Filtreleri sıfırla",
    "Restablecer filtros",
    "Επαναφορά φίλτρων",
    "フィルターをリセット",
    "I-reset ang mga filter",
    "Скинути фільтри",
    "Сбросить фильтры"
  ),
  openRoute: tr(
    "Отвори маршрута",
    "Open route",
    "Route öffnen",
    "Ouvrir le parcours",
    "Apri il percorso",
    "Rotayı aç",
    "Abrir la ruta",
    "Άνοιγμα διαδρομής",
    "ルートを開く",
    "Buksan ang ruta",
    "Відкрити маршрут",
    "Открыть маршрут"
  ),
  allPlaces: tr("Всички места", "All places", "Alle Orte", "Tous les lieux", "Tutti i luoghi", "Tüm yerler", "Todos los lugares", "Όλες οι τοποθεσίες", "すべての場所", "Lahat ng lugar", "Усі місця", "Все места"),
  dataBoundary: tr(
    "Маршрутите използват съществуващи записи; времената са посетителска ориентация, а историческите твърдения остават в свързаните източници.",
    "Routes reuse existing records; timings are visitor guidance, while historical claims stay with the linked sources.",
    "Die Routen verwenden vorhandene Datensätze; Zeiten dienen der Orientierung, historische Aussagen bleiben bei den verlinkten Quellen.",
    "Les parcours réutilisent les fiches existantes ; les durées servent d'orientation, les affirmations historiques restent liées aux sources.",
    "I percorsi riusano schede esistenti; i tempi sono orientativi, le affermazioni storiche restano nelle fonti collegate.",
    "Rotalar mevcut kayıtları kullanır; süreler yönlendirme amaçlıdır, tarihsel iddialar bağlı kaynaklarda kalır.",
    "Las rutas reutilizan registros existentes; los tiempos orientan al visitante y las afirmaciones históricas permanecen en las fuentes enlazadas.",
    "Οι διαδρομές επαναχρησιμοποιούν υπάρχουσες εγγραφές· οι χρόνοι είναι οδηγός επίσκεψης, ενώ οι ιστορικοί ισχυρισμοί μένουν στις πηγές.",
    "ルートは既存の記録を再利用します。時間は目安で、歴史的記述はリンク先の出典に基づきます。",
    "Muling ginagamit ng mga ruta ang umiiral na talaan; ang oras ay gabay lamang, habang ang mga makasaysayang pahayag ay nasa kaugnay na pinagmulan.",
    "Маршрути повторно використовують наявні записи; час є орієнтиром, а історичні твердження залишаються за пов'язаними джерелами.",
    "Маршруты используют существующие записи; время — ориентир, а исторические утверждения остаются за связанными источниками."
  ),
  // shared facts --------------------------------------------------------------
  distance: tr("Разстояние", "Distance", "Distanz", "Distance", "Distanza", "Mesafe", "Distancia", "Απόσταση", "距離", "Distansya", "Відстань", "Расстояние"),
  suggestedTime: tr(
    "Препоръчано време",
    "Suggested time",
    "Empfohlene Zeit",
    "Durée suggérée",
    "Tempo suggerito",
    "Önerilen süre",
    "Tiempo sugerido",
    "Προτεινόμενος χρόνος",
    "目安時間",
    "Iminumungkahing oras",
    "Орієнтовний час",
    "Рекомендуемое время"
  ),
  walkingTime: tr(
    "Чисто ходене",
    "Pure walking",
    "Reine Gehzeit",
    "Marche seule",
    "Solo cammino",
    "Salt yürüyüş",
    "Solo caminata",
    "Καθαρό περπάτημα",
    "歩行時間のみ",
    "Purong lakad",
    "Чиста ходьба",
    "Только ходьба"
  ),
  ascent: tr("Изкачване", "Ascent", "Anstieg", "Dénivelé", "Dislivello", "Tırmanış", "Desnivel", "Ανάβαση", "上り", "Akyat", "Підйом", "Подъём"),
  difficulty: tr("Трудност", "Difficulty", "Schwierigkeit", "Difficulté", "Difficoltà", "Zorluk", "Dificultad", "Δυσκολία", "難易度", "Hirap", "Складність", "Сложность"),
  accessibility: tr("Достъпност", "Accessibility", "Zugänglichkeit", "Accessibilité", "Accessibilità", "Erişilebilirlik", "Accesibilidad", "Προσβασιμότητα", "アクセシビリティ", "Accessibility", "Доступність", "Доступность"),
  minutes: tr("мин", "min", "Min.", "min", "min", "dk", "min", "λεπ.", "分", "min", "хв", "мин"),
  km: tr("км", "km", "km", "km", "km", "km", "km", "χλμ.", "km", "km", "км", "км"),
  meters: tr("м", "m", "m", "m", "m", "m", "m", "μ.", "m", "m", "м", "м"),
  start: tr("Начало", "Start", "Start", "Départ", "Partenza", "Başlangıç", "Inicio", "Αρχή", "スタート", "Simula", "Початок", "Начало"),
  finish: tr("Край", "Finish", "Ziel", "Arrivée", "Arrivo", "Bitiş", "Final", "Τέλος", "ゴール", "Tapos", "Кінець", "Финиш"),
  // detail page ---------------------------------------------------------------
  backToRoutes: tr(
    "Всички маршрути",
    "All routes",
    "Alle Routen",
    "Tous les parcours",
    "Tutti i percorsi",
    "Tüm rotalar",
    "Todas las rutas",
    "Όλες οι διαδρομές",
    "すべてのルート",
    "Lahat ng ruta",
    "Усі маршрути",
    "Все маршруты"
  ),
  atGlance: tr("Накратко", "At a glance", "Auf einen Blick", "En un coup d'œil", "In breve", "Bir bakışta", "De un vistazo", "Με μια ματιά", "ひと目でわかる", "Sa isang tingin", "Стисло", "Кратко"),
  bestTime: tr(
    "Кога да тръгнете",
    "When to go",
    "Wann losgehen",
    "Quand partir",
    "Quando andare",
    "Ne zaman gitmeli",
    "Cuándo ir",
    "Πότε να πάτε",
    "おすすめの時間帯",
    "Kailan pupunta",
    "Коли вирушати",
    "Когда идти"
  ),
  gettingThere: tr(
    "Как да стигнете до старта",
    "Getting to the start",
    "Zum Startpunkt",
    "Rejoindre le départ",
    "Arrivare alla partenza",
    "Başlangıca ulaşım",
    "Cómo llegar al inicio",
    "Πώς να φτάσετε στην αρχή",
    "スタート地点への行き方",
    "Papunta sa simula",
    "Як дістатися до старту",
    "Как добраться до старта"
  ),
  afterFinish: tr(
    "След финала",
    "After the finish",
    "Nach dem Ziel",
    "Après l'arrivée",
    "Dopo l'arrivo",
    "Bitişten sonra",
    "Después del final",
    "Μετά το τέλος",
    "ゴールしたら",
    "Pagkatapos ng ruta",
    "Після фінішу",
    "После финиша"
  ),
  itinerary: tr(
    "Спирка по спирка",
    "Stop by stop",
    "Station für Station",
    "Étape par étape",
    "Tappa per tappa",
    "Durak durak",
    "Parada a parada",
    "Στάση προς στάση",
    "スポットごとの行程",
    "Bawat hintuan",
    "Зупинка за зупинкою",
    "Остановка за остановкой"
  ),
  stopWord: tr("Спирка", "Stop", "Station", "Étape", "Tappa", "Durak", "Parada", "Στάση", "地点", "Hintuan", "Зупинка", "Остановка"),
  ofWord: tr("от", "of", "von", "sur", "di", "/", "de", "από", "／", "ng", "з", "из"),
  walkWord: tr("пеша", "walk", "zu Fuß", "de marche", "a piedi", "yürüyüş", "a pie", "περπάτημα", "徒歩", "lakad", "пішки", "пешком"),
  suggestedStay: tr(
    "престой",
    "suggested stay",
    "empfohlener Aufenthalt",
    "temps sur place",
    "sosta suggerita",
    "önerilen mola",
    "tiempo en el lugar",
    "προτεινόμενη παραμονή",
    "滞在目安",
    "mungkahing tagal",
    "рекомендована зупинка",
    "рекомендуемая остановка"
  ),
  openPlace: tr(
    "Отвори мястото",
    "Open place",
    "Ort öffnen",
    "Ouvrir le lieu",
    "Apri il luogo",
    "Yeri aç",
    "Abrir lugar",
    "Άνοιγμα τοποθεσίας",
    "場所を開く",
    "Buksan ang lugar",
    "Відкрити місце",
    "Открыть место"
  ),
  detours: tr(
    "Струва си отбивката",
    "Worth a detour",
    "Lohnende Abstecher",
    "Détours qui valent le coup",
    "Deviazioni che valgono",
    "Sapmaya değer",
    "Desvíos que valen la pena",
    "Αξίζει την παράκαμψη",
    "寄り道のすすめ",
    "Sulit na liko",
    "Варті відхилення",
    "Стоит отклониться"
  ),
  nearRoute: tr(
    "Наблизо по маршрута",
    "Near this route",
    "In der Nähe der Route",
    "À proximité du parcours",
    "Vicino al percorso",
    "Rotanın yakınında",
    "Cerca de la ruta",
    "Κοντά στη διαδρομή",
    "ルート周辺",
    "Malapit sa rutang ito",
    "Поблизу маршруту",
    "Рядом с маршрутом"
  ),
  nearNote: tr(
    "Документирани места на до 400 м по права линия от спирка.",
    "Documented places within 400 m straight-line of a stop.",
    "Dokumentierte Orte bis 400 m Luftlinie von einer Station.",
    "Lieux documentés à moins de 400 m à vol d'oiseau d'une étape.",
    "Luoghi documentati entro 400 m in linea d'aria da una tappa.",
    "Bir durağa kuş uçuşu 400 m içindeki belgelenmiş yerler.",
    "Lugares documentados a menos de 400 m en línea recta de una parada.",
    "Τεκμηριωμένα μέρη έως 400 μ. σε ευθεία από στάση.",
    "各地点から直線距離400m以内の記録済みの場所。",
    "Mga dokumentadong lugar sa loob ng 400 m tuwid na linya mula sa hintuan.",
    "Задокументовані місця в межах 400 м по прямій від зупинки.",
    "Задокументированные места в пределах 400 м по прямой от остановки."
  ),
  practicalTitle: tr(
    "Добре е да знаете",
    "Good to know",
    "Gut zu wissen",
    "Bon à savoir",
    "Buono a sapersi",
    "Bilmekte fayda var",
    "Conviene saber",
    "Καλό είναι να ξέρετε",
    "知っておくと便利",
    "Mabuting malaman",
    "Варто знати",
    "Полезно знать"
  ),
  caveatsTitle: tr(
    "Преди тръгване",
    "Before you go",
    "Vor dem Start",
    "Avant de partir",
    "Prima di partire",
    "Yola çıkmadan",
    "Antes de salir",
    "Πριν ξεκινήσετε",
    "出発前に",
    "Bago umalis",
    "Перед виходом",
    "Перед выходом"
  ),
  mapTitle: tr(
    "Карта на маршрута",
    "Route map",
    "Routenkarte",
    "Carte du parcours",
    "Mappa del percorso",
    "Rota haritası",
    "Mapa de la ruta",
    "Χάρτης διαδρομής",
    "ルート地図",
    "Mapa ng ruta",
    "Карта маршруту",
    "Карта маршрута"
  ),
  mapHint: tr(
    "Кликнете върху номерирана спирка, за да отидете на описанието ѝ. Пунктираната линия следва реални пешеходни улици.",
    "Click a numbered stop to jump to its description. The line follows real walking streets.",
    "Klicken Sie auf eine nummerierte Station, um zu ihrer Beschreibung zu springen. Die Linie folgt echten Fußwegen.",
    "Cliquez sur une étape numérotée pour voir sa description. Le tracé suit de vraies rues piétonnes.",
    "Clicca una tappa numerata per andare alla descrizione. La linea segue strade percorribili reali.",
    "Numaralı durağa tıklayarak açıklamasına gidin. Çizgi gerçek yürüyüş yollarını izler.",
    "Haz clic en una parada numerada para ir a su descripción. La línea sigue calles peatonales reales.",
    "Κάντε κλικ σε αριθμημένη στάση για την περιγραφή της. Η γραμμή ακολουθεί πραγματικούς πεζόδρομους.",
    "番号付き地点をクリックすると説明へ移動します。線は実際に歩ける道をたどっています。",
    "I-click ang numerong hintuan para sa deskripsyon nito. Sumusunod ang linya sa totoong dinadaanang kalye.",
    "Натисніть на пронумеровану зупинку, щоб перейти до опису. Лінія йде реальними пішохідними вулицями.",
    "Нажмите на пронумерованную остановку, чтобы перейти к описанию. Линия проходит по реальным пешеходным улицам."
  ),
  approxNote: tr(
    "Линията и времената за ходене са изчислени по OpenStreetMap и са приблизителни — теренът и затворени улици могат да ги променят.",
    "The line and walking times are computed from OpenStreetMap and are approximate — terrain and street closures can change them.",
    "Linie und Gehzeiten sind aus OpenStreetMap berechnet und näherungsweise — Gelände und Sperrungen können sie verändern.",
    "Le tracé et les temps de marche sont calculés depuis OpenStreetMap et restent approximatifs — le terrain et les fermetures peuvent les modifier.",
    "Linea e tempi di cammino sono calcolati da OpenStreetMap e sono approssimativi — terreno e chiusure possono cambiarli.",
    "Hat ve yürüyüş süreleri OpenStreetMap'ten hesaplanmıştır ve yaklaşıktır — zemin ve kapalı yollar bunları değiştirebilir.",
    "El trazado y los tiempos de caminata se calculan desde OpenStreetMap y son aproximados — el terreno y los cierres pueden cambiarlos.",
    "Η γραμμή και οι χρόνοι περπατήματος υπολογίζονται από το OpenStreetMap και είναι κατά προσέγγιση — το έδαφος και τα κλεισίματα δρόμων μπορούν να τους αλλάξουν.",
    "ルートの線と歩行時間はOpenStreetMapから計算した目安です。路面状況や通行止めで変わることがあります。",
    "Ang linya at oras ng lakad ay kalkulado mula sa OpenStreetMap at tinatayang halaga lamang — maaaring magbago dahil sa terrain o saradong kalye.",
    "Лінія та час ходьби обчислені за OpenStreetMap і є приблизними — рельєф і перекриття вулиць можуть їх змінити.",
    "Линия и время ходьбы рассчитаны по OpenStreetMap и приблизительны — рельеф и перекрытия улиц могут их изменить."
  ),
  openInMaps: tr(
    "Отвори в приложение за карти",
    "Open in your map app",
    "In Karten-App öffnen",
    "Ouvrir dans une app de cartes",
    "Apri nell'app mappe",
    "Harita uygulamasında aç",
    "Abrir en tu app de mapas",
    "Άνοιγμα σε εφαρμογή χαρτών",
    "地図アプリで開く",
    "Buksan sa map app",
    "Відкрити в застосунку карт",
    "Открыть в приложении карт"
  ),
  mapAppShort: tr(
    "Карта",
    "Map app",
    "Karten-App",
    "Cartes",
    "Mappe",
    "Harita",
    "Mapas",
    "Χάρτες",
    "地図アプリ",
    "Mapa",
    "Карти",
    "Карты"
  ),
  downloadGpx: tr(
    "Свали GPX",
    "Download GPX",
    "GPX herunterladen",
    "Télécharger le GPX",
    "Scarica GPX",
    "GPX indir",
    "Descargar GPX",
    "Λήψη GPX",
    "GPXをダウンロード",
    "I-download ang GPX",
    "Завантажити GPX",
    "Скачать GPX"
  ),
  printRoute: tr(
    "Принтирай / офлайн",
    "Print / offline",
    "Drucken / offline",
    "Imprimer / hors ligne",
    "Stampa / offline",
    "Yazdır / çevrimdışı",
    "Imprimir / sin conexión",
    "Εκτύπωση / εκτός σύνδεσης",
    "印刷・オフライン用",
    "I-print / offline",
    "Друк / офлайн",
    "Печать / офлайн"
  ),
  shareRoute: tr(
    "Сподели маршрута",
    "Share route",
    "Route teilen",
    "Partager le parcours",
    "Condividi percorso",
    "Rotayı paylaş",
    "Compartir ruta",
    "Κοινοποίηση διαδρομής",
    "ルートを共有",
    "Ibahagi ang ruta",
    "Поділитися маршрутом",
    "Поделиться маршрутом"
  ),
  linkCopied: tr(
    "Връзката е копирана",
    "Link copied",
    "Link kopiert",
    "Lien copié",
    "Link copiato",
    "Bağlantı kopyalandı",
    "Enlace copiado",
    "Ο σύνδεσμος αντιγράφηκε",
    "リンクをコピーしました",
    "Nakopya ang link",
    "Посилання скопійовано",
    "Ссылка скопирована"
  ),
  startRoute: tr(
    "Започни маршрута",
    "Start this route",
    "Route starten",
    "Commencer le parcours",
    "Avvia il percorso",
    "Rotayı başlat",
    "Iniciar la ruta",
    "Έναρξη διαδρομής",
    "このルートを開始",
    "Simulan ang ruta",
    "Почати маршрут",
    "Начать маршрут"
  ),
  routeStory: tr(
    "Свързан разказ",
    "Linked story",
    "Verknüpfte Geschichte",
    "Récit lié",
    "Racconto collegato",
    "Bağlantılı anlatı",
    "Relato vinculado",
    "Συνδεδεμένη αφήγηση",
    "関連ストーリー",
    "Kaugnay na kuwento",
    "Пов'язана розповідь",
    "Связанная история"
  ),
  openStory: tr(
    "Отвори разказа",
    "Open story",
    "Geschichte öffnen",
    "Ouvrir le récit",
    "Apri il racconto",
    "Anlatıyı aç",
    "Abrir relato",
    "Άνοιγμα αφήγησης",
    "ストーリーを開く",
    "Buksan ang kuwento",
    "Відкрити розповідь",
    "Открыть историю"
  ),
  evidenceTitle: tr(
    "Записи и източници",
    "Records and sources",
    "Datensätze und Quellen",
    "Fiches et sources",
    "Schede e fonti",
    "Kayıtlar ve kaynaklar",
    "Registros y fuentes",
    "Εγγραφές και πηγές",
    "記録と出典",
    "Mga talaan at pinagmulan",
    "Записи та джерела",
    "Записи и источники"
  ),
  thenNow: tr("тогава/сега", "then/now", "damals/heute", "avant/après", "prima/dopo", "önce/sonra", "antes/después", "πριν/μετά", "今昔比較", "noon/ngayon", "тоді/тепер", "тогда/сейчас"),
  archive: tr("архив", "archive", "Archiv", "archives", "archivio", "arşiv", "archivo", "αρχείο", "アーカイブ", "arkibo", "архів", "архив"),
  events: tr("събития", "events", "Ereignisse", "événements", "eventi", "etkinlik", "eventos", "γεγονότα", "出来事", "pangyayari", "події", "события"),
  transitTitle: tr(
    "Транспорт по маршрута",
    "Transit on this route",
    "Nahverkehr auf der Route",
    "Transports sur le parcours",
    "Mezzi lungo il percorso",
    "Rotada ulaşım",
    "Transporte en la ruta",
    "Συγκοινωνία στη διαδρομή",
    "ルート内の交通",
    "Transportasyon sa ruta",
    "Транспорт на маршруті",
    "Транспорт на маршруте"
  ),
  optionalStop: tr(
    "по избор",
    "optional",
    "optional",
    "optionnel",
    "facoltativa",
    "isteğe bağlı",
    "opcional",
    "προαιρετική",
    "任意",
    "opsyonal",
    "необов'язкова",
    "по желанию"
  ),
  updatedWord: tr("Обновено", "Updated", "Aktualisiert", "Mis à jour", "Aggiornato", "Güncellendi", "Actualizado", "Ενημερώθηκε", "更新日", "Na-update", "Оновлено", "Обновлено")
} satisfies Record<string, Record<Lang, string>>;

export type RouteLabelKey = keyof typeof labelTable;

export function routeLabels(lang: Lang): Record<RouteLabelKey, string> {
  return pick(labelTable, lang) as Record<RouteLabelKey, string>;
}

export function routeCategoryLabels(lang: Lang): Record<RouteCategory, string> {
  return pick(categoryTable, lang) as Record<RouteCategory, string>;
}

export function routeDurationBandLabels(lang: Lang): Record<RouteDurationBand, string> {
  return pick(durationBandTable, lang) as Record<RouteDurationBand, string>;
}

export function routeDifficultyLabels(lang: Lang): Record<RouteDifficulty, string> {
  return pick(difficultyTable, lang) as Record<RouteDifficulty, string>;
}

export function routeWheelchairLabels(lang: Lang): Record<RouteWheelchair, string> {
  return pick(wheelchairTable, lang) as Record<RouteWheelchair, string>;
}

export function routePracticalKindLabels(lang: Lang): Record<RoutePracticalKind, string> {
  return pick(practicalKindTable, lang) as Record<RoutePracticalKind, string>;
}
