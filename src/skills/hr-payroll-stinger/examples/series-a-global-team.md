# Example: Series A Team — US Employees + International Contractors

This example walks through the most common decision hr-payroll-worker-bee faces: a 15-person US startup with 3 international contractors deciding between **Gusto + Deel** vs **Rippling Global**.

---

## Company profile

- **Company:** SynthFlow (fictional B2B SaaS)
- **Stage:** Series A, $8M raised
- **US headcount:** 12 W-2 employees (10 engineers, 1 designer, 1 PM)
- **International:** 3 contractors — 1 in Germany, 1 in Brazil, 1 in UK — all long-term (18+ months), all integral to product development
- **Current setup:** Gusto for US payroll, direct bank transfer for contractors (no formal 1099/EOR structure)
- **Equity:** Options issued; Carta set up; Gusto-Carta connected
- **Growth plan:** 5 more US hires and 2 more EU hires in 12 months
- **Question:** Should we stay on Gusto + add Deel for international, or move everything to Rippling?

---

## Step 1: Classify the international workers

Using `guides/02-classification-matrix.md`:

| Worker | Location | Duration | Control factors | Classification risk |
|---|---|---|---|---|
| German engineer | Germany | 22 months | Company sets daily tasks, reviews work daily, worker has no other clients | HIGH — likely an employee under German law; Germany added €50k misclassification penalty in 2025 |
| Brazilian developer | Brazil | 18 months | Similar daily task direction, no other clients | HIGH — Brazilian CLT presumption of employment |
| UK designer | UK | 14 months | Moderate direction; designer does have 2 other clients | MEDIUM — may fall inside IR35; UK end-client assessment required |

**Finding:** All three international workers exhibit employee characteristics. Continuing as direct-transfer contractors creates material legal exposure in Germany and Brazil. The company needs EOR for all three.

---

## Step 2: Evaluate Gusto + Deel vs Rippling Global

### Option A: Stay on Gusto + add Deel

**Cost estimate (US 12 employees, 3 EOR):**
- Gusto Plus: $80 + (12 × $12) = $224/month
- Deel EOR (3 employees): 3 × $599 = $1,797/month
- **Total: ~$2,021/month**

**Pros:**
- No migration required for US payroll (Gusto is already running)
- Gusto-Carta integration stays intact (Rippling-Carta integration would need to be re-established)
- Gusto is simpler for the team's current size

**Cons:**
- Two separate platforms for US vs international (splits HR data)
- No unified headcount planning or org chart
- If the company grows to 50+ US employees in 24 months, it will want to migrate to Rippling anyway

### Option B: Migrate everything to Rippling Global

**Cost estimate (12 US employees + 3 EOR, Rippling):**
- Rippling Unity + Payroll + HR + Benefits modules: estimated $24/employee × 12 = $288/month
- Rippling Global EOR (3 employees): custom pricing (typically $400-600/employee via Rippling) — estimated $1,500/month
- **Total: ~$1,788/month** (estimate; requires Rippling demo for exact quote)
- **Implementation cost:** 6-8 weeks of engineering/HR time; approximately $5-15k equivalent in internal time

**Pros:**
- Unified platform for US + international
- Strong integration with Rippling IT if the company uses Rippling for device management
- Better reporting and org chart tooling as the company scales
- No second migration when headcount reaches 50+

**Cons:**
- Migration effort (4-6 weeks minimum)
- Gusto-Carta integration must be re-established with Rippling-Carta
- Higher per-employee cost at current headcount; parity around 20-25 employees

---

## Step 3: Recommendation

**For SynthFlow at Series A with 12 US employees and 3 international, the recommendation is:**

**Option A (Gusto + Deel) for the next 12 months if the priority is speed.** Add Deel immediately to bring the German and Brazilian workers onto EOR. Address UK IR35 via a Status Determination Statement. Revisit Rippling migration when US headcount reaches 30+.

**Option B (Rippling Global) if the company prioritizes unified platform and has the capacity for a 6-week implementation.** The $5-15k implementation cost is worth it if the company expects to reach 30+ US employees and 5+ international within 24 months.

---

## Step 4: Action items (Option A path)

1. **Immediately:** Start Deel EOR onboarding for the German and Brazilian engineers. Target: active EOR contracts within 14 days. Cost: $599/employee/month each.
2. **Week 1:** Complete UK IR35 Status Determination Statement for the UK designer. If "inside IR35," engage Deel or Remote.com EOR for the UK worker as well.
3. **Month 1:** Verify Gusto-Carta integration is pulling all 12 US employees correctly (post-Series A employee additions may have gaps).
4. **Month 3:** Reassess: if additional EU hires are planned (2 more in 12 months per growth plan), begin Rippling evaluation in parallel.
5. **Month 12:** If US headcount is at 20+, initiate Rippling demo and migration planning for January 1 next year.
