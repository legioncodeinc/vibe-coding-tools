# Internal Note: Command Brief ACTION List → Research Needs

**Stinger:** retrospective-stinger
**Authored by:** scripture-historian on 2026-05-20
**Purpose:** Maps each ACTION step in the Command Brief to the research material that `stinger-forge` needs in order to author the corresponding guide.

---

## ACTION 1: Select the format
> *"Based on context (team maturity, period valence, time budget, remote/sync), choose one of the canonical formats from `guides/01-formats.md` and explain the selection rationale."*

**Research needed:**
- A matrix of all major formats (Start/Stop/Continue, 4Ls, Mad/Sad/Glad, Sailboat, DAKI, Starfish, Learning Matrix, 5 Whys variant, Hot Air Balloon, Lean Coffee, Futurespective) with: description, best-for context, time budget, facilitation complexity, voting mechanism.
- Decision heuristics: new team vs. experienced, emotional sprint vs. normal sprint, short time budget vs. full session, visual thinkers vs. list-oriented.
- Format rotation guidance (3-5 sprint cadence before switching).

**Research files covering this:** `external/2026-05-20-sprint-retrospective-formats-comprehensive.md`, `external/2026-05-20-format-selection-meetgeek.md`

---

## ACTION 2: Run the safety and honesty pre-check
> *"Using `guides/02-psychological-safety.md`, identify whether the team has the minimum safety preconditions for an honest retro."*

**Research needed:**
- Edmondson's psychological safety model (4 stages: inclusion, learner, contributor, challenger safety).
- Measurement instruments: the 7-item Edmondson scale, the 1-5 anonymous safety check, the ESVP activity.
- Signals of low safety in a retro context: repetitive surface-level feedback, no negative items, same voices dominating.
- Mitigation techniques: anonymous input, Retrospective Prime Directive, rotating facilitator, leader vulnerability modelling.
- Gate logic: if safety score < 3/5, shift retro focus to building safety rather than running the standard format.

**Research files covering this:** `external/2026-05-20-psychological-safety-retroflow.md`, `external/2026-05-20-psychological-safety-agile-kollabe.md`

---

## ACTION 3: Generate the facilitation plan
> *"Produce a complete, time-boxed agenda with icebreaker, prompt wording, voting mechanism, synthesis steps, and action-item capture template."*

**Research needed:**
- The 5-phase Derby & Larsen retrospective structure (Set the Stage, Gather Data, Generate Insights, Decide What to Do, Close).
- Time-boxing rules per sprint length (30-45 min/week of sprint, max 3 hours/month).
- Icebreaker options and their purpose (warm-up, safety signal, participation guarantee).
- Voting mechanisms: dot voting (3 dots each), fist-to-five, silent brainstorming, anonymous voting via tools.
- Synthesis techniques: affinity mapping, theme clustering, 5 Whys drill-down.
- Closing ritual: ROTI (Return on Time Invested), recap of action items.

**Research files covering this:** `external/2026-05-20-sprint-retrospective-formats-comprehensive.md`, `external/2026-05-20-format-selection-meetgeek.md`

---

## ACTION 4: Review previous action items
> *"Score each as Done / In Progress / Dropped and surface the pattern (what follow-through rate does the team have?)."*

**Research needed:**
- Opening ritual: reading last sprint's action items aloud in the first 5 minutes.
- Scoring rubric: Done / In Progress / Dropped / Carried Forward.
- Follow-through rate calculation and benchmarking (50% average per survey data, 70% target, 85%+ as high-performing).
- Pattern diagnosis: persistent Dropped items = capacity issue; same items cycling = root cause not addressed; no items completed = structural problem.
- The 3-question filter: Who owns it? When does it close? What does done look like?

**Research files covering this:** `external/2026-05-20-action-items-follow-through-scrumtool.md`, `external/2026-05-20-action-items-agile-coach-medium.md`

---

## ACTION 5: Run or coach the session (async context)
> *"In async retros, generate the board/doc template and prompt sequence. Use `guides/05-async-retro.md` for async context."*

**Research needed:**
- Decision gate: when to go async (timezone spread > 4-6h, meeting fatigue, introvert-heavy team, safety not yet established).
- Async retro timeline (Day 1: open board / announce; Days 1-3: contribution phase; Day 3-4: voting; Day 4-5: discussion threads; Day 5: action items + summary).
- Hybrid design pattern: async collection (24-48h) + short sync discussion (30 min).
- Tool options: Parabol (async support + backlog sync), EasyRetro (simple board), Notion/Miro (flexible), Slack threads.
- Facilitation in async: anonymity prevents anchoring; facilitator synthesises themes before sync call; reminder cadence (2-3 reminders max).

**Research files covering this:** `external/2026-05-20-async-retro-retroflow.md`, `external/2026-05-20-async-retro-remote-retroflow.md`

---

## ACTION 6: Capture and prioritize action items
> *"Synthesize the session output into a prioritized, owner-assigned, time-bounded action list."*

**Research needed:**
- SMART criteria applied to retro action items (Specific, Measurable, Achievable, Relevant, Time-bound).
- Single-owner rule (not "the team"): the Action Item Owner / Ambassador concept.
- Quantity limit: 2-3 per retro; fewer with follow-through beats many without.
- Placement: action items must land in the sprint board as actual tickets, not in a retro-only doc.
- Accountability loop: review at standup visibility + review at next retro opening.

**Research files covering this:** `external/2026-05-20-action-items-follow-through-scrumtool.md`, `external/2026-05-20-action-items-agile-coach-medium.md`

---

## ACTION 7: Hand off decisions
> *"If the retro surfaces a significant architectural, process, or cultural decision, note it with a pointer to `library-worker-bee`."*

**Research needed:**
- Distinction between retro action items (behavioral, sprint-scoped) and decisions (architectural, process-changing, worth documenting).
- Signal phrases that indicate a library-worthy decision: "we're changing how we do X permanently", "we need a new process for Y", "this is an ADR".
- No specific research file needed: this is a workflow routing rule, not a domain-knowledge problem.

---

## Summary for stinger-forge

The five guides proposed in the Command Brief map cleanly to the five query areas researched:

| Guide | Query area | Primary research files |
|---|---|---|
| `00-principles.md` | Q1 formats (philosophy section) | formats-comprehensive, meetgeek |
| `01-formats.md` | Q1 formats | formats-comprehensive, meetgeek |
| `02-psychological-safety.md` | Q4 psychological safety | retroflow-psych-safety, kollabe-psych-safety |
| `03-facilitation.md` | Q1 + Q2 | formats-comprehensive, async-retroflow |
| `04-action-items.md` | Q3 action items | scrumtool-action-items, medium-agile-coach |
| `05-async-retro.md` | Q2 async | async-retroflow, remote-retroflow |
| Tools landscape | Q5 tools | tools-landscape |

`templates/action-items.md` needs the 3-question filter + SMART format + owner/deadline fields from Q3 sources.
`templates/facilitation-plan.md` needs the 5-phase agenda + time-boxing rules from Q1 sources.
