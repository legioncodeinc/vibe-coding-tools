# Guide 06: Vesting Schedules

Vesting determines when an employee or founder earns their equity. Getting this wrong is expensive: improperly vested founders can create cap table problems that derail future fundraising, and employees who leave before their cliff get nothing (by design).

Source: [`research/external/2026-05-20-vesting-cliff-double-trigger-acceleration.md`](../research/external/2026-05-20-vesting-cliff-double-trigger-acceleration.md)

---

## The standard: 4-year vest, 1-year cliff

The industry standard vesting schedule for employee options and for founder equity (when vesting is applied retroactively at a priced round) is:

- **4 years total vesting**
- **1-year cliff:** No shares vest for the first 12 months. If the employee leaves before 12 months, they receive nothing.
- **Monthly vesting after cliff:** After the 1-year cliff, the remaining 75% of shares vest in equal monthly increments over the next 36 months.

**Example:** 48,000 options total.
- Month 0-11: 0 options vested.
- Month 12: 12,000 options vest (the 1-year cliff = 25% of total).
- Months 13-48: 1,000 options vest per month.
- Month 48: All 48,000 options are fully vested.

---

## Founder vesting

Founders often do not vest their own stock, which creates a risk: if a co-founder leaves early, they walk away with a large equity stake that they have not earned, permanently diluting the remaining founders and the company.

**Standard practice:** At the first priced round (Series A or significant Seed), institutional investors require founders to subject their stock to a vesting schedule. Common approaches:

1. **Retroactive 4-year vest from founding date:** The clock starts from when the company was founded. By the time of a Series A (18-24 months in), founders have already "earned" 18-24 months of vesting, leaving 24-30 months to complete.
2. **Fresh 4-year vest from funding date:** Less common (more dilution risk for founders if they leave); usually reserved for companies where the founding team has changed or is new.

> **Lawyer caveat:** Founder vesting involves restricted stock purchase agreements and potentially 83(b) elections (which must be filed within 30 days of the stock grant to prevent large tax bills at vesting). Have a startup lawyer set up founder equity before the first priced round.

---

## Acceleration on acquisition

Acceleration clauses let equity vest immediately (or faster) when the company is acquired or an executive is terminated.

### Single-trigger acceleration

Vesting accelerates automatically upon acquisition, regardless of what happens to the employee after the deal.

- **Pros:** Founder/employee gets full equity value at acquisition.
- **Cons:** Acquirers dislike it because newly-acquired employees have no incentive to stay. Single-trigger can derail acquisition negotiations.

### Double-trigger acceleration

Two conditions must both occur before acceleration triggers:
1. Acquisition closes.
2. Employee is terminated without cause (or constructively terminated) within a defined window (typically 12-18 months after closing).

- **Pros:** Acquirer can retain key employees with unvested equity as golden handcuffs. Much more acceptable to acquirers.
- **Cons:** If the employee is retained and happy, the acceleration never triggers.

**Standard recommendation:** Double-trigger for employees and executives. Negotiate single-trigger (or 50% single + 50% double) for founders, since founders are most often fired post-acquisition and most valuable during the integration period.

---

## Variations to know

| Variation | When it appears | Effect |
|---|---|---|
| **Shorter cliff (6 months)** | Competitive hiring markets; when 12-month cliff feels punishing | Employees vest 12.5% at 6 months; rest continues monthly |
| **Longer total vest (5 years)** | Later-stage companies competing with public equity | More retention; less attractive to candidates with competing offers |
| **Monthly from day one (no cliff)** | Advisor grants; part-time roles | Vesting starts immediately; no all-or-nothing cliff |
| **Immediate vesting on exercise + immediate sale** | Rarely appropriate; creates tax problems | Avoid |

---

## Board-approved grant language

The board resolution approving an option grant must specify the vesting schedule. Standard language:

> "The options shall vest over 48 months, with 25% of the total number of option shares vesting on the 12-month anniversary of the vesting commencement date and the remaining 75% of the option shares vesting in equal monthly installments over the following 36 months, subject to the optionee's continued service to the company."

Deviations from this standard language should be reviewed by a lawyer.

---

*See `guides/05-option-pool-management.md` for grant sizing benchmarks. See `templates/option-grant-checklist.md` for the pre-grant checklist.*
