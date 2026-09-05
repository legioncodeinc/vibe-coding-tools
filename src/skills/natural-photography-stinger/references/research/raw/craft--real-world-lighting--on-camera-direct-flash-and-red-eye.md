# Camera Flash: Appearance (Cambridge in Colour) + Red-eye effect (Wikipedia)
- URL: https://www.cambridgeincolour.com/tutorials/camera-flash.htm
- URL: https://en.wikipedia.org/wiki/Red-eye_effect
- Fetched: 2026-08-17
- Source type: education

## The direct on-camera flash look
- Produces the **"deer in the headlights"** look: "the side of the subject which receives all the light is also the side the subject the camera sees, resulting in shadows that are barely visible, and a bright and harshly-lit subject."
- Subjects "look less three-dimensional" — the shadow that would model the face falls directly behind it, hidden by the subject.
- The hard, localized source **emphasizes surface texture undesirably**: skin appears rougher because every pore casts a tiny hard shadow, while sebum/sweat returns bright specular hotspots (forehead, nose bridge, cheekbones, chin).
- Falloff: flash brackets and off-camera positions "appear increasingly similar to an on-camera flash the farther they are from your subject" — at distance the geometry collapses back to on-axis.
- **Bounce flash** off a ceiling or wall spreads the source over a large area but "greatly reduces its intensity," requiring more power.

## Why backgrounds go black (combine with inverse-square)
The flash is a point source at the camera. If the subject is at 6 ft and the wall behind is at 12 ft, the wall gets **2 stops less** flash; at 18 ft it gets ~3.2 stops less. That is the signature of a real on-camera flash snapshot: correctly exposed subject, a **hard shadow line on any wall close behind**, and rapid darkening into a black background when nothing is close behind.

## Red-eye — mechanism and dependencies
- Light "travels through the eyes and rebounds at the rear of the eye, turning the eyes red." The flash enters the dilated pupil, reflects off the fundus, and returns along nearly the same axis into the lens.
- **Color source**: "the ample amount of blood in the **choroid**, which supports the back of the eye and lies behind the retina." **Melanin matters** — individuals with less ocular melanin reflect more light, so red-eye is stronger in light-eyed subjects.
- **Geometry**: "the close distance of the flash to the camera lens can also have an impact, especially on cameras with built-in flash." The smaller the flash-to-lens angle as seen from the subject, the stronger the effect — which is why compact cameras and phones (flash millimeters from the lens) produce it and a hot-shoe or bracket flash does not.
- **Pupil state**: more ambient light constricts pupils and reduces the effect. Red-eye reduction fires **pre-flashes** to force pupil contraction before the exposure.
- Animals produce different colors by the same mechanism (a reflective layer behind the retina).

## Mitigations listed
Subject looks away from the lens; more ambient light; flash on a hot shoe or bracket; bounce off white surfaces; fill flash; in-camera and software correction (face detection, region growing, grayscale approaches).

## Prompt-usable takeaways
Authentic direct-flash snapshot = flat frontal light, hard-edged shadow displaced just behind/beside the subject onto a nearby wall, specular hotspots on forehead/nose/cheeks, background falling to darkness, red-eye or a bright on-axis catchlight dead center in each pupil, slight blue-white color cast (flash tubes ~5500–6000 K) against a warm room.
