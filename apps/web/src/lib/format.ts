import {
  categoryLabels,
  communityStatusLabels,
  districtLabels,
  fixStatusLabels,
  fundingSourceLabels,
  projectStatusLabels,
  sourceTitleLabels,
  type Lang
} from "../i18n/ui";
import { translateEn } from "../i18n/deTranslations";

const moneyLocale: Record<Lang, string> = { bg: "bg-BG", en: "en-GB", de: "de-DE", fr: "fr-FR", it: "it-IT", tr: "tr-TR", es: "es-ES", el: "el-GR", ja: "ja-JP", tl: "fil-PH", uk: "uk-UA", ru: "ru-RU", pl: "pl-PL" };

const knownHistoryText: Record<Lang, Record<string, string>> = {
  bg: {},
  en: {},
  de: {
    "wikidata_coordinate": "Wikidata-Koordinaten",
    "approximate_site": "ungefährer Standort",
    "district_centroid": "Mittelpunkt des Stadtteils",
    "citywide_reference": "stadtweiter Bezugspunkt",
    "Modern period": "Moderne",
    "Bulgarian Revival": "Bulgarische Wiedergeburtszeit",
    "Thracian era – Antiquity": "Thrakische Zeit - Antike",
    "Roman period": "Römische Zeit",
    "Ottoman period": "Osmanische Zeit",
    "not identified in the current public source": "in der aktuellen öffentlichen Quelle nicht identifiziert",
    "not applicable for a natural hill or terrain feature": "nicht zutreffend für einen natürlichen Hügel oder ein Gelände",
    "Publicly documented historic site; detailed visiting status still needs verification.":
      "Öffentlich dokumentierter historischer Ort; der genaue Besuchsstatus muss noch geprüft werden.",
    "Publicly documented institution, building, or urban site in Plovdiv.":
      "Öffentlich dokumentierte Institution, Gebäude oder städtischer Ort in Plovdiv.",
    "Building or urban site from Plovdiv's Revival and early modern heritage.":
      "Gebäude oder städtischer Ort aus Plovdivs Wiedergeburtszeit und frühem modernem Erbe."
  },
  fr: {
    "wikidata_coordinate": "Coordonnées Wikidata",
    "approximate_site": "emplacement approximatif",
    "district_centroid": "centre de l'arrondissement",
    "citywide_reference": "point de référence à l'échelle de la ville",
    "Modern period": "Époque moderne",
    "Bulgarian Revival": "Renaissance nationale bulgare",
    "Thracian era – Antiquity": "Époque thrace – Antiquité",
    "Roman period": "Époque romaine",
    "Ottoman period": "Époque ottomane",
    "not identified in the current public source": "non identifié dans la source publique actuelle",
    "not applicable for a natural hill or terrain feature": "sans objet pour une colline naturelle ou un relief",
    "Publicly documented historic site; detailed visiting status still needs verification.":
      "Site historique documenté publiquement ; le statut de visite détaillé reste à vérifier.",
    "Publicly documented institution, building, or urban site in Plovdiv.":
      "Institution, bâtiment ou site urbain de Plovdiv documenté publiquement.",
    "Building or urban site from Plovdiv's Revival and early modern heritage.":
      "Bâtiment ou site urbain issu du patrimoine de la Renaissance et du début de l'époque moderne de Plovdiv."
  },
  it: {
    "wikidata_coordinate": "Coordinate Wikidata",
    "approximate_site": "posizione approssimativa",
    "district_centroid": "centro del distretto",
    "citywide_reference": "punto di riferimento a livello cittadino",
    "Modern period": "Epoca moderna",
    "Bulgarian Revival": "Rinascita nazionale bulgara",
    "Thracian era – Antiquity": "Epoca tracia – Antichità",
    "Roman period": "Epoca romana",
    "Ottoman period": "Epoca ottomana",
    "not identified in the current public source": "non identificato nella fonte pubblica attuale",
    "not applicable for a natural hill or terrain feature": "non applicabile a un colle naturale o a una formazione del terreno",
    "Publicly documented historic site; detailed visiting status still needs verification.":
      "Sito storico documentato pubblicamente; lo stato di visita dettagliato resta da verificare.",
    "Publicly documented institution, building, or urban site in Plovdiv.":
      "Istituzione, edificio o sito urbano di Plovdiv documentato pubblicamente.",
    "Building or urban site from Plovdiv's Revival and early modern heritage.":
      "Edificio o sito urbano del patrimonio della Rinascita e della prima epoca moderna di Plovdiv."
  },
  tr: {
    "wikidata_coordinate": "Wikidata koordinatları",
    "approximate_site": "yaklaşık konum",
    "district_centroid": "ilçe merkezi",
    "citywide_reference": "şehir genelinde referans noktası",
    "Modern period": "Modern dönem",
    "Bulgarian Revival": "Bulgar Ulusal Uyanışı",
    "Thracian era – Antiquity": "Trak dönemi – Antik Çağ",
    "Roman period": "Roma dönemi",
    "Ottoman period": "Osmanlı dönemi",
    "not identified in the current public source": "mevcut kamuya açık kaynakta belirlenmedi",
    "not applicable for a natural hill or terrain feature": "doğal bir tepe veya arazi öğesi için geçerli değil",
    "Publicly documented historic site; detailed visiting status still needs verification.":
      "Kamuya açık biçimde belgelenmiş tarihî alan; ayrıntılı ziyaret durumu hâlâ doğrulanmalı.",
    "Publicly documented institution, building, or urban site in Plovdiv.":
      "Plovdiv'de kamuya açık biçimde belgelenmiş kurum, bina veya kentsel alan.",
    "Building or urban site from Plovdiv's Revival and early modern heritage.":
      "Plovdiv'in Uyanış ve erken modern mirasından bir bina veya kentsel alan."
  },
  es: {
    "wikidata_coordinate": "Coordenadas de Wikidata",
    "approximate_site": "ubicación aproximada",
    "district_centroid": "centro del distrito",
    "citywide_reference": "punto de referencia a escala de ciudad",
    "Modern period": "Época moderna",
    "Bulgarian Revival": "Renacimiento Nacional búlgaro",
    "Thracian era – Antiquity": "Época tracia – Antigüedad",
    "Roman period": "Época romana",
    "Ottoman period": "Época otomana",
    "not identified in the current public source": "no identificado en la fuente pública actual",
    "not applicable for a natural hill or terrain feature": "no aplicable a una colina natural o un accidente del terreno",
    "Publicly documented historic site; detailed visiting status still needs verification.":
      "Sitio histórico documentado públicamente; el estado de visita detallado aún debe verificarse.",
    "Publicly documented institution, building, or urban site in Plovdiv.":
      "Institución, edificio o sitio urbano de Plovdiv documentado públicamente.",
    "Building or urban site from Plovdiv's Revival and early modern heritage.":
      "Edificio o sitio urbano del patrimonio del Renacimiento y la primera época moderna de Plovdiv."
  },
  el: {
    "wikidata_coordinate": "Συντεταγμένες Wikidata",
    "approximate_site": "κατά προσέγγιση τοποθεσία",
    "district_centroid": "κέντρο του διαμερίσματος",
    "citywide_reference": "σημείο αναφοράς σε επίπεδο πόλης",
    "Modern period": "Σύγχρονη περίοδος",
    "Bulgarian Revival": "Βουλγαρική Εθνική Αναγέννηση",
    "Thracian era – Antiquity": "Θρακική εποχή – Αρχαιότητα",
    "Roman period": "Ρωμαϊκή περίοδος",
    "Ottoman period": "Οθωμανική περίοδος",
    "not identified in the current public source": "δεν προσδιορίστηκε στην τρέχουσα δημόσια πηγή",
    "not applicable for a natural hill or terrain feature": "δεν ισχύει για φυσικό λόφο ή γεωμορφή",
    "Publicly documented historic site; detailed visiting status still needs verification.":
      "Δημόσια τεκμηριωμένος ιστορικός χώρος· η λεπτομερής κατάσταση επίσκεψης χρειάζεται ακόμη επαλήθευση.",
    "Publicly documented institution, building, or urban site in Plovdiv.":
      "Δημόσια τεκμηριωμένο ίδρυμα, κτίριο ή αστικός χώρος στο Plovdiv.",
    "Building or urban site from Plovdiv's Revival and early modern heritage.":
      "Κτίριο ή αστικός χώρος από την κληρονομιά της Αναγέννησης και της πρώιμης νεότερης εποχής του Plovdiv."
  },
  ja: {
    "wikidata_coordinate": "Wikidata座標",
    "approximate_site": "おおよその場所",
    "district_centroid": "地区の中心点",
    "citywide_reference": "市全体の参照点",
    "Modern period": "近現代",
    "Bulgarian Revival": "ブルガリア民族復興期",
    "Thracian era – Antiquity": "トラキア時代 - 古代",
    "Roman period": "ローマ時代",
    "Ottoman period": "オスマン時代",
    "not identified in the current public source": "現在の公開情報源では特定されていません",
    "not applicable for a natural hill or terrain feature": "自然の丘または地形には該当しません",
    "Publicly documented historic site; detailed visiting status still needs verification.":
      "公開情報で確認できる史跡です。見学状況の詳細はまだ確認が必要です。",
    "Publicly documented institution, building, or urban site in Plovdiv.":
      "Plovdivにある、公開情報で確認できる機関、建物、または都市空間です。",
    "Building or urban site from Plovdiv's Revival and early modern heritage.":
      "Plovdivの民族復興期および近代初期の遺産に属する建物または都市空間です。"
  },
  tl: {
    "wikidata_coordinate": "Koordinada ng Wikidata",
    "approximate_site": "tinatayang lokasyon",
    "district_centroid": "gitna ng distrito",
    "citywide_reference": "sanggunian sa buong lungsod",
    "Modern period": "Makabagong panahon",
    "Bulgarian Revival": "Pambansang Muling Pagsilang ng Bulgaria",
    "Thracian era – Antiquity": "Yugtong Trakiano – Sinaunang Panahon",
    "Roman period": "Panahong Romano",
    "Ottoman period": "Panahong Ottoman",
    "not identified in the current public source": "hindi natukoy sa kasalukuyang pampublikong pinagmulan",
    "not applicable for a natural hill or terrain feature": "hindi angkop para sa likas na burol o tampok ng lupain",
    "Publicly documented historic site; detailed visiting status still needs verification.":
      "Makasaysayang lugar na nakadokumento nang pampubliko; kailangan pang tiyakin ang detalyadong katayuan ng pagbisita.",
    "Publicly documented institution, building, or urban site in Plovdiv.":
      "Institusyon, gusali, o lugar sa lungsod ng Plovdiv na nakadokumento nang pampubliko.",
    "Building or urban site from Plovdiv's Revival and early modern heritage.":
      "Gusali o lugar sa lungsod mula sa pamana ng Pambansang Muling Pagsilang at maagang makabagong panahon ng Plovdiv."
  },
  uk: {
    "wikidata_coordinate": "Координати Wikidata",
    "approximate_site": "приблизне місце",
    "district_centroid": "центр району",
    "citywide_reference": "загальноміський орієнтир",
    "Modern period": "Новітній період",
    "Bulgarian Revival": "Болгарське національне відродження",
    "Thracian era – Antiquity": "Фракійська епоха – античність",
    "Roman period": "Римський період",
    "Ottoman period": "Османський період",
    "not identified in the current public source": "не визначено в наявному публічному джерелі",
    "not applicable for a natural hill or terrain feature": "не застосовується для природного пагорба чи форми рельєфу",
    "Publicly documented historic site; detailed visiting status still needs verification.":
      "Публічно задокументована історична пам'ятка; детальний статус відвідування ще потребує перевірки.",
    "Publicly documented institution, building, or urban site in Plovdiv.":
      "Публічно задокументована установа, будівля або міський об'єкт у Пловдиві.",
    "Building or urban site from Plovdiv's Revival and early modern heritage.":
      "Будівля або міський об'єкт зі спадщини доби Відродження та раннього нового часу Пловдива."
  },
  ru: {
    "wikidata_coordinate": "Координаты Wikidata",
    "approximate_site": "приблизительное место",
    "district_centroid": "центр района",
    "citywide_reference": "общегородской ориентир",
    "Modern period": "Новейший период",
    "Bulgarian Revival": "Болгарское национальное возрождение",
    "Thracian era – Antiquity": "Фракийская эпоха – античность",
    "Roman period": "Римский период",
    "Ottoman period": "Османский период",
    "not identified in the current public source": "не определено в имеющемся публичном источнике",
    "not applicable for a natural hill or terrain feature": "неприменимо для природного холма или элемента рельефа",
    "Publicly documented historic site; detailed visiting status still needs verification.":
      "Публично задокументированный исторический объект; подробный статус посещения ещё требует проверки.",
    "Publicly documented institution, building, or urban site in Plovdiv.":
      "Публично задокументированное учреждение, здание или городской объект в Пловдиве.",
    "Building or urban site from Plovdiv's Revival and early modern heritage.":
      "Здание или городской объект из наследия эпохи Возрождения и раннего нового времени Пловдива."
  },
  pl: {
    "wikidata_coordinate": "Współrzędne Wikidata",
    "approximate_site": "przybliżone miejsce",
    "district_centroid": "środek rejonu",
    "citywide_reference": "punkt odniesienia w skali miasta",
    "Modern period": "Epoka nowoczesna",
    "Bulgarian Revival": "Bułgarskie odrodzenie narodowe",
    "Thracian era – Antiquity": "Epoka tracka – starożytność",
    "Roman period": "Okres rzymski",
    "Ottoman period": "Okres osmański",
    "not identified in the current public source": "nieokreślone w dostępnym źródle publicznym",
    "not applicable for a natural hill or terrain feature": "nie dotyczy naturalnego wzgórza ani formy terenu",
    "Publicly documented historic site; detailed visiting status still needs verification.":
      "Publicznie udokumentowany obiekt historyczny; szczegółowy status zwiedzania wymaga jeszcze weryfikacji.",
    "Publicly documented institution, building, or urban site in Plovdiv.":
      "Publicznie udokumentowana instytucja, budynek lub obiekt miejski w Plovdivie.",
    "Building or urban site from Plovdiv's Revival and early modern heritage.":
      "Budynek lub obiekt miejski z dziedzictwa odrodzenia i wczesnej nowoczesności Plovdivu."
  }
};

export function formatMoney(
  amount: number,
  lang: Lang = "bg",
  currency: "BGN" | "EUR" = "BGN"
): string {
  return new Intl.NumberFormat(moneyLocale[lang], {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(amount);
}

/** Backwards-compatible Bulgarian money formatter. */
export function formatMoneyBGN(amount: number): string {
  return formatMoney(amount, "bg");
}

export function formatPlainNumber(value: number, lang: Lang = "bg"): string {
  return new Intl.NumberFormat(moneyLocale[lang], {
    maximumFractionDigits: 0
  }).format(value);
}

export function formatDate(iso: string, lang: Lang = "bg"): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(moneyLocale[lang], {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date);
}

export function categoryLabel(category: string, lang: Lang = "bg"): string {
  return categoryLabels[lang][category] ?? category;
}

export function projectStatusLabel(status: string, lang: Lang = "bg"): string {
  return projectStatusLabels[lang][status] ?? status;
}

export function communityStatusLabel(status: string, lang: Lang = "bg"): string {
  return communityStatusLabels[lang][status] ?? status;
}

export function fixStatusLabel(status: string, lang: Lang = "bg"): string {
  return fixStatusLabels[lang][status] ?? status;
}

export function fundingSourceLabel(value: string, lang: Lang = "bg"): string {
  return fundingSourceLabels[lang][value] ?? value;
}

export function districtLabel(value: string | null, lang: Lang = "bg"): string {
  if (!value) return "";
  // Non-Bulgarian locales show the romanised district name when one exists.
  return lang === "bg" ? value : districtLabels[value] ?? value;
}

export function sourceTitle(title: string, lang: Lang = "bg"): string {
  // Imported coordinate records are useful evidence, but their machine-like
  // source titles made otherwise editorial pages read like an export. Keep
  // the source and place name visible while presenting the record naturally.
  const coordinateRecord = title.match(/^Wikidata\s+[—-]\s+(.+?)\s+coordinates$/i);
  if (coordinateRecord) {
    const coordinateLabels: Record<Lang, string> = {
      bg: "Координати (Wikidata)",
      en: "Coordinates (Wikidata)",
      de: "Koordinaten (Wikidata)",
      fr: "Coordonnées (Wikidata)",
      it: "Coordinate (Wikidata)",
      tr: "Koordinatlar (Wikidata)",
      es: "Coordenadas (Wikidata)",
      el: "Συντεταγμένες (Wikidata)",
      ja: "座標（Wikidata）",
      tl: "Mga coordinate (Wikidata)",
      uk: "Координати (Wikidata)",
      ru: "Координаты (Wikidata)",
      pl: "Współrzędne (Wikidata)"
    };
    return `${coordinateLabels[lang]} · ${coordinateRecord[1]}`;
  }
  return sourceTitleLabels[lang]?.[title] ?? translateEn(title, lang) ?? title;
}

export function knownHistoryLabel(value: string | null | undefined, lang: Lang = "bg"): string {
  if (!value) return "";
  const direct = knownHistoryText[lang]?.[value];
  if (direct) return direct;
  const translated = translateEn(value, lang);
  if (translated) return translated;

  if (lang !== "de") return value;

  return value
    .replace(/^Modern period(,|$)/, "Moderne$1")
    .replace(/^Bulgarian Revival(,|$)/, "Bulgarische Wiedergeburtszeit$1")
    .replace(/^Roman period(,|$)/, "Römische Zeit$1")
    .replace(/^Ottoman period(,|$)/, "Osmanische Zeit$1")
    .replace(/^Thracian era(,|$)/, "Thrakische Zeit$1");
}

export function distanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const radiusKm = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  return 2 * radiusKm * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}
