# Phase 0 — Discovery and Intake

## Goal
Before any forensic work, establish: what materials the client has, what the engagement looked like, what deliverable format they want, and what defendant pieces apply to this case.

## Intake Questions (Ask These First)

Ask these as a single multi-part question — do NOT spread across multiple turns:

1. **Project name** — What's the project / app / engagement called?
2. **Engagement period** — Start date and end date of the relationship (or current status if ongoing).
3. **Defendants** — Confirm: ADA? DevPipe/Offshore Build? Both? Other parties?
4. **Spend range** — Approximately how much was paid total across the engagement?
5. **Materials available:**
   - Email archive (Gmail "forward as attachment" zip, or individual .eml files)?
   - Invoice PDFs and/or Stripe billing emails?
   - Git repository (URL or zip)?
   - WordPress audit log export (if WP site involved)?
   - Any technical audit reports already commissioned?
   - Account reports / marketing reports from ADA?
   - Original signed contracts?
6. **Deliverable format** — Word + Excel + PDF (default), or different?

## Output of Phase 0

Create the `forensic-output/` folder structure:

```
{ProjectName}/
└── forensic-output/
    ├── individual-messages/  (will fill in Phase 1)
    ├── threads/              (will fill in Phase 1)
    ├── invoices/
    │   ├── ada/
    │   └── devpipe/
    ├── legal/
    ├── other-attachments/
    ├── reports/
    └── pre-litigation-pack/  (will fill in Phase 8)
```

Also create a `case-facts.json` at the project root that will accumulate facts across all phases:

```json
{
  "project_name": "Pioneer AMS",
  "client_legal_name": "TBD",
  "client_principal": "TBD",
  "client_address": "TBD",
  "engagement_start_date": "YYYY-MM-DD",
  "engagement_end_date": "YYYY-MM-DD",
  "engagement_months": 0,
  "original_contract_value": null,
  "defendants": {
    "ada_applicable": true,
    "devpipe_applicable": true,
    "other_parties": []
  },
  "materials_available": {
    "email_archive": false,
    "invoices_pdf": false,
    "invoices_eml": false,
    "git_repo": false,
    "wp_audit_log": false,
    "audit_reports": false,
    "account_reports": false,
    "signed_contracts": false
  },
  "phases_complete": {
    "phase_1_emails": false,
    "phase_2_invoices": false,
    "phase_3_git": false,
    "phase_4_cve": false,
    "phase_5_audit_log": false,
    "phase_6_marketing": false,
    "phase_7_deliverables": false,
    "phase_8_pre_lit": false
  },
  "totals": {
    "documented_invoice_total": null,
    "extrapolated_invoice_total": null,
    "git_hours_delivered": null,
    "git_claimed_hours": null,
    "maintenance_overpayment_low": null,
    "maintenance_overpayment_high": null,
    "build_overpayment_low": null,
    "build_overpayment_high": null,
    "aggregate_damages_low": null,
    "aggregate_damages_high": null
  }
}
```

Update this JSON as you complete each phase. The Phase 7 deliverable builder reads from this file.

## Red flags that suggest the ADA/DevPipe pattern (proactive triggers)

If the user describes any of these without naming the parties, ask: "Does this involve Robert Hartwell / ADA or Sameer Khan / DevPipe?"

- "I paid an agency for a build, they subcontracted to a developer, and the developer is now charging me directly for maintenance."
- "I paid more than $100k for an app that doesn't really work."
- "They charge me for a virtual assistant I've never spoken to."
- "$149/month for hosting" + "WordPress" + "Avada theme"
- "$4,000 or $6,000 a month for maintenance"
- "The developer is in Pakistan"
- Mention of HighLevel / GoHighLevel CRM integration
- "Initial Build Vendor" mentioned anywhere in the history

## Decisions to make in Phase 0

- **Build all 11 deliverables, or subset?** Default = all 11. Subset only if the client explicitly says (e.g., "I only need the attorney memo").
- **Use ADA/DevPipe defendant profiles?** Default = yes. Read them now (`assets/defendant-profiles/`).
- **Include the .skill packaging step at the end?** Default = no (the .skill file is for distributing this skill itself, not for case packaging).
- **Naming convention** — Use `{ProjectName}_` prefix consistently on all deliverables. Replace "ExampleBooking" everywhere in the templates with the project name slug.

## Output checklist

By the end of Phase 0:
- [ ] `forensic-output/` folder structure exists
- [ ] `case-facts.json` exists with the intake answers
- [ ] You've read the relevant defendant profile(s)
- [ ] The user has confirmed the deliverable list
