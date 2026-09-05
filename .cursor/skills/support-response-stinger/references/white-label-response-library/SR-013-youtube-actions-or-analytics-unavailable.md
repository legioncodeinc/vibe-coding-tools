# SR-013: YouTube actions or analytics are unavailable

## Use when

Use when a YouTube connection, secondary action, or analytics view is unavailable.

## Required evidence

- YouTube account, video or post identifier, exact failing function, timestamp and timezone, scheduled-publication state, and destination-side result.

## Customer-facing email

**Subject:** {ticket_id}: Checking the unavailable YouTube function

Hi {customer_first_name},

I understand that a YouTube connection, action, or analytics function is unavailable. Because publishing and secondary functions can have different states, we need to isolate the exact action and confirm whether the video is already live.

Please send the YouTube account, video or post identifier, exact function that failed, and the time with your timezone. Include the current scheduled-publication state and the result visible on YouTube.

Please do not disconnect a working account because analytics, comments, thumbnails, or another secondary action is delayed. I will compare the specific function with the published state and determine the next step. If the results conflict, I will send the scoped evidence to our technical team without changing the connection.

{agent_name}
{agency} Support

## Agent notes

Evidence class `F1`. Remediation class `R1`. Apply `HR-09`. Separate publishing from secondary actions and analytics. Do not disconnect, delete, or retry until the destination result is established.
