# Open Plovdiv — Real-Time Citizen Reports Plan

This plan extends the existing static Open Plovdiv website with citizen report submissions, moderation, and near-real-time updates for the Fix Map.

The current static foundation should remain intact. Official public data should continue to live in versioned JSON files. The dynamic layer should be used only for citizen-submitted reports, moderation state, image handling, and live map updates.

---

## 1. Recommended model

```text
Citizen submits report
        ↓
Report goes to moderation queue
        ↓
Moderator approves / rejects / edits
        ↓
Approved report appears on Fix Map
        ↓
Map updates live or near-live
```

Do not publish citizen reports immediately. For civic-transparency projects, moderation and trust are more important than instant visibility.

---

## 2. Report lifecycle

Use separate internal and public statuses.

### Internal moderation statuses

```text
submitted
needs_review
approved
rejected
published
```

### Public report statuses

```text
unverified
verified
sent_to_municipality
in_progress
fixed
closed
```

Example report status fields:

```json
{
  "id": "fix-plovdiv-2026-000001",
  "public_status": "unverified",
  "moderation_status": "needs_review"
}
```

### Checklist

- [x] Add internal moderation statuses.
- [x] Add public report statuses.
- [x] Do not publish reports immediately.
- [x] Add clear status explanations on the Fix Map page.

### Done when

- [x] A submitted report is invisible until approved.
- [x] Approved reports appear on the map.
- [x] Rejected reports never become public.

---

## 3. Add minimal backend API

The Astro site can remain mostly static, but report submission requires a small dynamic API layer.

### Recommended simple deployment

```text
Cloudflare Pages + Cloudflare Functions + Upstash Redis + Cloudflare R2
```

### Alternative

```text
Vercel + Serverless Functions + Upstash Redis + S3/R2
```

Use Redis for report metadata and moderation state. Use object storage for images. Do not store images directly in Redis.

### API endpoints

```text
POST /api/reports
GET  /api/reports/public
GET  /api/reports/stream

GET  /api/admin/reports/pending
POST /api/admin/reports/:id/approve
POST /api/admin/reports/:id/reject
POST /api/admin/reports/:id/update-status
```

### Checklist

- [x] Add `/api/reports` submission endpoint.
- [x] Add `/api/reports/public` endpoint for approved reports.
- [x] Add admin-only moderation endpoints.
- [x] Add validation on every endpoint.
- [x] Add rate limiting.

### Done when

- [x] Users can submit reports.
- [x] Public map can fetch approved reports.
- [x] Admin can approve/reject reports.
- [x] Invalid or spammy submissions are rejected.

---

## 4. Redis data structure

Use Redis as a dynamic store only.

### Suggested keys

```text
report:{id}                 -> report JSON
reports:pending             -> sorted set of pending report IDs
reports:approved            -> sorted set of approved report IDs
reports:by-category:{cat}   -> set of report IDs
reports:by-status:{status}  -> set of report IDs
reports:events              -> pub/sub channel or stream
rate-limit:{ip_hash}        -> temporary rate limit key
```

### Example report

```json
{
  "id": "fix-plovdiv-2026-000001",
  "title_bg": "Счупена настилка",
  "description_bg": "Повредена настилка до автобусна спирка.",
  "category": "pavement",
  "public_status": "unverified",
  "moderation_status": "needs_review",
  "location": {
    "lat": 42.1354,
    "lng": 24.7453
  },
  "photo_urls": [
    "https://..."
  ],
  "source": "citizen_submission",
  "created_at": "2026-06-13T12:00:00Z",
  "updated_at": "2026-06-13T12:00:00Z"
}
```

### Do not store

- name
- email
- phone
- exact home address
- raw IP address

For rate limiting, store only a temporary IP hash.

### Checklist

- [x] Store report JSON in Redis.
- [x] Store image files in R2/S3.
- [x] Keep pending and approved indexes.
- [x] Publish update event when report is approved.
- [x] Add export script from Redis to JSON.

### Done when

- [x] Redis contains only report metadata.
- [x] Images are stored outside Redis.
- [x] Public approved reports can be exported to JSON.

---

## 5. Add report submission form

Path:

```text
/fix-map/report
```

### Fields

```text
category
title
description
location
photo upload
confirm no private/personal data
confirm report is public-interest issue
```

Do not ask for email in the MVP.

### Categories

```text
roads
pavement
street_lighting
parks
waste
public_transport
accessibility
drainage
other
```

### Checklist

- [x] Add report form page.
- [x] Add category selector.
- [x] Add map location picker.
- [x] Add photo upload.
- [x] Add privacy warning.
- [x] Add submit confirmation page.
- [x] Tell user the report will be reviewed before publishing.

### Done when

- [x] User can submit a report without login.
- [x] Form does not collect personal contact details.
- [x] User understands the report is not published immediately.

---

## 6. Photo safety

Photos are the biggest privacy and moderation risk.

Before storing or publishing:

- strip EXIF metadata
- remove GPS metadata from image files
- reject very large files
- convert to a safe format such as WebP or JPEG
- generate thumbnail
- manually review photos before publishing
- reject photos with faces, children, car plates, private homes, documents, or personal information

### Checklist

- [x] Strip EXIF from uploaded images.
- [x] Limit file size, for example 5 MB.
- [x] Convert image to WebP/JPEG.
- [x] Store original only if necessary; otherwise store processed image.
- [x] Add moderation warning for sensitive content.
- [x] Do not publish unreviewed photos.

### Done when

- [x] Uploaded image metadata is removed.
- [x] Photos are not public before moderation.
- [x] Sensitive photos can be rejected.

---

## 7. Moderation dashboard

Path:

```text
/admin/reports
```

Protect it with one admin password, Cloudflare Access, or another simple admin-only mechanism.

### Admin actions

- approve report
- reject report
- edit title/description
- change category
- change public status
- hide photo
- publish
- mark fixed

### Checklist

- [x] Add protected admin route.
- [x] Show pending reports.
- [x] Add report preview.
- [x] Add approve/reject buttons.
- [x] Add status editor.
- [x] Add image preview.
- [x] Add audit log entry for moderation action.

### Done when

- [x] Admin can review new reports.
- [x] Admin can publish only safe reports.
- [x] Admin can remove unsafe content.

---

## 8. Real-time map updates

There are three levels of real-time functionality.

### Option A — polling

The map calls:

```text
/api/reports/public
```

every 30–60 seconds.

This is the best MVP option.

Pros:

- simple
- reliable
- works everywhere

Cons:

- not instant

### Option B — Server-Sent Events

Use:

```text
/api/reports/stream
```

When a report is approved, the map receives an event and refreshes.

Pros:

- feels real-time
- simpler than WebSockets

Cons:

- needs backend support

### Option C — WebSocket

Only use later if real bidirectional communication is needed.

### Recommendation

```text
Start with polling. Add SSE later.
```

### Checklist

- [x] First implement polling every 30 seconds.
- [x] Add “last updated” timestamp on Fix Map.
- [x] Refresh markers without full page reload.
- [x] Later add SSE for approved-report events.

### Done when

- [x] Newly approved reports appear on the map without redeploying the site.
- [x] User does not need to refresh manually.

---

## 9. Keep static JSON export

Even after adding Redis, keep a public export path.

Add script:

```text
scripts/export/export_approved_reports.mjs
```

It should generate:

```text
apps/web/public/data/community-fix-reports.json
```

This provides a backup and keeps the project transparent.

### Checklist

- [x] Export approved Redis reports to JSON.
- [x] Add timestamp to exported file.
- [ ] Optionally commit/export this file daily.
- [x] Keep curated official data separate from citizen reports.

### Done when

- [x] The site can still be rebuilt from exported public data.
- [x] Approved citizen reports are portable.
- [x] Redis is not the only copy of public data.

---

## 10. Suggested folder additions

```text
apps/web/src/pages/fix-map/report.astro
apps/web/src/pages/admin/reports.astro

apps/web/src/pages/api/reports.ts
apps/web/src/pages/api/reports/public.ts
apps/web/src/pages/api/reports/stream.ts
apps/web/src/pages/api/admin/reports/pending.ts
apps/web/src/pages/api/admin/reports/[id]/approve.ts
apps/web/src/pages/api/admin/reports/[id]/reject.ts

apps/web/src/lib/server/redis.ts
apps/web/src/lib/server/reportStore.ts
apps/web/src/lib/server/imageUpload.ts
apps/web/src/lib/server/rateLimit.ts
apps/web/src/lib/server/moderation.ts

scripts/export/export_approved_reports.mjs
```

If Astro API routes become awkward for deployment, move API code to:

```text
apps/api/
```

For MVP, keeping the API inside `apps/web` is acceptable.

---

# Implementation milestones

## Milestone 1 — Submission without photos

Goal: allow text + location reports.

- [x] Add report form.
- [x] Add `POST /api/reports`.
- [x] Store pending report in Redis.
- [x] Add basic rate limiting.
- [x] Add moderation dashboard.
- [x] Approve/reject text reports.
- [x] Show approved reports on Fix Map.

### Done when

- [x] A user can submit a report.
- [x] Admin can approve it.
- [x] It appears on the map.

---

## Milestone 2 — Photo upload

- [x] Add image upload.
- [x] Store images in R2/S3.
- [x] Strip metadata.
- [x] Create thumbnail.
- [x] Add image preview in admin dashboard.
- [x] Publish only approved images.

### Done when

- [x] Reports can include photos.
- [x] No unmoderated image becomes public.

---

## Milestone 3 — Near-real-time map

- [x] Add polling every 30 seconds.
- [x] Add last-updated timestamp.
- [x] Add visual indicator when new reports load.
- [x] Optional: add SSE later.

### Done when

- [x] New approved reports appear without rebuild.
- [x] The map feels live enough for public use.

---

## Milestone 4 — Export and transparency

- [x] Export approved reports from Redis to JSON.
- [x] Add public download link.
- [x] Add report source type: `citizen_submission`.
- [x] Document moderation process.
- [x] Document privacy process.

### Done when

- [x] Approved public reports are downloadable.
- [x] Methodology explains how reports are handled.

---

# First agent task for this phase

```text
Add citizen report submissions to Open Plovdiv.

Keep the existing static Astro site. Add a minimal dynamic layer using Redis for report metadata and object storage for photos. Do not add user accounts. Do not collect names, emails, or phone numbers. Implement report submission, pending moderation, admin approval/rejection, and display of approved reports on the Fix Map. Start without photos if necessary, then add photo upload as a second milestone. New reports must not be public until approved.
```

## Completion criteria

- [x] `/fix-map/report` exists.
- [x] User can submit category, title, description, and location.
- [x] Submission is stored as `needs_review`.
- [x] Admin dashboard shows pending reports.
- [x] Admin can approve or reject reports.
- [x] Approved reports appear on Fix Map.
- [x] No user accounts are added.
- [x] No name/email/phone is collected.
- [x] Redis is used only for dynamic reports.
- [x] Existing static official data still works.
- [x] Build still works.

Status note: the realtime citizen-report phase is implemented. The only unchecked
item is optional daily automation for committing/exporting the JSON snapshot; the
manual export command exists as `make export-reports` / `npm run export:reports`.

---

## Recommended implementation order

1. Implement report submission without photos.
2. Implement moderation dashboard.
3. Display approved reports on Fix Map through polling.
4. Add photo upload with metadata stripping and manual review.
5. Add JSON export of approved reports.
6. Add SSE later only if polling is not enough.

The best first version is submission + moderation + polling. Avoid accounts, comments, voting, WebSockets, and automatic publishing until the civic-trust model is stable.
