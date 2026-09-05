# Migration Playbook — Moving Between Payroll Providers

Use this guide when the user needs to migrate from one payroll platform to another, convert contractors to employees, or convert EOR workers to a local entity structure.

---

## General migration principles

1. **Never migrate mid-quarter.** Tax wage bases reset on January 1. Mid-year migrations require issuing two W-2s for the same year (one from the old platform, one from the new), which confuses employees and creates reconciliation work. If possible, plan the migration for January 1 of the new year.

2. **Plan for a 4-8 week transition.** Payroll platform migrations touch employee tax records, direct deposit info, benefits enrollment, and historical payroll data. Budget 4 weeks minimum; 8 weeks is comfortable.

3. **Do not cancel the old platform until the first payroll on the new platform runs successfully.** Run one test payroll on the new platform in parallel with the last payroll on the old platform before going live.

4. **Inform employees.** They will see changes in their pay stub presentation, their W-4 elections, and their benefits portal. Communicate the migration 2-3 weeks in advance.

---

## Gusto → Rippling migration

### When to migrate

- Headcount is approaching 50-75 and Rippling's unified platform becomes compelling
- The company is activating Rippling IT/MDM for device management and wants to unify with HR
- The company is expanding internationally and needs Rippling Global

### Migration checklist

**Pre-migration (4-6 weeks before go-live):**
- [ ] Request a Gusto admin export of all employee records (name, SSN/EIN, address, tax elections, direct deposit info, pay rates, hire dates)
- [ ] Export year-to-date payroll tax summaries per employee
- [ ] Export benefits enrollment records and carrier plan numbers
- [ ] Select Rippling go-live date (January 1 strongly preferred)
- [ ] Rippling implementation: set up Rippling company, configure payroll settings, import employee records
- [ ] Map Gusto benefits plans to Rippling benefits plans (carrier must be notified of administrator change)

**Migration week:**
- [ ] Run final Gusto payroll for the last pay period on Gusto
- [ ] Verify all Rippling employee profiles, tax withholding, and direct deposit are correct
- [ ] Run first Rippling payroll (may be a small test payroll or the first full pay cycle)
- [ ] Confirm employees receive pay correctly on Rippling

**Post-migration:**
- [ ] Download and archive all Gusto records before canceling the subscription (Gusto retains records for 7 years but you want local copies)
- [ ] Cancel Gusto subscription (do not cancel until you have successfully run payroll on Rippling)
- [ ] Issue corrected W-2s if migration happened mid-year (Gusto issues W-2 for the portion of year on Gusto; Rippling issues W-2 for the remainder)
- [ ] Notify benefits carriers of the administrator change

---

## 1099 Contractor → W-2 Employee conversion

### When this is triggered

- Classification matrix analysis reveals misclassification risk (see `guides/02-classification-matrix.md`)
- Company is formalizing a relationship with a long-term contractor
- Contractor requests employment status for benefits access

### Conversion checklist

**Before converting:**
- [ ] Consult an employment attorney if there is any misclassification dispute history or if back-tax exposure is material
- [ ] Review the contractor agreement for IP assignment, non-compete, and non-solicit provisions (these must carry forward to the employment agreement)
- [ ] Issue final 1099-NEC for the contractor period (for the tax year being converted in)
- [ ] Determine the conversion date (beginning of a payroll period)

**At conversion:**
- [ ] Issue employment offer letter with salary, equity, benefits, and start date
- [ ] Collect W-4 (federal withholding) and state equivalent (if required)
- [ ] Add employee to the payroll platform (Gusto, Rippling, Justworks) as a new W-2 employee
- [ ] Enroll in benefits at the next open enrollment or qualifying life event (employment start = qualifying event)
- [ ] File state new-hire report within 20 days

**After converting:**
- [ ] Issue 1099-NEC for the contractor period of the tax year (the contractor payments before conversion)
- [ ] Note: The employee will receive both a 1099-NEC (for contractor period) and a W-2 (for employee period) for the same year — this is correct and expected

---

## EOR → Local entity migration

### When this makes sense

- 5+ workers in one country and the multi-year EOR cost exceeds entity formation + local HR overhead
- The company wants deeper legal control over employment relationships in the country
- The country restricts EOR (Germany Arbeitnehmerüberlassung limits, China)

### Migration checklist

**Entity formation (parallel track, 8-16 weeks):**
- [ ] Engage local corporate counsel to form the entity (subsidiary or branch)
- [ ] Register with local tax authorities
- [ ] Open a local bank account (required for payroll)
- [ ] Register for local social insurance / employer contributions
- [ ] Set up local payroll (Rippling Global, local payroll vendor, or accountant)

**Employee transfer:**
- [ ] Issue new employment contracts with the local entity as the employer
- [ ] Transfer from EOR employment to local entity employment (in most countries this requires employee consent and often counts as a new employment relationship for statutory purposes)
- [ ] Ensure continuity of benefits and seniority recognition (critical in countries with statutory seniority protections like Germany, France, Japan)

**EOR exit:**
- [ ] Give the EOR the required notice period (typically 30-90 days per contract)
- [ ] Confirm all tax filings and social contributions are settled through the final EOR payroll date
- [ ] Cancel EOR contracts for transitioned employees
