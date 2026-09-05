# SR-077: Agency-generated messages ignore the sub-account language

## Use when

Use this response when an automated or system-generated message is sent in a language that does not match the selected sub-account, user, or contact language.

## Required evidence

- Agency, sub-account, and redacted user or contact reference.
- Selected language and any user or contact locale.
- Exact message type, trigger, current template, and fallback behavior.
- Expected language, actual language, timestamp, and affected scope.
- One redacted message example with private content and third-party provider identity removed.

## Customer-facing email

**Subject:** {ticket_id}: Message language does not match the sub-account

Hi {customer_first_name},

Thanks for reporting that {message_type} was generated in {actual_language} even though {expected_language} is selected for the affected sub-account. We need to identify which message layer produced one representative example before any template is changed.

Please send the following in one reply:

1. The sub-account and redacted user or contact reference.
2. The selected sub-account language and any relevant user or contact locale.
3. The exact message type, trigger, timestamp and timezone, and affected scope.
4. The current template and fallback setting for that message type.
5. One redacted example showing the visible language, with private content and third-party provider identity removed.

Please do not overwrite shared templates or enable an unreviewed translation step while we trace the source. I will preserve the templates, identify the generating layer, and escalate the evidence for a current localization-ownership decision. We have not confirmed automatic translation or a setting that will change every message type. The case is queued for review. I do not have a confirmed update time yet, and I will not invent one.

{agent_name}
{agency} Support

## Agent notes

- Evidence class: `F3`. Remediation class: `UNRESOLVED`.
- Trace one incorrect-language example through sub-account, user or contact locale, template, fallback, trigger, and message layer.
- Preserve shared templates. Do not promise automatic translation or make a broad template change as a test.
- The owner is `{agent_name}` until the localization specialist determines the current ownership boundary.
- Replace all case placeholders before use and return `DRAFT_WITH_GAPS` while any required fact is unknown.
