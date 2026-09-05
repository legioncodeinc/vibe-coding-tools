# 07: Lighting Reference

## What this guide is for
The lighting lookup. Every named condition with its Kelvin value, its quality and direction, the physical falloff behavior it implies, and the literal phrasing to write into a prompt. Mixed-lighting recipes are here because a single coherent color temperature across a frame is one of the strongest "this was rendered" signals, and residual color casts are one of the strongest "this was captured" signals.

## Load this when
- You are filling the lighting slot of a prompt (Google's slot 5; OpenAI's "lighting/mood (soft diffuse, golden hour, high-contrast)") [distilled-image-models.md].
- You need the color temperature of a named source.
- You need to know how brightness should fall off across a frame, or why the absence of a falloff gradient reads as fake.
- You are writing an interior and need a mixed-illuminant recipe rather than one flat Kelvin.
- You need the complete direct-flash look, including red-eye and when it appears.

**Unfixed-tell context.** Consistent light direction across the frame, correct shadow geometry, and correct reflections are all listed as **still unfixed** in current image models, while hands and teeth are largely fixed [distilled-photographic-craft.md]. Lighting is therefore one of the highest-leverage things to specify explicitly.

---

## 1. Full Kelvin table with prompt phrasing

| Band | Source | Kelvin | Prompt phrasing |
|---|---|---|---|
| Warm | Match flame | **1700 K** | `lit by a struck match, deep orange, tiny source, hard falloff` |
| Warm | Candle | **2000 K** | `candlelit, deep amber, flickering, very short throw` |
| Warm | Dawn sunlight | **2000 K** | `dawn light, deep orange, sun barely above the horizon` |
| Warm | 40 to 60 W household tungsten bulb | **2800 K** | `lit by a household lamp, warm orange domestic light` |
| Warm | 100 to 200 W household tungsten bulb | **2900 K** | `bright household tungsten, warm` |
| Warm | 500 to 1000 W tungsten floods | **3000 K** | `tungsten flood light` |
| Warm | Warm white fluorescent | **3000 K** | `warm white fluorescent tube, slight green residual` |
| Warm | Studio tungsten lamps | **3200 K** | `studio tungsten key light` |
| Warm | Tungsten projector lamp | **3200 K** | `projector lamp spill` |
| Warm | Tungsten halogen | **3300 K** | `halogen light, warm and hard` |
| Warm | Photoflood tungsten | **3400 K** | `photoflood, warm and bright` |
| Mid | White fluorescent | **3500 K** | `white fluorescent overhead, green residual on skin` |
| Mid | Cool white fluorescent | **4300 K** | `cool white fluorescent overhead, green cast in the ceiling bounce` |
| Mid | Midday sunlight | **5400 K** | `midday sun, neutral white, hard overhead` |
| Mid | "Typical daylight" (sun plus sky) | **6500 K** | `open daylight, sun and sky combined` |
| Cool | Overcast sky | **6800 K** | `overcast, the whole sky as the source, near shadowless` |
| Cool | Hazy sky | **8000 K** | `hazy sky, cool and soft` |
| Cool | Clear blue sky / open shade lit by sky only | **10,000 to 25,000 K** | `open shade lit only by blue sky, strong cool cast in the shadows` |

Supplementary values from other files in the corpus: electronic flash tubes **~5500 to 6000 K**; production daylight **5000 to 6500 K**, tungsten **3200 K**; golden hour **~2500 to 3500 K**; blue hour **10,000 K+** [distilled-photographic-craft.md].

**Known inconsistency to be aware of:** the mired worked example uses "Daylight 5500 K" while the same table lists midday sunlight at 5400 K and typical daylight at 6500 K. These are different referents (nominal photographic daylight versus measured midday sun versus sun plus sky), not a measurement disagreement [distilled-photographic-craft.md].

### 1.1 Mired math (why small warm shifts are visible and small cool shifts are not)

`MIRED = 1,000,000 / Kelvin` [distilled-photographic-craft.md]

| Source | Kelvin | Mireds |
|---|---|---|
| Daylight | 5500 K | **182** |
| Studio tungsten | 3200 K | **312** |

**The perceptual size of a color shift is constant in mireds, not Kelvin.** A 100 K error at 3200 K is far more visible than a 100 K error at 6500 K [distilled-photographic-craft.md].

Correction filters, for when you want to name the correction rather than the source:

| Filter | Function | Mired shift |
|---|---|---|
| 85 | daylight to tungsten (amber) | **+112** |
| 81EF | half 85 (amber) | **+52** |
| 80A | tungsten to daylight (blue) | **-131** |

Production equivalents: **CTO** warms a cool source, **CTB** cools a warm source, adjustable-CCT LED fixtures match room practicals rather than fighting them [distilled-photographic-craft.md].

---

## 2. Mixed lighting: the recipes that signal a real room

**The core fact:** a real interior almost never sits at one Kelvin. **2800 to 3000 K lamps plus a 6500 K window plus a 4300 K overhead fluorescent in the same frame yields warm faces, blue window spill, and green ceiling bounce** [distilled-photographic-craft.md].

**The off-locus problem:** fluorescent and cheap LED are **off the blackbody locus entirely**. They need a green/magenta (tint) axis correction *in addition to* a Kelvin correction. "This is exactly the residual cast that survives auto-white-balance and reads as 'real room'" [distilled-photographic-craft.md].

### 2.1 Named recipes

| Recipe | Sources and Kelvin | What survives correction (the residual) | Literal prompt phrasing |
|---|---|---|---|
| **Tungsten key with window fill** | Household lamp 2800 to 2900 K as key; daylight window 6500 K as fill | A **2300 to 3700 K split** across the frame. If the camera balances for the lamp, the window side of the face and any window spill go distinctly **cyan/blue**. If it balances for the window, the lamp glow goes **orange**. Both are correct-looking; neither is neutral. | `a warm 2800K table lamp as the key on one side of the face and cool 6500K daylight from a window filling the other side, the two colour temperatures visibly disagreeing across the face, the window spill reading cyan against the warm lamp` |
| **Fluorescent overhead with daylight** | Cool white fluorescent 4300 K overhead; daylight 6500 K from a window | A **green residual on the ceiling bounce and on the tops of shoulders and foreheads** that no Kelvin correction removes, because the tube is off the blackbody locus. Faces near the window stay neutral; faces under the tube go slightly green. | `cool white fluorescent tubes overhead plus daylight from a side window, a green cast on the ceiling bounce and the tops of the shoulders that survives white balance, neutral skin near the window` |
| **LED with incandescent** | Cheap LED fixture (off-locus) plus 2800 K incandescent lamps | A **magenta or green tint axis error** on top of a warm/cool Kelvin split. Cheap LED is spiky in spectrum, so skin under it renders differently from skin under the incandescent even at the same nominal Kelvin. | `a cheap LED ceiling fixture and warm incandescent table lamps in the same room, a slight magenta tint on the LED-lit surfaces that a single white balance cannot remove, warmer skin where the incandescent reaches` |
| **Minus-green / plus-green correction** | Minus-green (magenta) gel corrects the excess green of standard cool-white and warm-white fluorescent tubes; plus-green matches a source *to* fluorescent | Name the gel if you want the corrected version, name the residual if you want the uncorrected one | `uncorrected fluorescent, visible green in the midtones` |

All from [distilled-photographic-craft.md].

**Prompt rule that follows:** never write a single lighting phrase for an interior. Write two or three sources with different Kelvin values and name which one the white balance is set for. The disagreement is the authenticity signal.

---

## 3. Golden hour and blue hour

| Stage | Sun elevation | Color temperature |
|---|---|---|
| **Golden hour** | **+6 degrees above to -6 degrees below** the horizon | **~2500 to 3500 K** |
| **Blue hour** | **-4 to -8 degrees** below the horizon | **10,000 K+** |
| Civil twilight (reference) | **0 to -6 degrees** | not applicable |

The golden and blue ranges **overlap**, which is why the two bleed into each other [distilled-photographic-craft.md].

### 3.1 Duration by season and latitude

| Season | Duration |
|---|---|
| Summer | **15 to 20 minutes** |
| Winter | **45 to 60+ minutes** |
| Near the equator | Shortest |
| High latitudes | Can last hours |

[distilled-photographic-craft.md]

### 3.2 Light quality and the AWB trap

Low sun angle produces long gentle shadows that add depth. Light travels through more atmosphere, Rayleigh-scattering the blue out and leaving warm wavelengths. **Contrast is reduced versus midday**: "even exposure... easier to capture detail" [distilled-photographic-craft.md].

**The trap:** golden hour at 2500 to 3500 K sits in **tungsten territory**, so an auto-white-balanced golden-hour shot often comes back neutral and disappointing. **The warmth must be preserved deliberately** [distilled-photographic-craft.md].

### 3.3 Prompt phrasing

| Condition | Prompt phrasing |
|---|---|
| Golden hour | `golden hour, sun a few degrees above the horizon, warm 3000K key light, shadows several times the subject's height stretching across the ground, a strong warm rim on one side of the head, cool cyan skyfill in the shadows, white balance left warm rather than corrected to neutral` |
| Blue hour | `blue hour, sun about six degrees below the horizon, 10000K ambient, deep blue sky, warm artificial lights already on and reading strongly orange against the blue` |
| Late golden into blue | `the overlap of golden and blue hour, warm horizon glow and cool blue overhead in the same frame` |

**Golden hour is a genuine two-color-temperature scene:** warm directional key from the sun, cool cyan/blue fill from the sky. Naming both is what makes it read real [distilled-photographic-craft.md].

---

## 4. The three canonical daylight conditions

| Condition | Kelvin | Sun elevation | Signature | Prompt phrasing |
|---|---|---|---|---|
| **Golden hour** | 2500 to 3500 K | 0 to 6 degrees | Shadows several times subject height, strong directional rim or kicker, warm skin, cyan/blue shadow fill from the sky | see 3.3 |
| **Midday** | ~5400 K | 60 to 90 degrees | **Short hard shadows directly beneath**, raccoon-eye shadows in the eye sockets, hot forehead and nose, shadow under the nose and chin, high contrast | `harsh midday sun almost directly overhead, short hard shadows pooled directly under the subject, dark raccoon shadows in the eye sockets, a hot highlight on the forehead and nose bridge, hard shadow under the nose and chin` |
| **Overcast** | ~6800 K | Entire sky is the source | **Near shadowless**, very low contrast, faint top-down shading (slight shadow under the brow, nose, chin), **no catchlight shape except a large soft band in the eye** | `overcast, the entire sky as one huge soft source, almost no shadows, a faint top-down shading under the brow and chin, a large soft band catchlight in each eye, cool 6800K cast` |

All from [distilled-photographic-craft.md].

---

## 5. Inverse-square falloff

### 5.1 The law

**Doubling the distance from a light source loses 4x the light, which is 2 stops, not one.** "Light intensity or brightness drops much faster **closer** to the source than it does further away" [distilled-photographic-craft.md].

### 5.2 Worked distance and aperture table (constant ISO and shutter)

| Distance from source | Correct aperture | Cumulative loss |
|---|---|---|
| **3 ft** | f/16 | baseline |
| **6 ft** | f/8 | **-2 stops** |
| **12 ft** | f/4 | **-4 stops** total |

[distilled-photographic-craft.md]

### 5.3 Two-subject falloff demonstration (same 1.5 ft separation each time; the *ratio* matters, not the gap)

| Subject A / Subject B distance | Relative brightness difference |
|---|---|
| **3 ft versus 4.5 ft** | large, obvious difference |
| **6 ft versus 7.5 ft** | reduced difference |
| **12 ft versus 13.5 ft** | "virtually the same brightness" |

[distilled-photographic-craft.md]

### 5.4 Catchlight size and background brightness: near source versus far source

| Source position | Shadows | **Catchlights** | **Background** |
|---|---|---|---|
| **Close to the subject** | Sharper-edged | **Bigger** | **Darker** (the background is proportionally much farther, so it falls off hard) |
| **Far from the subject** | Softer | **Smaller** | **Brighter** (subject and background sit at similar distances) |

[distilled-photographic-craft.md]

**Prompt phrasing, near source:** `the light source close to the subject, large soft-edged catchlights filling much of each iris, a steep brightness gradient across the face, the background falling several stops into darkness`

**Prompt phrasing, far source:** `the light source far from the subject, small hard catchlights, even flat illumination across the face, the background nearly as bright as the subject`

### 5.5 Worked window-light cases

| Case | Behavior | Prompt phrasing |
|---|---|---|
| **Person 2 to 4 ft from a window** | Bright side of the face **2 to 3 stops** over the shadow side; background **3 to 4 stops** down; a visible gradient **across the face itself** (near cheek brighter than far cheek); large soft rectangular catchlight | `standing two feet from a window, the near side of the face two to three stops brighter than the far side, a visible brightness gradient across the face itself, the room behind falling three to four stops darker, a large soft rectangular window catchlight in each eye` |
| **Person 10+ ft from the window** | Even, flat, low contrast; tiny catchlight; background nearly as bright as the subject. **This is the real interior snapshot look.** | `standing well back from the window, flat even light, a small catchlight, the background nearly as bright as the subject` |

**The load-bearing rule:** "**Absence of any falloff gradient across the frame is a strong AI/studio tell.** Real point-ish sources always leave a measurable brightness ramp" [distilled-photographic-craft.md]. Always name a gradient direction.

### 5.6 Multi-subject placement consequence

**"Place your light source closest to the darkest-skinned subjects."** Inverse-square then naturally gives the darker subject more light and the lighter subject less. Alternatives: multiple key lights at different intensities, or reflectors lifting only the darker subject [distilled-photographic-craft.md].

This only works when the source is **close**: at 3 ft versus 4.5 ft the difference is "large, obvious"; at 12 ft versus 13.5 ft it is "virtually the same" [distilled-photographic-craft.md].

---

## 6. Direct on-camera flash: the complete look

| Characteristic | Detail |
|---|---|
| **The look** | **"Deer in the headlights."** "the side of the subject which receives all the light is also the side the subject the camera sees, resulting in shadows that are barely visible, and a bright and harshly-lit subject" |
| **Shadow behind the subject** | Subjects "look less three-dimensional"; the modeling shadow falls **directly behind the subject, hidden by them**. If a wall is close behind, you get a **hard shadow line** offset just behind or beside the subject. |
| **Texture exaggeration** | The hard, localized source **emphasizes surface texture undesirably**: skin appears rougher because every pore casts a tiny hard shadow, while sebum and sweat return bright specular hotspots on the **forehead, nose bridge, cheekbones, and chin** |
| **Falloff to background** | Flash plus inverse-square: subject at 6 ft with the wall behind at 12 ft, the wall gets **2 stops less** flash; at 18 ft it gets **~3.2 stops less**. When nothing is close behind, the background falls to **black**. |
| **Geometry collapse** | Flash brackets and off-camera positions "appear increasingly similar to an on-camera flash the farther they are from your subject" |
| **Bounce** | Spreads the source over a large area but "greatly reduces its intensity," requiring more power |
| **Color** | Flash tubes run **~5500 to 6000 K**, so a slight blue-white cast against a warm room |

All from [distilled-photographic-craft.md].

### 6.1 Red-eye: mechanism and when it appears

| Factor | Mechanism |
|---|---|
| **Optical path** | Light "travels through the eyes and rebounds at the rear of the eye, turning the eyes red." The flash enters the dilated pupil, reflects off the fundus, and returns along nearly the same axis into the lens. |
| **Color source** | "the ample amount of blood in the **choroid**, which supports the back of the eye and lies behind the retina" |
| **Melanin** | Individuals with **less ocular melanin reflect more light**, so red-eye is stronger in light-eyed subjects |
| **Geometry (when it appears)** | "the close distance of the flash to the camera lens can also have an impact, especially on cameras with built-in flash." The **smaller the flash-to-lens angle as seen from the subject, the stronger the effect**. Compacts and phones (flash millimeters from the lens) produce it. A hot-shoe or bracket flash does not. |
| **Pupil state** | More ambient light constricts pupils and reduces the effect. Red-eye reduction fires **pre-flashes** to force pupil contraction before the exposure. |
| **Animals** | Different colors by the same mechanism (a reflective layer behind the retina) |

Mitigations: subject looks away from the lens; more ambient light; flash on a hot shoe or bracket; bounce off white surfaces; fill flash; in-camera and software correction (face detection, region growing, grayscale approaches) [distilled-photographic-craft.md].

**Red-eye appears when: built-in flash, dark ambient (dilated pupils), subject looking at the lens, light-colored eyes. It does not appear when: bracket or hot-shoe flash, bright ambient, subject looking away, or red-eye reduction pre-flashes fired.**

### 6.2 The composite authentic direct-flash snapshot

Write all of it [distilled-photographic-craft.md]:

`direct on-camera flash, flat frontal light with barely visible shadows on the subject, a hard-edged shadow displaced just behind and beside the subject onto the wall a few feet back, specular hotspots on the forehead, nose bridge, cheekbones and chin, skin texture exaggerated so every pore reads, the background falling rapidly into darkness, a bright on-axis catchlight dead centre in each pupil, a slight blue-white 5500K cast against the warm room behind`

Add red-eye only when the conditions above hold: `mild red-eye in both pupils`.

**Cross-reference:** direct flash is a named marker of the snapshot aesthetic, listed alongside "meaningless blur, grain, muddy exposures, drunken horizons, and general sloppiness" and described as "dazzling artificial light" [distilled-photographic-craft.md].

---

## 7. The remaining named conditions

| Condition | Kelvin | Quality and direction | Physics to name | Prompt phrasing |
|---|---|---|---|---|
| **Window light (close)** | 6500 K daylight, or 10,000 to 25,000 K if the window sees only blue sky | Large soft source, strongly directional, side | 2 to 3 stop face split, 3 to 4 stop background drop, gradient across the face, large rectangular catchlight | `soft directional window light from camera left, the near cheek two stops brighter than the far cheek, the room behind three stops down, a large soft rectangular catchlight` |
| **Window light (far)** | same | Soft, near-omnidirectional by the time it arrives | Flat, tiny catchlight, background nearly as bright as the subject | `flat window light from across the room, low contrast, a small catchlight, background almost as bright as the subject` |
| **Overcast** | **6800 K** | The entire sky is the source; top-down | Near shadowless, very low contrast | `overcast daylight, near shadowless, faint shading under the brow and chin, cool cast` |
| **Open shade** | **10,000 to 25,000 K.** Open shade is **NOT 5500 K**; it is sky-lit | Soft, top-down and from the open side | The classic **blue shadow cast** | `open shade under a building edge, lit only by blue sky, a strong cool blue cast in the skin and shadows, no direct sun` |
| **Midday sun** | **~5400 K** | Hard, small source, 60 to 90 degrees overhead | Short hard shadows directly beneath, raccoon eyes, hot forehead | `harsh midday sun, short hard shadows directly beneath the subject, raccoon shadows in the eye sockets, blown highlights on the forehead` |
| **Night street** | No Kelvin value for sodium or LED street lighting appears in the corpus. **Build it from the mixed-illuminant recipe instead.** | Multiple small hard sources at varying heights and distances, mostly overhead and behind | Steep per-source inverse-square falloff (a subject passing under a lamp goes bright then dark within a few paces); off-locus LED needs a green/magenta correction on top of Kelvin; high ISO means visible luminance grain plus chroma mottling; long exposures add thermal noise, hot pixels, and blotchy color | `a night street lit by several different artificial sources at different colour temperatures, warm shop windows against cooler overhead street lighting, a green residual on the LED-lit surfaces that white balance cannot remove, the subject bright directly under one lamp and falling two stops darker a few paces away, visible luminance grain in the shadows with mild colour mottling` |
| **Interior practicals** | 2800 to 3200 K lamps; add 3500 to 4300 K if fluorescent tubes are present | Small warm sources at furniture height, plus overhead | Steep falloff from each lamp; a lamp visible in frame should be clipped white with the immediate surround 2 stops down within a couple of feet | `lit by the room's own practicals, a 2800K table lamp clipping to white in frame with the wall beside it falling off within two feet, a second lamp across the room, no light source outside the frame` |
| **Golden hour** | 2500 to 3500 K key, cool skyfill | Low, directional, raking | Long shadows several times subject height, reduced contrast | see section 3.3 |
| **Blue hour** | 10,000 K+ ambient | Soft, omnidirectional from the sky, plus point artificial sources | Extreme warm/cool split between the sky and any artificial light | see section 3.3 |
| **Direct on-camera flash** | ~5500 to 6000 K | Hard, tiny, dead frontal, on-axis | See section 6 in full | see section 6.2 |

Kelvin values and physics from [distilled-photographic-craft.md].

---

## 8. Auto white balance failure modes, and how to invoke them deliberately

### 8.1 The two algorithms

| Algorithm | Premise | Implementation |
|---|---|---|
| **Gray World** | "all the colors in an image ought to average out to a neutral gray"; for every blue there is a yellow, for every red a cyan | Average the whole frame, then scale R/G/B so the average becomes R=G=B |
| **Retinex / white-point** (Edwin Land, Polaroid) | Human vision keys off the **brightest patches** to infer the illuminant color and discount it | Find the brightest pixels per channel independently, scale so the highlights match across channels. "When it works at all, it works very well," but it degrades badly with exposure problems |

[distilled-photographic-craft.md]

### 8.2 Failure modes and their prompt phrasing

| Scenario | Documented result | Literal prompt phrasing to invoke it |
|---|---|---|
| **Mixed fluorescent plus incandescent** | "corrected result shows green and magenta color casts... looks rather worse": a single global correction cannot fix two illuminants at once | `mixed fluorescent and incandescent light, the automatic white balance splitting the difference badly so a green cast sits on one side of the room and a magenta cast on the other` |
| **Over or underexposed channels** | Retinex "will *not* work properly, or at all"; a blown window or a specular hotspot poisons the estimate | `a blown-out window in frame throwing off the camera's white balance, the interior left too warm` |
| **Incandescent interior** | Camera auto setting "failed to adjust for the color of light," leaving the orange | `the camera's auto white balance failing to neutralise the tungsten, the whole room left orange` |
| **Predominantly colored subject** | Gray World yields implausible neutralization. A snow and blue scene "simply has too much blue and too little red to reconstruct a plausible image." Same failure with green foliage, a red wall, a sunset, a wooden interior, or a face filling the frame | Green lawn: `a large green lawn filling the frame pulling the white balance so skin reads slightly magenta`. Red wall: `a red wall dominating the frame pulling skin slightly cyan`. Snow: `a snow scene the camera cannot neutralise, left distinctly blue` |

[distilled-photographic-craft.md]

### 8.3 The three authentic-photo residuals (the highest-value phrases in this guide)

**"The authentic-photo tells are the *residuals* of these failures"** [distilled-photographic-craft.md]:

1. **One illuminant correct and the other visibly wrong in the same frame.** `warm correctly-rendered face with a cyan window behind`, or `neutral face with an orange lamp glow beside it`
2. **Green or magenta tint that survives correction** (fluorescent, cheap LED). `a green tint on the ceiling bounce and shoulders that no white balance removes`
3. **A global cast pulled by a dominant colored surface.** `skin pulled slightly magenta by the green lawn filling the frame`

### 8.4 What to avoid

Do not write a frame in which every surface is correctly white-balanced. A perfectly neutral frame with one coherent color temperature everywhere is a rendering signature, not a capture signature.

Also avoid the **phone semantic-correction look** unless you want it: `sky and faces graded separately, not sharing one light` and `every face brightened independently of the background` are the named phone failure modes, described by practitioners as "garish," "cartoonish," "sterile and inhuman," "washed out" [distilled-photographic-craft.md].

**Cross-reference caution on skin:** phone semantic face brightening ("every time there's a very bright background, the iPhone also tries to boost the brightness of the people in the photo, making them look very white") is the same over-lightening failure the skin-tone literature warns against. Do not lift luminance until deep skin goes ashy or gray; it should retain saturation and a warm or cool undertone [distilled-photographic-craft.md].

---

## 9. Quick-reference table

| Lighting condition | Kelvin | Quality | Direction | Prompt phrase | What it signals about the scene |
|---|---|---|---|---|---|
| Candle | 2000 K | Very hard, tiny, flickering | Low, from the source's position | `candlelit, deep amber, very short throw` | Intimate, night, no electric light |
| Dawn sun | 2000 K | Soft-hard, raking | Horizontal | `dawn light, sun barely above the horizon` | Very early, cold air |
| Household lamp | 2800 to 2900 K | Small hard-ish, steep falloff | From furniture height | `warm household lamp, steep falloff` | Domestic interior, evening |
| Studio tungsten | 3200 K | Controllable | Placed | `studio tungsten key` | Deliberate, professional |
| Golden hour | 2500 to 3500 K | Soft directional, low contrast | 0 to 6 degrees elevation | `golden hour, long warm shadows, cool skyfill` | Outdoors, first or last hour, 15 to 20 min in summer, 45 to 60+ in winter |
| Warm white fluorescent | 3000 K | Broad, flat | Overhead | `warm white fluorescent, green residual` | Institutional, office, shop |
| White fluorescent | 3500 K | Broad, flat | Overhead | `white fluorescent overhead` | Office, corridor |
| Cool white fluorescent | 4300 K | Broad, flat | Overhead | `cool white fluorescent, green ceiling bounce` | Office, hospital, retail |
| Flash tube | 5500 to 6000 K | Very hard, on-axis | Dead frontal | `direct on-camera flash` | Snapshot, party, night, phone or compact |
| Midday sun | 5400 K | Hard, small | 60 to 90 degrees overhead | `harsh midday sun, raccoon eye shadows` | Outdoors, middle of the day, no shade |
| Typical daylight (sun plus sky) | 6500 K | Mixed hard and soft | Directional plus ambient | `open daylight` | Outdoors, general |
| Window light close | 6500 K | Large soft | Side | `two feet from the window, gradient across the face` | Interior, near a window, daytime |
| Window light far | 6500 K | Soft, flat | Diffuse side | `flat window light from across the room` | Ordinary interior snapshot |
| Overcast | 6800 K | Very soft, huge source | Top-down, near omnidirectional | `overcast, near shadowless` | Outdoors, cloud cover |
| Hazy sky | 8000 K | Soft | Top-down | `hazy sky, cool and soft` | Outdoors, haze or high cloud |
| Open shade | 10,000 to 25,000 K | Very soft | From the open side and above | `open shade lit only by blue sky, strong cool cast` | Outdoors, in shadow, clear day |
| Blue hour | 10,000 K+ | Very soft ambient plus point sources | Omnidirectional plus artificial points | `blue hour, warm lights against deep blue` | Outdoors, 4 to 8 degrees below horizon |
| Mixed interior | 2800 K plus 6500 K plus 4300 K | Multiple | Multiple | `warm lamps, cool window, green overhead, all disagreeing` | **Real lived-in room. The strongest authenticity signal in this guide.** |
| Night street | not published for sodium/LED | Multiple small hard sources | Mostly overhead and behind | `several different artificial colour temperatures, steep falloff between lamps, grainy shadows` | Night, outdoors, urban |

---

## 10. Checklist before you commit a lighting description

1. Is there **more than one** color temperature in the frame? If it is an interior, there should be [distilled-photographic-craft.md].
2. Have you named a **falloff gradient direction**? Absence of a gradient is a strong tell [distilled-photographic-craft.md].
3. Have you named the **catchlight shape and size**, and does it match the source distance and geometry (big near source, small far source; rectangular for a window, band for overcast, dead-center point for on-axis flash)?
4. Do the **shadows all point consistently** with the source you named? Light direction and shadow geometry are both listed as still-unfixed model failures [distilled-photographic-craft.md].
5. Have you named a **residual color cast** that white balance did not fix?
6. Are the **shadows allowed to go dark and the highlights allowed to clip**, rather than everything being visible? Everything-visible is the phone HDR signature [distilled-photographic-craft.md].
7. Is there **luminance grain in the shadows with mild chroma mottling**? Perfectly clean shadows read as heavy noise reduction or as generation [distilled-photographic-craft.md].
8. Avoid the vendor-flagged polish words: *pristine, flawless, perfect, ultra-detailed, 8K, hyperdetailed, masterpiece*, and avoid words that imply studio staging unless you want that read [distilled-image-models.md].
