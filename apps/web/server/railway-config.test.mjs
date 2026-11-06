import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import railwayConfiguration, { partial } from "../../../.railway/railway.ts";

// Test what the Railway SDK resolves without accessing production or exposing
// variables. A Railway plan is still required to detect live drift.
describe("Railway production deployment contract", () => {
  const project = railwayConfiguration();
  const web = project.resources[0];

  it("targets only the existing GitHub service on main", () => {
    expect(partial).toBe("open-plovdiv-web");
    expect(project.name).toBe("lucky-education");
    expect(project.resources).toHaveLength(1);
    expect(web.name).toBe("@open-plovdiv/web");
    expect(web.source).toMatchObject({ repo: "isavita/open-plovdiv", branch: "main" });
    expect(project.variables).toEqual({ managed: false });
    expect(web.variables).toBeUndefined();
  });

  it("keeps the working build, start and health check", () => {
    expect(readFileSync(new URL("../../../.node-version", import.meta.url), "utf8").trim()).toBe("22.23.3");
    expect(web.build).toMatchObject({ builder: "RAILPACK", buildCommand: "npm run build" });
    expect(web.deploy).toMatchObject({
      startCommand: "npm start", healthcheckPath: "/", healthcheckTimeout: 120,
      restartPolicyType: "ON_FAILURE", restartPolicyMaxRetries: 10,
      multiRegionConfig: { "europe-west4-drams3a": { numReplicas: 1 } }
    });
    expect(web.networking.customDomains).toEqual({ "openplovdiv.com": { port: 4321 } });
  });

  it("watches application, data, build scripts and infrastructure changes", () => {
    expect(web.build.watchPatterns).toEqual(expect.arrayContaining([
      "/apps/web/**", "/data/**", "/scripts/**", "/package.json", "/package-lock.json", "/.node-version", "/.railway/**"
    ]));
  });
});
