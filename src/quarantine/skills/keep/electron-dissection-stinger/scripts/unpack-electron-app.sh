#!/usr/bin/env bash
# End-to-end Electron app dissection: resolve install -> summarize -> extract -> webcrack the entry.
#
# Usage:
#   ./unpack-electron-app.sh <path> [outdir]
#
# <path> accepts any of: an .asar file, an install directory containing resources/,
# a macOS .app bundle, or a Windows install root containing the exe.
# [outdir] defaults to ./dissected/<basename>. Scratch only — never repack over a live install.
set -euo pipefail

die() { echo "error: $*" >&2; exit 1; }
need() { command -v "$1" >/dev/null 2>&1 || die "missing dependency: $1"; }

# Paths embedded inside `node -e` code strings are NOT auto-translated by Git Bash
# (unlike standalone arguments), so convert explicitly. cygpath -m yields C:/...
# which is safe inside JS string literals; on macOS/Linux cygpath is absent and
# the native path passes through.
winpath() { cygpath -m "$1" 2>/dev/null || printf '%s' "$1"; }

need node
need npx

SRC="${1:?usage: unpack-electron-app.sh <asar|install-dir|.app> [outdir]}"
OUT="${2:-$(pwd)/dissected/$(basename "${SRC%%.asar}" | tr ' ' '_')}"

# Resolve the asar from whatever form the input takes.
if [[ -f "$SRC" && "$SRC" == *.asar ]]; then
  ASAR="$SRC"
elif [[ -d "$SRC" ]]; then
  # macOS .app bundles keep resources inside Contents/Resources
  if [[ -d "$SRC/Contents/Resources" ]]; then SRC="$SRC/Contents/Resources"; fi
  if   [[ -f "$SRC/resources/app.asar" ]]; then ASAR="$SRC/resources/app.asar"
  elif [[ -f "$SRC/app.asar" ]];          then ASAR="$SRC/app.asar"
  elif [[ -d "$SRC/resources/app" || -d "$SRC/app" ]]; then
    echo "no app.asar — this is an unpackaged app; source is plain files under: $SRC"
    exit 0
  else
    die "no app.asar under $SRC (looked in resources/)"
  fi
else
  die "not a file or directory: $SRC"
fi

echo "==> archive: $ASAR"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
node "$SCRIPT_DIR/asar-header.mjs" "$ASAR"

mkdir -p "$OUT"
echo "==> extracting to $OUT/app"
npx -y @electron/asar extract "$ASAR" "$OUT/app"

echo "==> unpacked native modules live in: $(dirname "$ASAR")/app.asar.unpacked (if present)"

# Hand the entry point to webcrack when it exists. "main" may be a file or a
# directory (webpack style: ".webpack/main" -> ".webpack/main/index.js").
ENTRY="$(node -e "try{console.log(JSON.parse(require('fs').readFileSync('$(winpath "$OUT/app/package.json")','utf8')).main||'')}catch{''}")"
if [[ -n "$ENTRY" && -d "$OUT/app/$ENTRY" && -f "$OUT/app/$ENTRY/index.js" ]]; then
  ENTRY="$ENTRY/index.js"
fi
if [[ -n "$ENTRY" && -f "$OUT/app/$ENTRY" ]]; then
  echo "==> deobfuscating entry: out/$ENTRY via webcrack (Node >= 22 recommended)"
  npx -y webcrack "$(winpath "$OUT/app/$ENTRY")" -o "$(winpath "$OUT/webcracked")" \
    || echo "webcrack failed — run it under Node 22/24 (see guides/decode-bundles.md), or beautify directly: npx -y prettier --no-config --parser babel <entry> > entry.pretty.js"
  echo "==> done. readable modules: $OUT/webcracked/"
else
  echo "==> no bundler entry found in package.json — inspect $OUT/app manually"
fi
