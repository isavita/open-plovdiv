import node from "@astrojs/node";
import { defineConfig } from "astro/config";

// The site stays static-first: every existing page is prerendered. Only the
// citizen-report API routes and the moderation dashboard opt into on-demand
// rendering via `export const prerender = false`. The Node adapter makes those
// runnable locally and on any Node host; swap it for @astrojs/cloudflare or
// @astrojs/vercel to deploy serverless.
export default defineConfig({
  output: "static",
  adapter: node({ mode: "standalone" }),
  site: "https://openplovdiv.example"
});
