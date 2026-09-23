# Scripts

Deterministic scripts shared across multiple Stingers live in the plugin-root `shared/scripts/` folder, per `shared/scripts/README.md`. This pair has no entry there, its schema.org-completeness problem is specific to the product-catalog audit, so its script lives locally instead.

| Script | Purpose | Deterministic? |
|---|---|---|
| `product-schema-checklist.py` | Extracts every `Product`-typed JSON-LD node from a crawled page (or a standalone JSON-LD file), and checks it against the exact required/recommended field lists for both Google surfaces (product snippet, merchant listing), transcribed verbatim from `references/research/distilled-ecommerce-catalog.md` section 3. Reports missing-required and missing-recommended per surface, plus a `present/total` score. | Yes, for field presence. Whether a value is present is a mechanical check; whether that value is truthful (matches what a shopper actually sees) is not, and is a guide step, not a script step. |

What this script does NOT do, and why: it does not evaluate on-page copy quality, conversion architecture, image quality/count, or anything requiring human judgment, those are `[subjective]` findings produced by the Drone's own reasoning per `guides/03-copy-and-conversion-subjective-analysis.md`, kept separate from this script's quantified output per this Stinger's conduct rule. It also does not reconcile identifiers against a Merchant Center feed or checkout, that cross-system check is out of scope for a static-page checker and stays a manual guide step.

Run it with the Bash tool, no absolute paths baked in:

```
python3 references/scripts/product-schema-checklist.py --site-data <run-workspace>/site-data --out <run-workspace>/12-ecommerce/schema-completeness.json
```

If the field lists in this script and in `distilled-ecommerce-catalog.md` section 3 ever diverge, the distilled research file is the source of truth, update the script to match it, not the other way around.
