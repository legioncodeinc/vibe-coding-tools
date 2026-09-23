# Example: SaaS Minor Release Changelog Entry

> Demonstrates: impact-first structure, user-centric language, honest scope note, distribution checklist.
> Guide references: `guides/03-copy-craft.md`, `guides/04-distribution-channels.md`

---

## Input (what the team provided)

Team shipped a sprint. Here's what they gave us:

```
PRs merged this sprint:
- Fix race condition in auth token refresh (#412)
- Add CSV export to the Reports page (#398)
- Upgrade Postgres connection pool to PgBouncer (#401)
- Fix blank screen on dashboard after switching workspaces (#407)
- Improve invite email rendering in Gmail (#415)
- Started work on bulk action menu but not shipping yet
```

---

## Output (the changelog entry)

```markdown
## [2.4.0] - 2026-05-20

Export your reports, fixed two frustrating bugs, and made the invite email look great in Gmail.

### New
- **CSV export on Reports**: download any report as a CSV from the new export button in the top-right corner of every report view. Supports all date ranges and filter combinations.

### Fixed
- **Blank screen after switching workspaces**: opening a different workspace no longer requires a manual page reload to see the correct data.
- **Invite emails in Gmail**: invitation emails now render correctly in Gmail instead of showing misaligned columns on mobile.

---

**Coming next**
We started work on a bulk action menu for list views but it is not ready for the quality bar we want. Expected in the next release.
```

---

## What was deliberately omitted

- `Upgrade Postgres connection pool to PgBouncer`: invisible to users. No user behavior changed. Omit.
- `Fix race condition in auth token refresh`: reframed as an observable symptom benefit. But since it is fully internal and users are unlikely to have noticed it as a distinct issue, it was folded into "Fixed" implicitly via the overall stability of the release. If it had caused visible sign-out bugs, it would appear explicitly.

---

## Distribution checklist

```markdown
## Distribution checklist for 2.4.0

- [x] Published to changelog platform (Headway)
- [x] In-app widget badge updated (automatic on publish, verified)
- [ ] Email digest queued for Friday's weekly email
- [ ] Community post drafted for #product-updates in Slack
- [ ] Blog post scheduled (not needed: minor release)
- [ ] Direct email sent to affected users (not needed: no breaking changes)
- [ ] In-product banner added (not needed: no user action required)
```

---

## Notes on the honest scope note

The note is one sentence. It names the feature, says it is not ready, and gives a rough window. It does NOT:
- Give a hard date.
- Apologize.
- Over-explain why.
- Name a ticket number.
