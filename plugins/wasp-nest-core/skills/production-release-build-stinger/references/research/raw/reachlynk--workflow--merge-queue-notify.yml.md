name: Merge Queue Notify

# PRD-038 follow-up: release-wait protocol, tier 2/3. Watches the main
# release-freeze lock and the .release/merge-queue.json parking lot. When the
# lock lifts, this workflow NOTIFIES parked PRs (comment on each queued PR
# with the resume action). It NEVER merges; the owning session does that, so
# merge consent stays with the session that owns the work (AGENTS.md rule 8).

on:
  schedule:
    # Every 10 minutes at an off-peak minute (per repo convention, avoid :00/:30).
    - cron: '7,17,27,37,47,57 * * * *'
  workflow_dispatch:

permissions:
  contents: read
  pull-requests: write

concurrency:
  group: merge-queue-notify
  cancel-in-progress: false

jobs:
  notify:
    runs-on: ubuntu-latest
    timeout-minutes: 5
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          persist-credentials: false

      - name: Check main release lock
        id: lock
        env:
          GH_TOKEN: ${{ github.token }}
        run: |
          locked=$(gh api "repos/${{ github.repository }}/branches/main/protection" \
            --jq '.lock_branch.enabled // false')
          echo "locked=$locked" >> "$GITHUB_OUTPUT"
          echo "main lock_branch.enabled=$locked"

      - name: Notify parked PRs when the lock lifts
        if: steps.lock.outputs.locked == 'false'
        env:
          GH_TOKEN: ${{ github.token }}
        run: |
          node --input-type=module <<'EOF'
          import { readFileSync } from 'node:fs'
          const queue = JSON.parse(readFileSync('.release/merge-queue.json', 'utf8'))
          const open = queue.queue.filter((e) => e.status === 'waiting')
          if (open.length === 0) {
            console.log('queue empty; nothing to notify')
            process.exit(0)
          }
          for (const entry of open) {
            const body = [
              `🔓 Main release lock has lifted. This PR is parked in \`.release/merge-queue.json\` (position ${open.indexOf(entry) + 1} of ${open.length}).`,
              '',
              `**Resume action** (for the owning session): ${entry.resumeAction}`,
              '',
              'The queue never auto-merges; the owning session executes the resume action.',
            ].join('\n')
            await fetch(`https://api.github.com/repos/${process.env.GITHUB_REPOSITORY}/issues/${entry.pr}/comments`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${process.env.GH_TOKEN}`,
                Accept: 'application/vnd.github+json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ body }),
            })
            console.log(`notified PR #${entry.pr}`)
          }
          EOF

      - name: Queue heartbeat while locked
        if: steps.lock.outputs.locked == 'true'
        run: |
          node --input-type=module <<'EOF'
          import { readFileSync } from 'node:fs'
          const queue = JSON.parse(readFileSync('.release/merge-queue.json', 'utf8'))
          const waiting = queue.queue.filter((e) => e.status === 'waiting').length
          console.log(`lock active; ${waiting} PR(s) parked in the merge queue`)
          EOF
