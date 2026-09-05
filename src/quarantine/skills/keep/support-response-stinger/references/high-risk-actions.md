# High-risk support actions

Use this reference before recommending, confirming, or describing a risky change. If the required authority or evidence is absent, use an escalation email instead of instructions.

| Action | Risk | Required gate |
|---|---|---|
| Change or delete DNS, email authentication, SSL, redirect, or proxy records | Website or email outage, misrouting, or a false fix | Authorized owner, exact hostname, authoritative provider, current records, affected services, intended value, impact review, and rollback record |
| Relax or replace DMARC | Reduced spoofing protection and possible reputation damage | Authorized owner, current policy, authentication evidence, specialist review, documented reason, and rollback plan |
| Disable SaaS, disconnect a processor, transfer an account, change currency, or move a subscription | Cancellation, permanent wallet deletion, billing disruption, or manual refund work | Billing authority, current balances and subscriptions, impact review, explicit confirmation, and recovery plan |
| Merge contacts | Permanent consolidation and changes to related data or workflows | Admin authority, selected master record, conflicting-field review, financial and appointment review, and active-workflow review |
| Retry a failed charge or create a replacement subscription | Duplicate charge or subscription | Original invoice, subscription, processor event, and customer charge state checked |
| Replay an API call, webhook, workflow action, or integration operation | Duplicate sends, contacts, charges, or external effects | Original operation state, logs, correlation ID, prior side effects, affected records, and idempotency control |
| Recreate or bulk-move an opportunity | Duplicate opportunity, wrong deal update, or duplicate automation | Existing contact, opportunities, pipeline, stage, workflow history, and audit history checked |
| Resend SMS or replay a campaign | Carrier filtering, account restriction, or duplicate customer messages | Exact error corrected, prior delivery state checked, consent verified, and one controlled recipient selected |
| Republish, clone, reschedule, delete, or reconnect a social item | Duplicate live post or loss of a working connection | Destination checked, original status verified, affected channel isolated, and authorizing permission confirmed |
| Load or push a snapshot again | Duplicate or conflicting account assets | Load history, version, target, selected assets, current status, and failed-asset list checked |
| Re-enroll a learner, recreate a purchase, republish an offer, or resend access | Duplicate billing, access, or entitlement mismatch | Payment history, enrollment, offer association, access workflow, and publication state checked |
| Clear cookies or site data | Sign-out and loss of local preferences | Exact browser scoped, private-session comparison completed, and customer warned of impact |
| Delete or recreate an AI agent, funnel, form, page, or domain | Loss of prompts, content, submissions, configuration, or dependencies | Current object preserved, clean-session test completed, incident state checked, and dependencies inventoried |
| Broaden permissions or share credentials | Unauthorized access across accounts or records | Intended account, role, user identity, least-privilege requirement, and administrator approval |

## Response pattern

1. State the verified symptom and why the action is being considered.
2. Name the risk in plain language.
3. Name the evidence and authority still required.
4. Offer a reversible diagnostic when one exists.
5. Stop until the gate is satisfied.
6. After action, record the exact change, verification, and rollback state.

Never hide a destructive effect inside a troubleshooting list. Never turn a temporary workaround into an unreviewed permanent configuration.
