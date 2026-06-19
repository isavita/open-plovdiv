# Methodology

Open Plovdiv separates three things:

- source facts copied from public documents
- plain-language summaries written for readability
- AI extraction and verification that must stay tied to public sources

## AI Search

AI searches public sources such as Plovdiv Municipality budget pages and decisions, capital-programme reporting, and local media. It extracts candidate project and budget records and stores them in `data/curated` with links to the sources used.

Citizen reports are submitted through `/fix-map/report`. Historical photos, memories, source leads and corrections are submitted through `/history/contribute`. A submitted item is stored with `moderation_status: "needs_review"` and is not public until a moderator approves it.

## Cleaning

Data must pass JSON schema validation before it can be copied into `apps/web/public/data`. Validation checks required fields, status values, source URLs, money amounts, coordinates, unique IDs, and forbidden private fields.

Citizen report and history contribution submissions are validated at the API boundary. The API checks submission kind, category, title length, description length, Plovdiv coordinate bounds, optional source URL format, required privacy confirmations, rate limits, and text that looks like email or phone data.

## Moderation

Moderators use `/admin/reports` with a bearer token. They can approve, reject, edit report text/category/location, hide unsafe photos, and update a public status such as `unverified`, `verified`, `sent_to_municipality`, `in_progress`, `fixed`, or `closed`.

Approved fix-map citizen reports are available through `/api/reports/public`, `/api/reports/stream`, and the exported snapshot at `/data/community-fix-reports.json`. Historical contributions use the same moderation queue but are excluded from the public Fix Map feed until an editor turns them into sourced history/archive records.

## Photos

Photos are optional. Uploaded images are limited to 5 MB each, converted to WebP, and re-encoded without EXIF/GPS metadata. Pending photos are stored outside the public directory and are copied to public storage only after moderation approval.

## AI Use

AI performs the source search, extraction, summarisation and verification workflow for project and budget data. Public sources remain visible because AI can still make mistakes. When a source does not publish an amount, status or completion record, the site should show that as missing or provisional data instead of inventing a value.

## Corrections

Corrections to citizen reports should be made in `/admin/reports`, where they are audited and pushed to the live report stream. Corrections to project or budget records should cite a public source where possible, update the curated JSON record, add or replace the relevant source URL, run automated validation, and rebuild the static site.

## What This Site Does Not Claim

Open Plovdiv does not score corruption, rank political parties, identify wrongdoing, or publish private personal data. It presents public records and clearly marked summaries.
