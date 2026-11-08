import translations from "../../../../data/translations/zh-ui.json";

const chinese: Record<string, string> = translations;
const structuralKeys = new Set(["id", "key", "value", "href", "url", "src", "srcset", "target", "rel", "method", "role", "type", "slug", "icon", "path", "class", "className", "color"]);

/** Untranslated interface copy falls back to the supplied English text. */
export function zhText(value: string): string {
  return chinese[value] || value;
}

/** Translate nested interface dictionaries without changing functions or data. */
export function withChineseUi<T>(value: T): T {
  if (typeof value === "string") {
    if (/^(?:https?:\/\/|\/|#|mailto:|tel:|data:)/i.test(value)) return value;
    return zhText(value) as T;
  }
  if (Array.isArray(value)) return value.map((item) => withChineseUi(item)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, structuralKeys.has(key) ? child : withChineseUi(child)])) as T;
  }
  return value;
}

/** Extend an existing locale map without changing its non-Chinese values. */
export function withZhLocale<T extends { en: unknown }>(value: T): T & { zh: T["en"] } {
  return { ...value, zh: withChineseUi(value.en) };
}

/** Translate the existing English fallback when a view selects Chinese. */
export function localizeChineseUi<T>(lang: string, value: T): T {
  return lang === "zh" ? withChineseUi(value) : value;
}
