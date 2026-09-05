# Demand Letter — Template

Used for both ADA and DevPipe recipients. The Node builder `scripts/build_pre_litigation.js` produces six tailored documents from this skeleton.

## Header

```
{CLIENT_LEGAL_NAME}
{CLIENT_ADDRESS}
Email: {CLIENT_EMAIL}
Phone: {CLIENT_PHONE}

VIA EMAIL AND CERTIFIED MAIL — RETURN RECEIPT REQUESTED
(For DevPipe/Offshore Build: VIA EMAIL AND INTERNATIONAL CERTIFIED MAIL)

{RECIPIENT_NAME}
{RECIPIENT_TITLE}
{RECIPIENT_ENTITY}
{RECIPIENT_ADDRESS}
Via email: {RECIPIENT_EMAILS}

{DATE}

Re: FORMAL NOTICE OF MATERIAL BREACH AND DEMAND FOR CURE
    Reference: {CONTRACT_REFERENCE}
```

## I. Material Breaches Identified

For ADA, include these subsections (with Example Booking Co.-style language adapted to facts):
1. Billing for Services Not Rendered — Virtual Assistant
2. Apparent Double-Billing — Website Hosting
3. Failure to Perform Contracted Maintenance
4. Breach of the Original Proposal

For DevPipe/Offshore Build:
1. Failure to Deliver Merchantable Software
2. The Recurring-Appointment Time Bomb (or analogous core-feature defect)
3. Maintenance Billing Without Corresponding Effort
4. Failure to Apply Routine Security Patches

## II. Damages Demanded

Specific dollar table with rows for each claim category. Sum to a "TOTAL DEMANDED" row.

Reservation language:
> "This figure does not include punitive damages, attorney's fees, court costs, or any additional damages that may be available under the Ohio Consumer Sales Practices Act (Ohio Rev. Code § 1345.01 et seq.). The Client expressly reserves the right to pursue all such additional damages in litigation."

## III. Cure Period

For ADA: 14 calendar days.
For DevPipe/Offshore Build: 21 calendar days (international response time).

Four required actions:
1. Written acknowledgment of receipt
2. Payment of minimum demand OR written counter-proposal with supporting documentation
3. Cessation of further billing
4. Production of records identified in Litigation Hold

If failure to cure: "...the Client will proceed without further notice to file a civil complaint..."

## IV. Personal Liability Notice (DevPipe only)

Veil-piercing language for Sameer Khan personally.

## V. Additional Notices

- A. Litigation Hold (cross-reference the previously-served litigation-hold notice; reiterate preservation obligations)
- B. Communications (in writing only, through counsel after retention)
- C. International Service (DevPipe only — note that registered agent service in US is the route)
- D. Chargebacks (ADA only — TOS chargeback fee has no legal effect for services not rendered)

## Signature Block

```
Sincerely,

______________________________
{CLIENT_PRINCIPAL}
Owner and Managing Member
{CLIENT_LEGAL_NAME}

Date Issued: {DATE}
```

## Reservation of Rights Footer (every page)

> "This letter is submitted without prejudice to any rights or remedies of {CLIENT_LEGAL_NAME} under contract, statute, or common law, all of which are expressly reserved. Nothing in this letter shall be construed as a waiver of any right, claim, or defense. This communication is intended solely for the named recipient(s)."

## Tone Rules

- **DO** use precise legal terminology ("material breach", "implied warranty of merchantability", "veil-piercing")
- **DO** cite specific contract clauses and dollar amounts
- **DO** cite Ohio statutory authority (CSPA, fraud)
- **DO** include the litigation-hold language
- **DO** reserve rights at the end
- **DO NOT** threaten to publicize or "tell the press"
- **DO NOT** threaten criminal prosecution (extortion risk — Ohio Rev. Code § 2905.11)
- **DO NOT** make personal attacks
- **DO NOT** use "or else" framing — say "we will proceed to file" (a legitimate right)
- **DO NOT** make claims that go beyond what the forensic record supports

## Pattern: "intimidating but legally safe"

Intimidating through PRECISION:
- Specific dollar amounts anchored to forensic evidence
- Specific contract clauses and statutory citations
- Specific named defendants and named counsel-receipt addresses
- Specific deadlines that imply you've already calendared the litigation step
- Explicit litigation-hold language that puts evidence-destruction on the record
- Cuyahoga County venue mention (implies the Hartwell v. Whitfield squeeze)

NOT intimidating through THREATS that could expose the Client to liability:
- No extortion
- No defamation
- No tortious interference threats
- No public-disclosure threats
