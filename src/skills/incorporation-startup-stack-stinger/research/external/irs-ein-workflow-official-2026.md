---
source_url: https://irs.gov/EIN
source_url_2: https://www.irs.gov/instructions/iss4
source_url_3: https://llcstarters.com/how-to-start-an-llc/business-setup/ein/
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: critical
topic: ein-workflow
stinger: incorporation-startup-stack-stinger
---

# IRS EIN Application: Official Process and SS-4 Instructions (2026)

Sources: IRS.gov/EIN (updated March 26, 2026), IRS SS-4 Instructions (December 2025), LLCStarters guide (February 2026)

## Summary

The IRS provides four methods for obtaining an EIN: online (instant, US-based applicants with SSN/ITIN), by phone (international applicants, same-day during call), by fax (~4 business days), or by mail (4-6 weeks). The online method requires completing the session in one sitting (15-minute inactivity timeout). The responsible party must have a valid SSN, ITIN, or existing EIN. EIN is free from the IRS - beware of third-party sites that charge.

## Key quotations / statistics

### From IRS.gov (updated March 26, 2026):
- "Use this tool to get an EIN directly from the IRS in minutes for free. Answer questions and submit the application. If it's approved, we'll issue your EIN immediately online."
- "Beware of websites that charge for an EIN. You never have to pay a fee for an EIN."
- "Complete the application in one session. You can't save it for later. It expires after 15 minutes of inactivity."
- "Daily limit: You can apply for only 1 EIN per responsible party per day."
- Hours: Mon-Fri 6:00 a.m. - 1:00 a.m. (ET), Sat 6:00 a.m. - 9:00 p.m., Sun 6:00 p.m. - 12:00 a.m.
- "If your principal place of business is outside the U.S., apply by phone, fax or mail."
- "Form your entity through your state before you apply for an EIN. If you don't form your entity with your state first, your EIN application may be delayed."

### From IRS SS-4 Instructions (December 2025):
- "Apply for an EIN online. If you have a legal residence, principal place of business, or principal office or agency in the United States or U.S. territories, you can receive an EIN online and use it immediately."
- International applicants: "call 267-941-1099 (not a toll-free number), 6:00 a.m. to 11:00 p.m. (Eastern time), Monday through Friday."
- Fax: "Under the Fax-TIN program, you can receive your EIN by fax generally within 4 business days."
- Mail: "Complete Form SS-4 at least 4 to 5 weeks before you will need an EIN."

### From practitioner guide (February 2026):
- "You can only apply for an EIN after your LLC is officially formed."
- "After submitting, the IRS generates your EIN immediately on screen. You'll see a confirmation page with your new 9-digit number. Download or print this page right away — the IRS will also mail a confirmation letter (CP 575) to your address within 4-6 weeks, but the on-screen number is official and usable immediately."
- "Save the confirmation page as a PDF on your computer. Also take a screenshot. The IRS doesn't let you go back to this page once you close it."
- Mail EIN fax number (domestic): 855-641-6935. Mail address: Internal Revenue Service, Attn: EIN Operation, Cincinnati, OH 45999.

### Application steps (online):
1. Visit IRS.gov/ein and click "Apply Online Now"
2. Choose entity type (LLC, corporation, etc.)
3. Enter responsible party name and SSN
4. Enter LLC/company details (legal name, address, state, date of formation)
5. Select primary business activity
6. Choose accounting year and expected hiring timeline
7. Review and submit
8. EIN appears on screen immediately

### Method comparison table:
| Method | Processing Time | Best For |
|---|---|---|
| Online (recommended) | Instant | US-based applicants with SSN |
| Phone | Same day (during call) | International applicants or ITIN holders |
| Fax | ~4 business days | Can't use online or phone |
| Mail | 4-6 weeks | Last resort only |

## Annotations for stinger-forge

- **guides/02-ein-workflow.md:** The IRS online EIN application is the definitive step-by-step to encode. Include the 15-minute timeout warning and the "save your confirmation page" tip.
- **guides/02-ein-workflow.md:** The critical ordering: "form your entity FIRST, then apply for EIN" must be explicitly stated. Atlas handles this automatically; manual-formation founders commonly get this wrong.
- **guides/02-ein-workflow.md:** International founders (no US address) CANNOT use the online application. Must call 267-941-1099. Encode this as a branching point in the EIN workflow.
- **guides/02-ein-workflow.md:** EIN is free directly from IRS. Formation services (Atlas, Clerky, Doola) charge for handling EIN as part of their service fee - clarify this distinction for founders.
- The responsible party's SSN/ITIN is required. This is a blocker for international founders without a US SSN or ITIN.
