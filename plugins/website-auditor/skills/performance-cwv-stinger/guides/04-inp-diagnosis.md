# 04. INP diagnosis

INP is the metric with the most audit-relevant nuance, per `guides/03-core-web-vitals-thresholds.md`. Grounded in [raw/web-dev-articles-optimize-inp.md] (official Google documentation) and [raw/webvitals-tools-blog-google-core-web-vitals-update-2026.md].

## What INP actually measures

INP "assesses a page's overall responsiveness to user interactions by observing the latency of all qualifying interactions that occur throughout the lifespan of a user's visit," and the final INP value is the longest interaction observed (sometimes ignoring outliers), not just the first interaction. [raw/web-dev-articles-optimize-inp.md]

Every measured interaction decomposes into three subparts, all summing to total interaction latency:

| Subpart | Definition | Common causes of delay |
|---|---|---|
| Input delay | Starts when the user initiates an interaction, ends when the event callback begins running | Main-thread activity from script parsing/compiling, fetch handling, timer functions, or overlapping interactions |
| Processing duration | Time for the event callback(s) to run to completion | Expensive synchronous work inside the handler; not yielding to the main thread |
| Presentation delay | Time for the browser to present the next frame containing the visual result | Layout/paint cost of the resulting DOM update |

[raw/web-dev-articles-optimize-inp.md]

During page load specifically, script evaluation, parsing, compiling, and executing newly fetched JavaScript can itself create long tasks on the main thread that extend input delay, even though the page has visually rendered and looks interactive. [raw/web-dev-articles-optimize-inp.md]

## Diagnostic sequence, and this Stinger's own constraint

The official guide's recommended sequence: start with field data (ideally a Real User Monitoring provider reporting not just the INP value but which specific interaction caused it, its type, and whether it happened during or after page load). Absent a RUM provider, use PageSpeed Insights to read CrUX data, though CrUX "often does not provide the contextual data you'd get from a RUM provider." Once field data flags a problem, move to lab testing: reproduce by following common user flows and specifically testing interactions during page load, when the main thread is typically busiest. [raw/web-dev-articles-optimize-inp.md]

**For this Stinger's external-audit context specifically:** this Drone has no RUM access to the target site (that would require the customer's own analytics/monitoring integration, which is out of scope for an external, unauthenticated audit). PageSpeed Insights/CrUX is likely the only field-data channel available, and its documented contextual-data gap (no per-interaction detail) should be disclosed in any finding that leans on it. This is the specific "constraint the general Lighthouse/PageSpeed methodology doesn't already cover for an external audit" this pair's PRD names, see `guides/05-external-audit-vs-lighthouse-ci.md`.

## Remediation levers to cite in a finding (not to implement)

This Stinger diagnoses; it does not fix code, that would require repo access this Drone does not have. When a finding names a remediation direction, cite it as a direction for the customer's own developers, not as work this audit performed:

- Reduce input delay by minimizing main-thread contention during page load; script evaluation/parsing/compiling of newly fetched JS is a named cause. [raw/web-dev-articles-optimize-inp.md]
- Yield to the main thread often inside event callbacks; break up complex logic into separate tasks rather than one long task. [raw/web-dev-articles-optimize-inp.md]
- Framework-level concurrency features can help but require deliberate adoption: React's `useTransition` and `useDeferredValue` mark state updates as non-urgent; merely upgrading React versions without using these APIs does not improve INP. Angular's signal-based reactivity (stable since Angular 17) is described as "proven effective at reducing" the same class of problem, though the source's description of the exact mechanism is cut off in the archived text, cite the direction, not an over-specific mechanism claim. [raw/webvitals-tools-blog-google-core-web-vitals-update-2026.md]

## What not to assert

Do not assert a specific root cause for a slow interaction (e.g. "this dropdown's `onClick` handler is the cause") without lab reproduction evidence. Without source access, this Drone's diagnosis is limited to what field/lab data plus visible page behavior can show; state the limitation rather than guessing at implementation detail this Drone cannot see.
