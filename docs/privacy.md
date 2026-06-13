# Privacy

Open Plovdiv is designed to work without collecting personal data.

## MVP Rules

- no user accounts
- no public comments
- no voting profiles
- no names, emails, phone numbers, raw IP addresses, or account IDs in public reports
- no exact private addresses for citizen-submitted issues
- no photos containing faces, children, car plates, or private interiors without moderation

## Data Stored

The first version stores public project records, budget items, source links, and seed fix reports in JSON files. Citizen reports are stored separately as dynamic report metadata in Redis when configured, or in a local development file store.

Citizen report submissions collect category, title, description, approximate map coordinates, optional photos, and two privacy confirmations. They do not collect name, email, phone, or account details. Rate limiting uses a temporary salted hash of the requester IP rather than storing the raw IP.

## Photos

Uploaded photos are re-encoded to WebP, which strips EXIF/GPS metadata. Pending photos are kept outside public storage. Photos become public only when a moderator approves the report and has not hidden the photo.
