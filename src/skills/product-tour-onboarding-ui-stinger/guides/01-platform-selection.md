# Guide 01: Platform Selection

Use this guide every time a user asks which product tour tool to use. Run the qualification checklist before naming a winner.

Source: `research/external/2026-05-20-saas-platform-comparison.md`, `research/external/2026-05-20-oss-tour-libraries.md`.

---

## Qualification checklist (run first)

Answer these four questions before opening the decision matrix:

1. **MAU count**: How many monthly active users does the product have today? How many in 12 months?
2. **Budget ceiling**: What is the monthly budget for a tour tool? (Threshold: < $300, $300-$700, $700+)
3. **Engineering involvement**: Is the growth/product team writing tour content, or is an engineer integrating the tool? Can they maintain custom code?
4. **CSS-in-JS / styling framework**: Does the product use Emotion, styled-components, Tailwind with dynamic class generation, or another CSS-in-JS approach? (If yes, `data-tour` anchors are mandatory; some SaaS tools handle this better than others.)

---

## Decision matrix (2026 data)

| Tool | Monthly price (base) | Checklists | Analytics included | Mobile SDK | Code depth | Best for |
|---|---|---|---|---|---|---|
| **Userpilot** | $299 (billed annually) | Yes (base plan) | Yes (product analytics built in) | Yes | Low (visual builder) | Sub-10K MAU teams wanting analytics + tours in one budget line |
| **Appcues** | $249 Essentials / $879 Growth | Growth only | No (add Mixpanel/Amplitude) | Yes (most mature) | Low-Medium | Mobile-first products; enterprise feature-rich tours; budget allows Growth tier |
| **Userflow** | $240 Startup (3 seats, unlimited flows) | Yes | No | Limited | Low | Highest G2 rating (4.8/5); best price-per-flow under 3 seats; flow volume matters |
| **Pendo Guides** | Enterprise (contact sales) | Yes | Yes (Pendo Analytics) | Yes | Low (visual builder) | Enterprise accounts; AI Resource Center (Leo, 2026); large install bases |
| **Driver.js** | Free (MIT) | No | No | No | High (code) | Engineers who want zero SaaS dependency; spotlight highlights in React |
| **Shepherd.js** | Free (MIT) | No | No | No | High (code) | Engineers who want the most flexible, actively maintained OSS tour with full a11y |
| **Intro.js** | Free (AGPL v3) / $199 commercial | No | No | No | High (code) | **Avoid for commercial SaaS**: AGPL v3 requires a paid license; maintenance slowing |

*Pricing from `research/external/2026-05-20-saas-platform-comparison.md` (May 2026).*

---

## Decision branches

### Branch A: Small team (< 3 engineers), < 10K MAU, want no-code UI

**Winner: Userpilot**: $299/month includes product analytics, NPS, A/B testing, and checklists. At sub-10K MAU this beats Appcues Growth ($879) for equivalent features. Userflow is the runner-up at $240 if analytics are handled elsewhere and flow volume is the primary concern.

**Key watch-out:** MAU-based pricing means cost scales with your growth. Revisit at 25K MAU.

### Branch B: Mobile-first or enterprise with large budget

**Winner: Appcues**: most mature native mobile SDK; Enterprise features available. Budget for Growth tier ($879) if checklists are required.

**Key watch-out:** No analytics included: budget for Mixpanel or Amplitude separately.

### Branch C: Engineering team, zero SaaS dependency desired

**Winner: Shepherd.js** (full-featured) or **Driver.js** (lightweight spotlights).

- Use **Driver.js** for simple spotlight/highlight use cases (zero dependencies, MIT, SSR-safe).
- Use **Shepherd.js v15** for multi-step tours with accessibility requirements, custom renderers, and segment-gating hooks (`showOn`, `beforeShowPromise`).
- Avoid **Intro.js** for commercial SaaS: AGPL v3 licensing requires a paid commercial license.

**Key watch-out:** Open-source libraries accumulate hidden costs: teams must build their own targeting, analytics, localization, and A/B infrastructure on top (source: `research/external/2026-05-20-oss-tour-libraries.md`). When these needs emerge, the SaaS migration becomes attractive.

### Branch D: CSS-in-JS codebase with dynamic class generation

Any tool works, but the team **must** add `data-tour` attributes to targeted elements before building any tour. Without this, class-based SaaS targeting will break on every build that regenerates class names. See `guides/00-principles.md` Principle 1 and `guides/06-maintenance-and-drift.md` for the full protocol.

---

## Open questions (from research)

> TODO: Open question: stinger-forge needs verification before shipping. Userflow's Next.js App Router compatibility in 2026 is unconfirmed. Before recommending Userflow for Next.js App Router teams, verify against `https://userflow.com/docs`. If a client-only wrapper is required, document it in this guide.

> TODO: Open question: Pendo's programmatic JavaScript API for triggering guides is unconfirmed from the research sweep. Verify before recommending Pendo for teams that need to trigger tours from code (vs. the visual builder only).

---

## Worked example

See `examples/saas-platform-audit.md` for a full qualification walkthrough applied to a 2,000-MAU SaaS startup.
