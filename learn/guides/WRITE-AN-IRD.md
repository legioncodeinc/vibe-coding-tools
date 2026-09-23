# Write an IRD for a tracked issue

An Issue Requirements Document (IRD) turns one reported defect or incident into a bounded fix with proof. Its number matches the existing GitHub issue. Use a PRD instead when the request is new product behavior; use a CTR when several plans need to agree on the same interface. [Why the Library exists](../concepts/WHY-THE-LIBRARY.md) compares the three.

## Before you begin

Have the issue URL or number, the observed behavior, the expected behavior, and any safe reproduction evidence. Do not invent a root cause because the symptom seems familiar. If no tracked issue exists, establish the issue before assigning an IRD number. The [Library Stinger's issue guide](../../plugins/wasp-nest-core/skills/library-stinger/guides/02-issue.md) owns the exact folder and lifecycle rules.

## 1. Record what is observed

Start with who encounters the bug, which environment is affected, how to reproduce it, and what was actually seen. Separate proven observation from hypothesis. "The cache is broken" does not distinguish a stale response from a client rendering error. "After an export reaches ready, refreshing the status page still shows processing for 60 seconds in the test environment" gives a testable symptom.

Preserve useful evidence without copying credentials, customer data, or private logs into a public issue. Name the redacted trace or test fixture where an authorized reviewer can find it.

## 2. Bound the correction

State the expected behavior, the behavior the fix must preserve, and work explicitly excluded. A stale status bug may require cache invalidation after a state transition; it does not authorize rebuilding the entire export pipeline. Record any dependent service, migration, or provider decision. If the fix reveals a new capability rather than a correction, propose a separate PRD instead of expanding the IRD without review.

## 3. Define verification before editing

Give each required outcome an observable check. A compact ExampleApp IRD might say:

```text
Issue: #42, export status remains processing after the export becomes ready.
Observed: The owner sees processing after a refresh even though the server records ready.
Expected: The next authorized status read reflects ready and includes the owner's download URL.
Preserve: Another member still receives no status or URL for this export.
Verify: Reproduce the stale response, run a state-transition regression test, and run an unauthorized-read test.
```

This is illustrative, not a claim that issue 42 exists in your project. The unauthorized-read check matters because a cache fix that reveals another member's URL is not a successful fix.

## 4. Link the issue and move one folder

Create one `ird-042-stale-export-status/` folder under `library/issues/backlog/` for a real issue 42. Include the issue link, evidence, decision owner, acceptance criteria, and verification plan. Do not create sub-IRDs for one issue. Move the whole folder through `in-work/` and `completed/` as the state changes. Keep QA evidence with the IRD so the next engineer can see why it was considered resolved.

Before closing, compare the final behavior with every criterion, attach the relevant test results, and state any remaining external check explicitly. "Fixed" without reproduction and verification evidence is not a completed IRD. [Execute a PRD](PRD-EXECUTION.md) teaches the same DONE versus VERIFIED distinction used in delivery work.
