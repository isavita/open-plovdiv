import { categoryLabels, fixStatusLabels, projectStatusLabels } from "./constants";

export function formatMoneyBGN(amount: number): string {
  return new Intl.NumberFormat("bg-BG", {
    style: "currency",
    currency: "BGN",
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatPlainNumber(value: number): string {
  return new Intl.NumberFormat("bg-BG", {
    maximumFractionDigits: 0
  }).format(value);
}

export function categoryLabel(category: string): string {
  return categoryLabels[category] ?? category;
}

export function projectStatusLabel(status: string): string {
  return projectStatusLabels[status] ?? status;
}

export function fixStatusLabel(status: string): string {
  return fixStatusLabels[status] ?? status;
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
