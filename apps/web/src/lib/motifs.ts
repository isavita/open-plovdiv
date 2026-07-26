/**
 * Engraved section motifs — thin-line SVG vignettes that give each public
 * section its visual signature. Rendered inline via `set:html` inside an
 * `aria-hidden` container (decorative only) and drawn in `currentColor`, so
 * the surrounding CSS decides the accent (see `--section-accent` /
 * `--entry-accent` in global.css). All primitives (`.motif-*`) are styled in
 * global.css and use `var(--surface)` for faces, so both themes work.
 */

// The eight historical eras in chronological order — dot colours come from
// the global `.era-*` classes.
const eraOrder = [
  "prehistory",
  "thracian",
  "roman",
  "medieval",
  "ottoman",
  "revival",
  "liberation",
  "modern"
];

const eraDotXs = [28, 66, 104, 142, 180, 218, 256, 294];

const svg = (body: string): string =>
  `<svg viewBox="0 0 320 88" preserveAspectRatio="xMidYMid meet">${body}</svg>`;

/** A small person glyph: outlined head over a shoulder arc. */
const personGlyph = (x: number, y: number, r = 8): string =>
  `<circle class="motif-glyph-head" cx="${x}" cy="${y}" r="${r}"/>` +
  `<path class="motif-glyph" d="M${x - 14} ${y + 26}c3.5-11 24.5-11 28 0"/>`;

/** A smaller filled person glyph for group scenes. */
const personGlyphSmall = (x: number, y: number): string =>
  `<circle class="motif-bust-head" cx="${x}" cy="${y}" r="5.5"/>` +
  `<path class="motif-bust" d="M${x - 10} ${y + 16}c2.5-8 17.5-8 20 0"/>`;

/**
 * Engraved bust used as the portrait fallback wherever a person has no
 * licensed image — paired with a small monogram (`.bust-mono`) it reads as an
 * intentional engraved plate rather than a missing photo. Styled by the
 * shared `.bust-fallback` rules in global.css.
 */
export const bustGlyph =
  `<svg viewBox="0 0 56 56" preserveAspectRatio="xMidYMid meet" aria-hidden="true">` +
  `<circle class="motif-bust-head" cx="28" cy="20" r="9.5"/>` +
  `<path class="motif-bust" d="M11 45c3-12 31-12 34 0"/>` +
  `</svg>`;

/**
 * Engraved category plates for places that carry no licensed photograph.
 * Drawn on a 160×100 field in `currentColor` with the same primitives as the
 * section motifs, so a card without an image still reads as a deliberate
 * plate — and the drawing itself tells you what kind of place it is.
 * Styled by `.place-plate` in global.css; keys match `placeColors`.
 */
const plate = (body: string): string =>
  `<svg viewBox="0 0 160 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">${body}</svg>`;

export const placeCategoryPlates: Record<string, string> = {
  // Burial mound on the plain, with a low sun behind it.
  thracian: plate(
    `<circle class="motif-fill soft" cx="112" cy="42" r="17"/>
    <path class="motif-glyph" d="M26 74c10-26 26-38 38-38s28 12 38 38"/>
    <path class="motif-contour" d="M8 74h144"/>
    <path class="motif-contour dim" d="M8 84h144"/>`
  ),

  // A colonnade: four columns under an architrave — the antique theatre.
  roman: plate(
    `<path class="motif-glyph" d="M28 34h104"/>
    <path class="motif-line" d="M32 42h96"/>
    ${[42, 68, 94, 120]
      .map(
        (x) =>
          `<rect class="motif-sheet" x="${x - 6}" y="42" width="12" height="30" rx="1"/>`
      )
      .join("\n    ")}
    <path class="motif-glyph" d="M24 74h112"/>
    <path class="motif-contour dim" d="M8 84h144"/>`
  ),

  // Crenellated wall with a gate tower.
  medieval: plate(
    `<rect class="motif-sheet" x="26" y="48" width="46" height="26"/>
    <rect class="motif-sheet" x="72" y="34" width="34" height="40"/>
    <rect class="motif-sheet" x="106" y="48" width="28" height="26"/>
    ${[28, 38, 48, 58, 110, 120, 130]
      .map((x) => `<rect class="motif-fill" x="${x}" y="42" width="6" height="6"/>`)
      .join("\n    ")}
    ${[74, 84, 94]
      .map((x) => `<rect class="motif-fill" x="${x}" y="28" width="6" height="6"/>`)
      .join("\n    ")}
    <path class="motif-glyph" d="M83 74V60a6 6 0 0 1 12 0v14"/>
    <path class="motif-contour dim" d="M8 84h144"/>`
  ),

  // Dome and minaret — the Ottoman skyline.
  ottoman: plate(
    `<path class="motif-glyph" d="M46 62a26 26 0 0 1 52 0"/>
    <rect class="motif-sheet" x="42" y="62" width="60" height="12"/>
    <path class="motif-line" d="M72 36v-8"/>
    <circle class="motif-node" cx="72" cy="26" r="3"/>
    <rect class="motif-sheet" x="112" y="30" width="12" height="44"/>
    <path class="motif-glyph" d="M112 30l6-10 6 10"/>
    <path class="motif-line" d="M112 44h12"/>
    <path class="motif-contour dim" d="M8 84h144"/>`
  ),

  // Revival house: the overhanging upper storey over a stone base.
  revival: plate(
    `<rect class="motif-sheet" x="48" y="52" width="48" height="22"/>
    <rect class="motif-sheet" x="38" y="34" width="68" height="18"/>
    <path class="motif-glyph" d="M32 34l40-14 40 14"/>
    ${[48, 62, 76, 90]
      .map((x) => `<rect class="motif-fill" x="${x}" y="38" width="8" height="10"/>`)
      .join("\n    ")}
    <path class="motif-line" d="M118 74V44"/>
    <path class="motif-contour dim" d="M8 84h144"/>`
  ),

  // An apse with a cross above the arched window.
  religious: plate(
    `<path class="motif-glyph" d="M54 74V48a20 20 0 0 1 40 0v26"/>
    <path class="motif-line" d="M74 28v-10M69 22h10"/>
    <path class="motif-glyph" d="M66 74V58a8 8 0 0 1 16 0v16"/>
    <rect class="motif-sheet" x="104" y="56" width="20" height="18"/>
    <path class="motif-glyph" d="M100 56l14-10 14 10"/>
    <path class="motif-contour dim" d="M8 84h144"/>`
  ),

  // The tepeta: three rounded humps behind contour lines.
  hill: plate(
    `<path class="motif-glyph" d="M14 72c16-30 34-30 50 0"/>
    <path class="motif-glyph" d="M56 72c18-38 40-38 58 0"/>
    <path class="motif-line" d="M104 72c12-22 26-22 38 0"/>
    <circle class="motif-node" cx="85" cy="36" r="3.5"/>
    <path class="motif-contour" d="M8 78h144"/>
    <path class="motif-contour dim" d="M8 88h144"/>`
  ),

  // A street: facades either side of a lamp-lit way.
  civic: plate(
    `<rect class="motif-sheet" x="24" y="40" width="30" height="34"/>
    <rect class="motif-sheet" x="106" y="34" width="30" height="40"/>
    ${[28, 40]
      .map((x) => `<rect class="motif-fill" x="${x}" y="48" width="8" height="9"/>`)
      .join("\n    ")}
    ${[110, 122]
      .map((x) => `<rect class="motif-fill" x="${x}" y="42" width="8" height="9"/>`)
      .join("\n    ")}
    <path class="motif-line" d="M80 74V38"/>
    <circle class="motif-node" cx="80" cy="34" r="4.5"/>
    <path class="motif-contour" d="M8 74h144"/>
    <path class="motif-contour dim" d="M8 84h144"/>`
  ),

  // An obelisk on its plinth.
  monument: plate(
    `<path class="motif-glyph" d="M74 60l6-30 6 30z"/>
    <rect class="motif-sheet" x="70" y="60" width="20" height="8"/>
    <rect class="motif-sheet" x="62" y="68" width="36" height="8"/>
    <path class="motif-line" d="M40 76h80"/>
    <circle class="motif-node" cx="80" cy="22" r="3"/>
    <path class="motif-contour dim" d="M8 86h144"/>`
  )
};

/** Fallback plate for a category with no drawing of its own. */
export const placeFallbackPlate = plate(
  `<path class="motif-contour" d="M8 62C40 52 68 62 100 52c22-7 40-2 52 4"/>
  <path class="motif-contour dim" d="M8 76C48 68 92 74 152 64"/>
  <g class="motif-pin">
    <path d="M80 56c5-7.5 12.5-16 12.5-24.6a12.5 12.5 0 1 0 -25 0C67.5 40 75 48.5 80 56z"/>
    <circle class="motif-pin-hole" cx="80" cy="31.4" r="4.8"/>
  </g>`
);

export const sectionMotifs: Record<string, string> = {
  // Chronology of eras: dots alternate above/below a baseline with an arrow.
  history: svg(
    `<line class="motif-line" x1="12" y1="44" x2="306" y2="44"/>
    <path class="motif-line" d="M300 38l8 6-8 6" fill="none"/>
    ${eraOrder
      .map((era, i) => {
        const x = eraDotXs[i];
        const up = i % 2 === 0;
        return `<g class="motif-era"><line class="motif-stem" x1="${x}" y1="44" x2="${x}" y2="${up ? 33 : 55}"/><circle class="motif-dot era-${era}" cx="${x}" cy="${up ? 27 : 61}" r="5.5"/></g>`;
      })
      .join("\n    ")}`
  ),

  // A dashed walking path: start dot, two waypoints, destination pin.
  routes: svg(
    `<path class="motif-path" d="M16 70C60 24 108 76 156 48 196 26 240 44 286 42" fill="none"/>
    <circle class="motif-node" cx="16" cy="70" r="5.5"/>
    <circle class="motif-way" cx="101" cy="57" r="4.5"/>
    <circle class="motif-way" cx="204" cy="37" r="4.5"/>
    <g class="motif-pin">
      <path d="M286 42c4.2-6.3 10.5-13.4 10.5-20.7a10.5 10.5 0 1 0 -21 0c0 7.3 6.3 14.4 10.5 20.7z"/>
      <circle class="motif-pin-hole" cx="286" cy="21.5" r="4"/>
    </g>`
  ),

  // Contour lines with three map pins of varying depth.
  places: svg(
    `<path class="motif-contour" d="M0 62C42 52 74 60 112 48 152 35 186 46 226 38 260 31 292 40 320 32" fill="none"/>
    <path class="motif-contour dim" d="M0 78C60 70 112 74 162 63 212 52 264 60 320 50" fill="none"/>
    <g class="motif-pin">
      <path d="M92 54c4.4-6.6 11-14.1 11-21.7a11 11 0 1 0 -22 0c0 7.6 6.6 15.1 11 21.7z"/>
      <circle class="motif-pin-hole" cx="92" cy="32.5" r="4.2"/>
    </g>
    <g class="motif-pin">
      <path d="M206 40c3.4-5.1 8.5-10.8 8.5-16.7a8.5 8.5 0 1 0 -17 0c0 5.9 5.1 11.6 8.5 16.7z"/>
      <circle class="motif-pin-hole" cx="206" cy="23.5" r="3.2"/>
    </g>
    <g class="motif-pin">
      <path d="M268 66c2.8-4.2 7-8.9 7-13.8a7 7 0 1 0 -14 0c0 4.9 4.2 9.6 7 13.8z"/>
      <circle class="motif-pin-hole" cx="268" cy="52.4" r="2.6"/>
    </g>`
  ),

  // A mahala skyline: three gabled houses on a street line, a hill behind.
  neighbourhoods: svg(
    `<path class="motif-contour dim" d="M0 56C52 30 118 22 162 28 212 35 262 28 320 44" fill="none"/>
    <circle class="motif-node" cx="160" cy="23" r="4"/>
    <line class="motif-line" x1="20" y1="74" x2="300" y2="74"/>
    <rect class="motif-sheet" x="74" y="50" width="34" height="24" rx="2"/>
    <path class="motif-line" d="M70 50l21-13 21 13" fill="none"/>
    <rect class="motif-sheet" x="142" y="42" width="40" height="32" rx="2"/>
    <path class="motif-line" d="M138 42l24-15 24 15" fill="none"/>
    <rect class="motif-photo" x="157" y="58" width="10" height="16" rx="1"/>
    <rect class="motif-sheet" x="216" y="52" width="32" height="22" rx="2"/>
    <path class="motif-line" d="M212 52l20-12 20 12" fill="none"/>`
  ),

  // A stack of archive prints, the front one with a photo and caption lines.
  stories: svg(
    `<g transform="translate(160 45)">
      <g transform="rotate(-8)"><rect class="motif-sheet" x="-86" y="-25" width="108" height="54" rx="3"/></g>
      <g transform="rotate(5)"><rect class="motif-sheet" x="-20" y="-29" width="108" height="54" rx="3"/></g>
      <g class="motif-front">
        <rect class="motif-sheet" x="-62" y="-25" width="124" height="54" rx="3"/>
        <rect class="motif-photo" x="-54" y="-17" width="50" height="38" rx="2"/>
        <line class="motif-cap" x1="6" y1="-10" x2="52" y2="-10"/>
        <line class="motif-cap" x1="6" y1="0" x2="44" y2="0"/>
        <line class="motif-cap" x1="6" y1="10" x2="50" y2="10"/>
      </g>
    </g>`
  ),

  // A gallery wall: three portrait frames with busts, nameplate under the centre.
  mayors: svg(
    `<rect class="motif-sheet" x="70" y="20" width="48" height="54" rx="4"/>
    <circle class="motif-bust-head" cx="94" cy="38" r="7.5"/>
    <path class="motif-bust" d="M80 66c2.5-10 25.5-10 28 0"/>
    <rect class="motif-sheet" x="132" y="12" width="56" height="64" rx="4"/>
    <circle class="motif-bust-head" cx="160" cy="33" r="9"/>
    <path class="motif-bust" d="M144 68c3-12 29-12 32 0"/>
    <rect class="motif-sheet" x="202" y="20" width="48" height="54" rx="4"/>
    <circle class="motif-bust-head" cx="226" cy="38" r="7.5"/>
    <path class="motif-bust" d="M212 66c2.5-10 25.5-10 28 0"/>
    <line class="motif-cap" x1="148" y1="82" x2="172" y2="82"/>`
  ),

  // A classical pediment over four columns — the city hall.
  governance: svg(
    `<path class="motif-glyph" d="M118 36 160 16l42 20" fill="none"/>
    <line class="motif-line" x1="121" y1="40" x2="199" y2="40"/>
    <rect class="motif-fill" x="126" y="44" width="7" height="26"/>
    <rect class="motif-fill" x="147" y="44" width="7" height="26"/>
    <rect class="motif-fill" x="166" y="44" width="7" height="26"/>
    <rect class="motif-fill" x="187" y="44" width="7" height="26"/>
    <line class="motif-glyph" x1="118" y1="72" x2="202" y2="72"/>
    <line class="motif-line" x1="110" y1="78" x2="210" y2="78"/>`
  ),

  // A small relationship graph: three connected people.
  people: svg(
    `<line class="motif-link" x1="85" y1="30" x2="150" y2="21"/>
    <line class="motif-link" x1="170" y1="21" x2="233" y2="32"/>
    <path class="motif-link motif-dashed" d="M82 48C130 72 192 70 236 50" fill="none"/>
    ${personGlyph(76, 32)}
    ${personGlyph(160, 20)}
    ${personGlyph(244, 34)}`
  ),

  // An archive box with a label, sealed with a round stamp.
  archive: svg(
    `<rect class="motif-sheet" x="88" y="34" width="88" height="36" rx="3"/>
    <rect class="motif-sheet" x="82" y="23" width="100" height="13" rx="2"/>
    <rect class="motif-photo" x="118" y="46" width="28" height="13" rx="2"/>
    <circle class="motif-ring" cx="224" cy="46" r="17"/>
    <circle class="motif-ring thin" cx="224" cy="46" r="11.5"/>
    <circle class="motif-node" cx="224" cy="46" r="2.2"/>`
  ),

  // A works plan: folded blueprint sheet, dashed site plan, rising bars.
  projects: svg(
    `<path class="motif-sheet" d="M84 14h136l16 16v44H84z"/>
    <path class="motif-fill soft" d="M220 14v16h16z"/>
    <rect class="motif-plan" x="98" y="26" width="52" height="36" rx="2"/>
    <line class="motif-line" x1="164" y1="62" x2="222" y2="62"/>
    <rect class="motif-fill" x="168" y="50" width="12" height="12"/>
    <rect class="motif-fill" x="186" y="42" width="12" height="20"/>
    <rect class="motif-fill" x="204" y="32" width="12" height="30"/>`
  ),

  // A circle of volunteers around a dashed round table.
  community: svg(
    `<circle class="motif-ring thin motif-dashed" cx="160" cy="42" r="30"/>
    ${personGlyphSmall(160, 12)}
    ${personGlyphSmall(188.5, 32.7)}
    ${personGlyphSmall(177.6, 66.3)}
    ${personGlyphSmall(142.4, 66.3)}
    ${personGlyphSmall(131.5, 32.7)}`
  ),

  // A ledger with ruled rows, verified with a check seal.
  "data-sources": svg(
    `<rect class="motif-sheet" x="78" y="16" width="124" height="56" rx="3"/>
    <line class="motif-link" x1="112" y1="16" x2="112" y2="72"/>
    <line class="motif-cap" x1="86" y1="30" x2="104" y2="30"/>
    <line class="motif-cap" x1="86" y1="42" x2="104" y2="42"/>
    <line class="motif-cap" x1="86" y1="54" x2="104" y2="54"/>
    <line class="motif-cap" x1="120" y1="30" x2="182" y2="30"/>
    <line class="motif-cap" x1="120" y1="42" x2="170" y2="42"/>
    <line class="motif-cap" x1="120" y1="54" x2="178" y2="54"/>
    <circle class="motif-ring" cx="236" cy="44" r="18"/>
    <path class="motif-check" d="M227 44l7 7 13-14"/>`
  ),

  // A document under a reviewer's magnifier.
  "editorial-review": svg(
    `<rect class="motif-sheet" x="94" y="14" width="88" height="60" rx="3"/>
    <line class="motif-cap" x1="104" y1="28" x2="168" y2="28"/>
    <line class="motif-cap" x1="104" y1="40" x2="156" y2="40"/>
    <line class="motif-cap" x1="104" y1="52" x2="164" y2="52"/>
    <circle class="motif-glass" cx="206" cy="48" r="17"/>
    <circle class="motif-ring" cx="206" cy="48" r="17"/>
    <line class="motif-handle" x1="218" y1="60" x2="234" y2="76"/>`
  )
};
