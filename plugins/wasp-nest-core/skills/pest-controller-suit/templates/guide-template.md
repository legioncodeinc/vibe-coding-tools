# {{Drone Display Name}} - Pest-Controller-Suit's Guide

The Pest-Controller-Suit routing skill's record of when to invoke `{{drone-name}}`. Use this guide to decide whether a user request belongs to this Drone.

**Drone:** [`colony/.claude/agents/{{drone-name}}.md`](../../agents/{{drone-name}}.md)
**Stinger:** [`colony/.claude/skills/{{stinger-name}}/`](../../skills/{{stinger-name}}/)
**Command Brief:** [`colony/{{drone-name}}-command-brief.md`](../../../{{drone-name}}-command-brief.md)
**Trigger policy:** {{proactive | on-demand}}

---

## Domain

{{One paragraph: what single domain does this Drone own? Lift from the Command Brief's IDENTITY & RESPONSIBILITY, tightened to 3-5 sentences.}}

## Trigger phrases

Route to `{{drone-name}}` when the user says any of:

- "{{trigger phrase 1}}"
- "{{trigger phrase 2}}"
- "{{trigger phrase 3}}"

Or when the request implicitly involves {{the domain area}}.

## Do NOT route when

- {{negative trigger 1 - names the other Drone that owns this}}
- {{negative trigger 2}}
- {{negative trigger 3}}

If a request straddles two Drones' domains, prefer the narrower-scoped Drone and let the broader one act as backup.

## Inputs the Drone needs

Before invoking, ensure the user has provided (or you can infer):

- {{required input 1}}
- {{required input 2}}
- {{optional input - default behavior if absent}}

If a required input is missing, do not invoke yet - ask the user to supply it.

## Outputs the Drone produces

- {{primary deliverable + location}}
- {{secondary deliverable, if any}}
- {{commit/audit trail produced}}

## Multi-Drone sequences this Drone participates in

- {{sequence name}} - {{this Drone's position in the sequence and what hands off to it / from it}}

## Critical directives the orchestrator should respect

- {{directive 1 the user expects to be honored}}
- {{directive 2}}

(Full list lives in the Drone file's `## Critical directives` section.)

---

*Part of Pest-Controller-Suit's roster. See [`colony/.claude/skills/pest-controller-suit/SKILL.md`](../SKILL.md) for the full colony.*
