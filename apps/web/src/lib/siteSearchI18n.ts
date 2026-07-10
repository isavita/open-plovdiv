import type { Lang } from "../i18n/ui";
import type { SiteSearchKind } from "./searchCore";

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

const strings = {
  open: tr("Търсене", "Search", "Suche", "Rechercher", "Cerca", "Ara", "Buscar", "Αναζήτηση", "検索", "Maghanap", "Пошук", "Поиск"),
  title: tr("Търсене в целия сайт", "Search the whole site", "Die ganze Website durchsuchen", "Rechercher dans tout le site", "Cerca in tutto il sito", "Tüm sitede ara", "Buscar en todo el sitio", "Αναζήτηση σε όλο τον ιστότοπο", "サイト全体を検索", "Hanapin sa buong site", "Пошук на всьому сайті", "Поиск по всему сайту"),
  lead: tr(
    "Места, маршрути, хора, разкази, проекти и исторически събития — с едно поле.",
    "Places, routes, people, stories, projects and historical events — in one field.",
    "Orte, Routen, Personen, Geschichten, Projekte und historische Ereignisse – in einem Feld.",
    "Lieux, parcours, personnes, récits, projets et événements historiques — dans un seul champ.",
    "Luoghi, percorsi, persone, storie, progetti ed eventi storici — in un unico campo.",
    "Yerler, rotalar, kişiler, hikâyeler, projeler ve tarihî olaylar — tek alanda.",
    "Lugares, rutas, personas, relatos, proyectos y acontecimientos históricos — en un solo campo.",
    "Μέρη, διαδρομές, πρόσωπα, ιστορίες, έργα και ιστορικά γεγονότα — σε ένα πεδίο.",
    "場所、ルート、人物、物語、プロジェクト、歴史上の出来事を一つの欄から探せます。",
    "Mga lugar, ruta, tao, kuwento, proyekto, at pangyayaring pangkasaysayan — sa iisang field.",
    "Місця, маршрути, люди, історії, проєкти та історичні події — в одному полі.",
    "Места, маршруты, люди, истории, проекты и исторические события — в одном поле."
  ),
  placeholder: tr("Напр. Античния театър, Капана, кметове…", "e.g. Ancient Theatre, Kapana, mayors…", "z. B. Antikes Theater, Kapana, Bürgermeister…", "ex. Théâtre antique, Kapana, maires…", "es. Teatro antico, Kapana, sindaci…", "örn. Antik Tiyatro, Kapana, belediye başkanları…", "p. ej. Teatro Antiguo, Kapana, alcaldes…", "π.χ. Αρχαίο Θέατρο, Καπάνα, δήμαρχοι…", "例：古代劇場、カパナ、市長…", "Hal. Ancient Theatre, Kapana, mga alkalde…", "Напр. Античний театр, Капана, мери…", "Напр. Античный театр, Капана, мэры…"),
  suggestions: tr("Опитайте", "Try", "Vorschläge", "Suggestions", "Prova", "Deneyin", "Prueba", "Δοκιμάστε", "候補", "Subukan", "Спробуйте", "Попробуйте"),
  filters: tr("Още филтри", "More filters", "Weitere Filter", "Plus de filtres", "Altri filtri", "Daha fazla filtre", "Más filtros", "Περισσότερα φίλτρα", "その他の絞り込み", "Higit pang filter", "Більше фільтрів", "Другие фильтры"),
  loading: tr("Зареждаме търсенето…", "Loading search…", "Suche wird geladen…", "Chargement de la recherche…", "Caricamento della ricerca…", "Arama yükleniyor…", "Cargando la búsqueda…", "Φόρτωση αναζήτησης…", "検索を読み込み中…", "Naglo-load ang paghahanap…", "Завантаження пошуку…", "Загрузка поиска…"),
  results: tr("Резултати", "Results", "Ergebnisse", "Résultats", "Risultati", "Sonuçlar", "Resultados", "Αποτελέσματα", "検索結果", "Mga resulta", "Результати", "Результаты"),
  noResults: tr("Не открихме съвпадение.", "No matching result found.", "Kein passendes Ergebnis gefunden.", "Aucun résultat correspondant.", "Nessun risultato corrispondente.", "Eşleşen sonuç bulunamadı.", "No se encontró ningún resultado.", "Δεν βρέθηκε αποτέλεσμα.", "一致する結果がありません。", "Walang nakitang tugmang resulta.", "Збігів не знайдено.", "Совпадений не найдено."),
  noResultsHint: tr("Проверете изписването или опитайте по-кратко име.", "Check the spelling or try a shorter name.", "Prüfen Sie die Schreibweise oder versuchen Sie einen kürzeren Namen.", "Vérifiez l’orthographe ou essayez un nom plus court.", "Controlla l’ortografia o prova un nome più breve.", "Yazımı kontrol edin veya daha kısa bir ad deneyin.", "Comprueba la ortografía o prueba con un nombre más corto.", "Ελέγξτε την ορθογραφία ή δοκιμάστε ένα μικρότερο όνομα.", "綴りを確認するか、短い名前をお試しください。", "Suriin ang baybay o subukan ang mas maikling pangalan.", "Перевірте написання або спробуйте коротшу назву.", "Проверьте написание или попробуйте более короткое название."),
  close: tr("Затвори търсенето", "Close search", "Suche schließen", "Fermer la recherche", "Chiudi la ricerca", "Aramayı kapat", "Cerrar búsqueda", "Κλείσιμο αναζήτησης", "検索を閉じる", "Isara ang paghahanap", "Закрити пошук", "Закрыть поиск"),
  shortcut: tr("Натиснете / за търсене", "Press / to search", "/ drücken zum Suchen", "Appuyez sur / pour rechercher", "Premi / per cercare", "Aramak için / tuşuna basın", "Pulsa / para buscar", "Πατήστε / για αναζήτηση", "/ キーで検索", "Pindutin ang / para maghanap", "Натисніть / для пошуку", "Нажмите / для поиска"),
};

/**
 * Result-count templates per Intl.PluralRules category. Languages without
 * grammatical number distinctions only carry `other`; Slavic locales need
 * one/few/many for correct agreement (напр. 1 резултат / 7 резултата).
 */
export type PluralForms = Partial<Record<Intl.LDMLPluralRule, string>> & { other: string };

const resultCountForms: Record<Lang, PluralForms> = {
  bg: { one: "{count} резултат", other: "{count} резултата" },
  en: { one: "{count} result", other: "{count} results" },
  de: { one: "{count} Ergebnis", other: "{count} Ergebnisse" },
  fr: { one: "{count} résultat", other: "{count} résultats" },
  it: { one: "{count} risultato", other: "{count} risultati" },
  tr: { other: "{count} sonuç" },
  es: { one: "{count} resultado", other: "{count} resultados" },
  el: { one: "{count} αποτέλεσμα", other: "{count} αποτελέσματα" },
  ja: { other: "{count}件" },
  tl: { other: "{count} resulta" },
  uk: { one: "{count} результат", few: "{count} результати", many: "{count} результатів", other: "{count} результату" },
  ru: { one: "{count} результат", few: "{count} результата", many: "{count} результатов", other: "{count} результата" }
};

const kindLabels: Record<SiteSearchKind, Record<Lang, string>> = {
  page: tr("Раздел", "Section", "Bereich", "Rubrique", "Sezione", "Bölüm", "Sección", "Ενότητα", "セクション", "Seksyon", "Розділ", "Раздел"),
  route: tr("Маршрут", "Route", "Route", "Parcours", "Percorso", "Rota", "Ruta", "Διαδρομή", "ルート", "Ruta", "Маршрут", "Маршрут"),
  place: tr("Място", "Place", "Ort", "Lieu", "Luogo", "Yer", "Lugar", "Μέρος", "場所", "Lugar", "Місце", "Место"),
  person: tr("Личност", "Person", "Person", "Personne", "Persona", "Kişi", "Persona", "Πρόσωπο", "人物", "Tao", "Особа", "Персона"),
  story: tr("Разказ", "Story", "Geschichte", "Récit", "Racconto", "Hikâye", "Relato", "Ιστορία", "物語", "Kuwento", "Історія", "История"),
  neighbourhood: tr("Квартал", "Neighbourhood", "Viertel", "Quartier", "Quartiere", "Mahalle", "Barrio", "Συνοικία", "地区", "Purok", "Квартал", "Район"),
  project: tr("Проект", "Project", "Projekt", "Projet", "Progetto", "Proje", "Proyecto", "Έργο", "プロジェクト", "Proyekto", "Проєкт", "Проект"),
  initiative: tr("Инициатива", "Initiative", "Initiative", "Initiative", "Iniziativa", "Girişim", "Iniciativa", "Πρωτοβουλία", "取り組み", "Inisyatiba", "Ініціатива", "Инициатива"),
  event: tr("История", "History", "Geschichte", "Histoire", "Storia", "Tarih", "Historia", "Ιστορία", "歴史", "Kasaysayan", "Історія", "История")
};

export type SiteSearchUi = {
  open: string;
  title: string;
  lead: string;
  placeholder: string;
  suggestions: string;
  filters: string;
  loading: string;
  results: string;
  noResults: string;
  noResultsHint: string;
  close: string;
  shortcut: string;
  resultCount: PluralForms;
};

export const siteSearchUi = Object.fromEntries(
  (Object.keys(strings.open) as Lang[]).map((lang) => [
    lang,
    {
      ...Object.fromEntries(Object.entries(strings).map(([key, values]) => [key, values[lang]])),
      resultCount: resultCountForms[lang]
    } as unknown as SiteSearchUi
  ])
) as Record<Lang, SiteSearchUi>;

export function siteSearchKindLabel(kind: SiteSearchKind, lang: Lang): string {
  return kindLabels[kind][lang];
}
