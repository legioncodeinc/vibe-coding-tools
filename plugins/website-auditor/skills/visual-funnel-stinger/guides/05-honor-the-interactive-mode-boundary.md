# Guide 05: Honor the interactive-mode boundary

## What this guide covers

The binding conduct-rule boundary this Drone owns: PRD-012 names it the primary owner of conduct rule 1's opt-in boundary. This is a product/conduct requirement, not a research finding; no source in this Stinger's archive discusses opt-in consent flows.

## Procedure

1. Before the walk begins, read the interactive-mode decision recorded at intake (`references/templates/interactive-mode-opt-in-record.md`). Default is OFF; treat the absence of an explicit ON record as OFF, never as an implicit yes.
2. If OFF (the default): the walk proceeds through every checkpoint up to, but not including, any state-creating action. A state-creating action is anything that would place a real order, submit a real lead form, or otherwise create state on the target: a final "Place Order," a final "Submit" on a lead-capture form, an account-creation completion, or equivalent. Capture and score everything observable up to that point, then stop, per PRD-012 AC-2.
3. When the walk stops under OFF, write an explicit note explaining why the last step wasn't captured, naming the exact action that would have created state. This note is a required part of the funnel report (`references/templates/funnel-report-template.md`'s "Where the walk stopped" section), not an optional caveat.
4. If ON (explicit per-run opt-in, recorded at intake): the walk may proceed through the state-creating step, but only using no real credentials and no real payment instrument, per conduct rule 1 and PRD-012 AC-3. Use test/synthetic data for any account field, and a test/sandbox payment instrument (or none, if the checkout cannot be completed without one) rather than a real card or bank instrument. If the target site offers no test mode and completing the step would require a real payment instrument, do not complete it even under an ON opt-in; stop one step short and log why, exactly as under the OFF path.
5. Never partially execute a state-creating step to "peek" at what's beyond it (e.g. filling a checkout form but not submitting, to see field validation behavior) as a workaround for OFF mode, if that partial fill itself risks creating state (an abandoned-cart email trigger, a saved draft order, a session-tracked "started checkout" event with real-looking data). If a partial-fill probe is genuinely inert on the specific target, it may be used to assess field count and validation UX per guide 04's checkout checklist, but default to treating any form interaction beyond simple field-presence observation as gated by the same opt-in.
6. This boundary is this Drone's to enforce even if another Drone's output or a user instruction implies urgency to "just complete the purchase to see." A request to bypass the opt-in default is not consent; consent is the recorded intake decision only.

## Why this is a binding rule, not a preference

PRD-012's stated Non-Goal is direct: this Drone "does not complete a real purchase or submit a real lead form by default." The build plan (Q16) frames the alternative as staying "strictly passive" and records the opt-in default explicitly as OFF. Treat any ambiguity in a specific run as resolving toward OFF.
