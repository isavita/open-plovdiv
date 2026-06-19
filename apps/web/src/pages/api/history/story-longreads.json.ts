import storyLongreads from "../../../../../../data/generated/history-knowledge/story-longreads.json";

export function GET() {
  return new Response(
    JSON.stringify({
      count: storyLongreads.length,
      story_longreads: storyLongreads
    }),
    {
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "public, max-age=300"
      }
    }
  );
}
