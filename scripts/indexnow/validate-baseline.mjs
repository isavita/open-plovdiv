const ORIGIN = "https://openplovdiv.com";

// Kept independent of build dependencies so scheduled refreshes validate the
// entire retained snapshot without needing to reinstall and rebuild the site.
export function validateManifest(manifest) {
  if (manifest?.schema !== 1 || !/^[a-f0-9]{40}$/.test(manifest.sha || "") || !Number.isFinite(Date.parse(manifest.deployedAt)) || !Number.isSafeInteger(manifest.deploymentId) || manifest.deploymentId < 1 || !manifest.pages || typeof manifest.pages !== "object" || Array.isArray(manifest.pages)) throw new Error("Invalid IndexNow baseline");
  for (const [url, hash] of Object.entries(manifest.pages)) {
    let parsed;
    try { parsed = new URL(url); } catch { throw new Error("Invalid IndexNow page in baseline"); }
    if (parsed.origin !== ORIGIN || parsed.href !== url || parsed.username || parsed.password || parsed.search || parsed.hash || typeof hash !== "string" || !/^[a-f0-9]{64}$/.test(hash)) throw new Error("Invalid IndexNow page in baseline");
  }
  return manifest;
}
