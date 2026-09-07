# Troubleshooting

## My assistant cannot find a Bee or Stinger

- Confirm you opened the repository root, not a parent folder.
- Confirm the component exists in the correct harness directory.
- For Codex plugins, use an appropriate release package and start a new session. A generated marketplace requires a source template under `src/harnesses/codex/`.
- For Codex project agents, confirm `.codex/agents/*.toml` exists.
- Generate the local adapters if the canonical `src` source changed. Harness folders are intentionally absent from a fresh clone.

## Hooks do not run

- Claude project hooks use `.claude/settings.json`; plugin hooks use `hooks/hooks.json`.
- Codex hooks must be reviewed and trusted with `/hooks` after changes.
- Cursor uses `.cursor/hooks.json` and Cursor-shaped event names.
- Run the script manually with a fixture to separate manifest problems from script problems.
- Confirm `node` and `python` are available on `PATH`.

## A push is blocked by secret scanning

Follow [Security and Secrets](SECURITY-AND-SECRETS.md). Scan the entire outgoing commit range. A later deletion does not clean an earlier outgoing commit.

## Links broke after moving files

Markdown links are relative to the file containing them. Update the source link, regenerate mirrors, and run the local link audit. Do not repair only one generated copy.

## Claude, Codex, and Cursor behave differently

Check [Harness Compatibility](HARNESS-COMPATIBILITY.md). The project preserves outcomes, not unsupported file layouts. Commands become Codex skills, agents become Codex TOML, and each hook uses the harness's real schema.

## The generator overwrote a manual change

Edit `src` when the component is canonical, then rerun the generator. The Cursor mirror and most Codex package content are generated outputs. Keep shared manifests and entry templates in `src/harnesses/`; keep generated harness folders untracked.
