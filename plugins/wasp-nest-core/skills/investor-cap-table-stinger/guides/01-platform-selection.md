# Guide 01: Cap Table Platform Selection

Choosing the right cap-table platform before there is data to migrate is the highest-leverage decision in this domain. Re-migration is painful, time-consuming, and error-prone. Get it right the first time.

Source: [`research/external/2026-05-20-carta-vs-pulley-vs-angellist-platform-comparison.md`](../research/external/2026-05-20-carta-vs-pulley-vs-angellist-platform-comparison.md), [`research/external/2026-05-20-cake-equity-capdesk-international-platforms.md`](../research/external/2026-05-20-cake-equity-capdesk-international-platforms.md)

---

## 2026 platform landscape

> **AngelList Stack sunset (August 2026).** AngelList Stack stopped accepting new customers in August 2026. It is no longer a viable option for new startups. Existing customers continue on legacy plans. Source confirmed by 3 independent practitioner sources.

The active platforms for US founders are:

| Platform | Best fit | Key strength | Pricing (approx.) |
|---|---|---|---|
| **Carta** | Post-seed, Series A+ | Deepest investor ecosystem integration; 409A service; most VCs already use Carta to view portfolio | From ~$2,400/yr (Launch plan) |
| **Pulley** | Pre-seed through Series A | Simpler UX; better modeling tools; more responsive customer support for early-stage; faster onboarding | From ~$600/yr; free tier available |
| **Cake Equity** | Non-US (AU, UK, EU, SG) with US operations | International equity plan support; multi-jurisdiction | Contact pricing |
| **Capdesk** | Europe-focused, Series A+ | Strong UK/EU legal compliance; board approval workflows | Contact pricing |

---

## Decision tree

### Step 1: Are you a US Delaware C-Corp?

- **Yes** → proceed to Step 2.
- **No (UK, EU, Australia, other)** → Cake Equity or Capdesk are the recommended options. Carta and Pulley have limited or no support for non-US equity schemes (EMI, EIS/SEIS, ESS, phantom stock). See `guides/00-principles.md` for jurisdiction caveats.

### Step 2: Have you raised a priced round yet (Seed with preferred stock, or Series A)?

- **No (only SAFEs outstanding, no priced preferred stock)** → Pulley is the better starting point. Carta's features are more powerful but the complexity and pricing are calibrated for companies with institutional investors already on the cap table.
- **Yes (priced preferred shareholders, board approval workflows needed)** → Carta is the better choice. Institutional investors are more likely to be familiar with Carta's investor portal, and the 409A service integration is more valuable once you have preferred shareholders.

### Step 3: Does your lead investor or board require a specific platform?

Some institutional investors (especially funds with large portfolios) strongly prefer Carta because they use it to consolidate their portfolio views. Ask your lead investor before signing up.

If the investor requires Carta, use Carta regardless of Step 2.

---

## Platform deep-dives

### Carta

**What it does well:**
- Investor portal: investors can view their holdings, accept electronic securities, and see portfolio performance.
- 409A valuations: Carta provides 409A valuations as a service (currently $1,500-$5,000 depending on complexity, 5-15 business day turnaround). Carta Data Rooms for Series A and later due diligence.
- Most widely adopted: if a founder's investors already use Carta, there is no friction on the investor side.
- Carta Launch (free tier for companies with <25 stakeholders): good for very early stage.

**What it does less well:**
- Pricing jumps significantly at the first priced round tier.
- Support response times at lower tiers can be slow.
- Modeling tools (scenario modeling for a raise) are functional but not as intuitive as Pulley's.

**When Carta is the right choice:** You have raised a priced round, or your lead investor uses Carta, or you want the 409A service integrated.

### Pulley

**What it does well:**
- Cleaner UX and faster onboarding for early-stage teams.
- Better scenario modeling (waterfall analysis, round modeling) for founders planning raises.
- More responsive customer success for early-stage (founder-friendly pricing and support).
- Free tier available with more generous limits than Carta's free tier.

**What it does less well:**
- Investor portal is less polished than Carta's.
- Fewer institutional investors are familiar with Pulley's investor view.
- 409A is available but not as deeply integrated as Carta's.

**When Pulley is the right choice:** Pre-seed or seed stage, no priced preferred stock, investor is not a Carta-first fund.

### Cake Equity

**What it does well:**
- International equity plan support: Australia (ESS), UK (EMI, SUS), US (ISO/NSO), Singapore, and more.
- Multi-jurisdiction cap table for companies with employees in multiple countries.
- Strong compliance workflows for jurisdictions with strict equity reporting requirements.

**When Cake Equity is the right choice:** Non-US founding team, or US company with significant international employee equity.

### Capdesk

**What it does well:**
- Europe-focused: strong UK and EU legal compliance.
- Board approval workflows and electronic board minutes built in.
- Good investor portal for European institutional investors.

**When Capdesk is the right choice:** UK or European company with institutional investors who expect Capdesk-style workflow.

---

## Common mistakes to avoid

- **Staying on a spreadsheet too long.** Migrate to a platform before the first SAFE is signed. Retroactively importing is harder than starting on-platform.
- **Choosing Carta before you need it.** Carta's higher pricing is justified by its ecosystem once you have institutional investors. Before that, Pulley is a better fit for most founders.
- **Ignoring investor preference.** Ask your lead investor which platform they use to view portfolio companies before committing.

---

*See `examples/platform-selection-seed-stage.md` for a worked example. See `guides/00-principles.md` for the no-spreadsheets and jurisdiction rules.*
