# Methodology

Open Plovdiv separates three things:

- facts copied from public documents
- plain-language editorial summaries
- AI-assisted extraction and comparison that stays tied to visible sources

## Source research

Research starts with public sources such as Plovdiv Municipality pages and decisions, official registers, archives, museums, open-license media collections and local reporting. Candidate records are reviewed and stored in `data/curated` with their source URLs and access dates.

Community initiatives use the same editorial model. They are curated from public evidence and presented as a read-only directory. Open Plovdiv does not accept complaints, historical contributions or proposals for new initiatives through the website.

## Validation

Data must pass JSON schema validation before it can be copied into `apps/web/public/data`. Checks cover required fields, known status values, source URLs, money amounts, coordinates, unique IDs and forbidden private fields. Generated history exports also retain provenance and editorial-review markers.

## AI use

AI assists with source discovery, extraction, summarisation and consistency checks. Public sources remain visible because AI can be wrong. When a source does not publish an amount, status or completion record, the site must show that information as missing or provisional instead of inventing it.

## Editorial corrections

Corrections are made in the curated source files. A correction should add or update a public source where possible, preserve IDs and official names, pass automated validation and pass the production build before publication.

## What this site does not claim

Open Plovdiv does not score corruption, rank political parties, identify wrongdoing, accept reports on city problems or publish private personal data. It presents public records and clearly marked summaries.
