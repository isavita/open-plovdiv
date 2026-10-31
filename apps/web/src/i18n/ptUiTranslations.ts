import translations from "../../../../data/translations/pt-ui.json";

const portuguese: Record<string, string> = translations;

export function ptText(value: string): string {
  return portuguese[value] ?? value;
}

/** Translate interface copy while leaving behaviour and structural values intact. */
export function translatePtUi<T>(value: T): T {
  if (typeof value === "string") return ptText(value) as T;
  if (Array.isArray(value)) return value.map((item) => translatePtUi(item)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, translatePtUi(child)])) as T;
  }
  return value;
}
