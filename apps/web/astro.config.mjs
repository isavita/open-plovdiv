import node from "@astrojs/node";
import { defineConfig } from "astro/config";

const site =
  process.env.PUBLIC_SITE_URL ??
  (process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : "https://openplovdiv.example");

// The site stays static-first: existing pages are prerendered, while report
// APIs and moderation routes opt into on-demand rendering with
// `export const prerender = false`. Railway needs the standalone server to bind
// to 0.0.0.0 and its assigned PORT.
export default defineConfig({
  output: "static",
  adapter: node({ mode: "standalone" }),
  site,
  server: {
    host: "0.0.0.0",
    port: Number(process.env.PORT) || 4321
  }
});
