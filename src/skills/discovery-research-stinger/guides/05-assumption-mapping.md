# 05 — Assumption Mapping (DVFU 2×2)

How to enumerate, score, and prioritize assumptions for a proposed solution before building.

**Research source:** `research/external/2026-05-20-assumption-mapping-dvf-2x2-2026.md`

---

## The DVFU taxonomy

Every solution rests on assumptions across four axes:

- **D — Desirability:** Customers actually want this. (Do they have the problem we think they have? Will they change behavior to use this solution?)
- **V — Viability:** The solution makes business sense. (Can we charge for it? Will it generate the return the business needs?)
- **F — Feasibility:** We can actually build it. (Do we have the technical capability? Can we build it in time?)
- **U — Usability:** Customers can figure out how to use it. (Is the interface learnable? Will they be able to complete the core job without training?)

Most teams naturally focus on Feasibility. Desirability is the axis most often unchecked — and the most common cause of building the right thing badly.

(Source: `research/external/2026-05-20-assumption-mapping-dvf-2x2-2026.md`)

---

## The 2×2: importance × uncertainty

Score each assumption on two dimensions:

| Dimension | Scale | Definition |
|---|---|---|
| Importance | 1-3 | How much does this assumption being wrong affect whether the solution succeeds? (3 = kills the solution) |
| Uncertainty | 1-3 | How uncertain are we right now? (3 = no evidence at all; 1 = high confidence from interviews or prior data) |

Plot on a 2×2:

```
          Importance
           Low    High
Uncertainty
Low     |  OK  | Monitor |
High    | Park  |  TEST   |
```

**Kill Zone (high importance, high uncertainty):** These are the assumptions that, if wrong, will tank the solution. Test these first.

**Park (low importance, high uncertainty):** These matter less even if wrong. Don't waste experiment budget here.

**Monitor (high importance, low uncertainty):** You already have evidence; track them but don't design a separate experiment.

**OK (low importance, low uncertainty):** Safe to proceed.

---

## The "test what scares you" rule

Teams systematically gravitate toward testing assumptions in the OK and Monitor quadrants because testing those feels productive without threatening the solution idea. The discipline is to explicitly name the assumptions you're most afraid are wrong — those are almost always in the Kill Zone — and design the first experiment for those.

If naming the Kill Zone assumptions makes you want to redesign the solution before testing, that is a signal the solution needs more discovery work, not less.

---

## How to run an assumption mapping session

1. **List all assumptions** for the solution across D, V, F, U axes. Be specific: "Users will switch from their current tool" is a real assumption; "the product is useful" is too vague.
2. **Score each** independently on importance and uncertainty (1-3 each). Do this individually first, then compare scores — disagreements reveal knowledge gaps worth surfacing.
3. **Plot the 2×2.** Identify the Kill Zone.
4. **Pick the top-1 Kill Zone assumption** for the next experiment. (If the Kill Zone is empty, you've either done extraordinary discovery work or you're not being honest about uncertainty — check again.)
5. **Write an experiment brief** using `guides/06-experiment-design.md` for the top-1 assumption.

---

## Output

Write the assumption map to: `library/discovery/assumption-maps/<solution-slug>.md`

Use `templates/assumption-map.md` which includes the DVFU table pre-filled and the 2×2 scoring columns.

See `examples/happy-path-saas-onboarding.md` for a worked assumption map with Kill Zone identified.
