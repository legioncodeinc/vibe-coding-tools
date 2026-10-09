name: Production Release

on:
  workflow_dispatch:
    inputs:
      release_sha:
        description: Exact 40-character main merge SHA to release.
        required: true
        type: string
      release_id:
        description: New owner-approved ID for deploy; exact recorded failed ID for recovery.
        required: true
        type: string
      release_kind:
        description: Normal release from staging, or a reviewed main-based hotfix.
        required: true
        default: normal
        type: choice
        options: [normal, hotfix]
      hotfix_sha:
        description: Exact reviewed hotfix head H; required only for hotfix releases.
        required: false
        type: string
      release_operation:
        description: Release normally, finish the same failed candidate, or resume an intact previous pair.
        required: true
        default: release
        type: choice
        options: [release, recover-candidate, recover-previous, recover-successor]
      recover_from_run:
        description: Recorded workflow run ID for failed normal-release takeover or legacy recovery.
        required: false
        type: string
      recover_from_sha:
        description: Original held release SHA for successor recovery only.
        required: false
        type: string
      recovery_controller_sha:
        description: Reviewed controller main SHA C for recovery of an existing candidate M; otherwise empty.
        required: false
        type: string
      release_confirmation:
        description: 'Exact kind/source/operation-bound acknowledgement printed by release:plan.'
        required: true
        type: string

# Concurrency audit (PRD-039 AC-2, 2026-09-29): this workflow is the single
# serialized production surface. The global group below (not keyed on ref or
# run) with cancel-in-progress: false queues every concurrent dispatch, so
# two owner sessions can never interleave production effects. Verified as
# already correct; unchanged. Cancellation would be wrong here even for a
# newer run on the same ref: recovery takeovers depend on prior runs'
# durable receipts, and cancelling an in-flight release mid-hold would
# strand production queues. Do not add cancel-in-progress to this workflow.
concurrency:
  group: production-release
  cancel-in-progress: false

permissions:
  contents: read
  actions: read
  checks: read

# These are data, never shell source. An absent approval mode disables execution.
env:
  RELEASE_RECOVERY_CONTROLLER_SHA: ${{ inputs.recovery_controller_sha }}
  RELEASE_FROZEN_RECOVERY_CONTROLLER_SHA: ${{ vars.RELEASE_FROZEN_RECOVERY_CONTROLLER_SHA }}
  RELEASE_KIND: ${{ inputs.release_kind }}
  RELEASE_HOTFIX_SHA: ${{ inputs.hotfix_sha }}
  RELEASE_OPERATION: ${{ inputs.release_operation }}
  RELEASE_RECOVER_FROM_SHA: ${{ inputs.recover_from_sha }}
  RELEASE_RECOVER_FROM_RUN: ${{ inputs.recover_from_run }}
  RELEASE_FROZEN_HOTFIX_SHA: ${{ vars.RELEASE_FROZEN_HOTFIX_SHA }}
  RELEASE_SHA: ${{ inputs.release_sha }}
  RELEASE_ID: ${{ inputs.release_id }}
  RELEASE_CONFIRMATION: ${{ inputs.release_confirmation }}
  RELEASE_WORKFLOW_SHA: ${{ github.workflow_sha }}
  RELEASE_APPROVAL_MODE: ${{ vars.RELEASE_APPROVAL_MODE }}
  RELEASE_OWNER_ACTOR_IDS: ${{ vars.RELEASE_OWNER_ACTOR_IDS }}
  RELEASE_FREEZE_STATUS: ${{ vars.RELEASE_FREEZE_STATUS }}
  RELEASE_FREEZE_SHA: ${{ vars.RELEASE_FREEZE_SHA }}
  RELEASE_FREEZE_ID: ${{ vars.RELEASE_FREEZE_ID }}
  RELEASE_FROZEN_STAGING_SHA: ${{ vars.RELEASE_FROZEN_STAGING_SHA }}

jobs:
  preflight:
    runs-on: ubuntu-24.04
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          ref: ${{ github.sha }}
          persist-credentials: false
          fetch-depth: 0
      - uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7.0.0
        with:
          node-version: 22
          cache: npm
      - run: npm ci --ignore-scripts
      - name: Read live authorization, locks, refs, environment branch restriction, and exact-M checks
        env:
          GH_TOKEN: ${{ github.token }}
          # Optional fine-grained Administration-read credential; no provider access.
          RELEASE_METADATA_TOKEN: ${{ secrets.RELEASE_METADATA_READ_TOKEN }}
        run: |
          if [ "$RELEASE_OPERATION" = release ]; then
            node scripts/release/inngest-release-runtime.mjs --preflight
          else
            node scripts/release/release-runtime.mjs --preflight
          fi

  execute:
    needs: preflight
    runs-on: ubuntu-24.04
    environment: Production
    timeout-minutes: 50
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          ref: ${{ github.sha }}
          persist-credentials: false
          fetch-depth: 0
      - uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7.0.0
        with:
          node-version: 22
          cache: npm
      - run: npm ci --ignore-scripts
      - uses: docker/setup-buildx-action@f87e5991a6d7451dcb8d9637bfbc97413f497069 # v4.4.1
        if: inputs.release_operation != 'release'
      - name: Apply reviewed production migrations (owner-dispatch)
        if: inputs.release_operation == 'release'
        env:
          DATABASE_URL: ${{ secrets.PRODUCTION_DATABASE_URL }}
        run: node scripts/release/apply-production-migrations.mjs --plan

      - name: Release Inngest production generation with durable admission handoff
        if: inputs.release_operation == 'release'
        env:
          NODE_OPTIONS: --max-old-space-size=6144
          RELEASE_EXECUTE: 'true'
          GH_TOKEN: ${{ github.token }}
          RELEASE_METADATA_TOKEN: ${{ secrets.RELEASE_METADATA_READ_TOKEN }}
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
          DATABASE_URL: ${{ secrets.PRODUCTION_DATABASE_URL }}
          REDIS_URL: ${{ secrets.PRODUCTION_REDIS_URL }}
          PRODUCTION_URL: ${{ secrets.PRODUCTION_URL }}
          RELEASE_DATABASE_TARGET_FINGERPRINT: ${{ vars.RELEASE_DATABASE_TARGET_FINGERPRINT }}
        run: node scripts/release/inngest-release-runtime.mjs --execute

      - name: Execute the exact owner-approved release with durable queue holds
        if: inputs.release_operation != 'release'
        env:
          # The same TypeScript inventory proof runs before production effects.
          NODE_OPTIONS: --max-old-space-size=4096
          RELEASE_EXECUTE: 'true'
          GH_TOKEN: ${{ github.token }}
          RELEASE_METADATA_TOKEN: ${{ secrets.RELEASE_METADATA_READ_TOKEN }}
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
          VERCEL_PROTECTION_BYPASS_SECRET: ${{ secrets.VERCEL_PROTECTION_BYPASS_SECRET }}
          ADMIN_HEALTH_CHECK_SECRET: ${{ secrets.ADMIN_HEALTH_CHECK_SECRET }}
          WORKER_HEALTH_CHECK_SECRET: ${{ secrets.WORKER_HEALTH_CHECK_SECRET }}
          DATABASE_URL: ${{ secrets.PRODUCTION_DATABASE_URL }}
          REDIS_URL: ${{ secrets.PRODUCTION_REDIS_URL }}
          PRODUCTION_URL: ${{ secrets.PRODUCTION_URL }}
          RELEASE_DATABASE_TARGET_FINGERPRINT: ${{ vars.RELEASE_DATABASE_TARGET_FINGERPRINT }}
          RELEASE_PREVIOUS_INVENTORY_JSON: ${{ vars.RELEASE_PREVIOUS_INVENTORY_JSON }}
          RELEASE_PREVIOUS_INVENTORY_SHA256: ${{ vars.RELEASE_PREVIOUS_INVENTORY_SHA256 }}
        run: node scripts/release/release-runtime.mjs --execute
      - name: Preserve value-free phase and queue recovery receipts
        if: always()
        uses: actions/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0a # v7.0.1
        with:
          name: production-release-recovery-${{ github.run_id }}-${{ github.run_attempt }}
          path: |
            ${{ runner.temp }}/reachlynk-release/inngest-release-receipt.json
            ${{ runner.temp }}/reachlynk-release/release-receipt.json
            ${{ runner.temp }}/reachlynk-release/queue-hold.json
            ${{ runner.temp }}/reachlynk-release/queue-inventory.json
          if-no-files-found: warn
          retention-days: 30

  # PRD-039 AC-3: the diagnose-fleet job and its setup-flyctl install were
  # removed here. The Fly.io GitHub App is uninstalled (owner action,
  # 2026-09-29) and the flyctl adapter is retired; fleet diagnosis had no
  # post-Fly purpose. Recover-* operations remain dispatchable but are DEAD
  # IN PRACTICE: with FLY_API_TOKEN removed from this workflow's env,
  # release-runtime.mjs's requiredExecutionConfig fails closed on the missing
  # secret before any effect, pending the owner's recover-* decommission
  # decision.
  post-deploy-smoke:
    needs: execute
    # Only the normal release path guarantees the canonical deployment serves
    # inputs.release_sha. Recovery operations may intentionally restore a
    # different (previous or successor) SHA, so the marker comparison below
    # would false-alarm; they are skipped rather than misreported.
    if: ${{ inputs.release_operation == 'release' }}
    runs-on: ubuntu-24.04
    timeout-minutes: 5
    # PRD-039 AC-6: mechanical post-deploy verification only. This job runs
    # AFTER the owner-authorized release operation completes and neither
    # gates, retries, nor reorders it. A mismatch fails this job loudly for
    # humans to act on; the release itself is already finished.
    steps:
      - name: Verify production health and release marker
        env:
          PRODUCTION_URL: ${{ secrets.PRODUCTION_URL }}
          EXPECTED_SHA: ${{ inputs.release_sha }}
          VERCEL_PROTECTION_BYPASS_SECRET: ${{ secrets.VERCEL_PROTECTION_BYPASS_SECRET }}
        run: |
          set -euo pipefail
          BYPASS_HEADER=""
          if [ -n "${VERCEL_PROTECTION_BYPASS_SECRET:-}" ]; then
            BYPASS_HEADER="-H x-vercel-protection-bypass:${VERCEL_PROTECTION_BYPASS_SECRET}"
          fi
          BODY=$(curl -fsS --max-time 30 $BYPASS_HEADER "${PRODUCTION_URL%/}/api/version")
          echo "$BODY"
          OBSERVED_SHA=$(printf '%s' "$BODY" | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>{const b=JSON.parse(d);if(typeof b.releaseSha!=="string"||!b.releaseSha)process.exit(1);process.stdout.write(b.releaseSha)})')
          if [ "$OBSERVED_SHA" != "$EXPECTED_SHA" ]; then
            echo "::error::Post-deploy marker mismatch: live releaseSha=$OBSERVED_SHA expected=$EXPECTED_SHA"
            exit 1
          fi
          echo "Post-deploy smoke passed: live deployment serves releaseSha=$OBSERVED_SHA."
