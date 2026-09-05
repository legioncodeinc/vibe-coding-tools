# About rulesets
- URL: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets
- Fetched: 2026-08-14
- Source type: official-docs
- Component: branch-protection

## What a ruleset is

A ruleset is a named list of rules applied to a repository, or to multiple repositories org-wide on GitHub Team/Enterprise plans. Up to 75 rulesets per repository and 75 organization-wide rulesets. A ruleset can grant bypass permission to specific roles (e.g. repository administrator), teams, or GitHub Apps.

## Branch/tag rulesets vs push rulesets

- **Branch and tag rulesets** target branches or tags via `fnmatch` patterns (e.g. `releases/**/*`) and control things like required signed commits, blocked force-pushes, or who can delete/rename a tag.
- **Push rulesets** apply to every push against a private/internal repository and its entire fork network (no branch targeting needed) and can restrict: file paths (via `fnmatch`), file path length, file extensions, and file size. Push rules propagate through the whole fork network — forking a repo with a push ruleset inherits that ruleset in the fork, and only people with bypass permission on the *root* repository can bypass it in forks.

## Rulesets vs classic branch protection rules

Both can protect the same branch simultaneously and are enforced together (see rule layering below). Rulesets add:
- Multiple rulesets can apply to one branch at once; only one branch protection rule can apply to a branch at a time.
- Enforcement can be toggled (Active/Disabled) without deleting the ruleset.
- Any read-access collaborator can view active rulesets (branch protection rules require admin access to view), which helps both contributors and auditors.
- Rulesets can also govern commit metadata (commit message format, author email pattern).

Convert existing branch protection rules to rulesets via "Converting branch protections to rulesets."

## Rule layering

A ruleset has no priority relative to other rulesets or branch protection rules targeting the same branch: **all applicable rules from every source are aggregated**, and where the same rule is expressed differently across sources, the **most restrictive version wins**. Worked example: a ruleset requiring signed commits + 3 required reviews, layered with a classic branch-protection rule requiring linear history + 2 required reviews, results in the branch needing signed commits, linear history, *and* 3 reviews (the higher number wins).

## Practical implication for an initialization skill

Because rulesets are additive with branch protection and score independently in the community/health surface, recommending "set up branch protection or a ruleset requiring PR review + passing status checks + CODEOWNERS review" as a human-decision step (not something the skill can do itself without API/admin access) is the correct scope boundary — this skill can generate CODEOWNERS and CI status checks, but enabling the ruleset itself is a GitHub Settings action needing admin/owner permission.
