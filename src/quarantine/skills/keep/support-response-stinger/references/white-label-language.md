# White-label language contract

This contract applies to every customer-facing subject, preview line, body, signature, hyperlink, visible URL, image alt text, attachment filename, quoted history, and pasted screenshot.

## Required provider identity

- Use `{agency}` as the provider.
- Sign with `{agent_name}` and `{agency} Support` unless the user supplies another approved public role.
- Use `your {agency} account`, `your workspace`, `our platform`, `our email service`, `our messaging service`, `our technical team`, or `our engineering team` when those phrases are accurate.
- Use the feature label visible in the customer's white-label interface when the user supplies it.

## Prohibited upstream disclosure

Customer-facing assets must not contain or link to:

- `help.gohighlevel.com`
- `status.gohighlevel.com`
- `app.gohighlevel.com`
- `gohighlevel.com`
- `leadconnectorhq.com`
- `HighLevel`
- `GoHighLevel`
- `GHL`
- `LeadConnector`
- `LC Phone`
- `LC Email`

Do not describe an upstream ticket, article, provider team, status page, or internal service brand. Paraphrase the verified guidance and keep `{agency}` visibly accountable for the customer relationship.

## Third-party names

Google, Microsoft, Meta, Facebook, Instagram, WhatsApp, Stripe, Twilio, Cloudflare, a registrar, an ISP, or a carrier may be named only when the name is necessary for the customer to identify the affected external account or action. Naming an external dependency is not permission to expose the upstream platform provider.

## Link policy

- Use only a link owned by `{agency}` or a neutral third party that the user explicitly approves.
- Never substitute an upstream help-center or status link when an agency link is missing.
- If no approved link exists, write the steps directly in the email or state that `{agency}` will guide the customer through them.
- Inspect redirected URLs, tracking domains, link text, and attachment filenames for upstream disclosure.

## Evidence-safe phrases

Use only when supported by the case:

- `We have confirmed the affected feature and account.`
- `We reproduced the behavior using the steps you shared.`
- `We are still isolating the cause.`
- `We have not confirmed a service-wide issue.`
- `Our technical team has the case and the evidence listed below.`
- `We do not have a confirmed restoration time yet.`
- `Our next update will be by {next_update_at}.`
- `The service has recovered, and we are validating your specific account.`
- `The change is complete, and the verification result is {verification_result}.`

## Prohibited unsupported claims

Do not write these unless the record proves the exact claim and the sender has authority:

- `We fixed it.`
- `This is a known bug.`
- `There is no data loss.`
- `Your refund is approved.`
- `The carrier will accept it.`
- `It is safe to retry.`
- `Engineering is working on it.`
- `It will be restored by {time}.`
- `This will improve deliverability.`
- `This change cannot affect anything else.`

## Final leak check

Search customer-facing files case-insensitively for all prohibited domains, names, and abbreviations. Then inspect images and quoted history manually. A clean text search does not prove that screenshots or embedded assets are white-label.
