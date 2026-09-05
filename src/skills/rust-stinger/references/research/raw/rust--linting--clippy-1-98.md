# Clippy changelog for Rust 1.98
- URL: https://raw.githubusercontent.com/rust-lang/rust-clippy/master/CHANGELOG.md
- Fetched: 2026-09-03
- Source type: official-docs

## Captured source material

- Moving-source snapshot: `master` changelog at file commit `a184fd6db865e41fb9f08ddf4205f992d67a93ef`, fetched 2026-09-03
- Release tag commit: `rust-1.98.0` at `64c7431d6cd823d1a7663165c7e59d78e6dc726a`
- Release field: `Rust 1.98`, released `2026-08-20`
- New lint fields: `unnecessary_unwrap_unchecked`, `chunks_exact_to_as_chunks`, `by_ref_peekable_peek`, `with_capacity_zero`, `manual_isolate_lowest_one`, `for_unbounded_range`, `unused_async_trait_impl`
- Change fields: `empty_enums` moved to `nursery`; `from_iter_instead_of_collect` deprecated; `result_large_err` and `result_unit_err` fixed for async functions

## Archived facts

- The current upstream changelog contains the completed Rust 1.98 section, while the fetched `rust-1.98.0` tag copy lagged behind it.
- New 1.98 lints include checks for unchecked unwrap use, zero capacity, unbounded ranges, manual lowest-bit isolation, and unused async trait implementations.
- `result_large_err` and `result_unit_err` now cover async functions.
- The release includes multiple false-positive and internal-compiler-error fixes.
- `from_iter_instead_of_collect` is deprecated and `empty_enums` moved lint groups.

## Stinger relevance

Run Clippy on the target compiler before upgrading a warnings-as-errors project. Record the exact toolchain because new lints and lint-group changes can turn a compiler upgrade into a CI failure without a runtime behavior change.

## Source caveat

This is a moving branch snapshot, not an immutable tag. The tag discrepancy is part of the evidence and should not be hidden.
