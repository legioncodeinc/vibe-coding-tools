# Resolve the core dependencies

App Primer Zero is an optional composition layer over Wasp Nest core. It does not vendor a second Get Started, Library, Knowledge or Contract Writing implementation.

| Required method | Responsibility | Canonical source |
|---|---|---|
| pest-controller-suit | Route specialist tasks before dispatch | [source](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/pest-controller-suit/SKILL.md) |
| get-started-stinger | Repository setup within scope and CI preference | [source](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/get-started-stinger/SKILL.md) |
| knowledge-stinger | Private narrative and actual current state | [source](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/knowledge-stinger/SKILL.md) |
| library-stinger | Foundation PRD and Library lifecycle | [source](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/library-stinger/SKILL.md) |
| contract-writing-stinger | Draft, exact acceptance, revision and pinning | [source](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/contract-writing-stinger/SKILL.md) |
| security-stinger, quality-stinger | Ordered review of actual changes | [core source skills](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills) |
| github-repo-health-stinger | Final coordinator review with explicit coverage | [source](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/github-repo-health-stinger/SKILL.md) |

Resolve the core prerequisite from the active harness registry or the explicit installed-plugin registry `~/.wasp-nest/installed-plugins.json`. Core's implemented `hooks/resolve-component.py` checks canonical ownership, installed identity, exact catalog version, prerequisites and the component path. `WASP_NEST_PLUGIN_REGISTRY` overrides the default registry; `--registry` selects an explicit file. Use resolved registered roots rather than an arbitrary cache/version. Resolver behavior must be checked against the selected distribution and registry; source inspection alone is not an installed-host result.

## Resolver interface

The source implementation is `src/hooks/resolve-component.py`; its built location is inside Core at `hooks/resolve-component.py`. Replace every bracketed placeholder below with a registered absolute path before invoking:

```text
python3 "[Core installed root]/hooks/resolve-component.py" app-primer-zero-stinger --registry "[explicit registry JSON]" --core-root "[Core installed root]"
```

`--kind` accepts `skill`, `agent` or `command` and defaults to `skill`. `--workflow` accepts an exact optional prerequisite key declared by the owning plugin; do not invent one for App Primer Zero. `--core-root` identifies Core explicitly instead of relying on its environment/script-location default.

The registry shape is an object with a `plugins` mapping from plugin ID to absolute installed root. The following is a shape example, not a live configuration to write:

```json
{"plugins":{"wasp-nest-core":"/absolute/core-root","app-primer-zero":"/absolute/primer-root"}}
```

Success returns JSON with `plugin`, `kind`, `name`, `path` and `checked_plugins`. For this skill, the owner is `app-primer-zero`, kind is `skill`, and checked prerequisites include `wasp-nest-core`. Missing prerequisites, wrong identity/version, ambiguous ownership, unknown workflow keys or missing/symlinked component files refuse with exit 1. Read the actual result and referenced method before dispatch; a documented return shape is not a successful resolver exercise.

## Source fallback and missing capabilities

For explicit source-only preparation, a user-supplied readable Wasp Nest checkout may provide retained core methods under `src/skills/`; label this as source-method execution and do not claim installed registry resolution. Read the SKILL.md and referenced methods needed for the phase before dispatch.

Source URLs above identify components; they are not proof a corresponding native role is available. If files are readable but a native specialist role is unavailable, execute the resolved specialist method directly and say so. If a required method cannot be read, report its exact missing identity and stop the dependent phase. Do not auto-install, fetch credentials or invent a replacement. Independent authorized inventory may continue.

The canonical `plugin-catalog.json` records this pack's `wasp-nest-core` prerequisite. The builder/installer project that ownership and enforce prerequisite selection. This content method also checks the resolved prerequisite at runtime, rather than treating a manifest string as proof of a working installation. Shared core remains separately installed; unmet prerequisites stop dependent work.
