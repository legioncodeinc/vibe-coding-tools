# Rust implementation handoff: {{slice_name}}

## Outcome

{{what_is_now_true}}

## Authority and scope

- Repository/worktree: `{{absolute_path}}`
- Source authority: `{{prd_or_adr_path}}`
- Owned paths: {{owned_paths}}
- Gates consumed: {{gate_ids_or_none}}
- Concurrent/user edits preserved: {{evidence}}

## Acceptance evidence

- {{AC_ID}}: {{command_test_or_artifact}} — {{PASS_FAIL_BLOCKED}}

## Changed paths

- `{{path}}` — {{reason}}

## Verification

- `{{exact_command}}` — {{PASS_FAIL_BLOCKED}}

## Safety and operations

- External effects used: {{none_or_explicit_authorization_and_effect}}
- Async/shutdown/replay: {{evidence}}
- Migration/rollback/recovery: {{evidence}}
- Secrets/prompts/logging/diagnostics: {{evidence}}
- Unsafe inventory: {{none_or_review_reference}}

## Revalidation points

- Toolchain/MSRV/targets: {{current_evidence_or_owner_decision}}
- Dependency/runtime APIs: {{current_evidence_or_owner_decision}}
- Durability/contention: {{current_evidence_or_owner_decision}}
- Release/signing/soak: {{current_evidence_or_owner_decision}}

## Peer handoffs and remaining gates

- Security: {{ready_or_blocker}}
- Affected-check rerun after Security: {{commands_or_pending}}
- Quality: {{ready_only_after_security_and_reruns}}
- Protocol/platform/database/dependency/release: {{owner_and_open_item}}

## Blocker, if any

- Gate/owner: {{gate_and_owner}}
- Affected criteria: {{AC_IDS}}
- First authorized next action: {{next_action}}
