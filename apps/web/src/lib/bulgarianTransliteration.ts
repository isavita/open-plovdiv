// Render Bulgarian public-record text in Latin script while keeping the
// original available for finding the same address or person in local records.
const letters: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ж: "zh", з: "z",
  и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p",
  р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch",
  ш: "sh", щ: "sht", ъ: "a", ь: "y", ю: "yu", я: "ya"
};

export function romanizeBulgarian(text: string): string {
  return text.replace(/[А-Яа-я]/g, (letter) => {
    const converted = letters[letter.toLowerCase()];
    if (!converted) return letter;
    return letter === letter.toUpperCase()
      ? converted[0].toUpperCase() + converted.slice(1)
      : converted;
  });
}

export function englishBulgarianName(text: string): string {
  return /[А-Яа-я]/.test(text) ? `${romanizeBulgarian(text)} (Bulgarian: ${text})` : text;
}

export function englishBulgarianAddress(text: string): string {
  if (!/[А-Яа-я]/.test(text)) return text;
  // Expand common source abbreviations for visitors; leave street and place
  // names as transliterations rather than inventing an English name.
  const readable = text
    .replace(/Старинен Пловдив/g, "Old Plovdiv")
    .replace(/ул\s*\./gi, "Street ")
    .replace(/бул\s*\./gi, "Boulevard ")
    .replace(/гр\s*\./gi, "city of ")
    .replace(/град\s+/gi, "city of ")
    .replace(/площад\s+/gi, "Square ")
    .replace(/ЖР\s*/g, "residential district ");
  return `${romanizeBulgarian(readable).replace(/\s+/g, " ").trim()} (Bulgarian: ${text})`;
}
