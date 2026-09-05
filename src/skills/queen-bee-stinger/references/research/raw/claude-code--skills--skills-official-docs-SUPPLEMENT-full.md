# Claude Code Skills (full refetch supplement)
- URL: https://code.claude.com/docs/en/skills
- Fetched: 2026-08-14
- Source type: official-docs
- Component: skills

# skills
URL: https://code.claude.com/docs/en/skills

> ## Documentation Index
> Fetch the complete documentation index at: https://code.claude.com/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Extend Claude with skills

> Create, manage, and share skills to extend Claude's capabilities in Claude Code. Includes custom commands and bundled skills.

Skills extend what Claude can do. Create a `SKILL.md` file with instructions, and Claude adds it to its toolkit. Claude uses skills when relevant, or you can invoke one directly with `/skill-name`.

Create a skill when you keep pasting the same instructions, checklist, or multi-step procedure into chat, or when a section of CLAUDE.md has grown into a procedure rather than a fact. Unlike CLAUDE.md content, a skill's body loads only when it's used, so long reference material costs almost nothing until you need it.


 For built-in commands like `/help` and `/compact`, and bundled skills like `/debug` and `/code-review`, see the [commands reference](/docs/en/commands).

 **Custom commands have been merged into skills.** A file at `.claude/commands/deploy.md` and a skill at `.claude/skills/deploy/SKILL.md` both create `/deploy` and work the same way. Your existing `.claude/commands/` files keep working. Skills add optional features: a directory for supporting files, frontmatter to [control whether you or Claude invokes them](#control-who-invokes-a-skill), and the ability for Claude to load them automatically when relevant.


Claude Code skills follow the [Agent Skills](https://agentskills.io) open standard, which works across multiple AI tools. Claude Code extends the standard with additional features like [invocation control](#control-who-invokes-a-skill), [subagent execution](#run-skills-in-a-subagent), and [dynamic context injection](#inject-dynamic-context). See [Using skill frontmatter outside Claude Code](#using-skill-frontmatter-outside-claude-code) for which frontmatter fields are part of the standard and which are Claude Code extensions.

## Bundled skills

Claude Code includes a set of bundled skills, such as `/doctor`, `/code-review`, `/batch`, `/debug`, `/loop`, and `/claude-api`. Bundled skills are prompt-based: they give Claude detailed instructions and let it orchestrate the work using its tools. Most built-in commands instead execute fixed logic directly.

You invoke a bundled skill the same way as any other skill, by typing `/` followed by the skill name. Claude invokes some bundled skills automatically when relevant; others, including `/verify`, run only when you invoke them, which keeps you in control of when these longer-running checks spend time and tokens.

Bundled skills are available in every session. To turn them off, use the [`disableBundledSkills`](/docs/en/settings#available-settings) setting, which disables every bundled skill except `/doctor`.


 The [`/doctor`](/docs/en/commands#all-commands) setup checkup stays typable when `disableBundledSkills` is on, in Claude Code v2.1.205 and later. To hide it, set the `DISABLE_DOCTOR_COMMAND` environment variable or a [`skillOverrides`](#override-skill-visibility-from-settings) entry of `"doctor": "off"`. Before v2.1.205, `/doctor` was a built-in command rather than a bundled skill.


Bundled skills are listed alongside built-in commands in the [commands reference](/docs/en/commands), marked **Skill** in the Purpose column.

### Run and verify your app

Three bundled skills work together to launch your app and confirm changes against the running app instead of just tests:

| Skill | Purpose |
| :--------------------- | :---------------------------------------------------------------------------------------------------------------- |
| `/run` | Launch and drive your app to see a change working |
| `/verify` | Build and run your app to confirm a code change does what it should, without falling back to tests or type checks |
| `/run-skill-generator` | Teach `/run` and `/verify` how to build and launch your project |

All three skills require Claude Code v2.1.145 or later. Check your version with `claude --version` or the `/status` command.

`/run` and `/verify` work without setup. They infer the launch from your project type (CLI, server, TUI, browser-driven) and from what's in your README, `package.json`, or `Makefile`. That inference gets unreliable for projects that need anything beyond a standard launch: a database, an env file, a graphical session, a multi-step build.

`/run-skill-generator` records the recipe instead. It gets your app running from a clean environment, captures what worked (the install commands, the env vars, the launch script), and commits it as a per-project skill at `.claude/skills/run- /`. After that, `/run`, `/verify`, and any other agent in the repo follow the recorded recipe instead of rediscovering it. Run `/run-skill-generator` once per project, and again if the build or launch process changes.

`/verify` can also record its own recipe. When it has to build and drive your app without a recorded recipe, it writes what worked to `.claude/skills/verify/SKILL.md` at the repo root, or in the touched package directory in a monorepo, so later runs and other agents follow the same steps. At the repo root, the recorded skill replaces the bundled `/verify`. This requires Claude Code v2.1.200 or later.

Claude edits the recorded file only when it steered a run wrong, such as a command that failed or a missing step, so you can commit the file without per-session diffs. Before v2.1.205, the bundled skill told Claude to fold in anything a run learned, which caused frequent merge conflicts.

## Getting started

### Create your first skill

This example creates a skill that summarizes the uncommitted changes in your git repository and flags anything risky. It pulls the live diff into the prompt before Claude reads it, so the response is grounded in your actual working tree rather than what Claude can guess from open files. Claude loads the skill automatically when you ask about your changes, or you can invoke it directly with `/summarize-changes`.



 Create a directory for the skill in your personal skills folder. Personal skills are available across all your projects.

    ```bash theme={null}
    mkdir -p ~/.claude/skills/summarize-changes
    ```



 Every skill needs a `SKILL.md` file with two parts: YAML frontmatter between `---` markers that tells Claude when to use the skill, and markdown content with the instructions Claude follows when the skill runs. The directory name becomes the command you type, and the `description` helps Claude decide when to load the skill automatically.

 Save this to `~/.claude/skills/summarize-changes/SKILL.md`:

    ```yaml theme={null}
    ---
    description: Summarizes uncommitted changes and flags anything risky. Use when the user asks what changed, wants a commit message, or asks to review their diff.
    ---

    ## Current changes

    !`git diff HEAD`

    ## Instructions

    Summarize the changes above in two or three bullet points, then list any risks you notice such as missing error handling, hardcoded values, or tests that need updating. If the diff is empty, say there are no uncommitted changes.
    ```

 The `` !`git diff HEAD` `` line uses [dynamic context injection](#inject-dynamic-context): Claude Code runs the command and replaces the line with its output before Claude sees the skill content, so the instructions arrive with the current diff already inlined.



 Open a git project, make a small edit to any file, and start Claude Code by running `claude`. You can test the skill two ways.

 **Let Claude invoke it automatically** by asking something that matches the description:

    ```text theme={null}
    What did I change?
    ```

 **Or invoke it directly** with the skill name:

    ```text theme={null}
    /summarize-changes
    ```

 Either way, Claude should respond with a short summary of your edit and a list of risks.



### Where skills live

Where you store a skill determines who can use it:

| Location | Path | Applies to |
| :--------- | :-------------------------------------------------- | :----------------------------- |
| Enterprise | See [managed settings](/docs/en/settings#settings-files) | All users in your organization |
| Personal | `~/.claude/skills/ /SKILL.md` | All your projects |
| Project | `.claude/skills/ /SKILL.md` | This project only |
| Plugin | ` /skills/ /SKILL.md` | Where plugin is enabled |

When skills share the same name, Claude Code resolves the conflict by source:

* Across levels, enterprise overrides personal, and personal overrides project.
 * For example, with a `deploy` skill in both `~/.claude/skills/` and your project's `.claude/skills/`, `/deploy` runs the personal one.
* A skill at any of these levels also overrides a bundled skill with the same name.
 * For example, a `code-review` skill in your project's `.claude/skills/` replaces the bundled `/code-review`.
* Plugin skills use a `plugin-name:skill-name` namespace, so they can't conflict with other levels.
 * For example, `my-plugin/skills/deploy/SKILL.md` becomes `/my-plugin:deploy` and loads alongside a `deploy` skill in your project's `.claude/skills/`.
* If you have files in `.claude/commands/`, those work the same way, but if a skill and a command share the same name, the skill takes precedence.
 * For example, with both `.claude/commands/deploy.md` and `.claude/skills/deploy/SKILL.md`, `/deploy` runs the skill.
* A skill or command from any of these sources overrides a skill [synced from your claude.ai account](#when-a-synced-skill-name-matches-another-command) with the same name.
 * For example, with a `deploy` skill enabled on claude.ai and another in your project's `.claude/skills/`, `/deploy` runs the project one.

Skills also load from nested `.claude/skills/` directories below your working directory. When Claude reads or edits a file in a subdirectory, skills from that subdirectory's `.claude/skills/` become available. This lets a monorepo package provide its own skills that apply when working on that package, even if the session started at the repo root.

If a nested skill shares a name with another skill, both stay available. For example, with a `deploy` skill at the project root and another in `apps/web/.claude/skills/`:

* The nested one appears under a directory-qualified name, `apps/web:deploy`.
* Its description says which directory it applies to.
* Claude picks the variant that matches the files it is working on.

Typing `/deploy` runs the project-root skill. Type the qualified name `/apps/web:deploy` to run the nested variant explicitly.

When you or Claude invoke the unqualified name, the project-root skill loads, and Claude Code appends a list of the directory-qualified variants to its content with an instruction to also invoke any variant whose directory holds the files Claude is working on. A nested skill therefore still applies to work in its directory when only the unqualified name is invoked.

The folder name `synced` is reserved in the enterprise, personal, and project skills locations, in any capitalization. Claude Code [downloads the skills you enable on claude.ai](/docs/en/env-vars#variables) into `~/.claude/skills/synced/` when `CLAUDE_CODE_SYNC_SKILLS` is set in non-interactive mode, and skips a skill you author at that name.

A ` ` entry in the enterprise, personal, or project locations can be a symlink to a directory elsewhere on disk. Claude Code follows the symlink and reads `SKILL.md` from the target directory, and if the same target is reachable from more than one location, Claude Code loads the skill once. Plugin skills handle symlinks differently; see [Share files within a marketplace with symlinks](/docs/en/plugins-reference#share-files-within-a-marketplace-with-symlinks).


 Add a `.claude-plugin/plugin.json` to a skill folder and it loads as a [plugin](/docs/en/plugins-reference#skills-directory-plugins) named ` @skills-dir`, so it can bundle agents, hooks, and MCP servers. In a project's `.claude/skills/`, this requires accepting the workspace trust dialog first.


#### Live change detection

Claude Code watches skill directories for file changes. When you add, edit, or remove a skill under `~/.claude/skills/`, the project `.claude/skills/`, or a `.claude/skills/` inside an `--add-dir` directory, Claude Code picks up the change within the current session, without a restart. If you create a top-level skills directory that didn't exist when the session started, restart Claude Code so it can watch the new directory.


 Live change detection covers `SKILL.md` text only. For a skill folder that is also a [plugin](/docs/en/plugins-reference#skills-directory-plugins), changes to `hooks/`, `.mcp.json`, `agents/`, and `output-styles/` need `/reload-plugins` to take effect.


#### Discovery from parent and nested directories

Project skills load from `.claude/skills/` in the directory where you start Claude Code and in every parent directory up to the repository root. Starting Claude in a subdirectory still picks up skills defined at the root. To load skills from a directory outside that path at startup, pass it with [`--add-dir`](/docs/en/cli-reference). Claude Code reads `.claude/skills/` inside each added directory alongside the project skills.

Skills in nested `.claude/skills/` directories below your starting directory aren't loaded at startup. They load the first time Claude reads or edits a file inside that subdirectory, and stay available for the rest of the session. For example, after Claude edits a file under `packages/frontend/`, skills in `packages/frontend/.claude/skills/` become available. Until then, those skills don't appear in autocomplete and can't be invoked by name.

Each skill is a directory with `SKILL.md` as the entrypoint:

```text theme={null}
my-skill/
├── SKILL.md           # Main instructions (required)
├── template.md        # Template for Claude to fill in
├── examples/
│   └── sample.md      # Example output showing expected format
└── scripts/
    └── validate.sh    # Script Claude can execute
```

The `SKILL.md` contains the main instructions and is required. Other files are optional and let you build more powerful skills: templates for Claude to fill in, example outputs showing the expected format, scripts Claude can execute, or detailed reference documentation. Reference these files from your `SKILL.md` so Claude knows what they contain and when to load them. See [Add supporting files](#add-supporting-files) for more details.


 Files in `.claude/commands/` support the same [frontmatter](#frontmatter-reference). Skills are recommended since they support additional features like supporting files.


#### Skills from additional directories

The `--add-dir` flag and `/add-dir` command [grant file access](/docs/en/permissions#additional-directories-grant-file-access-not-configuration) rather than configuration discovery, but skills are an exception: `.claude/skills/` within an added directory is loaded automatically. This exception applies only to `--add-dir` and `/add-dir`. The `permissions.additionalDirectories` setting in `settings.json` grants file access only and does not load skills. See [Live change detection](#live-change-detection) for how edits are picked up during a session.

Other `.claude/` configuration such as commands and output styles is not loaded from additional directories. See the [exceptions table](/docs/en/permissions#additional-directories-grant-file-access-not-configuration) for the complete list of what is and isn't loaded, and the recommended ways to share configuration across projects.


 CLAUDE.md files from `--add-dir` directories are not loaded by default. To load them, set `CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD=1`. See [Load from additional directories](/docs/en/memory#load-from-additional-directories).


#### Skills in Cowork and cloud sessions

[Cowork](https://claude.com/product/cowork) sessions and [cloud sessions](/docs/en/cloud-environments#what-carries-over-from-your-setup), including [routines](/docs/en/routines), don't read `~/.claude/skills/` on your machine. Both interactive and scheduled Cowork sessions load the skills enabled for your claude.ai account, synced at session start; manage them from **Customize** in the Desktop app sidebar or from the skills settings on claude.ai. Cloud sessions additionally load project skills committed to the cloned repository's `.claude/skills/`.

If a skill exists only in `~/.claude/skills/` on your machine, Claude Code reports that the skill was not found when a [routine](/docs/en/routines) invokes it, because each routine run starts as a fresh remote session. To make a personal skill available in these sessions:

* For Cowork and cloud sessions, enable the skill for your claude.ai account.
* For cloud sessions, you can instead commit the skill to the repository's `.claude/skills/`, or ship it in a plugin declared in the repository's `.claude/settings.json`. Repo-declared plugins [install at session start](/docs/en/cloud-environments#what-carries-over-from-your-setup); plugins enabled only in your user settings don't transfer.

[Desktop scheduled tasks](/docs/en/desktop-scheduled-tasks) are different: they run locally on your machine and load skills from the same locations as any other local session.


 Skills synced from claude.ai


This section applies to you if you enabled skills for your claude.ai account. In Cowork and cloud sessions, Claude Code loads those skills without any setup on your machine. In any other session on your machine, Claude Code loads them only after you turn syncing on with [`CLAUDE_CODE_SYNC_SKILLS`](/docs/en/env-vars#variables) in a non-interactive run, as [Where synced skills load](#where-synced-skills-load) describes.

Claude Code downloads a synced skill from your account rather than reading a file you wrote on the machine where the session runs, so it applies rules to synced skills that don't apply to the skills you store in the [skills locations](#where-skills-live).

#### Where synced skills load

In a Cowork or cloud session, Claude Code loads the skills enabled for your claude.ai account, and [Skills in Cowork and cloud sessions](#skills-in-cowork-and-cloud-sessions) says how to choose which skills those sessions get.

In any other session on your machine, Claude Code loads them only after you download them once in a non-interactive run:



 Enable each skill you want for your claude.ai account, as [Skills in Cowork and cloud sessions](#skills-in-cowork-and-cloud-sessions) describes. Claude Code downloads only the skills you enabled, and it needs your claude.ai sign-in to download them.



 Claude Code downloads synced skills only when you run it in [non-interactive mode](/docs/en/headless) with the `-p` flag and set [`CLAUDE_CODE_SYNC_SKILLS`](/docs/en/env-vars#variables) to `1`. The prompt you pass doesn't affect the download.

    ```bash theme={null}
    CLAUDE_CODE_SYNC_SKILLS=1 claude -p "List the skills you have available"
    ```

 Claude Code downloads the skills into `~/.claude/skills/synced/`, answers the prompt, and exits like any other non-interactive run. The downloaded skills stay on disk after it exits, so you don't need to keep the run open. Claude Code downloads skills only during a run with `CLAUDE_CODE_SYNC_SKILLS` set, so after you enable or change a skill on claude.ai, run the command again. To change how long the run waits for the sync before it answers the prompt, set [`CLAUDE_CODE_SYNC_SKILLS_WAIT_TIMEOUT_MS`](/docs/en/env-vars#variables).



 Start an interactive session, without `CLAUDE_CODE_SYNC_SKILLS` set, and run `/skills`. The menu lists the downloaded skills under `claude.ai sync`. Every local session you start afterwards loads them from `~/.claude/skills/synced/` too.



#### When a synced skill name matches another command

Claude Code skips a synced skill whose name matches any other command, and that other command runs. The other command can be a built-in command, a [bundled skill](#bundled-skills), a skill at any [local level](#where-skills-live), a plugin skill, a file in `.claude/commands/`, or an [MCP prompt](/docs/en/mcp#use-mcp-prompts-as-commands). Claude Code also reserves the names of its own built-in commands and bundled skills even when they're unavailable in your session, for example after you turn bundled skills off, so it skips a synced skill with one of those names too.

Claude Code labels synced skills so you can tell where they came from. The `/skills` menu and `/context` group synced skills under `claude.ai sync`, and the `/` command menu marks them as coming from claude.ai.

When it compares names, Claude Code ignores case, spacing, and invisible characters, and treats compatibility forms such as fullwidth letters and dash variants as their plain equivalents, so a synced `Commit` can't load beside a local `commit`. A name that differs only by a look-alike letter from another alphabet counts as a different name, and the `claude.ai sync` label is how you tell the two apart.

#### How Claude Code handles the frontmatter of a synced skill

Claude Code applies two rules to a synced skill's frontmatter:

* Claude Code honors the frontmatter in every kind of session, so an `allowed-tools` grant goes through the normal [permission flow](/docs/en/permissions).
* Claude Code sanitizes the display text the skill supplies, such as its description. It removes control characters, and in text that reaches Claude, such as the description, it also escapes angle brackets so the text can't imitate Claude Code's internal formatting.

#### How Claude Code handles the body of a synced skill

What Claude Code does with a synced skill's body depends on where the session runs:

* In a cloud session, the body keeps the behavior a local skill has, because the session runs in an isolated container.
* In a Cowork session on your desktop, the body keeps the behavior a local skill has, except that Claude Code replaces every `!` command line with the [`disableSkillShellExecution` placeholder](#inject-dynamic-context), as it does for every skill you supply there.
* In any other session on your machine, Claude Code doesn't run [`!` commands](#inject-dynamic-context), doesn't attach the files that `@` references name the way it does for a local skill, and doesn't substitute the `${CLAUDE_PROJECT_DIR}` and `${CLAUDE_SESSION_ID}` placeholders, so the `@` references and both placeholders reach Claude as literal text. A `!` command line reaches Claude as literal text too, or as that placeholder when `disableSkillShellExecution` is on.

## Configure skills

Skills are configured through YAML frontmatter at the top of `SKILL.md` and the markdown content that follows.

### Types of skill content

Skill files can contain any instructions, but thinking about how you want to invoke them helps guide what to include:

**Reference content** adds knowledge Claude applies to your current work. Conventions, patterns, style guides, domain knowledge. This content runs inline so Claude can use it alongside your conversation context.

```yaml theme={null}
---
name: api-conventions
description: API design patterns for this codebase
---

When writing API endpoints:
- Use RESTful naming conventions
- Return consistent error formats
- Include request validation
```

**Task content** gives Claude step-by-step instructions for a specific action, like deployments, commits, or code generation. These are often actions you want to invoke directly with `/skill-name` rather than letting Claude decide when to run them. Add `disable-model-invocation: true` to prevent Claude from triggering it automatically. The example below adds `context: fork`, which runs the skill in its own subagent context; see [Run skills in a subagent](#run-skills-in-a-subagent).

```yaml theme={null}
---
name: deploy
description: Deploy the application to production
context: fork
disable-model-invocation: true
---

Deploy the application:
1. Run the test suite
2. Build the application
3. Push to the deployment target
```

Keep the body itself concise. Once a skill loads, its content [stays in context across turns](#skill-content-lifecycle), so every line is a recurring token cost. State what to do rather than narrating how or why, and apply the same conciseness test you would for [CLAUDE.md content](/docs/en/best-practices#write-an-effective-claude-md).

### Frontmatter reference

Beyond the markdown content, you can configure skill behavior using YAML frontmatter fields between `---` markers at the top of your `SKILL.md` file:

```yaml theme={null}
---
name: my-skill
description: What this skill does
disable-model-invocation: true
allowed-tools: Read Grep
---

Your skill instructions here...
```

All fields are optional. Only `description` is recommended so Claude knows when to use the skill.

Boolean fields accept `yes`, `no`, `on`, `off`, `1`, and `0` in any letter case, in addition to `true` and `false`. Before v2.1.218, Claude Code recognized only `true` and `false`.

| Field | Required | Description |
| :------------------------- | :---------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `name` | No | Display name shown in skill listings. Defaults to the directory name. See [How a skill gets its command name](#how-a-skill-gets-its-command-name) for how the field interacts with the name you type to invoke the skill. |
| `description` | Recommended | What the skill does and when to use it. Claude uses this to decide when to apply the skill. If omitted, uses the first paragraph of markdown content. Put the key use case first: the combined `description` and `when_to_use` text is truncated at 1,536 characters in the skill listing to reduce context usage. |
| `when_to_use` | No | Additional context for when Claude should invoke the skill, such as trigger phrases or example requests. Appended to `description` in the skill listing and counts toward the 1,536-character cap. |
| `argument-hint` | No | Hint shown during autocomplete to indicate expected arguments. Example: `[issue-number]` or `[filename] [format]`. |
| `arguments` | No | Named positional arguments for [`$name` substitution](#available-string-substitutions) in the skill content. Accepts a space-separated string or a YAML list. Names map to argument positions in order. |
| `disable-model-invocation` | No | Set to `true` to prevent Claude from automatically loading this skill. Use for workflows you want to trigger manually with `/name`. Also prevents the skill from being [preloaded into subagents](/docs/en/sub-agents#preload-skills-into-subagents). As of v2.1.196, also prevents the skill from running when a [scheduled task](/docs/en/scheduled-tasks) fires with the skill as its prompt. Default: `false`. |
| `user-invocable` | No | Set to `false` to hide from the `/` menu. Use for background knowledge users shouldn't invoke directly. Default: `true`. |
| `allowed-tools` | No | Tools Claude can use without asking permission during the turn that invokes this skill. The grant clears when you send your next message. Accepts a space- or comma-separated string, or a YAML list. See [Pre-approve tools for a skill](#pre-approve-tools-for-a-skill). |
| `disallowed-tools` | No | Tools removed from Claude's available pool while this skill is active. Use for autonomous skills that should never call certain tools, such as `AskUserQuestion` for a background loop. Accepts a space- or comma-separated string, or a YAML list. The restriction clears when you send your next message. Like deny rules, the field can't remove [`EndConversation`](/docs/en/tools-reference#endconversation-tool-behavior) while any other tool remains. |
| `model` | No | Model to use when this skill is active. The override applies for the rest of the current turn and is not saved to settings; the session model resumes on your next prompt. Accepts the same values as [`/model`](/docs/en/model-config), or `inherit` to keep the active model. A value excluded by your organization's [`availableModels`](/docs/en/model-config#restrict-model-selection) allowlist is not used and the session keeps its current model. With `context: fork`, the value sets the [forked subagent's model](#run-skills-in-a-subagent) instead, and an excluded value follows the [same rules as a subagent model override](/docs/en/model-config#restrict-model-selection). |
| `effort` | No | [Effort level](/docs/en/model-config#adjust-effort-level) when this skill is active. Overrides the session effort level. Default: inherits from session. Options: `low`, `medium`, `high`, `xhigh`, `max`; available levels depend on the model. |
| `context` | No | Set to `fork` to run in a forked subagent context. See [Run skills in a subagent](#run-skills-in-a-subagent). |
| `agent` | No | Which subagent type to use when `context: fork` is set. |
| `background` | No | Only applies with `context: fork`. Set to `false` to wait for the forked subagent's result in the turn that invoked the skill, instead of [running it in the background](#run-skills-in-a-subagent). Default: `true`. Requires Claude Code v2.1.218 or later. |
| `hooks` | No | Hooks scoped to this skill's lifecycle. See [Hooks in skills and agents](/docs/en/hooks#hooks-in-skills-and-agents) for configuration format. |
| `paths` | No | Glob patterns that limit when this skill is activated. Accepts a comma-separated string or a YAML list. When set, Claude loads the skill automatically only when working with files matching the patterns. Uses the same format as [path-specific rules](/docs/en/memory#path-specific-rules). |
| `shell` | No | Shell to use for `` !`command` `` and ` ```! ` blocks in this skill. Accepts `bash` (default) or `powershell`. Setting `powershell` runs inline shell commands via PowerShell when the [PowerShell tool](/en/tools-reference#powershell-tool) is enabled: it's on by default on Windows without Git Bash, and `CLAUDE_CODE_USE_POWERSHELL_TOOL=1` enables it elsewhere. |
| `metadata` | No | Free-form YAML map for your own key-value data, such as entitlement or catalog fields, read by your own tooling from `SKILL.md`. Claude Code doesn't act on its contents, and drops a value that isn't a map. Don't reuse frontmatter field names such as `paths` as keys. |
| `license` | No | License covering the skill. Part of the [Agent Skills](https://agentskills.io) spec; see [Using skill frontmatter outside Claude Code](#using-skill-frontmatter-outside-claude-code). Claude Code accepts the field but doesn't act on it. |
| `compatibility` | No | Environment requirements for the skill, such as intended products or system prerequisites, as defined by the [Agent Skills](https://agentskills.io) spec; see [Using skill frontmatter outside Claude Code](#using-skill-frontmatter-outside-claude-code). Accepts a string of up to 500 characters. Claude Code accepts the field but doesn't act on it. |

#### Using skill frontmatter outside Claude Code

Claude Code accepts every field in the table above. Outside Claude Code, you can use only the fields in the [Agent Skills](https://agentskills.io) spec:

| Distribution path | Frontmatter fields you can use |
| :-------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------- |
| Claude Code skills at [any level](#where-skills-live), including [plugin](/docs/en/plugins) skills | Every field in the table above |
| claude.ai skill uploads, the Skills API, and packaging with `package_skill.py` from [anthropics/skills](https://github.com/anthropics/skills) | `name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools` |

When you enable a personal skill for [Cowork and cloud sessions](#skills-in-cowork-and-cloud-sessions), including routines, you upload it to claude.ai, so the same rules apply.

If you include any field the spec doesn't allow, packaging or upload fails with a hard error instead of ignoring the field:

```
Unexpected key(s) in SKILL.md frontmatter: argument-hint. Allowed properties are: allowed-tools, compatibility, description, license, metadata, name
```

Restricting frontmatter to the spec's six fields avoids the unexpected-key error above. The [Agent Skills spec](https://agentskills.io) and the [Skills API requirements](https://docs.claude.com/en/api/skills-guide) define everything else those paths validate. Claude Code-only body features, such as [dynamic context injection](#inject-dynamic-context), don't function in claude.ai chat or through the API. Claude Code accepts all six fields, so frontmatter that follows the spec loads in Claude Code without changes.

#### How a skill gets its command name

The command you type to invoke a skill comes from where the skill file lives and, for plugin skills, also from the frontmatter `name` field. In a personal or project skill, `name` sets only the display label shown in skill listings, and the command still comes from the directory or file name. In a plugin skill, `name` sets the last segment of the command and the plugin prefix stays in place.

The table below shows where the command name comes from for each layout:

| Skill location | Command name source | Example |
| :------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------- |
| Skill directory under `~/.claude/skills/` or `.claude/skills/` | Directory name | `.claude/skills/deploy-staging/SKILL.md` → `/deploy-staging` |
| [Nested](#where-skills-live) `.claude/skills/` directory, when the name clashes with another skill | Subdirectory path relative to the working directory, then the skill directory name | `apps/web/.claude/skills/deploy/SKILL.md` → `/apps/web:deploy` |
| File under `.claude/commands/` | File name without extension | `.claude/commands/deploy.md` → `/deploy` |
| Plugin `skills/` subdirectory | Frontmatter `name` or the directory name, namespaced by plugin | `my-plugin/skills/review/SKILL.md` → `/my-plugin:review`, or `/my-plugin:fancy` with `name: fancy` |
| Plugin root `SKILL.md` | Frontmatter `name`, with the plugin directory name as a fallback | `my-plugin/SKILL.md` with `name: review` → `/my-plugin:review`. See [Path behavior rules](/docs/en/plugins-reference#path-behavior-rules) |

In a plugin skill, the frontmatter `name` replaces the directory name in the last segment of the command, so `my-plugin/skills/review/SKILL.md` with `name: fancy` becomes `/my-plugin:fancy`. The bare `/fancy` also invokes the skill unless another command already uses that name. Before v2.1.216, the frontmatter name replaced the whole command name, so the menu showed `/fancy` without the plugin prefix and `/my-plugin:fancy` didn't autocomplete.

In [non-interactive sessions](/docs/en/headless), Claude Code doesn't reserve the names `help` and `feedback` for their terminal-only built-in commands, so a plugin skill with one of those names keeps its bare command there. Claude Code still reserves the name of every other terminal-only built-in, such as `/login`, even though the command can't run in those sessions. In those sessions Claude Code also skips a synced skill named `help` or `feedback`, because it [skips a synced skill](#when-a-synced-skill-name-matches-another-command) whose name matches any built-in command whether or not that command can run. From v2.1.216 through v2.1.220, `help` and `feedback` were reserved too, so a plugin skill with one of those names was invocable only by its namespaced command in non-interactive sessions.

For a plugin-root `SKILL.md`, there is no skill directory to take the name from, so `name` supplies the whole final segment. Without a `name` field, Claude Code falls back to the plugin's directory name.

#### Available string substitutions

Skills support string substitution for dynamic values in the skill content:

| Variable | Description |
| :---------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `$ARGUMENTS` | All arguments passed when invoking the skill. If `$ARGUMENTS` is not present in the content, arguments are appended as `ARGUMENTS: `. |
| `$ARGUMENTS[N]` | Access a specific argument by 0-based index, such as `$ARGUMENTS[0]` for the first argument. |
| `$N` | Shorthand for `$ARGUMENTS[N]`, such as `$0` for the first argument or `$1` for the second. |
| `$name` | Named argument declared in the [`arguments`](#frontmatter-reference) frontmatter list. Names map to positions in order, so with `arguments: [issue, branch]` the placeholder `$issue` expands to the first argument and `$branch` to the second. |
| `${CLAUDE_SESSION_ID}` | The current session ID. Useful for logging, creating session-specific files, or correlating skill output with sessions. |
| `${CLAUDE_EFFORT}` | The current effort level: `low`, `medium`, `high`, `xhigh`, or `max`. Ultracode is not a distinct level and reports as `xhigh`. Use this to adapt skill instructions to the active effort setting. |
| `${CLAUDE_SKILL_DIR}` | The directory containing the skill's `SKILL.md` file. For plugin skills, this is the skill's subdirectory within the plugin, not the plugin root. Use this in bash injection commands to reference scripts or files bundled with the skill, regardless of the current working directory. |
| `${CLAUDE_PROJECT_DIR}` | The project root directory. This is the same path [hooks](/docs/en/hooks#reference-scripts-by-path) and MCP servers receive as `CLAUDE_PROJECT_DIR`. Use this to reference project-local scripts or files, such as `${CLAUDE_PROJECT_DIR}/.claude/hooks/helper.sh`, independent of where the skill is installed. |
| `${CLAUDE_PLUGIN_ROOT}` | The plugin's installation directory. Substituted only in plugin skills. Use this to reference scripts or files bundled anywhere in the plugin, including resources shared between the plugin's skills. See [plugin environment variables](/docs/en/plugins-reference#environment-variables). |
| `${CLAUDE_PLUGIN_DATA}` | The plugin's [persistent data directory](/docs/en/plugins-reference#persistent-data-directory), which survives plugin updates. Substituted only in plugin skills. Use this to reference installed dependencies, generated files, or caches that must outlive an update. |

Claude Code substitutes `${CLAUDE_SKILL_DIR}` and `${CLAUDE_PROJECT_DIR}` in two places: the skill's markdown content, and Bash rules in the [`allowed-tools`](#frontmatter-reference) frontmatter. In a plugin skill, Claude Code substitutes `${CLAUDE_PLUGIN_ROOT}` and `${CLAUDE_PLUGIN_DATA}` in the same two places. Using the same variable in both places lets a skill run a bundled script without a permission prompt. The following skill shows the pattern:

```yaml theme={null}
---
name: render-chart
description: Render a chart from a CSV file
allowed-tools: Bash(${CLAUDE_SKILL_DIR}/scripts/render.sh *)
---

Run `${CLAUDE_SKILL_DIR}/scripts/render.sh <csv-file>` to render the chart.
```

If this skill is installed at `~/.claude/skills/render-chart/`, both occurrences of `${CLAUDE_SKILL_DIR}` expand to that directory. The `allowed-tools` rule then matches the exact command the skill body tells Claude to run, so the script runs without prompting.

The `${CLAUDE_PROJECT_DIR}` substitution requires Claude Code v2.1.196 or later.

Indexed arguments use shell-style quoting, so wrap multi-word values in quotes to pass them as a single argument. For example, `/my-skill "hello world" second` makes `$0` expand to `hello world` and `$1` to `second`. The `$ARGUMENTS` placeholder always expands to the full argument string as typed.

An indexed placeholder with no corresponding argument, such as `$2` when only one argument was passed, stays in the content unchanged. A named placeholder from the [`arguments`](#frontmatter-reference) frontmatter with no matching argument expands to an empty string.

To include a literal `$` before a digit, `ARGUMENTS`, or a declared argument name, such as `$1.00` in prose, escape it with a backslash: `\$1.00`. A backslash before any other `$` is left unchanged. Only a single backslash directly before the token escapes it. A doubled backslash such as `\\$1` leaves both backslashes in place, and `$1` still expands to the argument value. The backslash escape covers only these argument placeholders. A backslash doesn't prevent substitution of a `${CLAUDE_*}` variable where the variable applies.

**Example using substitutions:**

```yaml theme={null}
---
name: session-logger
description: Log activity for this session
---

Log the following to logs/${CLAUDE_SESSION_ID}.log:

$ARGUMENTS
```

### Add supporting files

Skills can include multiple files in their directory. This keeps `SKILL.md` focused on the essentials while letting Claude access detailed reference material only when needed. Large reference docs, API specifications, or example collections don't need to load into context every time the skill runs.

```text theme={null}
my-skill/
├── SKILL.md (required - overview and navigation)
├── reference.md (detailed API docs - loaded when needed)
├── examples.md (usage examples - loaded when needed)
└── scripts/
    └── helper.py (utility script - executed, not loaded)
```

Reference supporting files from `SKILL.md` so Claude knows what each file contains and when to load it:

```markdown theme={null}
## Additional resources

- For complete API details, see [reference.md](reference.md)
- For usage examples, see [examples.md](examples.md)
```

 Keep `SKILL.md` under 500 lines. Move detailed reference material to separate files.

### Control who invokes a skill

By default, both you and Claude can invoke any skill. You can type `/skill-name` to invoke it directly, and Claude can load it automatically when relevant to your conversation. Two frontmatter fields let you restrict this:

* **`disable-model-invocation: true`**: Only you can invoke the skill. Use this for workflows with side effects or that you want to control timing, like `/commit`, `/deploy`, or `/send-slack-message`. You don't want Claude deciding to deploy because your code looks ready.

* **`user-invocable: false`**: Only Claude can invoke the skill. Use this for background knowledge that isn't actionable as a command. A `legacy-system-context` skill explains how an old system works. Claude should know this when relevant, but `/legacy-system-context` isn't a meaningful action for users to take.

This example creates a deploy skill that only you can trigger. If you set `disable-model-invocation: true`, Claude can't run the skill automatically:

```yaml theme={null}
---
name: deploy
description: Deploy the application to production
disable-model-invocation: true
---

Deploy $ARGUMENTS to production:

1. Run the test suite
2. Build the application
3. Push to the deployment target
4. Verify the deployment succeeded
```

If Claude tries anyway, Claude Code blocks the call and instructs it not to reproduce the deploy steps another way, so expect Claude to suggest running `/deploy` yourself.

Here's how the two fields affect invocation and context loading:

| Frontmatter | You can invoke | Claude can invoke | When loaded into context |
| :------------------------------- | :------------- | :---------------- | :----------------------------------------------------------- |
| (default) | Yes | Yes | Description always in context, full skill loads when invoked |
| `disable-model-invocation: true` | Yes | No | Description not in context, full skill loads when you invoke |
| `user-invocable: false` | No | Yes | Description always in context, full skill loads when invoked |


 In a regular session, skill descriptions are loaded into context so Claude knows what's available, but full skill content only loads when invoked. [Subagents with preloaded skills](/docs/en/sub-agents#preload-skills-into-subagents) work differently: the full skill cont
