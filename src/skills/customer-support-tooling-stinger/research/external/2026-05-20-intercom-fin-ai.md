---
url: https://www.intercom.com/fin
title: "Intercom Fin — AI Agent for Customer Support (May 2026 rebrand)"
source_type: official_site
authority: canonical
relevance: 5
fetched: 2026-05-20
topic: Fin AI deflection, outcome-based pricing, resolution benchmarks, escalation
---

# Intercom Fin AI — Overview

In May 2026, Intercom completed a rebrand: the product formerly known as "Fin AI Copilot" is now simply "Fin." The rebrand coincides with the launch of the Fin 2.0 model, which introduced outcome-based pricing and improved multi-step reasoning for complex support conversations.

## Key findings

**Resolution rate benchmarks:** Intercom reports an average 67% AI resolution rate across customers using Fin. Top-performing deployments (typically SaaS products with comprehensive knowledge bases) reach 80-85%. B2C high-volume products with sparse FAQs typically land at 40-55%.

**Outcome-based pricing model:** Fin 2.0 introduced a per-resolved-conversation pricing model: $0.99 per resolution. A "resolution" is defined as a conversation where the customer's issue was closed without escalating to a human agent, as rated by Intercom's resolution detection algorithm. Customers pay the flat Intercom seat license PLUS per-resolution charges. At 67% deflection on 10K monthly conversations, Fin adds approximately $6,600/month to the Intercom bill.

**Escalation protocol:** When Fin cannot resolve a conversation, it hands off to a human agent with a conversation summary and the knowledge-base articles it attempted to use. The handoff includes a "confidence score" that agents use to triage urgency.

**Knowledge base dependency:** Fin is only as good as the Articles published in Intercom's Help Center. Teams with < 20 help articles see < 40% resolution rates. The deflection guide must include a knowledge-base bootstrap checklist before enabling Fin.

**Multi-language support:** Fin 2.0 supports 45 languages natively. It detects the customer's language from the first message and responds in kind.

**Operator guardrails:** Admins can configure "Topics" that Fin will and will not address. Fin will refuse to answer questions outside its configured scope and will route them directly to a human.

## Key takeaways

- Fin is the most capable AI deflection product in the market (May 2026), but its outcome-based pricing makes it expensive at scale for high-volume B2C products.
- A knowledge-base with > 50 articles is the minimum viable foundation for Fin to reach the 60%+ resolution threshold.
- The $0.99/resolution cost model has an uncapped upside risk at > 10K resolutions/month; budget accordingly.
- Fin's multi-language support makes it the only viable option for products serving non-English markets without building custom localized bots.
- Intercom's seat-based model (separate from Fin charges) starts at $74/seat/month for the Starter plan; total cost of ownership is significantly higher than Plain for < 1K monthly conversations.
