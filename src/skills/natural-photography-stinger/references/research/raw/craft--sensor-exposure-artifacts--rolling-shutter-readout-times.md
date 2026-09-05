# Rolling Shutter: What Causes It, How to Measure It, and How to Minimize It (Tools for Film)
- URL: https://www.toolsforfilm.com/blog/rolling-shutter-explained
- Fetched: 2026-08-17
- Source type: technical

## Sensor readout times (measured, milliseconds)
| Camera | Readout time |
|---|---|
| ARRI ALEXA Mini LF | **0 ms** (global shutter) |
| Sony A7S III | **8.3 ms** |
| Sony FX3 | **9.7 ms** |
| Canon EOS C70 | **12 ms** |
| BMPCC 6K Pro | **17 ms** |
| DJI Mavic 3 Cinema | **22 ms** |
| Sony A7 IV | **23 ms** |
| Sony A6700 | **30 ms** |

Phones and older/cheaper CMOS sit at the slow end (typically 20–35 ms), which is why phone video skews so readily.

## Quantifying skew
`Pixel Offset = Pan Speed (pixels/second) x Readout Time (seconds)`
- 2,000 px/s pan with **15 ms** readout -> **30 px offset** = **0.78% of a 4K frame width**. "Visible on a stationary subject like a building or door frame, but subtle enough to miss on casual viewing."
- 5,000 px/s pan -> **75 px offset** = **2% of frame width** -> "clearly visible on any vertical edge."

## Degrees of lean (real example)
- Sony A7 IV (23 ms): a pan made a building **lean 15 degrees**.
- Sony FX3 (9.7 ms), same movement: lean **under 5 degrees**.

## Measurement method
Tripod-mount, pan rapidly past a scene of many vertical lines, then measure the **horizontal pixel offset between the top and bottom of a vertical element** in the most severe pan.

## Rolling shutter vs jello — they are different artifacts
- **Rolling shutter (skew/shear)**: the lean or shear of vertical elements from relatively slow, large-scale camera movement.
- **Jello**: the wave-like oscillation produced by **high-frequency vibrations** (handheld micro-shake, drone motors, car engine).

## Not covered by this source
LED/fluorescent flicker banding interaction with rolling shutter (that is a separate artifact: horizontal light/dark bands rolling through the frame when the source's AC flicker frequency beats against the line-scan rate).
