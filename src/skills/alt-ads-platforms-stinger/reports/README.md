# Reports

This folder accumulates channel audit and campaign performance reports produced by `alt-ads-platforms-worker-bee`.

## Report types

**Channel-fit diagnosis reports:** Named `YYYY-MM-DD-channel-fit-[company-slug].md`. Contains the filled-in channel-fit scorecard, recommended channel stack, and budget allocation for a specific company/ICP.

**Platform audit reports:** Named `YYYY-MM-DD-audit-[platform]-[company-slug].md`. Contains findings from an audit of an existing campaign (what's working, what's broken, recommendations).

**CAPI setup reports:** Named `YYYY-MM-DD-capi-setup-[platform]-[company-slug].md`. Documents the server-side conversion API wiring completed for a company.

## Format

Each report should include:
- Date and author
- Company/product context
- Scope of the engagement
- Findings or output (scorecard, recommendations, setup steps completed)
- Next steps

## Initially empty

This folder starts empty. Reports accumulate as `alt-ads-platforms-worker-bee` completes engagements.
