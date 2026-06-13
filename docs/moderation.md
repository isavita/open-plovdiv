# Moderation

Open Plovdiv accepts citizen reports through `/fix-map/report`, but no report is published immediately. New submissions enter the admin queue as `needs_review`.

The moderation process covers:

- rejecting personal data
- hiding or rejecting photos with faces, children, car plates, documents, private interiors, or personal information
- removing insults, accusations, and political campaigning
- checking whether a report describes a public-space issue
- labeling unverified reports clearly
- documenting how people can request corrections

Moderation decisions should be conservative. The project should publish verifiable civic information, not unsupported allegations.

## Admin Actions

Moderators can:

- approve and publish a report
- reject a report with an optional reason
- choose the public status shown on the map
- update a published report status
- hide unsafe photos before or after publishing

Approved citizen reports are displayed on the Fix Map and exported to `/data/community-fix-reports.json`.
