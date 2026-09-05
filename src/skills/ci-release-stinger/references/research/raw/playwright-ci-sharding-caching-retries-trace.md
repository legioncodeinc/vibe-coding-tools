# Playwright CI on GitHub Actions: browser caching, sharding, retries, trace-on-failure

- URL: https://playwright.dev/docs/ci ; https://playwright.dev/docs/test-sharding ; https://web-automations.com/playwright-setup-core-architecture/ci-cd-integration/running-playwright-tests-in-github-actions-with-sharding/ ; https://currents.dev/posts/playwright-ci-at-scale-github-gitlab
- Fetched: 2026-08-14
- Source type: Official Playwright docs (playwright.dev) + independent technical blog posts (web-automations.com, currents.dev, qaskills.sh - clearly marked where used, treated as directionally reliable, not official)
- Component: Playwright CI best practices / sharding / caching / retries / trace-on-failure

## Content

### Playwright's own official position on caching browser binaries: mixed, lean against it

Per `playwright.dev/docs/ci` (official docs): "Caching browser binaries is not recommended, since the amount of time it takes to restore the cache is comparable to the time it takes to download the binaries. Especially under Linux, operating system dependencies need to be installed, which are not cacheable." This is a notably different stance from the independent blog sources below, which present browser caching as a default best practice. Where the official docs still describe how to cache if a team wants to anyway: key the cache on a hash of the Playwright version, and still separately run `playwright install-deps` on a cache hit to install OS-level libraries (`libnss3`, `libatk`, etc.) that the cache directory itself cannot contain.

### The community-pattern version of browser caching (multiple independent sources agree on this shape)

```yaml
- name: Get Playwright version
  id: playwright-version
  run: echo "version=$(npm ls @playwright/test --json | jq -r '.dependencies["@playwright/test"].version')" >> "$GITHUB_OUTPUT"
- name: Cache Playwright browsers
  uses: actions/cache@v4
  id: playwright-cache
  with:
    path: ~/.cache/ms-playwright
    key: playwright-${{ runner.os }}-${{ steps.playwright-version.outputs.version }}
- name: Install Playwright browsers
  if: steps.playwright-cache.outputs.cache-hit != 'true'
  run: pnpm exec playwright install --with-deps
- name: Install Playwright system deps only
  if: steps.playwright-cache.outputs.cache-hit == 'true'
  run: pnpm exec playwright install-deps
```

The single most-repeated pitfall across sources: caching the browser binaries but forgetting the `install-deps` fallback on a cache hit - binaries restore fine but fail to *launch* because system libraries outside the cached path are missing on a fresh runner. Key the cache on the **Playwright version**, not the lockfile hash - a version bump should invalidate the cache; a lockfile change unrelated to Playwright shouldn't force a re-download.

**Currents.dev's cache-eviction warning (independent source, directional):** GitHub enforces a 10GB per-repo cache limit across all plans; each Playwright version's full browser set (Chromium + Firefox + WebKit) runs 500MB-1GB, and caches are branch-scoped with fallback to the default branch. Many active short-lived feature branches each caching slightly different environments can exhaust the 10GB limit, causing GitHub to evict the least-recently-used entry - which can evict an active feature branch's cache or, in bad cases, even the default branch's cache, causing unexpected cold-starts on what should be the most reliable branch. Mitigation suggested: share a common fallback cache key across branches rather than a fully branch-unique key.

### Sharding (official Playwright feature, `--shard` flag)

```yaml
strategy:
  fail-fast: false
  matrix:
    shardIndex: [1, 2, 3, 4]
    shardTotal: [4]
steps:
  - run: npx playwright test --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}
  - uses: actions/upload-artifact@v4
    if: ${{ !cancelled() }}
    with:
      name: blob-report-${{ matrix.shardIndex }}
      path: blob-report
      retention-days: 1

merge-reports:
  if: ${{ !cancelled() }}
  needs: [test]
  steps:
    - uses: actions/download-artifact@v5
      with:
        path: all-blob-reports
        pattern: blob-report-*
        merge-multiple: true
    - run: npx playwright merge-reports --reporter html ./all-blob-reports
```

`reporter: process.env.CI ? 'blob' : 'html'` (or `'list'` locally) is the required config change - the blob reporter is specifically the machine-mergeable intermediate format; the HTML reporter is a final rendering not designed to be recombined. `fail-fast: false` is required on the matrix, or GitHub cancels every other shard the instant one fails, losing the complete picture of what's actually broken across the suite. The merge job's `if: ${{ !cancelled() }}` guard (not `if: success()`) ensures a merged report still gets produced even when some shards failed - a readable red report beats no report.

`fullyParallel: true` in `playwright.config.ts` is what makes shard distribution balanced at the *individual test* level rather than the file level; without it, shards are balanced by whole test files, so uneven file sizes produce uneven shard runtimes.

### Retries: two independent layers that multiply, not add

Per Currents.dev (independent, directional source, but the mechanism described matches Playwright's own documented retry behavior): Playwright's own `retries` config re-runs a failed test *in the same worker, fresh browser context* - this only helps for test-level flakiness, not environmental pressure (CPU contention, `/dev/shm` exhaustion), since the underlying machine doesn't change. GitHub Actions has **no built-in job-level retry keyword** (unlike GitLab's `retry:`); job-level retries on GitHub require either a third-party action (`nick-fields/retry@v4`) or a full manual workflow re-run. These two layers **multiply**: a test with `retries: 2` inside a job re-run twice can execute up to 9 times total, each attempt generating its own trace/video, which compounds artifact storage. Recommendation from this source: cap Playwright's own `retries` at 1 in CI, and reserve any job/workflow-level retry specifically for infrastructure-class failures, not test-logic flakiness.

Playwright's official recommendation for CI worker count (`playwright.dev/docs/ci`): set `workers: 1` in CI to prioritize stability and reproducibility over raw speed, unless running on powerful self-hosted runners - and reach for **sharding** (separate runner-per-shard parallelism) rather than raising in-job worker count as the primary lever for CI speed.

### Trace/video/screenshot-on-failure config (the current idiomatic shape, consistent across all sources)

```ts
use: {
  trace: 'on-first-retry',        // only capture a trace on the retry attempt, not every run
  video: 'retain-on-failure',     // discard video for passing tests
  screenshot: 'only-on-failure',
},
```

Paired upload step, scoped to failures only to control artifact storage growth:

```yaml
- uses: actions/upload-artifact@v4
  if: ${{ failure() }}
  with:
    name: playwright-traces-${{ matrix.shardIndex }}
    path: test-results/**/trace.zip
    retention-days: 7
```

Default GitHub Actions artifact retention is 90 days; multiple sources independently recommend cutting this to 7-14 days for trace artifacts specifically (traces/videos are large and only useful for near-term debugging) while keeping the merged HTML report artifact longer (e.g. 14-30 days) since it's smaller and more broadly useful for later reference.

### `--only-changed` (official Playwright feature, worth naming as a fast-feedback option, not a replacement for full runs)

Playwright supports running a preliminary pass with `--only-changed`, which uses the suite's dependency graph to run only test files likely affected by the current changeset - useful as a fast first-pass signal on a PR, but the official docs are explicit this is a heuristic that can miss affected tests, so the full suite must still run afterward as the actual gate, not be replaced by the changed-only pass.
