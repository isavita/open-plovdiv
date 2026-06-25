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

const moneyLocale: Record<Lang, string> = { bg: "bg-BG", en: "en-GB", de: "de-DE", fr: "fr-FR" };

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
