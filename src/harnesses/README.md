# Harness source templates

This directory holds the source templates for shared harness entry files and manifests. Portable agents, skills, commands, hooks, and rules remain in their existing sibling directories under `src/`.

`claude/CLAUDE.md` is the source for the optional root Claude entry file. Where present, `codex/marketplace.json` is the source for `.agents/plugins/marketplace.json`; its repository-relative plugin source is preserved when generated.

Run `python learn/scripts/generate-harnesses.py` to materialize supported local adapters and available templates. Generated root entry files and harness folders are ignored and must not be committed. Use a disposable checkout to verify generation when keeping the working checkout source-only.

External harness installation paths mentioned in research, examples, and guides describe those tools. They do not designate canonical source directories in this repository.
