# Claude Code Extensions: Slash Commands vs. Skills vs. Agents (community explainer)
- URL: https://doi.org/10.5281/zenodo.19430533
- Fetched: 2026-08-14
- Source type: community
- Component: multiple

Note: the official /docs/en/slash-commands URL now redirects to the same content as /docs/en/skills, since Anthropic merged custom commands into skills (see claude-code--skills--skills-official-docs.md for that page verbatim). This file instead archives a community practitioner explainer that breaks down slash commands, skills, subagents, and plugins as four distinct extension points, which is useful for understanding the legacy commands model and the mental-model differences between the four component types.

# Claude Code Extensions: Slash Commands vs. Skills vs. Agents

Published: 2026-04-05
Author: Daniel Rosehill, Gemini 3.1 (Flash), Chatterbox TTS
Publication: Open MIND (Zenodo, DOI 10.5281/zenodo.19430533)

## Show notes (full text)

The Claude Code extension system has evolved rapidly, leaving many developers confused about which tool to use for which job. While many users stick to legacy slash commands or misunderstand the capabilities of newer features, there is a specific hierarchy and logic to how Anthropic built these extension points. Understanding this hierarchy is essential for moving from basic command-line interactions to a truly agentic coding workflow. The system consists of four distinct layers: slash commands, skills, subagents, and plugins. Each serves a unique purpose, and knowing when to reach for each one is the key to unlocking Claude's full potential.

### The Legacy Layer: Slash Commands

Slash commands are the oldest and simplest extension method. They reside in the `.claude/commands` directory (episode text says `.claude/slash_commands`, but current official docs confirm the path is `.claude/commands/<name>.md`) as individual markdown files. When you type a command like `/unit-test`, Claude executes the contents of that file. However, these are purely reactive. The model has no prior knowledge that the command exists until you explicitly type it. There is no metadata or description for Claude to read beforehand, meaning it cannot autonomously decide to use the command based on your intent. While incredibly easy to write for quick templates, like a git commit message format, they are effectively legacy: current official docs confirm `.claude/commands/deploy.md` and `.claude/skills/deploy/SKILL.md` both create `/deploy` and work the same way, and existing `.claude/commands/` files keep working, but skills are the recommended modern path. For new projects, developers should look to the modern standard: skills.

### The Modern Standard: Skills

Skills represent a massive jump in capability and live in a `.claude/skills` directory. Unlike a single file, a skill is a directory containing a `SKILL.md` file and supporting scripts (Python, Shell, etc). The "magic" lies in the YAML frontmatter at the top of the markdown file. This metadata defines the name, description, and instructions for when and how Claude should use the skill. Because Claude reads these descriptions at the start of a session, it can autonomously invoke skills based on your intent. If you ask to refactor code and a skill's description matches that intent, Claude will trigger it without being asked. This automatic invocation shifts the UI from a command-line interface to a collaborative partnership. However, developers can still disable model invocation if they prefer a manual trigger, combining the benefits of better organization with the control of legacy commands. Skills also support personal versus project-level configurations, allowing developers to carry custom workflows (like daily stand-up summaries) across all repositories while keeping project-specific scripts local to each repo.

### Context Isolation: Subagents

Subagents live in `.claude/agents` and solve the critical problem of "context poisoning." In long coding sessions, chat history fills with error logs and intermediate file reads, causing the model to lose focus or hallucinate. Subagents act as specialized contractors operating in clean, isolated context windows. When the main Claude instance delegates a task to a subagent, such as a "Security Auditor," the subagent receives a fresh context. It performs the "dirty work" of digging through logs and files, then returns only the high-level result to the main conversation. This allows for multi-threading: multiple subagents can run in parallel, one refactoring a module while another writes tests and a third updates documentation. Because the context windows are smaller and focused, these agents are often more efficient and precise than a single monolithic conversation. They can also be restricted to specific tools, acting as security sandboxes (e.g. read-only access).

### The Mental Model: Capability vs. Role

The distinction between skills and agents is the core mental model developers need to grasp:
- Skills are capabilities (tools). Use a skill for discrete, well-defined actions you want Claude to perform, such as generating a unit test for a specific file.
- Agents are roles (contractors). Use an agent for open-ended, complex tasks that require significant "thinking" and would clutter the main chat, such as reviewing an entire codebase for a specific architectural pattern.

### The Distribution Layer: Plugins

Finally, plugins act as the shipping container for all the above. A plugin is a folder with a `.claude-plugin/plugin.json` manifest file. It bundles multiple skills, agents, git hooks, and Model Context Protocol (MCP) servers into a single, distributable package. This allows teams to share complex tool suites, like a specific AWS stack configuration, without requiring manual copy-pasting of folders. It is the final layer that makes the entire ecosystem portable and shareable.

Listen online: https://myweirdprompts.com/episode/claude-code-extensions-guide
