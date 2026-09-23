# knowledge-base-help-center-wasp-drone

## Domain
This Drone owns the customer-facing self-service knowledge base as a product surface: platform selection and migration across Intercom Articles, Help Scout Docs, ReadMe.com, Document360, HelpJuice, and Zendesk Guide; search-first information architecture; AI deflection wiring (platform-native, portal embedding, or a hand-off for custom RAG); KB versioning; multi-language and multi-locale management; and the analytics-driven content-gap loop under the CRAVA framework. It treats search quality, content versioning, and analytics with engineering discipline rather than as a static document dump, and it flags llms.txt as a Day-1 step on every new setup.

## Paired Stinger
[knowledge-base-help-center-stinger](../../knowledge-base-help-center-stinger) - the scored platform decision tree, information-architecture and AI-deflection guides, versioning and localization playbooks, and the CRAVA analytics loop.

## Trigger phrases
- "pick a KB platform"
- "set up a help center"
- "migrate Zendesk Guide"
- "add AI deflection to our docs"
- "fix our search no-results"
- "localize our KB"
- "set up llms.txt"
- "we need chat-with-your-docs"

## Do NOT route when
- The task is support inbox routing, SLA tiers, or ticketing workflow: that is `customer-support-tooling-wasp-drone`.
- The task is live chat widget HMAC/JWT identity verification or conversation routing: that is `live-chat-support-wasp-drone`.
- The task is organic keyword strategy, metadata optimization, or schema markup for KB articles: that is `seo-aeo-wasp-drone`.
- The user has chosen Pattern C AI deflection (a custom RAG endpoint) and needs the embedding model, vector store, or retrieval API implemented: this Drone specifies the KB export format and chunking inputs, then hands off to `mind-wasp-drone`.
- The user asks about HelpJuice specifics where no current data exists: answer from general knowledge, flag the research gap, and point to helpjuice.com/whats-new rather than guessing.

## Inputs the Drone needs
- Whether the scenario is greenfield, a platform migration, or an improvement to an existing KB (search, AI deflection, analytics, versioning, localization)
- The four hard filters for platform selection: developer-facing API hub, parallel versioning need, AI deflection Day 1, and 50+ language support
- Which AI deflection pattern fits: platform-native, Fin standalone or portal embedding, or custom RAG requiring a `mind-wasp-drone` hand-off
- Whether versioning, multi-language, or both are in scope, and the target locale count
- Whether Document360 is the recommended platform and the user can obtain a sales quote, since it has no self-serve pricing

## Outputs
- A scored platform recommendation naming a concrete trade-off and a fallback option
- A category hierarchy, article-template selection, and search-tag taxonomy
- A wired AI deflection configuration including the mandatory llms.txt Day-1 step
- A versioning or localization configuration matching the team's parallel-version or locale needs
- A `docs/kb-plan.md` for new setups, or a migration checklist for platform moves, plus the CRAVA analytics loop wiring
- An llms.txt and llms-full.txt file added as a Day-1 step on every new KB setup

## Commonly sequenced with
- `mind-wasp-drone` after: when Pattern C custom RAG is chosen, this Drone specifies the export format and chunking inputs before handing off implementation
- `customer-support-tooling-wasp-drone` alongside: when the KB deflection strategy must coordinate with ticketing SLA tiers
- `seo-aeo-wasp-drone` alongside: when KB articles also need organic-search optimization beyond the KB's own search
- `live-chat-support-wasp-drone` alongside: when the KB's AI deflection must hand off cleanly to a live chat escalation path
