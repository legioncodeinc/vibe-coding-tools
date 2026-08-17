---
source_url: https://doc.rust-lang.org/book/ch20-01-unsafe-rust.html
retrieved_on: 2026-07-24
source_type: official-docs
authority: official
relevance: high
topic: unsafe
stinger: rust-stinger
---

# Unsafe Rust

## Summary
The Rust Book defines the five operations requiring `unsafe`, stresses that unsafe code transfers proof obligations to the programmer, and recommends keeping unsafe blocks small behind safe abstractions. This supports a default `forbid(unsafe_code)` posture with narrowly reviewed exceptions.

## Key quotations / statistics
- "Keep `unsafe` blocks small"
- "wrapping unsafe code in a safe function is a common abstraction"

## Version/date caveat
The current Book uses the Rust 2024 edition. Low-level memory-model details must be checked against the Reference/Nomicon, not inferred from examples.

## Annotations for stinger-forge
- Grounds unsafe inventory, documented invariants, and targeted tests.
- Note that the old Unsafe Code Guidelines reference describes itself as largely abandoned.

