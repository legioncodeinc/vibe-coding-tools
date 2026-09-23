# Example: Edge Case — International Founder

**Scenario:** Non-US founder (based in Germany), no SSN, planning to raise VC, wants Delaware C-Corp, complex holding structure question.

*Demonstrates: `guides/00-entity-type-decision.md`, `guides/01-formation-platforms.md`, `guides/02-ein-workflow.md`, `guides/03-banking.md`, `guides/06-attorney-triggers.md`*

---

## Founder profile (Angel input)

- Target use case: VC-backed SaaS
- Timeline: 2–3 weeks (standard)
- Team: Solo founder, German citizen, Germany-resident
- Budget: $400–$600 formation
- Revenue: $0
- No SSN; ITIN status unknown

---

## Step 1: Entity-type decision

**Angel output:**

> Qualifying question 1: "Do you intend to raise VC funding?" → Yes.
>
> Recommendation: **Delaware C-Corp**. Non-US founders can form Delaware C-Corps as the responsible party without a US Green Card or citizenship.
>
> **Additional flag for international founders:** If you are considering a Cayman Islands holdco structure (common for non-US founders with investors in the EU or Asia who cannot hold US C-Corp shares directly), you need an attorney before proceeding. See `guides/06-attorney-triggers.md`. For a simple Delaware C-Corp with US investors, proceed without a holding structure.

---

## Step 2: Formation platform

**Angel output:**

> Platform recommendation: **Doola** ($297–$597) or **Firstbase** ($399–$599).
>
> Rationale: Both platforms specialize in non-US founders. Doola offers ITIN support, which is critical because you do not have an SSN. Stripe Atlas is also viable but may require an ITIN before the EIN application.
>
> Clerky is not recommended here — it's optimized for US founders in the YC ecosystem and has less international support.

---

## Step 3: EIN (no SSN)

**Angel output:**

> Because you do not have a US SSN, you have two options:
>
> 1. **Use Doola's ITIN service** to obtain an ITIN first, then use the online IRS EIN application.
> 2. **Use Doola or Firstbase to handle EIN acquisition on your behalf** via Form SS-4 paper/fax (mark line 7b as "N/A — non-US responsible party with no SSN/ITIN"). This adds 2–4 weeks processing time.
>
> Doola's ITIN + EIN package is the most streamlined path for German-resident founders.

---

## Step 4: Banking

**Angel output:**

> Banking recommendation: **Relay Financial** as primary option.
>
> **Do NOT use Mercury as your primary account if you hold a German passport** — while Germany is not on the OFAC sanctions list, Mercury performed mass account closures in August 2024 for founders with passports from certain countries. Relay Financial has no such history and explicitly supports international founders.
>
> Relay features: $0–$30/month, FDIC pass-through up to ~$3M, 50 virtual/physical cards.
>
> Alternative: Mercury is usable for non-sanctioned-country founders and may work fine for German citizens — but Relay is the lower-risk option.

---

## Step 5: Founder paperwork

**Angel output:**

> Follow the same checklist as US founders. Key differences:
>
> - IP assignment: The PIIA should cover IP created anywhere in the world (not just the US). German employment law has specific rules about IP created by employees of German companies — if you currently or recently worked for a German employer and wrote relevant code, get an attorney to review the PIIA before signing.
>
> - **83(b) election:** File this even as a non-US founder if you are receiving restricted stock subject to vesting. The 30-day deadline applies regardless of citizenship.
>
> - **Form 5472:** As a non-US person owning a US corporation, you may be required to file IRS Form 5472. Flag this to your bookkeeper (Pilot) from day one.

---

## Attorney trigger raised

**Flag raised:** Potential Cayman holdco structure.

**Angel output:**

> If any of your investors are EU-based funds that cannot hold US C-Corp shares directly, you may need a Cayman Islands holding company structure. This is an attorney-required engagement. Refer to: Orrick International Startup Program, or a German startup law firm (Bird & Bird Germany, Taylor Wessing Germany) with cross-border transatlantic experience.
>
> For a simple Delaware C-Corp with US angel investors or US VCs, no holdco structure is needed. Proceed without an attorney if your investor base is US-only.
