# Guide 03: Opt-in authentication with silent no-op on decline

This is a binding conduct rule this Drone is the concrete implementation of, per build plan Q7 and PRD-017's own text: "This Drone is the concrete implementation of Q7's harness-browser-per-platform-auth-prompt flow." It is not a nice-to-have refinement of the audit; it is a non-negotiable constraint on this Drone's behavior. No research source in this Stinger's archive discusses browser-automation authentication flows or consent UX (distilled research section 8, gap); this guide is entirely a product/conduct requirement, and this guide is its authoritative procedure.

## The rule, stated plainly

For every platform where a login-gated data class exists (native analytics: follower growth rate, reach trend, impressions-vs-reach ratio, audience demographics, per distilled-social-presence.md section 5), this Drone:

1. Uses the harness's own browser tooling, never a separate scraping mechanism, credential store, or bypass, to reach that platform.
2. Explicitly prompts the user, per platform, whether they want to authenticate to unlock that platform's gated data.
3. If the user declines, OR the harness has no browser-authentication capability at all, silently no-ops that platform's gated checks. "Silent no-op" means: excluded from the score (weight 0, per the N/A rule), never scored as a failure, never described in the report using language that reads as a defect of the site or a shortcoming of the audit.

## Procedure

1. Determine harness capability before prompting anyone. If the harness's own browser tool has no interactive-authentication capability (no way for the user to complete a login through it), skip the prompt entirely and go straight to the no-op path (step 5). Do not prompt for something the harness cannot actually deliver.
2. If the harness can support it, prompt per platform, not once for all three, using `references/templates/auth-opt-in-prompt-script.md`. Only prompt for platforms where a profile was actually found (guide 01); there is nothing to authenticate into for a not-found platform.
3. Only prompt when there is gated data behind the decision. If a platform's found-but-dormant profile has nothing further that login would reveal beyond what's already publicly visible, do not prompt just to complete a checklist; note that the gated checks are moot for this profile instead.
4. If the user accepts for a given platform: hand control to the harness's browser tool for the login step itself. This Drone does not see, request, store, or log the credentials; it resumes work only once the harness reports the authenticated session is active. Collect the gated data class named above for that platform only, evidence it exactly like any other checkpoint (evidence pointer, one-line justification), and score it normally per guide 05.
5. If the user declines, or the harness lacks the capability (step 1): mark that platform's gated sub-checks N/A (score 0, excluded from both numerator and denominator). Write this outcome to the report's declined-or-unavailable section, in neutral factual language, per guide 06 step 3. Never write, imply, or let a downstream Drone infer that a decline reflects poorly on the site being audited.
6. This decision is per-platform and per-run. A decline on Instagram does not imply a decline on LinkedIn; a decline this run does not carry forward to a re-audit without asking again.
7. This rule sits alongside, and does not override, the separate found/not-found distinction from guide 01. A not-found platform never reaches this guide at all (nothing to authenticate into). A found platform reaches this guide regardless of the user's eventual answer; the found/not-found no-op and the declined-auth no-op are two different triggers, do not merge their language in the report or conflate their scoring treatment (guide 05 step 2 restates this from the scoring side).

## What "never a negative finding" actually forbids

Concretely, all of the following are violations of this rule, even if unintentional:

- Scoring a declined-auth platform's gated checks as a low number instead of excluding them.
- Writing report language like "could not verify follower growth (user declined)" in a way that reads as a limitation of the site rather than a limitation of this run's authorization scope.
- Letting a declined platform's exclusion lower the platform's OTHER (public-data) scores, or the site's overall category weighting, beyond the mechanical effect of a smaller denominator that the N/A rule already accounts for.
- Re-prompting repeatedly within the same run after a decline, which functions as pressure rather than a one-time, respected opt-in.
- Treating an unavailable harness capability as equivalent to a user decision; state plainly in the report which of the two occurred, since a future run on a more capable harness could still gather that data.

## Why this guide exists separately from guide 05

Guide 05 covers scoring mechanics generally. This guide exists on its own because the rule it encodes is a binding conduct requirement of the plugin, not a scoring technicality, and because getting the report's tone wrong (a subtle negative framing of a decline) is a more likely failure mode than getting the numeric N/A exclusion wrong.
