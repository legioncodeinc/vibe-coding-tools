# Troubleshooting SMS Delivery Issues

- URL: https://help.gohighlevel.com/support/solutions/articles/48000981696-troubleshooting-sms-delivery-issues
- Fetched: 2026-09-04
- Source type: official-docs
- Modified at source: 2026-09-03
- Window role: current remediation facts and in-window update

## Captured facts

Delivery is evaluated across three layers: the application, the connected phone provider, and the recipient carrier. A useful response should ask for the sending number, recipient number, timestamp, channel, and exact error code, then inspect the corresponding conversation, contact timeline, workflow log, or provider log.

Documented failure families include prior opt-out, invalid or unreachable recipient, unregistered or improperly linked A2P traffic, content filtering, account limits or suspension, international permissions, attachment size, and a sender number that cannot send SMS.

The source advises fixing the identified cause and running one controlled retest. Repeated retries without a diagnosis can worsen filtering or restrictions. A generic response must not present a carrier rejection as a platform outage.
