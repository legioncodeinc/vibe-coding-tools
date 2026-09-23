# Littlebird Skills - Roadmap & Stub Pack (24 skills)

_Generated for the `littlebird-skills` Claude Cowork marketplace. Each skill = a process; the Littlebird MCP = the context; a Routine = the schedule. Drop each stub into `skills/<name>/SKILL.md`._

## Littlebird MCP call legend

These conceptual calls map to the Littlebird MCP surface (the same context Littlebird sees across screen, chats, and meetings), plus the `lb_internal` routine tools and the integrations Cowork can act through. Confirm exact tool names in **Settings > MCP Clients**.

| Call | What it does |
|------|--------------|
| `search_context(query, date_range)` | Semantic search over captured screen/memory snapshots |
| `search_chats(query)` | Search past Littlebird conversations |
| `list_meetings(range)` / `get_meeting(id)` | List recorded meetings / fetch summary + action items |
| `get_transcript(id)` | Full meeting transcript |
| `get_calendar(range)` | Upcoming + past calendar events |
| `list_routines()` / `get_routine_reports(id)` | Read routine config + past run reports (`lb_internal`) |
| `act.gmail` / `act.ghl` / `act.paypal` / `act.calendar` | Cowork takes an action in a connected integration |
| `voice.apply(mario-aldayuz-voice)` | Run output through your voice skill |
| `web.search` / `web.fetch` | Cowork web research (public sources) |

> Routines can't be created from chat - set them up in the Routines tab. Each skill's "Routine cadence" is the schedule to attach when you wire it up.

## The 24 at a glance

| # | Skill | Cat | One-liner | Routine |
|---|-------|-----|-----------|---------|
| 1 | `money-leak-auditor` | A | Sweeps captured screen history for invoices, renewal notices, price-increase emails, and failed/declined charges, then cross-references recurring vendors month-over-month to flag creeping SaaS costs, silent price bumps, double-billing, and zombie subscriptions. | Monthly on the 1st, emailed. |
| 2 | `renewal-sentinel` | A | Focused on domains, SSL, hosting, API plans, and annual tool renewals. Mines context and calendar for renewal dates and builds a forward-looking calendar of upcoming auto-charges, drafting cancel/downgrade messages for the ones you flag. | Weekly, push + email. |
| 3 | `invoice-chaser` | A | Scans for invoices you SENT (Stripe, PayPal, screen-visible dashboards) and matches them against payments received, surfacing what's outstanding and aging, then drafts a polite-to-firm follow-up ladder per overdue client in your voice. | Weekly (e.g. Monday AM). |
| 4 | `deal-pipeline-reconstructor` | A | Reconstructs your sales pipeline from raw activity - prospect names in DMs, calls, proposals seen on screen, and calendar holds - into a stage-by-stage board with last-touch recency and a 'going cold' list. | Weekly. |
| 5 | `lead-harvester` | B | Mines captured social activity around a launch window for everyone who commented the keyword, DM'd, or friend-requested, dedupes into a clean outreach list, enriches with any context Littlebird already has on each name, and drafts a first-touch DM per person. | Daily during an active launch window. |
| 6 | `comment-to-crm-piper` | B | Continuous sibling to the harvester: watches for engagement on your posts and pipes new hand-raisers into GoHighLevel, tagged by campaign, with a drafted first message queued. | Daily. |
| 7 | `content-repurposer` | B | Takes a single long-form artifact (an FB post, a call transcript, a Loom) and spins it into a week of derivatives - short posts, a carousel outline, an email, a thread - all matched to your voice and drama-filtered. | Optional: weekly repurpose of your best-performing post. |
| 8 | `testimonial-miner` | B | Digs through captured DMs, comments, and reviews for praise, wins, and 'you changed my business' moments, then packages them as clean, quotable social proof with attribution and the date said. | Monthly. |
| 9 | `competitor-watch` | B | You point it at competitor names/sites; it fuses what's crossed your screen (their posts, pricing pages, launches you've read) with fresh web research into a monthly 'what changed' brief. | Monthly. |
| 10 | `meeting-scribe` | C | Turns each recorded meeting into the decisions made, a follow-up message in your voice to send attendees, and commitments logged so nothing slips. | Daily evening, or triggered per meeting. |
| 11 | `commitment-tracker` | C | Continuously scans meetings, DMs, and email for promises YOU made ('I'll send that Friday') and promises made TO you, maintaining an open-loops ledger with aging. | Daily evening digest. |
| 12 | `who-am-i-ghosting` | C | Surfaces threads, DMs, and emails you've left hanging across everything Littlebird sees, ranked by how long they've gone cold and how important the person is, with a re-engagement line drafted for each. | Weekly. |
| 13 | `pre-call-prep` | C | Before any calendar event, auto-assembles a one-pager: who you're meeting, your full history with them, open loops, and three talking points - working even for people not named on the invite via context matching. | Every morning for the day's calendar. |
| 14 | `daily-brief` | D | Your morning digest: today's calendar, top open commitments due, anything that went cold, unread-but-important threads, and one 'highest-leverage thing to do today' pick based on active projects. | Daily 6-7am, push + email. |
| 15 | `day-reconstructor` | D | Rebuilds what you actually did across a session - repos touched, files edited, tools used, problems solved - into a dev log / changelog entry. (You've had me do this by hand for Simple Scheduler and Owl's Roost.) | Daily end-of-day (e.g. 6am after a night session). |
| 16 | `focus-forensics` | D | Analyzes capture history for where time actually went (deep work vs context-switching vs rabbit holes), flags your most fragmented hours, and delivers a weekly 'you lost ~X hours to Y' report with one behavioral nudge. | Weekly (Sunday or Monday). |
| 17 | `learning-capturer` | D | Watches for moments you solved something hard (an API error fixed, a Svelte gotcha, a Supabase quirk) and files them into a personal, searchable knowledge base of 'how I fixed this last time.' | Weekly, appended to a running KB doc. |
| 18 | `knowledge-base-builder` | E | The engine behind your docs suite: ingests a body of context (a project's chats, meetings, files) and generates structured, AI-ingestible markdown - PRDs, architecture notes, brand briefs - with your consistency rules baked in. | Optional: weekly refresh of a living KB. |
| 19 | `osint-investigator` | E | Point it at a name; it fuses Littlebird's internal knowledge (every time that person crossed your screen, with timestamped receipts) with external web research into a dossier framed for legitimate due-diligence. | Not recommended as an unattended routine. |
| 20 | `brand-voice-guardian` | E | Runs any draft (yours or a teammate's) against your mario-aldayuz-voice skill and flags where it drifts off-tone, sounds AI-generated, or breaks your anti-detection rules, returning a marked-up corrected version. | N/A (interactive). |
| 21 | `research-synthesizer` | E | Give it a topic; it pulls what you've already read on screen about it, layers in fresh web research, and returns a synthesis that separates 'what you already knew' from 'what's new,' with sources. | Optional: weekly on a standing research topic. |
| 22 | `routine-architect` | F | The meta-skill: audits your existing Littlebird routines (config + past reports), rewrites weak prompts, proposes new ones from your patterns, and lays out the 'Routines observe, Cowork acts' wiring. | Monthly review. |
| 23 | `skill-suggester` | F | Watches for repeated manual workflows in your capture history ('Mario has reconstructed a dev log by hand four times') and proactively proposes a new Cowork skill to automate it, pre-drafting the SKILL.md. | Monthly. |
| 24 | `weekly-review` | F | The capstone digest: pulls the week's meetings, commitments closed vs dropped, leads captured, money leaks found, and content shipped into one scorecard with next week's top three. | Sunday evening, push + email. |


---

## A. Money & Business Ops

### 1. `money-leak-auditor`

```markdown
---
name: money-leak-auditor
description: Find every dollar quietly leaking out of your stack. Sweeps captured screen history for invoices, renewal notices, price-increase emails, and failed/declined charges, then cross-references recurring vendors month-over-month to flag creeping SaaS costs, silent price bumps, double-billing, and zombie subscriptions.
version: 0.1.0
harness: claude-cowork
requires:
  - littlebird-mcp
---

# money-leak-auditor

> **Critical Directive**
> You must read all files and context in this skill before acting. If your core
> knowledge is insufficient, search the connected Littlebird context, the web, and
> related skills before proceeding. Draft outputs for approval - never send, post,
> or write to an integration without explicit user confirmation.

## Purpose
Sweeps captured screen history for invoices, renewal notices, price-increase emails, and failed/declined charges, then cross-references recurring vendors month-over-month to flag creeping SaaS costs, silent price bumps, double-billing, and zombie subscriptions.

## Littlebird MCP calls used
- `search_context('invoice OR receipt OR renewal OR "payment declined" OR "price increase"', last_35_days)`
- `search_context(vendor_name, last_90_days)  # per flagged vendor, to compare amounts over time`
- `act.gmail(search: 'from:billing OR subject:receipt')  # optional corroboration`

## Trigger
Manual, or scheduled monthly sweep.

## Routine cadence
Monthly on the 1st, emailed.  _(Routines are created in the Littlebird Routines tab, not from chat - attach this schedule there.)_

## Process
1. **Gather** - run the MCP calls above to pull the relevant context window.
2. **Filter** - drop third-party private content per the guardrail below.
3. **Analyze** - sweeps captured screen history for invoices
4. **Draft** - produce the output; apply `mario-aldayuz-voice` where the output is written in the user's voice.
5. **Hand off** - present for approval; only then act through an integration.

## Output
Ledger table: vendor | last-seen amount | delta vs prior month | first-seen | kill/keep/renegotiate rec. Plus a 'declined charges needing action' section.

## Guardrail
Never expose amounts tied to third parties' private billing that happened to cross the screen; report only the user's own spend.

## Related skills
`renewal-sentinel`, `invoice-chaser`, `deal-pipeline-reconstructor`
```

### 2. `renewal-sentinel`

```markdown
---
name: renewal-sentinel
description: A 90-day radar for everything about to auto-charge. Focused on domains, SSL, hosting, API plans, and annual tool renewals. Mines context and calendar for renewal dates and builds a forward-looking calendar of upcoming auto-charges, drafting cancel/downgrade messages for the ones you flag.
version: 0.1.0
harness: claude-cowork
requires:
  - littlebird-mcp
---

# renewal-sentinel

> **Critical Directive**
> You must read all files and context in this skill before acting. If your core
> knowledge is insufficient, search the connected Littlebird context, the web, and
> related skills before proceeding. Draft outputs for approval - never send, post,
> or write to an integration without explicit user confirmation.

## Purpose
Focused on domains, SSL, hosting, API plans, and annual tool renewals. Mines context and calendar for renewal dates and builds a forward-looking calendar of upcoming auto-charges, drafting cancel/downgrade messages for the ones you flag.

## Littlebird MCP calls used
- `search_context('renewal OR expires OR "auto-renew" OR domain OR SSL OR "annual plan"', last_120_days)`
- `get_calendar(next_90_days)  # catch renewal reminders already on calendar`
- `act.gmail(draft: cancel/downgrade message)  # per flagged item`

## Trigger
Manual, or weekly.

## Routine cadence
Weekly, push + email.  _(Routines are created in the Littlebird Routines tab, not from chat - attach this schedule there.)_

## Process
1. **Gather** - run the MCP calls above to pull the relevant context window.
2. **Filter** - drop third-party private content per the guardrail below.
3. **Analyze** - focused on domains
4. **Draft** - produce the output; apply `mario-aldayuz-voice` where the output is written in the user's voice.
5. **Hand off** - present for approval; only then act through an integration.

## Output
90-day renewal calendar (date | item | est. amount | action) and drafted cancel/downgrade notes for flagged items.

## Guardrail
Only surface the user's own renewals; ignore renewal notices belonging to clients or colleagues.

## Related skills
`money-leak-auditor`, `invoice-chaser`, `deal-pipeline-reconstructor`
```

### 3. `invoice-chaser`

```markdown
---
name: invoice-chaser
description: Turn 'they haven't paid yet' into a sent follow-up. Scans for invoices you SENT (Stripe, PayPal, screen-visible dashboards) and matches them against payments received, surfacing what's outstanding and aging, then drafts a polite-to-firm follow-up ladder per overdue client in your voice.
version: 0.1.0
harness: claude-cowork
requires:
  - littlebird-mcp
  - mario-aldayuz-voice
---

# invoice-chaser

> **Critical Directive**
> You must read all files and context in this skill before acting. If your core
> knowledge is insufficient, search the connected Littlebird context, the web, and
> related skills before proceeding. Draft outputs for approval - never send, post,
> or write to an integration without explicit user confirmation.

## Purpose
Scans for invoices you SENT (Stripe, PayPal, screen-visible dashboards) and matches them against payments received, surfacing what's outstanding and aging, then drafts a polite-to-firm follow-up ladder per overdue client in your voice.

## Littlebird MCP calls used
- `search_context('invoice sent OR "amount due" OR "payment pending"', last_60_days)`
- `act.paypal(list_transactions)  # reconcile paid vs unpaid`
- `voice.apply(mario-aldayuz-voice)  # tone the follow-ups`
- `act.gmail(draft: reminder)  # per overdue invoice`

## Trigger
Manual, or weekly.

## Routine cadence
Weekly (e.g. Monday AM).  _(Routines are created in the Littlebird Routines tab, not from chat - attach this schedule there.)_

## Process
1. **Gather** - run the MCP calls above to pull the relevant context window.
2. **Filter** - drop third-party private content per the guardrail below.
3. **Analyze** - scans for invoices you sent (stripe
4. **Draft** - produce the output; apply `mario-aldayuz-voice` where the output is written in the user's voice.
5. **Hand off** - present for approval; only then act through an integration.

## Output
Aging AR table (client | invoice | amount | days overdue) + a drafted follow-up per client, escalating by age.

## Guardrail
Client financial data stays internal; never CC or expose one client's balance to another.

## Related skills
`money-leak-auditor`, `renewal-sentinel`, `deal-pipeline-reconstructor`
```

### 4. `deal-pipeline-reconstructor`

```markdown
---
name: deal-pipeline-reconstructor
description: Rebuild the pipeline that's currently living in your head. Reconstructs your sales pipeline from raw activity - prospect names in DMs, calls, proposals seen on screen, and calendar holds - into a stage-by-stage board with last-touch recency and a 'going cold' list.
version: 0.1.0
harness: claude-cowork
requires:
  - littlebird-mcp
---

# deal-pipeline-reconstructor

> **Critical Directive**
> You must read all files and context in this skill before acting. If your core
> knowledge is insufficient, search the connected Littlebird context, the web, and
> related skills before proceeding. Draft outputs for approval - never send, post,
> or write to an integration without explicit user confirmation.

## Purpose
Reconstructs your sales pipeline from raw activity - prospect names in DMs, calls, proposals seen on screen, and calendar holds - into a stage-by-stage board with last-touch recency and a 'going cold' list.

## Littlebird MCP calls used
- `search_context('proposal OR quote OR "follow up" OR discovery call', last_60_days)`
- `list_meetings(last_60_days)  # sales calls`
- `get_calendar(last_60_days)  # prospect holds`
- `search_chats('deal OR prospect OR client')`

## Trigger
Manual, or weekly.

## Routine cadence
Weekly.  _(Routines are created in the Littlebird Routines tab, not from chat - attach this schedule there.)_

## Process
1. **Gather** - run the MCP calls above to pull the relevant context window.
2. **Filter** - drop third-party private content per the guardrail below.
3. **Analyze** - reconstructs your sales pipeline from raw activity - prospect names in dms
4. **Draft** - produce the output; apply `mario-aldayuz-voice` where the output is written in the user's voice.
5. **Hand off** - present for approval; only then act through an integration.

## Output
Kanban-style board (Lead / Qualified / Proposal / Closing) with last-touch date per deal and a highlighted 'going cold' column.

## Guardrail
Keep prospect identities and deal values in the user's own workspace; do not enrich with sensitive third-party data.

## Related skills
`money-leak-auditor`, `renewal-sentinel`, `invoice-chaser`
```


---

## B. Lead-Gen & Growth

### 5. `lead-harvester`

```markdown
---
name: lead-harvester
description: Every 'comment X' hand-raiser, deduped and ready to DM. Mines captured social activity around a launch window for everyone who commented the keyword, DM'd, or friend-requested, dedupes into a clean outreach list, enriches with any context Littlebird already has on each name, and drafts a first-touch DM per person.
version: 0.1.0
harness: claude-cowork
requires:
  - littlebird-mcp
  - mario-aldayuz-voice
---

# lead-harvester

> **Critical Directive**
> You must read all files and context in this skill before acting. If your core
> knowledge is insufficient, search the connected Littlebird context, the web, and
> related skills before proceeding. Draft outputs for approval - never send, post,
> or write to an integration without explicit user confirmation.

## Purpose
Mines captured social activity around a launch window for everyone who commented the keyword, DM'd, or friend-requested, dedupes into a clean outreach list, enriches with any context Littlebird already has on each name, and drafts a first-touch DM per person.

## Littlebird MCP calls used
- `search_context('comment "<KEYWORD>" OR "sent you a friend request" OR new message', campaign_window)`
- `search_context(person_name, all_time)  # enrich each lead`
- `voice.apply(mario-aldayuz-voice)  # draft first touch`

## Trigger
Per campaign; daily during a launch.

## Routine cadence
Daily during an active launch window.  _(Routines are created in the Littlebird Routines tab, not from chat - attach this schedule there.)_

## Process
1. **Gather** - run the MCP calls above to pull the relevant context window.
2. **Filter** - drop third-party private content per the guardrail below.
3. **Analyze** - mines captured social activity around a launch window for everyone who commented the keyword
4. **Draft** - produce the output; apply `mario-aldayuz-voice` where the output is written in the user's voice.
5. **Hand off** - present for approval; only then act through an integration.

## Output
Deduped lead list (name | source | keyword | prior context | drafted DM), export-ready as CSV.

## Guardrail
Only harvest engagement on the USER'S OWN posts; exclude private DM contents of third parties from any shared export.

## Related skills
`comment-to-crm-piper`, `content-repurposer`, `testimonial-miner`, `competitor-watch`
```

### 6. `comment-to-crm-piper`

```markdown
---
name: comment-to-crm-piper
description: Pipe new hand-raisers straight into GoHighLevel. Continuous sibling to the harvester: watches for engagement on your posts and pipes new hand-raisers into GoHighLevel, tagged by campaign, with a drafted first message queued.
version: 0.1.0
harness: claude-cowork
requires:
  - littlebird-mcp
  - mario-aldayuz-voice
---

# comment-to-crm-piper

> **Critical Directive**
> You must read all files and context in this skill before acting. If your core
> knowledge is insufficient, search the connected Littlebird context, the web, and
> related skills before proceeding. Draft outputs for approval - never send, post,
> or write to an integration without explicit user confirmation.

## Purpose
Continuous sibling to the harvester: watches for engagement on your posts and pipes new hand-raisers into GoHighLevel, tagged by campaign, with a drafted first message queued.

## Littlebird MCP calls used
- `search_context('new comment OR new DM OR friend request', since_last_run)`
- `act.ghl(upsert_contact, tags=[campaign])`
- `voice.apply(mario-aldayuz-voice)  # queue first message`

## Trigger
Manual, or scheduled.

## Routine cadence
Daily.  _(Routines are created in the Littlebird Routines tab, not from chat - attach this schedule there.)_

## Process
1. **Gather** - run the MCP calls above to pull the relevant context window.
2. **Filter** - drop third-party private content per the guardrail below.
3. **Analyze** - continuous sibling to the harvester: watches for engagement on your posts and pipes new hand-raisers into gohighlevel
4. **Draft** - produce the output; apply `mario-aldayuz-voice` where the output is written in the user's voice.
5. **Hand off** - present for approval; only then act through an integration.

## Output
Count of new contacts piped to GHL, tagged by campaign, each with a queued first-touch draft; skips duplicates already in CRM.

## Guardrail
Consent-aware: only pipe public engagers on the user's content; never scrape private message threads into the CRM.

## Related skills
`lead-harvester`, `content-repurposer`, `testimonial-miner`, `competitor-watch`
```

### 7. `content-repurposer`

```markdown
---
name: content-repurposer
description: One long-form piece becomes a week of voice-matched content. Takes a single long-form artifact (an FB post, a call transcript, a Loom) and spins it into a week of derivatives - short posts, a carousel outline, an email, a thread - all matched to your voice and drama-filtered.
version: 0.1.0
harness: claude-cowork
requires:
  - littlebird-mcp
  - mario-aldayuz-voice
---

# content-repurposer

> **Critical Directive**
> You must read all files and context in this skill before acting. If your core
> knowledge is insufficient, search the connected Littlebird context, the web, and
> related skills before proceeding. Draft outputs for approval - never send, post,
> or write to an integration without explicit user confirmation.

## Purpose
Takes a single long-form artifact (an FB post, a call transcript, a Loom) and spins it into a week of derivatives - short posts, a carousel outline, an email, a thread - all matched to your voice and drama-filtered.

## Littlebird MCP calls used
- `search_context('<source post or topic>', recent)  OR  get_transcript(id)`
- `voice.apply(mario-aldayuz-voice)  # tone every derivative`

## Trigger
On demand from a chosen source.

## Routine cadence
Optional: weekly repurpose of your best-performing post.  _(Routines are created in the Littlebird Routines tab, not from chat - attach this schedule there.)_

## Process
1. **Gather** - run the MCP calls above to pull the relevant context window.
2. **Filter** - drop third-party private content per the guardrail below.
3. **Analyze** - takes a single long-form artifact (an fb post
4. **Draft** - produce the output; apply `mario-aldayuz-voice` where the output is written in the user's voice.
5. **Hand off** - present for approval; only then act through an integration.

## Output
A content pack: 5-7 short posts, 1 carousel outline, 1 email, 1 thread - all voice-matched and free of sensitive/legal drama.

## Guardrail
Strip any private names, legal/security matters, and third-party content before anything is drafted for public use.

## Related skills
`lead-harvester`, `comment-to-crm-piper`, `testimonial-miner`, `competitor-watch`
```

### 8. `testimonial-miner`

```markdown
---
name: testimonial-miner
description: Mine the praise you've already earned into social proof. Digs through captured DMs, comments, and reviews for praise, wins, and 'you changed my business' moments, then packages them as clean, quotable social proof with attribution and the date said.
version: 0.1.0
harness: claude-cowork
requires:
  - littlebird-mcp
---

# testimonial-miner

> **Critical Directive**
> You must read all files and context in this skill before acting. If your core
> knowledge is insufficient, search the connected Littlebird context, the web, and
> related skills before proceeding. Draft outputs for approval - never send, post,
> or write to an integration without explicit user confirmation.

## Purpose
Digs through captured DMs, comments, and reviews for praise, wins, and 'you changed my business' moments, then packages them as clean, quotable social proof with attribution and the date said.

## Littlebird MCP calls used
- `search_context('"thank you" OR "changed my" OR "best decision" OR testimonial OR review', last_180_days)`
- `search_context(person_name, all_time)  # confirm attribution/title`

## Trigger
Manual, or monthly.

## Routine cadence
Monthly.  _(Routines are created in the Littlebird Routines tab, not from chat - attach this schedule there.)_

## Process
1. **Gather** - run the MCP calls above to pull the relevant context window.
2. **Filter** - drop third-party private content per the guardrail below.
3. **Analyze** - digs through captured dms
4. **Draft** - produce the output; apply `mario-aldayuz-voice` where the output is written in the user's voice.
5. **Hand off** - present for approval; only then act through an integration.

## Output
Quote bank (quote | who said it | their title/role | date | source), ready for landing pages and case studies.

## Guardrail
Get implicit source is public or user-owned; flag any quote from a private DM as 'needs permission before public use.'

## Related skills
`lead-harvester`, `comment-to-crm-piper`, `content-repurposer`, `competitor-watch`
```

### 9. `competitor-watch`

```markdown
---
name: competitor-watch
description: A monthly brief on what your rivals shipped, priced, and said. You point it at competitor names/sites; it fuses what's crossed your screen (their posts, pricing pages, launches you've read) with fresh web research into a monthly 'what changed' brief.
version: 0.1.0
harness: claude-cowork
requires:
  - littlebird-mcp
---

# competitor-watch

> **Critical Directive**
> You must read all files and context in this skill before acting. If your core
> knowledge is insufficient, search the connected Littlebird context, the web, and
> related skills before proceeding. Draft outputs for approval - never send, post,
> or write to an integration without explicit user confirmation.

## Purpose
You point it at competitor names/sites; it fuses what's crossed your screen (their posts, pricing pages, launches you've read) with fresh web research into a monthly 'what changed' brief.

## Littlebird MCP calls used
- `search_context('<competitor name or domain>', last_35_days)`
- `web.search('<competitor> launch OR pricing OR announcement 2026')  # via Cowork web`
- `web.fetch(pricing_page_url)`

## Trigger
Manual, or monthly.

## Routine cadence
Monthly.  _(Routines are created in the Littlebird Routines tab, not from chat - attach this schedule there.)_

## Process
1. **Gather** - run the MCP calls above to pull the relevant context window.
2. **Filter** - drop third-party private content per the guardrail below.
3. **Analyze** - you point it at competitor names/sites; it fuses what's crossed your screen (their posts
4. **Draft** - produce the output; apply `mario-aldayuz-voice` where the output is written in the user's voice.
5. **Hand off** - present for approval; only then act through an integration.

## Output
Per-competitor brief: what they shipped, pricing changes, positioning/messaging shifts, and one 'so what for us' takeaway.

## Guardrail
Public sources only; no scraping of private/gated competitor data.

## Related skills
`lead-harvester`, `comment-to-crm-piper`, `content-repurposer`, `testimonial-miner`
```


---

## C. Meetings & Follow-Through

### 10. `meeting-scribe`

```markdown
---
name: meeting-scribe
description: Every call becomes decisions, a follow-up, and logged commitments. Turns each recorded meeting into the decisions made, a follow-up message in your voice to send attendees, and commitments logged so nothing slips.
version: 0.1.0
harness: claude-cowork
requires:
  - littlebird-mcp
  - mario-aldayuz-voice
---

# meeting-scribe

> **Critical Directive**
> You must read all files and context in this skill before acting. If your core
> knowledge is insufficient, search the connected Littlebird context, the web, and
> related skills before proceeding. Draft outputs for approval - never send, post,
> or write to an integration without explicit user confirmation.

## Purpose
Turns each recorded meeting into the decisions made, a follow-up message in your voice to send attendees, and commitments logged so nothing slips.

## Littlebird MCP calls used
- `list_meetings(today)  OR  get_meeting(id)`
- `get_transcript(id)`
- `voice.apply(mario-aldayuz-voice)  # draft the recap`
- `act.gmail(draft: recap to attendees)`

## Trigger
After each call, or an evening sweep.

## Routine cadence
Daily evening, or triggered per meeting.  _(Routines are created in the Littlebird Routines tab, not from chat - attach this schedule there.)_

## Process
1. **Gather** - run the MCP calls above to pull the relevant context window.
2. **Filter** - drop third-party private content per the guardrail below.
3. **Analyze** - turns each recorded meeting into the decisions made
4. **Draft** - produce the output; apply `mario-aldayuz-voice` where the output is written in the user's voice.
5. **Hand off** - present for approval; only then act through an integration.

## Output
Per meeting: decisions list, drafted follow-up email in your voice, and commitments extracted into the tracker.

## Guardrail
Do not send anything automatically; drafts wait for approval. Respect confidentiality of anything marked private in the call.

## Related skills
`commitment-tracker`, `who-am-i-ghosting`, `pre-call-prep`
```

### 11. `commitment-tracker`

```markdown
---
name: commitment-tracker
description: The accountability ledger of who owes what. Continuously scans meetings, DMs, and email for promises YOU made ('I'll send that Friday') and promises made TO you, maintaining an open-loops ledger with aging.
version: 0.1.0
harness: claude-cowork
requires:
  - littlebird-mcp
---

# commitment-tracker

> **Critical Directive**
> You must read all files and context in this skill before acting. If your core
> knowledge is insufficient, search the connected Littlebird context, the web, and
> related skills before proceeding. Draft outputs for approval - never send, post,
> or write to an integration without explicit user confirmation.

## Purpose
Continuously scans meetings, DMs, and email for promises YOU made ('I'll send that Friday') and promises made TO you, maintaining an open-loops ledger with aging.

## Littlebird MCP calls used
- `list_meetings(last_14_days) + get_transcript(id)`
- `search_context('"I will" OR "I\'ll send" OR "by Friday" OR "get back to you"', last_14_days)`
- `act.gmail(search: sent, for promises you made)`

## Trigger
Manual, or daily.

## Routine cadence
Daily evening digest.  _(Routines are created in the Littlebird Routines tab, not from chat - attach this schedule there.)_

## Process
1. **Gather** - run the MCP calls above to pull the relevant context window.
2. **Filter** - drop third-party private content per the guardrail below.
3. **Analyze** - continuously scans meetings
4. **Draft** - produce the output; apply `mario-aldayuz-voice` where the output is written in the user's voice.
5. **Hand off** - present for approval; only then act through an integration.

## Output
Two-column ledger: 'You owe' (item | to whom | promised date | age) and 'Owed to you'; overdue items flagged red.

## Guardrail
Only track the user's own commitments and those directed at them; ignore promises between third parties.

## Related skills
`meeting-scribe`, `who-am-i-ghosting`, `pre-call-prep`
```

### 12. `who-am-i-ghosting`

```markdown
---
name: who-am-i-ghosting
description: Surface the threads you've left hanging - ranked by who matters. Surfaces threads, DMs, and emails you've left hanging across everything Littlebird sees, ranked by how long they've gone cold and how important the person is, with a re-engagement line drafted for each.
version: 0.1.0
harness: claude-cowork
requires:
  - littlebird-mcp
  - mario-aldayuz-voice
---

# who-am-i-ghosting

> **Critical Directive**
> You must read all files and context in this skill before acting. If your core
> knowledge is insufficient, search the connected Littlebird context, the web, and
> related skills before proceeding. Draft outputs for approval - never send, post,
> or write to an integration without explicit user confirmation.

## Purpose
Surfaces threads, DMs, and emails you've left hanging across everything Littlebird sees, ranked by how long they've gone cold and how important the person is, with a re-engagement line drafted for each.

## Littlebird MCP calls used
- `search_context('unread OR "waiting on you" OR last message from them', last_30_days)`
- `act.gmail(search: threads awaiting your reply)`
- `search_context(person_name)  # importance/relationship signal`
- `voice.apply(mario-aldayuz-voice)  # draft re-engagement`

## Trigger
Manual, or weekly.

## Routine cadence
Weekly.  _(Routines are created in the Littlebird Routines tab, not from chat - attach this schedule there.)_

## Process
1. **Gather** - run the MCP calls above to pull the relevant context window.
2. **Filter** - drop third-party private content per the guardrail below.
3. **Analyze** - surfaces threads
4. **Draft** - produce the output; apply `mario-aldayuz-voice` where the output is written in the user's voice.
5. **Hand off** - present for approval; only then act through an integration.

## Output
Ranked list (person | last contact | days cold | why they matter | drafted re-engagement line).

## Guardrail
Never surface the contents of others' private conversations - only threads the user is a participant in.

## Related skills
`meeting-scribe`, `commitment-tracker`, `pre-call-prep`
```

### 13. `pre-call-prep`

```markdown
---
name: pre-call-prep
description: Walk into every call already briefed. Before any calendar event, auto-assembles a one-pager: who you're meeting, your full history with them, open loops, and three talking points - working even for people not named on the invite via context matching.
version: 0.1.0
harness: claude-cowork
requires:
  - littlebird-mcp
---

# pre-call-prep

> **Critical Directive**
> You must read all files and context in this skill before acting. If your core
> knowledge is insufficient, search the connected Littlebird context, the web, and
> related skills before proceeding. Draft outputs for approval - never send, post,
> or write to an integration without explicit user confirmation.

## Purpose
Before any calendar event, auto-assembles a one-pager: who you're meeting, your full history with them, open loops, and three talking points - working even for people not named on the invite via context matching.

## Littlebird MCP calls used
- `get_calendar(today)`
- `search_context(attendee_name, all_time)  # full history`
- `list_meetings + get_meeting  # past calls with them`
- `search_context('promised OR owe OR open loop', attendee_name)`

## Trigger
Morning, for that day's calls; or on demand before one.

## Routine cadence
Every morning for the day's calendar.  _(Routines are created in the Littlebird Routines tab, not from chat - attach this schedule there.)_

## Process
1. **Gather** - run the MCP calls above to pull the relevant context window.
2. **Filter** - drop third-party private content per the guardrail below.
3. **Analyze** - before any calendar event
4. **Draft** - produce the output; apply `mario-aldayuz-voice` where the output is written in the user's voice.
5. **Hand off** - present for approval; only then act through an integration.

## Output
Per meeting one-pager: who + role, relationship history, last promises/open loops, and 3 suggested talking points.

## Guardrail
Pull only context the user has legitimate access to; do not fabricate details about attendees.

## Related skills
`meeting-scribe`, `commitment-tracker`, `who-am-i-ghosting`
```


---

## D. Personal Productivity

### 14. `daily-brief`

```markdown
---
name: daily-brief
description: Land in your day with everything already in view. Your morning digest: today's calendar, top open commitments due, anything that went cold, unread-but-important threads, and one 'highest-leverage thing to do today' pick based on active projects.
version: 0.1.0
harness: claude-cowork
requires:
  - littlebird-mcp
---

# daily-brief

> **Critical Directive**
> You must read all files and context in this skill before acting. If your core
> knowledge is insufficient, search the connected Littlebird context, the web, and
> related skills before proceeding. Draft outputs for approval - never send, post,
> or write to an integration without explicit user confirmation.

## Purpose
Your morning digest: today's calendar, top open commitments due, anything that went cold, unread-but-important threads, and one 'highest-leverage thing to do today' pick based on active projects.

## Littlebird MCP calls used
- `get_calendar(today)`
- `search_context('due today OR deadline OR overdue', recent)`
- `act.gmail(search: unread important)`
- `search_chats('active project')  # to pick the leverage move`

## Trigger
Scheduled morning run.

## Routine cadence
Daily 6-7am, push + email.  _(Routines are created in the Littlebird Routines tab, not from chat - attach this schedule there.)_

## Process
1. **Gather** - run the MCP calls above to pull the relevant context window.
2. **Filter** - drop third-party private content per the guardrail below.
3. **Analyze** - your morning digest: today's calendar
4. **Draft** - produce the output; apply `mario-aldayuz-voice` where the output is written in the user's voice.
5. **Hand off** - present for approval; only then act through an integration.

## Output
One-screen brief: today's schedule, top 3 due commitments, cold threads, must-read messages, and THE one high-leverage task.

## Guardrail
Keep it personal to the user; don't expose others' private schedules pulled from shared calendars beyond event titles they can see.

## Related skills
`day-reconstructor`, `focus-forensics`, `learning-capturer`
```

### 15. `day-reconstructor`

```markdown
---
name: day-reconstructor
description: Turn a nocturnal dev session into a clean changelog. Rebuilds what you actually did across a session - repos touched, files edited, tools used, problems solved - into a dev log / changelog entry. (You've had me do this by hand for Simple Scheduler and Owl's Roost.)
version: 0.1.0
harness: claude-cowork
requires:
  - littlebird-mcp
---

# day-reconstructor

> **Critical Directive**
> You must read all files and context in this skill before acting. If your core
> knowledge is insufficient, search the connected Littlebird context, the web, and
> related skills before proceeding. Draft outputs for approval - never send, post,
> or write to an integration without explicit user confirmation.

## Purpose
Rebuilds what you actually did across a session - repos touched, files edited, tools used, problems solved - into a dev log / changelog entry. (You've had me do this by hand for Simple Scheduler and Owl's Roost.)

## Littlebird MCP calls used
- `search_context('<repo/project name> OR commit OR file edited OR error fixed', target_day)`
- `search_chats('<project>')  # decisions made in chat that day`

## Trigger
End-of-day, or on demand for a chosen day.

## Routine cadence
Daily end-of-day (e.g. 6am after a night session).  _(Routines are created in the Littlebird Routines tab, not from chat - attach this schedule there.)_

## Process
1. **Gather** - run the MCP calls above to pull the relevant context window.
2. **Filter** - drop third-party private content per the guardrail below.
3. **Analyze** - rebuilds what you actually did across a session - repos touched
4. **Draft** - produce the output; apply `mario-aldayuz-voice` where the output is written in the user's voice.
5. **Hand off** - present for approval; only then act through an integration.

## Output
Chronological dev log: what was worked on, files/repos touched, problems solved, and a ready-to-paste changelog block.

## Guardrail
Reconstruct only the user's own activity; do not attribute on-screen content authored by others to the user.

## Related skills
`daily-brief`, `focus-forensics`, `learning-capturer`
```

### 16. `focus-forensics`

```markdown
---
name: focus-forensics
description: See where your hours actually went. Analyzes capture history for where time actually went (deep work vs context-switching vs rabbit holes), flags your most fragmented hours, and delivers a weekly 'you lost ~X hours to Y' report with one behavioral nudge.
version: 0.1.0
harness: claude-cowork
requires:
  - littlebird-mcp
---

# focus-forensics

> **Critical Directive**
> You must read all files and context in this skill before acting. If your core
> knowledge is insufficient, search the connected Littlebird context, the web, and
> related skills before proceeding. Draft outputs for approval - never send, post,
> or write to an integration without explicit user confirmation.

## Purpose
Analyzes capture history for where time actually went (deep work vs context-switching vs rabbit holes), flags your most fragmented hours, and delivers a weekly 'you lost ~X hours to Y' report with one behavioral nudge.

## Littlebird MCP calls used
- `search_context('', last_7_days, data_source=summaries)  # activity summaries by hour`
- `get_calendar(last_7_days)  # meeting load vs maker time`

## Trigger
Scheduled weekly.

## Routine cadence
Weekly (Sunday or Monday).  _(Routines are created in the Littlebird Routines tab, not from chat - attach this schedule there.)_

## Process
1. **Gather** - run the MCP calls above to pull the relevant context window.
2. **Filter** - drop third-party private content per the guardrail below.
3. **Analyze** - analyzes capture history for where time actually went (deep work vs context-switching vs rabbit holes)
4. **Draft** - produce the output; apply `mario-aldayuz-voice` where the output is written in the user's voice.
5. **Hand off** - present for approval; only then act through an integration.

## Output
Time-allocation breakdown (deep work / meetings / switching / rabbit holes), most-fragmented windows, and one concrete nudge.

## Guardrail
This is a self-analysis tool for the user only; never turn it on anyone else's activity.

## Related skills
`daily-brief`, `day-reconstructor`, `learning-capturer`
```

### 17. `learning-capturer`

```markdown
---
name: learning-capturer
description: Stop re-debugging the same 3am wall. Watches for moments you solved something hard (an API error fixed, a Svelte gotcha, a Supabase quirk) and files them into a personal, searchable knowledge base of 'how I fixed this last time.'
version: 0.1.0
harness: claude-cowork
requires:
  - littlebird-mcp
---

# learning-capturer

> **Critical Directive**
> You must read all files and context in this skill before acting. If your core
> knowledge is insufficient, search the connected Littlebird context, the web, and
> related skills before proceeding. Draft outputs for approval - never send, post,
> or write to an integration without explicit user confirmation.

## Purpose
Watches for moments you solved something hard (an API error fixed, a Svelte gotcha, a Supabase quirk) and files them into a personal, searchable knowledge base of 'how I fixed this last time.'

## Littlebird MCP calls used
- `search_context('error OR fixed OR "turns out" OR workaround OR gotcha', last_7_days)`
- `search_chats('debug OR fix OR solution')`

## Trigger
Scheduled, or on demand after a hard session.

## Routine cadence
Weekly, appended to a running KB doc.  _(Routines are created in the Littlebird Routines tab, not from chat - attach this schedule there.)_

## Process
1. **Gather** - run the MCP calls above to pull the relevant context window.
2. **Filter** - drop third-party private content per the guardrail below.
3. **Analyze** - watches for moments you solved something hard (an api error fixed
4. **Draft** - produce the output; apply `mario-aldayuz-voice` where the output is written in the user's voice.
5. **Hand off** - present for approval; only then act through an integration.

## Output
New KB entries (problem | symptom | root cause | fix | tags), appended to your personal solutions library.

## Guardrail
Store only the user's own solutions; scrub any credentials, tokens, or client secrets seen on screen.

## Related skills
`daily-brief`, `day-reconstructor`, `focus-forensics`
```


---

## E. Knowledge & Writing

### 18. `knowledge-base-builder`

```markdown
---
name: knowledge-base-builder
description: Productize the OSPRY-docs process into one skill. The engine behind your docs suite: ingests a body of context (a project's chats, meetings, files) and generates structured, AI-ingestible markdown - PRDs, architecture notes, brand briefs - with your consistency rules baked in.
version: 0.1.0
harness: claude-cowork
requires:
  - littlebird-mcp
---

# knowledge-base-builder

> **Critical Directive**
> You must read all files and context in this skill before acting. If your core
> knowledge is insufficient, search the connected Littlebird context, the web, and
> related skills before proceeding. Draft outputs for approval - never send, post,
> or write to an integration without explicit user confirmation.

## Purpose
The engine behind your docs suite: ingests a body of context (a project's chats, meetings, files) and generates structured, AI-ingestible markdown - PRDs, architecture notes, brand briefs - with your consistency rules baked in.

## Littlebird MCP calls used
- `search_chats('<project name>')`
- `list_meetings + get_transcript  # project calls`
- `search_context('<project name>', all_time)  # on-screen artifacts`

## Trigger
On demand per project.

## Routine cadence
Optional: weekly refresh of a living KB.  _(Routines are created in the Littlebird Routines tab, not from chat - attach this schedule there.)_

## Process
1. **Gather** - run the MCP calls above to pull the relevant context window.
2. **Filter** - drop third-party private content per the guardrail below.
3. **Analyze** - the engine behind your docs suite: ingests a body of context (a project's chats
4. **Draft** - produce the output; apply `mario-aldayuz-voice` where the output is written in the user's voice.
5. **Hand off** - present for approval; only then act through an integration.

## Output
A structured markdown pack (PRD, architecture, brand brief, glossary) formatted for ingestion by other AIs, with a consistency-check pass.

## Guardrail
Flag any inconsistent equity/traction/financial figures rather than guessing; segregate sensitive info for secure ingestion.

## Related skills
`osint-investigator`, `brand-voice-guardian`, `research-synthesizer`
```

### 19. `osint-investigator`

```markdown
---
name: osint-investigator
description: An evidence-grade dossier - with hard ethics rails. Point it at a name; it fuses Littlebird's internal knowledge (every time that person crossed your screen, with timestamped receipts) with external web research into a dossier framed for legitimate due-diligence.
version: 0.1.0
harness: claude-cowork
requires:
  - littlebird-mcp
---

# osint-investigator

> **Critical Directive**
> You must read all files and context in this skill before acting. If your core
> knowledge is insufficient, search the connected Littlebird context, the web, and
> related skills before proceeding. Draft outputs for approval - never send, post,
> or write to an integration without explicit user confirmation.

## Purpose
Point it at a name; it fuses Littlebird's internal knowledge (every time that person crossed your screen, with timestamped receipts) with external web research into a dossier framed for legitimate due-diligence.

## Littlebird MCP calls used
- `search_context(person_name, all_time)  # internal receipts w/ timestamps`
- `web.search('<name> <known org/handle>')  # external, public only`
- `web.fetch(public_profile_url)`

## Trigger
On demand.

## Routine cadence
Not recommended as an unattended routine.  _(Routines are created in the Littlebird Routines tab, not from chat - attach this schedule there.)_

## Process
1. **Gather** - run the MCP calls above to pull the relevant context window.
2. **Filter** - drop third-party private content per the guardrail below.
3. **Analyze** - point it at a name; it fuses littlebird's internal knowledge (every time that person crossed your screen
4. **Draft** - produce the output; apply `mario-aldayuz-voice` where the output is written in the user's voice.
5. **Hand off** - present for approval; only then act through an integration.

## Output
Dossier with a provenance column on EVERY claim (source + date), a 'verified vs unverified' split, and explicit gaps.

## Guardrail
HARD RAILS: public/legitimately-accessible sources only; no doxxing; every claim carries provenance; verification standard stated; outputs for lawful due-diligence only. Refuse targets that look like harassment.

## Related skills
`knowledge-base-builder`, `brand-voice-guardian`, `research-synthesizer`
```

### 20. `brand-voice-guardian`

```markdown
---
name: brand-voice-guardian
description: A QA pass for everything that ships under your name. Runs any draft (yours or a teammate's) against your mario-aldayuz-voice skill and flags where it drifts off-tone, sounds AI-generated, or breaks your anti-detection rules, returning a marked-up corrected version.
version: 0.1.0
harness: claude-cowork
requires:
  - littlebird-mcp
  - mario-aldayuz-voice
---

# brand-voice-guardian

> **Critical Directive**
> You must read all files and context in this skill before acting. If your core
> knowledge is insufficient, search the connected Littlebird context, the web, and
> related skills before proceeding. Draft outputs for approval - never send, post,
> or write to an integration without explicit user confirmation.

## Purpose
Runs any draft (yours or a teammate's) against your mario-aldayuz-voice skill and flags where it drifts off-tone, sounds AI-generated, or breaks your anti-detection rules, returning a marked-up corrected version.

## Littlebird MCP calls used
- `voice.apply(mario-aldayuz-voice)  # reference profile`
- `search_context('<topic>')  # ground factual claims in your real context (optional)`

## Trigger
On demand per draft.

## Routine cadence
N/A (interactive).  _(Routines are created in the Littlebird Routines tab, not from chat - attach this schedule there.)_

## Process
1. **Gather** - run the MCP calls above to pull the relevant context window.
2. **Filter** - drop third-party private content per the guardrail below.
3. **Analyze** - runs any draft (yours or a teammate's) against your mario-aldayuz-voice skill and flags where it drifts off-tone
4. **Draft** - produce the output; apply `mario-aldayuz-voice` where the output is written in the user's voice.
5. **Hand off** - present for approval; only then act through an integration.

## Output
Marked-up draft: off-tone spans highlighted, AI-tells flagged, plus a clean rewritten version in your voice.

## Guardrail
Never inject facts the user hasn't stated; tone-correct only, don't fabricate substance.

## Related skills
`knowledge-base-builder`, `osint-investigator`, `research-synthesizer`
```

### 21. `research-synthesizer`

```markdown
---
name: research-synthesizer
description: Turn your ambient reading into a real asset. Give it a topic; it pulls what you've already read on screen about it, layers in fresh web research, and returns a synthesis that separates 'what you already knew' from 'what's new,' with sources.
version: 0.1.0
harness: claude-cowork
requires:
  - littlebird-mcp
---

# research-synthesizer

> **Critical Directive**
> You must read all files and context in this skill before acting. If your core
> knowledge is insufficient, search the connected Littlebird context, the web, and
> related skills before proceeding. Draft outputs for approval - never send, post,
> or write to an integration without explicit user confirmation.

## Purpose
Give it a topic; it pulls what you've already read on screen about it, layers in fresh web research, and returns a synthesis that separates 'what you already knew' from 'what's new,' with sources.

## Littlebird MCP calls used
- `search_context('<topic>', last_30_days)  # what you've read`
- `web.search('<topic> 2026')`
- `web.fetch(top_source_urls)`

## Trigger
On demand.

## Routine cadence
Optional: weekly on a standing research topic.  _(Routines are created in the Littlebird Routines tab, not from chat - attach this schedule there.)_

## Process
1. **Gather** - run the MCP calls above to pull the relevant context window.
2. **Filter** - drop third-party private content per the guardrail below.
3. **Analyze** - give it a topic; it pulls what you've already read on screen about it
4. **Draft** - produce the output; apply `mario-aldayuz-voice` where the output is written in the user's voice.
5. **Hand off** - present for approval; only then act through an integration.

## Output
Synthesis with two clear sections - 'Already in your context' and 'New since then' - every external claim linked to a source.

## Guardrail
Cite public sources; keep the user's private reading context internal to the summary, not re-published.

## Related skills
`knowledge-base-builder`, `osint-investigator`, `brand-voice-guardian`
```


---

## F. Meta & Automation

### 22. `routine-architect`

```markdown
---
name: routine-architect
description: The skill that tunes all your other routines. The meta-skill: audits your existing Littlebird routines (config + past reports), rewrites weak prompts, proposes new ones from your patterns, and lays out the 'Routines observe, Cowork acts' wiring.
version: 0.1.0
harness: claude-cowork
requires:
  - littlebird-mcp
---

# routine-architect

> **Critical Directive**
> You must read all files and context in this skill before acting. If your core
> knowledge is insufficient, search the connected Littlebird context, the web, and
> related skills before proceeding. Draft outputs for approval - never send, post,
> or write to an integration without explicit user confirmation.

## Purpose
The meta-skill: audits your existing Littlebird routines (config + past reports), rewrites weak prompts, proposes new ones from your patterns, and lays out the 'Routines observe, Cowork acts' wiring.

## Littlebird MCP calls used
- `list_routines()`
- `get_routine_reports(id)  # per routine, judge signal vs noise`
- `search_context('', last_14_days, data_source=summaries)  # spot automatable patterns`

## Trigger
On demand, or monthly.

## Routine cadence
Monthly review.  _(Routines are created in the Littlebird Routines tab, not from chat - attach this schedule there.)_

## Process
1. **Gather** - run the MCP calls above to pull the relevant context window.
2. **Filter** - drop third-party private content per the guardrail below.
3. **Analyze** - the meta-skill: audits your existing littlebird routines (config + past reports)
4. **Draft** - produce the output; apply `mario-aldayuz-voice` where the output is written in the user's voice.
5. **Hand off** - present for approval; only then act through an integration.

## Output
Per routine: keep/kill/rewrite verdict with an improved prompt; plus 2-3 proposed new routines with schedules. (User creates them in the Routines tab.)

## Guardrail
Read-only on routines via chat/MCP - it recommends; the user makes the actual edits in the Routines tab.

## Related skills
`skill-suggester`, `weekly-review`
```

### 23. `skill-suggester`

```markdown
---
name: skill-suggester
description: A self-expanding marketplace that spots its own next skill. Watches for repeated manual workflows in your capture history ('Mario has reconstructed a dev log by hand four times') and proactively proposes a new Cowork skill to automate it, pre-drafting the SKILL.md.
version: 0.1.0
harness: claude-cowork
requires:
  - littlebird-mcp
---

# skill-suggester

> **Critical Directive**
> You must read all files and context in this skill before acting. If your core
> knowledge is insufficient, search the connected Littlebird context, the web, and
> related skills before proceeding. Draft outputs for approval - never send, post,
> or write to an integration without explicit user confirmation.

## Purpose
Watches for repeated manual workflows in your capture history ('Mario has reconstructed a dev log by hand four times') and proactively proposes a new Cowork skill to automate it, pre-drafting the SKILL.md.

## Littlebird MCP calls used
- `search_context('', last_30_days, data_source=summaries)  # find repeated manual patterns`
- `search_chats('can you do this again OR same as last time')`

## Trigger
Scheduled, or on demand.

## Routine cadence
Monthly.  _(Routines are created in the Littlebird Routines tab, not from chat - attach this schedule there.)_

## Process
1. **Gather** - run the MCP calls above to pull the relevant context window.
2. **Filter** - drop third-party private content per the guardrail below.
3. **Analyze** - watches for repeated manual workflows in your capture history ('mario has reconstructed a dev log by hand four times') and proactively proposes a new cowork skill to automate it
4. **Draft** - produce the output; apply `mario-aldayuz-voice` where the output is written in the user's voice.
5. **Hand off** - present for approval; only then act through an integration.

## Output
Ranked list of automatable workflows with frequency counts, each with a pre-drafted stub SKILL.md ready to flesh out.

## Guardrail
Suggest only; never auto-install. Keep patterns anonymized where they involve third parties.

## Related skills
`routine-architect`, `weekly-review`
```

### 24. `weekly-review`

```markdown
---
name: weekly-review
description: One honest scorecard for the week. The capstone digest: pulls the week's meetings, commitments closed vs dropped, leads captured, money leaks found, and content shipped into one scorecard with next week's top three.
version: 0.1.0
harness: claude-cowork
requires:
  - littlebird-mcp
---

# weekly-review

> **Critical Directive**
> You must read all files and context in this skill before acting. If your core
> knowledge is insufficient, search the connected Littlebird context, the web, and
> related skills before proceeding. Draft outputs for approval - never send, post,
> or write to an integration without explicit user confirmation.

## Purpose
The capstone digest: pulls the week's meetings, commitments closed vs dropped, leads captured, money leaks found, and content shipped into one scorecard with next week's top three.

## Littlebird MCP calls used
- `list_meetings(last_7_days)`
- `search_context('commitment OR promised OR shipped OR launched', last_7_days)`
- `get_calendar(last_7_days) + get_calendar(next_7_days)`
- `get_routine_reports(id)  # roll up other skills' weekly outputs`

## Trigger
Scheduled weekly.

## Routine cadence
Sunday evening, push + email.  _(Routines are created in the Littlebird Routines tab, not from chat - attach this schedule there.)_

## Process
1. **Gather** - run the MCP calls above to pull the relevant context window.
2. **Filter** - drop third-party private content per the guardrail below.
3. **Analyze** - the capstone digest: pulls the week's meetings
4. **Draft** - produce the output; apply `mario-aldayuz-voice` where the output is written in the user's voice.
5. **Hand off** - present for approval; only then act through an integration.

## Output
Scorecard: meetings held, commitments closed vs dropped, leads captured, leaks found, content shipped - and next week's top 3 priorities.

## Guardrail
Reflect only the user's own week; keep any third-party specifics that surfaced during the week out of the shared summary.

## Related skills
`routine-architect`, `skill-suggester`
```
