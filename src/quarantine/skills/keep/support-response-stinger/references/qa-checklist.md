# Support response QA checklist

Return `PASS`, `DRAFT_WITH_GAPS`, or `HOLD`. A failed hard gate cannot be waived by better wording.

## Hard gates

- [ ] `{agency}`, `{agent_name}`, customer, ticket, lifecycle state, and evidence state are known.
- [ ] The subject and first paragraph name the real issue, not a vague follow-up.
- [ ] Observations, reproduction, hypotheses, incidents, and documented possibilities are labeled distinctly.
- [ ] No root cause, bug, outage, fix, refund, escalation, ETA, data-loss statement, or retry-safety claim exceeds the evidence.
- [ ] The message names one next action and one owner.
- [ ] Any evidence request is consolidated and minimal.
- [ ] No requested item is a password, authentication code, token, secret, full payment credential, unredacted identity document, another person's magic link, malicious attachment, unrestricted dataset, or provider login.
- [ ] Every risky action passes `high-risk-actions.md` or the email stops at escalation.
- [ ] Prior side effects were checked before any resend, replay, retry, recreation, re-enrollment, republish, charge, snapshot load, or bulk action.
- [ ] Customer verification is objective and appropriate to the issue.
- [ ] Closure includes a reopening path.

## White-label gate

- [ ] `{agency}` is the public provider.
- [ ] No prohibited upstream domain, product, service, help site, status site, ticket, or team name appears.
- [ ] Every link is agency-owned or explicitly approved.
- [ ] Redirect targets, link text, image alt text, attachment names, quoted history, and screenshots were checked.
- [ ] Necessary third-party names are limited to the affected external account or action.

## Writing gate

- [ ] The greeting uses the customer's verified name or a neutral greeting.
- [ ] The opening acknowledges the specific symptom and impact without a canned apology.
- [ ] The email is readable in plain text.
- [ ] Steps are numbered, bounded, and include an expected result or stop condition.
- [ ] Paragraphs are short and one sentence carries one job where possible.
- [ ] Placeholders are resolved or the draft is labeled `DRAFT_WITH_GAPS`.
- [ ] No em dash or en dash was added to authored prose.
- [ ] The signature uses `{agent_name}` and `{agency}` or another approved public identity.

## Outcome

- `PASS`: every hard and white-label gate passes, and no unsupported placeholder remains.
- `DRAFT_WITH_GAPS`: the structure is useful, but one or more listed facts or commitments remain unresolved. The draft is not send-ready.
- `HOLD`: identity, recipient, security, legal, billing, irreversible-action authority, or minimum evidence is missing. Return the missing items and stop.
