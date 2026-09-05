# Guide 02: EIN Workflow

Step 3: Acquire an Employer Identification Number (EIN) for the new entity.

*Derived from: `research/external/irs-ein-workflow-official-2026.md`*

---

## What is an EIN and why is it required

An EIN (Employer Identification Number, also called a Federal Tax Identification Number) is the IRS's identifier for a business entity. It is required to:
- Open a business bank account (all banks require it)
- Process payroll
- File federal and state tax returns
- Sign contracts on behalf of the entity
- Apply for business credit

---

## Method 1: Online application (recommended for US founders)

**URL:** https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online

**Who can use it:** Any entity with a "responsible party" who has a valid US Social Security Number (SSN) or Individual Taxpayer Identification Number (ITIN).

**Processing time:** Immediate online confirmation. The EIN is issued in ~4 business days for the formal letter; the number itself is available at the end of the online session.

**Session requirements:**
- The session must be completed in one sitting (it times out)
- You need the responsible party's SSN/ITIN and legal name
- You need the entity's legal name exactly as filed in Delaware

**Responsible party rules:**
- For a C-Corp with co-founders, the responsible party is typically the CEO/President
- The responsible party must be a natural person (not another entity)
- The same SSN/ITIN cannot be used to apply for more than one EIN per business day

---

## Method 2: Paper Form SS-4

**When to use:** International founders without a SSN or ITIN must use paper Form SS-4.

**Download:** https://www.irs.gov/pub/irs-pdf/fss4.pdf

**Processing time:** 4–6 weeks by mail; ~2 weeks by fax.

**Fax number:** (855) 641-6935 (domestic entities)

**Key sections to complete:**

| Line | What to fill in |
|---|---|
| 1 | Legal name of entity exactly as filed in Delaware |
| 2 | Trade name (DBA), if any |
| 7a | Responsible party name (natural person, usually CEO) |
| 7b | SSN, ITIN, or "applied for" if ITIN pending |
| 8a | Entity type: Corporation |
| 8b | State of incorporation: DE |
| 9a | Reason for applying: Started a new business |
| 10 | Date business started (use formation date) |
| 11 | Closing month of accounting year: December (most startups) |
| 14 | Principal activity: describe in plain language (e.g., "software development") |

---

## Method 3: Via formation platform (Atlas, Clerky, Doola, Firstbase)

All four platforms handle EIN acquisition as part of the formation package. Stripe Atlas is the fastest (typically provides EIN within 1–2 business days alongside the entity formation).

**When to use this method:** When you are using a formation platform — it is simpler than applying independently and the platform ensures the entity name on the EIN application matches the Delaware filing exactly.

---

## International founder path (no SSN/ITIN)

Non-US founders without an SSN must either:
1. **Apply for an ITIN first** (IRS Form W-7; Doola offers ITIN support as part of its package), then use the online EIN application; OR
2. **Use paper Form SS-4** with "applied for" in line 7b and follow up after the ITIN is issued; OR
3. **Use a formation platform** (Doola, Firstbase) that handles the EIN acquisition on behalf of the international founder.

---

## What to do if the EIN doesn't arrive

1. Verify the responsible party's SSN/ITIN was entered correctly.
2. Check the IRS Business & Specialty Tax Line: (800) 829-4933 (Monday–Friday, 7am–7pm local time).
3. If using a formation platform, contact platform support — they have dedicated IRS liaison workflows.

---

## After receiving the EIN

1. Save the EIN confirmation letter (IRS CP 575 or online session printout) — banks and investors will ask for it.
2. Open the business bank account (see `guides/03-banking.md`).
3. Proceed to founder paperwork (see `guides/05-founder-paperwork.md`).
