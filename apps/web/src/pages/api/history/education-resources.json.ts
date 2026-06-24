import { educationResources } from "@lib/data";

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
