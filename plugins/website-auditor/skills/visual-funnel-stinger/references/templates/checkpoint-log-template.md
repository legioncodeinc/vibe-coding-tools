# Funnel checkpoint log template

Copy this block once per checkpoint into the run's `05-funnel/checkpoint-log.md`. One block per checkpoint, appended in walk order (entry first, confirmation last), never reordered after the fact. Evidence is written at the moment of capture, per conduct rule 2, not reconstructed afterward.

```markdown
## Checkpoint {N}: {short label, e.g. "Product page, hero SKU"}

- **Funnel stage:** {entry | discovery | product-or-landing | cart | checkout | confirmation}
- **URL:** {exact URL visited, including query params if any}
- **Timestamp:** {ISO 8601, capture time}
- **Desktop screenshot:** `visual/desktop/{checkpoint-id}.png`
- **Mobile screenshot:** `visual/mobile/{checkpoint-id}.png`
- **Desktop viewport:** 1440x900, real desktop Chrome UA
- **Mobile viewport:** 390x844, real mobile Chrome UA
- **State-creating step?** {no | yes, opted-in this run}
- **Stage checklist applied:** {which checklist from guides/04-apply-stage-checklists.md}
- **Findings this checkpoint:**
  - {finding, evidence pointer (screenshot region or file:line-equivalent), one-line justification}
  - {finding 2}
- **Subjective calls:** {any [subjective]-labelled judgement made at this checkpoint, kept separate from quantified findings per conduct rule 3}
- **Notes:** {anything that explains a gap, e.g. "walk stopped here, interactive mode was OFF for this run"}
```

If a checkpoint's desktop or mobile screenshot could not be captured, do not omit the row. Log it with an explicit reason (blocked by a bot-wall, JS error, viewport-specific layout break that hid the element, etc.) so the evidence-index reflects a known gap rather than a silent one.
