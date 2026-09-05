# Phase 3 — Git Log Forensics

## Goal
Convert the complete git commit history of the developer's repository into:
1. Per-commit calibrated hour estimates
2. Monthly effort rollup
3. Identification of "idle months" (zero commits while billed) and "low-activity months" (<10 hours while billed)
4. A "Billed vs Delivered" variance table

The git log is the single most powerful piece of evidence in these cases. Unlike invoices or testimony, git commits are cryptographically chained — defendants cannot retroactively fabricate or alter history without detection.

## Input

The defendants' git repository as a complete clone or zip — NOT a partial clone. Typically the developer provides this as a zip file (the Example Booking Co. case used `simple-schedular-web.zip`).

If you don't have access:
- Ask the user to request a copy "for backup purposes" — most developers will comply without realizing the forensic intent
- If the codebase is hosted on GitHub and the client has admin access, clone with `git clone --mirror`
- If neither: note in the master report that Part 1 (git analysis) is pending, and proceed to subsequent phases

## Methodology

### Step 1: Extract the repository
```bash
mkdir -p /tmp/repo && cd /tmp/repo && unzip /path/to/repo.zip
cd /path/to/extracted-repo
```

### Step 2: Pull the full commit log with stats
```bash
git log --all --pretty=format:'%H|%ai|%an|%ae|%s' --shortstat > /tmp/git_log.txt
```

The `--all` flag is critical — include all branches, not just main.

### Step 3: Run the parser
```bash
python scripts/parse_git_log.py \
    --input /tmp/git_log.txt \
    --out forensic-output/_intermediate/
```

This produces:
- `commits.json` — per-commit records with calibrated `est_hours`
- `git_by_month.json` — monthly rollups

### Calibration Constants

Effort per commit = `max(0.25, (insertions + deletions) / 30) × multiplier`, capped at 16 hrs/commit.

| Commit Type Hint | Multiplier | Reasoning |
|---|---|---|
| `merge pull request` / `merge branch` / `merge remote` | 0.1 hr flat | Review-only effort |
| Renames, typos, README, comments (≤2 files, ≤5 LOC) | 0.25 hr flat | Trivial |
| Subject contains "migration" | 1.5× | Schema migrations require careful thinking |
| Subject contains "model" or "schema" | 1.5× | New data structure work |
| Subject contains "test" | 0.7× | Tests are faster per LOC |
| Subject contains "config", "docker", "requirement" | 0.8× | Configuration work is moderate-velocity |
| Subject contains "rename", "typo", "comment", "readme" | 0.3× | Trivial |
| Default | 1.0× | Production code at ~30 LOC/hr |

The 30 LOC/hr base is intentionally generous — industry studies of professional software development place sustained throughput at 10–20 LOC/hr for greenfield work. Using 30 means we give the defendants the benefit of the doubt and the gap that emerges is still damning.

### Step 4: Identify idle and low-activity months

For each calendar month in the maintenance window:
- **IDLE** = 0 commits, 0 hours
- **LOW** = ≥1 commit but <10 hours
- **NORMAL** = 10–30 hours
- **HEAVY** = >30 hours

The Billed vs Delivered comparison assumes the maintenance billing claimed 80 hours/month (DevPipe's standard Platinum Maintenance). Variance = 80 × N_months − sum(git_hours).

The Example Booking Co. case found 4 idle months and 6 low-activity months out of 26 paid maintenance months: 1,506 unaccounted hours = $150,600 at the contracted $100/hr rate.

### Step 5: Author attribution

The git log will show 5–10 distinct GitHub identities, but many are duplicates of the same person using both their personal email and the GitHub noreply alias. Combine identities by email handle and report combined hours per individual.

For Example Booking Co.:
- Sameer Khan (sameer.khan@example.com + 00000001+sameer.khan@users.noreply.github.com): 176 commits / 414 hours
- Ravi Sharma (ravi.sharma@example.com + 00000003+ravisharma@users.noreply.github.com + ravi.sharma@example.com): 316 commits / 200 hours

This is a 2-person team — relevant to the "team of US engineers" implied by the $100/hour pricing.

### Step 6: Look for suspicious commit patterns

After the rollup, scan for these patterns and flag them in the master report:

- **Initial commit with >50,000 lines.** Indicates bulk-import of pre-existing codebase rather than original engineering. Example Booking Co.: `2023-11-10 "initial commit" with +96,365 lines`. Consistent with importing the original Initial Build Vendor deliverable.
- **Same-day revert pairs.** A commit adds N lines, the next commit removes N lines. Indicates rework with zero net delivered value. Example Booking Co.: `2024-11-30 "fixed unassigned" +5,347 / 2024-12-01 "Revert..." −5,347`.
- **Insert-then-delete pairs.** A commit adds a large file, the next commit removes it. Example Booking Co.: `2025-10-29 +33,153 / 2025-10-30 −33,137`. Looks like a debug dump that should never have been committed.
- **Months with only merge commits.** A "wall of green checkmarks" on GitHub can mask the fact that no real engineering happened — just merges of PRs that were themselves mostly merges.

## Output for Phase 7

Update `case-facts.json`:
```json
{
  "totals": {
    "git_total_commits": 534,
    "git_total_hours_delivered": 648,
    "git_active_months": 26,
    "git_idle_months": 4,
    "git_low_activity_months": 6,
    "git_claimed_hours_at_80per_month": 2080,
    "git_unexplained_hour_gap": 1506,
    "git_maintenance_overpayment_at_100": 150600
  },
  "git": {
    "first_commit_date": "2023-11-10",
    "last_commit_date": "2026-04-10",
    "primary_authors": [
      {"name": "Sameer Khan", "commits": 176, "hours": 414},
      {"name": "Ravi Sharma", "commits": 316, "hours": 200}
    ],
    "idle_months": ["2025-02", "2025-06", "2025-07", "2025-12"]
  }
}
```

## Excel workbook integration

The Phase 3 outputs feed three tabs of the master Invoice Forensics workbook:
- **Commit Log** — every commit, with date, author, subject, files changed, +LOC, -LOC, est hours, est $
- **Monthly Effort Rollup** — every calendar month in the maintenance window, with status color-coding
- **Billed vs Delivered** — variance table showing claimed hours vs git-evidence hours per month
- **Idle Months** — filtered view of just the idle and low-activity months for easy citation

## Verification

- [ ] Total commits matches `git log --all --oneline | wc -l`
- [ ] First and last commit dates match `git log --all --pretty=%ai | sort | head -1` and `| tail -1`
- [ ] Author email aliases are properly consolidated (no double-counting Sameer under two emails)
- [ ] Idle months are flagged in red in the Excel workbook
- [ ] At least one suspicious commit pattern (initial bulk import, revert pair, etc.) is identified for the master report
