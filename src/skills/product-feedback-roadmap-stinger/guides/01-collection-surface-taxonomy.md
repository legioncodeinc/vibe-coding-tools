# Guide 01: Collection Surface Taxonomy

The three collection surfaces for product feedback — in-app widget, customer portal, and public voting board — serve different goals and attract different signal quality. This guide explains when to use each, how to combine them, and which channel stack to deploy for each primary goal.

## The three surfaces

### In-app widget

An always-visible floating button (or triggered overlay) inside the product UI.

| Attribute | Value |
|-----------|-------|
| Signal quality | Medium |
| Volume | High |
| Effort to manage | Low |
| Best for | Continuous collection from active users; bug reports; contextual feature requests |

**When to use:** Your primary collection surface when you need high-volume passive feedback from users while they are actively using the product. Contextual: the user can attach a screenshot of exactly what they're looking at.

**UX decisions:**
- **Inline embed vs redirect to portal:** Inline embed (e.g., Userback's Feature Portal embedded inside the widget) keeps the user in context. Redirect to a standalone portal page suits teams that want a richer portal experience at the cost of context.
- **Trigger logic:** Show proactively after key moments (post-onboarding, post-feature-use) for higher signal quality; always-visible floating button for passive collection.
- **Moderation:** Auto-public vs review queue. Start with review queue (ideas go public only after human approval) until a moderation process is established.

### Customer portal (feedback portal)

A standalone URL (hosted or custom domain) where customers submit ideas, see existing requests, and vote.

| Attribute | Value |
|-----------|-------|
| Signal quality | High |
| Volume | Medium |
| Effort to manage | Medium |
| Best for | Structured B2B feedback from account champions; authenticated submissions |

**When to use:** B2B SaaS where feedback comes from account champions (not mass end-users). Portals support authentication (SSO, email verification), which ties submissions to account tier, MRR, and plan — critical for RICE Reach scoring.

**Key decision:** Public or private portal?
- **Public:** Users see all existing ideas; reduces duplicate submissions because users vote on existing requests instead of submitting new ones.
- **Private:** Better for sensitive B2B feedback. Start private, go public once a moderation process exists.

### Public voting board

A public-facing page where anyone can vote, comment, and track status.

| Attribute | Value |
|-----------|-------|
| Signal quality | High (voting signal quantifies demand) |
| Volume | Medium-High |
| Effort to manage | Low |
| Best for | Feature prioritization; community building; reducing repetitive support questions |

**Why voting boards exceed surveys:** The voting mechanism surfaces demand signals that surveys cannot replicate. Voters are tracked with email, plan type, and MRR — you can segment the signal by customer value. When 200 people vote for the same feature, that is a fundamentally different signal than 200 separate support tickets about different things.

**Risks:**
- **Lowest-common-denominator distortion:** High-volume B2C user bases vote for generic features over strategic ones. Apply the 20% cap rule (see `guides/05-public-roadmap-playbook.md`).
- **Gameable:** Power users vote-bomb their favorite requests. Weighting votes by MRR or plan tier mitigates this.

## Channel stack recommendations by goal

| Primary goal | Recommended stack |
|-------------|-------------------|
| Roadmap prioritization | Feedback board + in-app widget |
| Churn reduction | Support ticket tagging + NPS survey + churn email |
| Onboarding improvement | In-app widget (triggered at key moments) + customer interviews |
| Idea validation | Customer interviews + feedback board voting data |
| All-in-one (small team) | Userback widget with Feature Portal embedded |

## How many surfaces to run simultaneously

**One primary tool per surface.** Running Canny for voting AND Userback for in-app widgets AND Productboard for internal scoring produces three canonical sources of truth that drift apart. The recommendation must pick a primary tool and demote the others to integrations or deprecate them.

**Typical progression:**
1. **Stage 1 (< 50 req/mo):** In-app widget only. Low overhead; captures contextual bug reports and feature requests.
2. **Stage 2 (50-300 req/mo):** Add a voting board. De-duplication discipline becomes necessary at this stage.
3. **Stage 3 (300+ req/mo):** Add a private portal for B2B account champions; retain public board for community signal.

## Userback: the "all three in one" pattern

Userback's Feature Portal is the clearest example of collapsing all three surfaces into a single tool:

- Widget = in-app feedback + bug reports
- Feature Portal (embedded inside widget) = ideas portal + voting board
- Roadmap tab = public roadmap with status

The widget can be configured to: (a) embed the Feature Portal inline, (b) redirect to the portal URL, or (c) open the portal in a new tab. This pattern is ideal for teams that want one widget to rule all customer touchpoints without maintaining separate tools.
