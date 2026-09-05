# AGENTS.md — the open standard
- URL: https://agents.md/
- Fetched: 2026-08-14
- Source type: official-docs
- Component: rules

## Why AGENTS.md?

README.md files are for humans: quick starts, project descriptions, and contribution guidelines.

AGENTS.md complements this by containing the extra, sometimes detailed context coding agents need: build steps, tests, and conventions that might clutter a README or aren't relevant to human contributors.

We intentionally kept it separate to:

- Give agents a clear, predictable place for instructions.
- Keep READMEs concise and focused on human contributors.
- Provide precise, agent-focused guidance that complements existing README and docs.

Rather than introducing another proprietary file, we chose a name and format that could work for anyone.

## One AGENTS.md works across many agents

Compatible with a growing ecosystem: UiPath Autopilot & Coded Agents, GitHub Copilot's coding agent, and (per FAQ / other sources) OpenAI Codex, Amp, Jules from Google, Cursor, Factory, and 20+ others. 60,000+ repositories have adopted it as of mid-2026 (per community coverage).

## Example

```
# Sample AGENTS.md file
## Dev environment tips
- Use `pnpm dlx turbo run where <project_name>` to jump to a package instead of scanning with `ls`.
- Run `pnpm install --filter <project_name>` to add the package to your workspace so Vite, ESLint, and TypeScript can see it.
- Use `pnpm create vite@latest <project_name> -- --template react-ts` to spin up a new React + Vite package with TypeScript checks ready.
- Check the name field inside each package's package.json to confirm the right name—skip the top-level one.
## Testing instructions
- Find the CI plan in the .github/workflows folder.
- Run `pnpm turbo run test --filter <project_name>` to run every check defined for that package.
- From the package root you can just call `pnpm test`. The commit should pass all tests before you merge.
- To focus on one step, add the Vitest pattern: `pnpm vitest run -t "<test name>"`.
- Fix any test or type errors until the whole suite is green.
- After moving files or changing imports, run `pnpm lint --filter <project_name>` to be sure ESLint and TypeScript rules still pass.
- Add or update tests for the code you change, even if nobody asked.
## PR instructions
- Title format: [<project_name>] <Title>
- Always run `pnpm lint` and `pnpm test` before committing.
```

Real-world repos citing AGENTS.md: openai/codex (Rust, 551+ stars context), apache/airflow, temporalio/sdk-java, PlutoLang/Pluto. 60k+ examples indexed on GitHub.

## How to use AGENTS.md?

### 1. Add AGENTS.md
Create an AGENTS.md file at the root of the repository. Most coding agents can even scaffold one for you if you ask nicely.

### 2. Cover what matters
Popular sections: Project overview, Build and test commands, Code style guidelines, Testing instructions, Security considerations.

### 3. Add extra instructions
Commit messages or pull request guidelines, security gotchas, large datasets, deployment steps: anything you'd tell a new teammate belongs here too.

### 4. Large monorepo? Use nested AGENTS.md files for subprojects
Place another AGENTS.md inside each package. Agents automatically read the nearest file in the directory tree, so the closest one takes precedence and every subproject can ship tailored instructions. At time of writing the main OpenAI repo has 88 AGENTS.md files.

## About

AGENTS.md emerged from collaborative efforts across the AI software development ecosystem, including OpenAI Codex, Amp, Jules from Google, Cursor, and Factory. It is now stewarded by the Agentic AI Foundation under the Linux Foundation.

## FAQ

**Are there required fields?** No. AGENTS.md is just standard Markdown. Use any headings you like; the agent simply parses the text you provide.

**What if instructions conflict?** The closest AGENTS.md to the edited file wins; explicit user chat prompts override everything.

**Will the agent run testing commands found in AGENTS.md automatically?** Yes — if you list them. The agent will attempt to execute relevant programmatic checks and fix failures before finishing the task.

**Can I update it later?** Absolutely. Treat AGENTS.md as living documentation.

**How do I migrate existing docs to AGENTS.md?**
```
mv AGENT.md AGENTS.md && ln -s AGENTS.md AGENT.md
```

**How do I configure Aider?** In `.aider.conf.yml`:
```
read: AGENTS.md
```

**How do I configure Gemini CLI?** In `.gemini/settings.json`:
```
{ "context": { "fileName": "AGENTS.md" }, }
```

---

## Codex-specific hierarchy/merge behavior (cross-referenced from community sources — see notes below)

Per developers.openai.com/codex/guides/agents-md (as quoted/summarized across multiple secondary sources), Codex CLI's actual merge behavior differs from the site FAQ's "closest file wins" framing:

> Merge order: Codex concatenates files from the root down, joining them with blank lines. Files closer to your current directory override earlier guidance because they appear later in the combined prompt.

This is confirmed by community analysis (agentconfig.ing, ccmd.dev, codersera.com — see the corresponding archived files in this research set):

- Codex CLI walks from the Git root down to the current working directory and concatenates ALL AGENTS.md files found along the path, joining with blank lines. Each file appears as its own user-role message with a header like `# AGENTS.md instructions for <path>`.
- Files closer to cwd appear later in the combined prompt, so they win on conflict (via recency/prompt-order weighting), not via a "single file selected" mechanism.
- This is a Codex-specific extension of the base AGENTS.md spec — GitHub Copilot, by contrast, uses nearest-ancestor-only resolution (walks up and uses only the first AGENTS.md found, ignoring parents).
- Codex CLI supports `AGENTS.override.md` at each directory level: if found, the regular AGENTS.md in that directory is skipped, enabling personal overrides without modifying team files. Not supported by GitHub Copilot.
- Codex supports configurable fallback filenames via `project_doc_fallback_filenames` in config.toml (checked only if no AGENTS.md/AGENTS.override.md found), and a configurable max file size via `project_doc_max_bytes` (default 64KB per community sources; other sources cite 32 KiB as the "default cap" — treat exact byte figure as needing live verification).
- Global location: `~/.codex/AGENTS.md`. Project: `./AGENTS.md` at repo root, plus nested `<dir>/AGENTS.md` at any subdirectory.
- Precedence order (per agentconfig.ing): (1) `~/.codex/AGENTS.md` (global), (2) `./AGENTS.md` (project), (3) `<dir>/AGENTS.md` (directory) — lower numbers load first, higher-priority files override lower ones (consistent with root-down concatenation).

Note: the canonical agents.md site FAQ states a simpler "closest file wins, no merge" model; OpenAI's own Codex docs (per community quotation) describe concatenation instead. Treat the site FAQ as the base spec and the Codex CLI docs as the authoritative behavior for Codex specifically — this discrepancy is actively discussed in the AGENTS.md standard's GitHub issues (agentsmd/agents.md#53).
