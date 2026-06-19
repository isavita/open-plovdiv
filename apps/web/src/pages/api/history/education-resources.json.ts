import educationResources from "../../../../../../data/generated/history-knowledge/education-resources.json";

export function GET() {
  return new Response(
    JSON.stringify({
      count: educationResources.length,
      education_resources: educationResources
    }),
    {
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "public, max-age=300"
      }
    }
  );
}
