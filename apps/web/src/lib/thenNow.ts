import type { ThenNowPair } from "./data";

type PublicThenNowOptions = {
  preferredPairIds?: ReadonlySet<string>;
};

function mediaUrlKey(url: string | undefined): string {
  if (!url) return "";

  try {
    const parsed = new URL(url);
    parsed.hash = "";
    parsed.search = "";
    return `${parsed.hostname}${decodeURIComponent(parsed.pathname)}`.toLocaleLowerCase();
  } catch {
    return url.trim().toLocaleLowerCase();
  }
}

export function isPublicThenNowPair(pair: ThenNowPair): boolean {
  const thenUrl = mediaUrlKey(pair.then_media?.url);
  const nowUrl = mediaUrlKey(pair.now_media?.url);

  return Boolean(thenUrl && nowUrl && thenUrl !== nowUrl);
}

export function thenNowComparisonKey(pair: ThenNowPair): string {
  return `${pair.place_id}::${mediaUrlKey(pair.now_media?.url)}`;
}

function comparisonScore(pair: ThenNowPair, preferredPairIds: ReadonlySet<string>): number {
  const searchableTitle = [
    pair.id,
    pair.title_en,
    pair.title_bg,
    pair.then_media?.title
  ]
    .join(" ")
    .toLocaleLowerCase();

  let score = 0;
  if (preferredPairIds.has(pair.id)) return 1000;
  if (!searchableTitle.includes("postcard") && !searchableTitle.includes("картичка")) score += 8;
  if (!/\b(?:\d+|[ivx]+)\b$/i.test(pair.id)) score += 2;
  if (pair.match_quality.includes("same_place")) score += 1;

  return score;
}

export function publicThenNowPairs(pairs: readonly ThenNowPair[], options: PublicThenNowOptions = {}): ThenNowPair[] {
  const preferredPairIds = options.preferredPairIds ?? new Set<string>();
  const groups = new Map<string, ThenNowPair[]>();

  for (const pair of pairs) {
    if (!isPublicThenNowPair(pair)) continue;

    const key = thenNowComparisonKey(pair);
    const group = groups.get(key);
    if (group) {
      group.push(pair);
    } else {
      groups.set(key, [pair]);
    }
  }

  return [...groups.values()].map((group) =>
    group.reduce((best, candidate) =>
      comparisonScore(candidate, preferredPairIds) > comparisonScore(best, preferredPairIds) ? candidate : best
    )
  );
}

export function thenNowCountByPlace(pairs: readonly ThenNowPair[]): Map<string, number> {
  const counts = new Map<string, number>();

  for (const pair of publicThenNowPairs(pairs)) {
    counts.set(pair.place_id, (counts.get(pair.place_id) ?? 0) + 1);
  }

  return counts;
}
