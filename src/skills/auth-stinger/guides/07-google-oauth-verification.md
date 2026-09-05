# 07: Google OAuth Verification

The real-world journey. Sensitive vs restricted scopes, demo videos, security assessments, and the timeline you should plan for.

Source: `research/2026-04-25-google-oauth-verification-journey.md`, https://developers.google.com/identity/protocols/oauth2/production-readiness/policy-compliance.

## The verification matrix

| App posture | Scope tier | Verification needed |
|---|---|---|
| Internal (Workspace-only) | Any | None |
| External + Testing (≤100 test users) | Any | None |
| External + Production | Non-sensitive only | Brand + tos / privacy URLs reachable |
| External + Production | Sensitive | Verification: app review, demo video, branding, privacy policy review |
| External + Production | Restricted | Verification + annual independent CASA security assessment |

Cite https://developers.google.com/identity/protocols/oauth2/policies for policy details.

## What verification asks for

1. **Branding verification**: domain ownership (Search Console), app logo (square, no transparency), homepage URL reachable, privacy policy URL covers Google data, terms URL.
2. **Demo video**: a YouTube (unlisted is fine) recording showing:
   - The OAuth consent screen appearing.
   - The user granting consent.
   - Each requested scope being used in-app, end-to-end, with the data on screen.
   - The full URL bar visible (so reviewers see the domain).
   - Audio narration is optional but helps reviewer comprehension.
3. **Per-scope justification**: why each sensitive / restricted scope is necessary. Use `templates/scope-justification-template.md`. "We need it for X feature" is insufficient; describe minimum-data-needed reasoning.
4. **Security assessment (restricted scopes only)**: independent CASA (Cloud Application Security Assessment) by a Google-approved third-party assessor. Annual. Costs USD $5k-$75k+ depending on scope.

## Timeline expectations

| Verification step | Realistic timeline |
|---|---|
| Branding review | 1-3 weeks |
| Sensitive scope review | 2-6 weeks |
| Restricted scope + CASA | 3-6 months end-to-end |
| Re-review after scope addition | 2-6 weeks |

Plan accordingly. Don't promise launch dates with sensitive scopes in production-mode unless verification is already in flight.

Source: `research/2026-04-25-google-oauth-verification-journey.md`, https://medium.com/@info.brightconstruct/the-real-oauth-journey-getting-a-google-workspace-add-on-verified-fc31bc4c9858.

## The verification submission

In Cloud Console → APIs & Services → OAuth consent screen → "Prepare for verification":

1. Confirm all branding fields.
2. Confirm scope list (lock in before submission; changes after re-trigger review).
3. Upload demo video URL.
4. Provide per-scope justification.
5. Submit.

You'll get a Google verification email thread. Reply quickly; idle threads slip schedules.

## Common verification failures

- **Demo video missing scope coverage.** Each requested scope must be visibly used. If you ask for `gmail.readonly`, the video must show reading Gmail data.
- **Scope creep.** Adding scopes incrementally re-triggers verification; bundle scopes once if possible.
- **Privacy policy doesn't mention Google user data.** Reviewers check explicit language. Cite the data types.
- **Domain not verified.** Re-check in Search Console; propagation takes minutes, not hours.
- **Logo dimensions wrong.** Square, 120×120 pixel minimum, no transparency, no text.
- **Inconsistent branding** between consent screen and app.

## Strategies to minimize the verification cost

- **Stay in Testing mode** for as long as you have <100 users; defer verification to Production launch.
- **Use Internal mode** if your app is Workspace-only; no verification.
- **Avoid restricted scopes** unless the feature absolutely needs them. `gmail.readonly` plus server-side processing often suffices for what teams initially scope as `gmail.modify`.
- **Bundle scopes** at one verification cycle rather than incrementally.
- **Use OAuth Brand only without scopes**: for sign-in-only (`openid email profile`), no scope verification is needed; brand verification is light.

## Re-verification triggers

Once verified, you stay verified, until you:

- Add a new sensitive or restricted scope.
- Change ownership of the project.
- Materially change app functionality.
- Restricted-scope apps re-verify CASA annually.

## Post-verification operational discipline

- **Monitor the unused-client-deletion email** (per `guides/06-google-oauth.md` §"Unused-client deletion"). A verified client that goes idle for 6 months still gets deleted; verification doesn't shield it.
- **Keep the privacy policy in sync** with what you actually do.
- **Audit scope usage quarterly.** If a scope is granted but not actually called by your code, drop it (next verification cycle).

## Audit handoff

After verification, the audit-relevant artifacts to flag for `security-worker-bee`:

- Scope list and per-scope justification document.
- Demo video link (for the audit log).
- CASA report (if applicable).
- The runbook entry for re-verification triggers.
