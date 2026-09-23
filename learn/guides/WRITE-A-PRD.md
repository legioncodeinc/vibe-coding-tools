# Write a PRD before building a feature

A Product Requirements Document (PRD) is a testable agreement about a planned product change. It states the problem, who it affects, the outcome, the boundary, and the evidence that will count as done. It is not a task list and it does not settle a shared API by implication. If separate workstreams depend on the same behavior, [agree on a CTR](WRITE-A-CTR.md) first and pin its accepted revision.

## Before you begin

Have an observed problem or a deliberate product goal, a named owner for open decisions, and access to the target repository's `library/`. If the Library is not initialized, use [Get Started](GETTING-STARTED.md) first. A PRD number is the next unused number in that repository; it is not automatically a GitHub issue number.

## 1. State the problem and audience

Describe what is difficult today and which people or systems experience it. "Login is bad" gives a builder no useful boundary. "Invited members abandon first sign-in because they must invent a password before accepting an invitation" gives a specific situation that can be investigated. Cite support data or an observed reproduction when you have it; label an untested belief as a hypothesis.

## 2. Name the outcome and non-goals

Write a goal that a reviewer can recognize, then list work deliberately excluded from this delivery. Non-goals are scope boundaries, not claims that excluded work will never be built. For a passwordless sign-in PRD, an outcome might be one secure email-link path; SMS login, account-settings redesign, and replacement of social providers can remain out of scope.

## 3. Fill the ten essential parts

| Part | Question the PRD must answer |
| --- | --- |
| Identity and status | What stable ID, title, owner, lifecycle state, and dates identify this plan? |
| Problem | What happens today, and what evidence supports the need? |
| Affected people | Which user roles, support staff, or systems experience the change? |
| Goal and outcome | What should improve, and how will anyone tell? |
| Non-goals | What adjacent work is excluded? |
| User journey | What must a person be able to do, including failure and recovery paths? |
| Acceptance criteria | Which numbered, observable statements define done? |
| Constraints and risks | Which existing behavior must remain and what might fail? |
| Dependencies and decisions | Which provider setting, human choice, migration, or accepted CTR is required? |
| Validation plan | What check or evidence will prove each criterion? |

Use the [Library Stinger's feature guide](../../plugins/wasp-nest-core/skills/library-stinger/guides/03-feature-prd.md) for the repository's exact PRD folder and index format. A larger feature may have an index and sub-PRDs for backend and interface work. They share a goal but must not silently invent different terms for a common boundary.

## 4. Make criteria observable

An acceptance criterion should describe behavior that a test or human observation can distinguish from failure. Avoid words such as "good," "easy," and "secure" without a defined measure. The following is an illustrative ExampleApp criterion, not a requirement for your product:

```text
AC-03: Given an expired, altered, or previously used sign-in link, opening the link creates no session and returns the same public error message for all three cases.
```

This names inputs, observable behavior, and the negative cases. A validation row could name automated replay and expiry tests, plus a browser test for the public response. "Sign-in works well" cannot be verified the same way. Keep a one-to-one map between criteria and evidence so an untestable promise is visible before implementation.

## 5. Pin shared contracts and decisions

Add a `## Contract dependencies` section for each shared boundary. Record the `CTR-###` path, accepted revision, provider, consumers, and the criteria it affects. A Draft or disputed contract is a named blocker for those criteria, not a fact the PRD author can assume. Independent criteria may still proceed. Record other unresolved decisions with their human owner and the artifact needed to resolve them.

## 6. Review a small complete example

This example is synthetic. It demonstrates a compact PRD, not a ready-to-copy product decision:

```markdown
# PRD-007: User export status

## Problem
Members request an export but cannot see whether it is queued, ready, or failed.

## Goal
Show a clear export status without exposing another member's download URL.

## Non-goals
- Scheduling recurring exports.
- Changing the contents of the exported file.

## Acceptance criteria
- AC-01: The requesting member sees queued, processing, ready, or failed status.
- AC-02: A download URL appears only in the ready state and only to the owner.
- AC-03: A request for another member's export reveals neither its state nor its URL.

## Contract dependencies
- CTR-004 revision 1: export status response, accepted before backend and interface PRDs are finalized.

## Validation
- Provider tests for every status and access rule.
- Interface tests for queued, ready, failed, and unauthorized responses.
```

The [Contract Writing handoff example](../../plugins/wasp-nest-core/skills/contract-writing-stinger/examples/prd-parallel-handoff.md) shows how provider and consumer PRDs pin the same revision. [Execute a PRD](PRD-EXECUTION.md) explains the acceptance ledger once work begins.

## 7. Review before work starts

Ask whether a new reader can identify the problem, affected people, success measure, excluded work, exact criteria, shared contracts, and evidence plan. If a provider choice or authorization rule is still a guess, keep that decision open and assign an owner. Move the PRD folder from `backlog/` to `in-work/` only when it becomes the active plan; completion requires evidence, not merely a merged code change.
