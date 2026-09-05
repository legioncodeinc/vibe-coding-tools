# 12 — European Accessibility Act (EAA) — enforceable from 2025-06-28

The European Accessibility Act (Directive (EU) 2019/882, "EAA") became **directly enforceable across all 27 EU member states on 28 June 2025**. As of today (2026-04-25), it has been live for ten months. This is no longer a future concern — the question for any product reaching EU consumers is "are we compliant *now*", not "when do we plan to be."

This guide tells the Angel:

- what the EAA covers,
- who it applies to,
- the practical implication for the design system the Angel governs,
- where in the design-system folder this is enforced,
- when to escalate to `design-system-worker-bee` for a system-level response.

Sources:

- <https://accessible-eu-centre.ec.europa.eu/content-corner/news/european-accessibility-act-enters-force-2025-06-27_en> (EU AccessibleEU centre — official).
- <https://euperspectives.eu/2025/06/european-accessibility-act/>.
- <https://heurilens.com/blog/technical-ux/european-accessibility-act-eaa-2025-compliance-checklist>.
- <https://tobalt.eu/european-accessibility-act-2025/>.
- <https://www.btng.studio/articles/european-accessibility-act-ecommerce-complete-compliance-guide-for-online-retailers>.

---

## What the EAA covers

The Directive lists specific products and services. The Angel cares about the **digital surface** subset:

- **E-commerce services** — any website or app that sells products / services to EU consumers, including booking flows, subscription sign-up journeys, transactional portals.
- **Consumer banking services** — retail banking websites, apps, payment interfaces.
- **Audiovisual media services** — streaming, on-demand video, related apps.
- **Passenger transport services** — websites, apps, ticketing, real-time travel info for air, bus, rail, waterborne.
- **Electronic communications services** — including emergency communications.
- **E-books and dedicated reading software.**
- **Consumer-grade computer hardware, smartphones, OS** (mostly out of the Angel's design-review scope, but worth knowing).
- **Self-service terminals** — ATMs, ticket machines, check-in kiosks.

Beyond these, the Directive lists products too (TVs, telephony equipment, e-readers); the Angel's review focus is the **digital service** layer.

---

## Who it applies to

The EAA obligates **manufacturers, importers, distributors, and service providers** differently. For software products specifically:

- **You sell to EU consumers (B2C) → you are a service provider → you must comply directly.** This is true regardless of where the company is incorporated. A US-based SaaS selling to EU consumers is in scope.
- **B2B-only products are largely out of scope** of the consumer-service requirements, but watch for B2B2C surfaces (e.g., a SaaS that powers a B2C client's checkout — that surface still matters).
- **Microenterprise exemption** (services only): fewer than 10 employees AND annual turnover or balance-sheet total under €2 million. Both conditions must be true. Most products this Angel sees fail this exemption.

Practical implication: if the user's product reaches EU consumers, treat the EAA as in force. The Angel does not gate on jurisdiction.

---

## The practical implication for the design system

The EAA does not invent a new technical standard — it adopts **EN 301 549**, which in turn references **WCAG 2.2 AA** for digital content. So in operational terms:

> **WCAG 2.2 AA is the EU legal floor for any digital service this Angel governs.**

This is why `guides/11-wcag-2-2-baseline.md` is the WCAG 2.2 enforcement guide and this guide is the **why-it-matters-legally** guide. The Angel does not certify legal compliance — that is a lawyer's job. The Angel enforces the technical floor that makes legal compliance possible.

What that means for review:

- **Every UI review checklist item from `guides/11-wcag-2-2-baseline.md` is an EAA-relevant check** when the product reaches EU users.
- **Auth flows** that fail SC 3.3.8 (Accessible Authentication) are a direct EAA exposure for any in-scope service.
- **E-commerce checkout, banking, transport-ticket, and streaming-media flows** carry the highest enforcement risk because they map directly to the Directive's enumerated services.
- **The design brief should declare WCAG 2.2 AA conformance** and note that `00-design-brief.md` references this guide. If it doesn't, the Angel updates the brief first (per `guides/00-principles.md` rule #1).

---

## What the Angel changes about its review behavior under EAA

Almost nothing changes operationally — the Angel was already enforcing APG (`guides/00-principles.md` rule #4) and now WCAG 2.2 AA (`guides/11-wcag-2-2-baseline.md`). What changes is the **escalation tone**:

- A WCAG 2.2 AA failure in a product that reaches EU consumers is no longer "an accessibility nice-to-have." The Angel writes the delta in `templates/review-output.md` shape and tags it with `EAA RISK` so the developer knows the legal exposure exists.
- Findings on the **EAA-enumerated service surfaces** (checkout, banking, transport, streaming, e-books) get an extra severity bump in the review output: "Critical — EAA-enumerated service" rather than "Should fix."
- **Microenterprise self-declaration**: if the product owner believes the microenterprise exemption applies, the Angel does NOT validate that legally — the Angel notes "exemption claimed; consult counsel" in the review and continues enforcing the technical floor anyway, because the exemption is narrow and is not the Angel's job to certify.

---

## Where this lives in the design-system folder

The Angel expects the design-system folder to carry these artifacts; if any are missing, it adds them on first invocation per the open-folder-first rule:

1. **`00-design-brief.md` — Accessibility section.** Declares the conformance target ("WCAG 2.2 AA, EN 301 549, EAA-relevant"). Cites this guide and `guides/11-wcag-2-2-baseline.md`.
2. **Per-screen accessibility budget** in `04-screens/<screen>.md` for any EAA-enumerated surface (checkout, sign-in, banking, transport ticket, etc.). At minimum: keyboard map, focus order, target-size note, paste-allowed declaration on auth fields, drag alternatives.
3. **Component spec accessibility section** in `03-components/<component>.md` already exists per `templates/component-brief-with-wrap.md` — the Angel verifies it cites the matching APG pattern and any 2.2-relevant criterion.

---

## Penalties — context, not the Angel's primary concern

For situational awareness only — the Angel does not score legal exposure:

- **Fines** (varies by member state — Spain, Germany, France have published tariffs running into hundreds of thousands of euros for serious or repeated breaches).
- **Withdrawal of non-compliant products / services from the market.**
- **Liability for company officers** in some member states.
- **Active enforcement**: Germany and France were already enforcing equivalent national accessibility requirements before 2025-06-28; the EAA harmonizes the framework across all 27 member states.

The Angel's role is to make the technical floor solid. Legal exposure is the user's lawyer's job.

---

## When this escalates beyond ux-ui-worker-bee

Hand off to `design-system-worker-bee` per `guides/09-system-level-escalation.md` if any of the following:

- The user requests a **certified compliance audit** (this Angel doesn't certify; this is a paid audit-firm exercise).
- The user requests **EN 301 549 (rather than WCAG 2.2 AA) verification** — that's a deeper standard with mobile-app, hardware, and customer-support requirements beyond the design system.
- A **member-state-specific** override is needed (e.g., German BFSG transposition has additional reporting requirements).
- The product needs a **conformance statement** (the EU Accessibility Statement document) drafted — that is a legal-document task, not a design-system task.

---

## Cross-references

- `guides/00-principles.md` rule #4 — APG floor.
- `guides/11-wcag-2-2-baseline.md` — the technical floor the EAA legally requires.
- `guides/09-system-level-escalation.md` — handoff conditions.
- `research/2026-04-25-eaa.md` — research note.
- `research/2026-04-24-wai-aria-apg.md` — APG floor research.

---

*Caveat:* this guide is an engineering reference, not legal advice. The Angel's job is to enforce the technical floor. Any legal conformance question — am I exempt, what does my member state require, do I need an Accessibility Statement — escalates out of the design-system loop.
