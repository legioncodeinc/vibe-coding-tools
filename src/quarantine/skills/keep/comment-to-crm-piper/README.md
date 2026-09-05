# comment-to-crm-piper

Finds the people who raised a hand on your posts since the last run, checks each against your CRM so you are not creating duplicates, tags them by campaign, and drafts a first message per person.

## What it does

Somebody commented on your post at 9:40 last night asking how it works. You saw the notification, you were doing something else, and by the time you remember it is Thursday.

This runs every morning over the window since its last run only. It pulls new comments, reactions, follows, connection requests and the arrival of new DMs, merges the rows into people, and checks each person against your CRM before anything is written.

Where the record lands depends on what you have connected. With a CRM connector it shows you the exact records, you approve, then it upserts. Without one it writes a GoHighLevel-shaped CSV whose headers were verified against HighLevel's documented field labels: `First Name,Last Name,Email,Phone,Contact Source,Tags,Notes`. With neither it gives you a copy-paste block and says what was not automated.

It is the daily drip. `lead-harvester` is the post-mortem after a launch, and running this one daily means the roster never needs reconstructing.

## When to use it

- You post most days and keep losing the people who reply.
- You want new commenters in the CRM tagged by campaign, without duplicates.

Just ask for it. Trigger phrases include "who engaged with my post today", "pipe my new comments into the CRM", "add today's leads to GoHighLevel", "anyone new since yesterday", "daily lead drip".

## Run it on a routine, or on demand

| Mode | Cadence | What happens |
|---|---|---|
| Daily watcher | 08:00 local by default | Reports new hand-raisers since the watermark, the unnamed gap, second signals, and who waited past your target |
| Cowork run | When you collect | Dedupes against the CRM, picks the tier, drafts messages, writes records after you approve |

Take the routine. It is the point of the skill. 07:00, 12:00 and 17:00 are offered too: earlier means the overnight batch is ready first thing, later includes the day's engagement. The skill sets it up: it shows you the prompt and schedule, you approve, it creates it. The routine only observes, and never writes or sends.

## What you get

One file per run, `piper-queue-YYYY-MM-DD.md`, plus `piper-import-YYYY-MM-DD.csv` where the import tier applies.

Each person is a row: name, signal type, event time, receipt, campaign tag, dedupe status, elapsed time against your target, the drafted message in full, and a confidence rating. Dedupe status is specific rather than tidy: `new (name-only search)`, `existing (opted out, skipped)`, `collision`.

Then the dedupe report, the unnamed gap, exclusions with reasons, what was and was not automated, and the state block setting the next run's watermark.

## What it needs

- The Littlebird MCP on a Power or Pro plan.
- A CRM connector, optional. Its absence is not a failure, it picks the tier.
- A personal voice skill, optional. If installed, drafts go through it. If not, the skill writes plainly and says so.
- One decision from you: the exact campaign tag string. Casing forks segments permanently.

## Limits worth knowing

Most hand-raisers arrive with a display name and nothing else, so a "new" verdict often rests on a name-only search. The skill records it that way, because deterministic matching alone misses an estimated 30 to 40% of real duplicates.

Its consent position is nuanced. Public availability is not permission, and the UK regulator says so. The skill stays inside the reasonable-expectation test by queuing exactly one message fulfilling the request the person made, and enrolling nobody in a sequence. A private message is recorded as sender, time and receipt only. The body never becomes a CRM note, and a do-not-disturb contact is skipped.

It drafts and holds. It never sends, in any tier, including the one where a connector would allow it.

## Related skills

[lead-harvester](../lead-harvester/README.md), the post-mortem sibling, to reconstruct a campaign after a launch.
[deal-pipeline-reconstructor](../deal-pipeline-reconstructor/README.md), once a piped lead is a real opportunity.
[who-am-i-ghosting](../who-am-i-ghosting/README.md), for people already in a thread who never got a reply.
[routine-architect](../routine-architect/README.md), to reshape or merge the daily watcher.
[littlebird-voice-creator](../littlebird-voice-creator/README.md), to build the voice the drafts use.

## Under the hood

`SKILL.md` has the full instruction set. `references/` holds `high-water-mark.md`, `crm-tiers-and-import-formats.md`, `dedupe-against-crm.md` and `consent-and-tagging.md`.

`references/research/` archives 17 primary sources, including HighLevel's import and upsert docs, the FTC CAN-SPAM guide, and two ICO direct-marketing guides. Every domain claim traces to one.
