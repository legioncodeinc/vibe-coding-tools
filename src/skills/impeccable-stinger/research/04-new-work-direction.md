# 04 — New-Work Direction Machinery (classification, five tests, direction contract, roll)

**Source:** `skill/reference/new-work.md`, `skill/scripts/concept-seed.mjs`, `skill/scripts/lib/concept-catalog.mjs`, `impeccable.style/research` (reference)

## Job classification

- **Greenfield** — no coherent visual implementation; a world gets established.
- **Local extension** — a section/component inside a page that already works; only the new part is decided; the page's world is inherited.
- **New surface** — a whole page/flow inside an established world; composition open, world not.
- **Expression expansion** — an established brand entering a surface family it never resolved; a range is approved and merged into `DESIGN.md`.
- **Redesign or rebrand** — the look is replaced; product facts, content, function, constraints are not.
- **Refinement** — better, not different; leaves this flow for a scoped command like `polish`.

"Redesign this page" authorizes replacement (old look becomes evidence and anti-reference). "Redesign this within our current system" is an extension. Ask once when genuinely ambiguous; never split the difference.

## The five tests (every candidate must pass all)

1. **Truth** — every relationship it visualizes exists in your product. Resemblance is not evidence.
2. **Translation** — strip the source's names and materials and a product-native relationship remains; otherwise it is a costume.
3. **Consequence** — removing its best move materially weakens the page.
4. **Survival** — the signature still works on the primary device, within a real asset and time budget.
5. **Fit** — its risk is an honest tradeoff, not a probable violation of your brief.

## The direction contract (written into the artifact, <=150 words, five blocks)

- `THESIS` — the one idea this page owns, and the category default it refuses.
- `OWN-WORLD` — palette and component language, recognizable with all content removed.
- `STORY` — what the visitor understands, believes, and does.
- `FIRST VIEWPORT` — the exact composition and where the primary action sits.
- `FORM` — the chosen form and the seed key.

The contract exists so intent is inspectable and a **separate reviewer agent** can audit the built page against it promise-by-promise. "A page that promised a radical composition and shipped the usual template does not pass quietly" (`skill/reference/new-work.md`).

## The roll / dice (external variance)

- Problem (measured): "Ask a coding model for something creative and it builds its favorite idea, every run. Sixteen different 'be creative' framings returned the identical concept in thirty of thirty-five runs" (`skill/reference/new-work.md`; `impeccable.style/research`).
- Fix: a script rolls which of the model's own resonance-ordered shortlist gets built, and deals challengers from a reviewed catalog of ~188 visual worlds (`concept-seed.mjs` header; site says 177-188 worlds).
- "The dice never touch an ungrounded idea. They only refuse the argmax rut" (`concept-seed.mjs`).
- Re-roll: user re-rolls freely; the agent may only re-roll on named factual grounds (assigned direction cannot carry the product's truth or the task). "Its own taste is never grounds."
- Reproduction: the script prints a seed key; `--reroll <n>` recomputes prior rounds and excludes them.
- Fallback chain: local catalog (`IMPECCABLE_CATALOG_DIR`) → roll API (`https://impeccable.style/api`, `IMPECCABLE_API_URL`) → degraded local mode (`concept-seed.mjs` lines 63-99).

## Research lessons (from `impeccable.style/research`, reference)

1. The model lacks variance, not creativity (30/35 identical concepts).
2. Rejection advances a queue — "be different" lands on the #2 idea.
3. Argmax is deterministic; dice must **assign** the index, not nominate a menu (27/30 revert to option 1 when a chooser is involved).
4. Derivation is bounded by the subject's cultural depth; assigned foreign forms win over thin categories.
5. Anti-gimmick guards are the ceiling — commit first, then clarify (biggest single quality jump).
6. Committed skin hides template bones — "borrow the form's skeleton, not its clothes"; skin-blind review is a review instrument, never the builder grading itself.
7. Models describe brilliantly and build conservatively — hold them to the direction contract with a fresh reviewer.
