# Guide 00: Entity Type Decision

The entity-type choice is Step 1 and determines everything downstream. Do not proceed to platform selection until this is resolved.

*Derived from: `research/external/delaware-c-corp-vs-llc-2026.md` (April 24, 2026, primary source)*

---

## The four qualifying questions

Ask the founder these questions in order. Stop at the first definitive branch.

1. **Do you intend to raise VC funding or accelerate equity growth?**
   - Yes → Delaware C-Corp. Full stop.
   - Unsure → Ask question 2.
   - No → Ask question 2.

2. **Will you have co-founders taking equity (vesting)?**
   - Yes → Delaware C-Corp (vesting mechanics are cleaner; QSBS eligibility requires C-Corp stock).
   - No → Ask question 3.

3. **Are you profitable from day one and intend to stay bootstrapped indefinitely?**
   - Yes → LLC (pass-through taxation, less compliance overhead).
   - No → Delaware C-Corp (entity type that investor docs expect).

4. **Are the founders non-US citizens or residents?**
   - Yes → See the international section below; platform choice and holding structure become more complex.
   - No → Proceed with the recommendation from questions 1-3.

---

## The C-Corp vs LLC comparison

| Factor | Delaware C-Corp | Delaware LLC |
|---|---|---|
| VC fundability | Required by most VCs | Deal-breaker for most VCs |
| QSBS tax exclusion (IRC §1202) | Up to $10M federal capital gains excluded (5-year hold) | Not eligible |
| Tax treatment | Double taxation at entity + shareholder level | Pass-through (single taxation) |
| Annual state cost | $450/year ($400 franchise tax + $50 annual report) | $300/year ($300 franchise tax) |
| Equity / vesting mechanics | Clean; 83(b) election applies | Complex operating agreement required |
| Conversion cost if wrong | $8K–$15K in legal fees + phantom tax liability on appreciated stock | n/a |
| Prevalence | 89% of US VC-backed companies (Carta 2024 dataset) | 11% |

**The conversion cost argument:** Founders who form an LLC to save ~$150/year in franchise tax and later need to convert to C-Corp for a VC investment face $8K+ in legal costs and potential phantom income tax on stock appreciation. The Delaware C-Corp default prevents this. Source: `research/external/delaware-c-corp-vs-llc-2026.md`.

---

## Delaware vs other states

Delaware is the default for three reasons: established case law (Court of Chancery), investor expectation, and the Stripe Atlas / Clerky / Doola / Firstbase all default to Delaware.

**Alternatives mentioned in 2026 sources:**
- Wyoming: Favorable for LLCs; $60/year filing fee; no state income tax. Not ideal for VC-backed C-Corps.
- Nevada: No state income tax, but the trust infrastructure is weaker than Delaware's.
- Texas: Emerging option post-Tesla/Musk Delaware saga (2025), but investor ecosystem still defaults to Delaware.

**Recommendation:** Default to Delaware for both C-Corp and LLC unless the founder has a specific reason to diverge. If a founder asks about alternatives because of the 2025 Delaware court rulings (Tesla comp invalidation), acknowledge the debate but note that VCs still expect Delaware and the practical friction of a non-Delaware entity outweighs the theoretical governance risk for most startups.

---

## Delaware franchise tax — avoiding the $76K trap

Delaware calculates franchise tax two ways. The state defaults to the **Authorized Shares Method**, which can produce a $76K+ bill for a startup that authorized 10M shares. The correct method is the **Assumed Par Value Capital Method**, which produces a ~$400 annual tax for most startups.

> **Action:** Always check the box for Assumed Par Value Capital Method on the Delaware annual report. Formation platforms (Atlas, Clerky, Doola) typically handle this correctly, but verify.

Source: `research/external/delaware-franchise-tax-official-2026.md`.

---

## International founder considerations

Non-US founders have additional structural complexity:

1. **Visa / immigration status** does not prevent forming a Delaware C-Corp as a non-US person.
2. **Banking restrictions:** Mercury closed accounts for sanctioned-country passport holders in August 2024. Relay Financial is the recommended alternative. See `guides/03-banking.md`.
3. **International holding structures** (e.g., Cayman Islands holdco → Delaware LLC → Delaware C-Corp) are used for tax efficiency in certain jurisdictions. This structure requires an attorney. See `guides/06-attorney-triggers.md`.
4. **IRS Form 5471/5472** may be required for international ownership. Flag to user.

---

## Output of Step 1

Produce a one-paragraph entity-type recommendation with: (1) recommended entity, (2) state of incorporation, (3) one-sentence rationale, (4) estimated annual cost, (5) any flags for the attorney-triggers checklist.

Example:

> "Recommended entity: **Delaware C-Corp**. Rationale: You intend to raise VC funding, and 89% of VC-backed US companies use this structure. QSBS eligibility requires C-Corp status and provides up to $10M in federal capital gains exclusion. Annual cost: $450/year. No attorney triggers identified at this stage."
