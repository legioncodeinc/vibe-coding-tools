---
name: "fb-group-intel-stinger"
description: "Extract Facebook group intelligence at scale: descriptions, name-change history, activity, admin rosters, and admin about-page data via Oxylabs Headless Browser with a persistent logged-in persona. Use for wiener-gate group investigations."
license: MIT
compatibility: "Manus, Claude Code 2.1 or newer, Cursor 2.4 or newer, Codex, Cowork. Python 3.9+ with playwright."
metadata:
  hive-bee: "none"
  domain: "osint-extraction"
  pair-bee: "none"
---

# fb-group-intel-stinger

## Purpose

This stinger collects structured intelligence from Facebook groups at scale: group descriptions, group history (creation and name-change dates, the key signal for detecting renamed/repurposed groups), activity stats, privacy status, member counts, and full admin rosters (page-or-user type, profile picture URL, profile ID link, location). It then harvests each admin's visible about-page data. It exists to answer questions like "did this network of groups change names, when, and who runs them" across hundreds of groups without manual clicking.

## When to use

- "Extract descriptions, history, and admins for these Facebook groups."
- "Which of these groups changed their name and when?"
- "Harvest the about-page data for every admin of these groups."
- "Run the wiener-gate collection against new search verticals (german shepherd, spacex)."

## When not to use

- One-off lookups of a single group: just browse it directly.
- Post-level content collection: this stinger deliberately does not collect posts.
- Unauthenticated scraping: Facebook login walls make it unreliable; this stinger assumes an authenticated persona.

## Procedure

1. Read `references/REFERENCE.md` for connection parameters, URL patterns, and schemas.
2. Connect per `guides/01-connect-oxylabs.md`. Validate the Ohio exit IP and the logged-in persona before any extraction. If persistent profiles are not activated on the Oxylabs account, fall back to a 24h sticky session.
3. Run the group pass per `guides/02-extract-groups.md`, using `scripts/fb_group_extract.py` as the starting implementation. Process groups in descending member-count order, checkpoint every 10 groups to JSONL.
4. Run the admin pass per `guides/03-extract-admins.md`. Dedupe admins by profile_id first. Only request about sub-sections visible in each profile's navigation.
5. Optionally run the image pass per `guides/04-image-pass.md` (unauthenticated CDN GETs, never through the persona session).
6. Analyze per `guides/05-analysis.md`: name-change flags and timelines, admin network tables, ranked CSVs plus a markdown report.
7. If the target fingerprints the automation channel (CDP/Playwright detection) or the operator requires fully hands-off accessibility, switch to the OS-level input rig per `guides/06-os-input-rig.md` instead of the Oxylabs headless browser.
8. Automate logins, 2FA, and passkeys per `guides/07-auth-automation.md` (Proton Pass CLI for passwords/TOTP, Proton Mail Bridge for email codes) so the operator is never asked for a code.

## Hard rules

- Never store Facebook credentials in the repo or scripts; the persona logs in interactively.
- Never bulk-download images through the authenticated session.
- Stop the run on any checkpoint, CAPTCHA loop, or login redirect; re-validate before resuming.
- Never hit an about sub-section a profile does not visibly offer.
- Member counts are Facebook's rounded display values; report them as display-precision.

## References map

- `references/REFERENCE.md`, load when: you need connection parameters, URL patterns, or JSONL schemas.
- `references/research/distilled-fb-group-intel.md`, load when: a design decision needs justification or a dispute needs settling.
- `references/research/raw/`, load when: tracing a claim to its primary source (Oxylabs docs, empirical HAR findings).
- `scripts/fb_group_extract.py`, load/run when: running or adapting the group extraction pass.
- `examples/example-group-record.json`, load when: you need the target output shape.

## Related bees and stingers

- None registered yet; this is the first wiener-gate investigation stinger.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [queen-bee-stinger](../queen-bee-stinger) - Forge for new Hive components; consult before modifying this stinger's structure.

<!-- Ship Gate removed: research-only stinger, produces no committable code beyond its own scripts. -->
