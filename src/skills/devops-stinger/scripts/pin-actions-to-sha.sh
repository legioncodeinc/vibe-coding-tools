#!/usr/bin/env bash
# pin-actions-to-sha.sh — rewrite `uses: owner/repo@vN` to `uses: owner/repo@<SHA>` with version comment.
# Source: guides/06-actions-security.md §2.
#
# Usage:
#   bash scripts/pin-actions-to-sha.sh [.github/workflows/]
#
# Requires: gh CLI (authenticated), jq, sed.
# Reads each `uses: owner/repo@<ref>` and queries GitHub for the commit SHA of <ref>.
# Writes back: uses: owner/repo@<sha>  # <ref>
# Skips local action references (./...) and lines already pinned to a 40-char SHA.

set -euo pipefail

WORKFLOW_DIR="${1:-.github/workflows}"

if ! command -v gh >/dev/null 2>&1; then
  echo "ERROR: gh CLI required. Install: https://cli.github.com/" >&2
  exit 2
fi
if ! command -v jq >/dev/null 2>&1; then
  echo "ERROR: jq required." >&2
  exit 2
fi

if [ ! -d "$WORKFLOW_DIR" ]; then
  echo "ERROR: workflow directory not found: $WORKFLOW_DIR" >&2
  exit 2
fi

resolve_sha() {
  local repo="$1"
  local ref="$2"
  # First try as a tag, then as a branch.
  local sha
  sha=$(gh api "repos/$repo/git/refs/tags/$ref" --jq '.object.sha' 2>/dev/null || true)
  if [ -z "$sha" ]; then
    sha=$(gh api "repos/$repo/git/refs/heads/$ref" --jq '.object.sha' 2>/dev/null || true)
  fi
  if [ -z "$sha" ]; then
    sha=$(gh api "repos/$repo/commits/$ref" --jq '.sha' 2>/dev/null || true)
  fi
  echo "$sha"
}

shopt -s nullglob
for wf in "$WORKFLOW_DIR"/*.yml "$WORKFLOW_DIR"/*.yaml; do
  echo "Processing $wf..."
  TMPFILE=$(mktemp)
  while IFS= read -r line || [ -n "$line" ]; do
    if echo "$line" | grep -qE 'uses:\s*[a-zA-Z0-9._/-]+@'; then
      ref=$(echo "$line" | sed -nE 's/.*@([A-Za-z0-9._-]+).*/\1/p')
      repo=$(echo "$line" | sed -nE 's/.*uses:\s*([a-zA-Z0-9._/-]+)@.*/\1/p')
      # Skip local refs and already-SHA refs.
      if echo "$line" | grep -qE 'uses:\s*\./'; then
        echo "$line" >> "$TMPFILE"
        continue
      fi
      if echo "$ref" | grep -qE '^[a-f0-9]{40}$'; then
        echo "$line" >> "$TMPFILE"
        continue
      fi
      sha=$(resolve_sha "$repo" "$ref")
      if [ -z "$sha" ]; then
        echo "  WARN: could not resolve $repo@$ref — leaving as-is." >&2
        echo "$line" >> "$TMPFILE"
        continue
      fi
      # Replace @<ref> with @<sha>  # <ref>
      newline=$(echo "$line" | sed -E "s|@${ref}([^A-Za-z0-9._-])|@${sha}\1# ${ref}|" | sed -E "s|@${ref}\$|@${sha}  # ${ref}|")
      echo "  $repo@$ref -> $sha"
      echo "$newline" >> "$TMPFILE"
    else
      echo "$line" >> "$TMPFILE"
    fi
  done < "$wf"
  mv "$TMPFILE" "$wf"
done

echo "Done. Review changes with 'git diff' before committing."
