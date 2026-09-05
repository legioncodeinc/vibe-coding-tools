# Extend Claude with skills (Agent Skills)
- URL: https://code.claude.com/docs/en/skills
- Fetched: 2026-08-14
- Source type: official-docs
- Component: skills

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

Boolean fields accept `yes`, `no`, `on`, `off`, `1`, and `0` in any letter case, i
