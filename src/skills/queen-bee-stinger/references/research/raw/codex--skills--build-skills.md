# Build skills – Codex | OpenAI Developers
- URL: https://developers.openai.com/codex/skills
- Fetched: 2026-08-14
- Source type: official-docs
- Component: skills

Use agent skills to extend Codex with task-specific capabilities. A skill packages instructions, resources, and optional scripts so Codex can follow a workflow reliably. Skills build on the open agent skills standard.

Skills are the authoring format for reusable workflows. Plugins distribute reusable skills and connectors to ChatGPT Work on the web and to ChatGPT Work and Codex in the desktop app. Codex CLI can also install plugins. Use skills to design the workflow itself, then package it as a plugin when you want other people in your workspace to install it.

Skills are available in the ChatGPT desktop app, Codex CLI, and IDE extension. In the ChatGPT desktop app, open Skills in the sidebar to view and explore skills created across your projects.

Skills use progressive disclosure to manage context efficiently: Codex starts with each skill's name, description, and file path. Codex loads the full `SKILL.md` instructions only when it decides to use a skill.

Codex includes an initial list of available skills in context so it can choose the right skill for a task. To avoid crowding out the rest of the prompt, this list uses at most 2% of the model's context window, or 8,000 characters when the context window is unknown. If many skills are installed, Codex shortens skill descriptions first. For large skill sets, Codex may omit some skills from the initial list and show a warning.

This budget applies only to the initial skills list. When Codex selects a skill, it still reads the full SKILL.md instructions for that skill.

A skill is a directory with a `SKILL.md` file plus optional scripts and references. The `SKILL.md` file must include `name` and `description`.

## How Codex uses skills

Codex can activate skills in two ways:

1. Explicit invocation: Include the skill directly in your prompt. In CLI/IDE, run `/skills` or type `$` to mention a skill.
2. Implicit invocation: Codex can choose a skill when your task matches the skill `description`.

Because implicit matching depends on `description`, write concise descriptions with clear scope and boundaries. Front-load the key use case and trigger words so Codex can still match the skill if descriptions are shortened.

## Create a skill

If you already know the workflow and it's easier to show than describe, use Record & Replay: Codex records the workflow, inspects the steps, and drafts a reusable skill from the demonstration.

Or use the built-in creator:

```text
$skill-creator
```

The creator asks what the skill does, when it should trigger, and whether it should stay instruction-only or include scripts. Instruction-only is the default.

Manual creation — create a folder with a `SKILL.md` file:

```md
---
name: skill-name
description: Explain exactly when this skill should and should not trigger.
---

Skill instructions for Codex to follow.
```

Codex detects skill changes automatically. If an update doesn't appear, restart Codex.

## Where to save skills

Codex reads skills from repository, user, admin, and system locations. For repositories, Codex scans `.agents/skills` in every directory from your current working directory up to the repository root. If two skills share the same `name`, Codex doesn't merge them; both can appear in skill selectors.

| Skill Scope | Location | Suggested use |
| --- | --- | --- |
| `REPO` | `$CWD/.agents/skills` (current working directory) | Teams can check in skills relevant to a working folder — e.g. a microservice or module. |
| `REPO` | `$CWD/../.agents/skills` (folder above CWD, inside a Git repo) | Organizations can check in skills relevant to a shared area in a parent folder. |
| `REPO` | `$REPO_ROOT/.agents/skills` (topmost root folder) | Root skills available to any subfolder in the repository. |
| `USER` | `$HOME/.agents/skills` | Skills relevant to a user across any repository. |
| `ADMIN` | `/etc/codex/skills` | SDK scripts, automation, default admin skills for each user on the machine. |
| `SYSTEM` | Bundled with Codex by OpenAI | Broadly useful skills such as `skill-creator` and plan skills. Available to everyone at startup. |

Codex supports symlinked skill folders and follows the symlink target when scanning these locations.

These locations are for authoring and local discovery. When you want to distribute reusable skills beyond a single repo, or optionally bundle them with connectors, use plugins.

## Distribute skills with plugins

Direct skill folders are best for local authoring and repo-scoped workflows. If you want to distribute a reusable skill, bundle two or more skills together, or ship a skill alongside a connector, package them as a plugin. Plugins can include one or more skills, and optionally bundle app mappings, MCP server configuration, and presentation assets in a single package.

## Install curated skills for local use

```bash
$skill-installer linear
```

You can also prompt the installer to download skills from other repositories. Codex detects newly installed skills automatically. Use this for local setup/experimentation; prefer plugins for reusable distribution of your own skills.

## Enable or disable skills

```toml
[[skills.config]]
path = "/path/to/skill/SKILL.md"
enabled = false
```

Restart Codex after changing `~/.codex/config.toml`.

## Optional metadata

Add `agents/openai.yaml` to configure UI metadata in the ChatGPT desktop app, set invocation policy, and declare tool dependencies:

```yaml
interface:
  display_name: "Optional user-facing name"
  short_description: "Optional user-facing description"
  icon_small: "./assets/small-logo.svg"
  icon_large: "./assets/large-logo.png"
  brand_color: "#3B82F6"
  default_prompt: "Optional surrounding prompt to use the skill with"

policy:
  allow_implicit_invocation: false

dependencies:
  tools:
    - type: "mcp"
      value: "openaiDeveloperDocs"
      description: "OpenAI Docs MCP server"
      transport: "streamable_http"
      url: "https://developers.openai.com/mcp"
```

`allow_implicit_invocation` (default: `true`): When `false`, Codex won't implicitly invoke the skill based on user prompt; explicit `$skill` invocation still works.

## Best practices

- Keep each skill focused on one job.
- Prefer instructions over scripts unless you need deterministic behavior or external tooling.
- Write imperative steps with explicit inputs and outputs.
- Test prompts against the skill description to confirm the right trigger behavior.

For more examples, see GitHub CI repair, PDF, Linear, `openai/skills`, and the agent skills specification. For installable distribution, prefer plugins.

---

## Corroborating notes

### openai/skills (GitHub, deprecated repo notice)
- URL: https://github.com/openai/skills/
- Source type: official-docs (repo notice)

> **This repository is deprecated.** For current Codex skill and plugin examples, use the [OpenAI Plugins repository](https://github.com/openai/plugins). If you want to add your own skills to Codex, follow the [Build plugins](https://developers.openai.com/codex/plugins/build) guide, which includes instructions for creating a skill-only plugin.

Agent Skills are folders of instructions, scripts, and resources that AI agents can discover and use to perform at specific tasks. "Write once, use everywhere." Codex uses skills to help package capabilities that teams and individuals can use to complete specific tasks in a repeatable way.

### Skills adoption timeline (from GitHub issue #5291, openai/codex)
- URL: https://github.com/openai/codex/issues/5291
- Source type: community/maintainer thread

Issue title: "Support for SKILL.md files." Early requesters described the Anthropic-originated SKILL.md progressive-disclosure model (name/description pre-loaded, full body loaded on demand, additional bundled files as a third level of detail) and asked OpenAI to adopt it natively. Community workarounds referenced before official support: `klaudworks/universal-skills` (MCP-based reverse-engineered Claude-skills clone, installed via `codex mcp add skills -- npx universal-skills mcp`), `numman-ali/openskills`, and `jixoai/ccski` (unified SKILL.md manager for Claude Code + Codex).

Maintainer confirmation (quoted from the thread): "We officially announced support today for skills. You can read about it in the [codex documentation](https://developers.openai.com/codex/skills)." The initial implementation shipped as PR #7412 ("feat: experimental support for skills.md — This change prototypes support for Skills with the CLI. This is an experimental feature for internal testing"), documented at `docs/skills.md` in the openai/codex repo. Simon Willison covered the launch: https://simonwillison.net/2025/Dec/12/openai-skills/

### `.agents/skills` migration (PR #10317, openai/codex)
- URL: https://github.com/openai/codex/pull/10317
- Source type: community (GitHub PR description)

> This PR adds support for loading skills from `.agents/skills/`. Motivation: When skills live on the filesystem, sharing them across agents is awkward and often ends up requiring symlinks/duplication. A single location under `.agents/` makes it easier to share skills. Loading from `.codex/skills/` will remain but will be deprecated soon. The change only applies to the REPO scope.

This confirms Codex migrated its repo-scoped skills directory convention from `.codex/skills/` to `.agents/skills/` to align with the shared cross-vendor `.agents/` convention (see also the Plugins docs, which use `.agents/plugins/marketplace.json`).

### Skills in the OpenAI API (hosted/local shell environments)
- URL: https://developers.openai.com/api/docs/guides/tools-skills
- Source type: official-docs

Agent Skills let you upload and reuse versioned bundles of files in hosted and local shell environments. A skill is a versioned bundle of files plus a `SKILL.md` manifest (front matter + instructions). Skills are compatible with the open Agent Skills standard.

Constraints: `SKILL.md` file matching is case-insensitive; exactly one `skill.md`/`SKILL.md` file allowed per skill bundle; frontmatter validation follows the agent skills specification; max zip upload size 50 MB; max file count per skill version 500; max uncompressed file size 25 MB.

Use `POST /v1/skills` to upload and validate a skill bundle. Models use skills via the shell and container; to use skills in the Responses API, attach them to the shell tool with `tools[].environment.skills` (`skill_reference` by `skill_id` + optional `version`/`"latest"`, or `inline` base64 zip bundle for skills you don't want to persist as a named resource).
