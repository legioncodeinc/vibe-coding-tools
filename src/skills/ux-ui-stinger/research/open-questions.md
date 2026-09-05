# Open questions

Questions the user may want to resolve; none block the Stinger's initial usefulness.

1. **Token drift scanner** — the Command Brief asks whether to bundle a `scripts/` scanner that walks the codebase for hex literals and inline utility re-implementations. Not built in this forge pass; noted in `guides/10-common-violations.md` as a future enhancement.
2. **UI-adjacent libraries** — TanStack Query and React Hook Form are currently treated as `react-worker-bee` territory. Confirm.
3. **Multi-product repos** — when a monorepo houses multiple products, each with its own design-system folder, does the Angel expect a `<product>` argument at invocation time, or does it infer from the file being reviewed? The current guides assume the invoking user / agent names the folder path.
4. **Mantine's future** — Mantine 8 is rumored. When it ships, revisit `guides/05-mantine-integration.md` and `research/library-versions.md`.
