# The redaction pass

Mandatory. Runs after session reconstruction and before a single line of SOP prose is
written. No output mode skips it.

This is the highest-risk step in this skill. Screen capture of real work routinely
contains credentials, API keys, client names, and account identifiers, and an SOP is a
document specifically designed to be handed to someone who did not previously have access.

---

## Why this is not optional

The evidence for treating redaction as a mandatory human-confirmed gate rather than a
background feature:

- Screen recordings and screenshots routinely contain identifiers, financial data,
  authentication tokens, technical identifiers, health data, and contextual leakage from
  adjacent tabs and notifications
  [research/raw/sop--redaction--supportbench-screenshot-pii.md].
- Quoted from that source: "recordings capture more than anyone intended"
  [research/raw/sop--redaction--supportbench-screenshot-pii.md].
- One documented audit found 847 support tickets containing unredacted PII including user
  emails and partial payment data, accessible to 200 staff including contractors without
  Data Processing Agreements, accumulated over 18 months
  [research/raw/sop--redaction--supportbench-screenshot-pii.md].
- Automated redaction is not sufficient on its own. Advanced AI redaction engines are cited
  at a 79.1% zero-leak rate against 38.6% for general text models
  [research/raw/sop--redaction--supportbench-screenshot-pii.md]. At the state of the art
  that is roughly one document in five still leaking.
- The market-leading capture tool gates automatic redaction behind Enterprise plans,
  publishes no limitations section, and does not instruct users to verify redactions
  manually [research/raw/sop--tooling--scribe-smart-privacy-screen.md]. Treat that as a
  documented absence, not as evidence that verification is unnecessary.
- A cheap intervention works: a 15-minute training module plus mandatory checks produced a
  reported 90% reduction in screenshot PII incidents within 90 days at the company in the
  incident above [research/raw/sop--redaction--supportbench-screenshot-pii.md].

Regulatory frames that treat captured media as regulated processing: GDPR Article 5
requires lawful basis and technical safeguards; CCPA and CPRA carry fines up to $7,500 per
violation; HIPAA applies wherever PHI is captured; PCI-DSS classifies card capture as a
storage event that triggers incident reporting. None of these name screenshots explicitly;
they treat any personal data capture as regulated activity
[research/raw/sop--redaction--supportbench-screenshot-pii.md].

---

## What to scan for

Run every extracted value from the reconstruction against this table. The categories come
from the archived taxonomy [research/raw/sop--redaction--supportbench-screenshot-pii.md];
the handling column is this skill's rule.

| Category | Examples in capture | Handling |
|---|---|---|
| **Authentication** | API keys, bearer tokens, session tokens, passwords, webhook signing secrets, connection strings, OAuth client secrets, private keys | **Always redact. Never confirm with the user first, never quote a partial.** Replace with a named placeholder and flag for rotation. |
| **Financial** | Card numbers, CVVs, bank account and routing numbers, invoice totals tied to a named party, billing addresses | Always redact the number. Keep the field name. |
| **Identifiers** | Personal names, email addresses, phone numbers, postal addresses | Redact by default. Ask before keeping any. |
| **Account and tenant** | Account IDs, sub-account IDs, location IDs, tenant slugs, workspace names, CRM record IDs, org identifiers | Redact by default, keep the shape. These are the ones people forget. |
| **Technical** | Internal subdomains, internal IP addresses, private repo URLs, staging hostnames, user IDs | Redact for any external or client-facing output. Judgment call for internal SOPs. |
| **Health** | Anything that reads as PHI | Always redact. Sensitive categories stay out entirely (`evidence-standards.md` rule 10). |
| **Contextual** | Browser tab titles showing logged-in services, notification previews, adjacent calendar entries, other people's names in a sidebar | Redact or drop. This is the row people miss: the exposure is often not the window being worked in [research/raw/sop--redaction--supportbench-screenshot-pii.md]. |
| **Third-party client identity** | Client company names, contact names on a CRM record, deal values | Redact by default. Third parties in the capture are incidental and included only where material (`evidence-standards.md` rule 10). |

---

## The three-sweep scan

### Sweep 1: pattern scan

Scan every extracted value and every captured UI label for structural signatures:

- Long high-entropy strings, especially with common prefixes such as `sk-`, `pk_`, `ghp_`,
  `xox`, `AKIA`, `Bearer `, `eyJ` (a JWT header), or a run of 32 or more hex characters.
- Anything in a field whose captured label contains key, token, secret, password,
  credential, auth, api, or webhook.
- Digit runs of 13 to 19 characters (card shapes) and 9 to 12 (account shapes).
- Email address shape.
- URLs carrying query parameters named `token`, `key`, `secret`, `signature`, `access`.

`scripts/dedupe_snapshots.py` emits a `--scan-secrets` mode that runs these patterns over a
timeline file and prints candidate hits with their state index. Use it as a first pass. It
finds structure, not meaning, so it misses anything unpatterned.

### Sweep 2: semantic scan

Read the extracted values yourself. Pattern matching misses:

- A client company name that is just a normal word.
- A person's name in a record title.
- A dollar amount that identifies a specific deal.
- A custom field whose label is innocuous and whose value is not.
- A URL that is not sensitive in shape but points at a private tenant.

### Sweep 3: context scan

Look at what was around the work, not just in it. Tab strips, notification toasts, calendar
sidebars, and other people's names in a participant list all get captured and all leak
[research/raw/sop--redaction--supportbench-screenshot-pii.md]. Anything the SOP does not
need, drop before it reaches the draft.

---

## The replacement rule

Placeholder replacement, not blanket removal. Sensitive data is replaced with a label so
the surrounding context still reads
[research/raw/sop--redaction--supportbench-screenshot-pii.md]. Selective redaction targets
high-risk fields while preserving non-sensitive elements such as navigation paths
[research/raw/sop--redaction--supportbench-screenshot-pii.md].

**The governing test for this skill: the step must stay followable after the value is
removed.** A reader has to still know which field to fill, what kind of value goes in it,
and where to get that value.

Replace with a typed, named placeholder:

| Bad | Good |
|---|---|
| `[REDACTED]` | `[YOUR_API_KEY]` |
| `sk-live-4a91...` | `[YOUR_STRIPE_SECRET_KEY, from Stripe dashboard, Developers, API keys]` |
| `████████` | `[CLIENT_ACCOUNT_ID]` |
| Deleting the whole step | `Paste your webhook signing secret into the Signing Secret field. [YOUR_WEBHOOK_SECRET]` |

Add a **Values you will need** block near the top of the SOP listing every placeholder, what
it is, and where the reader obtains it. That block is what turns redaction from a loss into
a feature: the SOP now works for anyone, not only for the account it was recorded in.

**Never partially reveal a credential.** Not the first four characters, not the last four,
not the length. Partial disclosure of a secret is disclosure.

---

## The rotation flag

If sweep 1 or sweep 2 finds anything in the **Authentication** row, the deliverable carries
a warning at the top, before the SOP body:

```
SECURITY NOTICE

This procedure was reconstructed from screen capture that contained live credential
material. The following were visible on screen during the captured session and have been
redacted from this document:

- <field label>, at step <n>, [<receipt>]

Screen capture of a credential should be treated as exposure. Rotate these
credentials. This document does not contain their values.
```

Name the field and the step. Never name the value. The user needs to know what to rotate.

---

## The confirmation gate

Redaction decisions go to the user via `AskUserQuestion` before the SOP is written. This is
the encode gate: anything written down as durable fact about a person, a company, a
commitment, or a number gets confirmed first (`evidence-standards.md` rule 6).

Ask about the ambiguous rows, not the obvious ones. Do not ask permission to redact an API
key. Do ask about:

- Client and company names, when the output mode is client-facing or when the SOP will be
  shared outside the team.
- Account, location, and tenant identifiers, where keeping them makes the SOP concrete and
  removing them makes it reusable.
- Internal hostnames and staging URLs.
- Personal names of colleagues who appear as record owners or assignees.

Present the question with the count and the categories, not the values:

> The reconstruction found 3 client names, 2 account identifiers, and 1 internal hostname
> in the captured steps. How should the SOP handle them?
>
> - Redact all (portable SOP, works for any account)
> - Keep account identifiers, redact names (internal use in this account)
> - Keep everything (internal only, never shared)
> - Let me review each one

Default to the most redacted option the chosen output mode allows. A client-facing
deliverable or a training script has no redaction choice: everything in the table above
goes.

---

## Output-mode redaction floors

| Output mode | Floor |
|---|---|
| Internal SOP | Authentication, financial, health always. Everything else confirmable. |
| Checklist | Same as internal SOP. |
| Training script for a recording | Everything in the table. The recording will be replayed and paused. |
| Client-facing deliverable | Everything in the table, plus any internal tooling name, internal process name, or colleague name that does not need to be there. |

---

## Raw capture never ships

Retrieved material is working data. Process it in temp space, produce the distilled
deliverable, delete the raw (`evidence-standards.md` rule 7). Nothing derived from another
person's screen share, another company's dashboard, or a private thread ends up in a
committed file or a shared artifact.

Retention guidance from the archive, for the user's own storage of the source capture, not
for this skill's temp files [research/raw/sop--redaction--supportbench-screenshot-pii.md]:

| Artifact | Retention |
|---|---|
| Original media | 30 to 90 days |
| Redacted output | 1 to 3 years per policy |
| Intermediate artifacts | Delete immediately after export |

This skill's own intermediate artifacts fall in the last row. Delete the working timeline
once the SOP is written.

---

## The one-line disclosure the SOP must carry

Every SOP this skill produces states, in its provenance block, that a redaction pass ran
and what it found. Not a vague reassurance. A count.

```
Redaction: 6 values redacted across 4 steps (2 credentials, 3 client identifiers,
1 account ID). Credentials found on screen are listed in the security notice above and
should be rotated.
```

A reader who is handed an SOP needs to know whether the blanks are gaps in the
reconstruction or deliberate removals. Those are different problems with different fixes,
and conflating them is how a reader ends up trying to recover a secret from a screenshot.
