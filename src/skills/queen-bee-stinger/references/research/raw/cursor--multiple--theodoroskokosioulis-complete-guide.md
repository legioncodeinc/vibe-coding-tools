# Cursor rules, commands, skills, and hooks: a complete guide - theodoros kokosioulis
- URL: https://theodoroskokosioulis.com/blog/cursor-rules-commands-skills-hooks-guide/
- Fetched: 2026-08-14
- Source type: community
- Component: multiple

Published: 2026-02-01

Your AI coding assistant is only as good as the context you give it. Cursor offers four ways to shape that context: rules, commands, skills, and hooks. Each serves a different purpose, and picking the right one stops you from repeating the same instructions, prompts, and checklists in every chat.

This guide breaks down what each feature does, when to use it, and how they work together.

If you only remember one thing:

- Rule: Always-on constraints (or file-scoped standards via globs).
- Command: A workflow you intentionally trigger with `/`.
- Skill: A playbook you want available, but only when the task calls for it.
- Hook: Automation and guardrails that run on events, without you prompting it.

Here's a concrete example to make the difference stick. If the agent keeps reformatting files in a way you hate, add a rule. If you only want a checklist when you're deploying, make it a skill. If you want formatting to run automatically after edits, use a hook.

## Rules: your always-on guardrails

Rules are persistent instructions that shape how Cursor's agent behaves. Think of them as your coding standards, architectural decisions, and project conventions bundled into markdown files.

When applied, rule contents appear at the start of the model's context. This gives the AI consistent guidance for every interaction.

### Types of rules

Cursor supports four rule types:

| Type | When it applies |
| --- | --- |
| Always | Every chat session, no exceptions |
| Agent decides | When the agent determines it's relevant based on description |
| Globs | When a file matches a specified pattern (e.g., `*.tsx`) |
| Manual | Only when you @-mention it in chat |

### Where rules live

- Project rules: `.cursor/rules/` directory, version-controlled with your codebase
- User rules: Cursor Settings → Rules, global to your environment
- Team rules: Dashboard-managed, available on Team and Enterprise plans
- AGENTS.md: Simple markdown file in project root as an alternative

### A practical example

Here's a rule that enforces TypeScript conventions:

`.cursor/rules/typescript.mdc`

```
---
description: TypeScript standards for all .ts and .tsx files
globs: ["*.ts", "*.tsx"]
---

# TypeScript standards

- Use strict typing. Never use `any`.
- Prefer `unknown` over `any` when type is uncertain.
- Use explicit return types for all functions.
- Prefer interfaces over type aliases for object shapes.
- Use discriminated unions instead of enums.
```

This rule only loads when you're working with TypeScript files, keeping context clean for other work.

### What makes a good rule

Good rules are focused, actionable, and scoped:

- Reference files instead of copying contents. This keeps rules short and prevents staleness.
- Be specific. "Use camelCase for variables" beats "follow good naming conventions."
- Keep rules under 500 lines. If you need more, split into multiple composable rules.
- Avoid duplicating what's in your codebase. Point to canonical examples.

Start simple. Add rules only when you notice the agent making the same mistake repeatedly. Don't over-optimize before you understand your patterns.

## Commands: your explicit workflows

Commands are reusable prompts triggered by typing `/` in chat. You define them, you invoke them, and the agent executes them.

Unlike rules that apply automatically, commands represent your explicit intent. You type `/review` because you want a code review right now.

### Where commands live

- Project: `.cursor/commands/` directory
- Global: `~/.cursor/commands/` directory
- Team: Dashboard-managed, synced to all team members

### Creating a command

Create a markdown file with a descriptive name:

```
.cursor/
└── commands/
    ├── code-review.md
    ├── create-pr.md
    └── run-tests.md
```

Here's what `code-review.md` might look like:

`.cursor/commands/code-review.md`

```
# Code review

Review the current changes with these criteria:

## Security
- Check for hardcoded secrets or credentials
- Verify input validation on user data
- Look for SQL injection or XSS vulnerabilities

## Performance
- Identify unnecessary re-renders in React components
- Check for N+1 query patterns
- Look for missing memoization

## Maintainability
- Verify functions are under 50 lines
- Check for duplicated logic
- Ensure error handling is consistent

Provide specific line numbers and code suggestions for each issue found.
```

Type `/code-review` in chat, and Cursor injects this prompt.

### Adding parameters

Commands accept additional context. Anything after the command name gets included:

```
/commit and /pr these changes to fix DX-523
```

This chains multiple commands and adds context about the ticket number.

## Skills: your on-demand expertise

Skills are portable packages that teach agents how to perform domain-specific tasks. The key difference from rules: the agent decides when to load them based on relevance.

Think of skills as lazy-loaded context. Cursor scans skill descriptions at startup but only loads the full content when the task demands it. This keeps your prompts short while still making deep, task-specific guidance available.

### How skills work

When you start a conversation, Cursor presents available skills to the agent. The agent reads the name and description, then loads the full skill content only when it determines relevance.

You can also invoke skills manually by typing `/skill-name` in chat.

### Skill structure

Skills live in specific directories:

```
.cursor/
└── skills/
    └── deploy-app/
        ├── SKILL.md
        ├── scripts/
        │   └── deploy.sh
        └── references/
            └── env-setup.md
```

Here's the `SKILL.md` format:

`.cursor/skills/deploy-app/SKILL.md`

```
---
name: deploy-app
description: Deploy the application to staging or production. Use when deploying code or discussing releases and environments.
---

# Deploy app

Deploy using the provided scripts.

## When to use
- User mentions "deploy", "release", or "ship"
- Changes are ready for staging or production
- User asks about environment configuration

## Workflow
1. Run validation: `python scripts/validate.py`
2. Deploy: `scripts/deploy.sh <environment>`
3. Verify deployment succeeded
4. Report back with the deployed URL

## Environments
- `staging`: Pre-production testing
- `production`: Live environment, requires extra confirmation
```

### Skills vs rules: the mental model

The distinction matters:

- Rules apply automatically based on triggers you define
- Skills are loaded when the agent determines they're relevant

Use this test: Would you want this instruction to apply even when you're not thinking about it?

Yes → Rule. No → Skill.

Some examples:

| Instruction | Type | Why |
| --- | --- | --- |
| "Never commit .env files" | Rule | Always applies, no exceptions |
| "When deploying, follow this checklist" | Skill | Only relevant during deployment |
| "Use these design tokens" | Rule | Applies to all UI work |
| "When writing release notes, use this format" | Skill | Only relevant for releases |

### Disabling automatic invocation

Set `disable-model-invocation: true` in the frontmatter to make a skill behave like a command. The agent won't auto-load it; you must explicitly type `/skill-name`.

## Hooks: your programmatic control

Hooks let you observe, control, and extend the agent loop using custom scripts. They run before or after specific events and can block, modify, or audit agent behavior.

This is the most powerful feature, and the most complex.

### When to use hooks

Hooks shine for:

- Running formatters after edits
- Scanning for secrets or PII before commits
- Blocking risky operations (e.g., SQL writes to production)
- Adding analytics for agent actions
- Injecting context at session start

### Hook events

Hooks fire at specific points in the agent lifecycle:

| Event | When it fires |
| --- | --- |
| `sessionStart` | New conversation begins |
| `beforeShellExecution` | Before running a terminal command |
| `afterFileEdit` | After the agent edits a file |
| `beforeReadFile` | Before reading a file |
| `preToolUse` | Before any tool execution |
| `stop` | When the agent loop ends |

### A simple example

Create `.cursor/hooks.json`:

`.cursor/hooks.json`

```
{
  "version": 1,
  "hooks": {
    "afterFileEdit": [
      {
        "command": ".cursor/hooks/format.sh"
      }
    ]
  }
}
```

Create the script at `.cursor/hooks/format.sh`:

`.cursor/hooks/format.sh`

```
#!/bin/bash
# Read the input JSON
input=$(cat)
file_path=$(echo "$input" | jq -r '.file_path')

# Run prettier on the edited file
npx prettier --write "$file_path" 2>/dev/null

exit 0
```

Now every file edit triggers automatic formatting.

### Blocking dangerous commands

Here's a hook that prevents destructive git commands:

`.cursor/hooks.json`

```
{
  "version": 1,
  "hooks": {
    "beforeShellExecution": [
      {
        "command": ".cursor/hooks/block-dangerous-git.sh",
        "matcher": "git"
      }
    ]
  }
}
```

`.cursor/hooks/block-dangerous-git.sh`

```
#!/bin/bash
input=$(cat)
command=$(echo "$input" | jq -r '.command')

# Block force pushes and hard resets
if echo "$command" | grep -qE '(push.*--force|reset.*--hard|clean.*-fd)'; then
  echo '{"permission": "deny", "user_message": "Blocked: destructive git command"}'
  exit 0
fi

echo '{"permission": "allow"}'
exit 0
```

The `matcher` field filters which commands trigger the hook, so this only runs for git commands.

### Prompt-based hooks

You can also use natural language instead of scripts:

`.cursor/hooks.json`

```
{
  "hooks": {
    "beforeShellExecution": [
      {
        "type": "prompt",
        "prompt": "Is this command safe? Only allow read-only operations.",
        "timeout": 10
      }
    ]
  }
}
```

The LLM evaluates the condition and returns a structured response.

## Choosing the right tool

Here's a decision tree:

```
Does this apply to EVERY conversation?
├── Yes → Rule (alwaysApply: true)
└── No
    ├── Should it apply based on file patterns?
    │   └── Yes → Rule (globs)
    └── No
        ├── Is it a specific workflow you trigger?
        │   └── Yes → Command
        └── No
            ├── Should the agent decide when it's relevant?
            │   └── Yes → Skill
            └── No
                ├── Do you need to block/modify agent actions?
                │   └── Yes → Hook
                └── Otherwise → Manual rule (@-mention)
```

### Quick reference table

| Feature | Who triggers | Best for | Context cost |
| --- | --- | --- | --- |
| Rules (always) | Cursor | Repo requirements, conventions | Always paid |
| Rules (globs) | File patterns | File-type-specific standards | Paid when matched |
| Rules (manual) | You (@-mention) | Rare but important context | Paid when invoked |
| Commands | You (/) | Repeatable workflows | Paid when used |
| Skills | Agent or you | Task-specific playbooks | Paid when needed |
| Hooks | Events | Automation, security, auditing | Doesn't use model context |

## Putting it all together

A well-configured project might look like this:

```
.cursor/
├── rules/
│   ├── typescript.mdc          # Always: coding standards
│   ├── testing.mdc             # Globs: *.test.ts files
│   └── security.mdc            # Always: security constraints
├── commands/
│   ├── review.md               # Trigger: /review
│   └── pr.md                   # Trigger: /pr
├── skills/
│   └── deploy/
│       ├── SKILL.md            # Agent-loaded when relevant
│       └── scripts/
│           └── deploy.sh
└── hooks.json                  # Automated formatting, security checks
```

Start with rules for your non-negotiables. Add commands for workflows you repeat. Introduce skills for domain expertise the agent should access on demand. Use hooks when you need programmatic control.

The goal isn't to use every feature; it's to give the agent the right context at the right time without polluting every conversation with information it doesn't need.
