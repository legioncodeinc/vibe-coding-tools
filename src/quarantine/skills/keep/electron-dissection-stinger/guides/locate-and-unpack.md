# Stage 1–3: Locate and unpack the archive

Grounded against ZCode Desktop on Windows 11 (2026-09-04). Real numbers from that run are marked **[verified]**.

## 1. Locate the install

The app's code always sits next to the executable, under a `resources/` directory. Find the executable first.

**From a running process (most reliable):**

```powershell
# PowerShell
(Get-Process -Name ZCode | Select-Object -First 1).Path
# → C:\Program Files\ZCode\ZCode.exe   [verified]
```

```bash
# Git Bash / wmic (deprecated but everywhere)
wmic process where "name='ZCode.exe'" get ExecutablePath
```

**Standard locations, per OS:**

| Install type | resources/ path |
|---|---|
| Windows per-user (NSIS) | `C:\Users\<user>\AppData\Local\Programs\<AppName>\resources\` |
| Windows all-users (MSI) | `C:\Program Files\<AppName>\resources\` ← ZCode lives here **[verified]** |
| Windows Squirrel | `C:\Users\<user>\AppData\Local\<AppName>\app-<version>\resources\` |
| Windows Store (MSIX) | `C:\Program Files\WindowsApps\<pkg>\...` (ACL-restricted; copy needs admin) |
| macOS | `/Applications/<App>.app/Contents/Resources/app.asar` |
| Linux deb/rpm | `/usr/lib/<app>/resources/` or `/opt/<App>/resources/` |
| Linux snap | read-only squashfs — copy the whole install out first |
| Linux flatpak | `/var/lib/flatpak/app/<id>/current/active/files/<app>/resources/` |

**What you expect to find in `resources/`:** **[verified for ZCode]**

```
app.asar            ← the app: JSON index + every JS/HTML/CSS blob
app.asar.unpacked/  ← native modules excluded from the archive (plain files — read directly)
app-update.yml      ← update channel config (often reveals the update server)
```

Also possible: `resources/app/` as a plain folder instead of an asar (unpackaged/dev builds — the whole source is right there, no unpacking needed), multiple `.asar` files, or `default_app.asar` (stock Electron placeholder — means you are looking at a dev install, not a packaged app).

## 2. Index the archive before unpacking

ASAR layout: bytes 0–3 hold `4` (size-pickle payload), bytes 4–7 the header pickle length, bytes 12–15 the JSON string length, and the JSON index starts at byte 16. The index maps every path to `{size, offset, integrity}` — file blobs begin at `8 + readUInt32LE(4)`, and each entry's `offset` is relative to that base. Blobs are concatenated and uncompressed.

Zero-dependency read (the offsets are verified against a real archive):

```bash
node -e "
const fs=require('fs');
const b=fs.readFileSync(process.argv[1]);
const len=b.readUInt32LE(12);
const h=JSON.parse(b.slice(16,16+len).toString('utf8'));
console.log(Object.keys(h.files).join(', '));
" "C:/Program Files/ZCode/resources/app.asar"
# → node_modules, out, package.json   [verified]
```

Or use the bundled tool: [scripts/asar-header.mjs](../scripts/asar-header.mjs) (summary, full `--list`, or a single path's entry).

**Worked example — ZCode Desktop** **[verified]**

```
archive:  C:\Program Files\ZCode\resources\app.asar
size:     292.9 MB, 27,293 files
top level: node_modules/  out/  package.json
entry:    package.json → "main": "out/main/index.js", "type": "module" (ESM)
out/:     out/main/   Electron main process (index.js + chunk-*.js, minified)
          out/host/   host chunks
          out/preload/, out/renderer/ (typical electron-vite layout)
unpacked: resources\app.asar.unpacked\node_modules  (native .node addons)
```

That index alone established the process layout: `out/main/index.js` is the main-process entry, the `chunk-*.js` files are bundler chunks, and the renderer is elsewhere under `out/`. No extraction was needed to know that.

## 3. Unpack

The maintained tool is `@electron/asar` (the bare `asar` npm package is its deprecated alias; both still resolve).

```bash
# Full extraction
npx -y @electron/asar extract "C:/Program Files/ZCode/resources/app.asar" ./dissected/zcode

# Just list (30,417 lines for ZCode incl. directories) [verified]
npx -y @electron/asar list "C:/Program Files/ZCode/resources/app.asar"

# Single file into the current directory — cheapest way to read package.json
cd /tmp && npx -y @electron/asar extract-file "C:/Program Files/ZCode/resources/app.asar" package.json  [verified]
```

Notes that save time:

- **[verified]** On Windows, `asar list` emits backslash-prefixed paths (`\out\main\index.js`). Grep for `'^\\\\out'` in Git Bash, not `'^\out'`.
- 7-Zip 24.05+ opens `.asar` natively for browsing in Explorer.
- Extracted native modules referenced from the archive live in the sibling `app.asar.unpacked/`, not inside the asar.

**Repacking** (for authorized modification testing on your own app):

```bash
npx -y @electron/asar pack ./dissected/zcode app.asar
```

Hardened apps will refuse a repacked archive: signed apps fail code-signature validation, and apps with the `EnableEmbeddedAsarIntegrityValidation` fuse compare the asar hash embedded in the binary at launch. Repack success is therefore itself a finding: the app is not hardened. Work on copies; never repack over the live install.

## Known unknowns

- MSIX/Store installs: extraction path is per-package and ACL-gated; copy via an elevated shell and expect Windows File Protection friction.
- Snap installs: the squashfs is read-only, so extraction works but any modification testing requires a rebuilt snap.
- Some apps ship multiple asars (e.g. a second one for a bundled webview). Index each one; the `package.json` `main` field disambiguates which is the real app.
