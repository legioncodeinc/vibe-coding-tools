# SR-090: A calendar accepts a double booking

## Use when

Use this response when two appointments occupy the same time and the calendar's capacity, slot limit, conflict handling, or booking sequence has not yet explained the overlap.

## Required evidence

- The calendar and assigned user
- Both appointment IDs, timestamps, and timezone
- Capacity and slot-limit settings that applied at booking time
- Relevant connected-calendar conflicts
- Booking history for both appointments
- Notifications and workflows triggered by either appointment
- Payment state and customer impact for each booking

## Customer-facing email

**Subject:** {ticket_id}: Reviewing the two appointments booked at the same time

Hi {customer_first_name},

Thanks for reporting that your calendar accepted two appointments for the same time. We will inspect both records and the capacity or conflict decision before changing availability or either appointment.

Please reply with the calendar name, assigned user, both appointment IDs, both booking times and timezone, and the capacity and slot-limit settings that applied. Please also note any connected-calendar conflicts, notifications, workflows, or payments associated with either booking.

Please do not delete, move, or recreate either appointment while we trace the booking history. Those actions could send duplicate notifications, trigger automation, or affect a payment record.

{agency} Support will compare both appointment records with the calendar's capacity, conflicts, and booking sequence. If the overlap remains unexplained, we will escalate both records with the completed trace. I will update you after that comparison is complete.

{agent_name}
{agency} Support

## Agent notes

- Confirm both appointments exist and compare their creation sequence.
- Capture the exact capacity, slot limit, timezone, and connected conflicts at booking time.
- Audit notifications, workflows, and payments before moving or deleting either record.
- Do not recreate an appointment to test the issue.
- Escalate unexplained concurrency with both appointment IDs and the full redacted trace.

