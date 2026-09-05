# Stage 5: Runtime inspection

Static decode tells you what the code says. Runtime inspection tells you what it *does*, with live values. Prefer CDP (Chrome DevTools Protocol) — it needs no changes to the app.

## The fresh-instance rule **[verified constraint]**

ZCode Desktop was running (5+ processes) while this skill was forged, which is the normal case. Electron's `--remote-debugging-port` only takes effect on a process that actually reads it — a second launch joins the existing instance's process tree and the flag evaporates. **Always pass a throwaway `--user-data-dir`** to force a genuinely separate instance:

```bash
"C:/Program Files/ZCode/ZCode.exe" --remote-debugging-port=9222 --user-data-dir="$TEMP/zcode-re-debug"
```

A second instance with its own profile may re-run onboarding/log-in flows. That is the cost of a clean attach.

## Renderer: attach and evaluate

**1. Confirm the port is live:**

```bash
curl -s http://127.0.0.1:9222/json/version   # browser metadata, proves CDP is up
curl -s http://127.0.0.1:9222/json/list      # every debuggable target (windows, webviews, iframes)
```

Each target in `/json/list` carries a `webSocketDebuggerUrl` and a `title`. Identify the main window by title, note its `id`.

**2. Full DevTools UI:** open Chrome (or Edge), visit `chrome://inspect` → *Configure…* → add `127.0.0.1:9222` → *inspect* on the target. You get the complete DevTools: Sources with breakpoints, Console, Network, Performance.

**3. Scripted evaluation** (headless, CI-friendly): use [scripts/cdp-eval.mjs](../scripts/cdp-eval.mjs) — no dependencies, Node ≥ 22 global fetch/WebSocket:

```bash
node scripts/cdp-eval.mjs 9222 --list
node scripts/cdp-eval.mjs 9222 "location.href"
node scripts/cdp-eval.mjs 9222 "JSON.stringify(window.__APP_STATE__ ?? Object.keys(window)).slice(0,500)" --target "main"
```

## Main process: the Node inspector

The Electron main process is a Node program, so Node's inspector applies:

```bash
"C:/Program Files/ZCode/ZCode.exe" --inspect=9229 --user-data-dir="$TEMP/zcode-re-debug"
# or --inspect-brk=9229 to freeze before any app code runs (best for watching startup)
```

Attach the same way (`chrome://inspect` → *Node* devices section), or connect VS Code's JavaScript debugger to `127.0.0.1:9229`. Caveat: apps that flip the `EnableNodeCliInspectArguments` fuse ignore these switches silently — no error, just no port. Empirical test beats spec-reading: launch, `curl 127.0.0.1:9229/json/version`, observe.

In-app DevTools shortcut (`Ctrl+Shift+I` / `Cmd+Opt+I`) works on most apps unless explicitly blocked — always try it first, it is the zero-setup path.

## Logs

```bash
ELECTRON_ENABLE_LOGGING=1 "C:/Program Files/ZCode/ZCode.exe" ...
# Chromium + console.log output streams to stderr
```

## Network

Electron honors Chromium's proxy switch, which makes interception trivial:

```bash
mitmproxy --listen-port 8080
"C:/Program Files/ZCode/ZCode.exe" --proxy-server=127.0.0.1:8080 --user-data-dir="$TEMP/zcode-re-debug"
```

HTTPS interception needs mitmproxy's CA installed into the OS trust store (`http://mitm.it` from any browser while the proxy is active). Pinning is rare in Electron apps because Chromium handles TLS, but a client that embeds its own certificate list defeats this — fall back to reading endpoints from decoded source and confirming them with `curl`.

## Reading the results

- Values returned from CDP evaluation are the ground truth; prefer them over inferences from minified code.
- `ipcRenderer` channels observed at runtime should be matched against `ipcMain.handle` registrations found in the decoded main process — that pairing maps the app's full internal API surface.
- Anything you can change at runtime (feature flags in `localStorage`, `window` globals) can be changed permanently in the unpacked asar of your own app — but on someone else's app, that is modification, and a different authorization question entirely.

## Hardening mirror (defensive use)

Everything above exists because Electron trusts the user's machine. If you ship an Electron app, assume all of it works against you: no secrets in the client, license logic on the server, sourcemaps stripped from prod artifacts, and Electron fuses (`@electron/fuses`) flipped for `EnableNodeCliInspectArguments` and `EnableEmbeddedAsarIntegrityValidation` if you want to raise the bar from minutes to hours. Raising the bar is all fuses do — they do not create secrecy.
