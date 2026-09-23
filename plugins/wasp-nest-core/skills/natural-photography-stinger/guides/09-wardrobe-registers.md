# Guide 09: Wardrobe Registers

## What this guide is for

Clothing is one of the highest-leverage realism controls in a generated photograph, and it is usually the least specified. A prompt that says "a woman in business casual" hands the model a label and gets back an averaged, showroom-clean garment that nobody has ever worn. This guide converts five social registers (home casual, casual public, business casual, professional, black tie) into concrete garment vocabulary, fabric behavior under light, and a wear-and-imperfection layer, so that a prompt describes a **specific outfit that has been on a specific body** rather than a category.

Two research findings make this load-bearing. First, **functional implausibilities** (objects that could not work as designed, "atypical buttons, buckles, garment prints") are the artifact class humans are *worst* at noticing, sitting at 64.1% detection accuracy with **32.8% of cases in the effectively invisible 40-60% band** and the largest accuracy gain from deliberate inspection at **+18%** [distilled-photographic-craft.md, section 1.1]. Garments are where those live. Second, **stylistic artifacts** include "excessive smoothness" and an "overly dramatic or picturesque quality" at 64.9% detection [distilled-photographic-craft.md, section 1.1], and the practitioner tell-list names an "idealized quality rather than authentic capture" where "nothing individually wrong" [distilled-photographic-craft.md, section 1.6]. Perfect clothing is exactly that idealized quality.

## Load this when

- The prompt includes a person and any part of their clothing is in frame (nearly always, including tight headshots where a collar, neckline or shoulder seam is visible).
- The scene has a social setting (office, restaurant, home, event) whose register the wardrobe needs to match, because a register mismatch is a **sociocultural implausibility**, the rarest artifact category in the corpus at roughly 5.5% of images and therefore the one a model is least trained to avoid [distilled-photographic-craft.md, section 1.1].
- The image needs to read as candid or vernacular rather than commercial, where the imperfection layer does most of the work.
- You are choosing a device and lighting condition and want the wardrobe to be consistent with them (see the cross-reference table in section 8).

---

## 1. Fabric behavior under light

This section is a prerequisite for all five registers. Fabric is a surface, and surfaces are described by how they split incoming light into a specular (surface bounce, carries the illuminant's colour) and a diffuse (body, carries the material's own colour) return, the same dichromatic split that governs skin [distilled-photographic-craft.md, section 7.1]. Fabrics differ mainly in how tight and how directional their specular lobe is.

| Fabric | Specular behavior | Drape | Wrinkle character | Texture at capture scale | Prompt language |
|---|---|---|---|---|---|
| **Cotton (poplin, oxford, twill)** | Broad, low-intensity sheen. Essentially matte. Under hard light it shows shading, not shine | Medium stiffness. Holds a shape but softens with wear. Oxford cloth stands away from the body, poplin follows it | Sharp-edged creases that stay. Elbow and lap creases persist all day | Visible weave at close range; oxford shows a basketweave grain, twill a diagonal | "matte cotton poplin with a soft sheen, sharp set-in creases at the elbow, visible weave texture" |
| **Linen** | Matte with occasional bright slubs where thick fibres catch light | Loose, heavy, falls in wide soft folds | **Wrinkles instantly and permanently.** Crumples across the lap and the back of the shoulder within minutes of sitting. This is the defining property | Irregular slubby weave, visibly uneven thread thickness | "rumpled linen, deep soft creases across the lap and shoulder, irregular slubby weave catching occasional highlights" |
| **Wool (suiting, flannel, gabardine)** | Soft directional sheen on worsted suiting; flannel is nearly matte with a fuzzy halo | Heavy, structured, hangs in long clean vertical lines. Tailoring is possible because wool holds shape | Resists wrinkling, then holds soft rolling creases (behind the knee, inside the elbow) rather than sharp ones | Worsted shows fine twill; flannel shows a raised nap that catches rim light as a fuzzy edge | "charcoal worsted wool with a soft directional sheen, clean vertical drape, soft rolling crease behind the knee" |
| **Denim** | Matte body with **bright specular high points on the raised warp**, especially where abraded | Stiff when new, softens and moulds to the body with wear | Permanent whiskering at the hip crease, honeycombing behind the knee, stacking at the ankle | Strong diagonal twill line, visible white weft under the indigo warp, fading concentrated at wear points | "worn indigo denim with whiskering at the hips, honeycomb creases behind the knee, faded high points on the twill, frayed hem" |
| **Silk** | **Tight, mobile specular lobe.** The highlight is a narrow band that moves as the fabric moves. Reads as liquid | Fluid, clings and pools. No structure of its own | Fine ripple wrinkles that never set. Creases appear and disappear as the wearer moves | Smooth at capture scale; the visual interest is entirely in the highlight geometry | "silk blouse with a narrow travelling highlight along the sleeve, fabric pooling softly at the elbow, fine ripple creases" |
| **Satin** | **The tightest specular of any common fabric.** Broad mirror-like sheen with a hard bright band and rapid falloff to near black in the folds. Massive local contrast | Heavy and fluid, falls in deep rounded folds | Shows every crease as a bright line against dark, so creases are maximally visible | Smooth, near mirror. Small light sources produce hard-edged highlights | "satin gown with a bright mirror band along the hip and deep shadowed folds, sharp specular edge where the fabric turns" |
| **Knit (jersey, rib, cable, cashmere)** | Matte with a soft fuzz halo. Rim light catches the surface fibres and produces a glowing outline | Soft, follows the body, sags under its own weight at the cuff and hem | Does not crease; it **stretches and bags** at the elbow, seat and knee | Visible stitch structure (rib columns, cable braids, jersey V-loops), plus surface pilling with age | "soft grey knit sweater with a fuzzy rim-lit edge, stitch texture visible, slight bagging at the elbows, faint pilling under the arm" |
| **Leather** | Broad glossy specular that follows the panel's curvature, with the highlight breaking at every seam and crease. Patent is nearly mirror | Heavy, structured, moves as panels rather than as cloth | Permanent creasing at the elbow, cuff and shoulder, which **darkens and lightens** as the finish wears at the fold | Visible grain, seams, stitching, edge burnishing | "worn black leather jacket, broad glossy highlights along the sleeve, permanent creases at the elbow lightened where the finish has rubbed" |

**Cross-fabric rules worth carrying into every prompt:**

- **Matte fabrics survive hard light; shiny fabrics do not.** Satin and silk under direct on-camera flash produce a blown mirror band, because "the side of the subject which receives all the light is also the side the camera sees" and the specular lobe fires straight back down the lens axis [distilled-photographic-craft.md, section 4.6]. If the prompt calls for satin plus direct flash, that hard hotspot is the correct render, not a mistake.
- **Fabric texture is a sacrificial detail in phone captures.** Over-aggressive noise reduction "compromises fine texture" [distilled-photographic-craft.md, section 2.5], and denoisers create the smeared watercolor look [distilled-photographic-craft.md, section 2.5]. A phone shot of a knit sweater in low light legitimately loses the stitch structure. An interchangeable-lens capture in good light should not.
- **Red garments break first under compression.** The Cr channel is subsampled most aggressively in YCbCr, so "red lips, red signage, red clothing show artifacts before anything else" [distilled-photographic-craft.md, section 5.4]. A red dress in a reposted JPEG legitimately shows blocky, muddy edges.
- **Garment prints and fasteners are the highest-risk elements.** "Atypical buttons, buckles, garment prints" are named functional implausibilities [distilled-photographic-craft.md, section 1.1], as is "text distortion / garbled glyphs." Prefer plain fabrics, describe fasteners concretely (four-hole horn button, single-prong brass buckle), and avoid legible text on clothing unless the prompt can be very specific.

---

## 2. Register 1: Home Casual

**Definition and social context.** What a person wears when no one outside the household is expected to see them. The organizing principle is comfort and thermal regulation, not presentation. Garments are often mismatched, often older than the wearer's public clothes, and frequently include one item that has been demoted from a higher register (an old work shirt, a dress shirt with a failed collar).

**Garment vocabulary.**
- Tops: heavy cotton crewneck sweatshirt, faded cotton t-shirt with a stretched neckline, oversized flannel shirt worn open, a knit cardigan with the cuffs pushed up, a thin thermal henley.
- Bottoms: cotton jersey sweatpants with a drawstring, knit joggers with elastic cuffs, plaid flannel pyjama bottoms, worn-soft cotton shorts, leggings.
- Layers: a robe over the whole thing, a zip hoodie left open, a blanket wrapped at the shoulders.
- Footwear: bare feet, thick socks (often mismatched, often with the heel worn thin), leather slippers with a crushed heel counter, rubber slides.
- Accessories: hair tied up with a fabric scrunchie or clipped back, glasses instead of contacts, a watch removed and sitting on the table rather than on the wrist.

**Wear and imperfection layer.** This is the register where imperfection is most abundant and most expected.
- Neckline of the t-shirt stretched and slightly wavy from repeated pulling.
- Pilling on the inner thighs of joggers and under the arms of the sweatshirt.
- A faded stain near the hem that has survived washing.
- Cuffs stretched out and no longer gripping the wrist.
- Sweatshirt hem riding up on one side where the wearer has been sitting on it.
- Drawstring pulled asymmetrically, one end long and one end retracted into the casing.
- The sock at the ankle slumped down, not pulled up.
- Static cling on the leggings, a lint patch on a dark knit.
- Hair genuinely disordered, not styled to look disordered.

**Setting pairings.** Kitchen at a counter, sofa with a laptop, unmade bed, the floor of a living room with a child or a pet, a back step, a laundry room, a bathroom mirror. The snapshot-aesthetic source names exactly this: "bare, unglamorous interiors replace formal studio settings" [distilled-photographic-craft.md, section 6.3].

**Shot types and lighting.** Close and mid-close candid, subject cropped by the frame edge, tilted horizon, "fragments of gestures and postures" rather than complete poses [distilled-photographic-craft.md, section 6.3]. Lighting is whatever the room has: a 2800 K household tungsten lamp [distilled-photographic-craft.md, section 4.1], a window at 6500 K with the person 2-4 ft from it giving a bright side of the face 2-3 stops over the shadow side and a background 3-4 stops down [distilled-photographic-craft.md, section 4.5], a 4300 K cool-white overhead fluorescent adding a green ceiling bounce off the blackbody locus [distilled-photographic-craft.md, section 4.3]. Direct on-camera flash is also idiomatic here, with its hard shadow line on the wall just behind and its rapid fall to a black background [distilled-photographic-craft.md, section 4.6].

**Prompt blocks.**

> **Variant A.** "A person sitting cross-legged on a sofa in a faded grey cotton sweatshirt with a stretched, slightly wavy neckline and visible pilling under the arms, plaid flannel pyjama bottoms, thick mismatched socks with one slumped at the ankle. Late-afternoon window light from the left, subject about three feet from the glass, bright side of the face roughly two stops over the shadow side, background falling three stops down. Warm interior cast, one coherent white balance, shadows allowed to go dark."

> **Variant B.** "Kitchen counter at night, a person in an oversized flannel shirt worn open over a thin thermal henley, cuffs pushed up unevenly, hair clipped back with strands escaping. Single 2800 K household tungsten lamp overhead, warm cast fully preserved, hard shading under the brow and chin, fine luminance grain in the shadows, mild chroma mottling, phone capture with lifted shadows and slightly over-sharpened edges."

---

## 3. Register 2: Casual Public

**Definition and social context.** Clothing chosen with the knowledge that strangers will see it, but with no institutional dress requirement. The wearer has made choices (colour, fit, a jacket) without those choices being obligatory. This is the largest and most heterogeneous register and the default for candid street work.

**Garment vocabulary.**
- Tops: plain cotton t-shirt with a set-in sleeve, long-sleeve striped tee, chambray or oxford shirt worn untucked, a merino crewneck, a hooded sweatshirt.
- Bottoms: straight or tapered denim jeans in a mid or dark indigo, chino trousers in stone or olive, a cotton twill skirt, corduroy trousers with visible wale.
- Layers: unlined cotton chore jacket, a denim trucker jacket, a quilted or down puffer with visible baffle seams, a wool overshirt, a rain shell with taped seams and a two-way zip.
- Footwear: canvas or leather sneakers with dirty midsoles and creased toe boxes, suede desert boots with a scuffed toe, worn leather boots with a rounded-off heel edge.
- Accessories: a canvas tote or a nylon backpack with one strap adjusted longer than the other, a knit beanie, a leather-strap watch with a worn buckle hole, a phone held or half out of a pocket, sunglasses pushed up into the hair.

**Wear and imperfection layer.**
- Denim whiskering at the hip crease and honeycombing behind the knee, with the fade concentrated on the raised twill high points.
- Sneaker midsoles greyed and scuffed, toe box creased in two or three permanent fold lines, laces of unequal tension.
- The t-shirt collar slightly rolled on one side rather than sitting flat.
- A jacket collar half tucked under itself at the back of the neck.
- One sleeve pushed up further than the other.
- A shirt hem hanging longer at the back where it has pulled out.
- Backpack strap webbing frayed at the adjuster.
- A small pull or snag in a knit; a pilling patch where the bag rubs the shoulder.
- Trouser hems stacked over the shoe rather than breaking cleanly.

**Setting pairings.** Sidewalk, transit platform, coffee shop, park, grocery aisle, parking lot, a stairwell, a doorway, a beach or trail. Any environment with unplanned elements, which the candid source says "contribute to authenticity rather than detracting from control" [distilled-photographic-craft.md, section 6.2].

**Shot types and lighting.** This register pairs with the two scene types that are hardest to detect: **portraits at 72.7% detection accuracy and candid groups at 73.4%**, versus posed groups at 76.2% and full body at 77.2% [distilled-photographic-craft.md, section 1.4]. Shoot single-subject or candid-group framing. Candid technique numbers: primes at **28-50 mm** on full frame, **35 mm f/2 on APS-C**, **24 mm equivalent** for wider environmental context, **f/2 or faster** for low light, **1/500 s or higher** to stay ready, and zone focusing pre-set to **8-10 feet (about 2.5-3 m)** at **f/8 to f/16** [distilled-photographic-craft.md, section 6.2]. Lighting is available light: golden hour at 2500-3500 K with shadows several times subject height and cyan skylight fill, midday at about 5400 K with short hard shadows and raccoon-eye sockets, or overcast at about 6800 K, near-shadowless with a large soft catchlight band [distilled-photographic-craft.md, section 4.4].

**Prompt blocks.**

> **Variant A.** "Street candid, a person in a worn indigo denim jacket over a plain white cotton t-shirt with the collar slightly rolled on one side, tapered jeans with whiskering at the hips and stacked hems, canvas sneakers with greyed midsoles and creased toe boxes. Shot at 35 mm from about nine feet, subject cropped at the frame edge, slightly tilted horizon. Golden hour, sun low at around three degrees elevation, warm 2900 K key from behind camera left, long shadow, cyan skylight fill in the shadow side."

> **Variant B.** "Overcast afternoon, a person waiting at a transit platform in a grey merino crewneck with faint pilling at the shoulder where a bag strap sits, olive chinos, scuffed suede boots. Entire sky as the source at about 6800 K, near-shadowless, very low contrast, faint top-down shading under the brow and chin, a single wide soft catchlight band in the eye. Phone capture, 24 mm equivalent, everything from half a metre to infinity in focus, fine luminance grain retained."

---

## 4. Register 3: Business Casual

**Definition and social context.** A workplace register with a floor but no ceiling: a collar or its equivalent is expected, a tie is not. The defining tension is that the wearer is dressed for an institution while trying to look at ease, which produces the characteristic half-measures (a blazer over a knit, dress trousers with sneakers, a shirt with no tie and the top button open).

**Garment vocabulary.**
- Tops: oxford cloth button-down in white or light blue, a poplin shirt with a spread collar and no tie, a fine-gauge merino crewneck or v-neck, a silk or crepe blouse, a knit polo.
- Bottoms: wool or wool-blend trousers with a flat front, dark denim without distressing, a chino in navy or stone, a midi skirt in ponte or wool crepe, tailored wide-leg trousers.
- Layers: an unstructured or half-lined blazer in wool hopsack or cotton twill, a cardigan, a quarter-zip merino, a soft shoulder sport coat with patch pockets.
- Footwear: leather derbies or loafers, clean minimal leather sneakers, low block-heel boots, flats.
- Accessories: a leather belt approximately matching the shoe leather, a slim watch on a leather or steel bracelet, a laptop bag or leather tote with a softened, slumping shape, a lanyard badge, small stud earrings.

**Wear and imperfection layer.** This register looks maintained but not new, which is the hardest thing to render and the most valuable.
- Shirt creases at the elbow and across the small of the back from sitting, sharpest on cotton poplin.
- The collar of a button-down not sitting perfectly symmetrical, one point slightly further forward than the other, one collar button undone.
- A blazer sleeve rucked slightly at the inner elbow.
- Blazer shoulder showing a faint horizontal press line from a hanger.
- Trouser knee with a soft rolled crease that has not fallen out since the wearer sat down.
- Loafer edges scuffed at the toe and the outer heel, the sole edge dressing worn through in one patch.
- Belt with the leather creased at the habitually used hole and the tip curling slightly.
- A shirt tail partly untucked at one hip.
- Lanyard twisted so the badge faces backwards.
- A faint pen mark on a shirt pocket, a coffee ring on a cuff.

**Setting pairings.** Open-plan office, a conference room with a glass wall, a co-working space, a hotel lobby, a coffee shop with a laptop, a lift lobby, a sidewalk outside an office building at the start or end of the day.

**Shot types and lighting.** Environmental portraits and mid shots. Office lighting is the most chromatically messy real condition and that is an asset: a real interior almost never sits at one Kelvin, so **2800-3000 K lamps plus a 6500 K window plus 4300 K overhead fluorescent in the same frame yields warm faces, blue window spill and green ceiling bounce** [distilled-photographic-craft.md, section 4.3]. Because fluorescent sits off the blackbody locus, a green/magenta cast survives auto white balance and "reads as real room" [distilled-photographic-craft.md, section 4.3]. Prefer 50 mm or 85 mm working distances (4-6 ft and 6-10 ft respectively) [distilled-photographic-craft.md, section 3.2].

**Prompt blocks.**

> **Variant A.** "A person at a desk in a light blue oxford cloth button-down with the top button open and one collar point sitting slightly further forward than the other, creases across the small of the back from sitting, sleeves rolled to just below the elbow at slightly different heights, flat-front wool trousers with a soft rolled crease at the knee. Mixed interior light: a 4300 K overhead fluorescent leaving a faint green cast that survives white balance, a 6500 K window behind giving cool spill on one shoulder, a 2900 K desk lamp warming the near cheek. 50 mm, camera about five feet away."

> **Variant B.** "Hotel lobby, a person standing in an unstructured navy wool hopsack blazer with a faint horizontal hanger press line at the shoulder and the inner elbow rucked, a fine merino crewneck underneath, dark denim, scuffed leather loafers with the sole edge dressing worn through at the toe. Large window light from camera right, subject about eight feet from the glass so the falloff across the frame is gentle, small catchlight, background nearly as bright as the subject. 85 mm from about eight feet."

---

## 5. Register 4: Professional

**Definition and social context.** Institutional formality where the clothing signals authority or client-facing seriousness: courts, senior client meetings, banking, medicine, formal interviews, boardrooms. The garments are tailored, the palette is narrow (navy, charcoal, grey, black, white, occasional muted colour), and the fit is the point: the register is legible mainly through cut and cloth quality, not through decoration.

**Garment vocabulary.**
- Suiting: a two-piece worsted wool suit in navy or charcoal, notch or peak lapel, two-button single-breasted or double-breasted, half-canvassed or fully canvassed with a soft roll to the lapel, side vents. A tailored skirt suit or trouser suit with a single-button jacket.
- Shirting: a white or pale blue poplin dress shirt with a spread or semi-spread collar, French cuffs or barrel cuffs, a placket that lies flat.
- Neckwear: a silk tie in a repp stripe, grenadine or small geometric, tied in a four-in-hand or half Windsor with a visible dimple below the knot; or no tie with a buttoned collar.
- Bottoms: matched suit trousers with a half break over the shoe, or a pencil skirt to the knee in the same cloth.
- Footwear: leather oxfords or derbies in black or dark brown, closed-toe leather pumps with a low or mid heel, both polished but showing wear.
- Accessories: a leather belt matching the shoe, a dress watch on a leather strap, a linen or silk pocket square folded flat or with a soft puff, a structured leather briefcase or a slim portfolio, minimal jewellery (a single ring, small earrings).

**Wear and imperfection layer.** **A professional outfit is not showroom-perfect and should never be rendered that way.** Real tailoring on a real body has these:
- The jacket collar lifting a few millimetres off the shirt collar at the back of the neck on one side.
- A soft crease running from the armhole across the chest where the arm has been raised.
- Sleeve rucking at the inner elbow after an hour of sitting.
- Trouser knees slightly bagged, the crease softened rather than knife-sharp.
- The tie knot pulled a fraction to one side, and the tie blade sitting slightly off centre over the placket rather than perfectly bisecting it.
- Shirt cuff riding up so that unequal amounts of cuff show at each wrist.
- A tiny gap where the top of the trouser waistband meets the shirt because the wearer has been sitting.
- Shoes polished on the uppers but scuffed at the heel edge and the toe box, with a visible crease across the vamp where the foot flexes.
- Lint or a stray hair on a dark shoulder, always present on navy and charcoal wool.
- Fine wool sheen showing wear polish at the seat and elbow on an older suit.
- A lapel that does not lie perfectly flat where the buttonhole side rolls.

**Setting pairings.** Boardroom, courthouse steps, a law or finance office, a hospital corridor, a conference stage, a hotel meeting room, a lift, a car door on a city street.

**Shot types and lighting.** This register lives in headshots and controlled environmental portraits. Working distances matter: **85 mm at 6-10 ft** gives "just enough compression to flatten out any weird distortions" while staying conversational; **135 mm at 10-15 ft or more** melts the background into "a creamy, abstract painting" but forces a shout across the room [distilled-photographic-craft.md, sections 3.2 and 3.6]. Distant and telephoto headshots are perceptually judged more "attractive, smart, strong" while close-up portraits read more "peaceful, approachable" [distilled-photographic-craft.md, section 3.6], which maps directly onto this register's intent. Lighting: a large soft key at 45 degrees with a controlled fill, or window light. Avoid the generic-office-background failure named in the corpus: stock backgrounds "blurry in inconsistent ways," background light sources not matching the subject light, gradients "that seem to fade into nowhere" [distilled-photographic-craft.md, section 1.6].

**Prompt blocks.**

> **Variant A.** "Corporate headshot, a person in a charcoal worsted wool two-button suit with a notch lapel, the jacket collar lifting slightly off the shirt collar on the left side, a white poplin shirt with a semi-spread collar, a navy grenadine tie with a visible dimple under the knot pulled a fraction off centre, a stray hair and faint lint on the dark shoulder. 85 mm at about eight feet, large softbox at 45 degrees camera left, controlled fill at roughly 3:1, a warm rim separating the shoulder from the background. Real optical shallow depth of field with a continuous blur ramp and matched grain in and out of focus."

> **Variant B.** "A person walking out of a building in a navy tailored trouser suit, single-button jacket, sleeve rucked at the inner elbow, trouser knees slightly bagged from sitting, closed-toe leather pumps polished on the uppers but scuffed at the heel edge. Overcast daylight at about 6800 K, near-shadowless, faint top-down shading, no catchlight shape except a broad soft band in the eye. 50 mm, candid framing, slight motion in the trailing hand."

---

## 6. Register 5: Black Tie

**Definition and social context.** The most codified register, where the rules are explicit and legible and where deviation is itself a statement. Evening events after six: galas, formal weddings, awards, opera openings, state dinners. The palette is nearly monochrome for classic menswear and open for gowns.

**Garment vocabulary.**
- Dinner jacket: black or midnight blue wool barathea, **peak lapel or shawl collar faced in silk (grosgrain or satin)**, single button, jetted pockets, **no vent or side vents**, matched trousers with a single silk braid down the outseam and **no belt loops**.
- Shirt: white cotton with a **marcella (piqué) or pleated bib**, turndown or wing collar, **double (French) cuffs** fastened with cufflinks, studs down the bib instead of buttons.
- Neckwear and waist: a **self-tie black silk bow tie** (a real one sits slightly asymmetric, which is the point), plus either a **cummerbund with the pleats facing up** or a low-cut **waistcoat**.
- Gowns: floor-length in silk crepe, satin, velvet, chiffon or heavily beaded tulle; bias-cut columns, A-line, or structured bodice with boning; a defined shoulder line (strapless, one-shoulder, halter, sleeved).
- Footwear: patent leather oxfords or opera pumps; satin or metallic leather heels, often with the sole scuffed from a dance floor.
- Accessories: cufflinks and shirt studs (mother of pearl, onyx), a silk pocket square, a slim dress watch or none at all, an evening clutch, drop earrings, a wrap or stole, opera-length gloves in the most formal cases.

**Wear and imperfection layer.** **Black tie is worn by people at events, not by mannequins in a window, and it must not be rendered showroom-perfect.** The characteristic imperfections:
- The self-tie bow slightly asymmetric, one wing a few millimetres larger, sitting a touch off level. A perfectly symmetrical bow reads as pre-tied and, at high formality, as fake.
- The bow tie rotated a few degrees from horizontal after an hour of talking.
- Shirt studs pulling slightly so the bib gaps a millimetre between two studs.
- A soft crease across the shirt bib where the wearer has been sitting.
- The cummerbund riding up slightly at the back, or a waistcoat point lifting off the trouser.
- Silk lapel facings showing a directional sheen change where they have been crushed against a seat back.
- Patent leather scuffed at the toe and dulled at the heel edge, with a fine crease across the vamp.
- **On a gown:** satin creased horizontally across the lap from sitting, the hem picking up dust or a mark from the floor, a hem thread pulled, a strap slipped fractionally down one shoulder, a fastening at the back not perfectly aligned, the sole of the heel scuffed.
- Makeup and hair at hour four rather than hour zero: a strand escaping, a slight shine on the forehead, lipstick softened at the inner edge.
- A drink held, condensation on the glass, a hand mark on the stem.

**Setting pairings.** Ballroom, hotel bar, marquee, theatre foyer, a stair landing, outside a venue at night, a car door, a dance floor, a table with cleared plates and folded napkins.

**Shot types and lighting.** Event photography is dominated by two conditions and both are idiomatic.
- **Direct on-camera or bracket flash**, which produces the "deer in the headlights" look with the lit side being the seen side, "shadows that are barely visible," a subject that looks less three-dimensional, hard localized texture emphasis on skin, a **hard shadow line on any wall close behind**, and rapid falloff to black where nothing is close behind (a subject at 6 ft with a wall at 12 ft puts the wall 2 stops down, at 18 ft about 3.2 stops down) [distilled-photographic-craft.md, sections 4.6]. Flash tubes run about **5500-6000 K**, giving a slight blue-white cast against a warm room [distilled-photographic-craft.md, section 4.6]. Red-eye or a bright on-axis catchlight dead centre in each pupil belongs here.
- **Warm tungsten ambience** at 2800-3200 K from chandeliers and practicals, mixed with cooler spill.

Satin and silk under flash produce hard blown specular bands, which is correct rather than a defect (see section 1). Prefer portrait or candid-group framing over posed-group lineups, which carry a detection penalty (76.2% versus 72.7% and 73.4%) [distilled-photographic-craft.md, section 1.4].

**Prompt blocks.**

> **Variant A.** "A person at a gala in a midnight blue dinner jacket with a shawl collar faced in grosgrain silk, a self-tie black bow tie sitting slightly asymmetric and a few degrees off level, a marcella-bib shirt with onyx studs and a soft crease across the bib from sitting, patent leather oxfords scuffed at the toe. Direct on-camera flash: flat frontal light, a hard-edged shadow line on the wall about four feet behind, specular hotspots on the forehead and nose, background falling rapidly to black, a bright on-axis catchlight centred in each pupil, slight blue-white flash cast at 5500 K against the warm 2900 K room."

> **Variant B.** "A person on a stair landing in a bias-cut ivory satin gown, a bright mirror band of highlight running along the hip and deep shadowed folds where the fabric turns, horizontal creases across the lap from sitting, one strap slipped fractionally down the shoulder, hem picking up floor dust, heel sole scuffed. Warm chandelier tungsten at about 2900 K from above and behind, a large soft bounce filling from the front, gentle falloff into the corridor, fine grain retained in the shadows, highlights on the satin allowed to clip."

---

## 7. Universal imperfection principle

Across all five registers, the same rule applies and it is worth stating separately because it is the single most common failure in generated wardrobe.

**Real clothing records the body that has been inside it.** Creases form where a body bends: the inner elbow, behind the knee, across the lap and the small of the back from sitting, at the hip crease from walking, at the shoulder from a bag strap. Fabric bags where it has been stretched: elbows, seat, knees. Surfaces abrade where they contact the world: shoe toes and heel edges, cuff edges, bag strap contact points, belt holes. Fastenings drift out of alignment. Collars roll. Hems ride.

The generative default is a garment with no history: symmetric, smooth, aligned, unabraded. That default is the "idealized quality rather than authentic capture" tell where "nothing individually wrong" [distilled-photographic-craft.md, section 1.6], and it is why an otherwise excellent render still reads as synthetic. **Write at least three specific, located imperfections into every wardrobe description**, and locate each one anatomically (which elbow, which hip, which shoe edge) rather than generically.

Note also the failure mode on the other side: **excessive** distress reads as costume. Aim for the wear a garment accumulates in its natural service life at that register, one week for home casual, two years for a suit, one evening for black tie.

---

## 8. Cross-reference table

| Register | Typical setting | Typical shot type | Typical lighting | Typical device |
|---|---|---|---|---|
| **Home casual** | Kitchen, sofa, bed, back step, laundry room, bathroom mirror | Close and mid-close candid, cropped by the frame edge, tilted horizon, fragment of a gesture rather than a full pose | Household tungsten 2800 K, window at 6500 K with the subject 2-4 ft away (2-3 stop face gradient, background 3-4 stops down), 4300 K overhead fluorescent with green cast, direct on-camera flash at night | **Phone.** 24-26 mm equivalent main camera, full-frame-equivalent aperture around f/6.8-f/8.2 so the whole room is in focus, lifted shadows, semantic face brightening, watercolor shadow texture |
| **Casual public** | Sidewalk, transit, coffee shop, park, parking lot, trail | Single-subject portrait (72.7% detection, most photorealistic) or candid group (73.4%); avoid posed-group lineups (76.2%) and full body (77.2%) | Golden hour 2500-3500 K with long shadows and cyan skylight fill; midday 5400 K with hard short shadows and raccoon-eye sockets; overcast 6800 K near-shadowless | **Either.** Phone at 24 mm equivalent for the vernacular read, or interchangeable-lens 28-50 mm prime at f/2 or faster, 1/500 s, zone focused at 8-10 ft |
| **Business casual** | Open-plan office, conference room, co-working space, hotel lobby, lift lobby | Environmental portrait and mid shot, 50 mm at 4-6 ft or 85 mm at 6-10 ft | Mixed interior: 2800-3000 K lamps plus 6500 K window plus 4300 K fluorescent in one frame, giving warm faces, blue window spill, green ceiling bounce, with an off-locus green tint surviving auto white balance | **Interchangeable-lens** for a commissioned frame, **phone** for a candid desk shot. Both plausible; pick one and keep the depth-of-field behavior consistent with it |
| **Professional** | Boardroom, courthouse, law or finance office, hospital corridor, conference stage | Headshot and controlled environmental portrait, 85 mm at 6-10 ft (compression without aloofness) or 135 mm at 10-15+ ft (background melts, reads more "attractive, smart, strong") | Large soft key at 45 degrees with controlled fill; or window light at 8-10 ft for the even low-contrast interior look; avoid the generic blurred-office background failure | **Interchangeable-lens.** This register is where real optical depth of field is expected: continuous blur ramp, bright saturated specular discs, cat's-eye squashing near the corners, matched grain in and out of focus, foreground blur as well as background |
| **Black tie** | Ballroom, hotel bar, theatre foyer, stair landing, marquee, outside a venue at night | Portrait and candid group; half and three-quarter length to show the garment; avoid posed lineups | Direct or bracket flash at 5500-6000 K against a 2800-3200 K room, hard shadow line on a close wall, rapid falloff to black, on-axis catchlight; or warm chandelier tungsten with soft bounce fill | **Either, and the choice is expressive.** Press or event photographer: interchangeable-lens with bracket flash. Guest snapshot: phone with direct flash, hard hotspots on satin, red-eye, black background |

---

## 9. Fast checklist

1. Have you named the **register**, then replaced the label with at least four **specific garments** (fabric, cut, colour)?
2. Is each fabric's **light behavior** consistent with the lighting you specified (matte fabrics under hard light, shiny fabrics producing hard specular bands under flash)?
3. Have you written at least **three located imperfections**, each anatomically placed?
4. Is the professional or black tie outfit **explicitly not showroom-perfect**?
5. Does the **setting** match the register, so you do not create a sociocultural implausibility?
6. Does the **shot type** favour single-subject portrait or candid group over posed lineups and full body?
7. Does the **device** in the cross-reference table match the depth-of-field, grain and tone-mapping behavior described elsewhere in the prompt?
8. Have you avoided **legible text and unusual fasteners** on garments, or described them concretely enough to survive scrutiny?
