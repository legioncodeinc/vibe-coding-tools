# Google Gmail sender guidelines

- URL: https://support.google.com/mail/answer/81126?hl=en
- Fetched: 2026-09-04
- Published or effective: requirements began in 2024; no in-window publication date is displayed
- Source type: official-mailbox-provider
- Window status: outside-window evergreen constraint

## Captured evidence

Google requires all senders to personal Gmail accounts to use SPF or DKIM, valid forward and reverse DNS, TLS, RFC 5322 formatting, and a spam rate below 0.3 percent in Postmaster Tools. Senders of more than 5,000 messages a day to personal Gmail accounts must use SPF, DKIM, and DMARC, align the From domain with SPF or DKIM for direct mail, and support one-click unsubscribe plus a visible unsubscribe link for marketing and subscribed messages.

Google advises sending mail only to people who want it, avoiding purchased addresses, using a clear and accurate display identity, and increasing sending volume gradually. The page says messages that are not authenticated can be marked as spam or rejected.

## Transfer limits

- This is current official provider guidance but is outside the requested three-month publication window.
- The lifecycle stinger does not configure DNS, authentication, or mailbox infrastructure. It must surface these prerequisites and hand configuration to the appropriate platform specialist.
- Requirements can change. Recheck the live official page before a high-volume launch.

