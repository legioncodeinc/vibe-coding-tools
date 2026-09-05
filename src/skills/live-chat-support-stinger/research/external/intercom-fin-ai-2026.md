---
source_url: https://www.intercom.com/blog/announcing-fin-2-ai-agent-customer-service, https://www.intercom.com/help/en/articles/11390083, https://www.intercom.com/help/en/articles/13533623, https://www.intercom.com/help/en/articles/11390088, https://www.intercom.com/help/en/articles/12396892, https://www.intercom.com/help/en/articles/7837533-reporting-on-fin
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: critical
topic: ai-deflection
stinger: live-chat-support-stinger
---

# Intercom Fin 2.0: AI Deflection Capabilities, Configuration, and Pricing (2026)

## Summary

Intercom Fin 2.0 is the market's most capable out-of-the-box AI support agent as of 2026. It achieves a 51% average resolution rate with 99.9% accuracy across customer deployments. Pricing is $0.99/resolution (pay only for resolved conversations). The key configuration primitives are: Escalation Rules (data-driven deterministic handoffs), Escalation Guidance (natural-language fuzzy handoffs), Fin Attributes (AI-detected conversation metadata), and the weekly Recommendations engine (AI-powered knowledge gap identification). Intercom is currently migrating from HMAC identity verification to JWT-based verification.

## Key Performance Metrics (from Intercom official docs)

| Metric | Value | Source |
|---|---|---|
| Average resolution rate (Fin 2.0) | 51% | Announcing Fin 2 blog post |
| Accuracy rate | 99.9% | Announcing Fin 2 blog post |
| Pricing | $0.99 per resolution | Announcing Fin 2 blog post |
| Cost when Fin can't answer | $0 | Announcing Fin 2 blog post |

**Key formula:**
> `Automation rate = Involvement rate × Resolution rate`

If Fin is involved in 50% of eligible conversations and resolves 60% of those, the automation rate is 30%. This is the North Star KPI.

## Fin 2.0 Capabilities (announced October 2024, features rolling out through 2025-2026)

### 1. Reasoning and Actions

Fin can take actions in external systems via configurable action templates. Configuration steps:
1. Select an action template in the Intercom dashboard
2. Configure what access Fin has (read, write, specific APIs)
3. Use natural language to define when Fin should use this action
4. Fin calls the action autonomously during customer conversations

### 2. Fin Guidance

Fin Guidance uses natural-language instructions to customize Fin's behavior — tone, brand voice, follow-up questions, and escalation sensitivity. Configured at: `Fin AI Agent > Train > Guidance`.

**Important caveats:**
- Guidance cannot be used to route handovers to a specific team inbox (that requires Workflows)
- Guidance cannot tag conversations, update attributes, or mark conversations as priority
- Broad or generic guidance causes escalation rate to spike

### 3. Escalation Rules and Guidance (Dedicated Tab)

As of 2026, escalation configuration has its own dedicated tab at `Fin AI Agent > Train > Escalation`.

**Two methods:**
- **Escalation Rules:** Deterministic handoffs based on structured data (e.g., "Customer plan IS Pro", "Customer Sentiment is angry"). Best when you have structured data attributes.
- **Escalation Guidance:** Natural-language scenario-based handoffs (e.g., "If a customer mentions 'refund'"). Best when structured data isn't available.

**Critical warning from Intercom docs:**
> "The more escalation guidance you add, the more often Fin escalates. Broader guidance leads to more escalations, fewer resolutions, and higher human support volume. Most customers accept escalation offers when presented, even if Fin could have resolved the issue."

**Practical implication for stinger-forge:** The stinger should recommend sparse, specific escalation guidance rather than broad rules. Prefer escalation rules (data-driven) over escalation guidance (fuzzy) where possible.

### 4. Fin Attributes

Fin Attributes are auto-detected conversation metadata (replacing legacy AI Category Detection). They:
- Run automatically when Fin is present in a conversation
- Enable conditional logic for routing and escalation
- Support a dependency model: "Controlling Attribute" must be detected before "Dependent Attribute" is evaluated
- Available at `Fin AI Agent > Train > Attributes`

**Key constraint:** Fin must be present in the conversation to detect attributes. If you want classification without Fin answering, use Escalation Rules with immediate exit.

### 5. Recommendations Engine

Weekly AI-powered gap analysis at `Fin AI Agent > Analyze > Recommendations`. Identifies three gap types:
1. **Content gaps:** Fin couldn't answer because knowledge base is missing or outdated
2. **Customer data gaps:** Fin needed account/user data it couldn't access
3. **Action gaps:** Fin needed to take an action in another system

Recommendations are sorted by impact (number of affected conversations × time period). Replace the old "Unresolved Questions" report.

## Fin Performance Dashboard (2026)

Location: `Fin AI Agent > Analyze > Performance`

Key metrics:
- **Automation rate:** % of all conversations resolved by Fin without human (Involvement × Resolution)
- **Involvement rate:** % of eligible conversations where Fin was involved
- **Resolution rate:** % of conversations Fin resolved when involved
- **CX Score:** Positive ratings for all Fin-involved conversations (Pro add-on)

**Deflection rate** still available in Reports section. The Performance dashboard focuses on resolution as the primary KPI.

## Reporting API

Fin metadata is available through the Conversation model in API version 2.11+:
- `resolution_state`: outcome (assumed/confirmed/not resolved)
- `source`: workflow name that triggered Fin
- `customer_rating`: customer CSAT for Fin's response
- `content_sources`: knowledge base articles Fin cited

## Pricing Deep Dive

**$0.99/resolution pricing:**
- A "resolution" is a conversation Fin fully resolves without human handoff
- Conversations Fin cannot answer: free
- No charge for Fin involvement, only for successful resolutions

**Cost model at scale (stinger-forge calculation aid):**
- 1,000 resolutions/month = $990 + seat costs
- 5,000 resolutions/month = $4,950 + seat costs
- At 51% resolution rate with 10,000 conversations/month: 5,100 resolved = $5,049/month in Fin costs alone

**Early Stage program (for startups):**
- Year 1: 90% off (Advanced plan with 6 seats = $65/month total)
- Year 2: 50% off
- Year 3: 25% off
- Eligibility: under 2 years old, fewer than 15 employees, under $10 million in funding

## Identity Verification Status (2026)

**Intercom is migrating from HMAC to JWT:**
> "While JWT is the recommended method, we continue to support Identity Verification with HMAC for backward compatibility. If you're making any changes to your Identity Verification setup, we recommend moving to JWTs."

**Current HMAC support:**
- `HMAC-SHA256` on `user_id` (preferred) or `email` (if only email is sent)
- Secret managed at `Intercom > Settings > Security`
- Secret rotation API: `POST /secure_mode_secrets` creates new secret (returned once only), `DELETE /secure_mode_secrets/{id}` retires old

**JWT migration path:**
- JWT uses `user_id` only (not email)
- Set token expiration to match app session length
- Implement token refresh for long sessions

## Key Quotations

- "Customers using Fin 2 see an average resolution rate of 51%, with an accuracy rate of 99.9%." (Intercom blog, October 2024)
- "So how much does all this cost? The same as it always did — $0.99 cents per resolution. We only charge you if Fin delivers a resolution. If Fin can't answer, Fin is free to use." (Intercom blog)
- "Fin AI Agent automation rate is calculated as: Automation rate = Involvement rate × Resolution rate" (Intercom help docs)
- "Escalation Guidance is powerful, but broad or generic guidance can cause a sharp increase in escalations and a corresponding drop in Fin resolution rate." (Intercom help docs)
- "Recommendations not only shows where Fin couldn't resolve conversations, but also provides clear, actionable guidance on how to fix those issues." (Intercom help docs)

## Annotations for stinger-forge

- **guides/05-ai-deflection.md**: The Fin section should use the `Automation rate = Involvement × Resolution` formula as the central metric. The "three gap types" from Recommendations is an excellent structure for the knowledge-base maintenance section.
- **Escalation config**: The stinger should strongly recommend using Escalation Rules (data-driven) over Escalation Guidance (fuzzy) as the primary configuration approach. Provide examples with specific attribute values.
- **Identity verification**: The stinger must note the HMAC-to-JWT migration. New integrations should use JWT. Existing HMAC integrations should document a migration path.
- **Pricing warning**: At scale, $0.99/resolution is expensive. The stinger should include a cost calculator formula and recommend confirming conversation volume before committing to Intercom.
- **Knowledge base seed articles**: The Recommendations engine provides data-driven guidance on what articles to write first. The stinger should recommend running Fin for 2 weeks with an incomplete KB, then using Recommendations to prioritize article creation.
