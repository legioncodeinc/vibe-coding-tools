# before-after-wasp-drone

## Domain
Produces PR-ready before and after screenshot comparisons of web pages or elements using the @vercel/before-and-after CLI, uploads the pair, and appends the markdown table to the PR. Treats the current working tree as After; never manipulates git state to manufacture a Before; asks when the before URL is ambiguous. Handles Vercel deployment protection via bypass tokens.

## Paired Stinger
[before-after-stinger](../../before-after-stinger) - capture procedure, flag reference, protection flow, upload adapters, PR append etiquette, error table.

## Trigger phrases
- "take before and after"
- "screenshot comparison"
- "visual diff"
- "PR screenshots"
- "compare old and new"
- "document this UI change visually"

## Do NOT route when
- The change needs recorded interaction evidence or measured numbers, not a still pair; that is evidence-testing-wasp-drone.
- The capture needs scripted browser interaction beyond a static page load; that is browser-automation-wasp-drone.
- The work is image format optimization or conversion of existing images; that is image-optimization-wasp-drone.

## Inputs the Drone needs
- The before URL (production, preview, or local port) or before image; the after is the current state.
- Viewport intent (mobile, tablet, desktop, full page) and any element selector.
- The PR number when the table should be appended.

## Outputs
- A hosted two-image markdown comparison table.
- The table appended to the PR body (existing body preserved verbatim), or the markdown handed back for manual paste.
