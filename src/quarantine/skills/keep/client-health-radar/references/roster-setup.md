# Roster setup

The client roster is a setup step, not an inference. Guessing it from capture produces a mess:
a prospect who never signed looks like a client, a subcontractor looks like a client, the same
client appears three times under a company name, a contact name and a project codename, and the
one client who only ever appears as a domain in a dashboard screenshot does not appear at all.

Do this once. Store it. Subsequent runs read the stored roster and skip straight to the offer to
amend it.

## Where the roster lives

```
client-roster.md
```

in the working directory, or in the directory the user names when they first run the skill.
Tell the user the path in plain words the first time it is written, and name the path again at
the top of every report so it is always obvious where to go to fix a wrong entry.

If a `client-roster.md` already exists in the working directory, read it first and do not run
setup. Instead state how many clients are on file, when it was last updated, and offer three
options with `AskUserQuestion`: run with this roster, add or edit a client, or rebuild from
scratch.

## Why the roster is confirmed rather than inferred

Two independent reasons from the archive.

The health-score literature's sharpest finding is that when the relationship owner's own read
carries weight, "retention rates tend to decline" and "churn rates tend to increase", because
owners want to believe a risky account stabilized after one good interaction
(`references/research/distilled-client-health.md`, section 3). The roster is the one place where
the user's input is unambiguously better than the skill's, because the user knows who is paying
them and the capture does not. Take the user's input where it is authoritative. Argue with them
everywhere else.

And Littlebird's own capture is lossy in exactly the way that breaks roster inference. Screen
OCR captures what was on screen, not what the user wrote, and app UIs collapse lists into "and 4
others" (`references/littlebird-mcp-reference.md`). A roster built from that is partial by
construction, and presenting a partial roster as complete is the fastest way to lose the user's
trust (`references/evidence-standards.md`, rule 5).

## The setup conversation

Use `AskUserQuestion`. Keep it short. Do not interrogate.

### Step 1. Get the names

Ask the user to list their current clients. Say plainly that the skill will not guess, and that
anyone not on the list will not be reported on.

Before asking, run one cheap orienting sweep so the question can be pre-populated rather than
blank. This is a suggestion pass, not an inference pass:

```
LB_INTERNAL_LIST_MEETINGS
  start_date: 180 days ago
  end_date:   today
  limit:      100
```

Extract recurring meeting titles and frequently recurring attendee domains. Present them as
candidates the user confirms, rejects or renames. Label them explicitly as candidates from
calendar titles, never as a detected roster. Say how many meetings the list was drawn from and
over what window.

### Step 2. Get the aliases, which is the part that actually matters

For each confirmed client, ask for every string that client shows up as. Ask for all five kinds
by name, because users forget the last two:

| Alias kind | Example of what to ask for |
|---|---|
| Legal or trading name | The name on the invoice |
| Short name or how they say it out loud | What it is called in a meeting |
| Contact names | Every individual the user deals with, first and last |
| Email domain | The domain their people send from |
| Project or engagement codename | The internal name for the work, if any |
| Dashboard or tool identity | The account name, workspace name or property name that appears in a screenshot of an analytics tool, ad platform, project tracker or billing system |

That last row is the one that earns its keep. Screen capture is where dashboards, invoices and
billing notices live (`references/littlebird-mcp-reference.md`), and a client whose dashboard
says something different from their company name is invisible to a search built on the company
name alone.

### Step 3. Get the commercial frame, briefly

Three questions per client, all optional, each with a "skip" option:

1. Engagement type: retainer, project, hourly, or mixed.
2. Renewal, contract end or next commercial checkpoint date, if there is one.
3. The user's effective rate, used only to put a number on accumulated out-of-scope work. If
   they decline, out-of-scope work is reported in hours and in count of asks with no currency
   figure. See `references/scope-creep-detection.md`.

Do not ask for contract value. The skill does not need it and it makes the setup feel like a CRM
import.

### Step 4. Confirm before writing

Anything durable about a person or a company gets confirmed before it is written down
(`references/evidence-standards.md`, rule 6). Show the assembled roster back and get an explicit
yes before the file is created.

## Roster file format

One block per client. Keep it plain so a user can hand-edit it.

```
## Acme Industrial
- aliases: Acme, Acme Industrial Ltd, ACME-IND
- contacts: Dana Reyes, Marcus Oyelaran, Priya Shah
- domain: acme-ind.com
- project codename: Northstar
- dashboard identity: acme-ind.com (GA4 property), Acme Industrial (ad account)
- engagement: retainer
- next commercial checkpoint: 2026-11-01
- rate: 165/hr
- added: 2026-08-17
- last confirmed: 2026-08-17
- status: active
```

Notes on the fields:

- `status` is `active`, `paused`, `ended` or `prospect`. Only `active` and `paused` clients
  appear in the ranked risk list. `ended` clients stay in the file so their history is not
  re-detected as a new client on a later run. `prospect` entries are excluded from health
  reporting entirely.
- `last confirmed` drives the staleness prompt. See below.
- Missing fields are left out rather than filled with a guess. An absent domain is a real gap
  and it degrades retrieval for that client, so name it in the coverage section of the report.

## Roster maintenance

**Staleness.** If `last confirmed` on any client is more than 90 days old, open the run by
asking whether the roster is still current, listing the clients and their statuses. One question,
four options: still current, add a client, change a status, full review.

**Suggested additions.** During a run the retrieval will surface counterparties who look like
clients and are not on the roster. Do not add them. Do not report on them. Collect them into a
single line at the end of the report under a heading called Possible unlisted clients, each with
one receipt showing why it surfaced, and offer to add them via `AskUserQuestion`. This keeps the
inference visible and reversible, and it respects the rule that a durable fact about a company
gets confirmed before it is encoded (`references/evidence-standards.md`, rule 6).

**Alias gaps discovered mid-run.** If a search for a client returns items where the client is
obviously present under a string that is not in their alias list, propose the new alias at the
end of the run with the receipt that revealed it. Do not silently widen the alias set and do not
retroactively rerun with it in the same pass, because that makes the run's coverage
unreproducible.

**Third parties.** Other people appear inside a client's meetings and threads: their vendors,
their agency-of-record, their auditors. They are incidental
(`references/evidence-standards.md`, rule 10). Include them only where they are material to that
client's health, which in practice means only when they are the subject of a signal, such as a
competitor being compared to, or a new stakeholder appearing in the room.

## What the roster does for retrieval

Every alias becomes a query term. The alias list is what turns one vague search into the narrow
parallel queries the MCP actually rewards (`references/littlebird-mcp-reference.md`). The
contacts list is what feeds `attendees` on `LB_INTERNAL_SEARCH_MEETINGS`, with the standing
caveat that `attendees` is an OR filter and best-effort, so it can never be used alone to prove
someone attended (`references/littlebird-mcp-reference.md`). Confirm attendance with
`LB_INTERNAL_GET_MEETING`, which returns the linked calendar event.

The retrieval procedure per client is in `references/signal-extraction.md`.
