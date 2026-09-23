# Littlebird MCP reference

Verified against the live Littlebird MCP server on 2026-08-17 by running every tool
against a real Pro account. Tool names, parameter names, and return shapes below are
observed, not assumed. Do not author a Littlebird skill from memory of this file being
"roughly right": if a behavior matters, re-verify it at runtime.

Endpoint: `https://mcp.littlebird.ai/mcp` (OAuth2).
Docs: https://support.littlebird.ai/docs/mcp/
Plan gate: Power and Pro users only.

## Tool inventory (11 tools)

### `search_user_context` (the ambient recall workhorse)

Hybrid semantic plus keyword search over everything Littlebird captured from the user's
screen and messages.

Parameters:

| Param | Type | Notes |
|---|---|---|
| `search_queries` | string[] | Semantic queries over screen snapshots and general records. At least one is REQUIRED. Up to 7. |
| `search_queries_messages` | string[] | Semantic queries scoped to message threads. Up to 7. |
| `standalone_query` | string | Free-form statement of what context should answer the request. Use alongside the query arrays. |
| `date_range` | object | `{"start": "YYYY-MM-DD", "end": "YYYY-MM-DD"}` or with `HH:MM:SS`. Start inclusive. `"now"` is valid for `end`. |
| `filters` | object | `{"app": "chrome", "data_source": "inputs\|snapshots\|messages\|summaries", "list_meetings_only": bool}` |

Return shape, in order:

1. A **table of contents**: one line per retrieved item as
   `#<n> | <anchor> | ~<chars> | score <0-5> | <description>`. The anchor is a
   human-readable label, usually `[<time> | <app>]` or `chats/<id>`. Scores are guesses
   from a small digest model. Items scoring below 3 are omitted entirely.
2. Sections grouped by source: `### Screen snapshots (N)`,
   `### Messages (conversation chunks) (N indexed of M)`, `### Activity summaries (N)`.
3. The items themselves, each wrapped in `<#n>...</#n>` tags.

Screen snapshot items are prefixed `[Time collected | App]`. Message items are prefixed
`[Time collected || app || thread name]` and carry per-message send timestamps that are
DIFFERENT from the collection time. Never conflate the two.

**Oversized results.** A broad query can return 70,000+ characters, which exceeds the
tool result limit. When that happens the content is written to a file and you get a path
instead. Read it in chunks or parse it with a script. Design queries to avoid this:
prefer several narrow parallel queries over one broad one.

### Meeting tools

| Tool | Key params | Returns |
|---|---|---|
| `LB_INTERNAL_LIST_MEETINGS` | `start_date`, `end_date`, `limit`, `name` | Reverse-chronological list of BOTH recorded meetings and unrecorded calendar events. Only recorded ones carry an id. A future `end_date` returns upcoming calendar events. `name` matches by title, which is the correct tool for recurring meetings and their prior instances. |
| `LB_INTERNAL_SEARCH_MEETINGS` | `query` (required), `attendees`, `start_date`, `end_date`, `limit` | Hybrid search over transcripts and summaries BY TOPIC. Returns summaries plus the most relevant transcript chunks. Ordered by relevance, not date. |
| `LB_INTERNAL_GET_MEETING` | `meeting_id` | Name, TLDR, full structured summary, plus the linked calendar event with its attendees. Does NOT return the transcript. |
| `LB_INTERNAL_GET_MEETING_TRANSCRIPT` | `meeting_id` | Verbatim transcript. Can be very long. |

**`attendees` is an OR filter, not an AND filter.** A meeting matches if it involved at
least one listed person. It is also best-effort over the top candidates only, so a
matching meeting outside that pool can be missed. If the expected meeting does not
appear, broaden or reword `query` rather than trusting the attendee filter.

**Upcoming events are never recorded.** They appear in `LIST_MEETINGS` as bare calendar
entries with no id, no summary, and no transcript, and they are not searchable.

### What a meeting summary already contains

This is the single most underused asset in the whole MCP surface. `GET_MEETING` returns
a structured summary that already includes, verbatim section headings observed in
production:

- `## Executive Summary`
- `## For You` (what the user specifically is expected to do)
- `## Topics Discussed`
- `## Decisions` (each tagged with who decided)
- `## Action Items` (checkbox list, each tagged with an owner or `Unassigned`, each
  ending `(source: transcript)`)
- `## Risks / Open Questions`

Build on this structure rather than re-deriving it from raw transcript. It is cheaper,
more reliable, and already carries owner attribution.

### Routine tools

| Tool | Key params | Notes |
|---|---|---|
| `LB_INTERNAL_LIST_ROUTINES` | `limit` | Title, schedule, report count, latest report date, paused state, id. |
| `LB_INTERNAL_GET_ROUTINE_CONFIG` | `routine_id` | Full prompt text, schedule, paused state, auto-pause setting, push and email notification flags, agent mode, created date. |
| `LB_INTERNAL_GET_ROUTINE_REPORTS` | `routine_id`, `limit` (default 5, max 25) | Past reports, most recent first, each with date, title, and full text. |
| `LB_INTERNAL_CREATE_ROUTINE` | `title`, `prompt`, `schedule`, `notifications_enabled`, `email_notifications_enabled` | Creating immediately generates a first report, then runs on schedule. Plan-based limit on routine count. |
| `LB_INTERNAL_UPDATE_ROUTINE` | `routine_id` plus only the fields to change | `prompt` REPLACES the whole prompt. `schedule` REPLACES the whole schedule. Always `GET_ROUTINE_CONFIG` first. |

`schedule` shape: `{"frequency": "daily"|"weekly"|"monthly", "time": "HH:MM",
"week_days": ["MO",...] (weekly only), "month_day": 1-28 (monthly only)}`. Times are in
the user's local timezone.

**CREATE_ROUTINE and UPDATE_ROUTINE are NOT available from inside a running routine.**
A routine cannot spawn or rewrite routines. Only an interactive session can.

### `LB_INTERNAL_GET_SUBSCRIPTION_STATUS`

No params. Returns provider, plan, renewal date, active state, team info. Use it when a
skill needs to check whether the user can create more routines, or to explain a
capability gate.

## Retrieval patterns that actually work

1. **Parallel narrow beats one broad.** Five specific queries return better-scored, more
   diverse items than one vague query, and avoid the oversized-result file dump.
2. **Window by date, always.** An unbounded search dilutes relevance. Sweep month by
   month when building anything comprehensive.
3. **Use `filters.data_source` deliberately.** `snapshots` for what was on screen,
   `messages` for threads, `summaries` for the daily activity digests Littlebird writes
   itself. The summaries source is the cheapest way to get a compressed view of a day.
4. **Use `filters.app` to prove absence.** Asking "did this app appear on screen in the
   last 90 days" is a legitimate, answerable question, and a negative answer is a real
   finding. This is how usage and zombie-subscription detection works.
5. **Read the relevance scores.** Anything scored 3 is a maybe. Do not build a claim on
   a single 3-scored item without corroboration.
6. **A meeting lookup by NAME uses `LIST_MEETINGS` with `name`. A meeting lookup by
   TOPIC uses `SEARCH_MEETINGS` with `query`.** Using the wrong one is the most common
   retrieval mistake against this server.

## Known limitations to design around

| Limitation | Consequence for skill design |
|---|---|
| Raw transcript chunks are weakly diarized, frequently tagged `[Others]` rather than by name | Take attribution from the summary's Action Items and Decisions blocks. Quote raw transcript for WORDING only, never to prove who said it. |
| Screen OCR captures what the user was VIEWING, not what they WROTE | Anything attributed to the user needs independent confirmation. This is the repo's attribution guardrail and it applies to every skill, not just the voice ones. |
| Social and app UIs collapse lists ("and 4 others", "12 people reacted") | Any roster built from notification OCR is partial by construction. Report the named set AND the size of the unnamed gap. Never present a partial roster as complete. |
| OCR of dense UI produces fragments, duplicate lines, and interleaved chrome | Deduplicate before counting anything. Treat repeated identical lines as one observation. |
| Retrieval can return nothing | A failed or empty retrieval ends the run. Say so. Never fabricate to fill a gap. |
| `attendees` filter is OR and best-effort | Never use it alone to prove someone attended. Confirm with `GET_MEETING`. |
| Results are relevance-ordered, not chronological | Sort by timestamp yourself before presenting any timeline. |

## The Routines-observe, Cowork-acts pattern

Routines are cheap, always-on, unattended observers that produce a report and a
notification. Cowork sessions are the hands: interactive, tool-rich, able to write
files, send email, and call other MCP servers.

The pattern: a routine watches for a condition and writes a report naming the condition
and the Cowork skill that resolves it. The user opens Cowork, the skill reads the
routine's own past reports via `GET_ROUTINE_REPORTS`, and does the work. Two design
rules follow from this:

- **Do not ask a routine to do work it cannot finish unattended in one pass.** No
  approvals, no multi-hour research, no file deliverables.
- **Give every routine memory.** A routine prompt that does not instruct the model to
  read its own previous reports will repeat itself indefinitely. Observed in production:
  a well-written daily routine flagged the identical number-one item four days running
  with no change in approach, because nothing told it to escalate.

## Verified capability receipts

These are real observations from the live account, useful as proof that a capability
exists before you design around it.

- **Cross-app person reconstruction:** a single name query returned 71,000 characters
  spanning a Facebook profile page with outbound social links, eleven Messenger
  snapshots across two months, Zoom workflow logs naming the person's contact record, a
  Gmail calendar invitation, and four activity summaries including a transcript of the
  person introducing themselves and their company.
- **Step-level app UI capture:** a Zoom screen share was captured down to individual
  workflow builder steps, including trigger names, a custom code action, a GPT note
  step, and a LinkedIn update action.
- **Financial and vendor signal:** billing notices, failed charge alerts, balance
  warnings, card status, and named vendor amounts all appear in ordinary capture without
  any finance integration.
- **Social engagement signal:** Facebook notification stacks with named commenters and
  reactors, Messenger thread lists with per-thread previews, and friend-request activity
  all appear in ordinary browser capture.

## Sources

- Live Littlebird MCP server, all 11 tools invoked against a Pro account, 2026-08-17.
- Littlebird MCP documentation, https://support.littlebird.ai/docs/mcp/, fetched
  2026-08-17.
- Littlebird product site, https://littlebird.ai/, fetched 2026-08-17.
