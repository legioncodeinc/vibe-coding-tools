# PRD-006: keyword-intelligence (Drone + Stinger)

> **Status:** Backlog
> **Priority:** P0
> **Effort:** L
> **Schema changes:** None

---

## 0. Dependencies and sequencing

**Depends on:** prd-005. This PRD may not start until all listed dependencies are in `in-work` or `completed`.

**Execution wave:** W3, sync, needs ICP

---

## Overview

Compiles 75-100 keywords and 25-50 customer questions under `content-targets/`, using a strict source priority order so the highest-fidelity data source available for this engagement is always used first.

---

## Goals

- Implements the exact 4-tier source priority from build-plan Q6, in order: (1) Google Search Console MCP if connected and returns data for the domain, (2) a customer-supplied Google Trends export, (3) EXA/Firecrawl-inferred keywords grounded in ICP and site content, (4) a paid keyword API only as last resort.
- Degrades gracefully through the chain: if tier 1 is unavailable or empty, tries tier 2, and so on, recording in the output which tier actually produced each keyword/question so the report can disclose data provenance.
- Produces 75-100 keywords and 25-50 customer questions, each tagged with its source tier and, where available, real search-volume/trend signal.

## Non-Goals

- Does not build or own the Search Console MCP server itself, that is a separate project the user is building independently; this Drone only calls it via MCP tool discovery when present and treats its absence as a normal, expected condition, not an error.
- Does not fabricate search-volume numbers when only tier-3 (inference) or tier-4 (paid API unavailable) data exists; unquantified keyword candidates are still included but explicitly marked as volume-unknown.

---

## Acceptance criteria

| ID | Criterion |
|---|---|
| AC-1 | Given a Search Console MCP connection exists and returns query data for the domain, when keyword-intelligence runs, then tier 1 is used and the source tier is recorded as `search-console` for every keyword it produced. |
| AC-2 | Given no Search Console MCP connection and no customer-supplied Trends export, when the Drone runs, then it falls through to tier 3 (EXA/Firecrawl inference) automatically, with no user-visible error, only a note in the run ledger that tiers 1-2 were unavailable. |
| AC-3 | Given the run completes, then `content-targets/keywords.md` contains between 75 and 100 entries and `content-targets/questions.md` contains between 25 and 50 entries, each with a source-tier tag. |
| AC-4 | Given any tier-2 (customer Trends export) input, then the raw export is preserved unmodified under `content-targets/trends-raw/` alongside the processed output. |

---

## Shared workspace contract

**Reads:**
- `02-positioning/` for ICP and niche context.

**Writes:**
- `content-targets/keywords.md`, `content-targets/questions.md`, `content-targets/trends-raw/`.

---

## Conduct rules applied

Read-only/passive by default; any step that would create state on the target (order placement, form submission, auth bypass, file upload) requires explicit per-run opt-in that defaults OFF. Evidence is captured at the moment of finding (artifact path, URL, header, or screenshot), never reconstructed from memory. Subjective judgements are labelled `[subjective]` and kept separate from quantified findings in both the rubric and the reports. Rejected/reframed candidate findings are logged to the run's verification log with the reason, not silently dropped.

---

## Open questions

- [ ] Exact MCP tool-discovery mechanism for detecting whether the (not-yet-built) Search Console MCP is connected: to be resolved when that separate project exists; this PRD specifies graceful degradation as the binding requirement regardless of how discovery is implemented.

---

## Related

- ../prd-005-icp-positioning/prd-005-icp-positioning-index.md
