# SR-100: A legacy V1 API integration is no longer supported

## Use when

Use this response when an integration still depends on legacy V1 API operations and must be mapped to supported V2 operations or a current private integration path.

## Required evidence

- The affected account or location ID
- An inventory of endpoint paths and HTTP methods
- The API version and authentication method name
- The intended operation and timestamp with timezone
- A correlation or request ID and exact redacted error
- Representative affected object IDs
- Current field mapping and every known prior side effect
- The non-production test and rollback plan

## Customer-facing email

**Subject:** {ticket_id}: Planning the move from the legacy V1 API

Hi {customer_first_name},

I understand that your integration uses legacy V1 API operations that are no longer supported. We need to map every required operation to a supported V2 path and validate the change outside production before any cutover.

Please reply with the affected account or location ID, endpoint paths and HTTP methods, API version, authentication method name, intended operations, timestamps, correlation or request IDs, exact redacted errors, representative object IDs, current field mapping, and any records or external actions already produced.

Do not send API keys, private tokens, client secrets, authorization headers, webhook secrets, signatures, unredacted request bodies, or full customer datasets.

{agency} Support will confirm the V1 usage, map each required operation to a supported V2 path, and plan one controlled non-production test. We will not use an undocumented endpoint or cut over production until endpoint coverage, authentication, mapping, duplicate protection, side effects, and rollback are verified.

{agent_name}
{agency} Support

## Agent notes

- Confirm the failing operation is actually V1 before planning migration.
- Inventory all required operations, not only the first failing endpoint.
- Refer to the authentication method by name. Never collect or reproduce credentials.
- Any retry or replay requires original-state, side-effect, affected-record, and idempotency review.
- Do not cut over production until coverage, mapping, non-production verification, and rollback are complete.

