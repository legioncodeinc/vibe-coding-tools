# Hooks: checks at lifecycle events

A hook is a small program invoked when a supported harness event happens. It can provide context at session start, block a specific unsafe edit, or report a validation result after a tool runs. A hook is not a substitute for a user's decision: seeing a prompt is not consent to modify files or contact an external system.

## The four source hooks

| Hook | Event in supported local installs | What it does |
| --- | --- | --- |
| [`onboarding-session.mjs`](../../plugins/wasp-nest-core/hooks/onboarding-session.mjs) | Session start | Reads `~/.legioncodeinc.lock`, then the repository's `wasp-nest.lock`, and asks the assistant to offer the missing setup step. It makes no file changes. |
| [`session-start-cadence.mjs`](../../plugins/wasp-nest-core/hooks/session-start-cadence.mjs) | Session start where configured | Adds the local work-cadence reminder. |
| [`dash-guard.mjs`](../../plugins/wasp-nest-core/hooks/dash-guard.mjs) | Before a supported edit or write | Checks new prose for em and en dashes and rejects that edit when the rule applies. |
| [`component-validate.mjs`](../../plugins/wasp-nest-core/hooks/component-validate.mjs) | After a supported edit or write | Reports Wasp Nest component validation findings. It is advisory because an edit may be one step in an unfinished series. |

The set actually active in a plugin can differ from a full local installation. Inspect the installed plugin's [hook manifest](../../plugins/wasp-nest-core/hooks/hooks.json) and the [harness reference](../reference/HARNESS-CAPABILITIES.md) instead of assuming that copying a JavaScript file makes the event work everywhere. Event names, input shapes, output JSON, path resolution, timeouts, and hook trust differ by host. Cowork cannot write into your local home through the onboarding hook.

## Blocking versus advisory

Use a blocking hook only for a narrow condition that can be checked reliably and corrected without damage. A dash guard can reject one proposed edit and tell the writer what to replace. A component validator often runs after a file changes, so it should report findings rather than undo the file. Onboarding reads lock state and adds context; the Get Started Stinger performs writes only after separate user consent.

For example, an absent home lock produces an invitation to review global instruction templates. It does **not** create `AGENTS.md`, `CLAUDE.md`, or the lock. If the user declines, the assistant continues the original task. [Getting Started](GETTING-STARTED.md) describes the two-step flow.

## Check a hook before relying on it

Inspect the enabled manifest and run a safe fixture through the hook. Confirm that ordinary input is allowed, the intended unsafe input gets a clear response, irrelevant file types do not false-block, and an error fails open where appropriate. For onboarding, test both lock states and verify that no files were written by the hook itself. Never describe a hook as portable solely because its script exists in multiple packs.
