---
source_url: https://docs.rs/clap/latest/clap/parser/index.html
retrieved_on: 2026-07-24
source_type: official-docs
authority: official
relevance: high
topic: clap
stinger: rust-stinger
---

# Clap typed command-line parsing

## Summary
Clap 4.6.2 provides `Parser`, `Subcommand`, `Args`, `CommandFactory`, and `ValueEnum` traits for typed command structures and introspection. These types support explicit command inventories, constrained values, generated help/completions, and parser tests independent of process execution.

## Key quotations / statistics
- `ValueEnum`: "Parse arguments into enums."
- `CommandFactory`: "Create a `Command` relevant for a user-defined container."

## Version/date caveat
Clap 4.6.2 at retrieval; help text and formatting can change across minor releases.

## Annotations for stinger-forge
- Supports typed subcommands and deterministic parser contract tests.
- Machine-readable command output is an application schema layered above Clap.

