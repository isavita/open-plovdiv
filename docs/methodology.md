# Methodology

Open Plovdiv separates three things:

- source facts copied from public documents
- plain-language summaries written for readability
- manual or AI-assisted interpretation that must be reviewed before publication

## Collection

Official/project data is manual-first. Editors add records to `data/curated` and keep original public files in `data/raw` when available.

Citizen reports are submitted through `/fix-map/report`. A submitted report is stored with `moderation_status: "needs_review"` and is not public until a moderator approves it.

## Cleaning

Data must pass JSON schema validation before it can be copied into `apps/web/public/data`. Validation checks required fields, status values, source URLs, money amounts, coordinates, unique IDs, and forbidden private fields.

Citizen report submissions are validated at the API boundary. The API checks category, title length, description length, Plovdiv coordinate bounds, required privacy confirmations, rate limits, and text that looks like email or phone data.

## Moderation

Moderators use `/admin/reports` with a bearer token. They can approve, reject, hide unsafe photos, and update a public status such as `unverified`, `verified`, `sent_to_municipality`, `in_progress`, `fixed`, or `closed`.

Approved citizen reports are available through `/api/reports/public`, `/api/reports/stream`, and the exported snapshot at `/data/community-fix-reports.json`.

## Photos

Photos are optional. Uploaded images are limited to 5 MB each, converted to WebP, and re-encoded without EXIF/GPS metadata. Pending photos are stored outside the public directory and are copied to public storage only after moderation approval.

## AI Use

AI may later draft summaries, categories, or location candidates. AI output is not a source of truth. It must be marked as draft or reviewed, and it must not invent facts.

## Corrections

Corrections should cite a public source where possible. The preferred workflow is to update the curated JSON record, add or replace the relevant source URL, run validation, and rebuild the static site.

## What This Site Does Not Claim

Open Plovdiv does not score corruption, rank political parties, identify wrongdoing, or publish private personal data. It presents public records and clearly marked summaries.
