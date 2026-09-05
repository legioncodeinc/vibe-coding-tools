# Living documentation: change triggers, ownership, staleness signals

- **Title:** How to build living documentation that actually stays updated
- **URL:** https://falconer.com/guides/living-documentation
- **Fetched:** 2026-08-17
- **Source type:** vendor-blog (documentation tooling vendor, commercial interest in the
  conclusion)

## What triggers an update

The article argues for point-of-change detection over scheduled review:

- Pull request hooks that scan commit diffs against linked documentation. Quoted: "PR hooks
  scan commit diffs against linked docs in real-time, flagging affected pages the moment
  code changes merge."
- Automated execution of embedded code snippets in CI.
- Timestamp comparison between a document's last edit and the last change to what it
  describes.

## Ownership model

Ownership follows the code path rather than volunteer sign-up. Alerts route to the engineer
who wrote the change, with the pull request as context, on the argument that the person
best placed to fix the doc is then always the person asked.

## Cadence argument

Quarterly audits are characterized as finding drift months late, after dozens of merges
have already introduced inaccuracies. Real-time detection is characterized as preventing
compounded staleness.

## Staleness signals it names

Renamed variables, services, or endpoints. Deprecated feature flags still referenced.
Changed internal terminology. Modified API endpoints or workflows. Code snippets that no
longer pass CI.

## Evidence quality, stated plainly

Weak. Two headline numbers are unsupported:

- "Half of developers lose around 10 hours weekly sourcing needed information" is attributed
  to McKinsey but is contextualized rather than quoted, and the underlying figure is not
  traceable from the article.
- A 30 percent onboarding time reduction claim carries no citation at all.
- The assertion that drift breeds drift carries no citation.

Take the mechanism list (what signals staleness) as useful practitioner structure. Do not
repeat the numbers. The timestamp-comparison signal is the only one that transfers cleanly
to a knowledge pack sourced from meetings rather than from code, because there is no commit
diff to hook.
