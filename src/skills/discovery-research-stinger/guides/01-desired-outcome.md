# 01 — Desired Outcome Scoping

How to define and validate the single desired outcome that anchors an Opportunity Solution Tree.

**Research source:** `research/external/2026-05-20-opportunity-solution-tree-guide-2026.md`, `research/external/2026-05-20-torres-2026-roadmap-ai-discovery.md`

---

## Why a single outcome

An OST without a defined desired outcome is a wish list. Every customer problem looks equally valid, every solution idea competes on vibes, and the team has no basis for deciding which opportunity to target next. The desired outcome is the root node of the entire tree — it filters what counts as a relevant customer problem and what counts as a solution worth testing.

Torres' rule: one team, one desired outcome at a time. If a team is working toward multiple outcomes simultaneously, the OST branches incoherently and the weekly interview cadence produces noise rather than signal.

---

## The three-part test for a valid desired outcome

A well-scoped desired outcome passes all three:

1. **Customer-centric:** It describes something the customer experiences or achieves, not an internal metric. "Customers successfully complete their first workflow in under 5 minutes" passes. "Increase MRR by 15%" fails (that's a business metric, not a customer outcome — though it may be a lagging indicator of a customer outcome).

2. **Measurable:** The team can tell when the outcome is being achieved, with a concrete signal. "Users feel confident" fails. "Users complete the onboarding checklist and return within 7 days" passes.

3. **Product-team influenceable:** The team's product decisions can move the metric. "Reduce customer support ticket volume by 30%" passes if the team ships the product. "Increase customer lifetime value through upsells" may belong to sales, not product.

---

## How to scope an outcome (interview protocol)

If the user hasn't stated a desired outcome, ask these questions in order:

1. "Who is the primary customer we're building for in this cycle?"
2. "What do you want that customer to be able to do — or do differently — after we ship?"
3. "How would we know, in their behavior or a signal we can measure, that the outcome is being achieved?"
4. "Is there anything about this outcome that is outside our team's control to move?" (filters out lagging business metrics)

Write the agreed outcome to `library/discovery/desired-outcome.md` using `templates/opportunity-solution-tree.md`'s outcome section. One sentence, active voice, customer subject.

**Example:** "New SaaS users complete their first automated workflow within 48 hours of signup."

---

## Common mistakes

| Mistake | What it looks like | Fix |
|---|---|---|
| Business metric as outcome | "Grow ARR by 20%" | Ask: what customer behavior causes that metric to move? That behavior is the outcome. |
| Feature as outcome | "Users adopt the new dashboard" | Ask: what do users achieve with the dashboard that they couldn't before? |
| Too broad | "Users succeed with the product" | Apply the measurability test; the outcome should have a time horizon and a behavioral signal. |
| Multiple outcomes | "We want to improve onboarding AND reduce churn" | Pick one for this cycle. A team can have a roadmap of outcomes; it runs one OST at a time. |

---

## Output

Write the outcome to: `library/discovery/desired-outcome.md`

Format:
```
# Desired Outcome

**Customer segment:** <who>
**Outcome statement:** <one sentence, customer-centric, measurable>
**Measurement signal:** <behavioral or quantitative indicator>
**Cycle started:** <YYYY-MM-DD>
**Status:** active | achieved | pivoted
```

See `examples/happy-path-saas-onboarding.md` for a worked example.
