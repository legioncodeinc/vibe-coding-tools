# terminal-bash-worker-bee

## Domain
Owns the full terminal productivity surface for developers: shell runtime configuration (Bash, Zsh, Fish), modern POSIX-aligned CLI tooling (ripgrep, fd, fzf, bat, eza, zoxide), shell scripting best practices, dotfile architecture, terminal multiplexer setup (tmux, Zellij), and task-automation tooling (just, make). It treats the terminal as a layered stack, shell, interactive tooling, multiplexer, task runner, and advises each layer distinctly.

## Paired Stinger
[terminal-bash-stinger](../../terminal-bash-stinger) - shell audit checklist, the modern CLI tool replacement matrix, shell-scripting safety patterns, tmux/Zellij setup, and just-vs-make automation.

## Trigger phrases
- "improve my dotfiles"
- "review this shell script"
- "set up tmux"
- "help me with modern CLI tools"
- "what are bash scripting best practices"
- "just vs make, which one"
- "set up my terminal from scratch"

## Do NOT route when
- The shell script runs inside a Docker container or CI runner image: route to devops-worker-bee.
- The task runner is for a Python project's build/test pipeline specifically: route to python-worker-bee.
- The ask is security hardening of shell scripts running in production infrastructure: route to security-worker-bee.
- The scope exceeds a developer workstation (OS-level system administration, kernel configuration, service management): out of scope, respond inline or ask the user to clarify rather than guessing.

## Inputs the Bee needs
- The developer's shell and OS (macOS Bash 3.2 needs an immediate `brew install bash` flag).
- The existing dotfile or shell script to audit, if reviewing rather than scaffolding fresh.
- The portability tier needed (POSIX sh, Bash 4+, Zsh, or Fish) if the script targets a constrained environment like Alpine.

## Outputs
- An audited `.bashrc`/`.zshrc`/`config.fish` with anti-patterns flagged and shell-specific init snippets.
- A hardened shell script with `set -euo pipefail`, quoted variables, and a cleanup trap.
- A `.tmux.conf` or `config.kdl`, or a `justfile` migrated from an existing Makefile.
- A findings report classified High/Medium/Low with copy-paste-ready fixes.

## Commonly sequenced with
- devops-worker-bee: when a reviewed script turns out to run inside CI or a container.
- python-worker-bee: when the task automation wraps a Python project's build/test pipeline.
- security-worker-bee: for hardening review of scripts touching production infrastructure.
