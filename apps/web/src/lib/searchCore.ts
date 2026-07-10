export type SiteSearchKind =
  | "page"
  | "route"
  | "place"
  | "person"
  | "story"
  | "neighbourhood"
  | "project"
  | "initiative"
  | "event";

export type SiteSearchItem = {
  id: string;
  kind: SiteSearchKind;
  typeLabel: string;
  title: string;
  description: string;
  href: string;
  meta?: string;
  /** Pre-normalized title used by the small, dependency-free browser ranker. */
  titleSearch: string;
  /** Alternate-language or established alternate titles, normalized. */
  titleAliases: string[];
  /** Pre-normalized aliases, summaries and metadata for this record. */
  searchText: string;
  /** Editorial tie-breaker: broad navigation and visitor content rank first. */
  weight: number;
};

export type RankedSiteSearchItem = SiteSearchItem & { score: number };

/**
 * Normalize text without assuming a particular script. NFKD makes accented
 * Latin queries forgiving, while the punctuation pass makes word order and
 * separators irrelevant. Bulgarian, Greek, Japanese and Cyrillic remain
 * searchable as authored.
 */
export function normalizeSearchText(value: unknown): string {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ");
}

/** Match every query word in any order; useful for the smaller page catalogues. */
export function matchesSearchText(searchable: unknown, query: unknown): boolean {
  const words = normalizeSearchText(query).split(" ").filter(Boolean);
  if (words.length === 0) return true;
  const haystack = normalizeSearchText(searchable);
  return words.every((word) => haystack.includes(word));
}

function editDistanceAtMost(left: string, right: string, maximum: number): boolean {
  if (Math.abs(left.length - right.length) > maximum) return false;
  if (left === right) return true;

  let previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let i = 1; i <= left.length; i += 1) {
    const current = [i];
    let rowMinimum = current[0];
    for (let j = 1; j <= right.length; j += 1) {
      const substitution = left[i - 1] === right[j - 1] ? 0 : 1;
      const value = Math.min(
        previous[j] + 1,
        current[j - 1] + 1,
        previous[j - 1] + substitution
      );
      current.push(value);
      rowMinimum = Math.min(rowMinimum, value);
    }
    if (rowMinimum > maximum) return false;
    previous = current;
  }
  return previous[right.length] <= maximum;
}

function fuzzyWordMatch(queryWord: string, candidateWords: string[]): boolean {
  if (queryWord.length < 4) return false;
  const maximum = queryWord.length >= 8 ? 2 : 1;
  return candidateWords.some(
    (candidate) =>
      candidate.length >= 4 &&
      Math.abs(candidate.length - queryWord.length) <= maximum &&
      editDistanceAtMost(queryWord, candidate, maximum)
  );
}

/**
 * Rank a compact static index. Every query word must match somewhere, but the
 * words may appear in any order and one modest typo is tolerated. Exact title
 * matches still win decisively, followed by title prefixes and phrases.
 */
export function rankSiteSearch(
  items: SiteSearchItem[],
  query: string,
  limit = 12
): RankedSiteSearchItem[] {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return [];

  const queryWords = [...new Set(normalizedQuery.split(" ").filter(Boolean))];
  const ranked: RankedSiteSearchItem[] = [];

  for (const item of items) {
    const title = item.titleSearch || normalizeSearchText(item.title);
    const haystack = item.searchText || normalizeSearchText(`${item.title} ${item.description}`);
    const alternateTitles = item.titleAliases ?? [];
    const titleWords = `${title} ${alternateTitles.join(" ")}`.split(" ").filter(Boolean);
    const haystackWords = haystack.split(" ").filter(Boolean);
    let score = item.weight;
    let matchesEveryWord = true;

    for (const word of queryWords) {
      if (titleWords.includes(word)) score += 38;
      else if (titleWords.some((candidate) => candidate.startsWith(word))) score += 28;
      else if (haystackWords.includes(word)) score += 16;
      else if (haystackWords.some((candidate) => candidate.startsWith(word))) score += 10;
      else if (fuzzyWordMatch(word, titleWords)) score += 12;
      else if (fuzzyWordMatch(word, haystackWords)) score += 5;
      else {
        matchesEveryWord = false;
        break;
      }
    }

    if (!matchesEveryWord) continue;
    if (title === normalizedQuery) score += 220;
    else if (title.startsWith(normalizedQuery)) score += 145;
    else if (title.includes(normalizedQuery)) score += 100;
    else if (alternateTitles.includes(normalizedQuery)) score += 195;
    else if (alternateTitles.some((candidate) => candidate.startsWith(normalizedQuery))) score += 125;
    else if (alternateTitles.some((candidate) => candidate.includes(normalizedQuery))) score += 88;
    else if (haystack.includes(normalizedQuery)) score += 52;

    ranked.push({ ...item, score });
  }

  return ranked
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.title.localeCompare(b.title) ||
        a.href.localeCompare(b.href)
    )
    .slice(0, Math.max(1, limit));
}
