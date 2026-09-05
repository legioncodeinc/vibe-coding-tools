# Cloud environments – Codex web | OpenAI Developers
- URL: https://developers.openai.com/codex/cloud/environments
- Fetched: 2026-08-14
- Source type: official-docs
- Component: agents

Use environments to control what Codex installs and runs during cloud chats. For example, add dependencies, install tools like linters and formatters, and set environment variables. Configure environments in Codex settings.

## How Codex cloud chats run

What happens when you submit a prompt:

1. Codex creates a container and checks out your repo at the selected branch or commit SHA.
2. Codex runs your setup script, plus an optional maintenance script when a cached container is resumed.
3. Codex applies your internet access settings. Setup scripts run with internet access. Agent internet access is off by default, but you can enable limited or unrestricted access if needed.
4. The agent runs terminal commands in a loop. It edits code, runs checks, and tries to validate its work. If your repo includes `AGENTS.md`, the agent uses it to find project-specific lint and test commands.
5. When the agent finishes, it shows its answer and a diff of any files it changed. You can open a PR or ask follow-up questions.

Environment variables are set for the full duration of the chat (including setup scripts and the agent phase).

For projects using common package managers (`npm`, `yarn`, `pnpm`, `pip`, `pipenv`, `poetry`), Codex can automatically install dependencies and tools.

Setup scripts run in a separate Bash session from the agent, so commands like `export` do not persist into the agent phase. To persist environment variables, add them to `~/.bashrc` or configure them in environment settings.

## Default universal image

The Codex agent runs in a default container image called `universal`, pre-installed with common languages, packages, and tools. In environment settings, select Set package versions to pin versions of Python, Node.js, and other runtimes. See `openai/codex-universal` for a reference Dockerfile / pullable image.

You can also install additional packages via setup scripts.

## Environment variables and secrets

Secrets differ from environment variables:

- Stored with an additional layer of encryption, decrypted only for task execution.
- Only available to setup scripts — for security, secrets are removed before the agent phase starts.

## Manual setup

Example custom setup script:

```bash
# Install type checker
pip install pyright

# Install dependencies
poetry install --with test
pnpm install
```

## Container caching

Codex caches container state for up to 12 hours to speed up new chats and follow-ups.

When an environment is cached:
- Codex clones the repository and checks out the default branch.
- Codex runs the setup script and caches the resulting container state.

When a cached container is resumed:
- Codex checks out the branch specified for the chat.
- Codex runs the maintenance script (optional) — useful when the setup script ran on an older commit and dependencies need updating.

Codex automatically invalidates the cache if you change the setup script, maintenance script, environment variables, or secrets. If your repo changes in a way that makes the cached state incompatible, select Reset cache on the environment page.

For Business and Enterprise users, caches are shared across all users with access to the environment. Invalidating the cache affects all users of the environment in the workspace.

## Internet access and network proxy

Internet access is available during the setup script phase to install dependencies. During the agent phase, internet access is off by default, but you can configure limited or unrestricted access.

Environments run behind an HTTP/HTTPS network proxy for security and abuse prevention purposes. All outbound internet traffic passes through this proxy.

---

## Related: cloud vs local delegation model (community synthesis)
- Source type: community
- Note: consolidated from vladimirsiedykh.com/blog/codex-local-vs-cloud-workflows-2025 and techjacksolutions.com's Codex CLI guide

Codex runs in two execution environments:

- **Local execution** (CLI/IDE/desktop app): instant feedback, no network latency, repo stays on the local machine, full visibility into every edit/execution.
- **Codex Cloud**: durable (logs/runs persist across sessions), scalable (heavy refactors/test runs don't bog down the local machine), collaborative (teammates can review/replay a cloud run), isolated (risky experiments stay off the main machine).

Typical division of labor: quick, interactive changes stay local where every step is reviewable; long or batch jobs go to the cloud and come back as reviewable diffs. Both surfaces use the same underlying Codex agent and share context (files opened locally inform cloud runs; plans and diffs carry across modes).

Community best practices: default to local for routine work; escalate to cloud for scale/endurance; document cloud-run intent/results like CI jobs; scope authentication tightly (repo-level, not org-wide); never paste secrets into prompts; review every diff regardless of execution mode.
