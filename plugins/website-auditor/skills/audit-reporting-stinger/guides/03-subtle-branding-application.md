# 03. Subtle-branding application procedure

**Grounding note, stated plainly up front:** this guide's mechanics (what knobs exist) are grounded in [references/research/distilled-audit-reporting.md sections 7-8](../references/research/distilled-audit-reporting.md). Its judgment calls (how to use those knobs restrained) are **not** sourced. Section 8 of that research file states the gap explicitly: none of this pair's five raw sources address restraint, subtlety, or the tension between agency-attribution and client-ownership of a deliverable. The one source that provides branding mechanics at all (the mcp-md-html-pdf tool's docs) is a configuration reference, not a design-taste document - its own example `footer.note` value is "Confidential," not a credit-line or watermarking example. Everything below on WHERE and HOW MUCH to apply the Legion Code Inc. mark is this Stinger's own design judgment, informed by the mechanics the research does cover, but not directly sourced for the tastefulness question itself.

## The binding requirement (not a judgment call)

prd-001's Goals section and prd-021 AC-3 are explicit and binding, regardless of the grounding gap above: the Legion Code Inc. footer, mark, and website link appear **exactly once per document**, applied per the brand system's "scarcity rule," never repeated per section or per finding. This is a hard acceptance criterion, verified by `render-report.py`'s own assertion (`count_brand_credit(html_out) == 1`) and must hold for real rendered output, not just the demo.

## Where the mark and credit line go (this Stinger's design judgment)

- **One location only: the document footer.** Not a running header, not a watermark, not a sidebar, not per-section. The four templates in this repo implement this as a single `<footer>` element in each HTML shell and a single trailing paragraph in each Markdown document.
- **Small logo mark, not a full lockup.** `brand.json`'s `logo.width_px` (96px in the example config) keeps the mark legible but visually secondary to the document's own content. This is a design choice, not a sourced constraint - the research's only source for logo sizing (mcp-md-html-pdf) says the logo is base64-embedded for portability but does not recommend a size.
- **Credit line reads as attribution, not advertisement.** `brand.json`'s `footer.credit_line` value ("Audit tool created by Legion Code Inc.") states who built the tool that produced the document, not a sales pitch. This wording is prd-001's own stated copy, not invented here.
- **Website link travels with the credit line, not separately.** One link, in the footer, per prd-021 AC-3's "mark and website link" pairing - not a second link elsewhere in the document.

## How the brand palette stays scarce (the "scarce primary-accent use" rule)

prd-021's Goals section names three specific brand-token constraints this Stinger must honor, sourced from the PRD itself (not this research pass, since the actual brand CSS files - `brand/legion.css`, `brand/colors_and_type.css` from the AC Direct engagement - were never vendored into this repo per prd-020's open question):

1. **Scarce primary-accent use.** The brand's `primary`/`accent` colors appear only in structural chrome (the header rule under the title, the left-border accent on `<h2>` section headings, the footer) - never as a background fill, never repeated as a per-finding accent, never used decoratively inside the findings body itself.
2. **JetBrains Mono for technical strings only.** Evidence pointers, file paths, header names, and IDs use the mono font stack; prose never does. Both HTML templates apply this via a `.mono`/`code` CSS class plus a dedicated `<td class="mono">` convention in the auditor table, not a blanket monospace default.
3. **Severity-semantic-only color.** The red/orange/amber/green severity badges (`.badge-critical` through `.badge-pass`) are defined in `brand.json`'s separate `severity_colors` object, deliberately kept apart from the brand `colors` object, so brand color never doubles as a status signal and severity color never leaks into brand chrome (the header rule, the footer, the logo treatment). This separation is enforced structurally in the CSS (two separate token groups), not by convention alone.

## Procedure when rendering a real report

1. Load `brand.json` (or an engagement-specific override, per the layering model in guide 02 / research section 7) exactly once per run.
2. Render the footer exactly once, from that one `brand.footer` object, in each of the four output files.
3. Before treating a render as complete, grep the rendered HTML for the credit-line string and confirm the count is exactly 1, and grep for the mark's `<img>`/alt text and confirm the same. `render-report.py`'s own verification step does this for the sample output; do the same for real output.
4. If an engagement ever calls for a different subtlety level (e.g., a client contract that forbids agency attribution entirely, or a white-label engagement), that is a `brand.json` override at the `footer.show_mark`/`show_contact` boolean level, not a template edit - keeps the scarcity discipline enforced by data, not by re-authoring markup per engagement.

## What NOT to do

- Do not add the mark or credit line to the executive-summary page specifically "for visibility" - that is exactly the garish, self-promotional pattern the scarcity rule exists to prevent, and it directly violates AC-3's "not repeated per section" language.
- Do not use the brand accent color as a table-row highlight, a background tint, or a bullet-point color - reserve it for the header rule, section-heading accent, and footer only, per the scarce-primary-accent-use rule above.
- Do not treat this guide's placement/sizing choices as sourced fact if asked to defend them externally - they are this Stinger's own restrained interpretation of a binding requirement, made in the explicit absence of source guidance on tastefulness, and should be revisited if the real Legion Code Inc. brand CSS files are ever vendored into this repo.
