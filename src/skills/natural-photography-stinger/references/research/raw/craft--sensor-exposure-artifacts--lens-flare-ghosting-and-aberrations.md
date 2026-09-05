# Understanding Lens Flare & Ghosting (ishootshows) + Using Lens Corrections (Cambridge in Colour)
- URL: https://ishootshows.com/understanding-lens-flare-ghosting/
- URL: https://www.cambridgeincolour.com/tutorials/lens-corrections.htm
- Fetched: 2026-08-17
- Source type: technical
- Note: foundational optics craft. Direct fetch of cambridgeincolour.com/tutorials/wide-angle-lenses.htm failed with ROBOTS_DISALLOWED; lens-corrections.htm fetched successfully.

## Two distinct flare phenomena
- **Veiling flare** — non-image-forming light scattered across the whole frame: "a general reduction in contrast over the frame," "a lifting of shadows and midtones." No discrete shapes; the image just goes milky. Black point rises, saturation drops.
- **Ghosting** — reflected light that lands "closer to the focal plane," so the reflections are "essentially more in focus and thus appear as bright and more distinct points in the frame."

## Ghost geometry (the part that's hardest to fake correctly)
- Ghosts appear **opposite the original light source across the center axis of the frame** — draw a line from the light source through the frame center and the ghosts fall along it.
- They "often occur in series, with multiple points of ghosting in a single exposure" — one per reflective air-glass surface pair, so a complex zoom produces a long chain.
- **Aperture ghosting**: ghosts take on the literal shape of the iris. "Most readily identifiable with older style lenses without rounded aperture blades, which can project a series of identically shaped polygons stretching out radially from the light source." Straight-blade lenses give polygons (hexagons/heptagons/nonagons per blade count); rounded-blade lenses give discs.
- **Filters make it worse**: any filter adds "another reflective glass-air surface to a lens," increasing reflection likelihood. Cheap uncoated filters flare badly; well-coated ones minimally.

## Chromatic aberration (Cambridge in Colour)
- **Lateral CA** produces "opposing dual-color fringing"; "colors are often **cyan/magenta**, along with potentially a **blue/yellow** component."
- Magnitude is **zero at the frame center and increases toward the corners** — "increasingly so near the corners." This radial gradient is the signature: fringing present in the corners and absent in the center.
- **Longitudinal CA (bokeh fringing)**: green fringes behind the focal plane, magenta/purple in front — visible on out-of-focus specular edges, and it *changes color across the focus plane*. Cannot be corrected in software the way lateral CA can.

## Vignetting
- Optical vignetting is "typically most apparent at **lower f-stops** (wider apertures), with zoom and wide angle lenses," and clears up on stopping down.
- Natural vignetting follows the **cos^4 law** and is always present on wide lenses regardless of aperture.
- Practical corollary: real wide-open shots have darker corners *and* cat's-eye-shaped corner bokeh; both vanish when stopped down.

## Prompt-usable takeaways for "real capture" cues
- Corner-only color fringing (cyan/magenta), not global.
- Ghost chain along the source-through-center axis, polygonal if the iris is stopped down.
- Veiling haze lifting the blacks when shooting into a light source.
- Corner darkening and cat's-eye bokeh at wide apertures.
- Absence of all of these = the "too clean, computer-rendered" read.
