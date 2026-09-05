# SR-031: Marketing email lands in spam or Gmail Promotions

## Use when

Use when a marketing email is delivered to spam or Gmail Promotions instead of the expected inbox placement.

## Required evidence

- Representative recipient, message and timestamp, sending domain and path, authentication results, delivery or spam evidence, list source, volume, complaint and bounce signals, content, links, and recent changes.

## Customer-facing email

**Subject:** {ticket_id}: Reviewing spam or Promotions placement

Hi {customer_first_name},

I understand that your marketing email is reaching spam or Gmail Promotions, which can reduce visibility. Placement can be influenced by authentication, recipient behavior, list quality, content, links, sending patterns, and reputation, so we need one representative message before drawing a conclusion.

Please send the recipient address in a redacted form, message identifier, send time with timezone, sending domain and method, current authentication results, and the delivery or spam result. Include the list source and consent basis, recent volume pattern, bounce and complaint signals, message content and link domains, and recent changes. Do not send account passwords or mail-provider credentials.

I will inspect that message and match its observed state to the relevant checks. Please do not rotate domains or change DMARC. We cannot promise inbox placement or immediate reputation recovery, but we can identify supported next steps from the evidence.

{agent_name}
{agency} Support

## Agent notes

Evidence class `F2`. Remediation class `R1`. Apply `HR-02` before any DMARC change. Diagnose one representative message first. Do not guarantee placement, recommend instant domain rotation, or promise reputation recovery.
