# Attendee resolution

Turning the email addresses on a calendar invite into people the internal record knows.
Getting this wrong is worse than leaving it blank, because a brief that confidently
attributes another person's history to the wrong attendee will be believed and acted on.

## What the invite gives you

A calendar entry from `LB_INTERNAL_LIST_MEETINGS` carries attendee emails and sometimes
display names [littlebird-mcp-reference.md]. It does not carry roles,
companies, or any link to the internal record. Every one of those is derived.

Extract for each attendee, before searching:

| Token | Where from | Reliability |
|---|---|---|
| Email local part | Left of the at sign | Weak identity signal, useful as a search string |
| Email domain | Right of the at sign | Strong company signal for a corporate domain, useless for gmail, outlook, icloud and similar |
| Display name | Invite, when present | Best available identity key |
| The user's own address | Match against the account owner and exclude | Required, or the user gets briefed on themselves |

## The resolution ladder

Work top down. Stop at the first rung that produces a confident match. Record which rung
produced the match, because it becomes the confidence rating.

### Rung 1: display name against meeting history

```
LB_INTERNAL_SEARCH_MEETINGS
  query:      "<display name>"
  start_date: <today minus 365 days>
  end_date:   <today>
  limit:      10
```

Then confirm any promising hit with `LB_INTERNAL_GET_MEETING`, which returns the linked
calendar event and its attendees [littlebird-mcp-reference.md]. A match is
confirmed only when the attendee EMAIL on that past meeting equals the email on the
upcoming invite.

Do not use the `attendees` filter to prove attendance. It is an OR filter and it is best
effort over top candidates only [littlebird-mcp-reference.md].

### Rung 2: email address against the ambient record

```
search_user_context
  search_queries:          ["<full email address>", "<display name>", "<display name> <company guess from domain>"]
  search_queries_messages: ["<display name>", "<email local part>"]
  standalone_query:        "Who is <display name>, what do they do, and what has the user discussed with them"
  date_range:              {"start": "<today minus 365 days>", "end": "now"}
```

Prefer several narrow parallel queries over one broad one, both for relevance and to
avoid the oversized-result file dump [littlebird-mcp-reference.md]. Read the
relevance scores. A single item scored 3 is a maybe and does not by itself establish
identity [littlebird-mcp-reference.md].

### Rung 3: domain against the record

```
search_user_context
  search_queries:   ["<domain without the tld>", "<domain without the tld> company"]
  standalone_query: "What does the user know about the company at <domain>"
  date_range:       {"start": "<today minus 365 days>", "end": "now"}
```

This resolves the COMPANY, not the person. A domain hit tells you the user has history
with the organization. It does not tell you they have history with this individual. Say
which one you found.

### Rung 4: external

Only for people the internal record does not know, and only after listing available web
tools rather than assuming a specific one. See the external research section of SKILL.md.

## Confidence, by rung

| Rung that matched | Rating | What the brief may say |
|---|---|---|
| Rung 1 with email confirmed via `GET_MEETING` | **High** | Name the person, their prior meetings, and quote from them |
| Rung 1 by display name with no email confirmation | **Medium** | Name the person, flag the match as unconfirmed, do not quote them by name |
| Rung 2, multiple independent items agreeing | **High** | As above |
| Rung 2, single item scored 3 or 4 | **Low** | State the possible identity as a possibility, nothing more |
| Rung 3 only | **Company known, person unknown** | Brief the company, say the individual is new to the record |
| Nothing | **Unknown** | Say so. This is a valid outcome. |

Ratings follow the house scale in `evidence-standards.md`. A Low rated
identity never drives an irreversible action and never gets encoded as a durable fact
about a person.

## Ambiguity: flag, never guess

Flag rather than resolve when any of these hold:

- Two or more people in the record share the display name and neither email matches.
- The display name matches but the email domain is different from every past record for
  that name. A person changing jobs and an entirely different person look identical here.
- The invite carries only an email with a generic local part such as `team@`, `info@`,
  `hello@`, or a conferencing room address.
- The email is a personal provider address and the display name is common.
- The record hit came from screen OCR of a UI that collapses lists
  [evidence-standards.md].

The flag format in a brief:

```
**Ambiguous:** `sam.torres@vertexlab.com`. The record has a Sam Torres at Bellweather
(3 meetings, most recent 2026-04-22) and no record at vertexlab.com. Same person after
a job change, or a different Sam. Not resolved. History below is NOT attributed to this
attendee.
```

Then leave that attendee's history section empty. Do not attach the Bellweather history
to the Vertexlab address on a guess. If the ambiguity is material to the call, the skill
asks the user with `AskUserQuestion` before encoding it
[evidence-standards.md].

## Large rosters

Above roughly seven attendees, do not resolve everyone. Seven is the threshold because
decision effectiveness declines with each attendee past it, so a per-person dossier is
aimed at the wrong job [research/distilled-call-preparation.md section 6]. Resolve in
this order and stop when the brief is full:

1. The organizer.
2. Anyone the user has prior meeting history with.
3. Anyone whose domain is a company the user has active history with.
4. Everyone else goes into an appendix roster as a plain name and domain list, unresolved,
   labelled unresolved.

Report the counts explicitly: resolved, unresolved, total. A partial roster presented as
complete is the fastest way to lose the user's trust
[evidence-standards.md].

## The attribution guardrail applies here

What the record captured is what the user was VIEWING, not necessarily what they wrote
[evidence-standards.md]. When building a person's profile:

- A message tagged as from the user is the user's. Everything else in a thread is not
  [evidence-standards.md].
- A raw transcript chunk tagged `[Others]` proves someone said it, not who
  [littlebird-mcp-reference.md]. Take speaker attribution from a meeting
  summary's Action Items and Decisions blocks, which carry owner tags
  [littlebird-mcp-reference.md].
- A LinkedIn profile that appeared on the user's screen is evidence the user looked at
  it. It is not evidence of a relationship.

## What never goes in an attendee profile

Health, financial detail, legal history, family circumstances, protected characteristics,
and precise home location stay out even when the capture contains them
[evidence-standards.md]. A pre-call brief is purpose bound: assemble what the
call needs, not everything findable.
