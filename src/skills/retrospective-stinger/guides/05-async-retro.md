# 05: Async Retro Design

*Derived from `research/external/2026-05-20-async-retro-retroflow.md` and `research/external/2026-05-20-async-retro-remote-retroflow.md`.*

---

## Async retros: first-class option, not fallback

Async retrospectives are not a consolation prize when schedules don't align. They are a valid first choice for many teams: particularly distributed teams, teams with timezone spreads greater than 4 hours, and teams where introverted or non-native-English contributors are underrepresented in sync sessions.

Key research finding: async retros produce **42% higher participation from introverted team members** than equivalent synchronous sessions. This is because async gives contributors time to think without social pressure, reducing the anchor bias that makes the first few contributions dominate a live session.

---

## Decision gate: should this retro be async?

Use async when two or more of the following are true:

- Timezone spread > 4 hours (making a 60-minute overlap difficult).
- Team has > 40% introverted contributors (per MBTI, DISC, or facilitator observation).
- Psychological safety is below 3.5 on the Edmondson scale (async + anonymity as a bridge).
- Last 2-3 sync retros had low energy or low participation.
- Sprint produced a complex emotional period that benefits from reflection time before sharing.

Use sync when:

- The team needs to build rapport (new team, new member onboarding).
- The retro will produce a significant decision that needs real-time discussion and consensus.
- A conflict needs to be resolved (not just surfaced) within the retro.

---

## The 4-day async retro timeline

This is the canonical structure for a distributed team retrospective. All times are async (no synchronous meeting required for phases 1-3).

### Day 1 (async): Input

Open the retro board. Notify the team via Slack/Teams: "Retrospective is open. Please add your cards by [Day 3 EOD local time]."

Best formats for async input: 4Ls, Start/Stop/Continue. Both are self-explanatory and require no facilitation to seed.

Tool options:
- **Parabol:** Best-in-class async agile support. Provides anonymous input, time-boxed phases, and structured synthesis.
- **Neatro:** Purpose-built for async retros. Clean UX for distributed teams.
- **FunRetro / GoRetro / EasyRetro:** Good for sync; limited native async mode. Can work with a shared doc for async input and then import.
- **Miro / Mural:** Canvas tools: flexible but require more facilitation setup.
- **Notion / Google Docs:** Minimal tooling; works for simple formats. Loses structure for clustering.

Note: As of 2026, GoRetro and EasyRetro do not have native async modes. Parabol is the only mainstream agile tool with meaningful async retro support. See `research/external/2026-05-20-tools-landscape-2026.md`.

### Day 2-3 (async): Clustering and voting

Once input is closed, the facilitator clusters similar items into themes (can be async). Then open the board for dot voting: asynchronously, 24-48 hour window.

If using Parabol: the tool manages voting with built-in phase controls. For other tools: use a pinned Slack message with emoji reactions as votes (thumbs-up = 1 vote per person).

### Day 4: Synthesis call (30-45 minutes, synchronous)

A short synchronous session to discuss the top-voted themes and confirm action items. This is the only required synchronous touchpoint.

Agenda:
- 5 min: Previous actions review.
- 5 min: Context on top themes (facilitator summarizes patterns from the async board).
- 20 min: Discussion of top 2-3 themes (same as sync retro discussion phase).
- 10 min: Action item commitment (3-question filter).
- 5 min: Closing.

If a synthesis call is impossible (e.g., no timezone overlap at all): the facilitator synthesizes top themes into a written summary and proposes action items in writing. The team reviews and async-votes (thumbs up/down) to confirm.

---

## Async facilitation techniques

### Prompt sequencing

In async retros, the prompt wording matters more than in sync sessions (no facilitator to clarify). Write prompts that are:

- Specific to the sprint being reviewed (reference the sprint goal or a significant event).
- Positive and negative balanced (do not only ask for problems).
- Time-bounded (reference "this sprint" not "in general").

Example prompt for Start/Stop/Continue:
- Start: "What should we start doing in Sprint 14 that we didn't do in Sprint 13?"
- Stop: "What from Sprint 13 slowed us down or created friction? What should we stop doing?"
- Continue: "What worked well in Sprint 13 that we should keep doing?"

### Reminder protocol

Send two reminders: one at the 48-hour mark, one at the 24-hour mark before the input window closes. Keep reminders short and non-shaming: "Retro board is open: add your thoughts by tomorrow at 5pm your local time."

### Anonymous input by default

For async retros, default to anonymous card submission. Anonymity reduces social pressure in async contexts even more than in sync contexts (no body language cues to read). Parabol and Neatro both support anonymous mode.

---

## Formats optimized for async

| Format | Async-friendly? | Notes |
|---|---|---|
| Start/Stop/Continue | Excellent | Simple, self-explanatory, no facilitation seed needed |
| 4Ls | Excellent | Positive framing works well for async reflection |
| Sailboat | Good | Visual metaphor is helpful; works in Miro |
| Mad/Sad/Glad | Moderate | Emotional framing benefits from real-time context; add a brief sprint summary as context |
| DAKI | Good | Clear categories; needs a brief description of what "drop" means vs "stop" |
| Starfish | Good | More categories than SSC but still self-explanatory |
| 5 Whys | Not recommended async | Requires real-time follow-up; better reserved for synthesis call |

---

*Cross-reference: `guides/01-formats.md` (format selection including async context), `guides/04-action-items.md` (action items work the same for async: backlog placement still required).*

> TODO: open question: should `retrospective-worker-bee` recommend Postmortem.io for async retros? Current research indicates it is focused on incident postmortems rather than sprint retrospectives. Human decision needed before next refresh. See `research/research-summary.md` open question #1.
