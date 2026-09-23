#!/usr/bin/env bash
# audit-dockerfile.sh — static checks for Dockerfile hygiene.
# Source: guides/01-dockerfile-patterns.md, guides/00-principles.md.
#
# Usage:
#   bash scripts/audit-dockerfile.sh [path/to/Dockerfile]
#   bash scripts/audit-dockerfile.sh        # defaults to ./Dockerfile
#
# Exits 0 on clean, 1 on must-fix findings, 2 on internal error.
# Output is human-readable; pipe to `tee` for logging.

set -euo pipefail

DOCKERFILE="${1:-Dockerfile}"
EXIT_CODE=0
FINDINGS=0

if [ ! -f "$DOCKERFILE" ]; then
  echo "ERROR: Dockerfile not found at $DOCKERFILE" >&2
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

echo "Auditing $DOCKERFILE..."
echo

# 1. :latest tag in FROM
if grep -nE '^FROM .*:latest( |$)' "$DOCKERFILE" >/dev/null; then
  while IFS= read -r line; do
    report_must_fix "FROM uses :latest tag — pin to minor+patch (e.g., node:20.18.1-alpine3.20). Line: $line"
  done < <(grep -nE '^FROM .*:latest( |$)' "$DOCKERFILE")
fi

# 2. FROM without any tag
if grep -nE '^FROM [a-zA-Z0-9._/-]+( AS |$)' "$DOCKERFILE" | grep -vE ':[a-zA-Z0-9._-]+' >/dev/null 2>&1; then
  while IFS= read -r line; do
    report_must_fix "FROM has no tag (implicit :latest). Line: $line"
  done < <(grep -nE '^FROM [a-zA-Z0-9._/-]+( AS |$)' "$DOCKERFILE" | grep -vE ':[a-zA-Z0-9._-]+' || true)
fi

# 3. ARG used to pass secret-like values
if grep -niE '^ARG.*(SECRET|TOKEN|PASSWORD|KEY|CREDENTIAL)' "$DOCKERFILE" >/dev/null; then
  while IFS= read -r line; do
    report_must_fix "ARG appears to carry a secret. Use BuildKit --mount=type=secret. Line: $line"
  done < <(grep -niE '^ARG.*(SECRET|TOKEN|PASSWORD|KEY|CREDENTIAL)' "$DOCKERFILE")
fi

# 4. ENV with secret-looking value
if grep -niE '^ENV.*(SECRET|TOKEN|PASSWORD|KEY|CREDENTIAL).*=.*[^_]' "$DOCKERFILE" >/dev/null; then
  while IFS= read -r line; do
    report_must_fix "ENV appears to bake a secret into the image. Inject at runtime instead. Line: $line"
  done < <(grep -niE '^ENV.*(SECRET|TOKEN|PASSWORD|KEY|CREDENTIAL).*=.*[^_]' "$DOCKERFILE")
fi

# 5. No USER directive (or USER root) in final stage
LAST_USER=$(grep -nE '^USER ' "$DOCKERFILE" | tail -1 || true)
if [ -z "$LAST_USER" ]; then
  report_must_fix "No USER directive — container will run as root."
elif echo "$LAST_USER" | grep -E 'USER\s+(root|0)\b' >/dev/null; then
  report_must_fix "Final USER is root — switch to a non-root user (e.g., USER node). Line: $LAST_USER"
fi

# 6. No HEALTHCHECK
if ! grep -nE '^HEALTHCHECK ' "$DOCKERFILE" >/dev/null; then
  report_should_refactor "No HEALTHCHECK directive — orchestrators cannot make readiness decisions."
fi

# 7. Single stage (no FROM ... AS ...)
STAGE_COUNT=$(grep -cE '^FROM .* AS ' "$DOCKERFILE" || true)
if [ "$STAGE_COUNT" -eq 0 ]; then
  report_should_refactor "Single-stage build — multi-stage typically reduces size 60-80%."
fi

# 8. RUN install without --mount=type=cache
if grep -nE '^RUN .*(npm (ci|install)|pnpm (install|fetch)|yarn install)' "$DOCKERFILE" | grep -v 'mount=type=cache' >/dev/null; then
  while IFS= read -r line; do
    report_should_refactor "Package install without BuildKit cache mount. Add --mount=type=cache. Line: $line"
  done < <(grep -nE '^RUN .*(npm (ci|install)|pnpm (install|fetch)|yarn install)' "$DOCKERFILE" | grep -v 'mount=type=cache' || true)
fi

# 9. COPY . . before COPY package.json (cache-unfriendly ordering)
if grep -nE '^COPY \. \.' "$DOCKERFILE" >/dev/null; then
  COPY_DOT_LINE=$(grep -nE '^COPY \. \.' "$DOCKERFILE" | head -1 | cut -d: -f1)
  COPY_PKG_LINE=$(grep -nE '^COPY .*package\.json' "$DOCKERFILE" | head -1 | cut -d: -f1 || echo "0")
  if [ "$COPY_DOT_LINE" -lt "${COPY_PKG_LINE:-99999}" ] || [ "${COPY_PKG_LINE:-0}" -eq 0 ]; then
    report_should_refactor "COPY . . before COPY package.json — every source change re-installs deps."
  fi
fi

# 10. .dockerignore presence
DOCKERFILE_DIR=$(dirname "$DOCKERFILE")
if [ ! -f "$DOCKERFILE_DIR/.dockerignore" ]; then
  report_should_refactor "No .dockerignore in $DOCKERFILE_DIR — node_modules, .git, secrets may ship into context."
fi

echo
if [ "$FINDINGS" -eq 0 ]; then
  echo "Audit clean. ($DOCKERFILE)"
else
  echo "Audit findings: $FINDINGS"
  if [ "$EXIT_CODE" -ne 0 ]; then
    echo "MUST-FIX issues present — exit 1."
  fi
fi

exit $EXIT_CODE
