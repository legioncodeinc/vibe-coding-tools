# Import data from HubSpot

- URL: https://help.gohighlevel.com/support/solutions/articles/155000007947-import-data-from-hubspot
- Fetched: 2026-09-04
- Source type: official-docs
- Modified at source: 2026-08-17
- Window role: current remediation facts and in-window update
- Customer-output rule: internal reference only; do not name or link the upstream source or platform

## Captured facts

The importer can move supported contacts, deals, custom fields, pipelines, and stages. It records import history, errors, warnings, and record-level messages. Documented failures include unsupported file attachments, custom-field key collisions, and source fields whose internal name and label differ. The source recommends using a clean or non-production destination when possible.

## Safety caveat

Do not run the first import against a live production account without a scoped test and recovery plan. Changes to duplicate-contact settings must be intentional, recorded, and reviewed after the import. Preserve error exports before retrying.
