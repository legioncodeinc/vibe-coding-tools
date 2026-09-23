# Authority and Scope

## Purpose

Establish what this Stinger can claim, which evidence controls a decision, and where work moves to another specialist.

## Procedure

1. Classify the request as inspection, upgrade, migration, IPC, authority, AI runtime, persistence, mobile integration, testing, or delivery.
2. Read [../TOPIC.md](../TOPIC.md) and the relevant focused guide before changing code.
3. For any version-sensitive statement, read [../references/CURRENT-TAURI-2.md](../references/CURRENT-TAURI-2.md) and refresh it through guide 09 before calling a value current.
4. Prefer official package-specific release tags over a generated release index when they conflict. The index lagged multiple August 31 plugin releases at the research cutoff. [../references/research/raw/tauri--release--ecosystem-index.md](../references/research/raw/tauri--release--ecosystem-index.md)
5. Trace behavior claims through [../references/research/distilled-tauri-2.md](../references/research/distilled-tauri-2.md) to a raw primary-source note.
6. Label every AI-specific architecture, protocol, and example as a derived design. No first-party Tauri AI reference application was found in the official sweep. [../references/research/raw/tauri--research--first-party-ai-gap.md](../references/research/raw/tauri--research--first-party-ai-gap.md)
7. Separate framework facts from application policy. For example, Tauri documents ordered Channels; request identifiers, token event types, backpressure, and cancellation are application designs. [../references/research/raw/tauri--docs--calling-frontend.md](../references/research/raw/tauri--docs--calling-frontend.md)
8. Escalate general Rust architecture to `rust-stinger`, frontend-framework internals to that framework's Stinger, formal security findings to `security-stinger`, and CI or release-system topology to `ci-release-stinger` or `devops-stinger`.

## Evidence labels

Use these labels in reports and recommendations:

| Label | Meaning |
|---|---|
| VERIFIED | Observed in the target repository or reproduced on a named target |
| DATED | Confirmed by a primary source at a stated date, but mutable |
| DERIVED | Engineering design assembled from documented primitives |
| OPEN | Not yet tested or proven |
| EXTERNAL | Requires a provider, store, certificate authority, device, or human action |
| BLOCKED | Cannot proceed safely without required input or authority |

## Non-negotiable boundaries

- Do not call a mutable release "latest" without a live primary-source refresh.
- Do not infer a Tauri API from a newer standalone Wry or Tao release. [../references/research/raw/tauri--source--runtime-wry-2.11.5-manifest.md](../references/research/raw/tauri--source--runtime-wry-2.11.5-manifest.md)
- Do not present browser mocks as native application proof. [../references/research/raw/tauri--docs--tests-overview.md](../references/research/raw/tauri--docs--tests-overview.md)
- Do not present Tauri Action mobile build output as store acceptance. [../references/research/raw/tauri--release--tauri-action-1.0.0.md](../references/research/raw/tauri--release--tauri-action-1.0.0.md)
- Do not commit or push around the Ship Gate.

