# 07 - Build CLI and TUI surfaces

## Purpose

Build operable, scriptable, redacted operator clients without creating a second control authority. This guide covers Command Brief action 8.

## CLI contract

- Model commands and constrained arguments with Clap typed parsers and subcommands ([research](../research/cli-tui/2026-07-24-clap-parser.md)).
- Test parsing with non-exiting APIs; decide printing and process exit only at the binary boundary.
- Keep human help/errors separate from stable JSON/stdout schemas. Clap exposes rendering and exit information, but human formatting is not a machine protocol ([research](../research/cli-tui/2026-07-24-clap-errors.md)).
- Define a domain exit-code taxonomy for operational failures.
- Require a reviewed confirmation or explicit noninteractive policy for destructive or billable commands; keep them disabled if absent.
- Make diagnostics/support exports previewable, double-redacted, and free of prompt bodies, code, raw credentials, headers, and unsalted account identifiers.

## Optional TUI contract

- Keep the TUI feature-gated and thin over the same authenticated control client as the CLI.
- Prefer the main Ratatui crate unless a lower-level crate is specifically required; upstream recommends this for ordinary applications ([research](../research/cli-tui/2026-07-24-ratatui-architecture.md)).
- Use Ratatui's managed `run` lifecycle or explicitly handle fallible init/restore so success, error, panic, and cancellation restore the terminal ([research](../research/cli-tui/2026-07-24-ratatui-lifecycle.md)).
- Unit-test widgets against buffers and integration-test the whole UI with `TestBackend` ([research](../research/cli-tui/2026-07-24-ratatui-test-backend.md)).
- Add narrow platform/real-terminal smoke tests only where the supported matrix requires them.

## Open decision checkpoint

> TODO: human decision before implementation - whether the TUI is in the first executable milestone remains unresolved.

## Worked examples

See [happy-path bounded service](../examples/01-happy-path-bounded-service-slice.md) and [release evidence with closed gates](../examples/04-release-evidence-with-closed-gates.md).
