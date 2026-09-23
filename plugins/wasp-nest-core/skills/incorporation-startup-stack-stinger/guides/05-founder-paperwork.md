# Guide 05: Founder Paperwork (Minimum Viable Checklist)

Step 6: Complete the minimum founder paperwork after the entity is formed.

*Derived from: `research/external/83b-election-guide-2026.md`, `research/external/founder-paperwork-minimum-checklist-2026.md`*

---

## Correct order (deadline-driven)

> Entity formation → Stock purchase agreements + vesting → IP assignment (PIIA/CIIA) → **83(b) election within 30 CALENDAR DAYS** → Banking setup → Bookkeeping setup

The 83(b) election deadline makes the order non-negotiable. Complete stock agreements before 83(b) filing; complete 83(b) before banking (banking can wait; 83(b) cannot).

---

## 1. Stock purchase agreements + vesting schedule

**What:** Each founder signs a stock purchase agreement (SPA) with the company to receive their equity at a nominal price (e.g., $0.0001/share). The SPA includes a vesting schedule.

**Standard vesting (YC / Clerky default):**
- 4-year vesting
- 1-year cliff (25% vests at the 1-year mark)
- Monthly vesting thereafter

**Why it matters:** Vesting protects the company (and co-founders) if a founder leaves early. Without vesting, a departed co-founder retains full equity with no ongoing contribution.

**Tools:** Clerky includes SPAs in its formation package. Stripe Atlas provides a basic founders' agreement template. For a two-person founding team, Clerky is strongly preferred.

---

## 2. IP Assignment (PIIA/CIIA)

**What:** Proprietary Information and Inventions Agreement (PIIA) or Confidential Information and Invention Assignment Agreement (CIIA). Each founder assigns intellectual property created related to the company to the company.

**Why it matters:** Without an IP assignment, the company may not own its own codebase. VCs will require confirmation of IP assignment during diligence.

**What it covers:**
- Code, designs, inventions, and business ideas created for or related to the company
- IP created before the company was formed that relates to the company's business

**Attorney trigger:** If a founder has prior art, open-source contributions, or IP created at a previous employer that could be claimed by that employer, get an attorney before signing. See `guides/06-attorney-triggers.md`.

---

## 3. 83(b) Election — THE HARD DEADLINE

> **CRITICAL: This is a 30-calendar-day deadline from the date of stock issuance. Missing it is one of the most expensive and irreversible founder mistakes. There are no extensions.**

### What is an 83(b) election?

When a founder receives restricted stock subject to vesting, the IRS treats it as income as it vests — not at the time of grant. An 83(b) election tells the IRS: "I want to recognize income now, at the low grant price, not later when the stock is worth more."

**Example savings:** A typical founder equity grant can save $46,000+ in taxes with an 83(b) election. Source: `research/external/83b-election-guide-2026.md` (citing Pulley analysis).

### How to file in 2026

**Method 1: Electronic filing (new as of July 2025)**
IRS Form 15620 was launched in November 2024 and electronic filing became available in July 2025. This is the preferred method.
- File at: https://www.irs.gov/forms-pubs/about-form-15620
- File within 30 days of the stock issuance date

**Method 2: Paper filing (pre-July 2025 method, still valid)**
1. Write a letter to the IRS containing: your name, address, SSN; a description of the property; the date of transfer; the tax year; the fair market value of the property at time of transfer; the amount paid for the property; any restrictions on the property.
2. Send by certified mail with return receipt to the IRS Service Center where you file your personal income tax return.
3. Keep a copy with proof of mailing.

**Stripe Atlas note:** Atlas automatically files the 83(b) election for founders who receive stock as part of the Atlas formation package. Verify this with Atlas if using that platform.

### 30-day deadline tracker

> The 30-day window starts on the date the stock purchase agreement is signed or the stock is issued, whichever is earlier.
> 
> Example: Stock issued April 1 → 83(b) must be filed by **May 1**.

---

## 4. Initial Board Consent / Organizational Minutes

**What:** The first consent of the board of directors authorizes:
- Election of officers (CEO, Secretary, Treasurer)
- Adoption of bylaws
- Authorization of stock issuance
- Authorization of bank account opening

**Who provides this:** Formation platforms (Atlas, Clerky, Doola) provide a template or automated document. Most platforms generate this automatically.

---

## 5. Registered Agent

**What:** Delaware requires a registered agent with a Delaware street address to receive legal notices on behalf of the company.

**Included in:** All four formation platforms (year 1 included; typically $50–$100/year thereafter).

**After year 1:** Can stay with the formation platform's registered agent service or switch to Northwest Registered Agent ($125/year), Harvard Business Services ($50/year), or similar.

---

## 6. Business Bank Account Resolution

**What:** A corporate resolution (or board consent) authorizing the specified person(s) to open a bank account on behalf of the company. Required by banks.

**Where to get it:** Formation platforms provide a template. Banks sometimes have their own form.

---

## Founder paperwork checklist (for use with `templates/founder-paperwork-checklist.md`)

- [ ] Delaware Articles of Incorporation filed (formation platform)
- [ ] EIN received (IRS)
- [ ] Bylaws adopted (board consent / formation platform)
- [ ] Stock purchase agreement(s) signed (each founder)
- [ ] IP assignment agreement (PIIA/CIIA) signed (each founder + employee)
- [ ] **83(b) election filed within 30 days of stock issuance** (each founder with vesting)
- [ ] Initial board consent executed
- [ ] Registered agent setup confirmed
- [ ] Business bank account opened
- [ ] Bookkeeping platform connected

---

## What the checklist does NOT cover

- Cap table management software (Carta, Pulley) — recommended but not required at formation
- Founders' agreement / co-founder vesting dispute resolution — see `guides/06-attorney-triggers.md` if there's any tension
- State tax registration (depends on state of operations)
- Business licenses (depends on industry and state)
