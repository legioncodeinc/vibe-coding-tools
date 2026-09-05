# Defendant Profile — Offshore Build Group / DevPipe / Sameer Khan

## Corporate identity

### Offshore Build Group LLC (original entity, 2023–2024)
- **Jurisdiction:** Delaware (US-registered shell)
- **Operating address:** Lahore, Pakistan
- **Principal:** Sameer Khan
- **Phone (registered):** [REDACTED PHONE]
- **Email:** contact@devpipe.example (shared with DevPipe), sameer@offshorebuild.example (early), sameer@devpipe.example (later), sameer.khan@example.com (personal)

### DevPipe LLC (rebranded entity, mid-2024 onward)
- **Initial mailing address:** Same as Offshore Build (Delaware registered, Pakistan operated)
- **Later mailing address (Mar 2026):** [REDACTED SUBCONTRACTOR ADDRESS — NJ]
- **LinkedIn URL:** linkedin.com/company/devpipe-ex-offshorebuild (literally identifies the rebrand)
- **Website:** devpipe.example

### The rebranding
Mid-2024, Offshore Build Group LLC began rebranding as DevPipe LLC. Invoices through April 2024 are issued under Offshore Build; invoices from July 2024 onward are issued under DevPipe. The LinkedIn slug "devpipe-ex-offshorebuild" confirms the continuity. Both entities have the same principal (Sameer Khan) and the same phone number.

This rebranding has a few interpretations:
- Operational rebrand (legitimate, normal business activity)
- Reputation-distancing from the Offshore Build name after issues with prior clients
- Forensically meaningful indicator of business-model evolution

### Stripe account IDs (for subpoena)
- **acct_REDACTED_A** — Offshore Build / early DevPipe (2024–2025)
- **acct_REDACTED_B** — Late DevPipe (Mar 2026 onward)

Both should be subpoenaed for the complete billing history. The Example Booking Co. case captured only a partial picture of these; full Stripe records will fill in the $6,000/month Platinum Maintenance era that the email archive missed.

## Personnel observed (the actual team)

Per the Example Booking Co. git log, the Offshore Build / DevPipe team is small:

| Name | Role | Approx. Commits | Approx. Hours |
|---|---|---|---|
| Sameer Khan | Lead developer | 176 | 414 |
| Ravi Sharma | Senior developer | 316 | 200 |
| Imran Hussain | Junior developer | 10 | 19 |
| Faisal | Junior developer | 4 | 9 |
| Bilal | Junior / QA | (limited git activity) | (limited) |
| "Tariq" | Minor contributor | 1 | 0 |

Two operators (Sameer + Ravi) account for ~95% of the work. The "team of US-based engineers" implied by $100/hour pricing does not exist. The actual team is 2 senior Pakistan-based developers plus 2–4 junior contributors.

## Business model (the "offshore arbitrage" pattern)

1. Sameer Khan registers a Delaware LLC (US-credible).
2. He markets to US-based clients (directly or through middlemen like ADA) at US-premium rates ($100/hour contract rate).
3. Actual labor is performed in Pakistan at ~$30/hour true labor cost.
4. The markup (~$70/hour) is gross margin for Offshore Build.
5. For long-running engagements, he pitches a "Platinum Maintenance" retainer at $4,000–$6,000/month claiming 80 hours of work.
6. Actual work delivered is closer to 20–25 hours/month (consistent with industry-standard for a similarly-sized SaaS, but at far less than the claimed 80 hours).
7. The dependency lockfile is never updated. The framework stays at end-of-life versions. Routine security maintenance is not performed.

## Software-quality signature

Across the Example Booking Co. engagement, Offshore Build/DevPipe's delivered codebase exhibited:

- **Web shell deliberately installed** in production (`django-webshell` package in INSTALLED_APPS)
- **OAuth credentials hardcoded** in source code (HighLevel CRM)
- **Public-read S3 ACLs** for all uploaded customer files
- **Unauthenticated webhook endpoints** allowing arbitrary admin account creation
- **Hardcoded default passwords** ("TempPass123@" in the webhook flow)
- **Zero automated tests**
- **No CI/CD pipeline**
- **End-of-life framework** (Django 3.2, EOL April 2024)
- **Single-worker gunicorn** in production

Each of these is a first-day-of-a-security-class failure. The presence of multiple, simultaneously, in production is gross negligence under any reasonable interpretation of the standard of care for software engineering.

## Invoice patterns

### Stripe invoice numbering
Format: `{STRIPE_SUBACCOUNT_PREFIX}-NNNN` where NNNN increments per Stripe sub-account.
- **STRIPE_PREFIX_A-0006** (early 2024) — earliest observed Offshore Build invoice
- **STRIPE_PREFIX_B-NNNN** (2024–2025 main run)
- **STRIPE_PREFIX_C-NNNN** (late 2025)
- **STRIPE_PREFIX_D-NNNN** (2026)

The Stripe prefix changes when a new sub-account is registered. Each prefix change is a forensically meaningful event — sub-accounts are typically registered when a vendor wants to separate revenue streams or when a previous sub-account is closed.

### Platinum Maintenance billing
- **Period 1:** Approximately Q1 2024 — early 2025, $6,000/month, claimed 80 hours
- **Period 2:** March 2025 — April 2026, $4,000/month, claimed 80 hours (reduced after client questioned the rate)
- The $6,000 → $4,000 reduction is itself an admission: a price drop of 33% without scope reduction implies the original price was inflated.

### One-off project invoicing
Offshore Build also bills for discrete projects (rebuild milestones, bug fix work, "creating demo videos"). These appear in the email archive as separate invoices in the $400 – $4,050 range.

## Service Agreement (OFFSHORE BUILD GROUP LLC, dated Nov 1, 2023)

The Service Agreement governs the rebuild engagement. Key provisions:
- $100/hour billing rate
- Monthly invoicing with itemized hours
- Additional costs require written approval
- Termination provisions (likely 30-day notice; verify against the specific agreement on file)
- Indemnification language (may apply for security defects)
- Source code ownership: typically work-for-hire under MSA

The MSA is in evidence at `legal/OFFSHORE BUILD GROUP LLC (Service Agreement).docx (1).pdf` for the Example Booking Co. case.

## How to attack the DevPipe defensive posture

The likely defenses and counter-arguments:

1. **"We were never paid the contracted rate."** — Counter with Stripe records showing exactly what was paid.
2. **"The maintenance hours included non-git activities like server admin."** — Demand specific timesheet records and server-admin logs. The defendants cannot produce them.
3. **"The security defects were the client's responsibility to configure."** — The defects are in source code, not configuration. The web shell is in INSTALLED_APPS. Hardcoded credentials are in the code itself.
4. **"The client never raised objections at the time."** — Show the audit timeline: the client raised objections after the independent audit was commissioned.

## Personal liability / veil-piercing

Because:
- Offshore Build Group LLC and DevPipe LLC operate from Pakistan but are registered as Delaware/NJ shells with minimal US assets
- The entities appear to be alter-egos of Sameer Khan personally
- The fraud (billing for hours not worked, charging for maintenance not performed) was perpetrated through the entities

… there is a credible veil-piercing argument to reach Sameer Khan personally. The personal liability notice in the Demand Letter to DevPipe expressly references this.

For Pioneer AMS or any sibling case, evaluate veil-piercing factors:
- Commingling of personal and corporate funds (request bank records)
- Failure to maintain corporate formalities (request board minutes — there won't be any)
- Undercapitalization of the entity (the LLC has minimal capital relative to the claimed business volume)
- Use of the corporate form to perpetuate fraud (the billing pattern itself)

## Service of process

Both Offshore Build Group LLC and DevPipe LLC have US-registered agents and can be served in the US:
- Delaware Secretary of State (for Offshore Build Group LLC)
- New Jersey (for current DevPipe LLC at [REDACTED SUBCONTRACTOR ADDRESS — NJ])

Do NOT attempt to serve in Pakistan. The Hague Convention timeline is 6+ months and the operating address may not be a registered business location.

## Email / domain inventory for subpoena

- sameer@devpipe.example (current primary)
- sameer@offshorebuild.example (early)
- sameer.khan@example.com (personal)
- contact@devpipe.example (shared)
- bilal@devpipe.example (team)
- 00000001+sameer.khan@users.noreply.github.com (GitHub noreply for Sameer)
- 00000002+devpipe@users.noreply.github.com (DevPipe bot account on GitHub)
- 00000003+ravisharma@users.noreply.github.com (Ravi)
- ravi.sharma@example.com (Ravi personal)
