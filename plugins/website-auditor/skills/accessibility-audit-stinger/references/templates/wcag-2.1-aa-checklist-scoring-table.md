# WCAG 2.1 checklist and scoring table

Copy-ready per-criterion checklist for `accessibility-audit-wasp-drone`. Every row is scored on the build plan's zero-to-six scale (`plan/website-auditor-build-plan.md` section 4.1) with a mandatory evidence pointer and one-line justification; a score without both is rejected by `audit-scoring-wasp-drone` (PRD-020 AC-5). Score `0` (N/A) only when the checkpoint genuinely does not apply to this site (e.g. 1.2.x media criteria on a site with no audio/video); N/A leaves are excluded from both numerator and denominator, never counted as a failure.

## Provenance of this table, read before using it

This Stinger's downloaded raw archive (`references/research/raw/`) contains exactly two sources, both about the European Accessibility Act's WCAG-version mapping, and **neither documents the full WCAG 2.1 success-criteria list or per-criterion testing methodology** (`references/research/distilled-accessibility-audit.md` section 6 names this as an explicit, unfilled gap). The success-criteria numbering, names, and A/AA levels below are the WCAG 2.1 specification's own public structure (W3C), which is stable, widely republished reference material, not itself a source archived in this Stinger's `raw/` folder. Per the Critical Directive's instruction to supplement from other available resources when the archive is insufficient, this table is that supplement: use it as the structural scaffold, but verify the live W3C WCAG 2.1 quick-reference (or equivalent current authoritative listing) at audit time rather than treating this table as a cached, permanently-current legal document, particularly for edge cases and any errata since this Stinger's own research window (single sweep, 2026-08-18). The two rows that ARE cited to this Stinger's own raw archive are marked accordingly.

## Which WCAG version to score against

Score against **WCAG 2.1 Level AA**. This is the version cited by EN 301 549 V3.2.1, the currently-referenced harmonised standard under the EAA's Article 15(1) presumption-of-conformity route, as of this Stinger's research window. [raw/groundedwp-com-blog-wcag-21-or-22-for-the-eaa.md] Score the three WCAG 2.2 additions below as a separate, clearly-labelled forward-looking indicator, not part of the AA baseline score, since EN 301 549 V4.1.1 (which cites WCAG 2.2) was not yet referenced in the Official Journal as of this research window. [raw/groundedwp-com-blog-wcag-21-or-22-for-the-eaa.md] [raw/www-disabilityworld-org-articles-eaa-first-year-enforcement-report.md] Re-verify this version-currency claim per the provenance note above before every engagement; it is exactly the kind of fact the vendor-blog source itself warns not to treat as permanently settled. [raw/groundedwp-com-blog-wcag-21-or-22-for-the-eaa.md]

## 1. Perceivable

| SC | Name | Level | Score (0-6) | Evidence | Justification |
|---|---|---|---|---|---|
| 1.1.1 | Non-text Content | A | | site-data/ page + element, or `a11y-scan.py` output | Automatable subset via `a11y-scan.py`'s `image-alt-text` check; presence only, not descriptive quality |
| 1.2.1 | Audio-only and Video-only (Prerecorded) | A | | | N/A if no audio/video content exists on the crawled set |
| 1.2.2 | Captions (Prerecorded) | A | | | N/A if no video content exists |
| 1.2.3 | Audio Description or Media Alternative (Prerecorded) | A | | | N/A if no video content exists |
| 1.2.4 | Captions (Live) | AA | | | N/A if no live media exists |
| 1.2.5 | Audio Description (Prerecorded) | AA | | | N/A if no video content exists |
| 1.3.1 | Info and Relationships | A | | | Automatable subset via `a11y-scan.py`'s `form-input-labels` and `heading-order` checks; full check requires reading the rendered structure, not just tags |
| 1.3.2 | Meaningful Sequence | A | | | Heuristic: does reading/tab order match visual order |
| 1.3.3 | Sensory Characteristics | A | | | Heuristic: instructions that rely solely on shape/color/position |
| 1.3.4 | Orientation | AA | | | Heuristic: does content lock to one screen orientation without a documented essential reason |
| 1.3.5 | Identify Input Purpose | AA | | | Heuristic: common input fields carry an `autocomplete` attribute |
| 1.4.1 | Use of Color | A | | | Heuristic: is color the only means of conveying information |
| 1.4.2 | Audio Control | A | | | N/A if no auto-playing audio exists |
| 1.4.3 | Contrast (Minimum) | AA | | | Heuristic against rendered/visual capture; 4.5:1 normal text, 3:1 large text |
| 1.4.4 | Resize Text | AA | | | Heuristic: text reflows and remains usable at 200% zoom |
| 1.4.5 | Images of Text | AA | | | Heuristic: text presented as an image where real text would serve |
| 1.4.10 | Reflow | AA | | | Heuristic: no loss of content/function at 320px width without two-dimensional scrolling |
| 1.4.11 | Non-text Contrast | AA | | | Heuristic: UI component and graphical-object contrast against adjacent colors, 3:1 |
| 1.4.12 | Text Spacing | AA | | | Heuristic: no loss of content when text-spacing overrides are applied |
| 1.4.13 | Content on Hover or Focus | AA | | | Heuristic: dismissible, hoverable, persistent additional content on hover/focus |

## 2. Operable

| SC | Name | Level | Score (0-6) | Evidence | Justification |
|---|---|---|---|---|---|
| 2.1.1 | Keyboard | A | | | Heuristic: all functionality operable through a keyboard interface |
| 2.1.2 | No Keyboard Trap | A | | | Heuristic: focus can always move away using only the keyboard |
| 2.1.4 | Character Key Shortcuts | A | | | N/A if no single-character keyboard shortcuts exist |
| 2.2.1 | Timing Adjustable | A | | | N/A if no time limits exist |
| 2.2.2 | Pause, Stop, Hide | A | | | N/A if no moving/auto-updating content exists |
| 2.3.1 | Three Flashes or Below Threshold | A | | | N/A if no flashing content exists |
| 2.4.1 | Bypass Blocks | A | | | Heuristic: a skip-link or landmark structure exists to bypass repeated blocks |
| 2.4.2 | Page Titled | A | | Evidence: `a11y-scan.py` `page-title` check output | Automatable via `a11y-scan.py`; presence of a descriptive, non-empty `<title>` |
| 2.4.3 | Focus Order | A | | | Heuristic: focus order preserves meaning and operability |
| 2.4.4 | Link Purpose (In Context) | A | | Evidence: `a11y-scan.py` `link-purpose-in-context` check output | Automatable subset via `a11y-scan.py`; catches empty/generic link text only, not full contextual sufficiency |
| 2.4.5 | Multiple Ways | AA | | | Heuristic: more than one way to locate a page (nav, search, sitemap) |
| 2.4.6 | Headings and Labels | AA | | | Heuristic: headings and labels describe topic or purpose |
| 2.4.7 | Focus Visible | AA | | | Heuristic: a visible focus indicator exists for keyboard-operable UI |
| 2.5.1 | Pointer Gestures | A | | | N/A if no multipoint/path-based gestures exist |
| 2.5.2 | Pointer Cancellation | A | | | Heuristic: down-event does not complete the function without an up-event/abort path |
| 2.5.3 | Label in Name | A | | | Heuristic: visible label text is contained in the accessible name |
| 2.5.4 | Motion Actuation | A | | | N/A if no motion-actuated functions exist |

## 3. Understandable

| SC | Name | Level | Score (0-6) | Evidence | Justification |
|---|---|---|---|---|---|
| 3.1.1 | Language of Page | A | | Evidence: `a11y-scan.py` `page-language` check output | Automatable via `a11y-scan.py`; non-empty `html[lang]` on every crawled page |
| 3.1.2 | Language of Parts | AA | | | Heuristic: passages in a different language are marked with `lang` |
| 3.2.1 | On Focus | A | | | Heuristic: receiving focus does not trigger an unexpected context change |
| 3.2.2 | On Input | A | | | Heuristic: changing an input's setting does not trigger an unexpected context change without warning |
| 3.2.3 | Consistent Navigation | AA | | | Heuristic: repeated navigation components appear in the same relative order across the crawled set |
| 3.2.4 | Consistent Identification | AA | | | Heuristic: components with the same function are identified consistently across the crawled set |
| 3.3.1 | Error Identification | A | | | N/A if no forms exist; otherwise heuristic on form-validation behavior |
| 3.3.2 | Labels or Instructions | A | | Evidence: `a11y-scan.py` `form-input-labels` check output | Automatable subset via `a11y-scan.py`; label association presence, not wording quality |
| 3.3.3 | Error Suggestion | AA | | | N/A if no forms exist |
| 3.3.4 | Error Prevention (Legal, Financial, Data) | AA | | | N/A unless the crawled set includes a legal/financial/data-modifying submission flow |

## 4. Robust

| SC | Name | Level | Score (0-6) | Evidence | Justification |
|---|---|---|---|---|---|
| 4.1.1 | Parsing | A | | Evidence: `a11y-scan.py` `duplicate-id-attributes` note (unscored, candidate finding only) | `a11y-scan.py` surfaces duplicate `id` attributes as a candidate finding; this Stinger's own research archive has no sourced severity mapping for it, score by manual judgment |
| 4.1.2 | Name, Role, Value | A | | | Heuristic: custom UI components expose name/role/value/state programmatically |
| 4.1.3 | Status Messages | AA | | | Heuristic: status messages are exposed to assistive tech without requiring focus |

## WCAG 2.2 additions, forward-looking only, not part of the AA baseline score

These three success criteria are named explicitly in this Stinger's raw archive as the substantive additions in EN 301 549 V4.1.1's WCAG 2.2 mapping. [raw/groundedwp-com-blog-wcag-21-or-22-for-the-eaa.md] Report each as its own labelled band ("meets" / "does not yet meet"), separate from the WCAG 2.1 AA aggregate score, and frame it explicitly as good-faith/forward-looking evidence, not a compliance requirement, per distilled research section 1's note that French and German authorities are already treating WCAG 2.2 conformance this way while it is not yet the presumption-granting version. [raw/www-disabilityworld-org-articles-eaa-first-year-enforcement-report.md]

| SC | Name | Level |
|---|---|---|
| 2.4.11 | Focus Not Obscured (Minimum) | AA |
| 2.5.7 | Dragging Movements | AA |
| 3.3.8 | Accessible Authentication (Minimum) | AA |

## Subjective findings

Any row scored primarily on visual/design judgment (1.4.3 Contrast, 1.4.11 Non-text Contrast, 2.4.6 Headings and Labels wording quality, 3.2.3/3.2.4 consistency) must be labelled `[subjective]` in the output and kept in a separate section of both the rubric and the report, per conduct rule 3.
