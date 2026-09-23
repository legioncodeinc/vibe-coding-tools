# 08. First-session onboarding

The SessionStart hook only observes lock files and adds context. It never writes a file or treats plugin installation as consent. On the next user-facing response, explain the value of each step and ask before running it. Keep the user's original task in view.

## Step 1: Global operating instructions

If `~/.legioncodeinc.lock` is absent, explain that `AGENTS.md` gives supported coding harnesses shared operating rules and `CLAUDE.md` imports those rules for Claude Code. The source templates are `AGENTS_template.md` and `CLAUDE_template.md` at the marketplace root, with copies bundled inside the installed core plugin. These are home-level instructions, not project files.

Ask: "Would you like me to add personalized Wasp Nest operating instructions to your home and installed harnesses? I will back up existing files and merge a clearly marked section without deleting your own text." If the user declines, do nothing. If the user agrees, ask for the name and organization they want in `{user}` and `{org}`. Do not infer either from the machine account or an unrelated repository.

Run `scripts/install-global-instructions.py` from this Stinger with `--user` and `--org`. It reads the templates bundled with the installed plugin or local harness. The action installs to `~/AGENTS.md` and `~/CLAUDE.md`, plus supported existing harness homes: `~/.claude/AGENTS.md` and `~/.claude/CLAUDE.md`, `~/.codex/AGENTS.md`, `~/.zcode/AGENTS.md`, `~/.gemini/GEMINI.md`, and existing AGENTS.md-only harness directories. Cursor's home-level rule UI and Cowork's Global or Folder instructions do not read these files as a native user-level rule, so do not claim they were configured.

Every changed existing file is backed up under `~/.legioncodeinc/backups/` before replacement. A managed section is appended or updated between `<!-- legioncodeinc:global-instructions:start -->` and `<!-- legioncodeinc:global-instructions:end -->`. The rest of the file is preserved. The script refuses symlinks and malformed managed markers rather than writing through them. It writes the private `~/.legioncodeinc.lock` only after every target succeeds. Report created, merged, and backed-up files from its JSON output.

## Step 2: Repository Get Started

After step 1 succeeds, or immediately if the home lock already exists, find the current Git repository root. If none exists, stop this step without creating a repository. If `<repo>/wasp-nest.lock` exists, the repository was already initialized; proceed with the user's task. If it is absent, explain the Library before asking:

- `library/knowledge/` records how the system works and why decisions were made.
- PRDs in `library/requirements/` define planned features and their acceptance criteria.
- IRDs in `library/issues/` make bugs and incidents traceable.
- Accepted `CTR-###` contracts record shared boundaries before related PRDs proceed in parallel.

Ask: "Would you like me to run Get Started here? It inventories existing files, adds only the missing baseline, and reports every change." If the user declines, do not write a lock or start the playbook. If they agree, follow `guides/01-initialization-workflow.md` and the verification checklist. Detect existing code from tracked source files or project manifests, not merely the presence of `.git`. For a repository with existing code, also run the `knowledge-stinger` code-grounded documentation playbook. This step is part of Get Started, not an optional unrelated task.

Only after the baseline and, where applicable, the Knowledge pass have completed and verification has been reported, run `scripts/mark-repo-started.py --repo <repository-root> --knowledge-status completed` for an existing codebase, or `--knowledge-status not-needed` for a new empty repository. The script checks the Library folders and refuses to mark an existing codebase without a completed Knowledge pass. `wasp-nest.lock` contains no user name or credentials; it is repository state and may be committed with the setup files when the user approves a commit.

## Harness limits

Claude Code, Codex, ZCode, and Cursor have SessionStart-style hooks, but a command hook does not display a standalone interactive dialog before the first user prompt. It adds context so the assistant asks in its next response. The packaged command hook requires Node.js and the setup action requires Python 3.11+. Codex requires trust for a newly installed plugin hook. Cowork runs in a separate environment and cannot configure the user's local home through this flow, so the Cowork build omits this hook. If a hook is unavailable or untrusted, the user can invoke Get Started directly.
