# Agentskills.io Spec: From Broken YAML to Production Skills (community explainer)
- URL: https://doi.org/10.5281/zenodo.19445085
- Fetched: 2026-08-14
- Source type: community
- Component: skills

# Agentskills.io Spec: From Broken YAML to Production Skills

Published: 2026-04-06
Author: Daniel Rosehill, Gemini 3.1 (Flash), Chatterbox TTS
Publication: Open MIND (Zenodo, DOI 10.5281/zenodo.19445085)

## Show notes (full text)

If you've ever fought with a broken YAML file that Claude refuses to load, this episode is your rescue mission. We dissect the agentskills.io specification, the de facto standard for Claude Code skills, line by line. You'll learn the five non-negotiable frontmatter fields, why directory structure matters for context efficiency, and how to write descriptions that act as internal triggers for the agent. Then, we pivot to a practical workshop: how to author a spec-conformant skill from scratch, separate a Minimal Viable Skill from production quality, and avoid common pitfalls like over-scoping and XML contamination.

### The Directory is the Skill

A common misconception is that a skill is just a single file. According to the spec, a conformant skill is a directory. The directory name must match the `name` field in your frontmatter and use kebab-case. For example, a skill named "docker-manager" must live in a folder called "docker-manager", no underscores or capital letters allowed. Inside, the mandatory entry point is `SKILL.md`, which acts as the brain. Optional subdirectories like `scripts`, `references`, and `assets` help manage context. The spec enforces a "Progressive Disclosure" model: the agent loads only the frontmatter first, then the full `SKILL.md` when activated, and only dives into references if instructed. This prevents bloating the agent's active memory.

### The Five Non-Negotiable Frontmatter Fields

Most broken skills fail in the YAML frontmatter. The spec defines five required fields:

1. **Name**: A unique identifier, 64 characters or less, using lowercase alphanumeric and hyphens only. It must exactly match the folder name.
2. **Description**: Up to 1024 characters, but this isn't for humans, it's for the agent's internal routing. A vague description like "Helps with Git" will be ignored. A conformant description is a trigger phrase: "Generates semantic commit messages by analyzing staged changes. Use this when the user asks to commit code."
3. **Version**: Must follow semantic versioning (e.g. 1.0.0). This will be critical for future dependency management in marketplaces.
4. **Author**: Required for conformance, though validation is currently minimal.
5. **Triggers**: The newest part of the spec (as of April 2026). This is an array of objects, currently supporting only "slash_command" types. Each trigger needs a type, command, and optional description/parameters. However, if you define a slash command in YAML, you must also have corresponding instructions in `SKILL.md`, otherwise the skill is malformed.

### Security and Syntax Pitfalls

The spec includes an optional `allowed-tools` field for security. This space-delimited list pre-authorizes tools like "Read Bash git:*", preventing the agent from asking for permission every time and guarding against prompt injection. Syntax-wise, avoid XML tags in YAML, they can break parsing since Claude uses XML tags internally. Use two-space indentation and no tabs.

### From MVS to Production Quality

A Minimal Viable Skill (MVS) has the frontmatter and basic instructions but lacks "teeth." A production-quality skill includes executable scripts and error handling. For a Docker manager skill, you'd create a `scripts` folder with a Bash script that runs `docker ps` and outputs JSON (LLMs parse JSON better than ASCII tables). In `SKILL.md`, you'd instruct Claude to run this script using the environment variable `CLAUDE_SKILL_DIR`, never hardcode paths, to ensure portability. Production quality also means implementing the "Wizard" pattern: a decision tree where the agent checks in with the user. For example, if the Docker script fails, the skill should check if the Docker daemon is running and offer to start it, rather than assuming success.

### Key Takeaways

- Conformance is contractual: Breaking the spec means the agent stays dumb.
- Description is for routing: Write it as a prompt for the agent to know when to call the skill.
- Modularity matters: Over-scoped skills hit context limits and dilute agent attention. Break them into focused, single-purpose tools.
- Use environment variables: `CLAUDE_SKILL_DIR` ensures skills work across different machines.
- Error handling is mandatory: An MVS assumes success; a production skill plans for failure.

Listen online: https://myweirdprompts.com/episode/agentskills-io-spec-guide

Note: cross-check against the official agentskills.io spec page and code.claude.com/docs/en/skills (archived separately in this folder) before treating any single field as authoritative; Claude Code's own docs describe the required frontmatter as `description` only, with `name`, `allowed-tools`, `argument-hint`, `model`, and other fields as optional extensions, so this community summary's claim of five "non-negotiable" fields reflects the general agentskills.io spec rather than Claude Code's own minimum requirements.
