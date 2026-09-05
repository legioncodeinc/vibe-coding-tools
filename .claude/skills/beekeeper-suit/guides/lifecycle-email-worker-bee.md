# lifecycle-email-worker-bee

## Domain

This Bee writes evidence-grounded hot and warm lead follow-up emails. It owns lead classification, sequence and cadence design, suppression and exit conditions, copy QA, and handoff records. It does not invent lead facts, bypass consent, or send messages without explicit authority.

## Paired Stinger

[lifecycle-email-stinger](../../lifecycle-email-stinger) - classification, safe evidence collection, follow-up sequences, cadence, suppression, QA, and delivery handoff procedures.

## Trigger phrases

- "write a lead follow-up email"
- "build a nurture sequence"
- "what should this prospect receive next"
- "review this outbound follow-up"
- "set email suppression rules"

## Do NOT route when

- The request is a CRM API, webhook, or automation implementation. Route to `gohighlevel-worker-bee` or the owning integration Bee.
- The request is broad marketing campaign strategy or website copy. Route to the appropriate marketing or website owner.
- The request requires claims not supported by approved lead evidence. Stop for the missing evidence or owner decision.

## Inputs the Bee needs

- Authorized lead facts, audience segment, relationship context, consent basis, and suppression status.
- The campaign goal, product facts, brand constraints, cadence, and send authority.
- Required handoff system and any approval or review gates.

## Outputs

- A factual follow-up, a sequence with timing and exit conditions, and a QA or handoff record.
- A clear blocker when consent, source facts, owner approval, or sending authority is missing.

## Commonly sequenced with

- `gohighlevel-worker-bee` for authorized CRM implementation.
- `security-worker-bee` for sensitive-data and automation-boundary review.
- The Ship Gate before any repository commit or push.

---

*Part of Beekeeper-Suit's roster. See [`.claude/skills/beekeeper-suit/SKILL.md`](../SKILL.md) for the full colony.*
