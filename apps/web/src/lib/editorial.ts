import { field, type Lang } from "../i18n/utils";

type EditorialRecord = {
  status?: string | null;
  notes_bg?: string | null;
  notes_en?: string | null;
};

const reviewStatusLabels: Record<Lang, string> = {
  bg: "Редакторска проверка",
  en: "Editorial review",
  de: "Redaktionelle Prüfung",
  fr: "Vérification éditoriale",
  it: "Revisione editoriale",
  tr: "Editoryal inceleme",
  es: "Revisión editorial",
  el: "Συντακτικός έλεγχος",
  ja: "編集レビュー",
  tl: "Pagsusuring editoryal",
  uk: "Редакційна перевірка",
  ru: "Редакционная проверка",
  pl: "Przegląd redakcyjny"
};

const pendingReviewLabels: Record<Lang, string> = {
  bg: "Чака независима редакторска проверка.",
  en: "Awaiting independent editorial review.",
  de: "Wartet auf eine unabhängige redaktionelle Prüfung.",
  fr: "En attente d'une vérification éditoriale indépendante.",
  it: "In attesa di una revisione editoriale indipendente.",
  tr: "Bağımsız editoryal inceleme bekliyor.",
  es: "Pendiente de una revisión editorial independiente.",
  el: "Αναμένει ανεξάρτητο συντακτικό έλεγχο.",
  ja: "独立した編集レビューを待っています。",
  tl: "Naghihintay ng independiyenteng pagsusuring editoryal.",
  uk: "Очікує незалежної редакційної перевірки.",
  ru: "Ожидает независимой редакционной проверки.",
  pl: "Oczekuje na niezależny przegląd redakcyjny."
};

export function editorialReviewStatusLabel(lang: Lang): string {
  return reviewStatusLabels[lang];
}

/**
 * A source/licence record can be public before its contextual or visual match
 * is independently signed off. Keep that boundary visible wherever archival
 * material is rendered instead of treating metadata provenance as approval.
 */
export function pendingEditorialReviewNote(editorial: EditorialRecord | null | undefined, lang: Lang): string {
  if (!editorial || editorial.status === "signed_off") return "";
  return field(editorial as Record<string, unknown>, "notes", lang) || pendingReviewLabels[lang];
}
