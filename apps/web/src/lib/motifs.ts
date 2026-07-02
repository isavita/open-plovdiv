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

  // Street lines with an alert pin (and a smaller secondary report).
  "fix-map": svg(
    `<path class="motif-contour" d="M0 60C60 52 120 58 320 40" fill="none"/>
    <path class="motif-contour dim" d="M96 88C120 56 160 34 220 8" fill="none"/>
    <g class="motif-pin">
      <path d="M140 64c4.8-7.2 12-15.4 12-23.7a12 12 0 1 0 -24 0c0 8.3 7.2 16.5 12 23.7z"/>
      <line class="motif-pin-mark" x1="140" y1="33.5" x2="140" y2="42"/>
      <circle class="motif-pin-hole" cx="140" cy="46.5" r="1.9"/>
    </g>
    <g class="motif-pin">
      <path d="M238 60c2.8-4.2 7-8.9 7-13.8a7 7 0 1 0 -14 0c0 4.9 4.2 9.6 7 13.8z"/>
      <circle class="motif-pin-hole" cx="238" cy="46.4" r="2.6"/>
    </g>`
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
