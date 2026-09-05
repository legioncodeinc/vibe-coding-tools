# SR-065: Mobile page speed remains poor after basic image optimization

## Use when

Use this response when a live page remains slow on mobile after basic image compression or format changes and the remaining cause is not isolated.

## Required evidence

- Live page address and affected pages
- Device, browser, test region, test time, and timezone
- Measured performance metrics and repeat results
- Page-specific assets with image formats and sizes
- Custom HTML, JavaScript, CSS, extensions, and security headers
- Recent changes and clean-session result

## Customer-facing email

**Subject:** {ticket_id}: Isolating the remaining mobile page-speed bottleneck

Hi {customer_first_name},

I understand the page remains slow on mobile after the images were optimized. Images are only one possible factor, so we will reproduce the live page and isolate the largest page-specific difference before editing production.

Please send:

1. The live page address, affected pages, device, browser, test region, time, and timezone.
2. The measured metrics from at least two comparable runs and the clean-session result.
3. The relevant image formats and sizes, custom HTML, JavaScript, CSS, extensions, and security headers.
4. A short list of recent changes, with private customer data and credentials removed.

Do not send passwords, verification codes, access tokens, full source exports, or broad administrative access.

{agency} will reproduce the page in a clean session and identify the largest page-specific asset or custom-code difference without changing the live site. Any later code or security-header test will require the authorized owner, a backup, a narrow test, impact review, and a restoration plan. I will update you after the read-only comparison.

{agent_name}
{agency} Support

## Agent notes

- Evidence state: `DOC_COVERED` for the diagnostic categories, not for a presumed root cause.
- Reproduce in a clean session and isolate one page-specific difference before editing production.
- Apply `HR-13` before removing or recreating assets. Preserve the current page and dependencies.
- Custom-code or security-header changes require owner authority, backup, a narrow test, impact review, and restoration plan.
