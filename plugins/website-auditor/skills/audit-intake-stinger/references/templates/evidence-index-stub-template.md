# Evidence index

Stub written by `audit-intake-wasp-drone` at scaffold time. Every subsequent Drone appends one row per artifact it produces (build plan section 3: "every artifact, what produced it, when"). This Drone does not populate any rows beyond its own intake artifacts; it only establishes the table shape so downstream Drones have a consistent append target.

| Artifact path | Produced by | Produced at | Notes |
|---|---|---|---|
| `00-intake/answers.md` | audit-intake-wasp-drone | {intake_timestamp_iso8601} | The four recorded intake answers |
| `README.md` | audit-intake-wasp-drone | {intake_timestamp_iso8601} | Run manifest |
| `_shared/run-ledger.json` | audit-intake-wasp-drone | {intake_timestamp_iso8601} | Per-Drone status ledger, append-only from here |
| `_shared/target-profile.json` | audit-intake-wasp-drone | {intake_timestamp_iso8601} | Stub only; populated by stack-fingerprint-wasp-drone |

## Append rule

Add one row per artifact, in the order produced, never remove or rewrite an existing row. This is the same evidence-at-the-moment-of-finding discipline as conduct rule 2 in `rules/website-audit-conduct.md`, applied to the artifact index itself rather than to individual findings.
