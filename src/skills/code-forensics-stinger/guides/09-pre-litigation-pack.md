# Phase 8 — Pre-Litigation Document Pack

## Goal
Produce six pre-litigation documents (two findings notices, two demand letters, two termination notices) plus a cover-and-instructions document, packaged in `pre-litigation-pack/`.

## The six documents

| # | Document | Recipient | Tone | Deadline |
|---|---|---|---|---|
| 00 | Cover & Instructions | Client (internal) | Tactical guidance | N/A |
| 01 | Findings Notice | ADA / Robert Hartwell | Informational + setup | 7 days |
| 02 | Findings Notice | DevPipe / Sameer Khan | Informational + setup | 7 days |
| 03 | Demand Letter | ADA / Robert Hartwell | Formal demand + cure | 14 days |
| 04 | Demand Letter | DevPipe / Sameer Khan | Formal demand + cure | 21 days (intl) |
| 05 | Termination Notice | ADA / Robert Hartwell | Formal termination | Effective May 1 / case date |
| 06 | Termination Notice | DevPipe / Sameer Khan | Formal termination | Effective May 1 / case date |

## The "intimidating but safe" tone formula

Every document follows this formula:

1. **Precise legal terminology** to project competence and seriousness ("material breach," "implied warranty of merchantability," "spoliation of evidence," "veil-piercing")
2. **Specific dollar amounts** backed by the forensic record (don't pull demand numbers from thin air)
3. **Specific contract clauses** cited (the 120-working-day commitment, the November 1, 2023 MSA, the 80-hour-per-month maintenance representation)
4. **Explicit Litigation Hold notices** putting them on the hook for evidence destruction
5. **Reservation of rights** boilerplate at the end of every letter
6. **Specific jurisdiction citations** (Cuyahoga County for ADA, where the Hartwell v. Whitfield case is also venued — this implies the squeeze)

What they MUST NOT contain:
- Threats to publicize or "tell the press"
- Threats of criminal prosecution (extortion risk — Ohio Rev. Code § 2905.11)
- Personal attacks
- Demands outside the legal process (don't ask for things you couldn't get through litigation)
- "Or else" framing — frame as "if not satisfied we will proceed to file" (a legitimate right, not a threat)
- Statements characterizing motive beyond what the evidence supports

## Methodology

### Step 1: Determine recipient details

For ADA:
- Robert J. Hartwell, Managing Director
- Acme Digital Agency, LLC
- Northstar Holdings Inc.
- [REDACTED AGENCY ADDRESS] (was [REDACTED FORMER AGENCY ADDRESS])
- Emails: robert@acmedigitalagency.example; robert@ada.example; support@acmedigitalagency.example

For DevPipe/Offshore Build:
- Sameer Khan
- Offshore Build Group LLC / DevPipe LLC
- [REDACTED SUBCONTRACTOR ADDRESS — NJ] (US registered agent)
- Operating address: Lahore, Pakistan
- Emails: sameer@devpipe.example; contact@devpipe.example; sameer@offshorebuild.example

These are pre-filled in the templates. Update if defendant addresses have changed for a new case.

### Step 2: Run the builder script

```bash
node /path/to/skill/scripts/build_pre_litigation.js \
    --case-facts /path/to/case-facts.json \
    --out forensic-output/pre-litigation-pack/
```

The script reads `case-facts.json` and generates all seven .docx files, then converts to PDF via LibreOffice.

### Step 3: Manual review

Before any document is served, review each one for:
- All placeholders substituted (search for `{` in the output)
- All dollar amounts match `case-facts.json`
- The recipient address is current
- The deadline dates are reasonable given the date of intended service

### Step 4: Send sequence

The recommended sequence (in the cover document):

**Day 0 (recommended same-day):**
- Findings Notice → ADA (Doc 01) via certified mail + email
- Findings Notice → DevPipe (Doc 02) via certified mail + email
- Termination Notice → ADA (Doc 05) via certified mail + email
- Termination Notice → DevPipe (Doc 06) via certified mail + email

**Day 7:**
- Demand Letter → ADA (Doc 03) via certified mail + email — sets 14-day cure
- Demand Letter → DevPipe (Doc 04) via certified mail + email — sets 21-day cure

**Day 21 (ADA) / Day 28 (DevPipe):**
- If cure deadlines pass without resolution → file civil complaint

Sending the Findings Notice 7 days BEFORE the Demand Letter creates a paper trail showing the defendants had an opportunity to engage in pre-litigation discussions before formal demand. This strengthens the eventual lawsuit by making "we were ambushed" defenses harder to maintain.

### Step 5: Service method

- Email: yes, to all known addresses
- Certified mail with return receipt: STRONGLY RECOMMENDED for the Demand Letters and Termination Notices. Creates a Postal Service-issued record.
- For DevPipe/Offshore Build: use international certified mail to the New Jersey US registered agent address (NOT to the Lahore operating address — service in Pakistan is a Hague Convention nightmare).

## Demand amount calculation

The demand amount is the LOW end of the damages range, rounded to a clean number, with a "negotiation cushion":

For Example Booking Co.:
- Aggregate documented ADA damages low: $14,479 (Section 6 of ADA report)
- Recommended demand to ADA: $71,840 (includes the build clawback allocation)
- Aggregate documented DevPipe damages low: $173,000+ 
- Recommended demand to DevPipe: $200,600

The cushion (demanding more than the floor) is intentional — it gives negotiating room and ensures that even a 50% settlement gets you to the floor.

For a new case, derive these from `case-facts.json` totals. The build cost claim is typically allocated 60% to ADA (original contracting party) and 40% to DevPipe (subcontractor), but adjust based on whose negligence caused the specific failures.

## Litigation hold language (always include)

Both demand letters and findings notices include a "Notice of Litigation Hold" section that puts the defendants on notice that:
- They cannot destroy or alter relevant evidence
- Spoliation is itself sanctionable
- Specific evidence categories are identified (the Stripe accounts, the Slack/Teams archives, the timesheet records, the contractor invoices, etc.)

This is critical. Without an explicit litigation hold, a defendant who deletes evidence may escape spoliation sanctions. WITH the hold notice, deletion becomes its own claim.

## Cover document (Doc 00)

The cover-and-instructions document is for the CLIENT (and the client's counsel), not for the defendants. It contains:
- The send sequence above
- Strategy notes on the "intimidating but safe" tone
- After-service guidance (what to do if defendant contacts the client informally, what to track, etc.)
- Recommended-counsel profile (Ohio commercial litigator, ideally Cuyahoga County experience)

The cover document is NEVER sent to the defendants.

## Termination notice nuances

The Termination Notice serves THREE purposes:
1. Formalizes the actual termination date (typically already happened, but needs a paper trail)
2. Revokes all authorizations to access the client's systems (passwords/keys must be rotated regardless, but this puts the legal duty on the defendant to cease access)
3. Triggers cessation of any further billing (subsequent charges are unauthorized)

ADA's TOS contains a 30-day notice requirement for subscription cancellation. The Termination Notice explicitly addresses this: "termination for cause based on material breach and/or fraud is not subject to any notice-period requirement under Ohio law." Don't omit this paragraph — it preempts a defense.

## Update `case-facts.json`

After Phase 8, the case-facts.json doesn't typically need updates — the demand amounts and dates that go into the documents are read from it, not written to it. But you can add:

```json
{
  "pre_litigation": {
    "documents_built": 7,
    "build_date": "2026-05-15",
    "intended_send_date": "2026-05-22"
  }
}
```

## Output checklist

- [ ] All 7 .docx files exist in `pre-litigation-pack/`
- [ ] All 7 .pdf files exist in `pre-litigation-pack/`
- [ ] No placeholders remain in any output
- [ ] Demand amounts in Docs 03 and 04 match `case-facts.json`
- [ ] Recipient details are current
- [ ] Deadlines are computed from the intended send date
- [ ] Cover document (Doc 00) is NOT going out with the defendant-bound documents
- [ ] Each letter includes the Reservation of Rights footer
- [ ] Each letter includes the Litigation Hold paragraph
