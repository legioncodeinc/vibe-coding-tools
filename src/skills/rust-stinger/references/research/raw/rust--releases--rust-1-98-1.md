# Announcing Rust 1.98.1
- URL: https://blog.rust-lang.org/2026/09/03/Rust-1.98.1/
- Fetched: 2026-09-03
- Source type: official-docs

## Captured source material

- Published: 2026-09-03
- Release tag: `1.98.1` at `18ed059b1465ce6195154de3250a668f1dd3b1fa`
- Release field: fixes a vtable-generation miscompilation in Rust 1.98.0
- Failure field: a trait-object vtable could contain a null pointer in place of a function pointer, leading to undefined behavior
- Update command:

```text
rustup update stable
```

## Archived facts

- The Rust Release Team published Rust 1.98.1 on 2026-09-03.
- This point release fixes a vtable-generation miscompilation introduced in Rust 1.98.0.
- The faulty compiler could place a null pointer where a function pointer belonged in a trait-object vtable, producing undefined behavior in emitted code.
- The supported rustup update command is `rustup update stable`.

## Stinger relevance

Treat 1.98.1, not 1.98.0, as the current stable snapshot on the fetch date. A project that adopted 1.98.0 should prioritize compiler replacement and rebuild affected artifacts rather than treating this as an optional feature update.

## Refresh caveat

This is a point-in-time release note. Check the official release index again at the decision point.
