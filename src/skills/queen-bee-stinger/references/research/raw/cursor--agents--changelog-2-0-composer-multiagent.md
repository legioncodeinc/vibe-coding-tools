# New Coding Model and Agent Interface (Cursor 2.0 Changelog)
- URL: https://cursor.com/changelog/2-0
- Fetched: 2026-08-14
- Source type: official-docs
- Component: agents

2.0 Oct 29, 2025 · Changelog

### #Multi-Agents

Manage agents in our new editor, with a sidebar for your agents and plans.

Run up to eight agents in parallel on a single prompt. This uses git worktrees or remote machines to prevent file conflicts. Each agent operates in its own isolated copy of your codebase.

### #Composer

Introducing our first agentic coding model. Composer is a frontier model that is 4x faster than similarly intelligent models.

The model is built for low-latency agentic coding in Cursor, completing most turns in under 30 seconds. Early testers found the ability to iterate quickly with the model delightful and trust the model for multi-step coding tasks.

Composer was trained with a set of powerful tools including codebase-wide semantic search, making it much better at understanding and working in large codebases.

### #Browser (GA)

Launched in beta in 1.7, browser for Agent is now GA. We've added additional support for Enterprise teams to use Browser in 2.0.

Browser can now be embedded in-editor, including powerful new tools to select elements and forward DOM information to the agent.

### #Improved Code Review

It's now easier to view all changes from Agent across multiple files without needing to jump between individual files.

### #Sandboxed Terminals (GA)

Launched in beta in 1.7, sandboxed terminals are now GA for macOS. We now run agent commands in the secure sandbox by default on macOS with 2.0.

Shell commands (that are not already allowlisted) will automatically run in a sandbox with read/write access to your workspace and no internet access.

### #Team Commands

Define custom commands and rules for your Team in the Cursor dashboard.

This context will then be automatically applied to all members of your team, without needing to store the files in your editor locally, and centrally managed by team admins.

### #Voice Mode

Control Agent with your voice using built-in speech-to-text conversion. You can also define custom submit keywords in settings to trigger the agent to begin running.

### #Improved Performance

Cursor uses Language Server Protocols (LSPs) for language-specific features like go to definition, hover tooltips, diagnostics, and more.

We've drastically improved the performance of loading and using LSPs for all languages. This is particularly noticeable when working with agent and viewing diffs.

Python and TypeScript LSPs now are faster by default for large projects with higher memory limits dynamically configured based on available RAM.

We've also fixed a number of memory leaks and improved overall memory usage.

### #Plan Mode in Background

Create your plan with one model and build the plan with another. You can choose to build the plan in the foreground or background, or even plan with parallel agents to have multiple plans to review.

### #Shareable Team Commands

Share custom rules, commands, and prompts with your entire team. Create deeplinks through the Cursor Docs.

### #Improved Prompt UI

Files and directories are now shown inline as pills. We've also improved copy/pasting prompts with tagged context.

We've removed many explicit items in the context menu, including @Definitions, @Web, @Link, @Recent Changes, @Linter Errors, and others. Agent can now self-gather context without needing to manually attach it in the prompt input.

### #Improved Agent Harness

We've greatly improved the underlying harness for working with Agent across all models. This has notable quality improvements, especially for GPT-5 Codex.

### #Cloud Agents

Cloud agents now offer 99.9% reliability, instant startup, and a new UI coming soon. We've also improved the experience of sending agents to the cloud from the editor.

### #Cursor for Enterprise

#### #Sandboxed Terminals: Admin Controls

Enterprise can now enforce standard settings for Sandboxed Terminals across their team. Configure sandbox availability, git access, and network access at the team level.

#### #Hooks: Cloud Distribution

Enterprise teams can now distribute hooks directly from the web dashboard. Admins can add new hooks, save drafts, and select which hooks should apply to which operating systems.

#### #Audit Log

View a timestamped log of admin events in Cursor: user access, setting changes, Team Rule edits, and member management events.

### Improvements (8)

- Optimized text parsing for chat rendering.
- Increased default memory for TypeScript language server.
- Simplified text rendering within chat to use the LSP less.
- Simplified rendering within worktrees to use a simpler LSP.
- Simplified the agent to use the LSP less when reading files.
- Optimized `findFiles` performance to batch concurrent calls at bounded concurrency.
- Notepads have been deprecated.
- Background Agents have been renamed to Cloud Agents.

### Patches (1)

- 2.0.1-2.0.28: Bug fixes
