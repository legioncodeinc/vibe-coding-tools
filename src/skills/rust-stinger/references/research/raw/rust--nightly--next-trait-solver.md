# Enabling the next-generation trait solver on nightly
- URL: https://blog.rust-lang.org/2026/08/21/enabling-next-solver-on-nightly/
- Fetched: 2026-09-03
- Source type: official-docs

## Captured source material

- Published: 2026-08-21
- Channel and state: enabled by default on nightly; close to stabilization; not the stable default on the fetch date
- Replaced compiler work named by the source: proving where clauses and normalizing associated types
- Future feature fields: Type Alias Impl Trait and Return Type Notation
- Reported issue count: more than 200 known issues fixed
- Documented opt-out configuration:

```toml
[build]
rustflags = ["-Znext-solver=coherence"]
```

## Archived facts

- The next-generation trait solver became the default on nightly in August 2026.
- It changes core handling for proving where clauses and normalizing associated types.
- The project reported that the implementation fixed more than 200 known issues and unblocked future type-system work.
- Nightly users can still encounter inference changes, regressions, performance changes, and weaker diagnostics.
- The documented opt-out is `-Znext-solver=coherence`.
- The solver was not the general stable default on the fetch date.

## Stinger relevance

Keep next-solver checks in an explicitly non-blocking nightly lane unless the project has separately chosen nightly as a supported toolchain.
