# Contract writing research distillation

Fetched and re-read 2026-09-22. The sweep used current primary sources. Some governing standards were first published before the six-month window, so their current official pages were checked rather than treating age as evidence that they are obsolete.

| Finding | Consequence for this Stinger | Evidence |
|---|---|---|
| A contract has a provider and one or more consumers; a static specification and an executable interaction test answer different questions. | Identify both sides and their required behavior. Record the verification method separately from the agreement. | [raw/pact-contract-testing.md](raw/pact-contract-testing.md) |
| HTTP API descriptions have paths, operations, parameters, request bodies, responses, security, and reusable components. | Describe each shared operation precisely and link a native OpenAPI artifact when available. | [raw/openapi-specification.md](raw/openapi-specification.md) |
| Structured data validation depends on a specific schema dialect and constraints. | Name the schema version and explicit field constraints. Do not treat a sample payload as the whole contract. | [raw/json-schema-specification.md](raw/json-schema-specification.md) |
| Message APIs expose channels, operations, payloads, headers, and correlation. | For events, record producer, consumers, routing, message identity, payload, delivery, and failure behavior. | [raw/asyncapi-specification.md](raw/asyncapi-specification.md) |
| Consumers and providers can run different versions during rollout or rollback. | State mixed-version behavior and a compatibility plan before freezing a boundary. | [raw/protobuf-best-practices.md](raw/protobuf-best-practices.md) |
| A public API must be clearly declared before SemVer change categories can be applied. | Classify a revision as compatible or breaking against an explicitly identified public surface. Keep the local document revision separate from deployed versioning. | [raw/semantic-versioning.md](raw/semantic-versioning.md) |
| RFC 9457 standardizes one HTTP error representation and warns against leaking internals. | Document error status, type, and consumer response. Use the project's already accepted representation where one exists. | [raw/rfc9457-problem-details.md](raw/rfc9457-problem-details.md) |

## Operational synthesis

The sources define interface syntax and compatibility concerns, but none prescribes where a product team stores pre-PRD agreements or who accepts them. The `CTR` path, approval gate, accepted-record immutability, status lifecycle, and PRD linking protocol in this Stinger are Wasp Nest workflow conventions approved for this task, not claims from the standards. A contract becomes stable only after the operator accepts its exact terms and all affected consumers and providers are named. It remains a planning agreement until implementations are verified. [raw/pact-contract-testing.md](raw/pact-contract-testing.md) [raw/semantic-versioning.md](raw/semantic-versioning.md)

## Limits and source conflicts

OpenAPI describes a static HTTP surface; Pact tests concrete consumer interactions. One cannot replace the other without losing coverage. The Stinger should link either or both when the repository uses them and state what was actually verified. [raw/openapi-specification.md](raw/openapi-specification.md) [raw/pact-contract-testing.md](raw/pact-contract-testing.md)

There is no universal format for a cross-PRD agreement that spans HTTP, events, storage, UI states, and permissions. The Markdown template is a coordination record; native schemas remain authoritative for machine-readable details when present. [raw/openapi-specification.md](raw/openapi-specification.md) [raw/asyncapi-specification.md](raw/asyncapi-specification.md) [raw/json-schema-specification.md](raw/json-schema-specification.md)
