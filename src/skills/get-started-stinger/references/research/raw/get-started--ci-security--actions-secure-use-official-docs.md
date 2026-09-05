# Secure use reference (GitHub Actions)
- URL: https://docs.github.com/en/actions/reference/security/secure-use
- Fetched: 2026-08-14
- Source type: official-docs
- Component: ci

## Principle of least privilege

Any user with write access to a repository has read access to all secrets configured on it, so credentials used inside workflows must carry the least privilege required. Actions read `GITHUB_TOKEN` from the `github.token` context. Good security practice is to set the default permission for `GITHUB_TOKEN` to read-only on repository contents, then raise it per job only where required (`Use GITHUB_TOKEN for authentication in workflows`).

## Secrets handling

- Mask sensitive data not already registered as a GitHub secret with `::add-mask::VALUE`.
- Redaction happens on the runner and only for values used within the job; if an unredacted secret lands in a log, delete the log and rotate the secret.
- Never use structured data (JSON/XML/YAML blobs) as a single secret value — it breaks exact-match redaction. Create individual secrets per sensitive value instead.
- Any value derived from a secret (e.g. a JWT signed with a private-key secret) must itself be registered as a secret via the toolkit's `setSecret`, or it will not be redacted if it leaks to logs.
- Periodically audit and rotate registered secrets; remove unused ones.
- Consider required reviewers on environments to gate access to environment secrets — a job cannot read environment secrets until a reviewer approves.

## Script injection mitigation

Untrusted context values (PR titles, issue bodies, etc.) interpolated directly into `run:` blocks are a shell-injection vector. Two safe patterns:

1. **Use an action instead of an inline script** — pass the untrusted value as an action `with:` input; it becomes an argument, not shell text.
2. **Use an intermediate environment variable**:

```yaml
- name: Check PR title
  env:
    TITLE: ${{ github.event.pull_request.title }}
  run: |
    if [[ "$TITLE" =~ ^octocat ]]; then
      echo "PR title starts with 'octocat'"
    fi
```

CodeQL and OpenSSF Scorecards can both detect vulnerable workflow patterns automatically; the article recommends enabling default-setup CodeQL scanning of Actions workflows themselves.

## Untrusted code checkout: pull_request_target and workflow_run

`pull_request_target` and `workflow_run` run with the privileged context of the base repository (write access, secrets) even when triggered by a fork. Checking out untrusted PR content inside one of these triggers is a known repository-takeover vector ("pwn requests," per GitHub Security Lab research).

Good practices:
- Avoid `pull_request_target`/`workflow_run` unless the privileged context is actually required; prefer `workflow_run` for privilege separation over `pull_request_target`.
- Never explicitly check out untrusted fork code inside a workflow using these triggers.
- Enable CodeQL default setup so it flags dangerous-workflow patterns (OpenSSF Scorecard calls this the "Dangerous-Workflow" check).

## Using third-party actions

A compromised action has access to every secret configured for the job and can use `GITHUB_TOKEN` to write to the repository, so sourcing actions from third parties is a real supply-chain risk. Mitigations:

- **Pin actions to a full-length commit SHA.** This is the only immutable reference; verify the SHA belongs to the action's own repository, not a fork. GitHub supports repository- and organization-level policies that *require* SHA pinning for all Actions usage.
- **Audit the action's source** before adopting it (unintended secret exfiltration, unexpected logging).
- **Pin to a tag only if you trust the publisher** — tags are mutable and can be force-moved by a compromised maintainer account; the Marketplace "Verified creator" badge is a partial trust signal, not a guarantee.
- The same guidance applies to reused third-party *workflows*.

## GitHub's built-in security features referenced

- Dependabot version updates keep pinned action SHAs current (opens a PR with the new SHA and tag comment).
- CodeQL default setup for code scanning, including scanning of the workflow files themselves.
- OpenSSF Scorecard action/workflow template for supply-chain posture checks (script injection, token permissions, pinning).
