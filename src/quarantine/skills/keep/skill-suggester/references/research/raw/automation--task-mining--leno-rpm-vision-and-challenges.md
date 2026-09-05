# Robotic Process Mining: Vision and Challenges

- **URL:** https://link.springer.com/article/10.1007/s12599-020-00641-4
- **Fetched:** 2026-08-17
- **Source type:** academic (Leno, Polyvyanyy, Dumas, La Rosa, Maggi; Business and
  Information Systems Engineering, volume 63, 2021)
- **Why archived:** The field's own framing of the exact problem this skill has, with a
  different data source. It names the seven stages a detector has to get through, and it
  names which stages are unsolved. Both matter: the pipeline gives a structure to borrow,
  and the open-challenge list is the honest ceiling on what any detector built on capture
  can claim.

## Definition, quoted

> "a class of techniques and tools to analyze data collected during the execution of
> user-driven tasks in order to support the identification and assessment of candidate
> routines for automation and the discovery of routine specifications that can be executed
> by RPA bots."

Note the two verbs kept separate in the definition: **identification and assessment** of
candidates, then **discovery** of specifications. Finding the pattern and deciding it is
worth automating are treated as different problems.

## The seven-stage pipeline

| # | Stage | What it does |
|---|---|---|
| 1 | Recording | Captures low-level UI events from user interaction: selecting fields, editing text, opening pages |
| 2 | Noise filtering | Removes events that do not contribute to task execution: distractions, unrelated activity |
| 3 | Segmentation | Divides a continuous UI log into distinct task traces, each one execution instance of a task |
| 4 | Simplification | Removes redundant or wasteful events, aggregates low-level actions into higher-semantic actions |
| 5 | Candidate routine identification | Extracts repetitive action sequences occurring across multiple task traces and assesses automation feasibility |
| 6 | Executable routine discovery | Generates platform-independent routine specifications, identifying activation conditions and routine logic |
| 7 | Compilation | Translates specifications into executable scripts for a specific RPA tool |

## The open challenges, per stage

- **Recording.** Determining what granularity of action to capture, and accessing
  semantic-level UI element information rather than pixel coordinates.
- **Noise filtering.** Distinguishing noise from legitimate task events, particularly when
  noise clusters near specific states.
- **Segmentation.** Identifying task boundaries without explicit case identifiers,
  especially across multiple applications and when tasks execute in batches.
- **Simplification.** Identifying semantic action boundaries, and determining when events
  are redundant versus contextually integral.
- **Candidate identification.** Detecting deterministic versus non-deterministic actions,
  and formally characterizing automation suitability.
- **Routine discovery.** Handling multiple execution variants, discovering data
  transformations between actions, identifying conditional routine triggers.
- **Compilation.** Recognizing dynamic UI elements, and preserving action semantics when UI
  element identifiers are unavailable.

## Why this matters for a capture-based detector

Segmentation without case identifiers is named as an open challenge even where the input is
a proper UI event log with element identifiers. A periodic screen-snapshot stream has
strictly less structure than that: no element identifiers, no click events, no explicit
boundaries. Any segmentation done on top of it is a coarser approximation of a problem the
field has not closed.
