# Tauri Capability Review

- Review date:
- Application version:
- Target platforms:
- Capability files reviewed:
- Generated schema used:

## Effective access by WebView

| Window or WebView label | Capabilities | Effective permission union | Remote origins | Risk |
|---|---|---|---|---|
| | | | | |

## Custom commands

| Command | AppManifest entry | Permission | Scope type | Enforcement site | Input validation |
|---|---|---|---|---|---|
| | | | | | |

## Plugin permissions

| Plugin | Permission or set | Allow scope | Deny scope | Why required |
|---|---|---|---|---|
| | | | | |

## Review questions

- [ ] Each capability maps to one stated trust boundary.
- [ ] Wildcard labels are justified or removed.
- [ ] Multiple-capability membership has been evaluated as a union.
- [ ] Remote URL patterns are absent or minimized by scheme, host, and path.
- [ ] Linux and Android iframe ambiguity is included in the threat model.
- [ ] Window creation is restricted to a high-trust context.
- [ ] Custom commands that require restriction are in `AppManifest::commands`.
- [ ] Custom scope enforcement handles canonicalization, deny precedence, and bypass cases.
- [ ] Shell and sidecar access names exact commands and bounded arguments.
- [ ] Database and Store mutation permissions are no broader than the UI requires.
- [ ] Model output is data and is never evaluated as JavaScript.
- [ ] A formal Security pass will review the completed implementation.

## Findings

| Severity | Boundary | Finding | Evidence | Remediation |
|---|---|---|---|---|
| | | | | |

