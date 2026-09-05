# The Rotting feature (Pipedrive Knowledge Base)

- **Title:** The Rotting feature
- **URL:** https://support.pipedrive.com/en/article/the-rotting-feature
- **Fetched:** 2026-08-17
- **Source type:** official-docs (Pipedrive Inc / Pipedrive OU, product documentation)
- **Page last updated (as stated on page):** May 12, 2026

## Why this source

This is the only shipped, documented, per-stage staleness mechanic found in the archive.
It is the direct product precedent for a going-cold list keyed to stage rather than to a
single global threshold.

## Extracted content

**What it is, quoted:**

"The Rotting feature provides visibility into deals that have been idle for too long."

Once configured, the pipeline visually flags deals that have not been updated beyond a
specified timeframe.

**How it is configured:**

Rotting periods are set INDIVIDUALLY PER PIPELINE STAGE. The user opens the pipeline edit
control, toggles on "Rotting in (days)", and specifies an inactive-day threshold for each
stage where the alert should apply. Stages can carry different thresholds, and a stage can
opt out entirely.

**What resets the rotting timer:**

- "Marking activities as done"
- "Adding notes and files to a deal"
- Email interactions: sending, receiving, unlinking, deleting

The page notes that some email operations reset the timer even when they are not visible
to the current user for permissions reasons.

**Recommended default:** none. The documentation states that an appropriate timeframe
depends on the company's own workflow and on whether activities are scheduled far in
advance.

## Claims this source supports

1. Per-stage staleness thresholds are established product practice, not an invention. A
   going-cold list that varies the threshold by stage matches how a mainstream CRM does it.
2. The reset event is any recorded TOUCH, including a note or an inbound email, not only
   an outbound contact.
3. No vendor publishes a recommended default day count. Any specific number a skill uses
   is a starting point the user must tune, and must be labelled as such.
