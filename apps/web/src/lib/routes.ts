import type { Lang } from "../i18n/ui";

/**
 * The walking-route specifications shared across the site: the routes page
 * builds its full evidence view from them, while the places catalogue and
 * place detail pages use them to cross-link places to the routes that pass
 * through them. Stops reference existing `historyKnowledgePlaces` ids —
 * routes never introduce places or claims of their own.
 */
export type WalkingRouteSpec = {
  id: string;
  title: Record<Lang, string>;
  shortTitle: Record<Lang, string>;
  pace: Record<Lang, string>;
  durationMinutes: number;
  accent: string;
  storyId: string;
  educationId?: string;
  stopIds: string[];
};

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

export const walkingRoutes: WalkingRouteSpec[] = [
  {
    id: "roman-plovdiv-90",
    title: tr(
      "Римски Пловдив за 90 минути",
      "Roman Plovdiv in 90 minutes",
      "Römisches Plovdiv in 90 Minuten",
      "Plovdiv romain en 90 minutes",
      "Plovdiv romana in 90 minuti",
      "90 dakikada Roma Plovdiv'i",
      "Plovdiv romano en 90 minutos",
      "Ρωμαϊκό Plovdiv σε 90 λεπτά",
      "90分で巡るローマ時代のPlovdiv",
      "Romanong Plovdiv sa loob ng 90 minuto",
      "Римський Пловдив за 90 хвилин",
      "Римский Пловдив за 90 минут"
    ),
    shortTitle: tr("Римски Пловдив", "Roman Plovdiv", "Römisches Plovdiv", "Plovdiv romain", "Plovdiv romana", "Roma Plovdiv'i", "Plovdiv romano", "Ρωμαϊκό Plovdiv", "ローマ時代のPlovdiv", "Romanong Plovdiv", "Римський Пловдив", "Римский Пловдив"),
    pace: tr("антични сцени, стадион и форум", "ancient stages, stadium and forum", "antike Bühnen, Stadion und Forum", "théâtre antique, stade et forum", "scene antiche, stadio e foro", "antik sahneler, stadyum ve forum", "escenarios antiguos, estadio y foro", "αρχαίες σκηνές, στάδιο και αγορά", "古代劇場、競技場、フォルム", "sinaunang entablado, istadyum, at foro", "античні сцени, стадіон і форум", "античные сцены, стадион и форум"),
    durationMinutes: 90,
    accent: "#a23b2d",
    storyId: "story-roman-philippopolis",
    educationId: "education-roman-philippopolis",
    stopIds: [
      "place-nebet-tepe",
      "place-ancient-theatre",
      "place-forum-philippopolis",
      "place-odeon-of-philippopolis-q26046109",
      "place-ancient-stadium",
      "place-bishop-s-basilica-of-philippopolis-q20500169"
    ]
  },
  {
    id: "old-town-revival-houses",
    title: tr(
      "Старият град и възрожденските къщи",
      "Old Town and Revival houses",
      "Altstadt und Wiedergeburtshäuser",
      "Vieille ville et maisons de la Renaissance",
      "Città vecchia e case della Rinascita",
      "Eski Şehir ve Uyanış dönemi evleri",
      "Casco antiguo y casas del Renacimiento",
      "Παλιά Πόλη και αναγεννησιακά σπίτια",
      "旧市街と民族復興期の邸宅",
      "Lumang Bayan at mga bahay ng Pambansang Muling Pagsilang",
      "Старе місто і будинки Відродження",
      "Старый город и дома эпохи Возрождения"
    ),
    shortTitle: tr("Стар град", "Old Town", "Altstadt", "Vieille ville", "Città vecchia", "Eski Şehir", "Casco antiguo", "Παλιά Πόλη", "旧市街", "Lumang Bayan", "Старе місто", "Старый город"),
    pace: tr("къщи, училища и общности", "houses, schools and communities", "Häuser, Schulen und Gemeinschaften", "maisons, écoles et communautés", "case, scuole e comunità", "evler, okullar ve topluluklar", "casas, escuelas y comunidades", "σπίτια, σχολεία και κοινότητες", "邸宅、学校、共同体", "bahay, paaralan, at komunidad", "будинки, школи та громади", "дома, школы и общины"),
    durationMinutes: 75,
    accent: "#b4632a",
    storyId: "story-revival-houses-schools",
    educationId: "education-revival-houses-schools",
    stopIds: [
      "place-old-town",
      "place-humanitarian-high-school-saints-cyril-and-methodius-plovdiv-q12290859",
      "place-holy-mother-of-god",
      "place-lamartine-house",
      "place-house-of-hristo-g-danov-q29961385",
      "place-hindliyan-house-q19810343"
    ]
  },
  {
    id: "filibe-ottoman-layer",
    title: tr(
      "Филибе / османският пласт",
      "Filibe / Ottoman layer",
      "Filibe / osmanische Schicht",
      "Filibe / couche ottomane",
      "Filibe / strato ottomano",
      "Filibe / Osmanlı katmanı",
      "Filibe / capa otomana",
      "Filibe / οθωμανικό στρώμα",
      "Filibe / オスマン層",
      "Filibe / Yugtong Ottoman",
      "Філібе / османський шар",
      "Филибе / османский слой"
    ),
    shortTitle: tr("Филибе", "Filibe", "Filibe", "Filibe", "Filibe", "Filibe", "Filibe", "Filibe", "Filibe", "Filibe", "Філібе", "Филибе"),
    pace: tr("джамия, хамам, теке и часовников хълм", "mosque, bath, dervish space and clock hill", "Moschee, Bad, Derwischort und Uhrhügel", "mosquée, bain, espace derviche et colline de l'horloge", "moschea, bagno, loggia dervisca e colle dell'orologio", "cami, hamam, tekke ve saat tepesi", "mezquita, baño, espacio derviche y colina del reloj", "τζαμί, λουτρό, τεκές και λόφος ρολογιού", "モスク、浴場、デルヴィーシュ空間、時計塔の丘", "moske, paliguan, espasyo ng mga dervish, at burol ng orasan", "мечеть, лазня, текке та Годинникова гора", "мечеть, хамам, текке и Часовой холм"),
    durationMinutes: 60,
    accent: "#5f6f52",
    storyId: "story-ottoman-filibe-city",
    stopIds: [
      "place-dzhumaya-mosque",
      "place-dzhumaya-square-q59368698",
      "place-chifte-hamam",
      "place-mevlevi-hane",
      "place-sahat-hill-in-plovdiv-q12293012"
    ]
  },
  {
    id: "unification-civic-memory",
    title: tr(
      "Съединение и гражданска памет",
      "Unification and civic memory",
      "Vereinigung und Bürgergedächtnis",
      "Unification et mémoire civique",
      "Unificazione e memoria civica",
      "Birleşme ve kent hafızası",
      "Unificación y memoria cívica",
      "Ένωση και αστική μνήμη",
      "統一と市民の記憶",
      "Pagkakaisa at sibikong alaala",
      "Об'єднання і громадянська пам'ять",
      "Объединение и гражданская память"
    ),
    shortTitle: tr("Съединение", "Unification", "Vereinigung", "Unification", "Unificazione", "Birleşme", "Unificación", "Ένωση", "統一", "Pagkakaisa", "Об'єднання", "Объединение"),
    pace: tr("площад, институции и градска памет", "square, institutions and urban memory", "Platz, Institutionen und Stadtgedächtnis", "place, institutions et mémoire urbaine", "piazza, istituzioni e memoria urbana", "meydan, kurumlar ve kentsel hafıza", "plaza, instituciones y memoria urbana", "πλατεία, θεσμοί και αστική μνήμη", "広場、制度、都市の記憶", "plaza, institusyon, at alaalang urban", "площа, установи та міська пам'ять", "площадь, учреждения и городская память"),
    durationMinutes: 45,
    accent: "#315f7d",
    storyId: "story-unification-civic-memory",
    educationId: "education-unification-civic-city",
    stopIds: ["place-unification-square-plovdiv-q58885892", "place-plovdiv-city", "place-old-town"]
  },
  {
    id: "kapana-parks-rowing-canal",
    title: tr(
      "Капана, парковете и Гребната база",
      "Kapana, parks and the Rowing Canal",
      "Kapana, Parks und der Ruderkanal",
      "Kapana, parcs et canal d'aviron",
      "Kapana, parchi e canale di canottaggio",
      "Kapana, parklar ve Kürek Kanalı",
      "Kapana, parques y canal de remo",
      "Kapana, πάρκα και κανάλι κωπηλασίας",
      "Kapana、公園、ボート競技場",
      "Kapana, mga parke, at ang Rowing Canal",
      "Капана, парки та Гребний канал",
      "Капана, парки и Гребной канал"
    ),
    shortTitle: tr(
      "Капана → Гребната",
      "Kapana → Rowing Canal",
      "Kapana → Ruderkanal",
      "Kapana → canal d'aviron",
      "Kapana → canale",
      "Kapana → Kürek Kanalı",
      "Kapana → canal de remo",
      "Kapana → κανάλι",
      "Kapana → ボート場",
      "Kapana → Rowing Canal",
      "Капана → Гребний канал",
      "Капана → Гребной канал"
    ),
    pace: tr(
      "творчески квартал, зелени хълмове и западен спортен пояс",
      "creative district, green hills and west-side sport belt",
      "Kreativviertel, grüne Hügel und westlicher Sportgürtel",
      "quartier créatif, collines vertes et ceinture sportive ouest",
      "quartiere creativo, colline verdi e fascia sportiva occidentale",
      "yaratıcı bölge, yeşil tepeler ve batı spor kuşağı",
      "distrito creativo, colinas verdes y franja deportiva occidental",
      "δημιουργική συνοικία, πράσινοι λόφοι και δυτική ζώνη αθλητισμού",
      "クリエイティブ地区、緑の丘、西側のスポーツ帯",
      "malikhaing distrito, luntiang burol, at sports belt sa kanluran",
      "творчий квартал, зелені пагорби та західна спортивна смуга",
      "творческий квартал, зелёные холмы и западная спортивная зона"
    ),
    durationMinutes: 120,
    accent: "#2f7d6b",
    storyId: "story-european-capital-culture",
    stopIds: [
      "place-kapana-q12282547",
      "place-tzar-simeon-garden-q12298697",
      "place-bunardzhik-q12274023",
      "place-dzhendem-tepe-q5319673",
      "place-rowing-canal-plovdiv"
    ]
  }
];

/** Routes that include a given place, with the stop position (0-based). */
export function routesThroughPlace(placeId: string): Array<{ route: WalkingRouteSpec; stopIndex: number }> {
  return walkingRoutes
    .map((route) => ({ route, stopIndex: route.stopIds.indexOf(placeId) }))
    .filter((entry) => entry.stopIndex >= 0);
}
