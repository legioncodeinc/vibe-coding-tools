# Guide 05: Score and evidence findings

## What this guide covers

Turning discovery, public-data, and (where opted in) authenticated findings into scores this Drone hands to `audit-scoring-wasp-drone`.

## Procedure

1. Score every sub-check on the plugin's zero-to-six scale (build plan section 4.1). Every score carries a numeric value, an evidence pointer (captured page text, screenshot, or authenticated-view export), and a one-line justification, or it is rejected by `audit-scoring-wasp-drone`.
2. Apply the N/A rule with the two distinct triggers this pair has, and do not blur them together in the report:
   - **Not-found platform (guide 01):** every sub-check for that platform is N/A (score 0, excluded from both numerator and denominator), because there is nothing to check. This is a structural no-op, not a decision.
   - **Declined or unavailable authentication (guide 03):** only the login-gated sub-checks for that specific platform are N/A. Public-data sub-checks for the same platform (guide 02, guide 04) are scored normally regardless. Never let a declined-auth platform's N/A status bleed into its public-data scoring.
3. Found-but-dormant platforms are scored, not N/A'd. An empty or abandoned profile that was actually located is a real finding (typically a low score with a specific evidence pointer, e.g. "profile exists, zero posts in the visible history, bio field empty"), per build plan Q7.
4. Boolean sub-checks (e.g. "bio link resolves": yes/no) resolve only to 6 or 1.
5. Keep `[subjective]` judgments, voice consistency, unanchored cadence calls, out of the quantified table entirely, per conduct rule 3 and guide 04.
6. Log any candidate finding rejected or reframed during scoring to the run's verification log, with the reason, per conduct rule 4. A likely candidate for this pair specifically: a LinkedIn field that reads as "missing" but may simply be owner-toggled non-public (guide 04 step 4); if scoring initially treated it as a hard finding and then reclassified it as ambiguous, that reclassification belongs in the verification log.
7. Confirm every score's evidence pointer resolves to something actually captured this run before finishing this Drone's pass.

## Common failure this guide prevents

Scoring a declined-authentication platform's entire row as a failure because "we don't have the data." The correct outcome is that specific sub-check's exclusion from scoring, not a low score standing in for missing data. A user's decision not to log in must never lower the site's score.
