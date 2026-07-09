export function commonsImageUrl(url: string, width: number): string {
  const sourcePath = commonsSourcePath(url);
  if (!sourcePath) return url;

  const fileName = sourcePath.split("/").at(-1);
  if (!fileName) return url;

  // Wikimedia serves a small, stable set of responsive derivatives. Going
  // straight to upload.wikimedia.org avoids the cookie-setting MediaWiki
  // Special:Redirect endpoint while keeping the requested image sized for its
  // rendered surface.
  const thumbnailWidth = commonsThumbnailWidth(width);
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${sourcePath}/${thumbnailWidth}px-${fileName}`;
}

export function isCommonsUploadImageUrl(url: string): boolean {
  return Boolean(commonsSourcePath(url));
}

const responsiveThumbnailWidths = [330, 500, 960, 1280, 1920, 3840] as const;

function commonsThumbnailWidth(width: number): number {
  const requestedWidth = Number.isFinite(width) ? Math.max(1, Math.round(width)) : 500;
  return responsiveThumbnailWidths.find((candidate) => candidate >= requestedWidth) ?? responsiveThumbnailWidths.at(-1)!;
}

function commonsSourcePath(url: string): string | null {
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
    if (parts.length !== 5) return null;
    return parts.slice(1, -1).join("/");
  }

  const parts = commonsPath.split("/");
  return parts.length === 3 ? commonsPath : null;
}
