# Stage 4: Decode the bundles

Everything extracted from `app.asar` under `out/` is bundler output: minified, chunked, names mangled. Recovery is layered — try the cheapest layer first, escalate only on evidence.

## Layer 0: sourcemaps (full recovery, seconds)

Bundlers emit `.map` files next to their output, and some apps accidentally ship them in production. Check before doing anything smarter:

```bash
find ./dissected/zcode -name "*.map" | head
grep -rl "sourceMappingURL" ./dissected/zcode/out --include="*.js" | head
```

If `.map` files exist, every original source file (TypeScript included) is recoverable losslessly — the map contains `sourcesContent`. This happens more often than vendors would like.

## Layer 1: identify the bundler from markers

Grep the entry file for these fingerprints to know what you are unwrapping:

| Marker | Bundler |
|---|---|
| `__webpack_require__`, `webpackChunk` | webpack (often via electron-vite, Next.js-style output) |
| `__vite`, `import.meta` + hashed chunks | Vite/Rollup |
| `System.register` | Rollup legacy / SystemJS |
| `require("./module")` + prelude function | browserify |
| no bundler, plain `import`/`export` | unbundled ESM (like ZCode's main process: `"type": "module"` with `chunk-*.js` imports) — **[verified pattern]** |

## Layer 2: webcrack

[webcrack](https://github.com/j4k0xb/webcrack) is the primary tool. It unminifies (renames mangled variables scope-safely), unpacks webpack/browserify module graphs back into individual files, and deobfuscates [obfuscator.io](https://github.com/javascript-obfuscator) output (string arrays, control-flow flattening, self-defending mode). Requires Node 22 or 24 (Node 25 also worked when this was forged).

**[verified]** CLI surface — the three forms that matter:

```bash
npm install -g webcrack        # or use npx -y webcrack

webcrack input.js              # deobfuscated result to stdout
webcrack input.js > output.js  # same, explicit
webcrack bundle.js -o outdir/  # full treatment: unpacked module files + deobfuscated entry
```

Use the `-o` form for real work: it writes each unpacked webpack module as its own file, which restores the project's module structure. When the app is unbundled ESM (ZCode's main process), the chunks are already separate files — point webcrack at the entry and let it unminify that file; chase `chunk-*.js` imports as needed rather than feeding every chunk blindly.

**Environment constraint [verified]:** webcrack's own docs cap it at Node 22/24. On a Node 25.2.1 / win32 machine, installation fails reproducibly: `prebuild-install` reports `No prebuilt binaries found (target=25.2.1 runtime=node arch=x64 platform=win32)`, falls back to node-gyp, and the source build dies in MSBuild. Fix: run webcrack under Node 22 or 24 (fnm / nvm-windows / project-local install). Without a second Node, fall back to pure-JS beautifiers, which always work:

```bash
npx -y prettier --no-config --parser babel app/out/main/index.js > entry.pretty.js
# [verified] turned a minified webpack bundle into 50,130 readable lines
```

Beautify-only loses webcrack's module unpacking and obfuscator.io deobfuscation, but string literals, control flow, and everything grep-able survive intact.

**Worked example (ZCode main process):**

```bash
mkdir -p ~/dissect/zcode && cd ~/dissect/zcode
npx -y @electron/asar extract "C:/Program Files/ZCode/resources/app.asar" app
npx -y webcrack app/out/main/index.js -o main-unpacked
```

**Reading order for a dissected app:** `package.json` (name, deps, scripts, build config — dependencies list the app's entire tech surface) → the `main` entry → the renderer's `index.html` (names every UI bundle) → webcracked chunks. String literals survive minification: grep for `https://` endpoints, IPC channel names (`ipcMain.handle("...")` in the main process), and license/telemetry strings.

## Layer 3: escalation paths (only on evidence)

| You find | It is | Path |
|---|---|---|
| `*.jsc` files | bytenode/V8-compiled source | Constants and strings remain readable (`strings file.jsc`); [view8](https://github.com/j4k0xb/view8) partially decompiles V8 bytecode. Hours, not minutes. |
| `*.node` files | native C++ addons | Ghidra/IDA territory, standard binary RE. The JS side still shows how they are called. |
| `*.wasm` | WebAssembly modules | `wasm2wat` (WABT) to inspect. |
| Repacked asar refuses to launch | asar-integrity fuse | The app is hardened; stick to read-only analysis and runtime inspection. |

## What decode proves and what it does not

Decoded source shows you the client's half of everything: IPC contracts, endpoints, feature flags, embedded config. It cannot show server-side logic, and minified client logic should never be treated as secret (see the hardening notes at the end of [runtime-inspection.md](runtime-inspection.md)). When reporting findings, quote the exact decoded file path — never paraphrase logic you did not trace.
