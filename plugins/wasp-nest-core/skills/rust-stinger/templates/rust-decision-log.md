# Rust decision log

| Decision | Chosen value | Evidence date | Source or test | Revalidate when | Owner |
|---|---|---|---|---|---|
| Toolchain pin | {{value}} | {{YYYY-MM-DD}} | {{source_or_command}} | Before upgrade/release | {{owner}} |
| MSRV | {{value_or_UNDECIDED}} | {{YYYY-MM-DD}} | {{feature_matrix_command}} | Dependency/feature change | {{owner}} |
| Product targets/baselines | {{value_or_UNDECIDED}} | {{YYYY-MM-DD}} | {{runtime_install_evidence}} | Release matrix change | {{owner}} |
| Tokio line | {{value}} | {{YYYY-MM-DD}} | {{support_policy_and_tests}} | Runtime upgrade | {{owner}} |
| SQLx transaction API | {{value}} | {{YYYY-MM-DD}} | {{selected_version_docs_and_tests}} | SQLx upgrade | {{owner}} |
| SQLite PRAGMAs | {{value_or_UNDECIDED}} | {{YYYY-MM-DD}} | {{durability_decision_and_crash_tests}} | Persistence policy change | {{owner}} |
| rustls configuration | {{value}} | {{YYYY-MM-DD}} | {{stable_docs_and_security_review}} | rustls/root-policy change | {{owner}} |
| Package generator | {{value}} | {{YYYY-MM-DD}} | {{version_and_diff_review}} | Generator upgrade | {{owner}} |
| Signing/attestation | {{value_or_UNAUTHORIZED}} | {{YYYY-MM-DD}} | {{approval_and_verification_policy}} | Every release | {{owner}} |
| Soak thresholds | {{value_or_UNDECIDED}} | {{YYYY-MM-DD}} | {{performance_SLO_source}} | Workload/platform change | {{owner}} |

## Rationale and alternatives

### {{decision_name}}

- Context: {{context}}
- Decision: {{decision}}
- Evidence: {{evidence}}
- Alternatives: {{alternatives}}
- Consequences: {{consequences}}
- Peer approval/gate: {{approval_or_open_gate}}
