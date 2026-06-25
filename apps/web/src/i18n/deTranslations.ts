import translationsJson from "../../../../data/translations/de.json";
import type { Lang } from "./ui";

const translations = translationsJson as Record<string, string>;
const protectedFieldBases = new Set(["actor", "architect", "birthplace", "builder"]);

function isPersonLikeRecord(record: Record<string, unknown>): boolean {
  return (
    record.type === "person" ||
    String(record.id ?? "").startsWith("person-") ||
    String(record.id ?? "").startsWith("notable-person-") ||
    Array.isArray(record.roles) ||
    "birth_year" in record ||
    "death_year" in record
  );
}

function shouldTranslateField(record: Record<string, unknown>, base: string): boolean {
  if (protectedFieldBases.has(base)) return false;
  if (base === "name" && isPersonLikeRecord(record)) return false;
  return true;
}

export function translateEnToDe(value: string | null | undefined): string | null {
  if (!value) return null;
  return translations[value.trim()] ?? null;
}

export function translateText(value: string, lang: Lang): string {
  if (lang !== "de") return value;
  return translateEnToDe(value) ?? value;
}

export function withGermanFields<T>(value: T): T {
  if (Array.isArray(value)) return value.map((item) => withGermanFields(item)) as T;
  if (!value || typeof value !== "object") return value;

  const record = value as Record<string, unknown>;
  const out: Record<string, unknown> = {};

  for (const [key, child] of Object.entries(record)) out[key] = withGermanFields(child);

  for (const [key, child] of Object.entries(record)) {
    if (!key.endsWith("_en") || typeof child !== "string") continue;
    const base = key.slice(0, -3);
    if (!shouldTranslateField(record, base)) continue;
    const deKey = `${base}_de`;
    if (typeof out[deKey] === "string" && String(out[deKey]).trim()) continue;
    const translated = translateEnToDe(child);
    if (translated) out[deKey] = translated;
  }

  for (const key of ["title", "label"]) {
    const child = record[key];
    const deKey = `${key}_de`;
    if (typeof child !== "string") continue;
    if (typeof out[deKey] === "string" && String(out[deKey]).trim()) continue;
    const translated = translateEnToDe(child);
    if (translated) out[deKey] = translated;
  }

  return out as T;
}
