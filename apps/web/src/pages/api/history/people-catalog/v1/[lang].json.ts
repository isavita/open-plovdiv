import type { APIRoute } from "astro";
import { localeCodes, type Lang } from "../../../../../i18n/utils";
import { buildPeopleCatalog } from "../../../../../lib/peopleCatalog";
import { json } from "../../../../../lib/server/http";

export const prerender = true;

export function getStaticPaths() {
  return localeCodes.map((lang) => ({ params: { lang }, props: { lang } }));
}

export const GET: APIRoute = ({ props }) =>
  json(buildPeopleCatalog(props.lang as Lang), 200, { "Cache-Control": "public, max-age=600" });
