# SR-022: A user cannot switch between workspaces

## Use when

Use when an authorized user cannot switch into an expected client workspace.

## Required evidence

- User identifier, intended workspace, current role, expected access, browser session, timestamp and timezone, and comparison with another authorized user.

## Customer-facing email

**Subject:** {ticket_id}: Checking access to the intended workspace

Hi {customer_first_name},

I understand that you cannot switch into the workspace you expect to access. We need to compare the intended role and current access before any permission or user record is changed.

Please send the affected user's identifier, intended workspace, current role, expected access, browser, and time of the latest attempt with timezone. Also tell me whether another authorized user with the same intended access can switch into that workspace. Do not send passwords, verification codes, or another user's session details.

Please do not remove and recreate the user, share credentials, or broaden permissions. I will compare the verified role and workspace assignment and send any confirmed mismatch to our access team. We have not confirmed a cause or a safe permission change.

{agent_name}
{agency} Support

## Agent notes

Evidence class `F1`. Remediation class `UNRESOLVED`. Apply `HR-14`. Stop after role and authorized-user comparison, then escalate a verified access mismatch. Require administrator approval for any least-privilege correction.
