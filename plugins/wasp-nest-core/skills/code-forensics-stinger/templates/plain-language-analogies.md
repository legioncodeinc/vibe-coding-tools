# Plain Language Analogies

The Plain Language Report uses one extended analogy throughout to make technical findings comprehensible to a non-technical client. Pick ONE analogy per case and use it consistently. Below are the supported analogies with their canonical mappings.

## Default: House Construction (used in Example Booking Co. V2/V3)

| Technical Finding | House Analogy |
|---|---|
| Web shell installed in production | Master key left under the doormat |
| Public-read S3 ACLs on customer files | Customer photos left in the front yard |
| Unauthenticated webhook with default password | Back gate doorbell that makes a guessable key |
| Recurring appointment time bomb | Appointment book pages quietly disappearing |
| Maintenance fee with no work performed | $4,000/month "maintenance" while security camera shows nobody arrived |
| Hosting double-billing | Two landlords sending rent bills for the same apartment |
| Virtual assistant non-delivery | A housekeeper you're paying for who never shows up |
| Zero engagement social media | Flyers nobody reads on doors of houses that don't exist |
| Unpatched CVE | Front door lock that hasn't been replaced even though everyone knows the master key was stolen |
| Old framework (Django 3.2 EOL) | Original 1970s wiring still in the walls — works until it doesn't |

**Use when:** the client owns physical property, runs a service business, or has any familiarity with home ownership.

---

## Alternative 1: Car Repair Shop

| Technical Finding | Car Analogy |
|---|---|
| Web shell installed in production | Mechanic left a master ignition key in the glove compartment |
| Public-read S3 ACLs | Customer paperwork left on the front seat with the windows down |
| Unauthenticated webhook with default password | A spare-key dispenser anyone can use |
| Recurring appointment time bomb | The check-engine light is disabled — you won't know when it fails |
| Maintenance fee with no work performed | $400/month for "oil changes" the mechanic never actually performed |
| Hosting double-billing | Paying two parking garages for the same parking spot |
| Virtual assistant non-delivery | Paying for a service technician who never opened the hood |
| Zero engagement social media | Flyers nobody picked up at the dealership lot |
| Unpatched CVE | Known recall on your brake system — never serviced |
| Old framework | Engine never had a tune-up — won't pass inspection |

**Use when:** the client is in transportation, logistics, or any vehicle-dependent business.

---

## Alternative 2: Kitchen Remodel

| Technical Finding | Kitchen Analogy |
|---|---|
| Web shell installed in production | Contractor left a hidden trap door in the floor |
| Public-read S3 ACLs | Family photos hung on the outside of the house |
| Unauthenticated webhook | A bell that rings inside any time anyone outside touches it |
| Recurring appointment time bomb | The refrigerator slowly stops cooling and no alarm sounds |
| Maintenance fee with no work performed | Paying for "quarterly inspections" the contractor never showed up for |
| Hosting double-billing | Two contractors billing you for the same plumbing service |
| Virtual assistant non-delivery | Paying for a cleaning crew that never came |
| Zero engagement social media | Open-house flyers that didn't bring a single visitor |
| Unpatched CVE | Known faulty wiring that was never replaced |
| Old framework | Foundation hasn't been inspected since the 1980s |

**Use when:** the client is in hospitality, food service, or runs a residential service business.

---

## Alternative 3: Tax Preparation / Accounting

| Technical Finding | Tax Analogy |
|---|---|
| Web shell installed in production | CPA gave a copy of your tax returns to a competitor "for safekeeping" |
| Public-read S3 ACLs | Filed your tax returns on a public bulletin board |
| Unauthenticated webhook | A signature stamp lying on the desk anyone can grab |
| Recurring appointment time bomb | Quarterly estimated tax payments silently stopped being filed |
| Maintenance fee with no work performed | Paying $4,000/month for "ongoing tax planning" that produced no plans |
| Hosting double-billing | Two CPAs billing for the same return preparation |
| Virtual assistant non-delivery | Paying a bookkeeper who never actually opened your QuickBooks |
| Zero engagement social media | Marketing flyers that brought zero new clients |
| Unpatched CVE | Known IRS audit-trigger items never addressed |
| Old framework | Software tools from 2019 — IRS no longer accepts those forms |

**Use when:** the client is in finance, professional services, or has CPA/CFO experience.

---

## Alternative 4: Wedding Planning

| Technical Finding | Wedding Analogy |
|---|---|
| Web shell installed in production | Planner gave the venue master key to a stranger |
| Public-read S3 ACLs | Guest list posted on the bulletin board at the front of the venue |
| Unauthenticated webhook | A microphone hot at all times anyone can speak into |
| Recurring appointment time bomb | The catering order silently expired with no notice |
| Maintenance fee with no work performed | Paying a "day-of coordinator" who never showed up |
| Hosting double-billing | Paying two florists for the same arrangement |
| Virtual assistant non-delivery | Paying for an assistant who never returned a single email |
| Zero engagement social media | RSVPs that produced zero attendance |
| Unpatched CVE | Caterer never updated allergen info despite multiple disclosures |
| Old framework | DJ using equipment from 2008 — half the playlist doesn't work |

**Use when:** the client is in event planning, hospitality, or runs a single-event-driven business.

---

## Picking the right analogy

Three factors:
1. **What is the client's industry?** Pick the analogy closest to their day-to-day business.
2. **What does the client physically interact with?** Pick the analogy that maps to tangible objects they handle.
3. **What's the gender / cultural context?** Pick the analogy that the client will find natural, not condescending.

**Default to House Construction unless there's a specific reason to deviate.** The house analogy is durable, gender-neutral, and broadly understood across demographics.

## Adding a new analogy

If none of the above fit, define a new analogy with at least 10 mappings (one per technical finding). The mappings should be:
- **Concrete** (a specific physical object or scenario the client can picture)
- **Actionable** (the client can imagine "fixing" it)
- **Emotionally proportionate** (a "master key under the doormat" feels appropriately scary; "minor inconvenience" does not)
- **Consistent throughout** (don't mix analogies within one report — pick one and commit)

Save the new analogy here as a section. The next sibling case may use it.
