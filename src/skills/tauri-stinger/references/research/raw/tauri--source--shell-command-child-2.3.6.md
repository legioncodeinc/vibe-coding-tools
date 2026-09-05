# Shell 2.3.6 CommandChild Source
- URL: https://raw.githubusercontent.com/tauri-apps/plugins-workspace/shell-v2.3.6/plugins/shell/src/process/mod.rs
- Fetched: 2026-09-04
- Research cutoff: 2026-09-03
- Source type: official-docs
- Material: immutable package-tag source

## Captured source material

```rust
pub fn write(&mut self, buf: &[u8]) -> crate::Result<()>
pub fn kill(self) -> crate::Result<()>

fn read_line(...) {
    let mut buf = Vec::new();
    tauri::utils::io::read_line(&mut reader, &mut buf)
}
```

## Archived evidence

`CommandChild::write` takes a mutable reference and writes the entire byte slice to child stdin. `CommandChild::kill` takes ownership of the handle and sends a kill signal through the shared child object.

The default non-raw output path creates a new `Vec` and reads a complete line before it emits `CommandEvent::Stdout` or `CommandEvent::Stderr`. A consumer-side length check after the event arrives can bound retained and IPC-forwarded data, but it cannot bound the shell reader's allocation for a child that never emits a newline. The source also has a raw-output path built on `BufReader::fill_buf`; an application using it must implement its own bounded framing.

## Archive interpretation

A lifecycle wrapper that might kill along more than one branch should store the handle in `Option<CommandChild>` and consume it at most once. Dropping the only control handle without an explicit lifecycle decision makes cancellation and cleanup unclear. A trustworthy NDJSON producer must enforce its own maximum line size, or the host must use a bounded raw reader rather than claim a post-read event check limits allocation.
