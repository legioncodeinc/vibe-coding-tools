# New-entrant detection

Names that entered the user's field of view for the first time this period. This is how a
competitor gets caught before it is on anyone's list, and it is the feature that
distinguishes this skill from a monitoring tool that can only watch names you already
typed in.

Domain claims trace to `references/research/distilled-competitive-intelligence.md`.

## Why a URL monitor cannot do this

The unit of configuration in every surveyed competitive intelligence product is a
competitor name or a URL the user already knows to enter, and two of the products
explicitly price per competitor tracked (distillation section 3). A monitoring model billed
per tracked name cannot surface a name nobody entered.

The theory underneath is Ansoff's: weak signals are "bribes of information" at an early,
vague knowledge state, sitting in "the hazy area at the edge of an organization's vision"
(distillation section 5.1). Ansoff's first filter is the observation filter, which is the
one that fails when you never saw it at all (distillation section 5.3). The user's screen
record is an observation filter that already ran, without anyone deciding in advance what
was worth catching.

## The method, concretely

Broad unbounded queries do not work. They overflow the result limit and get written to a
file, and they return noise (`references/littlebird-mcp-reference.md`). Alert volume and
irrelevant results are the named, unsolved failure of broad monitoring across the whole
tooling category (distillation section 3). So the method is bounded, category-shaped, and
diff-based.

### Step 1. Build category-shaped queries from the market frame

Take the one-sentence market frame from `references/watchlist-setup.md` and expand it into
6 to 10 query shapes that describe how a competitor would appear on screen without naming
one. Do not query the category noun alone.

Working shapes, filled from the user's actual frame:

| Shape | Why it catches new names |
|---|---|
| `alternative to [category], comparison, versus` | Comparison pages and threads name everyone in a category at once |
| `[category] pricing page, plans, per seat` | A pricing page screenshot names the vendor |
| `we switched to, we moved off, replaced our [category]` | Switching language names the destination |
| `[category] launch, launching, now available, beta` | Launch posts are the entry event (distillation section 6) |
| `raised seed, raised Series A, funding [category]` | Funding announcements are a named market-entry signal (distillation section 6) |
| `[category] demo, walkthrough, screenshot of` | Demos and screenshots put a UI on screen with a logo on it |
| `has anyone tried, anyone using, recommendations for [category]` | Community request threads surface unknown names |
| `[buyer role] tools we use, our stack` | Stack posts enumerate vendors |

Run these against `search_user_context` with `filters: {"data_source": "snapshots"}` and
again with `data_source: messages`, both windowed to the reporting period. Keep each call
to at most 7 queries. Run the sets as separate parallel calls rather than one wide call.

### Step 2. Add the call-sourced pass

`LB_INTERNAL_SEARCH_MEETINGS` with topic queries rather than names:

- `competitor we are evaluating`
- `also looking at, other vendors, shortlist`
- `who else are you talking to`
- `currently using for [category]`

Sales calls are the first-listed method for detecting competitors you do not already track,
ahead of every public source (distillation section 6). An unfamiliar name mentioned in a
sales conversation is itself a named market-entry signal (distillation section 6).

### Step 3. Extract candidate names

From the returned items, pull every organization or product name that appears in a
competitive frame: listed alongside a known competitor, named as an alternative, named as
something a buyer is evaluating, named as a launch, or named as the destination of a
switch.

Reject aggressively at this stage:

- The user's own company and products
- The user's vendors, suppliers, and tools that are not in the category
- Platforms hosting the conversation (Facebook, Slack, Reddit, YouTube)
- Generic words the OCR fragmented into something that looks like a name
- Names appearing only inside an advertisement the user did not engage with, unless the ad
  is itself the finding

### Step 4. Diff three ways

This is the step that turns a name list into a new-entrant finding.

| Diff | Against | Result |
|---|---|---|
| A | Current watchlist, all tiers, including aliases | Removes known entities |
| B | The `Declined` section of the watchlist | Removes names the user already rejected, with the reason |
| C | Prior periods' sighting logs and prior digests, read via `LB_INTERNAL_GET_ROUTINE_REPORTS` for the routine, or the stored reports for on-demand runs | Separates genuinely first-seen from recurring-but-untracked |

Diff C produces the two categories that matter:

- **First appearance.** No occurrence in any prior period on record. This is the early
  warning, Hiltunen's low-number, low-visibility class (distillation section 5.4).
- **Recurring but untracked.** Present in prior periods, never added to the watchlist.
  This is the more embarrassing finding and it is often the more important one: something
  has been in the user's field of view repeatedly and nobody named it. Hiltunen's "first
  symptoms" class, numerous and visible but hard to interpret (distillation section 5.4).

Report both, labeled separately.

### Step 5. Grade each candidate

For each surviving name:

| Field | Content |
|---|---|
| Name | As it appeared, plus the apparent canonical form |
| First sighting | Date, app, context type, receipt |
| All sightings this period | Count and context spread |
| Prior-period presence | From diff C. "None on record" or the earliest date found |
| Why it looks competitive | The specific frame it appeared in, quoted short |
| Independence | How many independent contexts, per the counting convention in `references/sighting-extraction.md` |
| Confidence | High, Medium, Low per `references/evidence-standards.md` |
| External check | See below |

### Step 6. One bounded external check per candidate

Only for candidates with two or more independent internal sightings, or any candidate named
on a client or prospect call. Do not run external research on every OCR fragment.

Run one search per candidate to establish: does this company exist, what does it say it
does, when did it appear, and is it actually in the category. Cite to URL. Keep it to a
few sentences. A full external workup happens only if the user promotes the name to the
watchlist, at which point `references/external-monitoring.md` applies.

If no external trace exists, that is a reportable result, not a failure. A name that
appears on a client call and has no public footprint is either a misheard word, a stealth
company, or an internal project name. Say which readings are possible rather than picking
one.

### Step 7. Propose, never add

Write candidates into the `Proposed, awaiting confirmation` section of the watchlist with
their evidence, and present them to the user with `AskUserQuestion` offering promote,
decline with reason, or defer. Never silently expand the watchlist
(`references/watchlist-setup.md`).

The `Declined` list is what keeps this from becoming noise. A declined name is not
re-proposed; it is only mentioned again if its sighting pattern changes materially, and
then the proposal says explicitly that it was declined before and what changed.

## Cadence

Run new-entrant detection every period, weekly for the routine, against the rolling window
for that period. Reconcile against the full watchlist quarterly.

This sits deliberately inside all three cadence readings in the archive, which disagree:
weekly monitoring, ongoing scanning with quarterly reviews, and continuous with no stated
interval (distillation section 10, gap 4).

## Honest limits of this feature

State these in the output the first time the feature runs, and any time a user asks how it
works.

1. **Coverage equals the user's attention.** A competitor that has never crossed this
   user's screen will not appear. This finds what your market is talking about near you,
   not what exists.
2. **Blind spots are structural.** Internal expert assessments significantly underestimate
   impact and uncertainty compared with external experts, and organizations suppress the
   outlier voices most likely to notice a paradigm-breaking entrant (distillation section
   5.5). A record of one person's field of view inherits that person's blind spots.
3. **Retrospective bias is real.** People retroactively "want to see warnings" in past
   events (distillation section 5.5). Do not narrate a candidate as an obvious signal in
   hindsight. Report the sightings and their dates and let them stand.
4. **Absence is not proof.** "No first-time names appeared in this window" means the
   searches found none, not that nobody entered the market
   (`references/evidence-standards.md`, rule 2).
