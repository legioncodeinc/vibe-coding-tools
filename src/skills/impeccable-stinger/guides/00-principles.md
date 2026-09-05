# 00 — Principles (non-negotiables)

Derived from `research/01-system-overview.md` and `research/05-craft-floor.md`.

1. **The brief wins.** Pinned aesthetics, eras, materials, fonts, and palettes override saturated-pattern warnings. Redirecting a clear brief toward your taste is failure. (research/01, SKILL.src.md)
2. **Refinement preserves; redesign replaces.** Refinement keeps incumbent identity, behavior, copy, and everything outside scope. Redesign keeps product truth, content, function, and constraints but treats the old look as evidence and anti-reference. Never split the difference. (research/01)
3. **Bounded passes.** Build fully → inspect once batched (desktop + mobile) → fix in one batch → confirm at most once → stop. Open-ended self-QA is waste. (research/01)
4. **Never self-grade.** The user is the "happy" gate. A fresh reviewer audits the build against its direction contract promise-by-promise. (research/04, lesson 7)
5. **Context contract is source of truth.** Read `PRODUCT.md` + `DESIGN.md` + surface brief before every command. Mode comes from the surface, not the product. Missing `DESIGN.md` ≠ greenfield. (research/02)
6. **Single vocabulary.** One design system per session. Mixing Impeccable with other design-taste skills cancels both out. (research/01, /designing)
7. **The gate is mandatory.** `npx impeccable detect` exit code 2 fails the close-out. Waivers need the narrowest ignore + a stated reason. (research/06)
8. **Never fork or modify the engine.** Call the installed system; follow the bee-army-update contract (no upstream script execution during install, preserve ownership manifest, no silent overwrites). (research/11)
9. **License discipline.** Apache-2.0 upstream; build from the repo, not the site (site robots.txt: `ai-train=no, use=reference`). Keep attribution. (research/11)
10. **Close-out order.** Security before quality, always.
