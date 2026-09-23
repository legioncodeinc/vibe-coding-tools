# Get started with The Wasp Nest

This is the public marketplace installation path. You do not need access to the private source repository or its `install.sh` script. Installation adds plugin components; home instruction files and a project Library are separate, consent-based steps.

## Install core

In Claude Code, add the marketplace and install core:

```text
/plugin marketplace add legioncodeinc/vibe-coding-tools
/plugin install wasp-nest-core@wasp-nest
```

In a terminal with Codex installed, add the marketplace, then select **The Wasp Nest core** in the plugin browser:

```bash
codex plugin marketplace add legioncodeinc/vibe-coding-tools
```

The [public README](https://github.com/legioncodeinc/vibe-coding-tools#what-ships) lists optional packs. Install the `highlevel` pack only when you need HighLevel API, AI Studio, or workflow-export work, for example. A pack contains its own Stingers and, where applicable, Drones. [Harness Capabilities](../reference/HARNESS-CAPABILITIES.md) explains why a Claude command may appear as a Stinger workflow in Codex or another harness.

## Decide whether to set up your home

On a supported local first session, the onboarding hook looks for `~/.legioncodeinc.lock`. If it is missing, the hook explains the global `AGENTS.md` and `CLAUDE.md` templates and asks whether you want personalized instructions. On consent, setup backs up existing instruction files, merges a clearly marked Wasp Nest section, personalizes the user and organization, and writes the lock last. A decline leaves those files alone.

The public [AGENTS template](../../templates/AGENTS_template.md) and [CLAUDE template](../../templates/CLAUDE_template.md) show what would be merged. They are global instructions, not project-specific Library files. Cowork does not have access to your local home through this hook. If a hook is unavailable in your harness, ask the installed Get Started Stinger to explain the same setup and request consent before writing anything.

## Decide whether to set up this repository

After the home check, the local hook checks the current repository for `wasp-nest.lock`. If it is missing, it offers the [Get Started Stinger](../../skills/get-started-stinger/SKILL.md). That playbook inventories existing files, preserves them, and creates missing Library structure only after you consent. If application code already exists, it also calls for the [Knowledge Stinger](../../skills/knowledge-stinger/SKILL.md) to document what exists before setup is marked complete.

Ask for the same process directly at any time:

```text
Use the Get Started Stinger for this repository. Explain the home and project setup separately, ask for consent, preserve what exists, and show me the setup report and diff.
```

The Library separates current knowledge, planned features, issue fixes, shared contract records, and human-only notes. Read [the Library structure](LIBRARY-STRUCTURE.md) and [why it exists](../concepts/WHY-THE-LIBRARY.md) before your first PRD. The `notes/` folder is for people and must not be read or written by agents.

## Verify the result

Review the setup report and diff. Confirm that existing files were preserved, placeholders were resolved or reported, and no product fact was invented. Check that `~/.legioncodeinc.lock` appears only after home setup succeeds and `wasp-nest.lock` only after repository setup succeeds. If a hook or skill is missing, use [Troubleshooting](TROUBLESHOOTING.md) and verify that the relevant plugin is installed and enabled.
