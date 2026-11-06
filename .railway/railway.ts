import { defineRailway, github, project, service } from "railway/iac";
// This repository manages only its own resources in the environment. Other
// repositories export their own partial name.
// See https://docs.railway.com/infrastructure-as-code#multi-repo-projects
export const partial = "open-plovdiv-web";
export default defineRailway(() => {
  const _openPlovdivweb = service("@open-plovdiv/web", {
    source: github("isavita/open-plovdiv", { branch: "main", checkSuites: false }),
    build: { buildCommand: "npm run build", buildEnvironment: "V3", builder: "RAILPACK", watchPatterns: ["/apps/web/**", "/data/**", "/scripts/**", "/package.json", "/package-lock.json", "/railway.json", "/.railway/**", "/.node-version"] },
    start: "npm start",
    healthcheck: "/",
    healthcheckTimeout: 120,
    replicas: { "europe-west4-drams3a": 1 },
    deploy: { restartPolicyType: "ON_FAILURE", restartPolicyMaxRetries: 10, limitOverride: { containers: { cpu: 4, memoryBytes: 4000000000 } } },
    domains: [{ domain: "openplovdiv.com", port: 4321 }],
    networking: { privateNetworkEndpoint: "open-plovdivweb" },
  });

  return project("lucky-education", {
    variables: { managed: false },
    resources: [_openPlovdivweb],
  });
});
