export function commonsImageUrl(url: string, width: number): string {
  const fileName = commonsFileName(url);
  if (!fileName) return url;

  return `https://commons.wikimedia.org/wiki/Special:Redirect/file/${fileName}?width=${width}`;
}

function commonsFileName(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  if (parsed.hostname !== "upload.wikimedia.org") return null;

  const marker = "/wikipedia/commons/";
  const markerIndex = parsed.pathname.indexOf(marker);
  if (markerIndex === -1) return null;

  const commonsPath = parsed.pathname.slice(markerIndex + marker.length);
  if (!commonsPath) return null;

  if (commonsPath.startsWith("thumb/")) {
    const parts = commonsPath.split("/");
    const originalFile = parts.slice(3, -1).join("/");
    return originalFile || null;
  }

  return commonsPath.split("/").pop() || null;
}
