import type { HistoricalArchiveItem } from "./data";

function archiveSeriesKey(item: HistoricalArchiveItem): string {
  return `${item.place_id}::${item.date_year}`;
}

function archiveDisplayScore(item: HistoricalArchiveItem): number {
  const searchableTitle = [item.id, item.title_en, item.title_bg, item.media?.title].join(" ").toLocaleLowerCase();
  let score = 0;

  if (!/\b(?:image|postcard|картичка|снимка)\s+\d+\b/i.test(searchableTitle)) score += 8;
  if (!/-\d+$/.test(item.id)) score += 2;
  if (item.georeference?.confidence === "high") score += 1;

  return score;
}

export function publicArchiveItems(items: readonly HistoricalArchiveItem[]): HistoricalArchiveItem[] {
  const groups = new Map<string, HistoricalArchiveItem[]>();

  for (const item of items) {
    const key = archiveSeriesKey(item);
    const group = groups.get(key);
    if (group) {
      group.push(item);
    } else {
      groups.set(key, [item]);
    }
  }

  return [...groups.values()].map((group) =>
    group.reduce((best, candidate) => (archiveDisplayScore(candidate) > archiveDisplayScore(best) ? candidate : best))
  );
}
