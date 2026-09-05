# Refactoring UI: Core Principles

**Sources:**
- https://refactoringui.com/
- https://refactoringui.com/book/
- https://medium.com/design-bootcamp/top-20-key-points-from-refactoring-ui-by-adam-wathan-steve-schoger-d81042ac9802
- https://www.mikefiorillo.com/book-notes/refactoring-ui-by-steve-schoger-adam-wathan

**Retrieved:** 2026-04-24

## Summary

Adam Wathan + Steve Schoger's 2018 book is the canonical taste-level design
system reference. Its pragmatic rules underpin Tailwind CSS and shadcn/ui.
The book organizes around five sections: Starting from Scratch, Hierarchy,
Layout & Spacing, Designing Text, Working with Color, plus Creating Depth
and Working with Images.

## Load-bearing principles for this Stinger

1. **Visual hierarchy is the most effective tool for making something feel
   designed.** Not all elements are equal: combine size, weight, and color
   to rank them.
2. **Don't use grey text on colored backgrounds.** Colored backgrounds need
   tinted-of-the-same-hue text, not grey.
3. **De-emphasize to emphasize.** Reduce the weight/contrast of secondary
   elements rather than amplifying primary ones.
4. **Labels are a last resort.** Prefer inline placeholders or visible
   labels over floating labels for accessibility.
5. **Establish a type scale.** 8-10 fixed sizes, not arbitrary pixel values.
6. **Line-height is proportional.** Smaller text wants tighter line-height
   relative to its size.
7. **You need more colors than you think.** 5-10 shades per palette color is
   normal for a complex product; three shades is insufficient.
8. **Define your shades up front.** Don't pick colors ad-hoc; define the
   palette before writing UI code.
9. **Don't let lightness kill your saturation.** In HSL, extreme lightness
   desaturates: use OKLCH or CIELCH for accessible palettes.
10. **Accessible doesn't have to mean ugly.** 4.5:1 body contrast is a floor,
    not a ceiling.
11. **Don't rely on color alone.** State changes need shape/weight/icon,
    not just hue.
12. **Use color sparingly.** Reserve color for emphasis; overuse flattens
    hierarchy.

## Relevance to this stinger

- `guides/00-principles.md` uses these as the baseline taste rules that sit
  UNDERNEATH product-specific non-negotiables.
- `guides/02-authoring-design-brief.md` teaches the Bee to write the
  product's own non-negotiables as a layer on top of these universal ones.
- The interview in `guides/01-interview-procedure.md` probes for places where
  the user's aesthetic intuition violates one of these principles (common
  trap: bright-gold text on cream background, a direct violation of
  "don't use grey / low-contrast text on colored backgrounds").
- `starter-kits/editorial-serif/` is the aesthetic that most directly
  inherits the Refactoring UI taste palette.
