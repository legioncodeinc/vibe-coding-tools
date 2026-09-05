---
name: "electron-dissection-stinger"
description: "Dissect and reverse engineer Electron desktop apps: locate resources/app.asar, read archive metadata, unpack with @electron/asar, decode bundled/minified JavaScript with webcrack, and attach live inspectors over the Chrome DevTools Protocol. Use when asked to unpack app.asar, reverse engineer / dissect / audit an Electron app, find what code a desktop app runs, recover app logic from a bundle, attach devtools via remote debugging, or harden your own Electron app against exactly this."
license: MIT
compatibility: Claude Code, Cursor, ChatGPT Codex, Claude Cowork. Scripts run on Node >= 22 (verified on 25.2.1); webcrack itself requires Node 22/24 per its docs — on Node 25 fall back to prettier (see guides/decode-bundles.md). Verified against a real Electron install (ZCode Desktop, Windows 11) on 2026-09-04.
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, WebFetch, WebSearch
metadata:
  hive-tier: worker
  paired-bee: none
  research-window: 2026-09-04 (one-day grounded verification pass)
  verified-against: ZCode Desktop 2026-09 build, C:\Program Files\ZCode\resources\app.asar (292.9 MB, 27,293 files)
---

# Electron Dissection Stinger

You are holding the scalpel for Electron desktop apps. An Electron install ships its entire JavaScript application to every user's disk in plain form: the executable is stock Chromium + Node, and the app's actual code lives in `resources/app.asar` next to it. ASAR is a container, not encryption — a Pickle-prefixed JSON index followed by concatenated file blobs. Dissection is therefore mostly logistics: find the archive, read its index, unpack, decode the bundler output, and confirm findings against the live process.

Every command in this skill was executed against a real install (ZCode Desktop) during forging; the worked example carries the real numbers. Do not drift from verified facts — if a target app deviates from the patterns here, investigate before asserting.

## Authorization gate

Only dissect software you own, built, or are authorized to assess (your own product, a security engagement, malware triage, incident response, interoperability work). Never redistribute extracted proprietary code or ship extracted third-party logic in your own product. If the request is "clone this app for me to ship," stop and say why not.

## When to use this skill

- Locating the Electron resources directory for any installed app (Windows/macOS/Linux)
- Reading asar metadata or listing contents without a full extraction
- Unpacking `app.asar`, including single-file extraction and repacking
- Decoding minified/bundled JavaScript (webpack, Vite, browserify) back to readable modules with webcrack
- Attaching a debugger or evaluator to the running renderer or main process over CDP
- Intercepting an Electron app's network traffic
- The defensive mirror: judging how much a given Electron app's logic is exposed, or hardening your own

Do not use this skill for generic JavaScript beautification questions, web app pentesting, or native binary RE beyond the escalation pointers (Ghidra/IDA are named, not taught).

## The dissection pipeline

Five stages, in order. Each stage's output decides whether the next is needed — reading the archive index alone often answers "what does this app do."

1. **Locate.** Find the executable, then its `resources/` sibling. Running processes reveal their own path. See [guides/locate-and-unpack.md](guides/locate-and-unpack.md) for the per-OS location table.
2. **Index.** Read the asar header — entry point (`package.json` → `main`), top-level structure, file count — with zero dependencies. Frequently the whole question is answered here.
3. **Unpack.** `npx -y @electron/asar extract`, or `extract-file` for one file. Check the sibling `app.asar.unpacked/` for native modules.
4. **Decode.** Entry files are bundler output: minified, chunked. Look for sourcemaps first (full recovery), then run webcrack on the main entry. Escalate to V8-bytecode and native-module paths only if `.jsc` / `.node` files appear. See [guides/decode-bundles.md](guides/decode-bundles.md).
5. **Verify live.** Static analysis lies less when checked at runtime: attach CDP to the renderer, `--inspect` the main process, or proxy the network. See [guides/runtime-inspection.md](guides/runtime-inspection.md).

## Ground rules

- Always copy the asar to a scratch directory before unpacking or repacking. Never mutate a live install.
- On Windows, `npx @electron/asar list` prints backslash paths; on macOS/Linux, forward slashes. Grep accordingly.
- A running Electron app is usually a process tree (main + renderers + GPU). `--remote-debugging-port` on a second launch only works with a fresh `--user-data-dir`, otherwise the flag is inherited away and ignored.
- Hardened apps flip Electron fuses (`EnableNodeCliInspectArguments`, `EnableEmbeddedAsarIntegrityValidation`) that kill the debugger switches and reject modified asars. The empirical test is fastest: try the flag, curl the port, observe.

## File map

Load these on demand; do not read everything up front.

| Path | Load when |
|---|---|
| `guides/locate-and-unpack.md` | Stages 1–3: per-OS install locations, asar format, extract/repack commands, worked ZCode example |
| `guides/decode-bundles.md` | Stage 4: sourcemaps, bundler identification, webcrack usage and examples, bytenode/native escalation |
| `guides/runtime-inspection.md` | Stage 5: CDP attach, cdp-eval usage, main-process inspection, logging, network proxying, fuse awareness |
| `scripts/asar-header.mjs` | Zero-dependency asar metadata reader (summary / list / single-entry) |
| `scripts/unpack-electron-app.sh` | End-to-end: resolve install → summarize → extract → webcrack the entry |
| `scripts/cdp-eval.mjs` | Evaluate an expression in a live renderer over CDP (Node ≥ 22 global WebSocket) |

## Quality bar

A dissection is done when: the entry point and its process role are named from the archive index or `package.json` (`main` field), decoded source is grounded in at least one artifact on disk (an extracted file, a webcrack output directory, or a CDP observation), every claim about the app's behavior traces to something you actually read or observed rather than an inference from the file list, and findings are reported with paths so the user can reproduce.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [security-stinger](../security-stinger) - Security audit pass; use when dissection is the first half of a security review of your own app.
  - [quality-stinger](../quality-stinger) - Quality assurance pass; use to verify reported findings against the artifacts on disk.
  - [typescript-node-stinger](../typescript-node-stinger) - The extracted code is usually bundled TypeScript/Node; consult for reading and reasoning about it.
