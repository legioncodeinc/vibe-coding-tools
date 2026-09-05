# Guide 00: Platform Selection

The decision tree for choosing the right feedback platform. Match your audience type, request volume, integration requirements, and transparency posture to a recommended primary tool.

> **2026 pricing verified** — Canny plan names changed in 2026. Featurebase is pivoting toward support/chat. See caveats per tool.

## Quick recommendation table

| Scenario | Primary tool | Why |
|----------|-------------|-----|
| Solo founder, < 50 req/mo, needs basics | Frill ($25/mo) | Per-workspace pricing, zero per-seat cost, good enough basics |
| Small team, 50-300 req/mo, Canny too expensive | Featurebase ($49/mo) | Most-recommended Canny alternative; free tier available |
| Growth-stage, 300+ req/mo, AI de-duplication needed | Canny (Pro $79/mo) | AI clustering included, mature integrations, proven at scale |
| B2B SaaS on Linear, wants CRM-integrated feedback | Productlane ($~~) | Linear is core; roadmap mirrors Linear projects automatically |
| Enterprise, multiple PMs, needs internal scoring + roadmap | Productboard ($59+/maker) | Best for large PM teams; significant overkill under 5 PMs |
| All-in-one: widget + bug reports + Feature Portal in one | Userback | Only platform that combines bug-report widget + ideas portal + roadmap in a single embedded widget |

## Decision tree

```
1. Do you primarily need bug reporting + screenshots + feature voting all in one widget?
   YES → Userback (Feature Portal embedded in the bug widget)
   NO  → continue

2. Are you on Linear and need your roadmap to mirror Linear projects automatically?
   YES → Productlane (two-way sync is native; roadmap IS Linear's project list)
   NO  → continue

3. Do you have multiple Product Managers or need internal feature scoring layered on top of customer votes?
   YES → Productboard (strong internal scoring layer; significant cost)
   NO  → continue

4. What is your monthly request volume?
   < 50 requests/mo → Frill (cheapest; basics covered)
   50-300 req/mo    → Featurebase (best Canny alternative; free tier; watch the 2026 pivot risk)
   > 300 req/mo     → Canny (AI clustering, mature integrations, scales to enterprise)
```

## Platform profiles

### Userback

- **Positioning:** All-in-one widget. Bug reports + screenshots + Feature Portal (ideas, voting, roadmap, announcements) in a single embedded widget.
- **Unique strength:** Feature Portal can be embedded *inline inside the bug-report widget* — one widget, multiple surfaces.
- **Status model:** Under Review → Planned → In Progress → Shipped. "Public status" allows mapping multiple internal statuses to a single public-facing label.
- **Automatic voter notifications:** fires when status moves to Shipped.
- **20,000+ teams** use Userback for public roadmaps.
- **When to choose:** Teams that want the widget, bug reporting, and ideas board without managing two separate tools.

### Canny

- **Pricing (2026):** Free (very limited), Core $19/mo, Pro $79/mo, Business (custom, 5,000+ tracked users). "Starter" and "Growth" are legacy names.
- **Pricing model:** Per tracked user (every voter counts). Expensive at scale with large user bases.
- **AI features:** AI duplicate detection, smart replies, feedback summarization — included at no extra cost on paid plans.
- **Integration depth:** The most mature integrations: Jira (two-way), Linear, Intercom, Salesforce, Zendesk.
- **When to choose:** > 300 req/mo, need AI clustering, need proven Jira/Linear sync, can afford the tracked-user pricing.
- **When NOT to choose:** Small user base paying per-tracked-user is proportionally expensive; enterprise orgs often find Productboard's internal scoring more valuable.

### Featurebase

- **Pricing:** Free tier (feedback portal, in-app widget, up to 50 help articles), Starter $49/mo.
- **Pricing model:** Per admin seat — end users are unlimited. Cheaper than Canny for teams of 3+ with moderate user engagement.
- **AI features:** Fibi AI agent for support, AI copilot, AI replies — charged at $0.29/AI resolution + $19/agent/mo add-on.
- **Strategic risk (2026):** Featurebase is pivoting toward live chat / support platform. Feedback-specific features may receive less investment going forward.
- **When to choose:** Teams cancelling Canny who need a budget-friendly step-up, or who want feedback + light support in one tool.
- **When NOT to choose:** Teams that need long-term commitment to feedback tooling depth; the 2026 pivot risk is real.

### Productboard

- **Pricing:** $19/maker (starter); real-world plans $59+/maker/mo. No free tier (15-day trial).
- **Unique strength:** Internal feature scoring layer — product teams can add strategic weights, objectives alignment, and custom scores on top of customer votes.
- **When to choose:** 5+ Product Managers, enterprise roadmap governance, need internal scoring beyond simple voting counts.
- **When NOT to choose:** < 5 PMs; the internal scoring layer is overkill and the cost is unjustifiable.

### Frill

- **Pricing:** Startup $25/mo (50 active ideas), Business $49/mo (unlimited), Growth $149/mo. Per-workspace — no per-seat charges.
- **Unique strength:** Cheapest platform with a complete set of basics (idea board, voting, roadmap, changelog). Per-workspace pricing is uniquely cost-effective for small teams.
- **Limitations:** No AI clustering, thin integrations, manual prioritization. UI is openly a Canny clone.
- **When to choose:** Under 50 req/mo; need a working voting board and roadmap without paying per-seat.

### Productlane

- **Core differentiator:** Linear is the heart — Productlane's roadmap is not a separate artifact; it *mirrors* Linear projects automatically. Changelog drafts are auto-generated when a Linear project is marked complete.
- **CRM integration:** Two-way sync with HubSpot, two-way with Linear Customer Requests (Dec 2024). Customer properties (stage, tier, revenue) from HubSpot flow into Productlane natively.
- **When to choose:** B2B SaaS teams that live in Linear and want feedback loop to be driven by (not separate from) Linear.
- **When NOT to choose:** Teams not on Linear; teams needing a high-volume public voting board independent of their issue tracker.

## Pricing snapshot (April 2026)

| Tool | Starts at | Free tier | Public roadmap | AI clustering | Pricing model |
|------|-----------|-----------|----------------|---------------|---------------|
| Userback | Check userback.io | Limited | Yes | No | Per-seat |
| Canny | $79/mo (Pro) | No | Yes | Yes (paid) | Per tracked user |
| Featurebase | $49/mo | Yes | Yes | Yes (add-on) | Per admin seat |
| Productboard | $59+/maker | No (trial) | Yes | Yes | Per maker seat |
| Frill | $25/mo | Limited | Yes | No | Per workspace |
| Productlane | Check productlane.com | Limited | Yes (via Linear) | No | Per seat |

> Always verify pricing at the vendor's pricing page before recommending. SaaS pricing changes frequently.
