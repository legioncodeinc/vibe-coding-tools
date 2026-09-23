# Example: Happy Path — SaaS Onboarding Discovery

A worked end-to-end continuous-discovery cycle for a B2B SaaS product. Demonstrates desired outcome definition, OST construction, JTBD interview, assumption mapping, and experiment design.

**Related guides:** `guides/01-desired-outcome.md`, `guides/02-opportunity-solution-tree.md`, `guides/04-jtbd-interview.md`, `guides/05-assumption-mapping.md`, `guides/06-experiment-design.md`

---

## Context

**Product:** Project-management SaaS for small engineering teams (2-15 devs).
**Team:** PM + designer + engineer (product trio).
**Trigger:** Activation rate (completing first workflow within 7 days of signup) stalled at 38%; team wants to move it to 55%.

---

## Step 1: Desired outcome

```
# Desired Outcome

Customer segment: New signups on the free trial (0-7 days since signup)
Outcome statement: New users complete their first automated workflow within 48 hours of signup.
Measurement signal: "First workflow created and run" event fires within 48 hours of account creation.
Cycle started: 2026-04-01
Status: active
```

**Why this outcome passed the three-part test:**
- Customer-centric: it describes what the customer does, not a business metric.
- Measurable: specific behavioral event + time window.
- Influenceable: the product team controls the onboarding flow.

---

## Step 2: Opportunity Solution Tree (snapshot after 4 interviews)

```markdown
## Desired Outcome
New users complete first automated workflow within 48 hours of signup.

## Opportunity Clusters

### O1 — Users don't know where to start
- O1a: The empty-state UI gives no clear first action
- O1b: Users don't know which workflow type fits their use case

### O2 — Users get stuck during workflow setup
- O2a: The trigger-action model is unfamiliar (users think in scripts, not triggers)
- O2b: Error messages when a connection fails don't explain the fix

### O3 — Users lose confidence and abandon before first run
- O3a: No visible progress indication — users don't know if setup worked
- O3b: No "safe to try" framing — users fear breaking something

## Active path: O1 → O1a (empty-state confusion) → [solution TBD]

## Retired Opportunities
*(none yet — cycle week 1)*
```

*Note: O1a emerged in 3 of 4 interviews. O3b emerged in 2. All nodes are annotated with interview dates in the live file.*

---

## Step 3: JTBD Interview excerpt (for O1a)

**Interview date:** 2026-04-08 | **Participant:** "Alex", senior engineer, 5-person startup

**Act 3 excerpt (switch story):**
> "I signed up on a Tuesday, opened the app, and just... stared at it. There was a blank canvas and like four icons in the sidebar. I clicked around for maybe 10 minutes and then I had a Slack message come in and I never came back that day. I tried again Thursday, watched one YouTube tutorial someone linked in a Slack community, and that's when I got it."
>
> **F1 (push):** "The blank screen was a dead end. I had no idea what the first step was supposed to be."
> **F2 (pull):** "The YouTube tutorial showed me exactly what the finished thing looked like — working backward from that was much easier."
> **F4 (habit):** "I was used to our old Zapier setup where you pick a trigger from a list. Here I had to think about what I wanted to trigger, which is the opposite direction."

**Opportunity hypothesis extracted:** "New users benefit from seeing a completed workflow example relevant to their team type before they start building from scratch."

---

## Step 4: Assumption map (for solution "Guided-template starter")

**Solution idea:** On empty state, show 3-5 workflow templates specific to the user's team type (engineering, marketing, ops). User can inspect or clone a template before building from scratch.

| Assumption | Axis | Importance (1-3) | Uncertainty (1-3) | Quadrant |
|---|---|---|---|---|
| Users will engage with templates rather than dismiss them | D | 3 | 3 | **Kill Zone** |
| We can infer team type from signup data accurately enough | F | 2 | 2 | Monitor |
| Users can successfully clone and adapt a template | U | 3 | 2 | Monitor |
| Showing templates won't cannibalize power-user blank-canvas starts | V | 2 | 3 | Park |

**Kill Zone assumption:** "Users will engage with templates rather than dismiss them."

Rationale: if users skip the templates and still see a blank canvas, the intervention has zero effect and we've added UI complexity for nothing.

---

## Step 5: Experiment plan

**Experiment:** Fake-door template gallery

**Archetype:** Fake Door (landing page / feature signal)

**Assumption being tested:** Users will engage with templates rather than dismiss them.

**Protocol:**
1. Add a "Start from a template" card to the empty state (no backend — clicking through shows a static mockup of 3 templates).
2. Track: (a) % of new signups who click the card within 48 hours, (b) % who click through to at least one template mockup.

**Pre-stated success criterion:** ≥ 40% of new signups in the test group click "Start from a template" within 48 hours.

**Run period:** 2 weeks (targeting ~80 new signups for a rough signal — not statistically rigorous but sufficient to decide whether to invest in full build).

**Result (logged after run):** 52% click-through on the card; 31% viewed at least one template. Criterion met on primary metric. Proceeding to Wizard of Oz for cloning flow.
