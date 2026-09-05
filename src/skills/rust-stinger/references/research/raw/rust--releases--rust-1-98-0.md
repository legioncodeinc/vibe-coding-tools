# Announcing Rust 1.98.0
- URL: https://blog.rust-lang.org/2026/08/20/Rust-1.98.0/
- Fetched: 2026-09-03
- Source type: official-docs

## Captured source material

- Published: 2026-08-20
- Release tag: `1.98.0` at `1429155362e6b0a45ed6269fb3580d320ded0e6d`
- Algebraic float source fields: reordering permitted; results non-deterministic; undefined behavior not introduced
- Stabilized API fields: `core::fmt::NumBuffer`, integer `format_into`, `str::substr_range`, slice `subslice_range`, and the five floating-point `algebraic_*` methods
- Short source excerpt: "providing a stable guarantee that this code will continue to not be UB"
- Source example for the documented `ManuallyDrop<Box<_>>` interaction:

```rust
let mut x = ManuallyDrop::new(Box::new(1));
unsafe { ManuallyDrop::drop(&mut x) };
let x = x;
```

## Archived facts

- Rust 1.98.0 was published on 2026-08-20 and was superseded by 1.98.1 on 2026-09-03.
- New algebraic floating-point methods permit optimizations that may reorder operations. The resulting values can vary with compiler choices even though the methods do not introduce undefined behavior.
- Buffered integer formatting was added through `core::fmt::NumBuffer` and integer `format_into` methods.
- The release documented the fixed `ManuallyDrop<Box<T>>` interaction as a stable guarantee after the compiler behavior changed in 1.96.0.

## Stinger relevance

Use this announcement for the release highlights and API examples. Use the companion stable release-notes archive for compiler lints and compatibility details before changing a pinned toolchain.

## Refresh caveat

Do not recommend 1.98.0 as the current patch. The companion 1.98.1 source records a compiler correctness fix.
