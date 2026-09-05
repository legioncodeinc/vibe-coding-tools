# Topic scoping

The interview that happens before any retrieval. A topic is not a question, and a synthesis
built on an unscoped topic returns a wall of loosely related material, which is the exact
failure this skill exists to avoid.

Domain claims trace to `references/research/distilled-research-synthesis-method.md`.

## Why this step is not optional

The synthesis this skill produces is a scoping exercise, not a systematic review. Scoping
reviews provide "an overview of the available research evidence" rather than answering a
specific question, and they "often prioritize breadth over depth" (distillation section 1).
Breadth without a boundary is not breadth, it is sprawl.

Rapid review guidance puts stakeholder involvement first, before the protocol: "Involve key
stakeholders ... to set and refine the review question, eligibility criteria" and outcomes
(distillation section 2). The user is the stakeholder. This interview is that step.

There is a second reason specific to this skill. The internal half of the retrieval is
bounded by what Littlebird captured, and captured material is indexed by the words that were
actually on screen. A topic stated in the user's abstract vocabulary retrieves nothing if
the screen said something else. The alias list produced by this interview is what makes the
internal half work at all.

## The interview

Run it with `AskUserQuestion`. Six questions. Do not skip to retrieval with fewer than the
first four answered.

### 1. The question behind the topic

Ask what decision or piece of work this synthesis feeds. Not "what do you want to know
about X" but "what will you do differently depending on the answer".

Three shapes, and they need different sweeps:

| Shape | Example | What the sweep favours |
|---|---|---|
| **Orientation** | "I keep seeing this term and I want to actually understand it" | Breadth. Primary and official sources first. Definitions and category boundaries |
| **Decision** | "Should we move to this approach" | Depth on the specific tradeoff. Disconfirming evidence. Sources with no stake |
| **Currency check** | "Is what I think I know about this still true" | Recency. The user's own exposure dates are the pivot, and the external half is scoped to what postdates them |

The third shape is where this skill is strongest, and many users will describe the first
while meaning the third. Ask.

### 2. Scope boundaries

Get an explicit in and out. Adjacent topics, the specific sub-area, the level (strategic
versus implementation), and the geography or market if it matters.

Write the boundary down and put it in the output header. A synthesis whose scope is not
stated cannot be judged for whether it covered the topic.

### 3. The vocabulary and alias list

**This is the highest-value answer in the interview.** Ask for:

- The term the user uses
- The terms vendors use for the same thing
- The terms critics use
- Product names, project names, and acronyms
- The older name for it, if the thing was renamed
- Names of people, companies, or publications closely associated with it

Every one of these becomes a retrieval query on both halves. A topic with three aliases and
two associated names produces a materially better internal sweep than the topic word alone.

### 4. The exposure window

How far back to look at the user's own capture. Defaults:

| Situation | Window |
|---|---|
| Standard | 180 days |
| Fast-moving topic, or a currency check | 90 days, then a second 90 day block separately so the delta inside the window is visible |
| Something the user has been circling for a long time | 365 days, swept in 90 day blocks |

Sweep in blocks rather than one long window. Unbounded search dilutes relevance and risks an
oversized result (`references/littlebird-mcp-reference.md`).

### 5. What they think they already know

Ask directly: "What is your current working understanding of this, in a sentence or two?"

Capture the answer verbatim. It is used twice: as a retrieval query, and as the thing the
"What you appear to believe" section is checked against. A stated position from the user in
this interview is the strongest possible evidence of a position, stronger than anything
retrieval will find, and it is the one form of belief evidence that needs no attribution
caveat.

If the user declines to answer, say that the belief section will be built from retrieval
only and will be correspondingly weaker.

### 6. Standing topic or one-off

If the user wants this watched over time, the recurring mode applies and the routine gets
created at the end of the run. See the routine wiring section of `SKILL.md`.

## Reframing a topic that is too broad

A topic that would return everything returns nothing useful. Symptoms and fixes:

| Symptom | Fix |
|---|---|
| The topic is a whole field | Ask which of three sub-questions they actually want, and offer three |
| The topic is a term with no agreed meaning | Split into "what people mean by this" and "the specific thing you care about" |
| The topic is a vendor category name | Reframe to the underlying problem, then treat the category name as one alias among several |
| The topic is really about one company | This is not the right skill. Point at `competitor-watch` |

Offer the narrowing with `AskUserQuestion` and let the user choose. Do not narrow silently.

## What to record before retrieval starts

Write these into the scoping block that will head the output:

```
Topic:              the user's words
Question behind it: orientation | decision | currency check
In scope:           explicit
Out of scope:       explicit
Aliases:            the full list
Associated names:   people, companies, publications
Exposure window:    start to end, and the block size
Stated position:    the user's own sentence, verbatim, or NOT PROVIDED
```

This block is not decoration. Every abbreviation in a rapid review is legitimate only when
declared and documented rather than hidden (distillation section 2), and the scope block is
where this synthesis declares what it did not look at.
