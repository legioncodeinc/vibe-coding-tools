<!--
README template. Canonical section order per
raw/get-started--readme--how-to-write-a-github-readme-repoclip.md.
Fill every {placeholder}. Delete sections that genuinely do not apply, but
keep the ones you keep in this order: reordering makes readers hunt for
the answer they came for. Delete this comment block when done.
-->

# {project_name}

<!-- Badges: pick 3-5 that carry real information (build, version, license,
coverage). A wall of badges is noise; drop any badge that's always green. -->
[![CI](https://img.shields.io/github/actions/workflow/status/{org}/{repo}/ci.yml?branch={default_branch}&label=CI)]({repo_url}/actions/workflows/ci.yml)
[![License](https://img.shields.io/github/license/{org}/{repo})]({repo_url}/blob/{default_branch}/LICENSE)
[![Release](https://img.shields.io/github/v/release/{org}/{repo})]({repo_url}/releases)

{One plain sentence: what this does and who it is for. Lead with the verb, not "This is a...".}

## What it is

{Two to four sentences expanding on the one-liner. What kind of thing is this: a library, a CLI, a service, an app? What does it do that a reader can't already do?}

## Why it exists

{The problem this solves, or the gap it fills. What did you try before this existed? Two or three sentences, not a manifesto.}

## Quick start

{The smallest possible working example: install, run one command, see output. Time-to-first-success measured in seconds, not minutes.}

```bash
{quick_start_command}
```

## Install

{Prerequisites stated right here, immediately above the command: not three sections later where the reader only discovers them after the command fails.}

- {prerequisite_1, e.g. "Node.js {node_version} or newer"}
- {prerequisite_2}

```bash
{install_command}
```

## Usage

{Show, don't tell. Lead with the single most common use case; add one or two progressively advanced examples after. Keep each example self-contained enough to copy and run.}

```{language}
{usage_example}
```

## Configuration

{Every environment variable, config file key, or CLI flag this project reads, in a table. See .env.example for the full list of environment variables.}

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `{ENV_VAR_NAME}` | {yes/no} | `{default_value}` | {what it controls} |

## Architecture

{For anything beyond a single-purpose utility: a short description of how the pieces fit together, and/or a Mermaid diagram. GitHub renders ```mermaid fenced blocks natively: no external image files, no stale PNGs.}

## Development

{How to get a local dev environment running: clone, install, env setup, run the dev server. Link to CONTRIBUTING.md for the full workflow rather than duplicating it here.}

```bash
{dev_setup_commands}
```

## Testing

{The exact command(s) to run the test suite, and what "passing" looks like.}

```bash
{test_command}
```

## Deployment

{How this ships: the pipeline, the environments, what triggers a deploy. Link to a runbook or deploy-checklist doc if one exists rather than inlining every step.}

## Contributing

{A short paragraph plus a link. See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full guide: branching, commit conventions, and how to run tests before opening a PR.}

## License

{project_name} is licensed under the [{license_name}](./LICENSE).
