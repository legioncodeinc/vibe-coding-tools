#!/usr/bin/env bash
# audit-workflow.sh — static checks for GitHub Actions workflow security.
# Source: guides/06-actions-security.md.
#
# Usage:
#   bash scripts/audit-workflow.sh [.github/workflows/]
#   bash scripts/audit-workflow.sh        # defaults to .github/workflows/
#
# Exits 0 on clean, 1 on must-fix findings.

set -euo pipefail

WORKFLOW_DIR="${1:-.github/workflows}"
EXIT_CODE=0
FINDINGS=0

if [ ! -d "$WORKFLOW_DIR" ]; then
  echo "ERROR: workflow directory not found: $WORKFLOW_DIR" >&2
  exit 2
fi

report_must_fix() {
  echo "  [MUST-FIX]   $1"
  FINDINGS=$((FINDINGS+1))
  EXIT_CODE=1
}

report_should_refactor() {
  echo "  [SHOULD-REFACTOR] $1"
  FINDINGS=$((FINDINGS+1))
}

echo "Auditing workflows in $WORKFLOW_DIR..."
echo

shopt -s nullglob
WORKFLOWS=("$WORKFLOW_DIR"/*.yml "$WORKFLOW_DIR"/*.yaml)

if [ ${#WORKFLOWS[@]} -eq 0 ]; then
  echo "No workflow files found."
  exit 0
fi

for wf in "${WORKFLOWS[@]}"; do
  echo "Workflow: $wf"

  # 1. permissions: write-all
  if grep -nE 'permissions:\s*write-all' "$wf" >/dev/null; then
    report_must_fix "$wf — uses 'permissions: write-all'. Set per-job minimum permissions."
  fi

  # 2. No permissions block at all (job-level or top-level)
  if ! grep -nE '^\s*permissions:' "$wf" >/dev/null; then
    report_must_fix "$wf — no 'permissions:' block declared. Inherits repo default; declare explicit minimum."
  fi

  # 3. Actions pinned to a tag (vN, vN.N.N) instead of a 40-char SHA.
  # Match `uses: <owner>/<repo>@<ref>` where ref is not 40 hex chars.
  while IFS= read -r line; do
    # Extract @<ref>
    ref=$(echo "$line" | sed -E 's/.*@([A-Za-z0-9._-]+).*/\1/')
    # Skip local actions (./.github/...) and reusable workflow refs
    if echo "$line" | grep -qE 'uses:\s*\./'; then
      continue
    fi
    # 40-char hex = SHA
    if ! echo "$ref" | grep -qE '^[a-f0-9]{40}$'; then
      report_must_fix "$wf — action not pinned to commit SHA: $line"
    fi
  done < <(grep -nE 'uses:\s*[a-zA-Z0-9._/-]+@' "$wf" || true)

  # 4. pull_request_target with checkout of head.sha (fork code with trusted secrets)
  if grep -nE '(on:\s*\[?\s*pull_request_target|pull_request_target:)' "$wf" >/dev/null; then
    if grep -nE 'github\.event\.pull_request\.head\.(sha|ref)' "$wf" >/dev/null; then
      report_must_fix "$wf — pull_request_target with checkout of head.sha/head.ref. This runs fork code with trusted secrets. See guides/06-actions-security.md §5."
    fi
  fi

  # 5. echo $SECRET pattern (secrets in logs)
  if grep -niE 'echo\s+["$]?\$?\{?\{?\s*secrets\.' "$wf" >/dev/null; then
    report_must_fix "$wf — appears to echo a secret value. Use ::add-mask:: and avoid echoing."
  fi

  # 6. id-token: write declared but never used (over-broad)
  # (informational — not a finding)

  # 7. cancel-in-progress: true on workflow that deploys (heuristic: filename contains 'deploy' or 'release' or 'main')
  if echo "$wf" | grep -qiE '(deploy|release|main|prod)'; then
    if grep -nE 'cancel-in-progress:\s*true' "$wf" >/dev/null; then
      report_should_refactor "$wf — looks like a deploy/release workflow with cancel-in-progress: true. Mid-deploy cancellation can leave services in inconsistent state."
    fi
  fi

  # 8. Missing concurrency group on PR build (heuristic: filename contains 'pr' or 'pull')
  if echo "$wf" | grep -qiE '(pr-|pull|preview)'; then
    if ! grep -nE '^concurrency:' "$wf" >/dev/null; then
      report_should_refactor "$wf — PR-style workflow without concurrency group. Add 'concurrency: ... cancel-in-progress: true' to save Actions minutes."
    fi
  fi

  echo
done

if [ "$FINDINGS" -eq 0 ]; then
  echo "Audit clean across ${#WORKFLOWS[@]} workflow(s)."
else
  echo "Audit findings: $FINDINGS across ${#WORKFLOWS[@]} workflow(s)."
  if [ "$EXIT_CODE" -ne 0 ]; then
    echo "MUST-FIX issues present — exit 1."
  fi
fi

exit $EXIT_CODE
