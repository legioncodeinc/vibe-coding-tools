# sop-forge

Point it at something you already did and it writes the SOP, because Littlebird watched you do it.

## What it does

You cannot hand off the client onboarding or the monthly reconciliation, because writing the procedure down costs an hour you do not have. So you keep doing it.

Say "document how I built that workflow last Thursday" and it reconstructs the session: the real screens, field names and settings, in order, each step carrying a timestamp you can open in Littlebird.

That is the unlock: documentation becomes a byproduct of work already done. Because it reconstructs rather than invents, what it cannot resolve comes back as a named gap. You fill three blanks instead of writing forty steps.

## When to use it

- You are handing a recurring task to a VA or a new hire.
- A client wants the procedure as a deliverable.
- You built something whose settings you will have forgotten by next quarter.

Just ask for it. Trigger phrases include "write an SOP", "document how I did that", "turn last Thursday into a procedure", "make this repeatable", "write it up so I can hand it off" and "write the training script for this".

## Run it on a routine, or on demand

| Mode | Cadence | What happens |
|---|---|---|
| On demand | Any session you name | Reconstruction, redaction, read-back, then the file |
| Routine | Not available | A routine cannot run an approval gate or write a file |

No routine, and the reason is a constraint rather than a preference: this skill has a mandatory redaction gate and a confirmation step before it writes anything, and an unattended routine can do neither. For recurring coverage, have a routine watch for undocumented repeated work, then run sop-forge on what it flags.

## What you get

One Markdown file in one of four modes: internal SOP, training script, client deliverable, checklist. Named for the outcome, not the tool: `sop-build-tag-triggered-nurture-workflow-v1.md`.

Every mode carries a provenance block, a security notice where credentials were on screen, the values you need, the gap list, prerequisites, the procedure and its decision points. Steps read as instructions:

```
4. In Automation, click Add Action, then select Send Email.
   [GAP: the template chosen here was not captured]
```

## What it needs

- The Littlebird MCP on a Power or Pro plan. No degraded mode: an SOP written without capture is a tutorial with your logo on.
- A specific session: roughly what day, and which tools.
- A few minutes for the read-back. Recognition beats recall: you will spot that step 4 was unrelated.

## Limits worth knowing

It never invents a step. Where two screens are captured and the action between them is not, the SOP says so rather than writing the click that usually goes there. Where capture reads "Add Act", it reports that, marked as a gap. A fabricated step gets followed, not questioned.

Gap markers and redaction placeholders look deliberately different. `[GAP: ...]` means unresolved. `[YOUR_STRIPE_SECRET_KEY, from Stripe dashboard, Developers, API keys]` means resolved and removed on purpose. Confusing them sends a reader hunting for a secret in a screenshot.

The redaction pass is mandatory and still not a guarantee. Automated redaction at the state of the art leaves roughly one document in five leaking, so the human read-back closes it. A credential on screen raises a rotation flag naming the field, not the value.

Thin capture produces no SOP: fewer than five distinct steps comes back as a fragment. And it writes a file and stops. Nothing is sent or published.

## Related skills

[day-reconstructor](../day-reconstructor/README.md), for a record of the session rather than a procedure. [learning-capturer](../learning-capturer/README.md), when the output is one hard-won fix. [skill-suggester](../skill-suggester/README.md), when you repeat yourself but cannot name what to document first. [knowledge-base-builder](../knowledge-base-builder/README.md), when the unit is a project.

## Under the hood

`SKILL.md` has the retrieval brief, the gap rules and the guardrail. The guides under `references/`: `session-reconstruction.md`, `redaction-pass.md`, `gap-handling-and-confirmation.md`, `sop-formats.md`. Deduplication and the credential scan use `scripts/dedupe_snapshots.py`.

`references/research/` holds 12 archived primary sources, including the EPA standard, extension-service SOP guidance and cognitive task analysis work. Every domain claim traces to one.
