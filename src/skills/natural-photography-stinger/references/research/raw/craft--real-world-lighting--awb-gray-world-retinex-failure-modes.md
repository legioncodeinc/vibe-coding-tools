# White Balance Part 2: The Gray World Assumption and Retinex Theory (The Refracted Light)
- URL: http://therefractedlight.blogspot.com/2011/09/white-balance-part-2-gray-world.html
- Fetched: 2026-08-17
- Source type: technical
- Note: foundational explanation of the two algorithm families every AWB system still descends from.

## Gray World assumption
- Premise: "all the colors in an image ought to average out to a neutral gray" — for every blue there is a yellow, for every red a cyan.
- Implementation: average the whole frame, then scale R/G/B so the average becomes R=G=B.
- **Failure mode — dominant color scenes**: a snow/blue scene "simply has too much blue and too little red to reconstruct a plausible image." Same failure with a frame filled by green foliage, a red wall, a sunset, a wooden interior, or a face filling the frame. AWB "corrects" the dominant color toward neutral, which drains the actual color of the scene and shifts skin.

## Retinex / white-point (Edwin Land, Polaroid)
- Premise: human vision keys off the **brightest patches** to infer the illuminant color and discount it.
- Implementation: find brightest pixels per R/G/B channel independently, scale so the highlights match across channels. (Equivalent to Photoshop Auto Levels with "Enhance Per Channel Contrast.")
- "When it works at all, it works very well," but degrades badly with exposure problems.
- **Failure mode**: if any channel is clipped (overexposed) or crushed (underexposed), "Retinex or Auto Levels will *not* work properly, or at all." A blown window or a specular hotspot poisons the estimate.

## Documented AWB failure table
| Scenario | Result |
|---|---|
| Mixed fluorescent + incandescent | "corrected result shows green and magenta color casts... looks rather worse" — a single global correction cannot fix two illuminants at once |
| Over/underexposed channels | Retinex/Auto Levels fails outright |
| Incandescent interior | Camera auto setting "failed to adjust for the color of light" (leaves the orange) |
| Predominantly colored subject | Gray World yields implausible neutralization |

## Prompt-usable takeaways
The authentic-photo tells are the *residuals* of these failures:
- One illuminant correct, the other visibly wrong in the same frame (warm face + cyan window, or neutral face + orange lamp glow).
- Green/magenta tint that survives correction (fluorescent, cheap LED).
- Global cast pulled by a dominant colored surface (green lawn -> magenta-ish skin; red wall -> cyan-ish skin).
