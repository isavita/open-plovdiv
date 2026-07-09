/**
 * Public-facing editorial notices deliberately distinguish publication from
 * final historical sign-off. The curated intake notes preserve their original
 * workflow wording; these normalized notices describe the status truthfully
 * wherever a record is published, downloaded, or rendered.
 */
const legacyNotes = {
  archive: {
    bg: "Автоматично подготвен архивен запис от Wikimedia Commons; изисква независима редакторска проверка и по-точно георефериране преди финално публикуване.",
    en: "Automatically prepared archive record from Wikimedia Commons; requires independent editorial review and finer georeferencing before final publication."
  },
  pair: {
    bg: "Автоматично подготвена двойка тогава/сега; изисква независима редакторска проверка на съвпадението, лиценза и контекста преди финално публикуване.",
    en: "Automatically prepared then/now pair; requires independent editorial review of the match, license and context before final publication."
  }
};

export const publishedEditorialNotices = {
  archive: {
    bg: "Този архивен запис е автоматично подготвен от Wikimedia Commons и е показан като временна справка; независима редакторска проверка и по-точно георефериране все още предстоят.",
    en: "This archive record was automatically prepared from Wikimedia Commons and is shown as a provisional reference; independent editorial review and more precise georeferencing are still pending."
  },
  pair: {
    bg: "Тази двойка от историческо изображение и референтна снимка е автоматично подготвена и е показана като временна справка; независима редакторска проверка на визуалното съответствие, информацията за лиценза и авторството и контекста все още предстои.",
    en: "This pairing of a historical image and a reference photo was automatically prepared and is shown as a provisional reference; independent editorial review of the visual match, licence and attribution information, and context is still pending."
  }
};

/**
 * Apply the precise published wording only to the known automated intake
 * notices. Custom editorial notes remain untouched for future records.
 */
export function normalizePublishedEditorialNotices(records, kind) {
  const legacy = legacyNotes[kind];
  const published = publishedEditorialNotices[kind];
  if (!legacy || !published || !Array.isArray(records)) return records;

  return records.map((record) => {
    const editorial = record?.editorial;
    if (
      !editorial ||
      editorial.status !== "needs_editorial_signoff" ||
      (editorial.notes_bg !== legacy.bg && editorial.notes_en !== legacy.en)
    ) {
      return record;
    }
    return {
      ...record,
      editorial: {
        ...editorial,
        notes_bg: published.bg,
        notes_en: published.en
      }
    };
  });
}
