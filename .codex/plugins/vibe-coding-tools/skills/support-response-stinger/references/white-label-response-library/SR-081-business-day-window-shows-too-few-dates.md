# SR-081: A business-day booking window shows too few usable dates

## Use when

Use this response when a booking window based on business days shows fewer available dates than expected, including when closed days appear to reduce the usable window.

## Required evidence

- Account, public booking link, calendar, and assigned user.
- One expected but missing date and the affected date range.
- Booking timezone and account or user timezone.
- Current business-day option, working hours, date overrides, minimum notice, booking window, and day limits.
- Diagnostic reason code for the missing date.

## Customer-facing email

**Subject:** {ticket_id}: Business-day booking window shows too few dates

Hi {customer_first_name},

Thanks for reporting that the business-day booking window for {calendar_name} offers fewer usable dates than expected. I will confirm the current business-day option and inspect one missing date before any calendar setting is changed.

Please send the following in one reply:

1. The account, public booking link, calendar name, and assigned user.
2. One date you expected to be available and the full affected date range.
3. The timezone shown to the visitor and the relevant account or user timezone.
4. The current business-day option, working hours, date overrides, minimum notice, booking window, and day limits.
5. The diagnostic reason code shown for the missing date.

Please leave the current hours, overrides, buffers, and limits unchanged while I compare the diagnostic result. I will identify the setting that explains the missing date and propose only that scoped correction. If the current option is enabled and the reason code does not explain the result, I will escalate the evidence to our calendar specialist.

I will update you after the missing-date diagnostic is complete. We have not confirmed that the current behavior is a service defect.

{agent_name}
{agency} Support

## Agent notes

- Evidence class: `F4`. Remediation class: `R2`.
- A historically reported limitation does not prove that a current ticket has the same cause.
- Inspect one missing date and record its diagnostic reason before changing configuration.
- Change only the evidence-matched setting. Escalate when the current business-day option is present and the reason code does not explain the window.
- The owner is `{agent_name}` through the controlled diagnostic.
