/**
 * WebP derivatives of four prominently featured Wikimedia portraits. The
 * original source URL is checked so a changed photo cannot silently retain an
 * outdated local image or attribution. These files were resized to 330/500px
 * and re-encoded; the page displays each source, creator and licence.
 */
const originals: Record<string, string> = {
  "person-hristo-stoichkov-q187125": "https://upload.wikimedia.org/wikipedia/commons/a/a0/Hristo_stoichkov-2010.jpg",
  "person-sonya-yoncheva-q3490781": "https://upload.wikimedia.org/wikipedia/commons/2/23/SonyaYoncheva2019_%28cropped%29.jpg",
  "person-boris-christoff-q362106": "https://upload.wikimedia.org/wikipedia/commons/b/bb/%D0%91%D0%BE%D1%80%D0%B8%D1%81_%D0%A5%D1%80%D0%B8%D1%81%D1%82%D0%BE%D0%B2._crop.jpg",
  "person-yordan-yovchev-q887271": "https://upload.wikimedia.org/wikipedia/commons/d/d4/Yordan_Yovchev.jpg"
};

export function featuredPortraitDerivative(id: string, source: string): { small: string; large: string } | null {
  if (originals[id] !== source) return null;
  const base = `/images/people/${id}`;
  return { small: `${base}-330-v1.webp`, large: `${base}-500-v1.webp` };
}
