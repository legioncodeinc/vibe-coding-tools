# 10-social/ report template

Copy this structure into the run's `10-social/social-report.md`. Follows the plugin's zero-to-six scoring scale and N/A-exclusion rule (build plan section 4.1).

```markdown
# Social presence report: {domain}

Run date: {date}.

## Platforms found

| Platform | Status | Authenticated this run? | Notes |
|---|---|---|---|
| Facebook | {found, active \| found, dormant \| not found} | {yes \| declined \| unavailable \| n/a, not found} | |
| LinkedIn | {...} | {...} | |
| Instagram | {...} | {...} | |

Not-found platforms are excluded from scoring entirely, a no-op, not a failure [build plan Q7]. Found-but-dormant platforms ARE scored; an empty or abandoned profile is itself a finding, not a no-op [build plan Q7].

## Public-data findings (no authentication required)

{Per-platform checklist results from references/templates/platform-profile-checklist.md, scored 0-6 with evidence pointers.}

| Platform | Sub-check | Score (0-6) | Evidence pointer | Justification |
|---|---|---|---|---|
| {platform} | Profile/branding completeness | {0-6} | {captured page / screenshot path} | {one line} |
| {platform} | Bio and link quality | {0-6} | {pointer} | {one line} |
| {platform} | Pinned post relevance | {0-6} | {pointer} | {one line} |
| {platform} | Content mix / posting cadence (public view) | {0-6} | {pointer} | {one line} |
| ... | ... | ... | ... | ... |

## Authenticated-data findings (only for platforms where the user opted in)

{If a platform's authentication was declined or unavailable, this section has no row for that platform's gated checks. Do not write a "0 (N/A)" placeholder row and then treat it as scored; per the N/A rule those checks are excluded from both numerator and denominator, not scored at all.}

| Platform | Sub-check | Score (0-6) | Evidence pointer | Justification |
|---|---|---|---|---|
| {platform} | Follower growth rate (90-day) | {0-6} | {pointer} | {one line} |
| {platform} | Reach trend (90-day) | {0-6} | {pointer} | {one line} |
| {platform} | Impressions-vs-reach ratio | {0-6} | {pointer} | {one line} |

## Declined or unavailable authentication (informational, not a finding)

{List each platform where the user declined the prompt, or the harness lacked browser-authentication capability. State plainly that these are excluded from scoring, per PRD-017 AC-2, and are not to be read as a gap in the site's own social presence.}

## Subjective findings

{Findings labelled [subjective], kept separate from the quantified table above, per conduct rule 3.}

## Verification log

{Any candidate finding rejected or reframed during this audit, with the reason, per conduct rule 4.}
```
