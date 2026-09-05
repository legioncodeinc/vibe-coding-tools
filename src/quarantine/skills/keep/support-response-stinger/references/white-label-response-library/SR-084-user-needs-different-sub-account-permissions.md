# SR-084: One user needs different permissions in different sub-accounts

## Use when

Use this response when one person needs different access in separate sub-accounts and no verified configuration has been established. Treat the case as `UNRESOLVED` and stop at a capability and security review.

## Required evidence

- The affected user and each relevant sub-account
- The user's current role and permissions in each sub-account
- The minimum permissions required in each sub-account, tied to the user's business duties
- The sensitive areas that must remain restricted
- The business impact of the current access
- The administrator authorized to approve access changes

## Customer-facing email

**Subject:** {ticket_id}: Reviewing different permissions across your sub-accounts

Hi {customer_first_name},

Thanks for explaining that {affected_user} needs different access in separate sub-accounts. We have not confirmed a safe configuration that meets those differences, so we are documenting the least-privilege requirement before anyone changes access.

Please reply with a simple matrix that lists each affected sub-account, the user's current role, the specific duties they must perform, and the permissions they need for those duties. Also identify any billing, customer data, automation, or administrative areas that must remain restricted, and name the administrator who can approve the final access plan.

Please use role and permission names only. Do not send passwords, verification codes, credentials, customer records, or broad account access.

{agency} Support will escalate the completed matrix for a current capability and security decision. We will not broaden permissions or ask anyone to share sign-in details as a workaround. I will update you after that review is complete.

{agent_name}
{agency} Support

## Agent notes

- Keep the response `DRAFT_WITH_GAPS` until the sub-account matrix and approving administrator are known.
- Do not change access while collecting evidence.
- Do not grant a broader role in every sub-account to bypass the limitation.
- Do not suggest shared credentials, duplicate identities, or another unverified workaround.
- Escalate the least-privilege matrix and business impact without guessing about current capability.

