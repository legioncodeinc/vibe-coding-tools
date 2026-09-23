---
name: "social-presence-stinger"
description: "Facebook/LinkedIn/Instagram presence audit via the harness's own browser tooling, opt-in auth per platform; decline or unavailable auth is a silent no-op, never a score penalty."
license: AGPL-3.0-or-later
compatibility: "Claude Code, Cursor, ChatGPT Codex, Claude Cowork."
metadata:
  hive-tier: stinger
  hive-drone: social-presence-wasp-drone
  research-window: "2026-08-18 (round 2 sweep and round 3 deeper pass)"
  primary-surface: external-website-audit
---

# Social Presence Stinger

> **Forge status:** stages 1-6 complete (Topic, Research, Distillation, References, Guides, final Skill/Drone authorship). Stage 7 (registration/validation sweep) has not run yet.

You are equipping **social-presence-wasp-drone**, part of the Website Auditor by Legion Code Inc. plugin. Full scope and acceptance criteria: [prd-017-social-presence](../../library/requirements/backlog/prd-017-social-presence/prd-017-social-presence-index.md).

## Purpose

Locate the target site's Facebook, LinkedIn, and Instagram presence, and produce a scored, evidenced `10-social/social-report.md`. Public-facing profile and content data (bio, links, pinned post, visible post history, cadence) is collected without any login, for every found platform. For data that only exists behind a platform's own logged-in analytics (follower growth rate, reach trend, impressions-vs-reach ratio, audience demographics), this Drone uses the harness's own browser tooling to explicitly prompt the user, per platform, whether they want to authenticate. **Declining, or the harness lacking browser-authentication capability, is a silent no-op: that platform's gated checks are excluded from the score entirely and are never treated as a negative finding.** This is a binding, non-negotiable conduct rule (build plan Q7, PRD-017), not a scoring nuance to be traded off against completeness.

## When to use this skill

- Wave W5 of every audit run, independent of `site-data/`, reading `02-positioning/` for any on-site social links
- Any request specifically about a brand's Facebook/LinkedIn/Instagram presence, completeness, or posting cadence
- A user explicitly opting into authenticated social-platform data collection for one run, one platform at a time

## When not to use

- Platforms outside Facebook/LinkedIn/Instagram (Threads, Bluesky, TikTok, X): out of scope for this pair per PRD-017's stated platform list
- Analytics tooling audits (pixel/tag census, de-anonymization detection): owned by `analytics-stack-stinger`
- Blog/content depth audits: owned by `blog-content-stinger`
- Authenticating to a platform without a fresh, per-platform, per-run opt-in, ever, even if a prior run's decision was "yes"

## Procedure

1. **Discover and inventory accounts.** Read `02-positioning/` for on-site links, then search each platform for the brand name directly. Record each platform as found-active, found-dormant, or not-found; these are three different outcomes for scoring purposes. `guides/01-discover-social-links-and-inventory-accounts.md`.
2. **Collect public-profile data.** For every found platform (active or dormant), collect whatever an unauthenticated browser view shows: profile/branding fields, bio, links, pinned post, visible post history. Run this regardless of the authentication decision in step 3. `guides/02-collect-public-profile-data.md`.
3. **Run the opt-in authentication flow, with silent no-op on decline.** Per platform where gated data exists, confirm harness capability, prompt the user, and if they decline or the harness can't authenticate, silently exclude those checks from scoring, never penalize. This is the binding conduct rule this Drone exists to implement. `guides/03-opt-in-auth-with-silent-no-op-on-decline.md`, `references/templates/auth-opt-in-prompt-script.md`.
4. **Run the content sweep and completeness check.** 7-day post sweep, cadence against general benchmarks, voice consistency (subjective), and per-platform completeness accounting for each platform's own visibility mechanics. `guides/04-run-content-sweep-and-completeness-check.md`.
5. **Score and evidence findings.** Zero-to-six scale, the two distinct N/A triggers (not-found vs. declined-auth) never blurred together, `[subjective]` calls kept separate. `guides/05-score-and-evidence-findings.md`.
6. **Write the social presence report.** Assemble `10-social/social-report.md`, lead with the platforms-found table, state declines/unavailability in neutral language, update the run ledger and evidence index, hand off to `audit-scoring-wasp-drone`. `guides/06-write-social-report.md`, `references/templates/social-report-template.md`.

## References map

- `references/research/distilled-social-presence.md`, load when a domain claim (what's public per platform, completeness signals) needs verification or a dispute needs settling; every claim there cites its `raw/` source
- `references/research/raw/`, load when tracing a distilled claim back to its primary source (Meta's own Help Center, LinkedIn's own Help Center, or a vendor audit-methodology source)
- `references/templates/platform-profile-checklist.md`, load per platform during discovery and public-data collection
- `references/templates/auth-opt-in-prompt-script.md`, load before prompting the user for any platform's authentication decision
- `references/templates/social-report-template.md`, load when assembling the final `10-social/social-report.md`
- `references/scripts/README.md`, states why this pair has no dedicated deterministic script, load if unsure whether one is expected

## Related drones and stingers

- [social-presence-wasp-drone](../../agents/social-presence-wasp-drone.md) - this Stinger's paired Drone
- [icp-positioning-stinger](../icp-positioning-stinger) - produces the on-site social links this Stinger's discovery step consumes from `02-positioning/`
- [analytics-stack-stinger](../analytics-stack-stinger) - owns pixel/tag census and de-anonymization detection; not this pair's job even though both touch third-party platform surfaces
- [audit-scoring-stinger](../audit-scoring-stinger) - consumes this Stinger's scored, evidenced `10-social/social-report.md`

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [social-presence-wasp-drone](../../agents/social-presence-wasp-drone.md) - this Stinger's paired Drone.

## Ship Gate decision

Ship Gate removed: research-only stinger. This pair assesses a live third-party website and its public/authenticated social profiles from the outside, with no source access and no deploy rights; its output is a scored report written to the audit workspace (`10-social/`), never a code change committed to this repository. The security/quality/repo-health close-out sequence has nothing to gate here.
