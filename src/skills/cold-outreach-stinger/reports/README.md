# Reports

This folder collects past cold outreach audit reports produced by `cold-outreach-worker-bee`.

## Report types

- **Deliverability audit:** `YYYY-MM-DD-<company>-deliverability-audit.md` — infrastructure and deliverability assessment, findings classified as blocking / degraded / advisory
- **Sequence audit:** `YYYY-MM-DD-<company>-sequence-audit.md` — sequence copy, cadence, and personalization review
- **Full outreach program audit:** `YYYY-MM-DD-<company>-outreach-audit.md` — end-to-end program review (tools, infrastructure, sequence, list, reply handling)

## Report format

Each report includes:
1. **Scope** — what was reviewed, what was not
2. **Findings** — numbered list with severity (blocking / degraded / advisory) and specific action required
3. **Benchmarks** — current vs target metrics
4. **Fix sequence** — ordered steps (infrastructure first, then list, then copy)
5. **Follow-up date** — when to re-evaluate

## Accumulation

This folder starts empty. Reports are added by `cold-outreach-worker-bee` when a formal outreach audit is requested. See `templates/deliverability-audit-checklist.md` for the self-service version.
