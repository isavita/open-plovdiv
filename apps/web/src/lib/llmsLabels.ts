import type { Lang } from "@i18n/utils";

// Labels for the human-facing links to the site's machine-readable content.
export const llmsLabels = {
  bg: { page: "Страницата във формат Markdown", guide: "Ръководство за AI (llms.txt)" },
  en: { page: "This page in Markdown", guide: "AI guide (llms.txt)" },
  de: { page: "Diese Seite als Markdown", guide: "KI-Leitfaden (llms.txt)" },
  fr: { page: "Cette page en Markdown", guide: "Guide pour l’IA (llms.txt)" },
  it: { page: "Questa pagina in Markdown", guide: "Guida per l’IA (llms.txt)" },
  tr: { page: "Bu sayfanın Markdown sürümü", guide: "Yapay zekâ rehberi (llms.txt)" },
  es: { page: "Esta página en Markdown", guide: "Guía para IA (llms.txt)" },
  el: { page: "Αυτή η σελίδα σε Markdown", guide: "Οδηγός για AI (llms.txt)" },
  ja: { page: "このページのMarkdown版", guide: "AI向けガイド (llms.txt)" },
  zh: { page: "此页面的 Markdown 版本", guide: "AI 指南 (llms.txt)" },
  tl: { page: "Ang pahinang ito sa Markdown", guide: "Gabay para sa AI (llms.txt)" },
  uk: { page: "Ця сторінка у форматі Markdown", guide: "Посібник для ШІ (llms.txt)" },
  ru: { page: "Эта страница в формате Markdown", guide: "Руководство для ИИ (llms.txt)" },
  pl: { page: "Ta strona w formacie Markdown", guide: "Przewodnik dla AI (llms.txt)" },
  pt: { page: "Esta página em Markdown", guide: "Guia para IA (llms.txt)" }
} satisfies Record<Lang, { page: string; guide: string }>;
