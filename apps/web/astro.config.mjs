import node from "@astrojs/node";
import { defineConfig } from "astro/config";

const configuredSite =
  process.env.PUBLIC_SITE_URL ??
  (process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : null);

if (!configuredSite && process.env.NODE_ENV === "production") {
  throw new Error(
    "A production build requires PUBLIC_SITE_URL or RAILWAY_PUBLIC_DOMAIN so canonical URLs use the deployed origin."
  );
}

const site = configuredSite ?? "http://localhost:4321";

// The public site is read-only and its pages are prerendered. Railway still
// uses the standalone adapter to bind the server to its assigned host and port.
export default defineConfig({
  output: "static",
  adapter: node({ mode: "standalone" }),
  site,
  server: {
    host: "0.0.0.0",
    port: Number(process.env.PORT) || 4321
  }
});
