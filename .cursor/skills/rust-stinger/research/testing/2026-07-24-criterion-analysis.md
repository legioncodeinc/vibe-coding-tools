---
source_url: https://bheisler.github.io/criterion.rs/book/analysis.html
retrieved_on: 2026-07-24
source_type: official-docs
authority: official
relevance: high
topic: benchmark
stinger: rust-stinger
---

# Criterion analysis process

## Summary
Criterion performs warmup, measurement, statistical analysis, and comparison to saved baselines. It retains outliers, uses regression and bootstrap confidence intervals, and applies configurable significance/noise thresholds. Results still require a stable environment; statistical sophistication does not eliminate host noise.

## Key quotations / statistics
- "Each benchmark ... goes through four phases"
- "outlier samples are not dropped"

## Version/date caveat
Criterion docs reported crate 0.8.2 elsewhere in the corpus. The project warns virtualized CI can be too noisy for reliable wall-time regressions.

## Annotations for stinger-forge
- Use for controlled local/release-host microbenchmarks and saved evidence.
- Eight-hour soak evidence is a distinct workload with invariants/resource telemetry, not a Criterion benchmark.

