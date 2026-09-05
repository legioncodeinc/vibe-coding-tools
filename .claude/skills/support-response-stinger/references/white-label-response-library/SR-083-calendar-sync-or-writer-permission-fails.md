# SR-083: Calendar synchronization or writer permission fails

## Use when

Use this response when a connected calendar stops synchronizing, cannot write events, reports a permission failure, or no longer shows the expected external account.

## Required evidence

- User and calendar references.
- Connected-account identifier without credentials.
- Last successful synchronization time and timezone.
- Exact redacted error, current connection state, and current writer-permission state.
- Affected event references and date range, plus whether another authorized user synchronizes successfully.

## Customer-facing email

**Subject:** {ticket_id}: Calendar sync or writer permission failure

Hi {customer_first_name},

Thanks for reporting that {calendar_name} is not synchronizing or cannot write events as expected. I will inspect the current connection and writer-permission state without reconnecting the account or changing events.

Please send the following in one reply:

1. The affected user and calendar references.
2. The connected-account identifier, without a password, token, verification code, or other credential.
3. The last successful synchronization time and timezone.
4. The exact redacted error, current connection state, and writer-permission state.
5. The affected event references and date range, plus whether another authorized user synchronizes successfully.

Please do not disconnect or reconnect the account, share credentials, or delete and recreate calendar events while I preserve the current state. If the evidence confirms a broken connection, {agency} will explain the impact and request the authorizing user's approval before a scoped reconnect.

I will update you after the connection and permission review is complete. We have not yet confirmed that reconnecting is required.

{agent_name}
{agency} Support

## Agent notes

- Evidence class: `F4`. Remediation class: `R2`.
- Inspect connection state and writer permission before considering a reconnect.
- Reconnect only after a confirmed connection failure, impact review, and the authorizing user's approval.
- Never request credentials, broaden permissions, or delete calendar events as troubleshooting.
- The owner is `{agent_name}` through the connection and permission review. Escalate unexplained failures with redacted event references and timestamps.
