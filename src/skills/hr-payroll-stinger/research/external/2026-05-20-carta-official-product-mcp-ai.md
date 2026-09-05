---
source_url: https://carta.com/equity-management/
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: critical
topic: carta-equity-handoff
stinger: hr-payroll-stinger
---

# Carta Official Equity + Plans + Blog (2026)

## Summary
Authoritative Carta product surface as of May 2026. Documents the 4-tier plan structure (Launch free / Build / Grow / Scale) with the Launch tier free for early-stage companies (under 25 stakeholders, $1M raised). Critically captures three major 2026 announcements: (1) Carta acquired Avantia Law (AI-native private equity law firm) and rebranded it Carta Law — May 13, 2026; (2) Carta MCP listed on Anthropic Connectors Directory with three Claude Plugins (Cap Table, Investors, CRM); (3) Carta CRM + Granola AI notetaker integration.

## Key quotations / statistics
- **Plan pricing structure (Equity Management):**
  - Launch: **Free** (up to 25 stakeholders, $1M raised) — full early-stage suite
  - Build: Contact for pricing (up to 50 stakeholders; adds white-glove onboarding, priced round modeling, deal closings)
  - Grow: Contact for pricing (adds board meetings, 409A valuations, Form 3921, 409A audit support)
  - Scale: Contact for pricing (adds ASC 718 US GAAP/IFRS reporting, audit support, Rule 701, exit modeling, IPO advisory, SSO for admins)
- **Pricing formula:** "Each package has a price per stakeholder with a minimum annual fee. Total price is based on number of stakeholders on your cap table and the package."
- **Launch (Free) includes:** Cap table mgmt, securities issuance, exercising/repurchasing, 83(b) forms, ISO management, investor management, equity reporting, **HRIS/payroll integration**, SAFE modeling and fundraising closings
- **Add-on products (any paid plan):** Total Compensation (salary/equity benchmarks); Equity Advisory (1:1 tax advisory); Liquidity (tender offers); QSBS Attestation (annual eligibility checks)
- **Coverage:** 1.7 million+ equity holders; full onboarding manager support
- **MAJOR 2026 ANNOUNCEMENTS:**
  - **"Introducing Carta Law (fka Avantia Law)" — May 13, 2026:** Carta acquired Avantia Law, an AI-native law firm specializing in private equity legal services. Avantia delivers LP transfers, KYC, fund documents at fraction of traditional law firm costs. Integration with Carta ERP. Existing Avantia and Carta customers continue service with full team retained.
  - **Carta MCP on Anthropic Connectors Directory** — vetted for security and compatibility; works with Claude.ai, Claude Code, Claude for Excel, Cowork, mobile
  - **Three Claude Plugins launched April 2026:**
    - Cap Table Plugin — Query ownership, valuations, model waterfalls/exits
    - Investors Plugin — Fund performance, company tear sheets, boardroom slides
    - CRM Plugin — Manage deals, fundraising, contacts in Claude or ChatGPT
  - **Carta CRM + Granola integration** — AI notetaker syncs meeting notes to Carta CRM after every call
  - **Document Intelligence for SPAs** — AI extracts 150+ fields from Stock Purchase Agreements, queryable via Plugin or data warehouse
  - **Internal:** Carta CLI lets internal teams run operations entirely within Claude (cash reconciliation, fund tax QA, custom reporting)
  - **CFO Symposium (May 2026)** hosted CFOs with live demos of AI querying Carta data for IRR/MOIC, LP tear sheets, Form ADV generation

## Annotations for stinger-forge
- **Carta Launch is free for startups under 25 stakeholders / $1M raised** — this is the recommended Carta entry point for ALL early-stage startups and should be the default recommendation in `guides/05-carta-handoff.md`. There is no reason for a pre-seed/seed company to delay Carta setup at $0
- The Launch tier includes HRIS/payroll integration, meaning the Carta-Gusto/Rippling/Justworks integration works on the free tier — strong argument for setting up Carta immediately when first equity grants are issued
- **Carta MCP + Claude Plugins are a meaningful AI-era differentiator** vs Pulley or other equity admin alternatives — surface in `guides/05-carta-handoff.md` for AI-native teams. The Cap Table Plugin (model waterfalls/exits via Claude) is the most valuable for founders running scenarios
- **Carta Law acquisition (May 2026)** expands Carta's surface into legal services (LP transfers, KYC, fund documents) — note this in `guides/05-carta-handoff.md` as a future expansion vector but flag that hr-payroll-worker-bee does NOT advise on legal services beyond the existing legal-advice fence
- The "Contact for pricing" model for Build/Grow/Scale tiers means stinger-forge cannot give concrete pricing in the recommendation; instead, frame it as "free until you outgrow Launch, then a sales conversation" — this is actually a strong argument for Carta over alternatives
- The 409A valuation included in Grow tier is the critical equity-admin trigger for any company about to grant options — surface the "you need a 409A before you grant your first option" rule in `guides/05-carta-handoff.md`
- The Granola AI notetaker integration into Carta CRM is tangential to hr-payroll-stinger's scope but useful context for understanding the broader Carta-AI ecosystem trajectory
