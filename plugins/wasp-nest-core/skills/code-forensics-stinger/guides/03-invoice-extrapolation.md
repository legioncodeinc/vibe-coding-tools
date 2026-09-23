# Phase 2 — Invoice Forensics and Extrapolation

## Goal
1. Parse every documented invoice (PDF + HTML email body) into structured records.
2. **Extrapolate missing monthly recurring invoices** using the first-and-last-observed rule.
3. Build the master Excel workbook with 51 tabs.

## Invoice sources to expect

### DevPipe / Offshore Build invoices
- Stripe-generated PDFs attached to "New invoice from DevPipe LLC #..." emails
- Filename pattern: `Invoice-{STRIPE_ID}-{NNNN}.pdf` (e.g., `Invoice-CC2FAA50-0023.pdf`)
- The Stripe sub-account ID is the prefix (e.g., `CC2FAA50` for DevPipe during 2024–2025, `157FDCC1` for late 2025, `DO4PCESA` for 2026)
- Stripe-generated receipts: `Receipt-{NNNN}-{NNNN}.pdf` — these are proof of payment, NOT separate billings
- Some invoices are voided and replaced — note these but do not count both

### ADA invoices
- These do NOT come as PDF attachments. The invoice details are in the HTML body of "Customer Invoice #NNNN is Available to View" emails
- Sender: `admin@acmedigitalagency.example` (sometimes `robert@acmedigitalagency.example` for early ones)
- Body parsing: extract `Invoice #NNNN`, `Amount Due: $X.XX`, and the "Invoice Items" block
- ADA also sends "Direct Debit Payment Confirmation" emails — these are receipts, not billings

## Methodology

### Step 1: Run the parser
```bash
python scripts/parse_invoices.py \
    --emails-dir forensic-output/_intermediate/ \
    --pdf-dir forensic-output/invoices/devpipe/ \
    --out forensic-output/_intermediate/invoices.json
```

This produces a normalized invoice list with: `invoice_number`, `date`, `vendor`, `amount`, `items[]`, `is_receipt`, `pdf_or_source`.

### Step 2: Classify items as recurring vs one-off

A line item is RECURRING if its description matches the keyword regex:
```
\b(monthly|month|maintenance|hosting|workspace|gsuite|assistant|social media management|silver|subscription|platinum)\b
```
OR if it contains a `(MM/DD/YYYY - MM/DD/YYYY)` date-range parenthetical.

All other items are ONE-OFF.

### Step 3: Extrapolation rule (CRITICAL)

For each recurring service identified as (vendor, item, price):
1. Find the FIRST observed invoice with that service at that price (`first_date`)
2. Find the LAST observed invoice with that service at that price (`last_date`)
3. Generate one monthly date between `first_date` and `last_date` (inclusive on both ends), using the same day-of-month as the first observation, clamped to the last day of months that don't have that day (e.g., Mar 31 → Feb 28)
4. For each generated date NOT already represented by a documented invoice, create a synthetic UNK invoice
5. Number them UNK-001, UNK-002, ... globally in chronological order

**Examples:**
- ADA "Summit Website Support and Hosting" $149.99: first 2023-10-17, last 2026-05-01. Generate 32 monthly dates. Any month between with no observed invoice gets a UNK.
- DevPipe "Platinum Maintenance" $4,000: first 2025-03-03, last 2026-03-02. Generate 13 monthly dates. Fill in the gaps.

**Hard rules:**
- DO NOT extrapolate prices that are only OBSERVED ONCE (no first-and-last pair). Note these as "single occurrence" in the master report.
- DO NOT extrapolate across a price change unless the client explicitly directs (Example Booking Co.: did NOT extrapolate the $6,000 → $4,000 Platinum Maintenance era because no $6,000 invoice was observed).
- ASK the user before extrapolating a final cycle past the last observed invoice. Example Booking Co. added Apr 2, 2026 per client direction (one cycle after Mar 2, 2026, before May 1 termination).

### Step 4: Build the master Excel workbook

```bash
python scripts/build_invoice_xlsx.py \
    --invoices forensic-output/_intermediate/invoices.json \
    --extrapolated forensic-output/_intermediate/extrapolated.json \
    --git-data forensic-output/_intermediate/git_by_month.json \
    --out forensic-output/invoices/{ProjectName}_Invoice_Forensics.xlsx
```

The workbook has these tabs (51 total in the Example Booking Co. case):

| Tab | Purpose |
|---|---|
| **Invoice Summary** | All invoices in chronological order with totals by vendor |
| **Recurring Items** | Each (vendor, item, price) bucket with first/last/count |
| **One-Off Items** | Each non-recurring line item, in chronological order |
| **Commit Log** | (Phase 3 output) per-commit details |
| **Monthly Effort Rollup** | (Phase 3 output) git activity by month |
| **Billed vs Delivered** | (Phase 3 output) maintenance hours claimed vs delivered |
| **Idle Months** | (Phase 3 output) months with ZERO commits while billed |
| {invoice_number}_{R} | One tab per documented invoice with line items |

Receipts (green-highlighted rows) are visually distinct from invoices. Extrapolated UNK invoices are amber-highlighted.

### Step 5: Update `case-facts.json`

After Phase 2:
```json
{
  "totals": {
    "documented_invoice_total": 80985.51,
    "extrapolated_invoice_total": 51235.96,
    "documented_plus_extrapolated_total": 132221.47,
    "ada_documented": 43185.51,
    "ada_extrapolated": 3235.96,
    "devpipe_documented": 37800.00,
    "devpipe_extrapolated": 48000.00,
    "unk_invoice_count": 21
  }
}
```

## Output checklist

- [ ] All PDF invoices in `forensic-output/invoices/devpipe/` are parsed
- [ ] All ADA "Customer Invoice" emails are parsed
- [ ] Receipts are NOT counted as billings in totals
- [ ] Voided invoices are noted but not double-counted
- [ ] Extrapolated invoices have clear `is_extrapolated: true` flags
- [ ] Excel workbook opens cleanly in LibreOffice and Excel
- [ ] Recurring breakdown shows the expected services at expected prices

## Common pitfalls

- **NULL bytes in PDF text.** Some Stripe PDFs have embedded \x00 NULL chars in line item text. The xlsx builder sanitizes these via the openpyxl monkey-patch — already handled in `scripts/build_invoice_xlsx.py`.
- **Mixed-case vendor names.** DevPipe appears as "DevPipe LLC", "devpipe LLC", "DEVPIPE LLC", and "Offshore Build Group LLC" across the engagement. Normalize for totals but preserve original case in line items.
- **Stripe accounts changing.** Late 2025 onward, DevPipe started using a new Stripe sub-account (acct_REDACTED_B instead of acct_REDACTED_A). Pull from email headers and record both for subpoena targets.
