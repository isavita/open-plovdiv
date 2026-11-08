/** Literal image filenames are identifiers and must not be machine-translated. */
export function isSourceImageFilename(source) {
  return /^(?:Wikimedia Commons — )?(?:File:)?[^:\n]+\.(?:jpg|jpeg|png|webp|svg|tif|tiff|gif)$/i.test(source)
    && !/[.!?]\s/.test(source);
}

export function preserveSourceImageFilenames(translations) {
  for (const source of Object.keys(translations)) {
    if (isSourceImageFilename(source)) translations[source] = source;
  }
}
