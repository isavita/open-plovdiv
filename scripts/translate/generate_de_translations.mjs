import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const targetLang = process.argv[2] ?? "de";
const supportedTargetLangs = new Set(["de", "fr", "it", "tr", "es", "el"]);
if (!supportedTargetLangs.has(targetLang)) {
  throw new Error(`Unsupported target language "${targetLang}". Expected one of: ${[...supportedTargetLangs].join(", ")}`);
}
const outputPath = path.join(root, `data/translations/${targetLang}.json`);
const sourceDirs = ["data/curated", "data/generated/history-knowledge"];
const splitToken = "\n<<<OP_TRANSLATION_SPLIT>>>\n";
const maxBatchChars = 4200;
const skipKey = /(^|_)url_en$|wikipedia_en$|review_url_en$/;
const cyrillic = /[Ѐ-ӿ]/u;
const latin = /[A-Za-z]/u;
const numericOnly = /^[-+]?\d+(?:[.,]\d+)?$/;
const protectedFieldBases = new Set(["actor", "architect", "birthplace", "builder"]);
let protectedNameFixups = [];

const manualTranslationsByLang = {
  de: {
    "Public web reference; reuse terms not verified":
      "Öffentliche Webreferenz; Wiederverwendungsbedingungen nicht geprüft",
    "Wikimedia Commons file license, verify per file":
      "Wikimedia-Commons-Dateilizenz; pro Datei prüfen",
    "Creative Commons Attribution-ShareAlike 4.0 International":
      "Creative Commons Namensnennung - Weitergabe unter gleichen Bedingungen 4.0 International",
    "Creative Commons CC0 1.0 Universal": "Creative Commons CC0 1.0 Universal",
    "Open Database License 1.0": "Open Database License 1.0"
  },
  fr: {
    "Public web reference; reuse terms not verified":
      "Référence web publique ; conditions de réutilisation non vérifiées",
    "Wikimedia Commons file license, verify per file":
      "Licence de fichier Wikimedia Commons ; vérifier chaque fichier",
    "Creative Commons Attribution-ShareAlike 4.0 International":
      "Creative Commons Attribution - Partage dans les mêmes conditions 4.0 International",
    "Creative Commons CC0 1.0 Universal": "Creative Commons CC0 1.0 Universal",
    "Open Database License 1.0": "Open Database License 1.0"
  },
  it: {
    "Public web reference; reuse terms not verified":
      "Riferimento web pubblico; condizioni di riutilizzo non verificate",
    "Wikimedia Commons file license, verify per file":
      "Licenza del file Wikimedia Commons; verificare per ciascun file",
    "Creative Commons Attribution-ShareAlike 4.0 International":
      "Creative Commons Attribuzione - Condividi allo stesso modo 4.0 Internazionale",
    "Creative Commons CC0 1.0 Universal": "Creative Commons CC0 1.0 Universal",
    "Open Database License 1.0": "Open Database License 1.0"
  },
  tr: {
    "Public web reference; reuse terms not verified":
      "Herkese açık web kaynağı; yeniden kullanım koşulları doğrulanmadı",
    "Wikimedia Commons file license, verify per file":
      "Wikimedia Commons dosya lisansı; her dosya için doğrulayın",
    "Creative Commons Attribution-ShareAlike 4.0 International":
      "Creative Commons Atıf-AynıLisanslaPaylaş 4.0 Uluslararası",
    "Creative Commons CC0 1.0 Universal": "Creative Commons CC0 1.0 Universal",
    "Open Database License 1.0": "Open Database License 1.0",
    // Machine reordering separates the "Eng." honorific from the surname here;
    // pin a clean translation that keeps the recorded name intact.
    "Mayoral term(s) for Eng. Ivan Totev.":
      "Eng. Ivan Totev için belediye başkanlığı dönemleri."
  },
  es: {
    "Public web reference; reuse terms not verified":
      "Referencia web pública; condiciones de reutilización no verificadas",
    "Wikimedia Commons file license, verify per file":
      "Licencia de archivo de Wikimedia Commons; verificar en cada archivo",
    "Creative Commons Attribution-ShareAlike 4.0 International":
      "Creative Commons Atribución-CompartirIgual 4.0 Internacional",
    "Creative Commons CC0 1.0 Universal": "Creative Commons CC0 1.0 Universal",
    "Open Database License 1.0": "Open Database License 1.0"
  },
  el: {
    "Public web reference; reuse terms not verified":
      "Δημόσια διαδικτυακή αναφορά· οι όροι επαναχρησιμοποίησης δεν επαληθεύτηκαν",
    "Wikimedia Commons file license, verify per file":
      "Άδεια αρχείου Wikimedia Commons· επαληθεύστε ανά αρχείο",
    "Creative Commons Attribution-ShareAlike 4.0 International":
      "Creative Commons Attribution-ShareAlike 4.0 International",
    "Creative Commons CC0 1.0 Universal": "Creative Commons CC0 1.0 Universal",
    "Open Database License 1.0": "Open Database License 1.0",
    "Engineer Ivan Borisov Totev (born 28 October 1975 in Plovdiv) is a Bulgarian engineer and GERB politician who served two consecutive terms as mayor of Plovdiv from 2011 to 2019. He graduated from the Gotse Delchev Transport Technical School in Plovdiv, from the Technical University in Sofia as a master engineer in computer systems and technologies, and in public administration from Plovdiv University. Before becoming mayor he was mayor of Iztochen District (2007-2009), briefly an MP in 2009, and regional governor of Plovdiv (2009-2011). During his administration the city prepared and delivered the European Capital of Culture 2019 title, and after his mayoral term Totev was again elected to the 45th, 46th and 47th National Assemblies.":
      "Ο Ivan Borisov Totev (γεννημένος στις 28 Οκτωβρίου 1975 στο Plovdiv) είναι Βούλγαρος μηχανικός και πολιτικός του GERB που υπηρέτησε δύο συνεχόμενες θητείες ως δήμαρχος του Plovdiv από το 2011 έως το 2019. Αποφοίτησε από την Τεχνική Σχολή Μεταφορών Gotse Delchev στο Plovdiv, από το Τεχνικό Πανεπιστήμιο της Σόφιας ως διπλωματούχος μηχανικός συστημάτων και τεχνολογιών υπολογιστών, και από το Πανεπιστήμιο του Plovdiv στη δημόσια διοίκηση. Πριν γίνει δήμαρχος ήταν δήμαρχος της περιφέρειας Iztochen (2007-2009), για σύντομο διάστημα βουλευτής το 2009, και περιφερειακός κυβερνήτης του Plovdiv (2009-2011). Κατά τη διάρκεια της διοίκησής του η πόλη προετοίμασε και υλοποίησε τον τίτλο Πολιτιστική Πρωτεύουσα της Ευρώπης 2019, ενώ μετά τη δημαρχιακή του θητεία ο Totev εξελέγη ξανά στην 45η, 46η και 47η Εθνοσυνέλευση.",
    "Hristo Pavlov Shkodrov was a Social Democrat, journalist and prominent trade unionist appointed chair of Plovdiv's three-member municipal commission on 26 September 1919. His term belongs to the unstable postwar municipal administration: a Regional History Museum Plovdiv study of interwar political life describes how, after Stefan Gevgalov's resignation in 1919, several temporary commission chairs followed one another for only a month or two, including Pavlov, who was replaced on 11 November by Hariton Kuev. In 2014 Pod Tepeto reported that Dimitar Raychev supplied researcher Katerina Chobanova with archival photographic material of Pavlov, filling the blank in her collection of Plovdiv mayor portraits. Another Regional History Museum Plovdiv study notes that after his death the municipality decided he should be buried at municipal expense.":
      "Ο Hristo Pavlov Shkodrov ήταν σοσιαλδημοκράτης, δημοσιογράφος και εξέχων συνδικαλιστής, διορισμένος πρόεδρος της τριμελούς δημοτικής επιτροπής του Plovdiv στις 26 Σεπτεμβρίου 1919. Η θητεία του ανήκει στην ασταθή μεταπολεμική δημοτική διοίκηση: μελέτη του Περιφερειακού Ιστορικού Μουσείου Plovdiv για την πολιτική ζωή του Μεσοπολέμου περιγράφει πώς, μετά την παραίτηση του Stefan Gevgalov το 1919, αρκετοί προσωρινοί πρόεδροι επιτροπών διαδέχθηκαν ο ένας τον άλλον για μόλις έναν ή δύο μήνες, μεταξύ τους και ο Pavlov, που αντικαταστάθηκε στις 11 Νοεμβρίου από τον Hariton Kuev. Το 2014 το Pod Tepeto ανέφερε ότι ο Dimitar Raychev παρείχε στην ερευνήτρια Katerina Chobanova αρχειακό φωτογραφικό υλικό του Pavlov, συμπληρώνοντας το κενό στη συλλογή της με πορτρέτα δημάρχων του Plovdiv. Άλλη μελέτη του Περιφερειακού Ιστορικού Μουσείου Plovdiv σημειώνει ότι μετά τον θάνατό του ο δήμος αποφάσισε να ταφεί με δημοτική δαπάνη.",
    "Sotir Antoniadi (1843-1928) was a physician and politician of Greek origin, born in Stanimaka, today Asenovgrad. He first studied at the central Greek school in Plovdiv, then at a high school in Athens, and later medicine in Vienna before working for two years in Paris. Antoniadi was a deputy in the Regional Assembly of Eastern Rumelia and in 1885 in the National Assembly of the Principality of Bulgaria. Between 26 January and 21 April 1883 he briefly served as acting mayor of Plovdiv. In 1915 he moved to Greece; his house and the pharmacy built in 1872 are part of the Old Plovdiv architectural and historical reserve.":
      "Ο Sotir Antoniadi (1843-1928) ήταν γιατρός και πολιτικός ελληνικής καταγωγής, γεννημένος στη Στανιμάκα, σήμερα Asenovgrad. Αρχικά σπούδασε στο κεντρικό ελληνικό σχολείο του Plovdiv, στη συνέχεια σε γυμνάσιο της Αθήνας και αργότερα ιατρική στη Βιέννη, πριν εργαστεί για δύο χρόνια στο Παρίσι. Ο Antoniadi ήταν βουλευτής στην Περιφερειακή Συνέλευση της Ανατολικής Ρωμυλίας και το 1885 στην Εθνοσυνέλευση του Πριγκιπάτου της Βουλγαρίας. Από τις 26 Ιανουαρίου έως τις 21 Απριλίου 1883 υπηρέτησε σύντομα ως αναπληρωτής δήμαρχος του Plovdiv. Το 1915 μετακόμισε στην Ελλάδα· το σπίτι του και το φαρμακείο που χτίστηκε το 1872 αποτελούν μέρος του αρχιτεκτονικού και ιστορικού αποθέματος του Παλαιού Plovdiv."
  }
};

// Extra [machineForm, originalName] fixups for protected names that the generic
// inference cannot recover (non-templated transliterations inside longer strings).
const protectedNameOverridesByLang = {
  tr: [["Bojidar Zdravkov", "Bozhidar Zdravkov"]]
};

// Landmark names the machine sometimes leaves in English inside longer captions;
// normalise them to their natural target-language form for consistency.
const landmarkFixupsByLang = {
  tr: [["Lamartine House", "Lamartine Evi"]],
  // Spanish renders "House" -> "Casa" but wrongly feminises the surname ("Lamartina");
  // pin the natural form keeping the recorded surname intact.
  es: [
    ["Casa Lamartina", "Casa Lamartine"],
    ["Lamartine House", "Casa Lamartine"],
    ["Prince's Garden in Plovdiv", "Jardín del Príncipe en Plovdiv"],
    ["Sahat Hill", "Sahat Tepe"],
    ["Sahat hill", "colina Sahat"],
    ["The Old Town (Old Plovdiv)", "el casco antiguo (Viejo Plovdiv)"],
    ["The Old Town", "el casco antiguo"],
    ["Old Plovdiv", "Viejo Plovdiv"],
    ["The Seven Hills (tepeta)", "las Siete Colinas (tepeta)"],
    ["The Seven Hills", "las Siete Colinas"]
  ],
  // Greek wrongly pluralises the surname ("Σπίτι Λαμαρτίνων" = house of the Lamartines);
  // pin the natural genitive-singular form.
  el: [
    ["Lamartine House", "Σπίτι Λαμαρτίνου"],
    ["Σπίτι Λαμαρτίνων", "Σπίτι Λαμαρτίνου"],
    ["Σπίτι των Λαμαρτίνων", "Σπίτι Λαμαρτίνου"],
    ["Geo Milev Primary School", "Δημοτικό Σχολείο Geo Milev"],
    ["Prince's Garden in Plovdiv", "Κήπος του Πρίγκιπα στο Plovdiv"],
    ["Sahat Hill", "Sahat Tepe"],
    ["Sahat hill", "Sahat Tepe"],
    ["The Seven Hills (tepeta)", "Επτά Λόφοι (τεπέτα)"],
    ["The Seven Hills", "Επτά Λόφοι"],
    ["Old Plovdiv", "Παλαιό Plovdiv"]
  ]
};
const manualTranslations = manualTranslationsByLang[targetLang];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function* jsonFiles(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* jsonFiles(full);
    else if (entry.isFile() && entry.name.endsWith(".json")) yield full;
  }
}

function isPersonLikeRecord(record) {
  return (
    record.type === "person" ||
    String(record.id ?? "").startsWith("person-") ||
    String(record.id ?? "").startsWith("notable-person-") ||
    Array.isArray(record.roles) ||
    "birth_year" in record ||
    "death_year" in record
  );
}

function shouldTranslateField(record, base) {
  if (protectedFieldBases.has(base)) return false;
  if (base === "name" && isPersonLikeRecord(record)) return false;
  return true;
}

function collect(value, key = "", out = new Set(), parentRecord = null) {
  if (Array.isArray(value)) {
    for (const item of value) collect(item, key, out, parentRecord);
    return out;
  }
  if (value && typeof value === "object") {
    for (const [childKey, childValue] of Object.entries(value)) collect(childValue, childKey, out, value);
    return out;
  }
  if (typeof value !== "string") return out;
  const text = value.trim();
  if (!text) return out;
  if (numericOnly.test(text)) return out;
  if (key.endsWith("_en") && !skipKey.test(key)) {
    const base = key.slice(0, -3);
    if (shouldTranslateField(parentRecord ?? {}, base)) out.add(text);
  }
  if (key === "title" && latin.test(text) && !cyrillic.test(text)) out.add(text);
  return out;
}

function collectProtectedNames(value, out = new Set()) {
  if (Array.isArray(value)) {
    for (const item of value) collectProtectedNames(item, out);
    return out;
  }
  if (value && typeof value === "object") {
    if (isPersonLikeRecord(value) && typeof value.name_en === "string") {
      const name = value.name_en.trim();
      if (name && !cyrillic.test(name)) out.add(name);
    }
    for (const base of protectedFieldBases) {
      const text = value[`${base}_en`];
      if (typeof text === "string" && text.trim() && !cyrillic.test(text)) out.add(text.trim());
    }
    for (const childValue of Object.values(value)) collectProtectedNames(childValue, out);
    return out;
  }
  return out;
}

function makeBatches(strings) {
  const batches = [];
  let current = [];
  let currentChars = 0;
  for (const text of strings) {
    const nextChars = currentChars + text.length + splitToken.length;
    if (current.length > 0 && nextChars > maxBatchChars) {
      batches.push(current);
      current = [];
      currentChars = 0;
    }
    current.push(text);
    currentChars += text.length + splitToken.length;
  }
  if (current.length > 0) batches.push(current);
  return batches;
}

async function translateBatch(batch) {
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", "en");
  url.searchParams.set("tl", targetLang);
  url.searchParams.set("dt", "t");
  url.searchParams.set("q", batch.join(splitToken));

  const response = await fetch(url);
  if (!response.ok) throw new Error(`translation failed: ${response.status} ${response.statusText}`);
  const payload = await response.json();
  const translated = payload?.[0]?.map((part) => part?.[0] ?? "").join("") ?? "";
  const parts = translated.split("<<<OP_TRANSLATION_SPLIT>>>").map((part) => part.trim());
  if (parts.length !== batch.length) {
    throw new Error(`translation split mismatch: expected ${batch.length}, got ${parts.length}`);
  }
  return parts;
}

function normalizeTranslation(text) {
  let normalized = text
    .replaceAll("BGN", "BGN")
    .replaceAll("EUR", "EUR")
    .replaceAll("Open Plowdiw", "Open Plovdiv")
    .replaceAll("Open Plovdiv", "Open Plovdiv")
    .replaceAll("Wikidaten", "Wikidata")
    .replaceAll("Wiki-Daten", "Wikidata")
    .replaceAll("Wikipedien", "Wikipedia")
    .replaceAll("Wikipedia", "Wikipedia")
    .trim();
  for (const [translatedName, originalName] of protectedNameFixups) {
    normalized = normalized.replaceAll(translatedName, originalName);
  }
  return normalized;
}

async function buildProtectedNameFixups(protectedNames, existing) {
  const existingFixups = [...protectedNames]
    .map((name) => [existing[name], name])
    .filter(([translatedName, name]) => translatedName && translatedName !== name);

  const pendingNames = [...protectedNames].filter((name) => !existing[name]);
  const translatedFixups = [];
  for (const batch of makeBatches(pendingNames)) {
    const translated = await translateBatch(batch);
    for (let i = 0; i < batch.length; i += 1) {
      const originalName = batch[i];
      const translatedName = translated[i]?.trim();
      if (translatedName && translatedName !== originalName) translatedFixups.push([translatedName, originalName]);
    }
  }

  return [...existingFixups, ...translatedFixups].sort((a, b) => b[0].length - a[0].length);
}

function stripNamePrefix(value) {
  // French inserts grammatical articles before the name in some templates; Italian
  // keeps the name (incl. title prefixes like "Dott."/"Ing.") intact in the capture.
  if (targetLang === "fr") {
    return value
      .replace(/^l['’]/i, "")
      .replace(/^le /i, "")
      .replace(/^la /i, "")
      .replace(/^les /i, "")
      .trim();
  }
  return value.trim();
}

// Per-language inference of how a protected person name was rendered inside a
// translated sentence, so it can be mapped back to the original spelling.
const namePatternsByLang = {
  fr: {
    direct: (escapedName) => [
      [`Biographical reference: ${escapedName}`, /^Référence biographique\s*:\s*(.+)$/],
      [`Birth of ${escapedName}`, /^Naissance (?:d['’]|de |du |des )(.+)$/],
      [
        `Birth year and birthplace for ${escapedName}.`,
        /^Année et lieu de naissance (?:d['’]|de |du |des )(.+)\.$/
      ],
      [
        `Biographical data and Plovdiv birthplace link for ${escapedName}.`,
        /^Données biographiques et lien vers le lieu de naissance de Plovdiv pour (.+)\.$/
      ],
      [`Mayor: ${escapedName}`, /^Maire\s*:\s*(.+)$/],
      [`Mayoral term\\(s\\) for ${escapedName}.`, /^.+ pour (?:l['’]|le |la |les )?(.+)\.$/],
      [`Wikipedia [—-] ${escapedName}`, /^Wikipédia [—-]\s*(.+)$/]
    ],
    archive: /Maire\s*:\s*([^"»]+)["»]\.?$/,
    relationshipPrefix: /^Relation personnelle\s*:\s*/
  },
  it: {
    direct: (escapedName) => [
      [`Biographical reference: ${escapedName}`, /^Riferimento biografico\s*:\s*(.+)$/],
      [`Birth of ${escapedName}`, /^Nascita di (.+)$/],
      [
        `Birth year and birthplace for ${escapedName}.`,
        /^Anno di nascita e luogo di nascita di (.+)\.$/
      ],
      [
        `Biographical data and Plovdiv birthplace link for ${escapedName}.`,
        /^Dati biografici e collegamento al luogo di nascita di Plovdiv per (.+)\.$/
      ],
      [`Mayor: ${escapedName}`, /^Sindaco\s*:\s*(.+)$/],
      [`Mayoral term\\(s\\) for ${escapedName}.`, /^Termine sindaco per (.+)\.$/],
      [`Wikipedia [—–-] ${escapedName}`, /^Wikipedia [—–-]\s*(.+)$/]
    ],
    archive: /Sindaco\s*:\s*([^"»]+)["»]\.?$/,
    relationshipPrefix: /^Rapporto personale\s*:\s*/
  },
  es: {
    direct: (escapedName) => [
      [`Biographical reference: ${escapedName}`, /^Referencia biográfica\s*:\s*(.+)$/],
      // Spanish may insert an article ("Nacimiento del ángel ..." for "Angel").
      [`Birth of ${escapedName}`, /^Nacimiento de(?:l| la| los| las)? (.+)$/],
      [`Birth year and birthplace for ${escapedName}.`, /^Año de nacimiento y lugar de nacimiento de (.+)\.$/],
      [
        `Biographical data and Plovdiv birthplace link for ${escapedName}.`,
        /^Datos biográficos y enlace del lugar de nacimiento de Plovdiv de (.+)\.$/
      ],
      [`Mayor: ${escapedName}`, /^Alcalde\s*:\s*(.+)$/],
      [`Mayoral term\\(s\\) for ${escapedName}.`, /^Mandato.* para (.+)\.$/],
      // Spanish sometimes renders the "Wikipedia —" separator as a colon.
      [`Wikipedia [—–-] ${escapedName}`, /^Wikipedia\s*[—–:-]\s*(.+)$/]
    ],
    archive: /Alcalde\s*:\s*([^"»]+)["»]\.?$/,
    relationshipPrefix: /^Relación personal\s*:\s*/
  },
  tr: {
    // Turkish renders the name first with a genitive suffix after an apostrophe
    // (e.g. "Emma Tahmiziyan'ın doğumu"); capture the name before the apostrophe.
    direct: (escapedName) => [
      [`Biographical reference: ${escapedName}`, /^Biyografik referans\s*:\s*(.+)$/],
      [`Birth of ${escapedName}`, /^(.+?)['’]\S*\s+[Dd]oğ\w*$/],
      [`Birth year and birthplace for ${escapedName}.`, /^(.+?)['’]\S*\s+doğum yılı ve doğum yeri\.$/],
      [
        `Biographical data and Plovdiv birthplace link for ${escapedName}.`,
        /^(.+?)['’]\S*\s+biyografik verileri.*$/
      ],
      [`Mayor: ${escapedName}`, /^Belediye Başkanı\s*:\s*(.+)$/],
      [`Mayoral term\\(s\\) for ${escapedName}.`, /^(.+?)['’]\S*\s+belediye başkanlığı dönem.*$/],
      [`Wikipedia [—–-] ${escapedName}`, /^Vikipedi [—–-]\s*(.+)$/]
    ],
    archive: /Belediye Başkanı\s*:\s*([^"»]+)["»]\.?$/,
    relationshipPrefix: /^Kişi ilişkisi\s*:\s*/
  },
  el: {
    // Greek often inserts a definite article (της/του/τον/την) before the name and
    // transliterates it into Greek script; capture what follows the article.
    direct: (escapedName) => [
      [`Biographical reference: ${escapedName}`, /^Βιογραφική αναφορά\s*:\s*(.+)$/],
      [`Birth of ${escapedName}`, /^Γέννηση τ(?:ης|ου|ων|ο)\s+(.+)$/],
      [
        `Birth year and birthplace for ${escapedName}.`,
        /^Έτος γέννησης και γενέτειρα για τ(?:ην|ον|ο|η)\s+(.+)\.$/
      ],
      [
        `Biographical data and Plovdiv birthplace link for ${escapedName}.`,
        /^Βιογραφικά στοιχεία.* για τ(?:ην|ον|ο|η)\s+(.+)\.$/
      ],
      [`Mayor: ${escapedName}`, /^Δήμαρχος\s*:\s*(.+)$/],
      [`Mayoral term\\(s\\) for ${escapedName}.`, /^Δήμαρχος.* για τ(?:ον|ην|ο|η)\s+(.+)\.$/],
      [`Wikipedia [—–-] ${escapedName}`, /^Wikipedia\s*[—–:-]\s*(.+)$/]
    ],
    archive: /Δήμαρχος\s*:\s*([^"»]+)["»]\.?$/,
    relationshipPrefix: /^Προσωπική σχέση\s*:\s*/
  }
};

function translatedNameFromPattern(source, target, name) {
  const langPatterns = namePatternsByLang[targetLang];
  if (!langPatterns) return null;
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  for (const [sourcePattern, targetPattern] of langPatterns.direct(escapedName)) {
    if (!new RegExp(`^${sourcePattern}$`).test(source)) continue;
    const match = target.match(targetPattern);
    return match ? stripNamePrefix(match[1]) : null;
  }

  const archiveMatch = source.match(new RegExp(`^City archive record "Mayor: ${escapedName}"\\.$`));
  if (archiveMatch) {
    const targetMatch = target.match(langPatterns.archive);
    return targetMatch ? stripNamePrefix(targetMatch[1]) : null;
  }

  const relationshipSource = source
    .replace(/^Person relationship: /, "")
    .replace(/\.$/, "")
    .match(/^(.+) — (succeeded by|succeeds) — (.+)$/);
  if (relationshipSource) {
    const targetBody = target.replace(langPatterns.relationshipPrefix, "").replace(/\.$/, "");
    // Google emits an em-dash, en-dash or (Turkish) a hyphen as the relation separator.
    const targetParts = targetBody.split(/\s+[—–-]\s+/);
    if (targetParts.length === 3 && relationshipSource[1] === name) return stripNamePrefix(targetParts[0]);
    if (targetParts.length === 3 && relationshipSource[3] === name) return stripNamePrefix(targetParts[2]);
  }

  return null;
}

function inferProtectedNameFixups(translations, protectedNames) {
  const inferred = [];
  for (const [source, target] of Object.entries(translations)) {
    for (const name of protectedNames) {
      if (!source.includes(name) || target.includes(name)) continue;
      const translatedName = translatedNameFromPattern(source, target, name);
      if (translatedName && translatedName !== name) inferred.push([translatedName, name]);
    }
  }
  return inferred;
}

function normalizeAllTranslations(translations) {
  for (const [source, translated] of Object.entries(translations)) {
    translations[source] = normalizeTranslation(translated);
  }
}

// Italian translates honorific prefixes that are part of a protected name
// ("Dr. X" -> "il dottor X"/"Dott. X", "Eng. X" -> "Ing. X") even mid-sentence.
// Map every machine rendering of such a prefixed name back to its original form.
function buildTitlePrefixFixups(protectedNames) {
  if (targetLang !== "it") return [];
  const variantPrefixes = {
    "Dr.": ["Il dottor", "il dottor", "Dottor", "dottor", "Dott.", "Dott.ssa", "Il Dott.", "il Dott."],
    "Dr": ["Il dottor", "il dottor", "Dottor", "dottor", "Dott.", "Dott.ssa"],
    "Eng.": ["Ing.", "ing.", "L'ingegnere", "l'ingegnere"],
    "Prof.": ["Prof.", "Il professor", "il professor"]
  };
  const fixups = [];
  for (const name of protectedNames) {
    for (const [prefix, variants] of Object.entries(variantPrefixes)) {
      if (!name.startsWith(`${prefix} `)) continue;
      const rest = name.slice(prefix.length + 1);
      for (const variant of variants) fixups.push([`${variant} ${rest}`, name]);
    }
  }
  return fixups;
}

// Machine translation renders the modern city "Plovdiv" as a historical exonym
// (Italian "Filippopoli", Turkish "Filibe", Greek "Φιλιππούπολη") or transliterates
// it (Greek "Πλόβντιβ"). Keep "Plovdiv" for the modern city while still allowing the
// exonym where the English source explicitly used the ancient "Philippopolis".
// `guarded` forms only map back when the source used "Plovdiv" (not "Philippopolis").
const exonymByLang = {
  it: [{ form: "Filippopoli", guarded: true }],
  tr: [{ form: "Filibe", guarded: true }],
  el: [
    // Longest first so the Greek genitive "Φιλιππούπολης" is handled before "Φιλιππούπολη".
    { form: "Φιλιππούπολης", guarded: true },
    { form: "Φιλιππούπολη", guarded: true },
    // Plain transliteration of the modern brand name; never the ancient city.
    { form: "Πλόβντιβ", guarded: false }
  ]
};
function applyExonymFixups(translations) {
  const exonyms = exonymByLang[targetLang];
  if (!exonyms) return;
  for (const [source, translated] of Object.entries(translations)) {
    if (typeof translated !== "string") continue;
    const guardOk =
      source.includes("Plovdiv") && !source.includes("Philippopolis") && !source.includes("Filibe");
    let out = translated;
    for (const { form, guarded } of exonyms) {
      if (!out.includes(form) || (guarded && !guardOk)) continue;
      out = out.replaceAll(form, "Plovdiv");
    }
    translations[source] = out;
  }
}

// The source convention writes honorifics as "Dr."/"Eng." before a name. Italian
// machine translation expands these ("il dottor"/"Dott."/"Ing.") even for full
// names not in the protected set; restore the source form wherever the English
// source actually used the honorific, so names read identically across locales.
function applyHonorificFixups(translations) {
  if (!["it", "tr", "es", "el"].includes(targetLang)) return;
  for (const [source, translated] of Object.entries(translations)) {
    if (typeof translated !== "string") continue;
    let out = translated;
    if (targetLang === "el") {
      // Greek renders "Dr." as "Δρ"/"Δρ."; restore the source honorific so the
      // recorded name reads identically across locales.
      if (/\bDr\.?\s/.test(source)) {
        out = out.replace(/\bΔρ\.? /g, "Dr. ");
      }
      if (/\bEng\.?\s/.test(source)) {
        out = out.replace(/\bΜηχ\.? /g, "Eng. ").replace(/\bΜηχανικός /g, "Eng. ");
      }
    } else if (targetLang === "it") {
      // Match the source honorific with or without a trailing period ("Dr." or "Dr").
      if (/\bDr\.?\s/.test(source)) {
        out = out
          .replace(/\b[Ii]l dottor /g, "Dr. ")
          .replace(/\bDott\.ssa /g, "Dr. ")
          .replace(/\bDott\. /g, "Dr. ")
          .replace(/\bDottor /g, "Dr. ");
      }
      if (/\bEng\.?\s/.test(source)) {
        out = out.replace(/\b[Ll]'ingegnere /g, "Eng. ").replace(/\bIng\. /g, "Eng. ");
      }
    } else if (targetLang === "es") {
      // Spanish keeps "Dr." but renders "Eng." as "Ing.", "el inglés" or "el ingeniero".
      if (/\bEng\.?\s/.test(source)) {
        out = out
          .replace(/\b[Ee]l inglés\. /g, "Eng. ")
          .replace(/\b[Ee]l ingeniero /g, "Eng. ")
          .replace(/\bIng\. /g, "Eng. ");
      }
    } else if (targetLang === "tr") {
      // Turkish keeps "Dr." but renders "Eng." as "Müh." (Mühendis); restore the
      // source convention so the honorific reads identically across locales.
      if (/\bEng\.?\s/.test(source)) {
        out = out.replace(/\bMüh\. /g, "Eng. ").replace(/\bMühendis /g, "Eng. ");
      }
    }
    translations[source] = out;
  }
}

function applyLandmarkFixups(translations) {
  const fixups = landmarkFixupsByLang[targetLang];
  if (!fixups) return;
  for (const [source, translated] of Object.entries(translations)) {
    if (typeof translated !== "string") continue;
    let out = translated;
    for (const [en, local] of fixups) out = out.replaceAll(en, local);
    translations[source] = out;
  }
}

function applyGreekTemplateFixups(translations) {
  if (targetLang !== "el") return;
  for (const source of Object.keys(translations)) {
    let match = source.match(/^(.+) — (succeeds|succeeded by) — (.+)$/);
    if (match) {
      const [, left, relation, right] = match;
      translations[source] =
        relation === "succeeds"
          ? `${left} — διαδέχεται — ${right}`
          : `${left} — ακολουθείται από — ${right}`;
      continue;
    }

    match = source.match(/^Person relationship: (.+) — (succeeds|succeeded by) — (.+)\.$/);
    if (match) {
      const [, left, relation, right] = match;
      translations[source] =
        relation === "succeeds"
          ? `Προσωπική σχέση: ${left} — διαδέχεται — ${right}.`
          : `Προσωπική σχέση: ${left} — ακολουθείται από — ${right}.`;
      continue;
    }

    match = source.match(/^The mayoral chronology links (.+) with (.+) through the relationship "(succeeds|succeeded by)"\.$/);
    if (match) {
      const [, left, right, relation] = match;
      const label = relation === "succeeds" ? "διαδέχεται" : "ακολουθείται από";
      translations[source] = `Το δημαρχιακό χρονολόγιο συνδέει ${left} με ${right} μέσω της σχέσης «${label}».`;
      continue;
    }

    match = source.match(/^Mayoral term\(s\) for (.+)\.$/);
    if (match) {
      translations[source] = `Δημαρχιακή θητεία για ${match[1]}.`;
      continue;
    }

    match = source.match(/^Wikipedia [—-] (.+)$/);
    if (match) {
      translations[source] = `Wikipedia — ${match[1]}`;
      continue;
    }

    match = source.match(/^Biographical reference: (.+)$/);
    if (match) {
      translations[source] = `Βιογραφική αναφορά: ${match[1]}`;
      continue;
    }

    match = source.match(/^Birth of (.+)$/);
    if (match) {
      translations[source] = `Γέννηση: ${match[1]}`;
      continue;
    }

    match = source.match(/^Birth year and birthplace for (.+)\.$/);
    if (match) {
      translations[source] = `Έτος γέννησης και γενέτειρα: ${match[1]}.`;
      continue;
    }

    match = source.match(/^Biographical data and Plovdiv birthplace link for (.+)\.$/);
    if (match) {
      translations[source] = `Βιογραφικά στοιχεία και σύνδεση τόπου γέννησης στο Plovdiv: ${match[1]}.`;
      continue;
    }

    match = source.match(/^City archive record "Mayor: (.+)"\.$/);
    if (match) {
      translations[source] = `Εγγραφή αρχείου πόλης «Δήμαρχος: ${match[1]}».`;
    }
  }
}

const existing = fs.existsSync(outputPath) ? readJson(outputPath) : {};
const allStrings = new Set(Object.keys(manualTranslations));
const protectedNames = new Set();
for (const dir of sourceDirs) {
  for (const file of jsonFiles(path.join(root, dir))) {
    const json = readJson(file);
    collectProtectedNames(json, protectedNames);
    collect(json, "", allStrings);
  }
}
for (const name of protectedNames) allStrings.delete(name);
protectedNameFixups = await buildProtectedNameFixups(protectedNames, existing);

const translations = { ...manualTranslations };
for (const text of allStrings) {
  if (manualTranslations[text]) continue; // manual translations are authoritative
  if (existing[text]) translations[text] = normalizeTranslation(existing[text]);
}
const pending = [...allStrings]
  .filter((text) => !translations[text])
  .sort((a, b) => a.length - b.length || a.localeCompare(b));

console.log(`${targetLang} translations: ${Object.keys(translations).length} cached, ${pending.length} pending`);

const batches = makeBatches(pending);
for (let i = 0; i < batches.length; i += 1) {
  const batch = batches[i];
  const translated = await translateBatch(batch);
  for (let j = 0; j < batch.length; j += 1) translations[batch[j]] = normalizeTranslation(translated[j]);
  if ((i + 1) % 10 === 0 || i === batches.length - 1) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, `${JSON.stringify(Object.fromEntries(Object.entries(translations).sort()), null, 2)}\n`);
    console.log(`translated ${i + 1}/${batches.length} batches`);
  }
}

const inferredNameFixups = inferProtectedNameFixups(translations, protectedNames);
const titlePrefixFixups = buildTitlePrefixFixups(protectedNames);
const overrideFixups = protectedNameOverridesByLang[targetLang] ?? [];
protectedNameFixups = [
  ...protectedNameFixups,
  ...inferredNameFixups,
  ...titlePrefixFixups,
  ...overrideFixups
].sort((a, b) => b[0].length - a[0].length);
normalizeAllTranslations(translations);
applyExonymFixups(translations);
applyHonorificFixups(translations);
applyLandmarkFixups(translations);
applyGreekTemplateFixups(translations);

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(Object.fromEntries(Object.entries(translations).sort()), null, 2)}\n`);
console.log(`wrote ${path.relative(root, outputPath)} (${Object.keys(translations).length} entries)`);
