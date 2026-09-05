# Agent Skills | Cursor Docs
- URL: https://cursor.com/docs/skills
- Fetched: 2026-08-14
- Source type: official-docs
- Component: skills

# Agent Skills

Agent Skills is an open standard for extending AI agents with specialized capabilities. Skills package domain-specific knowledge and workflows that agents can use to perform specific tasks.

## What are skills?

A skill is a portable, version-controlled package that teaches agents how to perform domain-specific tasks. Skills can include scripts, templates, and references that agents may act on using their tools.

### Portable

Skills work across any agent that supports the Agent Skills standard.

### Version-controlled

Skills are stored as files and can be tracked in your repository, or installed via GitHub repository links.

### Actionable

Skills can include scripts, templates, and references that agents act on using their tools.

### Progressive

Skills load resources on demand, keeping context usage efficient.

## How skills work

When Cursor starts, it automatically discovers skills from skill directories and makes them available to Agent. The agent is presented with available skills and decides when they are relevant based on context.

Skills can also be manually invoked by typing `/` in Agent chat and searching for the skill name.

## Built-in Cursor skills

Cursor includes a small set of built in skills to improve your general workflows. These skills are managed by Cursor and appear alongside the skills you add yourself.

| Skill | What it does |
| ------------------------- | ---------------------------------------------------------------------------------------------------- |
| `/automate` | Creates Cursor Automations triggered by schedules, Slack messages, GitHub events, and other sources. |
| `/babysit` | Monitors a pull request and addresses feedback, conflicts, failing checks, and follow-up work. |
| `/canvas` | Creates interactive React artifacts that render alongside the conversation. |
| `/create-hook` | Creates Cursor hooks and updates `hooks.json` for agent lifecycle events. |
| `/create-rule` | Creates Cursor rules with the appropriate scope and instructions. |
| `/create-skill` | Creates Agent Skills, including their structure and `SKILL.md` files. |
| `/create-subagent` | Creates custom subagents with focused roles and delegation instructions. |
| `/cursor-blame` | Investigates AI-authored changes and the prompts that produced them. |
| `/loop` | Runs a prompt or skill repeatedly at a specified interval. |
| `/migrate-to-skills` | Converts eligible dynamic rules and slash commands into Agent Skills. |
| `/review` | Selects and runs the appropriate code-review agent. |
| `/review-bugbot` | Reviews code for likely bugs and regressions with Bugbot. |
| `/review-security` | Reviews code for security vulnerabilities with Security Review. |
| `/sdk` | Helps you build applications and integrations with the Cursor SDK. |
| `/shell` | Runs the provided text as a literal shell command. |
| `/split-to-prs` | Splits large changes into smaller pull requests. |
| `/statusline` | Configures the Cursor CLI status line. |
| `/update-cli-config` | Updates Cursor CLI settings in `~/.cursor/cli-config.json`. |
| `/update-cursor-settings` | Finds and updates the appropriate Cursor or VS Code setting. |

You can run any built-in skill by typing `/` in Agent chat and selecting its name. Agent may also use some built-in skills automatically when your request clearly matches their purpose.

## Skill directories

Skills are automatically loaded from these locations:

| Location | Scope |
| ------------------- | ------------------- |
| `.agents/skills/` | Project-level |
| `.cursor/skills/` | Project-level |
| `~/.agents/skills/` | User-level (global) |
| `~/.cursor/skills/` | User-level (global) |

For compatibility, Cursor also loads skills from Claude and Codex directories: `.claude/skills/`, `.codex/skills/`, `~/.claude/skills/`, and `~/.codex/skills/`.

Each skill should be a folder containing a `SKILL.md` file:

```text
.agents/
└── skills/
    └── my-skill/
        └── SKILL.md
```

Skills can also include optional directories for scripts, references, and assets:

```text
.agents/
└── skills/
    └── deploy-app/
        ├── SKILL.md
        ├── scripts/
        │   ├── deploy.sh
        │   └── validate.py
        ├── references/
        │   └── REFERENCE.md
        └── assets/
            └── config-template.json
```

### Nested skill directories

Skill directories can be organized into subdirectories. This is useful for grouping related skills by category, team, or domain. Cursor walks the skills root recursively and picks up any `SKILL.md` it finds:

```text
.cursor/
└── skills/
    ├── shipping/
    │   ├── land-it/
    │   │   └── SKILL.md
    │   └── careful-merge-conflicts/
    │       └── SKILL.md
    ├── debugging/
    │   └── using-datadog-mcp/
    │       └── SKILL.md
    └── workflow/
        └── tdd/
            └── SKILL.md
```

The category folder is purely organizational. The skill's identity comes from the folder containing `SKILL.md` (here `land-it`, `tdd`, etc.), not the parent category.

Cursor also discovers skills inside nested project subdirectories. A `.cursor/skills/` (or `.agents/skills/`) folder anywhere inside your repository is picked up, so monorepos can colocate skills with the package they apply to:

```text
my-monorepo/
├── .cursor/skills/         # repo-wide skills
│   └── land-it/SKILL.md
└── apps/
    └── web/
        └── .cursor/skills/  # app-specific skills
            └── deploy-web/SKILL.md
```

Skills in nested project directories are automatically scoped to files inside that directory. In the example above, `deploy-web` is only surfaced when the agent works with files under `apps/web/`, while skills in the repo-wide `.cursor/skills/` are available everywhere. This is similar to the `paths` frontmatter field — you don't need to set `paths` on a nested skill to scope it to its directory.

## SKILL.md file format

Each skill is defined in a `SKILL.md` file with YAML frontmatter:

```markdown
---
name: my-skill
description: Short description of what this skill does and when to use it.
---

# My Skill

Detailed instructions for the agent.

## When to Use

- Use this skill when...
- This skill is helpful for...

## Instructions

- Step-by-step guidance for the agent
- Domain-specific conventions
- Best practices and patterns
- Use the ask questions tool if you need to clarify requirements with the user
```

### Frontmatter fields

| Field | Required | Description |
| -------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name` | Yes | Skill identifier. Lowercase letters, numbers, and hyphens only. Must match the parent folder name. |
| `description` | Yes | Describes what the skill does and when to use it. Used by the agent to determine relevance. |
| `paths` | No | Glob patterns that scope the skill to matching files. Accepts a comma-separated string or a list. When set, the skill is only surfaced when the agent works with files that match. |
| `disable-model-invocation` | No | When `true`, the skill is only included when explicitly invoked via `/skill-name`. The agent will not automatically apply it based on context. |
| `metadata` | No | Arbitrary key-value mapping for additional metadata. |

## Scoping a skill to specific files

Use the `paths` field to limit a skill to files that match one or more glob patterns. The skill is then only surfaced to the agent when it is reading or editing matching files. This keeps file-specific guidance out of context for unrelated work.

```markdown
---
name: react-component-patterns
description: Conventions for writing React components in this codebase.
paths:
  - "**/*.tsx"
  - "packages/ui/**/*.ts"
---

# React component patterns

...
```

You can also pass a single comma-separated string:

```markdown
---
name: python-style
description: Style rules for Python files.
paths: "**/*.py, scripts/**/*.py"
---
```

Patterns follow standard glob syntax. Leave `paths` unset for a skill that should be available regardless of which files are open.

The legacy `globs` field is still accepted as a fallback for older skills, but new skills should use `paths`.

## Disabling automatic invocation

By default, skills are automatically applied when the agent determines they are relevant. Set `disable-model-invocation: true` to make a skill behave like a traditional slash command, where it is only included in context when you explicitly type `/skill-name` in chat.

## Including scripts in skills

Skills can include a `scripts/` directory containing executable code that agents can run. Reference scripts in your `SKILL.md` using relative paths from the skill root.

```markdown
---
name: deploy-app
description: Deploy the application to staging or production environments. Use when deploying code or when the user mentions deployment, releases, or environments.
---

# Deploy App

Deploy the application using the provided scripts.

## Usage

Run the deployment script: `scripts/deploy.sh <environment>`

Where `<environment>` is either `staging` or `production`.

## Pre-deployment Validation

Before deploying, run the validation script: `python scripts/validate.py`
```

The agent reads these instructions and executes the referenced scripts when the skill is invoked. Scripts can be written in any language—Bash, Python, JavaScript, or any other executable format supported by the agent implementation.

Scripts should be self-contained, include helpful error messages, and handle edge cases gracefully.

## Optional directories

Skills support these optional directories:

| Directory | Purpose |
| ------------- | ------------------------------------------------------ |
| `scripts/` | Executable code that agents can run |
| `references/` | Additional documentation loaded on demand |
| `assets/` | Static resources like templates, images, or data files |

Keep your main `SKILL.md` focused and move detailed reference material to separate files. This keeps context usage efficient since agents load resources progressively—only when needed.

## Viewing skills

To view discovered skills, open **Customize** in the sidebar and go to **Skills**. Skills installed from plugins or your project appear alongside rules in the **Agent Decides** section.

## Installing skills from GitHub

You can import skills from GitHub repositories:

1. Open **Customize** in the sidebar
2. Go to **Rules** and click **Add Rule**
3. Select **Remote Rule (Github)**
4. Enter the GitHub repository URL

## Migrating rules and commands to skills

Cursor includes a built-in `/migrate-to-skills` skill in 2.4 that helps you convert existing dynamic rules and slash commands to skills.

The migration skill converts:

- **Dynamic rules**: Rules that use the "Apply Intelligently" configuration—rules with `alwaysApply: false` (or undefined) and no `globs` patterns defined. These are converted to standard skills.
- **Slash commands**: Both user-level and workspace-level commands are converted to skills with `disable-model-invocation: true`, preserving their explicit invocation behavior.

To migrate:

1. Type `/migrate-to-skills` in Agent chat
2. The agent will identify eligible rules and commands and convert them to skills
3. Review the generated skills in `.cursor/skills/`

Rules with `alwaysApply: true` or specific `globs` patterns are not migrated, as they have explicit triggering conditions that differ from skill behavior. User rules are also not migrated since they are not stored on the file system.

## Learn more

Agent Skills is an open standard. Learn more at [agentskills.io](https://agentskills.io).
