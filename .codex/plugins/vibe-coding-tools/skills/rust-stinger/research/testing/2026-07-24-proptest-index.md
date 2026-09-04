---
source_url: https://proptest-rs.github.io/proptest/proptest/index.html
retrieved_on: 2026-07-24
source_type: official-docs
authority: official
relevance: high
topic: properties
stinger: rust-stinger
---

# Proptest guide

## Summary
The upstream guide covers strategies, shrinking, failure persistence, configuration, and state-machine testing. Property tests are most useful for invariant-rich inputs and transition sequences; they supplement rather than replace example-based contract tests whose exact output is part of a public API.

## Key quotations / statistics
- Guide sections include "Shrinking Basics" and "Failure Persistence".
- The guide includes dedicated "State Machine testing" material.

## Version/date caveat
The guide reflects upstream main documentation; exact APIs must be checked against the pinned crate release.

## Annotations for stinger-forge
- Supports corpus persistence and reproducible seeds as evidence artifacts.
- Define invariants and input strategies in domain/test-support crates, not production adapters.
