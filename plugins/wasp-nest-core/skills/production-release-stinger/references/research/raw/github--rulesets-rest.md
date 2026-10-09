# GitHub REST API: Repository rulesets
- URL: https://docs.github.com/en/rest/repos/rules
- Fetched: 2026-09-29
- Source type: official vendor docs (docs.github.com)

## Key facts
- Endpoints: /repos/{owner}/{repo}/rulesets (list/create), /{ruleset_id} (get/update/delete), /history, /rules/branches/{branch}.
- Fields: id, name, target (branch/tag/push/repository), enforcement (disabled/active/evaluate), bypass_actors (actor_id, actor_type, bypass_mode), conditions.ref_name.include/exclude, rules.
- Rule types include creation, update, deletion, required_linear_history, merge_queue, required_deployments, required_signatures, pull_request, required_status_checks, non_fast_forward, pattern rules, workflows, code_scanning, etc.
- IMPORTANT: lock_branch appears NOWHERE in the rulesets API reference. It is not a rule type, body parameter, or response field. Lock-branch is a classic branch-protection capability only. This corroborates the reachlynk AGENTS.md rule that "a ruleset alone is not accepted as substitute evidence" for a freeze.
