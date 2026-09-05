# ADR template landscape

- **Title:** ADR Templates
- **URL:** https://adr.github.io/adr-templates/
- **Fetched:** 2026-08-17
- **Source type:** official-docs (adr.github.io, the community's reference index)

## Templates catalogued

| Template | Shape |
|---|---|
| **MADR** | Full and minimal versions, each in annotated and bare form. Framed around decisions that matter, with tradeoff analysis. Carries metadata for decision makers and confirmation status. |
| **Nygard ADR** | Title, Status, Context, Decision, Consequences. From Nygard's 2011 article. |
| **Y-statement** | A single sentence: in the context of USE CASE, facing CONCERN, we decided for OPTION to achieve QUALITY, accepting DOWNSIDE. An extended version adds a "because" rationale. |
| **Others** | The page points at Joel Parker Henderson's template repository for further formats, and notes ISO/IEC/IEEE 42010:2011 suggests nine information items for a decision record. |

## Named gap in this source

The page does **not** give selection guidance between templates, and does **not** define a
status lifecycle. MADR is noted as carrying a status field, but the page states no
canonical set of statuses. Lifecycle detail has to come from Nygard's original article and
from practitioner sources, not from here.

## Why the Y-statement matters for a capture-sourced pack

It is one sentence and it forces all five elements to be present. When a meeting yields a
decision with a clear tradeoff but not enough context for a full record, the Y-statement is
the format that fits what was actually captured, rather than a full ADR with four sections
padded out from inference.
