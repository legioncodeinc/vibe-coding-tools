# Harness compatibility

The current [harness capabilities reference](../reference/HARNESS-CAPABILITIES.md) describes how Claude Code, Codex, Cursor, ZCode, and Cowork expose the marketplace's Stingers, Drones, commands, and hooks. The public plugin manifests and the installed harness determine what actually runs.

## ZCode local user-scope adapter (kept from the pre-restructure tree)

This checkout also keeps a local ZCode adapter that predates the plugins
restructure. `learn/scripts/generate-harnesses.py` builds the harness outputs
and `learn/scripts/install-zcode-agents.py` copies the generated agents into
`~/.zcode/agents` as real files so they are available in every project
(ZCode's agent scanner ignores symlinks). That path currently maintains the
user-scope agents on chris-macbook-pro and stays in the tree until it is
ported to the plugins layout.
