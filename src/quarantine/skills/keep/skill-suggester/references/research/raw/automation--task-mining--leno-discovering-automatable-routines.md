# Discovering Automatable Routines from User Interaction Logs

- **URL:** https://lepo.it.da.ut.ee/~dumas/pubs/rpadiscovery.pdf
- **Fetched:** 2026-08-17
- **Source type:** academic (Leno, Polyvyanyy, La Rosa, Dumas, Maggi; BPM Forum 2019,
  Springer LNBIP)
- **Why archived:** The concrete method behind stage 5 of the RPM pipeline. It supplies the
  operational definition of an automatable routine, the threshold the authors actually use,
  and an explicit statement of what breaks the method. The threshold and the failure
  conditions are the useful parts here.

## What a UI log record contains

A UI log contains routine traces, which are user interaction sessions. Each trace is a
sequence of actions. Each action comprises a type (click, copy, paste), parameters (UI
element identifiers), and values assigned to those parameters.

## Definition of an automatable routine, quoted

> "the first action is always triggered when a condition is met (the routine's activation
> condition) and the value of each parameter of each action can be computed from the values
> of parameters of previous actions."

Two tests, both required: a determinate trigger, and determinate data. A sequence that
repeats but whose inputs come from outside the trace is not automatable by this definition.

## The method, three stages

1. **Compression.** Build a Deterministic Acyclic Finite State Automaton that prefix- and
   suffix-compresses the routine traces into a lossless representation.
2. **Structure analysis.** Apply Refined Process Structure Tree decomposition to identify
   Single-Entry Single-Exit regions, extracting flat polygons as candidate automatable
   sequences.
3. **Determinism detection.** Test whether each action parameter is either constant across
   executions or derivable from prior actions.

Parameter value determination is attempted three ways: constant functions (identical values
across all executions), data transformations (substring and concatenation patterns
discovered with Foofah), and substitution mappings (learned with the JRipper rule learner).

## The threshold the authors use

For learned substitution rules the authors retain only those having **confidence 1.0**,
because in their words such rules are the only ones that can be considered deterministic.

This is an absolute threshold, not a tuned one. It is worth noting when defending any
threshold choice: the published method does not tune a support value for determinism, it
demands totality. Frequency thresholds for how often a sequence must recur before it is
considered a candidate are not fixed by this paper.

## Stated limitations

- The approach assumes user tasks are performed without noise.
- A non-deterministic event breaks the polygon capturing a routine into two flat polygons,
  which prevents discovery of the complete routine. In plain terms: one variation in the
  middle of an otherwise repeated sequence causes the detector to see two shorter patterns
  instead of one real one.
- Loops are not captured, because the automaton representation does not capture loops. The
  method cannot determine activation conditions for routines that immediately follow the
  exit point of a loop, particularly where that condition depends on the number of
  executions.

## Evaluation numbers

Evaluated on nine synthetic UI logs generated from Colored Petri Nets.

| Log | Result |
|---|---|
| L1 | Discovered all 13 automatable actions, 92.9% of total, in 3.0 seconds |
| L9 (most complex) | Discovered 24 of 24 automatable actions, 935.2 seconds with Foofah enabled, up to 50x slower |
| L3, L4, L6, L8, L9 | Without Foofah, complex data transformations were missed |

The evaluation is on synthetic logs, which is a real limit on how far these numbers
transfer. It demonstrates that injected routines can be re-discovered, not that routines in
messy real capture can be.
