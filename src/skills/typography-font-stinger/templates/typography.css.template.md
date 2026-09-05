/* =============================================================================
   Typography Token Skeleton
   typography-font-stinger / templates/typography.css.template.md

   INSTRUCTIONS:
   1. Copy this file to `tokens/typography.css` in your project.
   2. Replace placeholder font family names with your actual typefaces.
   3. Generate fluid clamp() values at https://utopia.fyi/type/calculator/
      using your project's min/max viewport range.
   4. Import this file in globals.css and app/layout.tsx (via next/font variables).
   5. All typography in component CSS must reference these tokens via var().
   ============================================================================= */

:root {

  /* ---------------------------------------------------------------------------
     FONT FAMILIES
     If using next/font, replace the first value with the CSS variable name
     declared by next/font (e.g., var(--font-inter)).
     --------------------------------------------------------------------------- */

  --font-family-body:    "REPLACE_BODY_FONT", system-ui, -apple-system, sans-serif;
  --font-family-heading: "REPLACE_HEADING_FONT", system-ui, -apple-system, sans-serif;
  --font-family-code:    "REPLACE_MONO_FONT", "Fira Code", Consolas, monospace;
  /* Optional: --font-family-display for hero / marketing text */


  /* ---------------------------------------------------------------------------
     FLUID TYPE SCALE
     Generator: https://utopia.fyi/type/calculator/
     Default: Major Third ratio (1.25), 320px min viewport, 1440px max viewport,
     1rem base at min, 1.25rem base at max.
     REPLACE these clamp() values with your project's generated scale.
     --------------------------------------------------------------------------- */

  /* Primitive scale steps */
  --step--2: clamp(0.64rem, 0.62rem + 0.11vw, 0.72rem);  /* label, caption */
  --step--1: clamp(0.80rem, 0.77rem + 0.14vw, 0.90rem);  /* small text     */
  --step-0:  clamp(1.00rem, 0.96rem + 0.18vw, 1.13rem);  /* body base      */
  --step-1:  clamp(1.25rem, 1.20rem + 0.23vw, 1.41rem);  /* large body     */
  --step-2:  clamp(1.56rem, 1.50rem + 0.28vw, 1.76rem);  /* h5, h4         */
  --step-3:  clamp(1.95rem, 1.88rem + 0.35vw, 2.20rem);  /* h3             */
  --step-4:  clamp(2.44rem, 2.35rem + 0.43vw, 2.75rem);  /* h2             */
  --step-5:  clamp(3.05rem, 2.94rem + 0.54vw, 3.44rem);  /* h1             */
  /* Add --step-6 and above for display/hero text if needed */


  /* ---------------------------------------------------------------------------
     SEMANTIC SIZE TOKENS
     Map step primitives to semantic names. Adjust mappings to your scale.
     --------------------------------------------------------------------------- */

  --font-size-caption: var(--step--2);
  --font-size-small:   var(--step--1);
  --font-size-body:    var(--step-0);
  --font-size-large:   var(--step-1);
  --font-size-h6:      var(--step-1);
  --font-size-h5:      var(--step-2);
  --font-size-h4:      var(--step-2);
  --font-size-h3:      var(--step-3);
  --font-size-h2:      var(--step-4);
  --font-size-h1:      var(--step-5);
  /* --font-size-display: var(--step-6); */


  /* ---------------------------------------------------------------------------
     FONT WEIGHT TOKENS
     Use the exact numeric values supported by your typeface's weight range.
     Variable fonts: any integer in 100-900.
     Static fonts: only values with corresponding font files (100, 400, 700, etc.)
     --------------------------------------------------------------------------- */

  --font-weight-thin:      100;
  --font-weight-light:     300;
  --font-weight-regular:   400;   /* body */
  --font-weight-medium:    500;   /* UI labels, buttons */
  --font-weight-semibold:  600;   /* subheadings, strong body */
  --font-weight-bold:      700;   /* headings */
  --font-weight-extrabold: 800;   /* display, hero (variable fonts only) */


  /* ---------------------------------------------------------------------------
     LINE HEIGHT TOKENS
     Unitless values. Do NOT use px or rem here - unitless line-height is
     proportional to font-size and works correctly with all text scaling.
     --------------------------------------------------------------------------- */

  --line-height-heading: 1.15;   /* h1, h2, h3: tight, intentional */
  --line-height-subhead: 1.3;    /* h4, h5, h6: intermediate */
  --line-height-body:    1.6;    /* body paragraphs: comfortable reading */
  --line-height-ui:      1.1;    /* buttons, labels, nav links */
  --line-height-caption: 1.45;   /* captions, footnotes */
  --line-height-code:    1.65;   /* code blocks */


  /* ---------------------------------------------------------------------------
     LETTER SPACING TOKENS
     Use em units so spacing scales with font-size.
     --------------------------------------------------------------------------- */

  --letter-spacing-tight:   -0.025em;  /* headings, large display text */
  --letter-spacing-normal:   0em;      /* body text default */
  --letter-spacing-wide:     0.025em;  /* UI labels, nav items */
  --letter-spacing-widest:   0.1em;    /* ALL-CAPS labels, badges */


  /* ---------------------------------------------------------------------------
     VERTICAL RHYTHM TOKENS
     Derive all typographic spacing from this base rhythm unit.
     --------------------------------------------------------------------------- */

  --rhythm:        1.6;       /* unitless, matches --line-height-body */
  --rhythm-rem:    1.5rem;    /* rem equivalent for margin/padding calculations */

  /* Rhythm scale multiples */
  --space-rhythm-xs:  calc(var(--rhythm-rem) * 0.25);   /* 0.375rem */
  --space-rhythm-sm:  calc(var(--rhythm-rem) * 0.5);    /* 0.75rem  */
  --space-rhythm-md:  var(--rhythm-rem);                /* 1.5rem   */
  --space-rhythm-lg:  calc(var(--rhythm-rem) * 1.5);    /* 2.25rem  */
  --space-rhythm-xl:  calc(var(--rhythm-rem) * 2);      /* 3rem     */
  --space-rhythm-2xl: calc(var(--rhythm-rem) * 3);      /* 4.5rem   */

}
