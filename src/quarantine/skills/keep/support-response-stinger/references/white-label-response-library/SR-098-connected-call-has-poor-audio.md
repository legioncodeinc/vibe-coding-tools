# SR-098: A connected call has choppy audio, echo, delay, or drops

## Use when

Use this response when a call connects but has choppy or one-way audio, echo, delay, or unexpected drops. Do not use it for calls that never connect.

## Required evidence

- The affected account and user
- The contact or number, direction, and timestamp with timezone
- The app surface, app version, device, and operating system
- Network type and the selected microphone and headset
- Any visible warning
- Latency, jitter, and packet loss when available
- A redacted call ID and reproducibility across controlled tests

## Customer-facing email

**Subject:** {ticket_id}: Controlled test for the call audio problem

Hi {customer_first_name},

I understand that connected calls have choppy audio, echo, delay, or drops. We will compare the audio devices and available networks before drawing a conclusion about the cause.

Please reply with the affected account and user, call direction and time with timezone, app surface and version, device and operating system, network type, selected microphone and headset, any visible warning, and a redacted call ID. If available, include latency, jitter, and packet-loss readings without including private call content.

If you have a safe test destination, please run this bounded check:

1. Confirm the selected microphone and headset, then place one controlled test on the current network.
2. If another approved network is available, place one controlled comparison call using the same devices.
3. Record whether the symptom follows the network, device, or neither, then stop testing.

{agency} Support will compare the two results and escalate the redacted call ID if the cause remains unclear. We will not change organization-wide routing or attribute the issue to your network without comparative evidence.

{agent_name}
{agency} Support

## Agent notes

- Keep connected poor-audio cases separate from never-connect cases.
- Use a safe test destination and stop after the bounded comparison.
- Never request call credentials, unrestricted recordings, or full private call content.
- Do not blame the customer's network without comparative evidence.
- Do not change organization-wide routing during this diagnostic.

