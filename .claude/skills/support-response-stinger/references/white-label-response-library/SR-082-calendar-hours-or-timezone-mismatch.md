# SR-082: Calendar hours or timezone do not match the booking page

## Use when

Use this response when a booking page displays unavailable times, different hours, or a timezone that does not match the expected calendar configuration.

## Required evidence

- Public booking link, calendar, and assigned user.
- One affected date and time, expected timezone, and displayed timezone.
- Working hours and date-specific overrides.
- Account timezone, user timezone, and visitor timezone when known.
- Diagnostic reason code and a redacted screenshot of the mismatch.

## Customer-facing email

**Subject:** {ticket_id}: Calendar hours or timezone mismatch

Hi {customer_first_name},

Thanks for reporting that the hours or timezone on the booking page do not match the expected availability for {calendar_name}. I will run the calendar diagnostic for one affected slot and compare the selected calendar, assigned user, working hours, overrides, and timezone.

Please send the following in one reply:

1. The public booking link, calendar name, and assigned user.
2. One affected date and time, the expected timezone, and the timezone shown on the booking page.
3. The current working hours and any date-specific override for that date.
4. The account and user timezones, plus the visitor timezone if known.
5. The diagnostic reason code and one redacted screenshot of the mismatch.

Please do not remove all working hours, overrides, buffers, or booking limits as a blanket test. Keep the current configuration unchanged while I compare the evidence.

I will identify the setting that explains the affected slot and propose only that scoped correction. If the diagnostic result does not explain the mismatch, I will escalate the complete evidence to our calendar specialist. I will update you after the slot review is complete.

{agent_name}
{agency} Support

## Agent notes

- Evidence class: `F4`. Remediation class: `R2`.
- Run the diagnostic for one affected slot before changing a setting.
- Compare calendar selection, assigned user, working hours, date overrides, account timezone, user timezone, and displayed timezone as distinct causes.
- Change only the evidence-matched setting. Never remove all hours, buffers, or limits as a blanket test.
- The owner is `{agent_name}` through the controlled diagnostic.
