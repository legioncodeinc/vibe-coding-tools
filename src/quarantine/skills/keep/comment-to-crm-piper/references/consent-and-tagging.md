# Consent and tagging

Two subjects in one guide because they are the same subject from two ends. Tagging is how
you record WHERE a person came from, and where a person came from is what determines
whether you may contact them.

---

## Part 1: consent, and the honest answer

### The claim this skill refuses to make

"They engaged publicly, so it is fine."

The UK regulator rejects that in terms:

> "Because someone's social media page has not been made private or they are seeking a
> large audience for their social media post doesn't mean that you are free to use their
> personal information for direct marketing purposes."
> [research/raw/piper--consent--ico-collect-information-and-generate-leads.md]

Public availability does not establish lawfulness. The operative test is whether the person
would EXPECT to be contacted this way
[research/raw/piper--consent--ico-collect-information-and-generate-leads.md].

### The distinction that actually resolves it

There are two different processing purposes hiding inside "pipe them into the CRM", and
they attract different expectations.

| Purpose | Reasonable expectation | Verdict |
|---|---|---|
| Reply to the person, delivering the specific thing they publicly asked for | Someone who commented a keyword to get a resource plainly expects to receive that resource | Sits inside expectation |
| Enrol the same person in ongoing marketing, a nurture sequence, a newsletter, or a broadcast list | Commenting once on a post is not an act of subscribing to anything | Needs its own basis, and is the step that fails the expectation test |

This skill is built entirely around the first purpose. It queues ONE first message that
answers what the person asked. It does not enrol anyone in a sequence, and it says so in
its output so the user does not assume otherwise.

If the user wants the second purpose, that is a decision they make deliberately, with an
opt-in, not a side effect of a daily drip.

### Lawful basis depends on channel and on who the recipient is

| Situation | Basis available in the UK |
|---|---|
| Email to an individual subscriber, including sole traders and partnerships | Consent, or the soft opt-in |
| Email to a corporate subscriber | Legitimate interests may apply |
| Automated or recorded calls, or calls to a number on a preference service | Consent |
| Post, or a live call to an unregistered number with no prior objection | Legitimate interests may apply |

All four rows: [research/raw/piper--consent--ico-choosing-lawful-basis-direct-marketing.md].

> "PECR can affect your choice of data protection lawful basis. This is because sometimes
> PECR says you must have consent to send direct marketing."
> [research/raw/piper--consent--ico-choosing-lawful-basis-direct-marketing.md]

Legitimate interests is not a checkbox either. It is a three-part documented assessment:
purpose, necessity, balancing, where necessity means no reasonably available alternative
with a smaller privacy footprint, not merely useful
[research/raw/piper--consent--usercentrics-gdpr-legitimate-interest.md]. Recital 47's direct
marketing carve-out is framed around EXISTING CUSTOMERS
[research/raw/piper--consent--usercentrics-gdpr-legitimate-interest.md], which a first-time
commenter is not.

### The US answer is different at the root

CAN-SPAM requires no prior consent to send a commercial email. The recipient's remedy is an
opt-out, which must be honored within 10 business days, alongside accurate headers, a
truthful subject line, a clear ad disclosure, and a valid physical postal address, at up to
$53,088 per violating email
[research/raw/piper--consent--ftc-can-spam-compliance-guide.md].

**There is no single rule to state.** A US operator emailing US recipients under CAN-SPAM
and a UK operator emailing individual subscribers under PECR face opposite defaults. The
skill surfaces which one is in play. It does not pick one and it does not give legal
advice.

### Transparency has a deadline, and it is soon

When data is not collected from the individual, privacy information must reach them
"within a reasonable period and at the latest within a month of obtaining their
information", and for direct marketing at the latest when you first communicate with them,
whichever is sooner
[research/raw/piper--consent--ico-collect-information-and-generate-leads.md]. Required
disclosures include the categories of information held and THE SOURCE of it
[research/raw/piper--consent--ico-collect-information-and-generate-leads.md].

Two consequences for this skill, both concrete:

1. The source belongs on the record. That is a regulatory disclosure obligation, not CRM
   hygiene. See Part 2.
2. The first message is the deadline. If the user is in a jurisdiction where this applies,
   the first message is where privacy information has to appear or be linked. Flag it; do
   not write the legal text for them.

### The guardrail: only public engagement on the user's own content

**What may be piped:**

- A public comment on a post the user published.
- A public reply in the user's own comment thread.
- A public reaction on the user's own post.
- A friend request, connection request, or follow directed at the user.
- The FACT that a person sent a direct message in response to the user's campaign: their
  name, the time, and the signal type.

**What may never be piped:**

- **The CONTENTS of a private direct message, written into a CRM note.** Not the text, not
  a paraphrase, not a summary. The fact of the message is a signal; its contents are a
  private communication between two people, and one of them did not agree to have it filed
  in a marketing database.
- Anything about a third party who appears incidentally in the capture, for example another
  person named inside the message.
- Any special category information: health, financial circumstances, legal history, family
  situation, protected characteristics, precise home location. Omit it even when the
  capture contains it (`references/evidence-standards.md`, rule 10).
- Engagement on somebody ELSE's post. A person who commented on a competitor's post, or on
  a friend's post the user happened to be reading, did not raise a hand at the user. That
  is scraping a stranger's audience, and neither the reasonable-expectation test nor the
  user's own reputation survives it
  [research/raw/piper--consent--ico-collect-information-and-generate-leads.md].

When a DM is the signal, the CRM note reads like this:

```
Sent a direct message in response to the 2026-08-14 launch post.
[collected Friday, August 15, 2026 09:12 EDT | messenger | Dani Thompson]
(sent Aug 15, 8:55 AM)
Message contents not recorded. Read the thread on the platform.
```

That is a complete, useful, honest note. It tells the user what happened, when, and where
to go read it. It does not copy a private conversation into a database.

### Opt-out is wired at intake, not later

An easy opt-out must always be available wherever legitimate interest is relied on, and
objection to direct marketing is absolute and immediate
[research/raw/piper--consent--usercentrics-gdpr-legitimate-interest.md]. GoHighLevel has a
native `DND` standard field
[research/raw/piper--ghl-import--highlevel-import-existing-contacts.md], which is where a
do-not-contact flag lives.

Rules:

- If an existing CRM contact has DND or any opt-out marker set, skip them entirely. No
  enrichment, no queued message, and a line in the dedupe report saying why.
- If a person's captured signal contains anything reading as a refusal, exclude them and
  name the exclusion.
- Never clear a DND flag. Ever.

### Never auto-send, for a second independent reason

The draft-never-send law applies across this marketplace, and the platform prohibitions on
automated messaging are documented in `lead-harvester/references/platform-rules.md`.
Read that rather than restating it here.

The consent research adds a separate reason on top of the platform one: CAN-SPAM penalties
attach PER EMAIL [research/raw/piper--consent--ftc-can-spam-compliance-guide.md]. An
automated blast off a partially verified roster multiplies both the platform risk and the
regulatory exposure by the number of rows. A human sending messages by hand does not.

---

## Part 2: tagging and campaign attribution

### Two axes, not one

| Axis | Field | Holds |
|---|---|---|
| Origin | `Contact Source`, a native standard field [research/raw/piper--ghl-import--highlevel-import-existing-contacts.md] | Where this person first came from |
| Segment | Tags, many per contact [research/raw/piper--ghl-tags--highlevel-add-contact-tag-action.md] | Which campaigns and signals this person is part of |

`Contact Source` is set once, on creation, and never overwritten on an existing contact.
Tags accumulate.

### The naming convention, and why it is strict

Two independent facts force a strict convention:

1. GoHighLevel tags are case sensitive: "'Facebook' and 'facebook' would be treated as
   separate tags" [research/raw/piper--ghl-tags--highlevel-add-contact-tag-action.md], and
   tags are created implicitly on first use with no typo protection
   [research/raw/piper--ghl-tags--highlevel-add-contact-tag-action.md].
2. Attribution practice says the same thing from the analytics side: "Always use lowercase
   for all UTM values" to prevent duplicates, and "Use hyphens to separate words, not
   underscores or spaces"
   [research/raw/piper--attribution--improvado-utm-naming-conventions.md].

A single inconsistent run forks a segment permanently and nothing warns you.

**The convention:**

```
source-{platform}-{signal}-{period}-{campaign}
```

All lowercase, hyphen separated, period anchored, which matches the recommended shape of a
descriptive campaign value such as `2026-q3-product-launch`
[research/raw/piper--attribution--improvado-utm-naming-conventions.md].

Examples:

```
source-facebook-comment-2026-q3-launch
source-instagram-dm-2026-q3-launch
source-linkedin-connect-2026-q3-launch
```

And one campaign-level tag shared across signals, for pulling the whole cohort:

```
campaign-2026-q3-launch
```

### The registry is the previous run

Attribution guidance recommends a documented list of approved values, a running campaign
log, and regular audits for inconsistency
[research/raw/piper--attribution--improvado-utm-naming-conventions.md]. For a daily drip
the registry is not a spreadsheet. It is the previous run's state block.

**Read `CAMPAIGN_TAG` back from the last report and reuse the exact string. Do not
re-derive it.** See `references/high-water-mark.md` for the block. Re-deriving is how a
casing difference gets in.

If no previous tag exists, propose the tag to the user with `AskUserQuestion`, show the
exact string, get it confirmed, and then pin it into the state block. It is much cheaper to
confirm a tag once than to merge two segments later.

### What the signal-type tag is for

It preserves the difference between "commented asking for the thing" and "reacted to the
post". Those are different levels of intent and they should not collapse into one segment.
Signal-level scoring itself is `lead-harvester`'s job, in
`lead-harvester/references/scoring-and-segmentation.md`. This skill preserves the raw signal type so that
scoring is possible later, and does not re-implement the model.

### Why any of this matters

Roughly 30% of large organisations invest significant marketing budget with no reliable way
to track campaign effectiveness
[research/raw/piper--attribution--improvado-utm-naming-conventions.md]. A hand-raiser piped
into a CRM with no source and no campaign tag is a contact that can never be attributed to
the post that produced them, which means the user can never tell which campaign is worth
running again.
