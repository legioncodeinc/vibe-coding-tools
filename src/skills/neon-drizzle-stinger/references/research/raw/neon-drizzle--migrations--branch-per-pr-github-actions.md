# Automate branching with GitHub Actions / Neon GitHub integration - Neon Docs

- URL: https://neon.com/docs/guides/branching-github-actions; supplementary from https://neon.com/docs/guides/neon-github-integration
- Fetched: 2026-08-14
- Source type: Official docs (Neon)
- Component: Migrations discipline (Neon branch-per-PR workflow, CI migration gating)

## Summary (as stated on the page)

Neon's GitHub Actions automate database branching inside CI/CD pipelines, enabling ephemeral Postgres branches for pull request (PR) preview deployments and isolated test environments. The actions cover branch creation, deletion, reset, and schema diff. Configure `NEON_API_KEY` and `NEON_PROJECT_ID` via the Neon GitHub integration or manual repository secrets before wiring them into workflow YAML. The schema diff action posts a branch comparison as a pull request comment.

## Setup

The Neon GitHub integration (a GitHub App) connects a Neon project to a GitHub repo and automatically sets a `NEON_API_KEY` secret and `NEON_PROJECT_ID` variable in the repo, skip manual secret setup if using it.

## Available GitHub Actions

- **Create branch action** (`neondatabase/create-branch-action`): creates a new database branch in the Neon project. Ideal for isolated preview/test environments per PR.
- **Delete branch action** (`neondatabase/delete-branch-action`): deletes a specified branch. Used to clean up ephemeral branches after a PR is merged or closed.
- **Reset branch action** (`neondatabase/reset-branch-action`): resets a branch to match its parent's latest state, useful for refreshing a dev/staging branch.
- **Schema diff action** (`neondatabase/schema-diff-action`): compares schemas of two branches and posts the diff as a PR comment.

## Reference workflow (from the GitHub integration's sample, annotated)

```yaml
name: Create/Delete Branch for Pull Request

on:
  pull_request:
    types: [opened, reopened, synchronize, closed]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}

jobs:
  setup:
    name: Setup
    outputs:
      branch: ${{ steps.branch_name.outputs.current_branch }}
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - name: Get branch name
        id: branch_name
        uses: tj-actions/branch-names@v8

  create_neon_branch:
    name: Create Neon Branch
    needs: setup
    if: |
      github.event_name == 'pull_request' && (
      github.event.action == 'synchronize'
      || github.event.action == 'opened'
      || github.event.action == 'reopened')
    runs-on: ubuntu-latest
    steps:
      - name: Create Neon Branch
        id: create_neon_branch
        uses: neondatabase/create-branch-action@v5
        with:
          project_id: ${{ vars.NEON_PROJECT_ID }}
          branch_name: preview/pr-${{ github.event.number }}-${{ needs.setup.outputs.branch }}
          api_key: ${{ secrets.NEON_API_KEY }}

      - name: Checkout
        uses: actions/checkout@v4

      - name: Run Migrations on Preview Branch
        run: npm install && npm run db:generate && npm run db:migrate
        env:
          DATABASE_URL: '${{ steps.create_neon_branch.outputs.db_url }}'

      - name: Post Schema Diff Comment to PR
        uses: neondatabase/schema-diff-action@v1
        with:
          project_id: ${{ vars.NEON_PROJECT_ID }}
          compare_branch: preview/pr-${{ github.event.number }}-${{ needs.setup.outputs.branch }}
          api_key: ${{ secrets.NEON_API_KEY }}

  delete_neon_branch:
    name: Delete Neon Branch and Apply Migrations on Production Database
    needs: setup
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    steps:
      - name: Delete Neon Branch
        uses: neondatabase/delete-branch-action@v3
        with:
          project_id: ${{ vars.NEON_PROJECT_ID }}
          branch: preview/pr-${{ github.event.number }}-${{ needs.setup.outputs.branch }}
          api_key: ${{ secrets.NEON_API_KEY }}

      - name: Checkout
        if: github.event.pull_request.merged == true
        uses: actions/checkout@v4

      - name: Apply migrations to production
        if: github.event.pull_request.merged == true
        run: |
          npm install
          npm run db:generate
          npm run db:migrate
        env:
          DATABASE_URL: '${{ secrets.DATABASE_URL }}'
```

## Key operational notes

- **Step outputs are job-scoped**: `create_neon_branch`'s outputs (`db_url`, `db_url_with_pooler`) are only available within the same job. Run migrations, tests, and related steps inside that job. Outputs are marked as secrets, never log the `DATABASE_URL`.
- **Secret separation is intentional**: `NEON_API_KEY` (set by the integration) manages the Neon project (create/delete branches); a separate `DATABASE_URL` secret points **exclusively** at the primary production database and is only used after a PR is merged, keeping ephemeral preview credentials isolated from the production credential.
- **Flow**: PR opened/synced → branch created (inherits parent schema + data) → migrations run against the new branch → schema diff posted as a PR comment → reviewers see exactly what changes → PR merged → migrations applied to production `DATABASE_URL` → preview branch deleted. PR closed without merge → preview branch deleted, production untouched.
- A `reset-branch-action` variant can be triggered by a PR label (e.g. `Reset Neon Branch`) to resync a long-lived branch with its parent mid-review.
