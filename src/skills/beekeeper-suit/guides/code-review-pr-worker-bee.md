# code-review-pr-worker-bee

## Domain
Owns code review as a culture and practice: PR description quality against a canonical six-element structure (motivation, context, what changed, what did NOT change, testing proof, reviewer hints), context-specific review checklist generation, PR size evaluation against a 400-line threshold with split strategies, rubber-stamp culture diagnosis, and coaching review comments into a three-tier taxonomy (blocker/suggestion/nit). Never approves or blocks a merge; merge decisions stay with humans and CI.

## Paired Stinger
[code-review-pr-stinger](../../code-review-pr-stinger) - the six-element description structure, checklist generation by file type, the 400-line size heuristic with split strategies, async-review norms, rubber-stamp detection signals, and comment-coaching rewrites.

## Trigger phrases
- "audit our PR culture"
- "write a PR description for this diff"
- "create a review checklist for this change"
- "coach this review comment, it sounds too harsh"
- "is this PR too large, should I split it"
- "how do we improve code review on our team"
- "why do our reviews feel like rubber stamps"
- "review this PR for description quality"

## Do NOT route when
- The request is security audit findings; that is security-worker-bee.
- The request is implementation correctness at the logic level; that is python-worker-bee or react-worker-bee.
- The request is CI/CD pipeline setup; that is devops-worker-bee.
- The request is branch protection configuration or enforcing a PR template at the repository-settings level; that is github-repo-health-worker-bee.
- A review comment being coached contains an actual security finding; surface it separately to security-worker-bee rather than just softening the tone.

## Inputs the Bee needs
- The PR diff or description, and which request type applies (description audit, checklist, size evaluation, culture diagnosis, comment coaching).
- File types present in the diff, to scope a context-specific checklist.
- For culture audits, repo-level metrics access (zero-comment PR rate, review latency) or a GitHub API token.

## Outputs
- A scored PR description audit table (pass/fail/warn per element) plus a rewrite.
- A context-specific three-phase review checklist.
- A size-evaluation flag with a concrete split proposal, or a culture scorecard with a remediation plan.

## Commonly sequenced with
- security-worker-bee: takes any security finding surfaced mid-comment-coaching.
- python-worker-bee / react-worker-bee: own implementation correctness that this Bee's checklists point at but do not judge themselves.
- github-repo-health-worker-bee: enforces PR templates and branch protection at the settings level that this Bee only coaches content for.
- devops-worker-bee: owns the CI checks that a review checklist references but does not configure.
