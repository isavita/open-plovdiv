import { appendFile } from "node:fs/promises";
const repository = process.env.GITHUB_REPOSITORY;
const token = process.env.GH_TOKEN;
const expectedId = Number(process.env.DEPLOYMENT_ID);
const expectedSha = process.env.DEPLOYMENT_SHA;
if (!/^[\w.-]+\/[\w.-]+$/.test(repository || "") || !token || !expectedId || !/^[a-f0-9]{40}$/.test(expectedSha || "")) throw new Error("Invalid deployment context");
const [owner, name] = repository.split("/");
// One bounded GraphQL request avoids 100 separate deployment-status REST
// calls, while still checking each candidate's successful status time.
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
if (data.errors?.length || !Array.isArray(data.data?.repository?.deployments?.nodes)) throw new Error("Could not inspect production deployments");
const candidates = [];
for (const deployment of data.data.repository.deployments.nodes) {
  let payload = deployment.payload;
  try { for (let i = 0; i < 2 && typeof payload === "string"; i++) payload = JSON.parse(payload); }
  catch { continue; }
  if (deployment.creator?.__typename !== "Bot" || deployment.creator.login !== "railway-app" || payload?.environmentId !== "c1a0a96b-c810-475b-bef5-584d4ed26630") continue;
  for (const status of deployment.statuses.nodes) {
    if (status.state === "SUCCESS" && status.creator?.__typename === "Bot" && status.creator.login === "railway-app") {
      const time = Date.parse(status.createdAt);
      if (Number.isFinite(time)) candidates.push({ id: deployment.databaseId, sha: deployment.commitOid, time });
    }
  }
}
const latest = candidates.sort((a, b) => b.time - a.time || b.id - a.id)[0];
if (!latest) throw new Error("Could not establish the live production deployment");
const isCurrent = latest.id === expectedId && latest.sha === expectedSha;
await appendFile(process.env.GITHUB_OUTPUT, `current=${isCurrent}\n`);
console.log(isCurrent ? "Confirmed the target is the latest successful production deployment." : "A newer production deployment exists; skipping this stale run.");
