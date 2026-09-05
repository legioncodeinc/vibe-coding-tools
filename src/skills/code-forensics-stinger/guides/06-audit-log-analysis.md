# Phase 5 — WordPress Audit Log Analysis

## Goal
If the client's WordPress site has the WPMU DEV Defender Pro plugin (or similar audit-log plugin) installed, the audit log export becomes the second-most-powerful evidence artifact (after the git log). It shows exactly when plugin/theme updates were made and who made them.

## Source

Defender Pro / WPMU DEV exports as a CSV named like `wdf-audit-logs-export-{TIMESTAMP}.csv` with columns:
- `Summary`
- `Date / Time`
- `Context` (`ct_plugin`, `ct_theme`, `Page`, `Section`, etc.)
- `Type` (`upgraded`, `activated`, `deactivated`, `updated`)
- `IP address`
- `User`

The Example Booking Co. audit log only captured the most recent 38 events (covering Dec 16, 2025 to May 2, 2026). For other clients the export may go further back — request the full historical export if available.

## Methodology

### Step 1: Read and classify each event

For each row in the CSV, classify the actor:
- **Human ADA employee** (`dianareeves`, `Greg Sutton`, `tomallen`, etc.) doing **content edits** (Pages, Sections, Elements) — these are NOT maintenance
- **Human ADA employee** doing **plugin/theme updates** (`ct_plugin` upgraded, `ct_theme` upgraded) — these ARE maintenance
- **Client user** (the legitimate site owner) — note for the timeline
- **"Hub" automated tool** (typically IP `18.204.159.253` from AWS) — these are AUTOMATED updates, NOT maintenance performed by ADA

### Step 2: Identify the maintenance gap

Look for periods of consecutive days with NO `ct_plugin` or `ct_theme` upgraded events by a human ADA employee. In Example Booking Co.:

> "Between December 16, 2025 and May 2, 2026 — 138 calendar days — there were ZERO plugin updates performed by any ADA employee. The only updates during that 138-day window came from 'Hub' — an automated WPMU DEV / Defender Pro tool — on December 29, 2025 (Post SMTP only) and April 2, 2026 (two All-in-One WP Migration plugins only). These are automated updates, not human-driven maintenance."

This is the kind of specific, dated, evidence-backed claim that makes the ADA report bulletproof.

### Step 3: Build the activity timeline table

The ADA report Section 2.1 contains a chronological table of every audit-log event with a "Significance" column. Reproduce this for the new case:

| Date / Time | User | Action | Significance |
|---|---|---|---|
| 2025-12-16 10:38–10:40am | dianareeves | Edited "Reporting and Analytics" page + form element | CONTENT change, not maintenance |
| 2025-12-29 1:47pm | Hub (18.204.159.253) | Auto-updated Post SMTP to 3.7.0 | AUTOMATED, no human |
| ...3 months of NO ACTIVITY... | | | Site fully unmaintained |
| 2026-04-02 8:09–8:11am | Hub (automated) | All-in-One WP Migration plugins | AUTOMATED, no human |
| 2026-04-29 | dianareeves, Greg Sutton | Content edits to Header / Footer | CONTENT, not maintenance |
| 2026-05-02 11:34–11:41am | sarahbennett (CLIENT) | Updated 10 plugins + Avada 7.12.1 → 7.15.2 | CLIENT did all the real maintenance |

### Step 4: Capture the May-2 update list

When the client (typically) finally gets fed up and updates everything herself, the audit log captures that as a single rapid session. The list of plugins/theme updated in that session is the de facto inventory of "what was out of date." Document it:

For Example Booking Co.:
- Avada theme: 7.12.1 → 7.15.2
- Avada Core: 5.12.1 → 5.15.2
- Avada Builder: → 3.15.2
- WPCode Lite: → 2.3.5
- Post SMTP: → 3.9.1
- Smush Pro: → 4.0.3
- SmartCrawl Pro: → 3.15.0
- Disable Comments: → 2.7.0
- Defender Pro: → 5.11.0
- All-in-One WP Migration: → 7.105

Each one of these "updated to" versions is the version current AT THE TIME the client performed the update. Cross-reference against Phase 4 CVE research to identify which CVEs were resolved by this client-led emergency update.

## Critical interpretation point

A ADA defense will likely be: "The site was being auto-updated by WordPress core's automatic update mechanism." This is partly true for WordPress core minor releases. It is NOT true for:
- Theme updates (must be manually triggered for premium themes like Avada)
- Major plugin version bumps
- Security-only plugin patches that aren't enabled for auto-update

The Defender "Hub" tool may auto-update plugins it manages, but only for plugins specifically configured for auto-update. The audit log will show which were and weren't.

In the Example Booking Co. case, only TWO plugins were auto-managed by Hub during the 138-day gap: Post SMTP and All-in-One WP Migration. Every other plugin and the Avada theme remained unpatched until the client did it herself.

## Update `case-facts.json`

```json
{
  "wp_audit_log": {
    "log_export_window": ["2025-12-16", "2026-05-02"],
    "longest_gap_between_ada_updates_days": 138,
    "automated_updates_during_gap": [
      {"date": "2025-12-29", "plugin": "Post SMTP", "tool": "Hub"},
      {"date": "2026-04-02", "plugin": "All-in-One WP Migration", "tool": "Hub"}
    ],
    "client_emergency_update_date": "2026-05-02",
    "plugins_updated_by_client_on_termination": [...]
  }
}
```

## Output checklist

- [ ] Every row of the audit log CSV is classified (ADA-human / ADA-automated / Client / Other)
- [ ] The longest gap between ADA-human plugin/theme updates is identified
- [ ] Automated "Hub" updates are listed separately and NOT counted as ADA maintenance
- [ ] The client's emergency update session (if any) is captured with its full plugin list
- [ ] At least one CVE from Phase 4 is mapped to "fixed by client emergency update on date X"

## When the audit log isn't available

If the client doesn't have Defender Pro installed:
- Check the Wordfence audit log (similar plugin) or other security plugin
- Ask if Cloudflare logs are available (won't show plugin updates but may show admin login frequency)
- Ask the client to take a screenshot of WordPress Dashboard → Updates page if any pending updates exist
- As a fallback, the dependency lockfile of the WordPress install (`wp-content/plugins/*/readme.txt` files contain version numbers) can be inspected if you can SSH or FTP to the server

Document the limitation in the master report. The git log alone is enough for a maintenance-fraud claim against DevPipe even without the WordPress audit log.
