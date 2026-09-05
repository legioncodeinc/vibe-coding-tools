# Secret scrubbing

Mandatory. Runs after solve detection and before a single entry field is drafted, before
the dedupe comparison, and before anything is printed into a report. No mode skips it.

**This method is not rebuilt here. It is inherited.** The full method, its category
taxonomy, its evidence base, and its regulatory framing live in the `sop-forge` skill in
this same marketplace, in that skill's redaction-pass guide, together with the research
archive that evidences it. Read that guide. This one carries only the deltas that apply
when the output is a knowledge base entry rather than a procedure document.

Nothing about redaction is claimed as evidenced by this skill's own research archive
[research/distilled-personal-knowledge-capture.md section 8]. That is deliberate, not an
omission.

---

## What is inherited, unchanged

From the `sop-forge` skill's redaction-pass guide:

1. **The category table.** Authentication, financial, identifiers, account and tenant,
   technical, health, contextual, third-party client identity, each with its handling rule.
   Authentication is always redacted and never confirmed with the user first.
2. **The three-sweep scan.** Pattern sweep for credential-shaped strings, semantic sweep by
   reading the values because a client name is just a normal word, context sweep for what
   was around the work: tab strips, notification toasts, calendar sidebars.
3. **Typed placeholders, not blanket markers.** The governing test is that the content stays
   followable after the value is removed. `[YOUR_DATABASE_URL, from Neon dashboard,
   Connection Details]`, never `[REDACTED]` and never a black box.
4. **Never partially reveal a credential.** Not the first four characters, not the last
   four, not the length. Partial disclosure of a secret is disclosure.
5. **The rotation flag.** Anything matching an authentication pattern was on screen, and
   screen capture of a credential is exposure. The deliverable names the field and where it
   appeared, never the value.
6. **Disclosure with a count.** State how many values were removed and in which categories,
   so a reader can tell a deliberate removal from a gap.
7. **Automated scanning is a first pass, not a guarantee.** The human gate is what closes
   it.

---

## Why this skill is the higher-risk case

`sop-forge` reconstructs work that went well. This skill reconstructs work that went wrong,
and the two are not equally dangerous.

When something is broken, the things a developer puts on screen are exactly the things that
must never be written down:

| What breaks | What ends up on screen |
|---|---|
| An API call fails | The full request, headers included, with the bearer token in it |
| A database will not connect | The connection string, in full, with the password in it |
| Auth returns 401 | The token, the client secret, the callback URL with a code in the query string |
| A webhook does not fire | The signing secret, pasted into a comparison |
| A deploy fails | Environment variables printed to the build log |
| A client-specific bug | The client's name, their tenant id, their record ids, their data |

Worse, **the secret is frequently inside the error message itself**, which is the one field
this skill is designed to preserve verbatim and make greppable. The `SEARCH:` line is the
highest-risk line in the entire artifact. It is the line most likely to contain a
credential, and it is the line the whole design says to keep literal.

That tension resolves one way only: the `SEARCH:` line gets scrubbed like everything else,
and where scrubbing it destroys its value as a search key, the entry says so and the user
decides. Never keep a secret to preserve searchability.

---

## The deltas

### Delta 1: scrub before the dedupe comparison, not after

The dedupe check in `kb-structure-and-dedupe.md` section 3 passes a candidate symptom string
into a comparison and prints scored matches. If that string carries a token, the token is
now in the comparison, in the report, and in the transcript.

Order is fixed: **detect, scrub, compare, draft, confirm, write.** Never compare an
unscrubbed string.

### Delta 2: never print a matched secret into the transcript

Report the finding as a count and a category and a location. Not a value, not a prefix, not
a masked form with some characters showing.

Correct:

```
Redaction: 3 values found in candidate 2 (1 authentication, 1 connection string,
1 account identifier). Replaced with typed placeholders.
```

Wrong, all of them: printing the value, printing `sk-live-4a91...`, printing
`sk-live-****...****`, printing "the key ending in 8f2c", or asking the user "is
sk-live-4a91 a real key?".

If the model needs the user to disambiguate a possible secret, describe the field and the
location: "There is a long high-entropy value in the connection string on the failing
command at the 14:12 snapshot. Redacting it." Do not quote it.

Do not ask permission to redact an authentication value. Redact it and say so.

### Delta 3: error strings need structure-preserving placeholders

An error message that has been blanket-redacted is useless as a search key. Scrub it so the
shape survives:

| Captured | Scrubbed |
|---|---|
| `Error: connect ECONNREFUSED postgres://app:hunter2@db-prod-7f2.internal:5432/main` | `Error: connect ECONNREFUSED postgres://[USER]:[PASSWORD]@[DB_HOST]:5432/[DATABASE]` |
| `401 Unauthorized: invalid bearer eyJhbGciOi...` | `401 Unauthorized: invalid bearer [YOUR_API_TOKEN]` |
| `Tenant a3f9-2b11-... not found in region us-east-1` | `Tenant [TENANT_ID] not found in region us-east-1` |
| `AccessDenied for arn:aws:iam::418...:role/prod-deploy` | `AccessDenied for arn:aws:iam::[ACCOUNT_ID]:role/prod-deploy` |

The invariant part of each string is preserved, and that is what the user will grep for next
time. `ECONNREFUSED`, `401 Unauthorized: invalid bearer`, `not found in region`,
`AccessDenied for arn:aws:iam` all survive. This is exactly the placeholder rule from
`sop-forge` applied to an error string instead of a form field.

Add the note under the `SEARCH:` line when the scrub changed it:

```
SEARCH: Error: connect ECONNREFUSED postgres://[USER]:[PASSWORD]@[DB_HOST]:5432/[DATABASE]

Scrubbed: original contained credentials and a hostname. The invariant is
"connect ECONNREFUSED postgres" plus the port.
```

Where the entire discriminating part of the error was a secret, say so honestly and fall
back to a description:

```
SEARCH: 403 with a signature mismatch on the webhook verification step

Note: the original error text was almost entirely credential material and could not be
preserved. This entry is findable by tag and by title only.
```

That is a real loss of retrieval quality, and it is the correct trade.

### Delta 4: the entry persists, so the floor is higher

An SOP is written for a reader and then largely done. A knowledge base entry sits on disk
for years, gets copied into a repo, gets synced to a laptop, gets committed by accident, and
gets pasted into a chat when a colleague asks. Treat every entry as if it will eventually be
shared, because the ones that matter are exactly the ones the user will send to someone.

The floor for every entry, no exceptions and no user override:

| Category | Rule |
|---|---|
| Authentication of any kind | Always removed. Rotation flag raised. |
| Connection strings | Always removed, structure preserved. |
| Financial values tied to a named party | Always removed. |
| Health data | Always removed. |
| Third-party client identity | Removed by default. Confirmable if the user says the base is private and stays private. |
| Account, tenant, workspace, org identifiers | Removed by default, shape preserved. |
| Internal hostnames and staging URLs | Confirmable. Often load-bearing for the fix, so ask. |
| Personal names of colleagues | Removed unless material to the entry, per `evidence-standards.md` rule 10. |

### Delta 5: the rotation flag goes into the sweep report, not only the entry

A credential that was on screen during a debugging session is exposed, and the user needs to
know that this week, not when they next open the entry. The sweep report carries a security
block at the very top when anything in the authentication row was found:

```
SECURITY NOTICE

The capture reviewed this week contained live credential material on screen. The
following were visible and have been redacted from every draft:

- A bearer token in a failing API request, 2026-08-11 14:12, chrome
- A database password in a connection string, 2026-08-13 09:40, terminal

Screen capture of a credential should be treated as exposure. Rotate these. This
report does not contain their values.
```

Name the field, the time, and the app. Never the value.

### Delta 6: raw capture never ships

Working retrieval is deleted once the entries are written
(`evidence-standards.md` rule 7). What lands in `knowledge-base/` is the scrubbed entry and
nothing else. No raw snapshot text, no full transcripts, no unscrubbed error dumps in an
appendix.

---

## The confirmation gate

Redaction decisions reach the user through `AskUserQuestion` **before** the entry is drafted,
so the read-back does not itself display secrets. Ask about the confirmable rows only:
client and company names, account and tenant identifiers, internal hostnames, colleague
names. Present counts and categories, never values.

```
This week's candidates contain 2 client names, 3 tenant identifiers, and 1 internal
hostname. 4 authentication values were found and have already been removed.

How should the entries handle the rest?
- Redact all (entries stay shareable)
- Keep hostnames, redact the rest (fix stays concrete, base stays private)
- Let me review each category
```

Default to the most redacted option. The user can always widen it; they cannot un-write a
leaked entry that has been synced to three machines.
