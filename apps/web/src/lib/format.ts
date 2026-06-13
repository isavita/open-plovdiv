import {
  categoryLabels,
  districtLabels,
  fixStatusLabels,
  fundingSourceLabels,
  projectStatusLabels,
  sourceTitleLabels,
  type Lang
} from "../i18n/ui";

const moneyLocale: Record<Lang, string> = { bg: "bg-BG", en: "en-GB" };

export function formatMoney(amount: number, lang: Lang = "bg"): string {
  return new Intl.NumberFormat(moneyLocale[lang], {
    style: "currency",
    currency: "BGN",
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

export function fixStatusLabel(status: string, lang: Lang = "bg"): string {
  return fixStatusLabels[lang][status] ?? status;
}

export function fundingSourceLabel(value: string, lang: Lang = "bg"): string {
  return fundingSourceLabels[lang][value] ?? value;
}

export function districtLabel(value: string | null, lang: Lang = "bg"): string {
  if (!value) return "";
  return lang === "en" ? districtLabels[value] ?? value : value;
}

export function sourceTitle(title: string, lang: Lang = "bg"): string {
  return sourceTitleLabels[lang]?.[title] ?? title;
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
