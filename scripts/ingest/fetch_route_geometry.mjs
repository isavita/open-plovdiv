import fs from "node:fs";
import path from "node:path";
import process from "node:process";

/**
 * Fetches real walking geometry for every curated walking route and commits it
 * under data/curated/route-geometry/<route-id>.json, so builds stay offline.
 *
 * - Walking legs come from the FOSSGIS OSRM instance (foot profile) that also
 *   powers openstreetmap.org routing; stops are sent as ordered waypoints.
 * - Elevation gain/loss comes from the Open-Meteo elevation API, sampled along
 *   the returned line (copernicus DEM), with a small threshold to ignore noise.
 *
 * Usage:
 *   node scripts/ingest/fetch_route_geometry.mjs           # only missing routes
 *   node scripts/ingest/fetch_route_geometry.mjs --force   # refresh everything
 *   node scripts/ingest/fetch_route_geometry.mjs <route-id> [--force]
 */

const root = process.cwd();
const outDir = path.join(root, "data/curated/route-geometry");
const force = process.argv.includes("--force");
const onlyRouteId = process.argv.slice(2).find((arg) => !arg.startsWith("--"));

const OSRM_BASE = "https://routing.openstreetmap.de/routed-foot/route/v1/foot";
const ELEVATION_BASE = "https://api.open-meteo.com/v1/elevation";
const USER_AGENT = "open-plovdiv-route-geometry/1.0 (https://github.com/isavita/open-plovdiv; one-off curated data build)";
// Copernicus DEM carries metre-level noise on flat ground; only count climbs
// that clear this threshold so boulevard walks do not accumulate fake ascent.
const ASCENT_NOISE_METERS = 2;
const SAMPLE_SPACING_METERS = 60;

const routes = readJson("data/curated/walking-routes.json");
const places = readJson("data/generated/history-knowledge/places.json");
const placesById = new Map(places.map((place) => [place.id, place]));

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(path.join(root, relPath), "utf8"));
}

function haversineMeters(a, b) {
  const R = 6371000;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchJson(url) {
  const response = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} for ${url}`);
  }
  return response.json();
}

async function fetchWalkingGeometry(route) {
  const stopCoords = route.stops.map((stop) => {
    const place = placesById.get(stop.place_id);
    if (!place?.coordinates) {
      throw new Error(`route ${route.id}: stop ${stop.place_id} has no published coordinates`);
    }
    return { place_id: stop.place_id, lat: place.coordinates.lat, lng: place.coordinates.lng };
  });

  const waypointParam = stopCoords.map((c) => `${c.lng},${c.lat}`).join(";");
  const url = `${OSRM_BASE}/${waypointParam}?overview=full&geometries=geojson&steps=false&alternatives=false`;
  const payload = await fetchJson(url);
  if (payload.code !== "Ok" || !payload.routes?.[0]) {
    throw new Error(`route ${route.id}: OSRM returned ${payload.code ?? "no route"}`);
  }

  const osrmRoute = payload.routes[0];
  const legs = osrmRoute.legs.map((leg, index) => ({
    from_place_id: stopCoords[index].place_id,
    to_place_id: stopCoords[index + 1].place_id,
    distance_m: Math.round(leg.distance),
    duration_s: Math.round(leg.duration),
    straight_m: Math.round(haversineMeters(stopCoords[index], stopCoords[index + 1]))
  }));
  const snaps = payload.waypoints.map((waypoint, index) => ({
    place_id: stopCoords[index].place_id,
    snapped: [
      Number(waypoint.location[0].toFixed(6)),
      Number(waypoint.location[1].toFixed(6))
    ],
    snap_distance_m: Math.round(waypoint.distance)
  }));

  return {
    coordinates: osrmRoute.geometry.coordinates.map(([lng, lat]) => [
      Number(lng.toFixed(6)),
      Number(lat.toFixed(6))
    ]),
    distance_m: Math.round(osrmRoute.distance),
    duration_s: Math.round(osrmRoute.duration),
    legs,
    snaps
  };
}

/** Evenly sample the line so elevation calls stay small but hills register. */
function samplePoints(coordinates) {
  const samples = [coordinates[0]];
  let sinceLast = 0;
  for (let i = 1; i < coordinates.length; i += 1) {
    const prev = { lng: coordinates[i - 1][0], lat: coordinates[i - 1][1] };
    const here = { lng: coordinates[i][0], lat: coordinates[i][1] };
    sinceLast += haversineMeters(prev, here);
    if (sinceLast >= SAMPLE_SPACING_METERS) {
      samples.push(coordinates[i]);
      sinceLast = 0;
    }
  }
  const last = coordinates[coordinates.length - 1];
  if (samples[samples.length - 1] !== last) samples.push(last);
  return samples;
}

async function fetchElevationProfile(coordinates) {
  const samples = samplePoints(coordinates);
  const elevations = [];
  for (let i = 0; i < samples.length; i += 100) {
    const chunk = samples.slice(i, i + 100);
    const url = `${ELEVATION_BASE}?latitude=${chunk.map((c) => c[1]).join(",")}&longitude=${chunk
      .map((c) => c[0])
      .join(",")}`;
    const payload = await fetchJson(url);
    if (!Array.isArray(payload.elevation) || payload.elevation.length !== chunk.length) {
      throw new Error("elevation API returned an unexpected payload");
    }
    elevations.push(...payload.elevation);
    await sleep(250);
  }

  let ascent = 0;
  let descent = 0;
  for (let i = 1; i < elevations.length; i += 1) {
    const delta = elevations[i] - elevations[i - 1];
    if (delta >= ASCENT_NOISE_METERS) ascent += delta;
    else if (delta <= -ASCENT_NOISE_METERS) descent += Math.abs(delta);
  }
  return {
    sample_count: elevations.length,
    min_elevation_m: Math.round(Math.min(...elevations)),
    max_elevation_m: Math.round(Math.max(...elevations)),
    ascent_m: Math.round(ascent),
    descent_m: Math.round(descent)
  };
}

fs.mkdirSync(outDir, { recursive: true });
let written = 0;
let skipped = 0;
let failed = 0;

for (const route of routes) {
  if (onlyRouteId && route.id !== onlyRouteId) continue;
  const target = path.join(outDir, `${route.id}.json`);
  if (!force && fs.existsSync(target)) {
    skipped += 1;
    continue;
  }
  try {
    const geometry = await fetchWalkingGeometry(route);
    await sleep(600);
    const elevation = await fetchElevationProfile(geometry.coordinates);
    const record = {
      route_id: route.id,
      provider: "osrm-foot (routing.openstreetmap.de) + open-meteo elevation",
      fetched_at: new Date().toISOString().slice(0, 10),
      distance_m: geometry.distance_m,
      walk_duration_s: geometry.duration_s,
      elevation,
      stops: geometry.snaps,
      legs: geometry.legs,
      geometry: {
        type: "LineString",
        coordinates: geometry.coordinates
      }
    };
    fs.writeFileSync(target, `${JSON.stringify(record, null, 2)}\n`);
    const km = (geometry.distance_m / 1000).toFixed(1);
    const walkMin = Math.round(geometry.duration_s / 60);
    console.log(
      `wrote ${route.id}: ${km} km, ~${walkMin} min walking, +${elevation.ascent_m} m ascent, ${geometry.coordinates.length} points`
    );
    written += 1;
    await sleep(900);
  } catch (error) {
    failed += 1;
    console.error(`FAILED ${route.id}: ${error.message}`);
  }
}

console.log(`route geometry: ${written} written, ${skipped} kept, ${failed} failed`);
if (failed > 0) process.exit(1);
