# Methodology

Open Plovdiv separates three things:

- source facts copied from public documents
- plain-language summaries written for readability
- manual or AI-assisted interpretation that must be reviewed before publication

## Collection

The MVP is manual-first. Editors add records to `data/curated` and keep original public files in `data/raw` when available.

## Cleaning

Data must pass JSON schema validation before it can be copied into `apps/web/public/data`. Validation checks required fields, status values, source URLs, money amounts, coordinates, unique IDs, and forbidden private fields.

## AI Use

AI may later draft summaries, categories, or location candidates. AI output is not a source of truth. It must be marked as draft or reviewed, and it must not invent facts.

## Corrections

Corrections should cite a public source where possible. The preferred workflow is to update the curated JSON record, add or replace the relevant source URL, run validation, and rebuild the static site.

## What This Site Does Not Claim

Open Plovdiv does not score corruption, rank political parties, identify wrongdoing, or publish private personal data. It presents public records and clearly marked summaries.
