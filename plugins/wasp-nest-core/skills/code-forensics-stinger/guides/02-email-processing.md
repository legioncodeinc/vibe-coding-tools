# Phase 1 — Email Archive Processing

## Goal
Convert a Gmail-export `.eml` archive (typically several large nested .eml files containing hundreds of messages) into:
- One markdown file per unique email in `individual-messages/M-####-{sender}.md` (ascending date order)
- One markdown file per multi-message thread (≥2 messages) in `threads/T-####-{subject-slug}.md`

## Input formats encountered in practice

**Format 1: "Gmail forwarded as attachment" multi-message dumps.** Each top-level .eml file contains many message/rfc822 attachments. You walk the nested MIME structure to extract each leaf message.

**Format 2: Individual .eml files** for specific message threads (invoices, contracts, etc.) often retained as separate files.

**Format 3: Stripe invoice notification emails** — the body contains the line items in HTML that needs to be stripped.

The script `scripts/parse_emails.py` handles all three. Run it twice — once on the big investigation dump, once on the individual attachments folder — and merge results with deduplication by Message-ID.

## Methodology

### Step 1: Run the parser
```bash
python scripts/parse_emails.py \
    --input-dirs /path/to/investigation-dump /path/to/attachments \
    --out /path/to/forensic-output
```

This produces:
- `forensic-output/individual-messages/M-####-{sender}.md` (one per unique message)
- `forensic-output/threads/T-####-{subject-slug}.md` (one per ≥2-message thread)
- `forensic-output/_intermediate/processed.json` (used by subsequent phases)
- `forensic-output/_intermediate/manifest.json` (email index)

### Step 2: Deduplication strategy

Messages are deduplicated by:
1. Primary: `Message-ID` header (if present)
2. Fallback: MD5 hash of `subject[:100] + from + date + body[:200]`

In practice ~30% of messages are duplicated across the investigation dump and the attachments folder. The script handles this automatically.

### Step 3: Date parsing

Messages with unparseable dates go to a `no_date/` subfolder and are NOT included in the chronological numbering. Note this in the master report if material.

### Step 4: Sender extraction

The filename includes the sender's email domain replaced with hyphens:
- `robert@acmedigitalagency.example` → `tom@acmedigitalagency-com`
- `sameer@devpipe.example` → `sameer.khan@devpipe-com`

This keeps filenames OS-friendly while preserving searchability.

### Step 5: Thread reconstruction

Subjects are normalized by stripping `Re:`, `Fwd:`, `RE:`, `FWD:` prefixes (case-insensitive). Messages with the same normalized subject are grouped into a thread. Threads with only 1 message are NOT created (those stay in individual-messages only). Threads with ≥2 messages are sorted chronologically and emitted as a single markdown file with the thread ID being the first message's date order.

## Headmatter Schema (Individual Message)

Each `M-####-{sender}.md` file has YAML headmatter:

```yaml
---
id: M-0001
from: 'Robert Hartwell <robert@acmedigitalagency.example>'
to: 'Sarah Bennett <sarah@examplebooking.example>'
cc: ''
bcc: ''
date: 2023-10-18
time: 09:31:00
timezone: -0400
subject: Re: Customer Invoice #9496 is Available to View
attachments: image001.png; image002.png
summary: |
  Robert Hartwell responds to a billing question about ACH auto-debit setup
---
```

The summary is generated heuristically — see `scripts/parse_emails.py` for the rules. For a hand-summary on critical messages, edit the file after generation.

## Headmatter Schema (Thread)

```yaml
---
id: T-0001
subject: RE: Update
first_date: 2023-07-03
last_date: 2024-03-15
message_count: 5
participants: robert@acmedigitalagency.example, sarah@examplebooking.example
message_ids: M-0001, M-0042, M-0089, M-0091, M-0100
summary: |
  Five-message thread discussing the post-Initial Build Vendor rebuild plan
---
```

## What to extract for downstream phases

Even though Phase 1 only produces emails-as-markdown, several pieces of information get harvested for `case-facts.json`:

- **Sender frequency table** — Tells you who the principals are
- **Date range** — First and last message dates
- **Domain inventory** — All unique email domains observed (ADA, DevPipe, Offshore Build Software, Stripe, etc.)
- **Stripe account IDs** — Pull from invoice email headers (look for `acct_[A-Z0-9]+`)

Save these to `_intermediate/email-meta.json` for use in Phase 2 and beyond.

## Edge cases

- **Embedded images that come through as attachments.** Listed in the headmatter but not embedded in the markdown.
- **HTML-only bodies.** Stripped with BeautifulSoup; if the result is empty, fall back to a notice "(HTML-only body, see original .eml)".
- **Calendar invites (.ics).** Listed in attachments but not parsed (calendar context rarely matters).
- **Reply chains where the same content is quoted N times.** Modern Gmail quoting is preserved; if the message body is >30K characters, truncate with "[... truncated ...]" marker.

## Verification

After Phase 1 completes:
- [ ] Total individual messages = unique Message-IDs in input
- [ ] Top senders match the expected parties (sarah, robert, sameer, admin@ada, helen@ada, etc.)
- [ ] Date range spans the expected engagement period
- [ ] At least one DevPipe/Offshore Build Stripe-sourced email appears with a parseable account ID
- [ ] No headmatter has `date: null`

Sample verification command:
```bash
ls forensic-output/individual-messages/ | wc -l
head -20 forensic-output/_intermediate/email-meta.json
```
