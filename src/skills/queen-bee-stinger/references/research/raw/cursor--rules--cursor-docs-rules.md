# Rules | Cursor Docs
- URL: https://cursor.com/docs/rules
- Fetched: 2026-08-14
- Source type: official-docs
- Component: rules

# Rules

Rules provide system-level instructions to Agent. They bundle prompts, scripts, and more together, making it easy to manage and share workflows across your team.

Cursor supports four types of rules:

### Project Rules

Stored in `.cursor/rules`, version-controlled and scoped to your codebase.

### User Rules

Global to your Cursor environment. Used by Agent (Chat).

### Team Rules

Team-wide rules managed from the dashboard. Available on Team and [Enterprise](https://cursor.com/docs/enterprise.md) plans.

### AGENTS.md

Agent instructions in markdown format. Simple alternative to
`.cursor/rules`.

## How rules work

Large language models don't retain memory between completions. Rules provide persistent, reusable context at the prompt level.

When applied, rule contents are included at the start of the model context. This gives the AI consistent guidance for generating code, interpreting edits, or helping with workflows.

## Project rules

Project rules live in `.cursor/rules` as `.mdc` files and are version-controlled. They are scoped using path patterns, invoked manually, or included based on relevance.

Use project rules to:

- Encode domain-specific knowledge about your codebase
- Automate project-specific workflows or templates
- Standardize style or architecture decisions

### Rule file structure

Each rule is an `.mdc` file that you can name anything you want. Project rules must use the `.mdc` extension. A plain `.md` file in `.cursor/rules` is ignored by the rules system because it has no frontmatter to specify `description`, `globs`, and `alwaysApply`. If you prefer plain markdown, use [AGENTS.md](https://cursor.com/docs/rules.md#agentsmd) instead.

```bash
.cursor/rules/
  react-patterns.mdc       # Recognized as a project rule
  api-guidelines.md        # Ignored (wrong extension)
  frontend/                # Organize rules in folders
    components.mdc
```

### Rule anatomy

Each rule is a markdown file with frontmatter metadata and content. Control how rules are applied from the type dropdown which changes properties `description`, `globs`, `alwaysApply`.

| Rule Type | Description |
| :------------------------ | :---------------------------------------------------- |
| `Always Apply` | Apply to every chat session |
| `Apply Intelligently` | When Agent decides it's relevant based on description |
| `Apply to Specific Files` | When file matches a specified pattern |
| `Apply Manually` | When @-mentioned in chat (e.g., `@my-rule`) |

Under the hood, the three frontmatter fields interact to determine when a rule is included:

| `alwaysApply` | `description` | `globs` | Behavior |
| :------------ | :------------ | :------- | :--------------------------------------------------------------- |
| `true` | — | — | Always included. Globs and description are ignored. |
| `false` | — | provided | Auto-attached when a matching file is in context. |
| `false` | provided | omitted | Agent reads the description and pulls the rule in when relevant. |
| `false` | omitted | omitted | Included only when you `@`-mention the rule in chat. |

```md title="Always applied"
---
alwaysApply: true
---

- All source files must include the company copyright header
- When you are unsure about implementation details, read the relevant
  source files before proposing changes
- Never modify generated files in the `dist/` or `build/` directories
```

```md title="Auto-attached by file pattern"
---
globs: src/components/**/*.tsx
alwaysApply: false
---

- Use named exports, not default exports
- Co-locate styles in a module CSS file next to the component
- Keep components under 200 lines. Extract subcomponents into the same
  directory when a file grows beyond that
- Prefer composition over prop drilling. Pass children or render props
  instead of threading data through multiple layers
```

```md title="Agent-selected based on description"
---
description: RPC service conventions and patterns for the backend
alwaysApply: false
---

- Define each service in its own file under `src/services/`
- Always validate inputs at the service boundary before passing data
  to internal functions
- Return structured error objects with a `code` and `message` field,
  never throw raw strings
- Add a `@service-template.ts` reference file when creating a new
  service for the standard boilerplate
```

```md title="Manual — only via @-mention"
---
alwaysApply: false
---

- Every database migration must have both `up` and `down` functions
  so it can be fully reversed
- Never alter a column type in-place. Add a new column, backfill,
  then drop the old one in a separate migration
- Reference the template for the expected file structure

@migration-template.sql
```

### Glob pattern examples

Use `globs` to scope a rule to specific files or directories. Separate multiple patterns with commas.

| Pattern | Matches |
| :---------------------------- | :----------------------------------------------------- |
| `*` | Any single file name segment |
| `**` | Any number of directories (recursive) |
| `*.ts` | All `.ts` files in the root |
| `**/*.ts` | All `.ts` files in any directory |
| `src/**` | All files anywhere under `src/` |
| `src/**/*.tsx` | All `.tsx` files anywhere under `src/` |
| `docs/**/*.md, docs/**/*.mdx` | `.md` and `.mdx` files under `docs/` (comma-separated) |
| `tailwind.config.*` | `tailwind.config` with any extension |

### Creating a rule

There are two ways to create rules:

- **`/create-rule` in chat**: Type `/create-rule` in Agent and describe what you want. Agent generates the rule file with proper frontmatter and saves it to `.cursor/rules`.
- **From Customize**: Open **Customize** in the sidebar, go to **Rules**, and click **Add Rule**. This creates a new rule file in `.cursor/rules`. From Customize you can see all rules and their status.

## Best practices

Good rules are focused, actionable, and scoped.

- Keep rules under 500 lines
- Split large rules into multiple, composable rules
- Provide concrete examples or referenced files
- Avoid vague guidance. Write rules like clear internal docs
- Reuse rules when repeating prompts in chat
- Reference files instead of copying their contents—this keeps rules short and prevents them from becoming stale as code changes

### What to avoid in rules

- **Copying entire style guides**: Use a linter instead. Agent already knows common style conventions.
- **Documenting every possible command**: Agent knows common tools like npm, git, and pytest.
- **Adding instructions for edge cases that rarely apply**: Keep rules focused on patterns you use frequently.
- **Duplicating what's already in your codebase**: Point to canonical examples instead of copying code.

Start simple. Add rules only when you notice Agent making the same mistake repeatedly. Don't over-optimize before you understand your patterns.

Check your rules into git so your whole team benefits. When you see Agent make a mistake, update the rule. You can even tag `@cursor` on a GitHub issue or PR to have Agent update the rule for you.

## Rule file format

Each rule is a markdown file with frontmatter metadata and content. The frontmatter metadata is used to control how the rule is applied. The content is the rule itself.

```markdown
---
description: "This rule provides standards for frontend components and API validation"
alwaysApply: false
---

...rest of the rule content
```

If alwaysApply is true, the rule will be applied to every chat session. Otherwise, the description of the rule will be presented to the Cursor Agent to decide if it should be applied.

## Examples

### Standards for frontend components and API validation

This rule provides standards for frontend components:

When working in components directory:

- Always use Tailwind for styling
- Use Framer Motion for animations
- Follow component naming conventions

This rule enforces validation for API endpoints:

In API directory:

- Use zod for all validation
- Define return types with zod schemas
- Export types generated from schemas

### Templates for Express services and React components

This rule provides a template for Express services:

Use this template when creating Express service:

- Follow RESTful principles
- Include error handling middleware
- Set up proper logging

@express-service-template.ts

This rule defines React component structure:

React components should follow this layout:

- Props interface at top
- Component as named export
- Styles at bottom

@component-template.tsx

### Automating development workflows and documentation generation

This rule automates app analysis:

When asked to analyze the app:

1. Run dev server with `npm run dev`
2. Fetch logs from console
3. Suggest performance improvements

This rule helps generate documentation:

Help draft documentation by:

- Extracting code comments
- Analyzing README.md
- Generating markdown documentation

### Adding a new setting in Cursor

First create a property to toggle in `@reactiveStorageTypes.ts`.

Add default value in `INIT_APPLICATION_USER_PERSISTENT_STORAGE` in `@reactiveStorageService.tsx`.

For beta features, add toggle in `@settingsBetaTab.tsx`, otherwise add in `@settingsGeneralTab.tsx`. Toggles can be added as ` ` for general checkboxes. Look at the rest of the file for examples.

```jsx
<SettingsSubSection
  label="Your feature name"
  description="Your feature description"
  value={
    vsContext.reactiveStorageService.applicationUserPersistentStorage
      .myNewProperty ?? false
  }
  onChange={(newVal) => {
    vsContext.reactiveStorageService.setApplicationUserPersistentStorage(
      "myNewProperty",
      newVal,
    );
  }}
/>
```

To use in the app, import reactiveStorageService and use the property:

```js
const flagIsEnabled =
  vsContext.reactiveStorageService.applicationUserPersistentStorage
    .myNewProperty;
```

Examples are available from providers and frameworks. Community-contributed rules are found across crowdsourced collections and repositories online.

## Team Rules

Team and [Enterprise](https://cursor.com/docs/enterprise.md) plans can create and enforce rules across their entire organization from the [Cursor dashboard](https://cursor.com/dashboard/team-content). Admins can configure whether or not each rule is required for team members.

Team Rules work alongside other rule types and take precedence to ensure organizational standards are maintained across all projects. They provide a powerful way to ensure consistent coding standards, practices, and workflows across your entire team without requiring individual setup or configuration.

### Managing Team Rules

Team administrators can create and manage rules directly from the Cursor dashboard.

Once team rules are created, they automatically apply to all team members and are visible in the dashboard.

### Activation and enforcement

- **Enable this rule immediately**: When checked, the rule is active as soon as you create it. When unchecked, the rule is saved as a draft and does not apply until you enable it later.
- **Enforce this rule**: When enabled, the rule is required for all team members and cannot be disabled in Customize. When not enforced, team members can toggle the rule off under **Team Rules** in Customize.

By default, non‑enforced Team Rules can be disabled by users. Use Enforce this rule to prevent that.

### Format and how Team Rules are applied

- **Content**: Team Rules are free‑form text. They do not use the folder structure of Project Rules.
- **Glob patterns**: Team Rules support glob patterns for file-scoped application. When a glob pattern is set (e.g., `**/*.py`), the rule only applies when matching files are in context. Rules without a glob pattern apply to every conversation.
- **Where they apply**: When a Team Rule is enabled (and not disabled by the user, unless enforced), it is included in the model context for Agent (Chat) across all repositories and projects for that team.
- **Precedence**: Rules are applied in this order: **Team Rules → Project Rules → User Rules**. All applicable rules are merged; earlier sources take precedence when guidance conflicts.

Some teams use enforced rules as part of internal compliance workflows. While this is supported, AI guidance should not be your only security control.

## Importing Rules

You can import rules from external sources to reuse existing configurations or bring in rules from other tools.

### Remote rules (via GitHub)

Import rules directly from any GitHub repository you have access to—public or private.

1. Open **Customize** in the sidebar
2. Go to **Rules** and click **Add Rule**
3. Select **Remote Rule (Github)**
4. Paste the GitHub repository URL containing the rules. Cursor will scan for all `.mdc` files in the repo.
5. Cursor will pull and sync the rule(s) into your project

Rules will be placed in `.cursor/rules/imported/ `. Rules will also keep their relative paths, so `dir/rule.mdc` will be imported as `.cursor/rule/imported/ /dir/rule.mdc`.

## AGENTS.md

`AGENTS.md` is a simple markdown file for defining agent instructions. Place it in your project root as an alternative to `.cursor/rules` for straightforward use cases.

Unlike Project Rules, `AGENTS.md` is a plain markdown file without metadata or complex configurations. It's perfect for projects that need simple, readable instructions without the overhead of structured rules.

Cursor supports AGENTS.md in the project root and subdirectories.

```markdown
# Project Instructions

## Code Style

- Use TypeScript for all new files
- Prefer functional components in React
- Use snake_case for database columns

## Architecture

- Follow the repository pattern
- Keep business logic in service layers
```

### Nested AGENTS.md support

Nested `AGENTS.md` support in subdirectories is now available. You can place `AGENTS.md` files in any subdirectory of your project, and they will be automatically applied when working with files in that directory or its children.

This allows for more granular control of agent instructions based on the area of your codebase you're working in:

```bash
project/
  AGENTS.md              # Global instructions
  frontend/
    AGENTS.md            # Frontend-specific instructions
    components/
      AGENTS.md          # Component-specific instructions
  backend/
    AGENTS.md            # Backend-specific instructions
```

Instructions from nested `AGENTS.md` files are combined with parent directories, with more specific instructions taking precedence.

## User Rules

User Rules are global preferences defined in **Customize → Rules** that apply across all projects. They are used by Agent (Chat) and are perfect for setting preferred communication style or coding conventions:

```md
Please reply in a concise style. Avoid unnecessary repetition or filler language.
```

## FAQ

### Why isn't my rule being applied?

Check the rule type. For `Apply Intelligently`, ensure a description is defined. For `Apply to Specific Files`, ensure the file pattern matches referenced files.

### Can rules reference other rules or files?

Yes. Use `@filename.ts` to include files in your rule's context. You can also @mention rules in chat to apply them manually.

### Can I create a rule from chat?

Yes, you can ask the agent to create a new rule for you.

### Do rules impact Cursor Tab or other AI features?

No. Rules do not impact Cursor Tab or other AI features.

### Do User Rules apply to Inline Edit (Cmd/Ctrl+K)?

No. User Rules are not applied to Inline Edit (Cmd/Ctrl+K). They are only
used by Agent (Chat).
