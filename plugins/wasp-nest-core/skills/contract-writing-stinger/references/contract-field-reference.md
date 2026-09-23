# Contract record fields

Use [the template](../templates/contract-template.md) for the exact section order. The fields below are the minimum acceptance check for a shared boundary. The `CTR` record is a Wasp Nest planning convention; the protocol-specific fields come from the cited standards.

| Field | Required content |
|---|---|
| Identity | Stable `CTR-<###>` number, slug, revision, status, and acceptance date or pending state. |
| Scope | One boundary and its purpose, with explicit exclusions. |
| Parties | Named provider/producer and every known consumer, including owning PRDs or teams. |
| Source | Existing code, schema, ADR, vendor documentation, or operator decision that supports each agreed rule. |
| Normative behavior | Exact inputs, outputs, types, requiredness, defaults, identity/permission rules, ordering and timing, failure behavior, and compatibility as relevant. |
| Example | At least one valid interaction and one error or edge case, with no secrets or customer data. |
| Version | Local draft revision plus any native API/schema/event version; state compatibility impact separately. Freeze the accepted revision. |
| Verification | Provider check, consumer check, or other evidence each party will run. A proposed test is not a passing test. |
| Dependencies | PRDs and sub-PRDs consuming this record, with exact revision pin and whether work is blocked. |
| Approval | Exact operator acceptance evidence for the stated revision. Contributor agreement alone does not imply operator approval. |
| Change control | Affected parties, compatibility classification, migration or rollout, and a new CTR record when any accepted normative term changes. Link predecessor and successor both ways. |

For HTTP, include operation, path, parameters, request body, response statuses, response shape, authentication and error shape. Link a native OpenAPI description when available. [research/raw/openapi-specification.md](research/raw/openapi-specification.md) [research/raw/rfc9457-problem-details.md](research/raw/rfc9457-problem-details.md)

For events, include producer, channel/topic, message name, key or correlation ID, schema, ordering, retry, duplication, and consumer behavior. Link AsyncAPI when available. [research/raw/asyncapi-specification.md](research/raw/asyncapi-specification.md)

For shared data or types, include owner, schema location, field names and types, nullability, identifiers, access boundary, and migration rules. Name the JSON Schema dialect when using JSON Schema. [research/raw/json-schema-specification.md](research/raw/json-schema-specification.md)

For compatibility, consider staggered deployments and rollback. If a contract uses Protocol Buffers, preserve tag numbers and reserve deleted ones. [research/raw/protobuf-best-practices.md](research/raw/protobuf-best-practices.md)
