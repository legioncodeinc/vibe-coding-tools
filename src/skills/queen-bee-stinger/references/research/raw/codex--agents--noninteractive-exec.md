# Non-interactive mode – Codex | OpenAI Developers
- URL: https://developers.openai.com/codex/noninteractive
- Fetched: 2026-08-14
- Source type: official-docs
- Component: agents

Non-interactive mode lets you run Codex from scripts (for example, continuous integration (CI) jobs) without opening the interactive TUI. You invoke it with `codex exec`.

## When to use `codex exec`

- Run as part of a pipeline (CI, pre-merge checks, scheduled jobs).
- Produce output you can pipe into other tools (e.g., release notes or summaries).
- Fit naturally into CLI workflows that chain command output into Codex and pass Codex output to other tools.
- Run with explicit, pre-set sandbox and approval settings.

## Basic usage

```bash
codex exec "summarize the repository structure and list the top 5 risky areas"
```

Codex streams progress to `stderr` and prints only the final agent message to `stdout`:

```bash
codex exec "generate release notes for the last 10 commits" | tee release-notes.md
```

Use `--ephemeral` when you don't want to persist session rollout files to disk:

```bash
codex exec --ephemeral "triage this repository and suggest next steps"
```

If stdin is piped and you also provide a prompt argument, Codex treats the prompt as the instruction and the piped content as additional context:

```bash
curl -s https://jsonplaceholder.typicode.com/comments \
  | codex exec "format the top 20 items into a markdown table" \
  > table.md
```

## Permissions and safety

By default, `codex exec` runs in a read-only sandbox. In automation, set the least permissions needed:

- Allow edits: `codex exec --sandbox workspace-write "<prompt>"`
- Allow broader access: `codex exec --sandbox danger-full-access "<prompt>"`

Use `danger-full-access` only in a controlled environment (isolated CI runner or container).

`codex exec --full-auto` is a deprecated compatibility flag; prefer explicit `--sandbox workspace-write`.

`--ignore-user-config` skips loading `$CODEX_HOME/config.toml`; `--ignore-rules` skips user/project execpolicy `.rules` files for controlled automation.

If an enabled MCP server has `required = true` and fails to initialize, `codex exec` exits with an error instead of continuing without it.

## Make output machine-readable

```bash
codex exec --json "summarize the repo structure" | jq
```

`--json` makes `stdout` a JSON Lines (JSONL) stream capturing every event. Event types: `thread.started`, `turn.started`, `turn.completed`, `turn.failed`, `item.*`, `error`. Item types: agent messages, reasoning, command executions, file changes, MCP tool calls, web searches, plan updates.

Sample stream:

```jsonl
{"type":"thread.started","thread_id":"0199a213-81c0-7800-8aa1-bbab2a035a53"}
{"type":"turn.started"}
{"type":"item.started","item":{"id":"item_1","type":"command_execution","command":"bash -lc ls","status":"in_progress"}}
{"type":"item.completed","item":{"id":"item_3","type":"agent_message","text":"Repo contains docs, sdk, and examples directories."}}
{"type":"turn.completed","usage":{"input_tokens":24763,"cached_input_tokens":24448,"output_tokens":122,"reasoning_output_tokens":0}}
```

Write only the final message with `-o`/`--output-last-message <file>` (also still prints to stdout).

## Create structured outputs with a schema

`--output-schema` constrains the final response to a JSON Schema:

`schema.json`:
```json
{
  "type": "object",
  "properties": {
    "project_name": { "type": "string" },
    "programming_languages": { "type": "array", "items": { "type": "string" } }
  },
  "required": ["project_name", "programming_languages"],
  "additionalProperties": false
}
```

```bash
codex exec "Extract project metadata" \
  --output-schema ./schema.json \
  -o ./project-metadata.json
```

Output:
```json
{ "project_name": "Codex CLI", "programming_languages": ["Rust", "TypeScript", "Shell"] }
```

## Authenticate in automation

`codex exec` reuses saved CLI auth by default. For GitHub Actions, use the Codex GitHub Action (`openai/codex-action`) instead of installing/authenticating the CLI yourself — it installs Codex, starts a Responses API proxy, and runs with a configurable safety strategy, reducing API key exposure.

Do not set `OPENAI_API_KEY`/`CODEX_API_KEY` as a job-level environment variable in workflows that check out or run repository-controlled code — build scripts, tests, dependency lifecycle hooks, or a compromised action in the same job can read it.

For other automation, set `CODEX_API_KEY` only for the single `codex exec` invocation:

```bash
CODEX_API_KEY=<api-key> codex exec --json "triage open bug reports"
```

`CODEX_API_KEY` is only supported in `codex exec`.

### ChatGPT-managed auth in CI/CD (advanced)

For enterprise teams needing Codex-account rate limits instead of API keys. Treat `~/.codex/auth.json` like a password. Don't use for public/open-source repos. If `codex login` isn't an option on the runner, seed `auth.json` through secure storage and persist the refreshed file between runs.

## Resume a non-interactive session

```bash
codex exec "review the change for race conditions"
codex exec resume --last "fix the race conditions you found"
```

Target a specific session with `codex exec resume <SESSION_ID>`.

## Git repository required

Codex requires commands to run inside a Git repository to prevent destructive changes. Override with `codex exec --skip-git-repo-check`.

## Common automation patterns

### Example: Autofix CI failures in GitHub Actions

Use `openai/codex-action` instead of installing Codex and passing the API key to a shell step. Pattern:

1. Trigger a follow-up workflow when the main CI workflow completes with an error.
2. Check out the failing commit with repository read permissions only.
3. Run setup commands before Codex without exposing the API key to those steps.
4. Run the Codex GitHub Action.
5. Save Codex's local changes as a patch artifact.
6. In a separate job, apply the patch and open a pull request.

```yaml
name: Codex auto-fix on CI failure

on:
  workflow_run:
    workflows: ["CI"]
    types: [completed]

jobs:
  generate_fix:
    if: ${{ github.event.workflow_run.conclusion == 'failure' }}
    runs-on: ubuntu-latest
    permissions:
      contents: read
    outputs:
      has_patch: ${{ steps.diff.outputs.has_patch }}
    steps:
      - uses: actions/checkout@v5
        with:
          ref: ${{ github.event.workflow_run.head_sha }}
          fetch-depth: 0
          persist-credentials: false

      - uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install dependencies
        run: |
          if [ -f package-lock.json ]; then npm ci; fi

      - name: Run Codex
        uses: openai/codex-action@v1
        with:
          openai-api-key: ${{ secrets.OPENAI_API_KEY }}
          prompt: |
            The CI workflow "${{ github.event.workflow_run.name }}" failed for commit
            ${{ github.event.workflow_run.head_sha }}.

            Run `npm test --silent` to reproduce the failure. Identify the minimal
            change needed to make the tests pass, implement only that change, and
            run `npm test --silent` again.

            Do not refactor unrelated files.

      - name: Create patch artifact
        id: diff
        run: |
          git add -N .
          git diff --binary HEAD > codex.patch
          if [ -s codex.patch ]; then
            echo "has_patch=true" >> "$GITHUB_OUTPUT"
          else
            echo "has_patch=false" >> "$GITHUB_OUTPUT"
          fi

      - name: Upload patch artifact
        if: steps.diff.outputs.has_patch == 'true'
        uses: actions/upload-artifact@v4
        with:
          name: codex-fix-patch
          path: codex.patch
          if-no-files-found: error

  open_pr:
    runs-on: ubuntu-latest
    needs: generate_fix
    if: needs.generate_fix.outputs.has_patch == 'true'
    permissions:
      contents: write
      pull-requests: write
    steps:
      - uses: actions/checkout@v5
        with:
          ref: ${{ github.event.workflow_run.head_sha }}
          fetch-depth: 0

      - uses: actions/download-artifact@v4
        with:
          name: codex-fix-patch

      - name: Apply Codex patch
        run: git apply --index codex.patch

      - name: Open pull request
        env:
          GH_TOKEN: ${{ github.token }}
          FAILED_HEAD_BRANCH: ${{ github.event.workflow_run.head_branch }}
          FAILED_HEAD_SHA: ${{ github.event.workflow_run.head_sha }}
          RUN_ID: ${{ github.event.workflow_run.run_id }}
        run: |
          branch="codex/auto-fix-$RUN_ID"

          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
          git switch -c "$branch"
          git commit -m "Auto-fix failing CI via Codex"
          git push origin "$branch"

          {
            echo "Codex generated this patch after CI failed for \`$FAILED_HEAD_SHA\`."
            echo
            echo "Review the changes before merging."
          } > pr-body.md

          gh pr create \
            --base "$FAILED_HEAD_BRANCH" \
            --head "$branch" \
            --title "Auto-fix failing CI via Codex" \
            --body-file pr-body.md
```

## Advanced stdin piping

Choose the stdin pattern based on where the instruction should come from:

### Prompt-plus-stdin (you write the instruction, pipe in context)

```bash
npm test 2>&1 \
  | codex exec "summarize the failing tests and propose the smallest likely fix" \
  | tee test-summary.md
```

More examples:

```bash
# Summarize logs
tail -n 200 app.log \
  | codex exec "identify the likely root cause, cite the most important errors, and suggest the next three debugging steps" \
  > log-triage.md

# Inspect TLS or HTTP issues
curl -vv https://api.example.com/health 2>&1 \
  | codex exec "explain the TLS or HTTP failure and suggest the most likely fix" \
  > tls-debug.md

# Prepare a Slack-ready update
gh run view 123456 --log \
  | codex exec "write a concise Slack-ready update on the CI failure, including the likely cause and next step" \
  | pbcopy

# Draft a pull request comment from CI logs
gh run view 123456 --log \
  | codex exec "summarize the failure in 5 bullets for the pull request thread" \
  | gh pr comment 789 --body-file -
```

### `codex exec -` when stdin is the prompt

If you omit the prompt argument, Codex reads the prompt from stdin. Use `codex exec -` to force this explicitly:

```bash
cat prompt.txt | codex exec -
```

```bash
printf "Summarize this error log in 3 bullets:\n\n%s\n" "$(tail -n 200 app.log)" \
  | codex exec -
```

```bash
generate_prompt.sh | codex exec - --json > result.jsonl
```

---

## Supplementary detail (developers.openai.com/codex/cli — "subagents" and cloud delegation summary)
- Component: agents

Codex CLI supports three related delegation mechanisms:
1. `codex exec` — non-interactive, single-invocation scripting (documented above).
2. Subagents — delegate focused work within a session to specialized in-process agents that "stay focused and use the right tools for its job" (per developers.openai.com/codex/concepts/customization).
3. `codex cloud` — hand a task to a remote, OpenAI-managed cloud environment; browse active/completed chats from the terminal and apply results locally.

Community summary (techjacksolutions.com, 2026-06-16): the three Codex surfaces (CLI, IDE extension, ChatGPT web at chatgpt.com/codex) share one agent and connect to the same Codex Cloud, so scripting learned via `codex exec` and delegation patterns carry over across surfaces.
