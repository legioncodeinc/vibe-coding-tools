# Claude Cowork Skills: How to Use, Create, and Update Them (2026) — community deep dive
- URL: https://ryanandmattdatascience.com/claude-cowork-skills/
- Fetched: 2026-08-14
- Source type: community
- Component: skills
- Published: 2026-03-24

You've typed the same instructions into Claude at least 50 times. Here's how I want you to write my newsletter. Here's the format for my reports. Here's the tone, the structure, the rules. Every single session.

Claude Cowork skills fix this. A skill is a single file that tells Claude exactly how to handle a specific workflow. Once it's installed, Claude reads it automatically in every session. No re-explaining. No copy-pasting prompts. No wasted time.

## What Are Claude Cowork Skills?

Claude Cowork skills are persistent instruction files that shape how Claude behaves in every session. Each skill is a plain text file (SKILL.md) that describes a specific workflow, format, or set of rules. When a skill is active, Claude reads it and applies those instructions automatically whenever the task is relevant.

The simplest way to think about it: a skill is a system prompt you only have to write once. Skills are persistent (installed once, available until turned off) and updateable.

## How to Access Claude Cowork Skills

There are three places to find and manage skills in Claude Cowork: through plugins, through the Customize menu, and through the examples panel. Skills only work in the Cowork desktop app, not on claude.ai (per this article — note: official docs elsewhere describe skills also syncing to claude.ai account-level settings, so check the official support article for the authoritative current behavior).

### Option 1: Via Plugins

Click the plus icon in the Cowork sidebar and go to Plugins. Each plugin includes one or more bundled skills. The default plugins (Data, Productivity, Marketing, Sales) come pre-loaded with skills for things like data validation, content creation, and task management.

Selecting a skill from a plugin activates it immediately and starts a guided prompt.

### Option 2: Via the Customize Menu

Click Customize in the Cowork sidebar, then go to the Skills tab. Your uploaded or created skills live under My Skills, and pre-built options are in the Examples section. From here you can turn skills on or off, edit them with Claude, download them, replace them with an updated version, or delete them.

### Option 3: Built-In Background Skills

Some skills are baked into Cowork at the system level and run silently in the background — creating or editing Word docs, Excel spreadsheets, PowerPoint presentations, and PDFs. You can't see or edit these. The one built-in skill you can see (but not edit) is the Skill Creator.

## How to Turn Claude Cowork Skills On and Off

In Customize > Skills, any skill that appears grayed out is inactive. Click the toggle to activate it. When a skill is off, Claude doesn't reference it at all, even if the task would normally match.

The three-dot menu next to any skill gives additional options: try it in chat, edit it, download it, replace it with a file, or delete it.

## Stacking Multiple Skills at Once

Claude Cowork can use more than one skill at a time. When you run a task, Cowork looks at all your active skills and decides which ones apply. A practical example: cleaning up data in an Excel file might automatically apply the built-in spreadsheet skill, a data validation skill from your Data plugin, and a data exploration skill — all at once, without you specifying which to use.

## How to Update a Claude Cowork Skill

The built-in Skill Creator handles updates. Go to Customize > Skills, find the skill, click the three-dot menu, choose "Edit with Claude." This opens a chat session with the Skill Creator and your current skill already loaded.

Tell Claude what to change. Example: "Do not make any changes until I approve them. I want to add a fifth section to the email newsletter skill that highlights a community win from this week."

Once you approve, Claude runs through all the changes, packages the updated skill, and prompts you to install it. Click "Copy to Your Skills" and choose "Upload and Replace" to swap the old version with the new one.

## How to Create a Claude Cowork Skill from Scratch

The Skill Creator isn't just for updates — it's the fastest way to build a new skill. You describe what you want, Claude asks clarifying questions, writes a draft, tests it, and packages it for you.

### Step 1: Describe the Skill You Want

Example prompt: "I want you to build out a new skill for running... Ask me as many questions as you want before we build the skill." Ending with "ask me as many questions as you want" gives Claude permission to dig into details before writing anything.

### Step 2: Answer Claude's Questions

Claude comes back with a structured list of clarifying questions (e.g. what counts as speed work, target frequency, CSV log format, passive vs proactive reminders).

### Step 3: Review the Eval Results

After building the skill, Claude runs a quick evaluation — a set of test prompts that simulate real usage. You see two columns: output with the skill active vs. without it. For a running-log skill example, pass rate came back at 100% with-skill vs 56% without-skill — a concrete demonstration of skill-triggering evaluation inside Cowork's Skill Creator flow.

### Step 4: Install the Skill

Once the eval looks good, Claude packages the skill and prompts you to install it. Click "Copy to Your Skills." The skill appears immediately in your My Skills section.

## Built-In Skills in Claude Cowork

Cowork ships with a set of built-in skills that run automatically and can't be edited or viewed, covering the most common productivity file types:

- Word documents (.docx) — formatting, templates, structured reports
- Excel spreadsheets (.xlsx) — formulas, charts, data analysis
- PowerPoint presentations (.pptx) — slide layouts, design consistency
- PDFs (.pdf) — reading, filling forms, combining documents

The Skill Creator is also built-in (visible in Examples, but not editable).

## What's Inside a Claude Skill File

Every skill is a folder. When you download a skill from Cowork or build one outside the app, you get a folder with a specific structure.

### The Folder Structure

A skill folder contains one required file and up to three optional subfolders:

- **SKILL.md** (required) — the main instruction file. Contains YAML frontmatter at the top and the actual skill instructions in Markdown below it.
- **scripts/** (optional) — executable code the skill can run, like Python scripts, Bash commands, or validation tools.
- **references/** (optional) — documentation or reference material Claude loads only when needed.
- **assets/** (optional) — templates, fonts, logos, or other static files used to produce output.

When you package a skill for sharing, all of this gets zipped into a **.skill file**. On the receiving end, the person uploads it through Customize > Skills.

### The SKILL.md Frontmatter

The YAML frontmatter controls when the skill triggers. Claude reads every skill's frontmatter on every session, but only loads the full SKILL.md body if the frontmatter suggests the skill is relevant.

The two required fields are `name` and `description`. Name must be in kebab-case. Description must explain both what the skill does and when to use it, in under 1,024 characters.

A good description includes specific trigger phrases: "Use when user says write my newsletter, draft the email, or paste a YouTube link — alongside any mention of subscribers." Vague descriptions that just say "helps with projects" don't trigger reliably.

Two naming rules worth knowing: you can't include "claude" or "anthropic" in a skill name (reserved), and you can't use XML angle brackets anywhere in the frontmatter (security restriction).

### Progressive Disclosure: Why Skills Don't Slow Claude Down

Skills use a three-level loading system: the frontmatter is always in context; the full SKILL.md body only loads when Claude decides the skill is relevant; files in references/ and assets/ only load if specifically needed. This means you can have 10 skills installed without all 10 being loaded into context at once.

### Skills Are Portable

A skill built for Cowork works identically in Claude Code and the Claude API. The skill file format is the same across all three surfaces.

## A Note on Skill Security

Skills run with the same level of access as Claude in your session. A skill can instruct Claude to read files, run code, make API calls, or use any connected service. Anthropic's own documentation says: only install skills from trusted sources, and audit the skill's contents before use. A skill is a plain text file, so you can read exactly what it does before installing it.

## FAQ

**What is the difference between a skill and a plugin in Claude Cowork?** A skill is a single instruction file for one specific workflow. A plugin is a bundle of skills combined with connectors and other tools. Plugins are installed as a package; skills can be installed one at a time.

**Can I use multiple skills at the same time?** Yes, Cowork automatically stacks skills when multiple ones are relevant to the same task.

**Do Claude Cowork skills work on claude.ai?** Per this article: no, skills in the context of Cowork are only available in the Claude desktop app (Note: cross-check against official docs, which describe skills syncing from a claude.ai account — there may be a distinction between "authoring/managing" surfaces and "session execution" surfaces that this community article doesn't fully capture).

**How do I delete or disable a skill I no longer need?** Go to Customize > Skills, find the skill, click the three-dot menu. Toggle off (stays installed but inactive) or delete entirely.

**Can I share a skill with someone else?** Yes. Use the three-dot menu to download the skill as a .skill file. The other person installs it via Customize > Skills > upload.
