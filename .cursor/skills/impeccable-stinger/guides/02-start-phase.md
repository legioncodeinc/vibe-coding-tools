# 02 — Start Phase (context + direction)

Derived from `research/02-context-contract.md`, `research/03-command-vocabulary.md`, `research/04-new-work-direction.md`.

## 1. Ensure context

- No `PRODUCT.md` → run `/impeccable init` (discovery interview; writes `PRODUCT.md`; offers `DESIGN.md` when code exists).
- No `DESIGN.md` → run `/impeccable document` (Stitch format + `.impeccable/design.json`).
- Files exist → read them; do not re-interview.

## 2. Classify the job

- **Greenfield** — no coherent visual implementation; a world gets established.
- **Local extension** — a section/component inside a working page; only the new part is decided; the page's world is inherited.
- **New surface** — a whole page/flow inside an established world; composition open, world not.
- **Expression expansion** — an established brand entering a surface family it never resolved; approve a range, merge into `DESIGN.md`.
- **Redesign or rebrand** — the look is replaced; product facts, content, function, constraints are not.
- **Refinement** — better, not different; leave this flow for a scoped command like `polish`.

"Redesign this page" = replacement (old look becomes anti-reference). "Redesign within our current system" = extension. Ask once when genuinely ambiguous; never split the difference.

## 3. New-work flow (new surfaces + redesigns)

1. Derive a grounded shortlist of candidate directions from the product's world (audience, evidence, cultural material).
2. **Roll** (`node <skill>/scripts/concept-seed.mjs` or the installed skill's script): assign which candidate is built; deal challengers from the worlds deck. The dice refuse the argmax rut; they never touch an ungrounded idea.
3. Apply the **five tests** to every candidate — fail one, it dies:
   - **Truth** — every relationship it visualizes exists in your product.
   - **Translation** — strip the source's names/materials and a product-native relationship remains (else it is a costume).
   - **Consequence** — removing its best move materially weakens the page.
   - **Survival** — the signature works on the primary device within a real asset/time budget.
   - **Fit** — its risk is an honest tradeoff, not a probable brief violation.
4. Write the **direction contract** into the artifact (see `templates/direction-contract.md`): `THESIS / OWN-WORLD / STORY / FIRST VIEWPORT / FORM`, <=150 words, five blocks. Keep the seed key for reproduction.
5. **Visualize** when image tooling is available: system board + first-surface mock, then build toward the image. If no native image tool, set `OPENAI_API_KEY` and render via gpt-image-2 (say so first — it spends the user's credit, ~5-25 cents each).

## Re-roll rules

- The user re-rolls freely, for any reason including taste. After two in a row, ask what quality is missing.
- The agent may only re-roll on named factual grounds (the assigned direction cannot carry the product's truth or the task). Its own taste is never grounds.
- In an unattended run, the assigned direction proceeds and assumptions are stated explicitly.
