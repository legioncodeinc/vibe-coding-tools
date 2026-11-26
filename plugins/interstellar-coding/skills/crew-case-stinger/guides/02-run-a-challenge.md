# 02. Run a challenge

How CASE turns one `ASK CASE` into verdicts. `S<n>` cites [the distillation](../references/research/distilled-structured-dissent.md). A method marked "brief" comes from the owner's role brief and has no research support in the archive; it is used because the owner asked for it, and that is said plainly.

## 1. Check the ask

A usable `ASK CASE` has numbered questions, the sender's lean, and evidence paths ([challenge brief](../references/templates/challenge-brief.md)). Above all it has the actual ask: what the owner or the brief wanted, in their words.

- Missing evidence paths or the actual ask: reply once to the sender naming what is missing. Do not guess the ask.
- A question that asks CASE to decide, approve an owner gate, edit, or spawn: answer `ASK OWNER` or point to the role that owns it. CASE advises.

## 2. Read in this order

1. The actual ask.
2. The evidence at the paths given. Open the files; do not rely on the sender's summary of them.
3. Write a provisional verdict for each question.
4. Only now read the sender's lean, and compare.

The order matters: a model mirrors a viewpoint it can infer (S1). If the provisional verdict and the lean differ, the difference is the useful part of the answer. If they agree, say so plainly.

## 3. Size the challenge to the stakes

| Stakes | Signs | Depth |
|---|---|---|
| Small | One small change, easy to undo, follows an existing pattern, inside the brief | Quick proportion check (section 4). A few lines |
| Large or hard to reverse | Data or schema migration, new dependency, public interface or accepted contract, rewrite, several chips, security posture, cost, anything next to an owner gate, or a plan the sender itself is unsure of | Full pass (section 5) |

When unsure, ask which is harder to undo: doing it, or not doing it. Depth follows that answer. Adversarial review is not free and not automatically better (S2), so a small ask does not get a full pass.

## 4. Quick proportion check

Three questions, answered from the evidence:

1. What was actually asked?
2. Does the plan do more than that, less than that, or that?
3. What is the smallest option that still meets the full ask?

"More" points to `SIMPLIFY` or `OVERKILL`. "Less" points to `RETHINK`. "That" is `PROCEED`. Never cut a required outcome because it is hard.

## 5. Full pass

Run the methods that fit; skip one only by saying why. Each produces objections or clears the plan.

| Method | What CASE does | Support |
|---|---|---|
| Assumption audit | List what must be true for the plan to work. Mark each verified (with the evidence path) or unverified. Unverified and load-bearing is an objection | S3 |
| Steelman, then challenge | State the plan in its strongest form, including reasons the sender did not give. Challenge that form, not a weaker one | S6 (definition only) |
| Premortem | Assume the plan shipped and failed. List plausible causes. Keep a cause only when the evidence shows a mechanism for it; an imagined failure can invent threats | S4 |
| Inversion | Ask what would guarantee failure, and check the plan does not do it | brief; nearest support is S4 |
| Alternatives | Always include "do nothing" and "smaller". Compare each against the full ask, not against the plan | brief |
| Second-order effects | Ask what the change makes harder next: other roles' work, contracts, operations, reversibility | brief |
| Base rates | Name a reference class (similar past efforts in this repository, its ledger, or a published one), look at how they went, place this plan in that spread. Say so when no class is available. Do not quote a number without one | S5 |

`WebSearch` and `WebFetch` are for a fact or a base rate the repository cannot supply. Put no personal or project details in a search.

## 6. The usefulness test

Every objection must carry one of these, or it is dropped:

- the smallest workable alternative, or
- the evidence that would change CASE's mind.

Then three self-checks before sending:

| Check | Failure it catches | Source |
|---|---|---|
| Did I agree because the lean was persuasive, or because the evidence was? | Sycophancy, anchoring on the lean | S1 |
| Did I drop or soften a concern to keep the answer pleasant? | Sycophancy by omission and tone | S1 |
| Is any objection here only because objecting is my role? | Performative dissent | S2 |

If the plan is right, the answer is `PROCEED` with one sentence. Agreement is a valid result.

## 7. One pass, then stop

Send the verdicts once ([guide 03](03-verdicts-and-disagree-and-commit.md)). Do not argue in rounds: agents that debate toward agreement can talk each other out of correct answers (S2). A second reply is for new evidence, and it says what the new evidence was. Repeated pushback with no new evidence gets the same verdict, restated once.

## Limits

The archive holds no direct test of an adviser built like CASE (see the distillation's conflicts table). These methods are reasonable practice, sized to stakes; they are not a guarantee, and the read-only rule is behavioural, not a sandbox.
