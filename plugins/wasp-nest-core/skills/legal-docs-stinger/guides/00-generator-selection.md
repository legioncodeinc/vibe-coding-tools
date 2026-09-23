# Generator Selection: Termly vs Iubenda vs Osano vs Contractbook

Primary entry point for all legal document generation tasks. Choose the right tool before generating; switching after is costly.

**Source:** `research/external/2026-05-20-termly-vs-iubenda-comparison.md` + `research/external/2026-05-20-generator-landscape-2026.md`

---

## The four options

| Platform | Best for | Pricing (2026) | GDPR depth | US state laws | CMP bundled |
|---|---|---|---|---|---|
| **Termly** | US-first SaaS, non-technical users, multi-document bundle | Free / ~$120-180/yr | Adequate | Excellent (CCPA, CPRA, Virginia, Colorado, Connecticut) | Yes |
| **Iubenda** | EU-first SaaS, GDPR audit readiness, per-service modular policies | Free / ~$27-99/yr | Deep (EU attorneys) | Adequate | Yes (Cookie Solution) |
| **Osano** | Enterprise-grade, privacy ops at scale, DPA management | $3k+/yr | Deep | Deep | Yes (enterprise CMP) |
| **Contractbook** | MSA / NDAs / commercial contracts (not compliance docs) | Usage-based | N/A | N/A | No |

---

## Decision matrix

Answer these five questions in order. Stop at the first match.

### Q1: Budget?

- **< $200/yr:** Termly or Iubenda (see Q2)
- **$1k-$10k/yr, privacy program needed:** Osano
- **Commercial contracts only (MSA/NDA):** Contractbook

### Q2: Where are your users?

- **US-majority (CCPA/CPRA focus):** Termly
- **EU-majority (GDPR audit required, 5-year consent logs):** Iubenda
- **Both:** Iubenda for GDPR layer + Termly ToS template is a workable split; or Termly alone is adequate for MVP

### Q3: Do you need a Cookie Consent Management Platform (CMP) bundled?

- **Yes:** Both Termly and Iubenda include a CMP. Termly's CMP supports IAB TCF v2.3; Iubenda supports IAB TCF v2.2 (gap — see Cookie Notice guide).
- **No:** You can use any generator and add a standalone CMP (Cookiebot, CookieYes, Axeptio) if needed later.

### Q4: Do you have significant Quebec (Law 25) or LGPD (Brazil) exposure?

- **Yes:** Neither Termly nor Iubenda fully covers Quebec Law 25 or LGPD as of 2026. Flag this gap: use a generator for the base privacy policy, then supplement with Law 25-specific attorney review (TIA requirement, privacy-incident register). See `guides/06-compliance-posture-matrix.md`.
- **No:** Either generator is sufficient.

### Q5: SaaS-specific service descriptions needed (Google Analytics, Stripe, Mailchimp integration disclosures)?

- **Yes:** Iubenda's modular model is superior — it has pre-built service descriptions for 1,700+ services.
- **No:** Termly's questionnaire approach is faster.

---

## Termly quick-start (questionnaire flow)

1. Create account at termly.io.
2. Add website → Privacy Policy → answer the questionnaire (data categories, third parties, jurisdiction).
3. Add Terms of Service (free tier) → download or embed.
4. Enable Cookie banner (requires paid plan to remove Termly branding; 10,000 banner views/month on free tier).
5. Download generated documents as HTML or markdown for attorney review.

## Iubenda quick-start (service-based flow)

1. Create account at iubenda.com.
2. New Privacy Policy → add services from the library (Google Analytics, Stripe, AWS, etc.) — these are pre-drafted GDPR-compliant descriptions.
3. Set data controller details, DPO if applicable, language.
4. Enable Cookie Solution for banner + consent logs.
5. Export policy text for attorney review.

---

## Limitations of generator output (always surface these)

- Generators produce a legally reasonable template, NOT a jurisdiction-specific legal opinion.
- **Quebec Law 25:** neither Termly nor Iubenda explicitly covers Law 25 TIA requirement as of 2026. Attorney review required for Quebec exposure.
- **IAB TCF v2.3 vs v2.2:** Termly is on TCF v2.3; Iubenda is on v2.2. If EU AdTech compliance is in scope, verify current standard with IAB (https://iabeurope.eu/tcf/).
- **UK DUAA (Data Use and Access Act 2025):** neither generator confirmed UK DUAA compliant as of 2026 research. UK-exposed SaaS needs attorney review.
- **LGPD (Brazil):** generators treat LGPD as GDPR-analogous; Brazil-specific obligations (ANPD registration) require Brazil-specialized attorney.

---

## The attorney-review invariant

Generator output is a **starting point**. Close every generator-based output with:

> "This is a generated draft for reference. Have a qualified attorney licensed in your jurisdiction review all legal documents before publishing or countersigning."
