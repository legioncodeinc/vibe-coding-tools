<div align="center">

# Littlebird Skills

### Your work. Your record. Your skills.

**Thirty Claude skills built on the Littlebird MCP. They read what already crossed your screen and what was already said on your calls, and hand you back something you can act on.**

</div>

---

## What this is

Littlebird watches your screen and transcribes your meetings. That means the record of
your work already exists. What has been missing is anything that uses it.

These skills use it. They find the subscription you have paid for and not opened in
ninety days. They rebuild the pipeline that only lives in your head. They write the SOP
for the thing you did last Thursday, because Littlebird watched you do it. They mine the
good line you said on a call and forgot by Thursday, and hand it back as a draft.

Every one was built the same way: real domain research archived to primary sources
first, then the skill written from it. Every claim a skill makes carries a receipt with
a timestamp and the app it came from. When a skill cannot honestly measure something, it
says so instead of producing a confident number.

## Install

This repo is a Claude plugin marketplace. In Claude Cowork or Claude Code:

```text
/plugin marketplace add legioncodeinc/littlebird-skills
/plugin install littlebird-toolkit@littlebird-skills
```

Each folder under [`skills/`](skills/) is also a complete standalone skill. Zip one with
a `.skill` extension, folder at the zip root, and upload it to Claude.
The Wasp Nest marks all 30 as standalone in frontmatter. They run directly in the current assistant or a Routine and do not claim companion Drones.

**Requirements.** Most skills need the Littlebird MCP on a Power or Pro plan, connected
at `https://mcp.littlebird.ai/mcp`. New to Littlebird? The code `E6GP4BQE` gets you two
months free. The Facebook voice creator is the one skill that needs no Littlebird at all.

## How you use them

**Just ask.** Every skill carries its own trigger phrases. Say "who has not paid me",
"what did I promise", "write an SOP for that", "who is about to churn", and the right
skill picks itself up. You never invoke anything by name unless you want to.

**Or put it on a routine.** Littlebird routines are unattended agents that run on a
schedule and push you a report. The split that makes this work:

> **Routines observe. Cowork acts.**
> A routine watches for a condition and writes a report. It cannot ask you a question,
> hold an approval open, or write a file. So it names what it found and hands off. You
> open Cowork, the skill picks up its own past reports, and does the heavy work.

Skills that have a recurring mode will **set up their own routine**. They show you the
exact prompt text and the schedule, you approve it, and it gets created. You do not go
configure anything by hand.

**Nothing gets sent.** Every skill that produces something for another human drafts it
and holds it. Approving a plan is not approving the words, so you see the final text
before anything leaves.

---

## The skills

### Money and business operations

| Skill | What it does | Mode |
|---|---|---|
| [money-leak-auditor](skills/money-leak-auditor/README.md) | Rebuilds every software charge you actually pay from what crossed your screen, then proves which tools you have not opened in 90 days | Monthly + on demand |
| [renewal-sentinel](skills/renewal-sentinel/README.md) | A 90-day calendar of everything about to auto-charge, sorted by the date you have to decide by rather than the date you get billed | Weekly + on demand |
| [invoice-chaser](skills/invoice-chaser/README.md) | Turns "they still have not paid" into a drafted follow-up, without ever chasing a client who already paid you | Weekly + on demand |
| [deal-pipeline-reconstructor](skills/deal-pipeline-reconstructor/README.md) | Rebuilds the pipeline that only exists in your head into a board where every placement shows its evidence | Weekly + on demand |

### Lead generation and growth

| Skill | What it does | Mode |
|---|---|---|
| [lead-harvester](skills/lead-harvester/README.md) | Rebuilds the full list of people who raised a hand at your "comment KEYWORD" campaign, ranks them, drafts each first message | On demand + campaign daily |
| [comment-to-crm-piper](skills/comment-to-crm-piper/README.md) | Catches new hand-raisers since the last run, dedupes against your CRM, tags by campaign, queues a first message | Daily |
| [content-repurposer](skills/content-repurposer/README.md) | Turns one long piece into a week of derivatives that each take a different angle, so nobody reads the same idea five times | On demand |
| [said-it-already](skills/said-it-already/README.md) | Mines what you already said well on calls, screens it, rebuilds it for reading, and hands you a bank of drafts | Weekly |
| [testimonial-miner](skills/testimonial-miner/README.md) | Banks the praise you already earned as verbatim quotes, and tells you which ones you are allowed to publish | Monthly + on demand |
| [competitor-watch](skills/competitor-watch/README.md) | Tracks what your market is actually talking about this week, from what crossed your own screen | Weekly |

### Meetings and follow-through

| Skill | What it does | Mode |
|---|---|---|
| [meeting-scribe](skills/meeting-scribe/README.md) | Turns one call into a sendable follow-up, a decisions record with the quote behind each, and a list of what never landed | Daily evening + on demand |
| [commitment-tracker](skills/commitment-tracker/README.md) | A two-column ledger of what you owe and what you are owed, checked against evidence the thing actually got done | Weekly |
| [who-am-i-ghosting](skills/who-am-i-ghosting/README.md) | Finds the conversations you left hanging, ranked by what the silence costs rather than how old it is | Weekly |
| [pre-call-prep](skills/pre-call-prep/README.md) | A one screen brief for every call, where every line carries a fact you did not already have in your head | Daily |
| [client-health-radar](skills/client-health-radar/README.md) | Which client is about to leave and which is quietly eating your margin, in bands backed by dated quotes | Weekly + on demand |

### Personal productivity

| Skill | What it does | Mode |
|---|---|---|
| [daily-brief](skills/daily-brief/README.md) | One screen every morning, built around the field that earns the open: what changed since yesterday | Daily |
| [day-reconstructor](skills/day-reconstructor/README.md) | Rebuilds a work session into a dev log and a changelog block, including the problems no commit message records | Daily at session end |
| [focus-forensics](skills/focus-forensics/README.md) | The structure of your week: where work held together, where it broke apart, what changed since last week | Weekly |
| [learning-capturer](skills/learning-capturer/README.md) | Stops you re-debugging the same wall, filing each fix keyed on the error text you will actually search for | Weekly |
| [weekly-review](skills/weekly-review/README.md) | One scorecard per week, composed from your other skills' reports, willing to say plainly that the week was poor | Weekly |

### Knowledge and writing

| Skill | What it does | Mode |
|---|---|---|
| [sop-forge](skills/sop-forge/README.md) | Point it at something you already did and it writes the SOP, because Littlebird watched you do it | On demand |
| [knowledge-base-builder](skills/knowledge-base-builder/README.md) | Turns a project's calls and threads into the documentation pack that makes every future AI session productive | On demand + monthly refresh |
| [osint-investigator](skills/osint-investigator/README.md) | Point it at a name and get one evidence-graded brief from your record plus their public footprint, disagreements left standing | On demand only |
| [research-synthesizer](skills/research-synthesizer/README.md) | Give it a topic, get back what you already knew versus what is new, with working links | On demand + optional weekly |
| [brand-voice-guardian](skills/brand-voice-guardian/README.md) | The last read before you hit send: marks up the draft, counts the AI tells, rewrites it in your voice | On demand only |

### Meta and automation

| Skill | What it does | Mode |
|---|---|---|
| [routine-architect](skills/routine-architect/README.md) | Scores your routines against nine failure modes and proves what is broken by quoting your own reports back | On demand + monthly |
| [skill-suggester](skills/skill-suggester/README.md) | Finds the work you did by hand four times this quarter and drafts the SKILL.md for the one worth building | Monthly |

### Voice

The original three. Several skills above draft in your voice when one of these has been
run, and say so plainly when none has.

| Skill | What it does | Mode |
|---|---|---|
| [combined-voice-creator](skills/combined-voice-creator/README.md) | Your voice skill from both Littlebird memory and a Facebook export. The deepest clone | On demand |
| [littlebird-voice-creator](skills/littlebird-voice-creator/README.md) | Your voice skill from Littlebird capture alone | On demand |
| [facebook-voice-creator](skills/facebook-voice-creator/README.md) | Your voice skill from a Facebook export alone, with a screenshot-guided walkthrough | On demand |

---

## Which ones to put on a routine

Routine slots are limited by your Littlebird plan, so treat them as scarce. Do not turn
on fifteen routines in one afternoon. A report you stop opening is worse than no report,
because it trains you to ignore the next one.

### Start with five

These five cover the most ground for the fewest slots, and each one hands off cleanly to
a skill you run when you want to act.

| Routine | When | Why this one first |
|---|---|---|
| [daily-brief](skills/daily-brief/README.md) | Daily, about 45 minutes before your first real decision | The only one you read every day. It pulls from the others, so it gets better as you add them |
| [pre-call-prep](skills/pre-call-prep/README.md) | Daily, 18:30 the evening before | Evening beats morning, because it leaves you time to fix a forgotten commitment before the call |
| [commitment-tracker](skills/commitment-tracker/README.md) | Weekly, Monday 08:00 | The column nobody tracks is what other people owe you |
| [money-leak-auditor](skills/money-leak-auditor/README.md) | Monthly | The one that pays for itself on the first run |
| [weekly-review](skills/weekly-review/README.md) | Weekly, Friday 16:30 | Reads the other four rather than re-deriving them, so it costs almost nothing to add |

### Add as they earn their place

**Daily.** [meeting-scribe](skills/meeting-scribe/README.md) at 18:00 if you run more
than two calls a day. [day-reconstructor](skills/day-reconstructor/README.md) at your
session end plus an hour if you write code.
[comment-to-crm-piper](skills/comment-to-crm-piper/README.md) at 08:00 only while a
campaign is live, then pause it.

**Weekly.** [who-am-i-ghosting](skills/who-am-i-ghosting/README.md),
[client-health-radar](skills/client-health-radar/README.md), and
[competitor-watch](skills/competitor-watch/README.md) all default to Monday 07:30, so
stagger them across the morning rather than stacking three reports at once.
[invoice-chaser](skills/invoice-chaser/README.md) and
[renewal-sentinel](skills/renewal-sentinel/README.md) on Monday.
[deal-pipeline-reconstructor](skills/deal-pipeline-reconstructor/README.md) midweek.
[said-it-already](skills/said-it-already/README.md) and
[learning-capturer](skills/learning-capturer/README.md) Friday afternoon, when the week
has something in it. [focus-forensics](skills/focus-forensics/README.md) Monday, since
it reports on the week that just ended.

**Monthly.** [testimonial-miner](skills/testimonial-miner/README.md) and
[skill-suggester](skills/skill-suggester/README.md) on the 1st.
[routine-architect](skills/routine-architect/README.md) once a month to audit everything
above, which is the routine that keeps the other routines honest.

### Deliberately never on a routine

[sop-forge](skills/sop-forge/README.md),
[osint-investigator](skills/osint-investigator/README.md),
[brand-voice-guardian](skills/brand-voice-guardian/README.md), and the three voice
creators. Each needs an approval gate or a redaction pass that an unattended run cannot
hold open. `osint-investigator` refuses a routine for a second reason worth stating: a
standing job that periodically re-researches a named person is surveillance, not
diligence.

---

## What makes these different

Four rules hold across all thirty.

**Receipts or it did not happen.** Every finding carries its source, the app, and the
timestamp: `[Tuesday, August 11, 2026 23:40 EDT | chrome]`. You can check any line.

**Observed, inferred, external, and unknown are four different things.** A skill never
promotes an inference to an observation by dropping the hedge, and never turns an absence
into a negative finding. "No evidence of X in 90 days" and "X did not happen" are
different claims, and only one of them is supportable.

**Skills refuse to produce numbers they cannot honestly measure.**
`client-health-radar` will not give you a health score, because transcription drops the
sentiment-bearing word in roughly one utterance in six. `focus-forensics` will not tell
you that you lost six hours, because periodic snapshots cannot measure duration.
`deal-pipeline-reconstructor` will not give you a win probability. Each of those refusals
came out of the research, and each is written into the skill.

**Confirm before you encode, confirm before you send.** Anything about to be recorded as
durable fact gets confirmed first. Anything about to reach another person gets approved
as final text, not as a summary of the intent.

Behind each skill sits its own research archive: primary sources fetched and stored one
file per source with a URL and a fetch date, a cited distillation, and domain guides that
never make a claim the archive does not support. Where sources conflicted, both readings
are recorded. Where coverage was thin, the gap is named rather than filled with a guess.
Three hundred and eighty sources across the marketplace.

## What is Littlebird

[Littlebird](https://littlebird.ai) is an ambient memory app for your computer. It
captures your screen activity, joins and transcribes your meetings, connects your
calendar, and exposes all of it to Claude through an MCP server
([docs](https://support.littlebird.ai/docs/mcp/)). That memory is what every skill here
runs on. One to two weeks of normal computer use is enough for most of them to be useful.

## Repo layout

```
littlebird-skills/
├── .claude-plugin/
│   ├── plugin.json          Plugin manifest
│   └── marketplace.json     Marketplace manifest (this repo IS a marketplace)
├── skills/                  30 skills, each with SKILL.md, README.md, references/
├── AGENTS.md                Briefing for coding agents working in this repo
├── CLAUDE.md                Claude-specific pointer to AGENTS.md
├── LICENSE.md
└── README.md
```

Each skill folder holds a `README.md` for humans, a `SKILL.md` for the model,
`references/` with the domain guides, and `references/research/` with the archived
sources everything traces back to.

The Wasp Nest build bundles this pack as a plugin under its own marketplace. It omits the source checkout's marketplace manifest, contributor-only `CLAUDE.md`, and the archived tarball in `skills/_to_delete/` from that plugin package. The thirty skill folders remain intact.

## License and attribution

Created by **Mario Aldayuz and Legion Code Inc.** First-party material is licensed under [AGPL-3.0-or-later](LICENSE.md).

Built for people who want the record to actually do something. Go check what you are paying for.
