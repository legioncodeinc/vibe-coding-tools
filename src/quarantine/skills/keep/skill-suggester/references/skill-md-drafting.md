# Drafting a valid SKILL.md

This guide is self-contained on purpose. The authoring contract's hard rules are embedded
below rather than referenced, so a draft can be produced correctly without going to find the
contract. Where the contract is available, it still wins. Where it is not, this is enough.

**An invalid draft is worse than no draft.** A user who is handed a SKILL.md that fails on
upload learns that the suggester produces things that look right and are not, and that is a
harder problem than an empty report. Run section 8's checklist against every draft before it
is shown to anyone.

---

## 1. What a draft is and is not

A draft from this skill is a **valid skeleton with a named research obligation**. It is not a
shippable skill, and saying so is part of the deliverable.

The reason is structural. The marketplace contract requires a domain research archive: at
least five sources fetched into `references/research/raw/`, one file per source with a title,
URL, fetch date and source type, and a cited distillation written from a fresh read of them.
A drafting pass inside a session that is analyzing capture cannot produce that archive, and
must not fabricate it. Every draft therefore ships with a stage 2 research task written into
it, naming the specific domain to sweep.

Never write domain claims into a draft from training data. If it is not in an archive, it is
not a fact yet. A draft that carries confident unresearched claims is the exact artifact this
marketplace exists to not produce.

---

## 2. Frontmatter: the hard rules

### 2.1 The spec six, nothing else

Only these six keys are legal: `name`, `description`, `license`, `compatibility`, `metadata`,
`allowed-tools`. Any other key hard-fails the claude.ai upload path, which is the Cowork
path.

No `version:` at the top level. No `author:` at the top level. No `triggers:`. Those go
inside `metadata`.

### 2.2 No angle brackets anywhere in frontmatter

No less-than character, no greater-than character, anywhere in the frontmatter block. This is
a hard Cowork security restriction, not a style preference.

Three specific traps:

1. **Version comparisons.** Write "2.1 or newer". Never the greater-than-or-equal form.
2. **The YAML folded-scalar marker.** That marker is itself a literal greater-than character,
   so it is banned. Use a quoted scalar for any long description instead.
3. **Placeholders.** Do not leave angle-bracket placeholders anywhere in the frontmatter of a
   generated draft. Fill every one before the draft is written.

Multiple independent authors have hit this same trap, so treat it as the single most likely
frontmatter defect and check it explicitly.

### 2.3 name

- Kebab-case.
- Cannot contain "claude" or "anthropic".
- **Must match the containing folder name exactly.** Cursor breaks silently otherwise, which
  means nobody finds out until the skill quietly does not exist.

### 2.4 description

States both what the skill does and when to trigger it, with trigger phrases front-loaded.

Codex and Cursor judge relevance from this text alone, and Codex truncates descriptions under
a context budget. Official Cowork guidance caps the description at 200 characters; a
community source says 1,024, and the sources conflict. The existing skills in this repo run
longer than 200 and ship fine, so match house style on length, but **front-load the trigger
words inside the first 200 characters** so a truncating harness still gets the part that
matters.

The trigger words for a drafted skill come from the capture. That is the whole advantage of
drafting from observed work: signature 2 in `references/pattern-signatures.md` returns the
user's own phrasing for the task. Use their words, not a tidied version of them.

### 2.5 The template

```yaml
---
name: {skill-name-in-kebab-case}
description: "{The user's own trigger phrases, comma separated, first. Then what it does in
  one or two sentences. Then one sentence on what it is NOT for.}"
license: SEE LICENSE IN LICENSE.md
compatibility: Claude Cowork, Claude Code 2.1 or newer, Cursor 2.4 or newer, Codex
metadata:
  version: "1.0.0"
  author: "Mario Aldayuz / Littlebird"
  requires: "Littlebird MCP (Power or Pro plan)"
---
```

Replace every brace placeholder. A draft shipped with placeholders in it is an invalid draft.

---

## 3. Body rules

- **No em dashes and no en dashes anywhere in authored prose.** Ordinary punctuation, or a
  spaced hyphen for an aside. Verbatim quoted source material is exempt, and even there,
  prefer a quote without one.
- Do not use "delve", "seamless", "leverage" as a verb, "robust", "in today's fast-paced", or
  a tidy summary conclusion nobody asked for.
- Write imperatively in procedures. "Read X", "Run Y", "Confirm Z". Not "you might want to".
- **Relative reference paths must resolve.** A path of the form `references/` plus the guide
  filename, resolved from SKILL.md. Never an absolute path, and never a path to a file the
  draft did not create.
- **Never use backtick-bang dynamic command injection.** Cowork replaces those lines with a
  dead placeholder. Instruct the model to run the command through its own tools instead.
- **Do not use `${CLAUDE_PLUGIN_ROOT}`, `$ARGUMENTS`, or any other Claude Code string
  substitution.** Those resolve nowhere else.

---

## 4. Required content, six items

Every skill in this marketplace contains all six. A draft missing any of them is incomplete
and says which one it is missing.

1. **A capability gate.** State up front that the skill needs the Littlebird MCP on a Power
   or Pro plan. Instruct the model to LIST the tools actually available in the session and use
   the real names it finds, rather than assuming. If the MCP is not connected, stop.
2. **A retrieval brief.** The specific queries, date windows and filters. Name the actual
   queries. "Search for relevant context" is not a retrieval brief and produces a vague skill.
3. **The evidence standards.** Reference `references/evidence-standards.md` and apply the
   receipt format, the observed / inferred / external / unknown split, and the confirmation
   gates.
4. **An empty-retrieval branch.** What the skill does when it finds nothing: report the gap
   and stop. Never fabricate.
5. **A named output artifact.** Exactly what file or report ships, and where it goes.
   "Produces a report" is not a spec. Give the filename pattern and the section list.
6. **A routine wiring section** where the skill has a recurring mode: the exact routine prompt
   text, the schedule, and how the routine hands off to the Cowork side. Where the skill has
   no recurring mode, say so explicitly and say why, rather than omitting the section.

---

## 5. The house section shape

Use these headings, in this order.

```
# {skill-name}

{One or two paragraphs on what it does and the sharpest thing it delivers.}

**Mode: {on-demand | routine plus Cowork}.**

## Purpose
## Littlebird MCP calls used
## Trigger
## Routine cadence
## Process
## Output
## Guardrail
## Related skills
## Ship Gate
```

Plus, from the required-content list, sections for the capability gate, the retrieval brief,
the evidence standards and the empty-retrieval branch. Those can live inside Process and
Output or stand alone, and the existing marketplace skills stand them alone.

### 5.1 Ship Gate

The section exists and contains exactly this, with no Ship Gate block:

```
## Ship Gate

Ship Gate removed, research-only skill, produces no committable code.
```

### 5.2 Guardrail

Name the risk **this** skill carries. Not a generic caution. If the guardrail section would
read the same for any skill in the marketplace, it is not finished.

### 5.3 Related skills

Name the neighbours and say what separates them. This is where a future dedupe pass will look,
so a draft that names its neighbours honestly is a draft that will not get proposed again as a
duplicate.

---

## 6. Real MCP tool names

The roadmap's call legend is conceptual and its names are not real. Never write
`search_context`, `search_chats`, `get_calendar`, `get_transcript`, `list_routines`,
`voice.apply`, `act.gmail`, `act.ghl` or `act.paypal` into a draft as if they were tools.

The real Littlebird tool surface, eleven tools:

| Tool | What it does |
|---|---|
| `search_user_context` | Hybrid semantic and keyword search over screen capture and messages |
| `LB_INTERNAL_LIST_MEETINGS` | Meetings and calendar events by date range or by `name`. A future `end_date` returns upcoming events |
| `LB_INTERNAL_SEARCH_MEETINGS` | Hybrid search over transcripts and summaries by topic |
| `LB_INTERNAL_GET_MEETING` | Structured summary for one meeting. Not the transcript |
| `LB_INTERNAL_GET_MEETING_TRANSCRIPT` | Verbatim transcript. Can be very long |
| `LB_INTERNAL_LIST_ROUTINES` | Routine inventory with ids, schedules, report counts |
| `LB_INTERNAL_GET_ROUTINE_CONFIG` | Full prompt text and settings for one routine |
| `LB_INTERNAL_GET_ROUTINE_REPORTS` | Past reports, most recent first, limit default 5, max 25 |
| `LB_INTERNAL_CREATE_ROUTINE` | Create a routine. Not available from inside a running routine |
| `LB_INTERNAL_UPDATE_ROUTINE` | Update a routine. Replaces the whole prompt and the whole schedule |
| `LB_INTERNAL_GET_SUBSCRIPTION_STATUS` | Plan, renewal, active state |

Three corrections a draft must reflect:

1. **Routines CAN be created from a chat session.** `CREATE_ROUTINE` and `UPDATE_ROUTINE`
   work interactively and are blocked only from inside a running routine. So a drafted skill
   with a recurring mode offers to create its own routine, shows the exact prompt text and
   schedule, gets approval, then calls CREATE. It does not tell the user to go set it up by
   hand.
2. **There is no Littlebird tool that searches past Littlebird chat conversations.** A drafted
   skill that wants that uses `search_user_context` and says so.
3. **Actions through other products are separate connectors.** Gmail, GoHighLevel, PayPal,
   Stripe and the rest are their own MCP servers that may or may not be connected. A drafted
   skill that wants to act through one instructs the model to list its available tools first,
   degrades gracefully when the connector is absent by producing an import-ready file or a
   copy-paste block, and never assumes a connector exists.

---

## 7. The draft-never-send law

Every skill in this marketplace drafts and holds. Nothing is sent, posted, published or
written into a third-party system without the user approving the actual final text or payload
through `AskUserQuestion`. State this in the drafted skill's body.

It applies even when a connector is available and even when the user approved the plan,
because approving a plan is not approving the words.

If the drafted skill produces text written **as the user**: instruct it to check whether a
personal voice skill is installed in the session, use it if present, and if absent say so
plainly and point at this marketplace's voice creator skills rather than imitating a voice
from nothing. Never invent a voice profile.

---

## 8. Validate the draft before you show it

Run all eight. Report the result of each alongside the draft. Do not report a check as passed
without running it.

| # | Check | How |
|---|---|---|
| 1 | Frontmatter parses as valid YAML and contains only the six spec keys | Read it key by key |
| 2 | No angle brackets anywhere in frontmatter | Character search for both characters, not a visual scan |
| 3 | `name` matches the folder name exactly | Compare the two strings |
| 4 | Every relative path referenced in the draft resolves to a file the draft creates, or is marked as a stub to be written | List them and check each |
| 5 | Zero em dashes and zero en dashes | Character search for both characters, not a visual scan |
| 6 | No backtick-bang injection lines | Character search |
| 7 | The research obligation is present and names a specific domain | Read section |
| 8 | All six required-content items present, or the missing ones named | Checklist |

Checks 2 and 5 are done by searching for the characters. Neither is reliably done by eye, and
both are the checks most often reported as passed when they were not.

---

## 9. What ships

Write the draft to `drafts/{proposed-skill-name}/SKILL.md`, relative to the working directory.
The folder name and the frontmatter `name` must match, which is check 3, and creating the
folder correctly is how that check passes rather than an afterthought.

Alongside it, write `drafts/{proposed-skill-name}/README-DRAFT.md` containing:

- The eight validation results.
- The stage 2 research obligation: the specific domain to sweep, and at least three named
  starting questions for that sweep.
- The receipts the draft was built from, listing the observed occurrences with their dates.
- A one-line statement that this is a draft, that nothing has been installed, and that the
  user decides whether it gets built.

**Never install it.** Never write into a plugin manifest, a marketplace manifest, or the
user's skills directory. This skill suggests. That is a hard rule and it has no exception.

---

## 10. Worked shape of a draft body

For a candidate detected by signature 3, a manual data movement, the drafted body would run:

- Title and a two-paragraph statement of what it does, with the observed occurrence count.
- Mode line.
- Purpose: the specific transfer, described by field type rather than by value.
- Littlebird MCP calls used: the real names from section 6 that this skill actually needs.
- Trigger: the user's own phrasings from capture.
- Routine cadence: either the schedule, or an explicit "on-demand, and here is why".
- Capability gate, per section 4 item 1.
- Retrieval brief: the actual queries, taken from the queries that found the pattern in the
  first place. This is the most reusable output of the detection pass, so carry it across
  rather than inventing new ones.
- Process: the steps, drawn from the deduplicated UI states observed.
- Evidence standards reference.
- Empty retrieval branch.
- Output: filename pattern and section list.
- Guardrail: the specific risk. For a data movement skill, that is writing wrong values into a
  system of record.
- Related skills, per section 5.3.
- Ship Gate line, per section 5.1.
- The stage 2 research obligation, per section 1.

The step list comes from observation, not from imagination. Where a step was not observed,
the draft says so with a gap marker rather than filling it with what usually happens there.
