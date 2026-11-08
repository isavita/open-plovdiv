import { appendFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const ENVIRONMENT_ID = "c1a0a96b-c810-475b-bef5-584d4ed26630";

// Select only successful production deployments created and confirmed by Railway.
export function latestProductionDeployment(deployments) {
  if (!Array.isArray(deployments)) throw new Error("Could not inspect production deployments");
  const candidates = [];
  for (const deployment of deployments) {
    let payload = deployment.payload;
    try { for (let i = 0; i < 2 && typeof payload === "string"; i++) payload = JSON.parse(payload); }
    catch { continue; }
    if (deployment.creator?.__typename !== "Bot" || deployment.creator.login !== "railway-app" || payload?.environmentId !== ENVIRONMENT_ID) continue;
    if (!Number.isSafeInteger(deployment.databaseId) || deployment.databaseId < 1 || !/^[a-f0-9]{40}$/.test(deployment.commitOid || "")) continue;
    for (const status of deployment.statuses?.nodes || []) {
      if (status.state !== "SUCCESS" || status.creator?.__typename !== "Bot" || status.creator.login !== "railway-app") continue;
      const time = Date.parse(status.createdAt);
      if (Number.isFinite(time)) candidates.push({ id: deployment.databaseId, sha: deployment.commitOid, time, deployedAt: status.createdAt });
    }
  }
  const latest = candidates.sort((a, b) => b.time - a.time || b.id - a.id)[0];
  if (!latest) throw new Error("Could not establish the live production deployment");
  return latest;
}

async function main() {
  const { GITHUB_REPOSITORY: repository, GH_TOKEN: token, DEPLOYMENT_ID: expectedId, DEPLOYMENT_SHA: expectedSha } = process.env;
  if (!/^[\w.-]+\/[\w.-]+$/.test(repository || "") || !token || Boolean(expectedId) !== Boolean(expectedSha) || (expectedId && (!/^[1-9]\d*$/.test(expectedId) || !/^[a-f0-9]{40}$/.test(expectedSha)))) throw new Error("Invalid deployment context");
  const [owner, name] = repository.split("/");
  const query = `query($owner:String!, $name:String!) {
    repository(owner:$owner, name:$name) {
      deployments(first:100, environments:["lucky-education / production"], orderBy:{field:CREATED_AT,direction:DESC}) {
        nodes { databaseId commitOid creator { __typename login } payload
          statuses(first:10) { nodes { state createdAt creator { __typename login } } }
        }
      }
    }
  }`;
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { owner, name } }), signal: AbortSignal.timeout(30000)
  });
  if (!response.ok) throw new Error(`GitHub deployment check failed (${response.status})`);
  const data = await response.json();
  if (data.errors?.length) throw new Error("Could not inspect production deployments");
  const latest = latestProductionDeployment(data.data?.repository?.deployments?.nodes);
  const current = !expectedId || (latest.id === Number(expectedId) && latest.sha === expectedSha);
  await appendFile(process.env.GITHUB_OUTPUT, `current=${current}\nsha=${latest.sha}\ndeployment_id=${latest.id}\ndeployed_at=${latest.deployedAt}\n`);
  console.log(current ? "Confirmed the target is the latest successful production deployment." : "A newer production deployment exists; skipping this stale run.");
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) await main();
