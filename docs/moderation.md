# Moderation

Open Plovdiv accepts citizen reports through `/fix-map/report` and historical photo/memory contributions through `/history/contribute`, but no submission is published immediately. New submissions enter the admin queue as `needs_review`.

The moderation process covers:

- rejecting personal data
- hiding or rejecting photos with faces, children, car plates, documents, private interiors, or personal information
- removing insults, accusations, and political campaigning
- checking whether a report describes a public-space issue or a historically useful contribution
- checking whether historical photos/memories have enough source context, provenance notes or archive links before publication
- labeling unverified reports clearly
- documenting how people can request corrections

Moderation decisions should be conservative. The project should publish verifiable civic information, not unsupported allegations.

## Admin Actions

Moderators can:

- approve and publish a report
- reject a report with an optional reason
- edit report title, description, category, coordinates, and optional address
- choose the public status shown on the map
- update a published report status
- hide unsafe photos before or after publishing

Approved fix-map citizen reports are displayed on the Fix Map and exported to `/data/community-fix-reports.json`. Historical contributions share the moderation queue, but are kept out of the public Fix Map feed until they can be turned into sourced history/archive records.
