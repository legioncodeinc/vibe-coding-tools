# Troubleshooting a public Wasp Nest install

## A pack or Drone is missing

Check the current [pack catalog](../../README.md#what-ships) and confirm the relevant plugin is installed and enabled. Core can recognize an optional HighLevel task even when the `highlevel` pack is not installed. Install that pack before dispatching its Drone. If an older user-level agent has the same name as a plugin agent, compare them before deciding which one to disable or remove.

## A command is missing

Claude Code exposes plugin commands. Codex receives corresponding Stinger wrappers rather than a Claude-style commands directory. Invoke the wrapper skill or ask for the workflow by name. The [core command files](../../plugins/wasp-nest-core/commands/) are the readable reference, and [Harness Capabilities](../reference/HARNESS-CAPABILITIES.md) lists the limits for each host.

## Onboarding did not prompt

Check whether `~/.legioncodeinc.lock` already marks home setup and whether `wasp-nest.lock` exists in the repository. The [onboarding hook](../../plugins/wasp-nest-core/hooks/onboarding-session.mjs) checks them in that order and prompts only on supported local session surfaces. Cowork cannot write to your local home through this hook. Codex may require trusting its installed hook once through `/hooks`. You can still ask the Get Started Stinger to explain and run the consent-based process manually.

## The public README looks stale

The public README's pack table is generated from the built plugins on every source CI run, then checked in the CI preview. It reaches this public repository only through the owner's manual source release and the reviewed staging-to-main PRs. It does not rewrite public `main` after each CI run. Compare the [current public release](https://github.com/legioncodeinc/vibe-coding-tools/releases) with the version shown in [the README](../../README.md) before reporting drift.

## A PRD is blocked by a contract

Read its `## Contract dependencies` section and the pinned `CTR-###` revision. A Draft or disputed term cannot be treated as accepted. [Execute a PRD](PRD-EXECUTION.md) explains how to route the decision to Contract Writing and keep unrelated work moving.
