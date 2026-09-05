# Commands reference (built-in and bundled commands)
- URL: https://code.claude.com/docs/en/commands
- Fetched: 2026-08-14
- Source type: official-docs
- Component: commands

# Commands

> Complete reference for commands available in Claude Code, including built-in commands and bundled skills.

Commands control Claude Code from inside a session. They provide a quick way to switch models, manage permissions, clear context, run a workflow, and more.

Type `/` to see the commands available to you, or type `/` followed by letters to filter.

A command is only recognized at the start of your message. Text that follows the command name becomes its arguments. As of v2.1.199, [skills](/docs/en/skills#pass-arguments-to-skills) are the exception: a skill invocation followed by more skills, such as `/skill-a /skill-b do XYZ`, loads every skill named at the start and passes the trailing text to each as arguments. Up to six skills can be chained.

If you send a command while Claude is responding, it queues and runs after the current turn finishes. Some commands, such as `/status`, `/tasks`, and `/usage`, run immediately without interrupting the response.

## Commands across a typical workflow

Most commands are useful at a specific point in a session, from setting up a project to shipping a change.

**First session in a repo.** Run `/init` to generate a starter `CLAUDE.md`, then `/memory` to refine it. Use `/mcp` to set up any servers the project needs, ask Claude to create any [subagents](/docs/en/sub-agents) you want, and run `/permissions` to set your approval rules.

**During a task.** `/plan` switches into plan mode before a large change. `/model` and `/effort` adjust which model you're using and how much reasoning it applies. When the conversation gets long, `/context` shows what's filling the window and `/compact` summarizes it to free space. Use `/btw` for a side question that shouldn't add to the conversation history.

**Run work in parallel.** Claude delegates side tasks to [subagents](/docs/en/sub-agents), and `/tasks` lists the current session's background work, including subagents that have finished. `/background` detaches the whole session to keep running as a [background agent](/docs/en/agent-view) and frees your terminal. For a large change that spans the codebase, `/batch` decomposes it into independent units and runs each in its own [worktree](/docs/en/worktrees). See [Run agents in parallel](/docs/en/agents) for how these approaches relate.

**Before you ship.** `/diff` shows what changed. `/code-review` checks the current diff for correctness bugs and cleanups and can apply the findings with `--fix`; pass a PR number, such as `/code-review high 1234`, to review a pull request instead. `/review` is an alias. `/code-review ultra` runs a multi-agent review in the cloud. `/security-review` checks the diff for security vulnerabilities.

**Between sessions.** `/clear` starts fresh on a new task while keeping project memory. `/resume` returns to an earlier conversation, `/branch` branches the current one to try a different direction, and `/fork` copies it into a new [background session](/docs/en/agent-view). `/teleport` pulls a web session into this terminal, and `/remote-control` lets you continue this local session from another device.

**When something is wrong.** `/rewind` rolls code and conversation back to a checkpoint, or summarizes part of the conversation. `/doctor` runs a setup checkup that diagnoses installation and configuration issues and can fix them, `/debug` diagnoses runtime issues, and `/feedback` reports a bug with session context attached.

## All commands

The table below lists all the commands included in Claude Code. Most are built-in commands whose behavior is coded into the CLI. Two kinds of entries are marked:

* **[Skill](/docs/en/skills#bundled-skills)**: a bundled skill. It works like skills you write yourself: a prompt handed to Claude, which Claude can also invoke automatically when relevant.
 * `/verify` runs only when you invoke it. Before v2.1.215, Claude could also run `/verify` on its own.
* **[Workflow](/docs/en/workflows#bundled-workflows)**: a bundled [dynamic workflow](/docs/en/workflows) that fans work out across many subagents and runs in the background.
 * `/deep-research` runs only when you invoke it. Before v2.1.218, Claude could also start it on its own.

To add your own commands, see [skills](/docs/en/skills).

In the table below, ` ` indicates a required argument and `[arg]` indicates an optional one.


 Not every command appears for every user. Availability depends on your platform, plan, and environment. For example, `/desktop` only shows on macOS and x64 Windows when signed in with a Claude subscription, and `/upgrade` doesn't show on Enterprise plans.


| Command | Purpose |
| :-------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/add-dir ` | Add a working directory for file access during the current session. Type a partial path to see matching directory suggestions; press `Tab` to accept one. Most `.claude/` configuration is [not discovered](/docs/en/permissions#additional-directories-grant-file-access-not-configuration) from the added directory. A successful add runs your [`DirectoryAdded` hooks](/docs/en/hooks#directoryadded) |
| `/advisor [model\|off]` | Enable or disable the [advisor tool](/docs/en/advisor), which consults a second model for guidance at key moments during a task. Accepts `fable`, `opus`, `sonnet`, or a full model ID. `fable` requires [Fable 5 access](/docs/en/advisor#choose-an-advisor-model). Without an argument, opens a picker |
| `/agents` | As of v2.1.198, running `/agents` prints a reminder to ask Claude to create or manage [subagents](/docs/en/sub-agents), or to edit `.claude/agents/` or `~/.claude/agents/` directly. On v2.1.197 and earlier, opens an interactive interface for creating and managing subagent configurations |
| `/autocompact [auto\|]` | Set the auto-compact window: how full the context window gets before Claude Code compacts automatically. Pass a size such as `500k`, or `auto` to return to the window tuned for your model. Claude Code saves the value to user settings and applies it to the current session. See [Set the auto-compact window](/docs/en/model-config#set-the-auto-compact-window) for accepted values and what overrides it. Without an argument, opens a dialog that shows the current window. Requires Claude Code v2.1.221 or later |
| `/autofix-pr [prompt]` | Spawn a [Claude Code on the web](/docs/en/claude-code-on-the-web#auto-fix-pull-requests) session that watches the current branch's PR and pushes fixes when CI fails or reviewers leave comments. Detects the open PR from your checked-out branch with `gh pr view`; to watch a different PR, check out its branch first. By default the cloud session is told to fix every CI failure and review comment; pass a prompt to give it different instructions, for example `/autofix-pr only fix lint and type errors`. Requires the `gh` CLI and access to [Claude Code on the web](/docs/en/claude-code-on-the-web) |
| `/background [prompt]` | Detach the current session to run as a [background agent](/docs/en/agent-view) and free this terminal. Pass a prompt to send one more instruction before detaching. Monitor the session with `claude agents`. To copy the conversation into a new background session while this one keeps running, use `/fork`. Alias: `/bg` |
| `/batch ` | **[Skill](/docs/en/skills#bundled-skills).** Orchestrate large-scale changes across a codebase in parallel. Researches the codebase, decomposes the work into 5 to 30 independent units, and presents a plan. Once approved, spawns one [background subagent](/docs/en/sub-agents#run-subagents-in-foreground-or-background) per unit in an isolated [git worktree](/docs/en/worktrees). Each subagent implements its unit, runs tests, and opens a pull request. Requires a git repository. Example: `/batch migrate src/ from Solid to React` |
| `/branch [name]` | Create a branch of the current conversation at this point, so you can try a different direction without losing the conversation as it stands. Switches you into the branch and preserves the original, which you can return to with `/resume`. To run a copy as a separate [background session](/docs/en/agent-view) instead of switching into it, use `/fork`; to hand a side task to a [subagent](/docs/en/sub-agents) that reports back into this conversation, use `/subtask` |
| `/btw [question]` | Ask a [side question](/docs/en/interactive-mode#side-questions-with-%2Fbtw) about the current session without adding to the conversation. If you run `/btw` without a question, Claude Code shows your most recent side question so you can browse earlier answers; if you haven't asked one yet, Claude Code prints a usage line. Before v2.1.212, `/btw` required a question |
| `/bug [report]` | Report a bug or share your conversation. You choose how much session history to include and confirm on a consent screen before anything is sent. When you're signed in to Anthropic on a first-party connection, the report goes to Anthropic; on a third-party provider, or without Anthropic credentials, Claude Code writes the report to a [local archive under `~/.claude/feedback-bundles/`](/docs/en/data-usage#telemetry-services) that you forward yourself. In the [VS Code extension](/docs/en/vs-code#use-the-prompt-box), `/bug` opens the extension's own feedback dialog instead; requires Claude Code v2.1.229 or later. Alias: `/share`. Before v2.1.212, `/bug` and `/share` were aliases of `/feedback` |
| `/cd ` | Move this session to a new working directory, keeping the conversation and its prompt cache. Type a partial path to see matching directory suggestions; press `Tab` to accept one. Claude Code prompts you to [trust the workspace](/docs/en/permissions#project-allow-rules-and-workspace-trust) if you haven't worked in it before, and `--resume` [finds the moved session](/docs/en/sessions#resume-a-session) afterward. To grant access to an extra directory without moving the session, use `/add-dir`. Restrict or disable `/cd` targets with [`Cd` permission rules](/docs/en/permissions#cd). Requires Claude Code v2.1.169 or later |
| `/chrome` | Configure [Claude in Chrome](/docs/en/chrome) settings |
| `/claude-api [migrate\|managed-agents-onboard\|prompt-audit]` | **[Skill](/docs/en/skills#bundled-skills).** Load [Claude API](https://platform.claude.com/docs/en/api/overview) and Managed Agents reference material for your project's language. Also activates automatically when your code imports `anthropic` or `@anthropic-ai/sdk`. Run `migrate` to upgrade existing Claude API code to a newer model, `managed-agents-onboard` for a walkthrough that creates a new Managed Agent, or `prompt-audit` to flag instructions written for older models in your prompts, skills, and tool descriptions and propose fixes as a diff. The `prompt-audit` subcommand requires Claude Code v2.1.221 or later |
| `/clear [name]` | Start a new conversation with empty context. Pass a name to label the previous conversation in the `/resume` picker. To free up context while continuing the same conversation, use `/compact` instead. Resume the previous conversation with `/resume`, or, in the same Claude Code process, restore it from [the rewind menu's previous-session entry](/docs/en/checkpointing#rewind-past-a-cleared-conversation). Aliases: `/reset`, `/new` |
| `/code-review [low\|medium\|high\|xhigh\|max\|ultra] [--fix] [--comment] [pr#\|branch\|path]` | **[Skill](/docs/en/skills#bundled-skills).** Review the current diff, or a PR number, branch, or path you pass, for correctness bugs and cleanup opportunities. Pass `--fix` to apply findings, `--comment` to post them as inline GitHub PR comments, or `ultra` to run a deep [cloud review](/docs/en/ultrareview). With `ultra` on a `github.com` PR target, `--post` preselects [posting the finished findings to the PR](/docs/en/ultrareview#post-findings-to-the-pull-request) in the launch dialog. See [Review a diff locally](/docs/en/code-review#review-a-diff-locally) for the effort levels, targeting, and how it relates to `/simplify`. Alias: `/review` |
| `/color [color\|default]` | Set the prompt bar color for the current session. Available colors: `red`, `blue`, `green`, `yellow`, `purple`, `orange`, `pink`, `cyan`. Use `default` to reset, or run with no argument to pick a random color. When [Remote Control](/docs/en/remote-control) is connected, the color syncs to claude.ai/code. Also available in non-interactive mode (`-p`); requires Claude Code v2.1.205 or later |
| `/compact [instructions]` | Free up context by summarizing the conversation so far. Optionally pass focus instructions for the summary. See [how compaction handles rules, skills, and memory files](/docs/en/context-window#what-survives-compaction) |
| `/config [key=value ...]` | Open the [Settings](/docs/en/settings) interface to adjust theme, model, [output style](/docs/en/output-styles), and other preferences. From v2.1.181, pass one or more `key=value` pairs to set a setting directly without opening the interface, for example `/config thinking=false`. From v2.1.182, named shorthand keys are also accepted, such as `/config theme=dark` or `/config model=sonnet`. The `key=value` form also works in non-interactive mode (`-p`) and from the Claude mobile app via [Remote Control](/docs/en/remote-control). Run `/config --help` to list every settable key with its options. Alias: `/settings` |
| `/context [all]` | Visualize current context usage as a colored grid. Shows optimization suggestions for context-heavy tools, memory bloat, and capacity warnings. When the conversation exceeds the context window, the output includes a [warning](/docs/en/errors#context-exceeds-the-token-limit) showing how far over the limit you are and which command frees space. In [fullscreen mode](/docs/en/fullscreen), `/context` collapses the per-item breakdown to keep the grid visible. Pass `all` to expand it |
| `/copy [N]` | Copy the last assistant response to clipboard. Pass a number `N` to copy the Nth-latest response: `/copy 2` copies the second-to-last. When code blocks are present, shows an interactive picker to select individual blocks or the full response. Press `w` in the picker to write the selection to a file instead of the clipboard, which is useful over SSH |
| `/cost` | Alias for `/usage` |
| `/dataviz [request]` | **[Skill](/docs/en/skills#bundled-skills).** Design guidance for charts, graphs, and dashboards. Claude picks the chart form for the data, assigns color by role, validates the palette for colorblind safety and contrast with a bundled script, and applies mark, interaction, and accessibility rules. Uses a brand-neutral placeholder palette that you replace with your own. Requires Claude Code v2.1.198 or later |
| `/debug [description]` | **[Skill](/docs/en/skills#bundled-skills).** Enable debug logging for the current session and troubleshoot issues by reading the session debug log. Debug logging is off by default unless you started with `claude --debug`, so running `/debug` mid-session starts capturing logs from that point forward. Optionally describe the issue to focus the analysis |
| `/deep-research ` | **[Workflow](/docs/en/workflows#bundled-workflows).** Fan out web searches on a question, fetch and cross-check sources, and synthesize a cited report |
| `/design-login` | Authorize design-system access for `/design-sync` with your claude.ai account |
| `/design-sync [hint]` | **[Skill](/docs/en/skills#bundled-skills).** Convert your repo's React design system and upload it to [Claude Design](https://claude.ai/design), so designs it produces use your real components. Optionally name the design system, for example `/design-sync Acme DS`. A first-time sync verifies every component and can take a few hours on a large repo. Available on the Anthropic API; on Amazon Bedrock, Google Cloud's Agent Platform, Microsoft Foundry, and Claude Platform on AWS the underlying tool can't reach claude.ai, so the command is unavailable |
| `/desktop` | Continue the current session in the Claude Code Desktop app. Requires macOS or x64 Windows and a Claude subscription. Alias: `/app` |
| `/diff` | Open an interactive diff viewer showing uncommitted changes and per-turn diffs. Use left/right arrows to switch between the current git diff and individual Claude turns, and up/down to browse files. Press Enter to open the selected file's diff, scroll it with up/down or PageUp/PageDown, and press Esc to return to the file list. Claude Code computes these diffs from raw git blob content, so diff drivers and `textconv` filters configured

# agentskills.io
URL: https://agentskills.io

> ## Documentation Index
> Fetch the complete documentation index at: https://agentskills.io/llms.txt
> Use this file to discover all available pages before exploring further.

# Agent Skills Overview

> A standardized way to give AI agents new capabilities and expertise.

export const LogoCarousel = ({clients}) => {
 const [shuffled, setShuffled] = useState(clients);
 useEffect(() => {
 const shuffle = items => {
 const copy = [...items];
 for (let i = copy.length - 1; i > 0; i--) {
 const j = Math.floor(Math.random() * (i + 1));
 [copy[i], copy[j]] = [copy[j], copy[i]];
 }
 return copy;
 };
 setShuffled(shuffle(clients));
 }, []);
 const doubled = [...shuffled, ...shuffled];
 const GAP_PX = 48;
 const PX_PER_SECOND = 40;
 const cycleWidth = shuffled.reduce((sum, client) => sum + 150 * (client.scale || 1) + GAP_PX, 0);
 const cycleDuration = cycleWidth / PX_PER_SECOND;
 const Logo = ({client}) =>


;
 return

 {doubled.map((client, i) =>

)}

;
};

export const clients = [{
 name: "Junie",
 description: "Junie is an LLM-agnostic coding agent built for real-world development. It is built on top of the IntelliJ Platform, so it understands your project the same way your editor does.",
 url: "https://junie.jetbrains.com/",
 lightSrc: "/images/logos/junie/junie-logo-on-white.svg",
 darkSrc: "/images/logos/junie/junie-logo-on-dark.svg",
 instructionsUrl: "https://junie.jetbrains.com/docs/agent-skills.html"
}, {
 name: "ZeroClaw",
 description: "ZeroClaw is an open-source, Rust-first AI agent runtime for local, provider-agnostic personal agents with Agent Skills support.",
 url: "https://www.zeroclawlabs.ai/",
 lightSrc: "/images/logos/zeroclaw/zeroclaw-logo-light.png",
 darkSrc: "/images/logos/zeroclaw/zeroclaw-logo-dark.png",
 scale: 0.45,
 instructionsUrl: "https://docs.zeroclawlabs.ai/master/en/tools/skills.html",
 sourceCodeUrl: "https://github.com/zeroclaw-labs/zeroclaw"
}, {
 name: "Gemini CLI",
 description: "Gemini CLI is an open-source AI agent that brings the power of Gemini directly into your terminal.",
 url: "https://geminicli.com",
 lightSrc: "/images/logos/gemini-cli/gemini-cli-logo_light.svg",
 darkSrc: "/images/logos/gemini-cli/gemini-cli-logo_dark.svg",
 instructionsUrl: "https://geminicli.com/docs/cli/skills/",
 sourceCodeUrl: "https://github.com/google-gemini/gemini-cli"
}, {
 name: "Autohand Code CLI",
 description: "Autohand Code CLI is an autonomous LLM-powered coding agent that lives in your terminal. It uses the ReAct (Reason + Act) pattern to understand your codebase, plan changes, and execute them with your approval.",
 url: "https://autohand.ai/",
 lightSrc: "/images/logos/autohand/autohand-light.svg",
 darkSrc: "/images/logos/autohand/autohand-dark.svg",
 scale: 0.8,
 instructionsUrl: "https://autohand.ai/docs/working-with-autohand-code/agent-skills.html",
 sourceCodeUrl: "https://github.com/autohandai/code-cli"
}, {
 name: "OpenCode",
 description: "OpenCode is an open source agent that helps you write code in your terminal, IDE, or desktop.",
 url: "https://opencode.ai/",
 lightSrc: "/images/logos/opencode/opencode-wordmark-light.svg",
 darkSrc: "/images/logos/opencode/opencode-wordmark-dark.svg",
 instructionsUrl: "https://opencode.ai/docs/skills/",
 sourceCodeUrl: "https://github.com/sst/opencode"
}, {
 name: "OpenHands",
 description: "OpenHands is the open platform for cloud coding agents. Scale from one to thousands of agents — open source, model-agnostic, and enterprise-ready.",
 url: "https://openhands.dev/",
 lightSrc: "/images/logos/openhands/openhands-logo-light.svg",
 darkSrc: "/images/logos/openhands/openhands-logo-dark.svg",
 instructionsUrl: "https://docs.openhands.dev/overview/skills",
 sourceCodeUrl: "https://github.com/OpenHands/OpenHands"
}, {
 name: "Mux",
 description: "Mux makes it easy to run parallel coding agents, each with its own isolated workspace, right from your browser or desktop. Mux is open source and LLM provider-agnostic.",
 url: "https://mux.coder.com/",
 lightSrc: "/images/logos/mux/mux-editor-light.svg",
 darkSrc: "/images/logos/mux/mux-editor-dark.svg",
 scale: 0.8,
 instructionsUrl: "https://mux.coder.com/agent-skills",
 sourceCodeUrl: "https://github.com/coder/mux"
}, {
 name: "Cursor",
 description: "Cursor is an AI editor and coding agent. Use it to understand your codebase, plan and build features, fix bugs, review changes, and work with the tools you already use.",
 url: "https://cursor.com/",
 lightSrc: "/images/logos/cursor/LOCKUP_HORIZONTAL_2D_LIGHT.svg",
 darkSrc: "/images/logos/cursor/LOCKUP_HORIZONTAL_2D_DARK.svg",
 instructionsUrl: "https://cursor.com/docs/context/skills"
}, {
 name: "Amp",
 description: "Amp is the frontier coding agent that lets you wield the full power of leading models.",
 url: "https://ampcode.com/",
 lightSrc: "/images/logos/amp/amp-logo-light.svg",
 darkSrc: "/images/logos/amp/amp-logo-dark.svg",
 scale: 0.8,
 instructionsUrl: "https://ampcode.com/manual#agent-skills"
}, {
 name: "Letta",
 description: "Letta is the platform for building stateful agents: AI with advanced memory that can learn and self-improve over time.",
 url: "https://www.letta.com/",
 lightSrc: "/images/logos/letta/Letta-logo-RGB_OffBlackonTransparent.svg",
 darkSrc: "/images/logos/letta/Letta-logo-RGB_GreyonTransparent.svg",
 instructionsUrl: "https://docs.letta.com/letta-code/skills/",
 sourceCodeUrl: "https://github.com/letta-ai/letta"
}, {
 name: "Firebender",
 description: "Firebender is the first Android-native coding agent that writes features, tests them in the emulator, and fixes issues automatically.",
 url: "https://firebender.com/",
 lightSrc: "/images/logos/firebender/firebender-wordmark-light.svg",
 darkSrc: "/images/logos/firebender/firebender-wordmark-dark.svg",
 instructionsUrl: "https://docs.firebender.com/multi-agent/skills"
}, {
 name: "Goose",
 description: "Goose is an open source, extensible AI agent that goes beyond code suggestions — install, execute, edit, and test with any LLM.",
 url: "https://block.github.io/goose/",
 lightSrc: "/images/logos/goose/goose-logo-black.png",
 darkSrc: "/images/logos/goose/goose-logo-white.png",
 instructionsUrl: "https://block.github.io/goose/docs/guides/context-engineering/using-skills/",
 sourceCodeUrl: "https://github.com/block/goose"
}, {
 name: "GitHub Copilot",
 description: "GitHub Copilot works alongside you directly in your editor, suggesting whole lines or entire functions for you.",
 url: "https://github.com/",
 lightSrc: "/images/logos/github/GitHub_Lockup_Dark.svg",
 darkSrc: "/images/logos/github/GitHub_Lockup_Light.svg",
 instructionsUrl: "https://docs.github.com/en/copilot/concepts/agents/about-agent-skills",
 sourceCodeUrl: "https://github.com/microsoft/vscode-copilot-chat"
}, {
 name: "VS Code",
 description: "Visual Studio Code combines the simplicity of a code editor with what developers need for their core edit-build-debug cycle.",
 url: "https://code.visualstudio.com/",
 lightSrc: "/images/logos/vscode/vscode.svg",
 darkSrc: "/images/logos/vscode/vscode-alt.svg",
 instructionsUrl: "https://code.visualstudio.com/docs/copilot/customization/agent-skills",
 sourceCodeUrl: "https://github.com/microsoft/vscode"
}, {
 name: "Claude Code",
 description: "Claude Code is an agentic coding tool that reads your codebase, edits files, runs commands, and integrates with your development tools. Available in your terminal, IDE, desktop app, and browser.",
 url: "https://claude.ai/code",
 lightSrc: "/images/logos/claude-code/Claude-Code-logo-Slate.svg",
 darkSrc: "/images/logos/claude-code/Claude-Code-logo-Ivory.svg",
 instructionsUrl: "https://code.claude.com/docs/en/skills"
}, {
 name: "Claude",
 description: "Claude is Anthropic's AI, built for problem solvers. Tackle complex challenges, analyze data, write code, and think through your hardest work.",
 url: "https://claude.ai/",
 lightSrc: "/images/logos/claude-ai/Claude-logo-Slate.svg",
 darkSrc: "/images/logos/claude-ai/Claude-logo-Ivory.svg",
 instructionsUrl: "https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview"
}, {
 name: "ChatGPT & Codex",
 description: "ChatGPT brings together agents for different kinds of work, including Codex for software development and ChatGPT Work for broader work. Use ChatGPT across desktop, web, and mobile, with Codex also available in your editor and terminal.",
 url: "https://chatgpt.com/codex/",
 lightSrc: "/images/logos/chatgpt/light.svg",
 darkSrc: "/images/logos/chatgpt/dark.svg",
 instructionsUrl: "https://developers.openai.com/codex/skills/",
 sourceCodeUrl: "https://github.com/openai/codex"
}, {
 name: "Piebald",
 description: "Piebald is a desktop & web app that makes it easier than ever to do agentic development, while at the same time giving you complete control over the configuration, context, and flow.",
 url: "https://piebald.ai",
 lightSrc: "/images/logos/piebald/Piebald_wordmark_light.svg",
 darkSrc: "/images/logos/piebald/Piebald_wordmark_dark.svg"
}, {
 name: "Factory",
 description: "Factory is an AI-native software development platform that works everywhere you do. From IDE to CI/CD — delegate complete tasks like refactors, incident response, and migrations to Droids without changing your tools, models, or workflow.",
 url: "https://factory.ai/",
 lightSrc: "/images/logos/factory/factory-logo-light.svg",
 darkSrc: "/images/logos/factory/factory-logo-dark.svg",
 instructionsUrl: "https://docs.factory.ai/cli/configuration/skills"
}, {
 name: "pi",
 description: "Pi is a minimal terminal coding harness. Adapt pi to your workflows, not the other way around.",
 url: "https://shittycodingagent.ai/",
 lightSrc: "/images/logos/pi/pi-logo-light.svg",
 darkSrc: "/images/logos/pi/pi-logo-dark.svg",
 scale: 0.55,
 instructionsUrl: "https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/skills.md",
 sourceCodeUrl: "https://github.com/badlogic/pi-mono"
}, {
 name: "Databricks Genie Code",
 description: "Genie Code is an autonomous AI partner purpose-built for data work in Databricks.",
 url: "https://databricks.com/",
 lightSrc: "/images/logos/databricks/databricks-logo-light.svg",
 darkSrc: "/images/logos/databricks/databricks-logo-dark.svg",
 instructionsUrl: "https://docs.databricks.com/aws/en/assistant/skills"
}, {
 name: "Agentman",
 description: "Agentman is an agentic healthcare platform. It automates revenue cycle workflows using AI agents without sacrificing control. Every action is testable, traceable, and auditable.",
 url: "https://agentman.ai/",
 lightSrc: "/images/logos/agentman/agentman-wordmark-light.svg",
 darkSrc: "/images/logos/agentman/agentman-wordmark-dark.svg",
 instructionsUrl: "https://agentman.ai/agentskills"
}, {
 name: "TRAE",
 description: "Trae is an adaptive AI IDE that transforms how you work, collaborating with you to run faster.",
 url: "https://trae.ai/",
 lightSrc: "/images/logos/trae/trae-logo-lightmode.svg",
 darkSrc: "/images/logos/trae/trae-logo-darkmode.svg",
 instructionsUrl: "https://www.trae.ai/blog/trae_tutorial_0115",
 sourceCodeUrl: "https://github.com/bytedance/trae-agent"
}, {
 name: "Spring AI",
 description: "Spring AI aims to streamline the development of applications that incorporate artificial intelligence functionality without unnecessary complexity.",
 url: "https://docs.spring.io/spring-ai/reference",
 lightSrc: "/images/logos/spring-ai/spring-ai-logo-light.svg",
 darkSrc: "/images/logos/spring-ai/spring-ai-logo-dark.svg",
 instructionsUrl: "https://spring.io/blog/2026/01/13/spring-ai-generic-agent-skills/",
 sourceCodeUrl: "https://github.com/spring-projects/spring-ai"
}, {
 name: "Roo Code",
 description: "Roo Code puts an entire AI dev team right in your editor, outpacing closed tools with deep project-wide context, multi-step agentic coding, and unmatched developer-centric flexibility.",
 url: "https://roocode.com",
 lightSrc: "/images/logos/roo-code/roo-code-logo-black.svg",
 darkSrc: "/images/logos/roo-code/roo-code-logo-white.svg",
 instructionsUrl: "https://docs.roocode.com/features/skills",
 sourceCodeUrl: "https://github.com/RooCodeInc/Roo-Code"
}, {
 name: "Mistral AI Vibe",
 description: "Mistral Vibe is a command-line coding assistant powered by Mistral's models. It provides a conversational interface to your codebase, allowing you to use natural language to explore, modify, and interact with your projects through a powerful set of tools.",
 url: "https://github.com/mistralai/mistral-vibe",
 lightSrc: "/images/logos/mistral-vibe/vibe-logo_black.svg",
 darkSrc: "/images/logos/mistral-vibe/vibe-logo_white.svg",
 scale: 0.55,
 instructionsUrl: "https://github.com/mistralai/mistral-vibe",
 sourceCodeUrl: "https://github.com/mistralai/mistral-vibe"
}, {
 name: "Command Code",
 description: "Command Code is a coding agent that continuously learns your coding taste. Our meta neuro-symbolic AI model taste-1 with continuous reinforcement learning combines LLMs with your coding taste.",
 url: "https://commandcode.ai/",
 lightSrc: "/images/logos/command-code/command-code-logo-for-light.svg",
 darkSrc: "/images/logos/command-code/command-code-logo-for-dark.svg",
 scale: 1.33,
 instructionsUrl: "https://commandcode.ai/docs/skills"
}, {
 name: "Ona",
 description: "Ona is a platform for background agents. Run a team of AI software engineers in the cloud. Orchestrated, governed, secured at the kernel.",
 url: "https://ona.com",
 lightSrc: "/images/logos/ona/ona-wordmark-light.svg",
 darkSrc: "/images/logos/ona/ona-wordmark-dark.svg",
 scale: 0.8,
 instructionsUrl: "https://ona.com/docs/ona/agents-md#skills-for-repository-specific-workflows"
}, {
 name: "VT Code",
 description: "VT Code is an open-source coding agent with LLM-native code understanding and robust shell safety. Supports multiple LLM providers with automatic failover and efficient context management.",
 url: "https://github.com/vinhnx/vtcode",
 lightSrc: "/images/logos/vtcode/vt_code_light.svg",
 darkSrc: "/images/logos/vtcode/vt_code_dark.svg",
 instructionsUrl: "https://github.com/vinhnx/vtcode/blob/main/docs/skills/SKILLS_GUIDE.md",
 sourceCodeUrl: "https://github.com/vinhnx/VTCode"
}, {
 name: "Qodo",
 description: "Qodo is an agentic code integrity platform for reviewing, testing, and writing code, integrating AI across development workflows to strengthen code quality at every stage.",
 url: "https://www.qodo.ai/",
 lightSrc: "/images/logos/qodo/qodo-logo-light.png",
 darkSrc: "/images/logos/qodo/qodo-logo-dark.svg",
 instructionsUrl: "https://www.qodo.ai/blog/how-i-use-qodos-agent-skills-to-auto-fix-issues-in-pull-requests/"
}, {
 name: "Laravel Boost",
 description: "Laravel Boost accelerates AI-assisted development by providing the essential guidelines and agent skills that help AI agents write high-quality Laravel applications that adhere to Laravel best practices.",
 url: "https://github.com/laravel/boost",
 lightSrc: "/images/logos/laravel-boost/boost-light-mode.svg",
 darkSrc: "/images/logos/laravel-boost/boost-dark-mode.svg",
 instructionsUrl: "https://laravel.com/docs/12.x/boost#agent-skills",
 sourceCodeUrl: "https://github.com/laravel/boost"
}, {
 name: "Emdash",
 description: "Emdash is a provider-agnostic desktop app that lets you run multiple coding agents in parallel, each isolated in its own git worktree, either locally or over SSH on a remote machine.",
 url: "https://emdash.sh",
 lightSrc: "/images/logos/emdash/emdash-logo-light.svg",
 darkSrc: "/images/logos/emdash/emdash-logo-dark.svg",
 instructionsUrl: "https://docs.emdash.sh/skills",
 sourceCodeUrl: "https://github.com/generalaction/emdash"
}, {
 name: "Snowflake Cortex Code",
 description: "Cortex Code is an AI-driven intelligent agent integrated into the Snowflake platform, optimized for complex data engineering, analytics, machine learning, and agent-building tasks.",
 url: "https://docs.snowflake.com/en/user-guide/cortex-code/cortex-code",
 lightSrc: "/images/logos/snowflake/snowflake-logo-light.svg",
 darkSrc: "/images/logos/snowflake/snowflake-logo-dark.svg",
 instructionsUrl: "https://docs.snowflake.com/en/user-guide/cortex-code/extensibility#extensibility-skills"
}, {
 name: "Kiro",
 description: "Kiro helps you do your best work by bringing structure to AI coding with spec-driven development.",
 url: "https://kiro.dev/",
 lightSrc: "/images/logos/kiro/kiro-logo-light.svg",
 darkSrc: "/images/logos/kiro/kiro-logo-dark.svg",
 instructionsUrl: "https://kiro.dev/docs/skills/"
}, {
 name: "Workshop",
 description: "Workshop is a cross-platform AI coding agent for building full applications. It supports multi-LLM models, sub-agents, custom agents, and skills — available as a desktop app, web app, and CLI.",
 url: "https://workshop.ai/",
 lightSrc: "/images/logos/workshop/workshop-logo-light.svg",
 darkSrc: "/images/logos/workshop/workshop-logo-dark.svg",
 instructionsUrl: "https://docs.workshop.ai/core-concepts/working-with-the-agent#create-your-own-agents"
}, {
 name: "Google AI Edge Gallery",
 description: "Google AI Edge Gallery is the premier destination for running the world's most powerful open-source Large Language Models (LLMs) on your mobile device",
 url: "https://github.com/google-ai-edge/gallery",
 lightSrc: "/images/logos/google-ai-edge-gallery/google-ai-edge-gallery-light.svg",
 darkSrc: "/images/logos/google-ai-edge-gallery/google-ai-edge-gallery-dark.svg",
 scale: 0.45,
 instructionsUrl: "https://github.com/google-ai-edge/gallery/tree/main/skills",
 sourceCodeUrl: "https://github.com/google-ai-edge/gallery"
}, {
 name: "nanobot",
 description: "nanobot is an ultra-lightweight, open-source personal AI agent. It runs across multiple platforms — terminal, Telegram, Discord, Slack, WeChat, and more — with built-in MCP support and a skills system for extensibility.",
 url: "https://nanobot.wiki/",
 lightSrc: "/images/logos/nanobot/nanobot-logo-light.png",
 darkSrc: "/images/logos/nanobot/nanobot-logo-dark.png",
 instructionsUrl: "https://nanobot.wiki/docs/0.1.5/use-nanobot/
