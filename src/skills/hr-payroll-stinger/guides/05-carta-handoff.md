# Carta Handoff — Equity Administration Integration

Use this guide when the user needs to connect payroll to Carta for equity administration, option exercise tax reporting, or RSA/RSU withholding.

---

## When to set up Carta

| Trigger | Timing |
|---|---|
| Company plans to grant stock options (ISOs or NSOs) | Before first grant (set up Carta first; connect payroll second) |
| Pre-409A valuation | Set up Carta cap table before the 409A; payroll integration less urgent |
| Post-409A, options are in-the-money | Connect payroll to Carta before any exercises (tax reporting required at exercise) |
| RSA cliff vesting event | Connect payroll before first vest date (83(b) elections and payroll withholding) |
| RSU grants | Connect payroll before first vest date (RSU vesting is a taxable event; payroll must withhold) |
| Pre-Series A | Carta setup is urgent; set up cap table before issuing founder shares with tax treatment intent |

**Guiding principle:** Set up Carta before issuing equity. Setting up Carta after issuing equity without proper 83(b) elections is expensive to fix.

---

## Payroll platforms with Carta integration (2026)

| Platform | Integration type | Notes |
|---|---|---|
| **Gusto** | Native (direct API sync) | Carta's recommended integration for Gusto users; daily sync of employee data |
| **Rippling** | Direct Carta integration | Listed in Carta's integration catalog; Rippling pushes employee status changes |
| **Justworks** | Daily sync via Carta integration | Justworks listed in Carta's integration catalog |
| **Deel** | Verify at carta.com/integrations | As of research (2026-05), Deel is NOT listed as a direct Carta integration partner; may be available via Finch (middleware) |
| **Remote.com** | Verify at carta.com/integrations | Verify Finch availability for Remote.com before recommending |
| **ADP Workforce Now** | Via Finch middleware | Finch connects Carta to ADP; adds a middleware layer |

> **Open question (OQ-3 from research):** Deel's Carta integration status was not confirmed in research. Before recommending a Deel + Carta combo for equity-heavy startups, verify at https://carta.com/integrations. If Deel lacks native Carta integration, this is a meaningful selection factor against Deel.

---

## Integration setup workflow (Gusto example)

1. **Create a Carta account** and import or build the cap table (founders, early employees, option pool)
2. **Connect Gusto to Carta:**
   - In Carta: Settings → Integrations → Payroll → Connect Gusto
   - Authorize the OAuth connection with Gusto admin credentials
   - Map Carta employees to Gusto employee records (by email match or manual assignment)
3. **Verify employee sync:** Carta should now receive daily updates for employee status changes (new hires, terminations)
4. **Set up equity plan** in Carta (option pool, plan document, 409A if needed)
5. **Configure option exercise notifications** to flow to payroll (NSO exercises are ordinary income; payroll must withhold)

---

## Tax events that require payroll-Carta coordination

| Event | Tax treatment | Payroll action required |
|---|---|---|
| ISO exercise (in-the-money) | AMT preference item; no ordinary income tax | No immediate payroll withholding; Carta issues 3921 at year end |
| NSO exercise (any spread) | Ordinary income on spread | Payroll must withhold federal + state income tax + FICA on spread amount; Carta triggers payroll event |
| RSA vesting (no 83(b)) | Ordinary income on FMV at vesting | Payroll must withhold on FMV at each vest; Carta triggers vest event |
| RSA 83(b) election | Taxed on FMV at grant (usually $0) | No ongoing withholding (taxed at grant); 83(b) must be filed within 30 days of grant |
| RSU vesting | Ordinary income on FMV at vest | Payroll must withhold; most common approach is sell-to-cover (Carta can automate) |
| ESPP purchase | Ordinary income on discount at purchase or sale | Complex; consult a CPA for ESPP plan setup |

---

## 409A valuation timing

A 409A valuation is required:
- Before any option grants (options must be at or above FMV to qualify as ISOs)
- Annually (or within 12 months of the last event triggering a new valuation)
- After any significant event (funding round, acquisition offer, material business change)

**Key rule:** Issue options only when you have a current 409A. Backdating options to a below-market exercise price creates a 409A violation (20% excise tax on the employee + 20% company penalty). Carta will flag expired 409As before grants.

---

## Founder equity — pre-incorporation checklist

Before setting up Carta:

- [ ] Incorporate the company (Delaware C-Corp is standard; Carta only supports C-Corps and LLCs)
- [ ] Adopt a Certificate of Incorporation with authorized share structure
- [ ] Issue founder shares with a vesting schedule (typically 4-year, 1-year cliff)
- [ ] File 83(b) elections within 30 days of share issuance (critical; missed deadline cannot be retroactively fixed)
- [ ] Get a 409A valuation before issuing any options to employees
- [ ] Set up the option pool in the cap table (typically 10-20% of fully diluted shares pre-Series A)
