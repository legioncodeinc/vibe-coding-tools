# Edge Case Example: No Git Access

Not every case has git evidence. The developer may have refused to hand over the repository, the client may not have access, or the work may have been done on a closed platform (Wix, Webflow, Shopify custom apps, etc.) that doesn't expose source code in a git-able form.

The skill's methodology still applies. You skip Phase 3 entirely and lean harder on the other phases.

## What you lose

- The single most powerful piece of evidence (the "Billed vs Delivered" variance table)
- The cryptographically-chained timestamp record that can't be retroactively altered
- Per-author attribution showing the actual size of the development team
- Direct identification of idle months and low-activity months

## What you still have

- **Invoice forensics** (Phase 2) — first-and-last-observed extrapolation works regardless of git
- **CVE timeline** (Phase 4) — vulnerability exposure analysis is independent of source-code access
- **Audit log analysis** (Phase 5) — for WordPress/CMS sites with audit-log plugins installed
- **Marketing performance** (Phase 6) — engagement metrics, account reports, social media analytics
- **Dependency lockfile** — even without commits, `requirements.txt` / `package.json` / `composer.lock` on the running server shows what was deployed and when it was last touched
- **Server access logs** — if the client has hosting credentials, deployment logs from cPanel / Plesk / CloudPanel / Heroku can substitute for some commit-level evidence
- **Production observations** — what the live system actually does is itself evidence (broken features, missing pages, no monitoring, etc.)

## Strategy adjustments

1. **Make git access a Day-1 subpoena target.** The Findings Notice should specifically list "the complete git repository in unaltered form, including all branches and forks" as a preservation item under the litigation hold. This forces the defendant to either produce the repository or be on the record refusing to do so.

2. **Lean on the dependency lockfile.** Even without commits, the lockfile shows which library versions are installed. Cross-reference each version against the CVE database (see `research/cve-database-snapshot.md`) to identify how long each known CVE went unpatched.

3. **Lean on third-party audit reports.** If an independent technical audit has been commissioned, the audit's findings (specific line numbers, specific defects) serve as the evidentiary anchor that the git log would otherwise provide.

4. **Use the production server itself as evidence.** A live demonstration of a broken feature (the client logs in, attempts a booking, the feature crashes) is recordable and admissible. Capture screen recordings of any reproducible defect.

5. **Increase the weight of the maintenance-fraud case via the dependency lockfile.** Phase 6 of the master report (Last Meaningful Routine Maintenance) becomes the central pillar in a no-git case. The lockfile evidence is enough to support the maintenance-fraud claim even without commit-level data.

## Master report adjustments

In the master report, Phase 3 (Git Commit History Forensic Log) becomes:

> "Part 3 — Git Commit History Forensic Log: NOT AVAILABLE. Repository access was not provided by [defendant] despite explicit request on [date]. The Litigation Hold notice served on [date] preserved the repository for production through discovery. In its absence, this report relies on the dependency lockfile and third-party audit findings to establish the maintenance-vs-delivered-effort gap. See Part 6 (Last Meaningful Routine Maintenance) for the substitute evidentiary basis."

The Phase 7 damages calculation omits the "Billed vs Delivered" hours variance and substitutes a "Lockfile-Implied Maintenance Gap" calculation: count of CVE-affected packages × months unpatched × industry-standard patch-application labor cost.

## Attorney memo adjustments

Section II.F (The Git Log Evidence) is replaced with Section II.F (The Absence of Git Evidence — and What Replaces It):

> "The defendant refused to produce the source-code repository in response to the [date] preservation request. This refusal is itself probative: it is consistent with a defendant aware that the commit history would establish minimal delivered effort during the paid maintenance window. Counsel should make git access a top-priority discovery target and seek adverse-inference sanctions if production is further delayed or refused.
>
> In the absence of git evidence, the following substitute evidence supports the maintenance-fraud claim:
> 1. The dependency lockfile (currently deployed versions of [N] CVE-affected packages, none patched since [date])
> 2. The independent technical audit (specific line-number defects from [audit date])
> 3. The audit log [if available] showing zero defendant-driven updates over [N] days
> 4. The defendant's own quarterly reports documenting [specific failures]"

## Plain Language Report adjustments

Part 3 (paying for nothing) reframes from "the security camera shows nobody arrived" to "the maintenance checklist was never run." The framing is less visceral but still effective:

> "Real maintenance means keeping the software safe by updating the parts that make it run. We can prove this didn't happen because the 'parts list' of your software still has the same outdated versions today that it had three years ago — even though the people who made those parts have published warnings that they have known security holes."

## When this strategy is appropriate

- Defendant refuses git access (file the demand letter, then proceed with the no-git strategy in the master report)
- The work was done on a closed platform that doesn't have git (Wix, Squarespace, Webflow custom development, Shopify private apps)
- The client never had git access in the first place (the developer maintained the codebase entirely on their own infrastructure)

When the defendant DOES have git but is stalling, document the refusal in writing and let the no-git master report do its job — the act of refusing to produce strengthens the case independently.
