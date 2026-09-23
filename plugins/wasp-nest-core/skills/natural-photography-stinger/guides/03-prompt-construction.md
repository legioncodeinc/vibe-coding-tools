# Guide 03: Prompt Construction

**What this guide is for.** This is the canonical procedure for assembling an image-generation prompt that reads as a real photograph, on either OpenAI GPT Image (`gpt-image-2`) or Google Nano Banana Pro (`gemini-3-pro-image`). It reconciles two vendor doctrines that superficially conflict (OpenAI wants labeled segments, Google wants a narrative paragraph) into one slot model that satisfies both, gives you a fill-in-the-blank prompt block, three complete worked examples at different registers, the multi-image referencing rules and per-platform limits, the exclusion patterns that substitute for the negative-prompt syntax neither platform has, the anti-drift procedure for iterative edits, and the plan-then-generate workflow using a reasoning model as the shot planner.

**Load this when:** you are about to write or revise the actual prompt string, choose between platforms for a given prompt shape, wire up reference images, run an iterative edit, or build a reasoning-model planner that emits prompts.

Companion guide: `04-authenticity-imperfection.md` supplies the imperfection vocabulary that fills SLOT 7 and SLOT 8 below. This guide gives the skeleton; that one gives the grit.

---

## 1. The two vendor doctrines, side by side

| Axis | OpenAI GPT Image | Google Nano Banana Pro |
|---|---|---|
| Canonical order | **background/scene -> subject -> key details -> constraints** [distilled-image-models.md] | **shot type -> subject -> action -> environment -> lighting -> mood -> camera/lens details -> aspect ratio** (eight documented slots) [distilled-image-models.md] |
| Prose shape | "For complex requests, [use] short labeled segments or line breaks instead of one long paragraph" [distilled-image-models.md] | "Describe the scene, don't just list keywords." The model "excels with a narrative, descriptive paragraph" rather than disconnected terms [distilled-image-models.md] |
| Prompt length cap | **32,000 chars** on GPT image models (`/v1/images/edits` states **1 to 32000 characters**). DALL-E 2 was 1,000; DALL-E 3 was 4,000 [distilled-image-models.md] | No documented character cap. Practitioner report: "tolerates long, detailed prompts with precise adherence" [distilled-image-models.md] |
| Intended-use declaration | Include the intended use (ad, UI mock, infographic) "so the model infers the right polish level" [distilled-image-models.md] | Not documented as a slot |
| Photorealism switch | **No `style` parameter exists for GPT image models**; photorealism must be carried by prompt text [distilled-image-models.md] | Carried by the verbatim photorealism template, below |
| Syntax extras | "There are no weights, no `::` emphasis, no `--no` negatives" [distilled-image-models.md] | No `seed`, no negative prompt, no CFG-style control appears in Google docs or the Replicate schema [distilled-image-models.md] |
| Aspect ratio | `size` param; practitioner rule: "model composition improves when aspect is both flagged and mentioned in prose" [distilled-image-models.md] | Slot 8 of the eight; enum `1:1`, `3:2`, `2:3`, `3:4`, `4:3`, `4:5`, `5:4`, `9:16`, `16:9`, `21:9` [distilled-image-models.md] |

### 1.1 Google's photorealism template (VERBATIM, do not paraphrase the shape)

```
A photorealistic [type of shot] of a [subject description] in a [setting
description]. [Description of the light]. Shot from a [camera angle]
with a [lens type].
```
[distilled-image-models.md]

Google's own guidance for it: "use photography terms, camera angles, lens types, lighting, and fine details, to steer the model toward a photorealistic result" [distilled-image-models.md].

### 1.2 The apparent conflict is not a conflict

OpenAI prescribes **structure**; the practitioner corroboration says "Any format works; consistency matters more" and "For production, prefer a skimmable template over clever syntax" [distilled-image-models.md]. Google prescribes **descriptive density** (narrative sentences, not keyword lists). Both are satisfied by labeled segments whose values are written as full descriptive sentences rather than comma-separated tags. That is the unified slot model.

---

## 2. The unified slot model

Twelve slots. Order is OpenAI's canonical order with Google's eight folded in. Every slot value is a **sentence or clause**, never a bare tag list.

| # | Slot | Fills OpenAI order position | Fills Google slot | Required? |
|---|---|---|---|---|
| 1 | `INTENT` | constraints (declared up front) | n/a | Recommended |
| 2 | `MEDIUM` | (trigger vocabulary) | prefix of the template | **Required** |
| 3 | `SHOT` | key details | 1 shot type | **Required** |
| 4 | `SCENE` | **background/scene (first)** | 4 environment | **Required** |
| 5 | `SUBJECT` | **subject (second)** | 2 subject | **Required** |
| 6 | `ACTION` | subject | 3 action | **Required** for candid |
| 7 | `LIGHT` | key details | 5 lighting | **Required** |
| 8 | `OPTICS` | key details | 7 camera/lens | **Required** |
| 9 | `IMPERFECTION` | key details | (none; Google has no slot for this) | **Required** for realism |
| 10 | `MOOD` | key details | 6 mood | Optional |
| 11 | `FRAMING` | constraints | 8 aspect ratio | **Required** |
| 12 | `EXCLUDE` | constraints | n/a | Recommended |

**Ordering rule:** write SCENE before SUBJECT. OpenAI's canonical order is explicitly background/scene first [distilled-image-models.md]. Google's order puts subject second after shot type, which is compatible: SHOT, SCENE, SUBJECT satisfies both if SHOT is a one-clause header.

**Subject hierarchy rule:** "Complex scenes work best when one subject is clearly primary" [distilled-image-models.md]. If you have two people, name which one the frame is about.

---

## 3. Trigger vocabulary: the words that measurably engage photorealistic mode

### 3.1 The literal trigger words (use them verbatim)

| Trigger phrase | Status | Source |
|---|---|---|
| **"photorealistic"** | "include the word 'photorealistic' directly in the prompt to **strongly engage the model's photorealistic mode**" | [distilled-image-models.md] |
| **"real photograph"** | Named helpful variant | [distilled-image-models.md] |
| **"taken on a real camera"** | Named helpful variant | [distilled-image-models.md] |
| **"professional photography"** | Named helpful variant (use only for the professional register) | [distilled-image-models.md] |
| **"iPhone photo"** | Named helpful variant (use for the phone register) | [distilled-image-models.md] |

Adjacent framing rule, official: **"Prompt the model as if a real photo is being captured in the moment."** [distilled-image-models.md] Write the prompt in the present tense of a capture that is happening, not as a description of a picture that exists.

### 3.2 The counter-finding: optics beat adjectives

Sharpest primary-source statement: **"Composition terms (lens, aperture feel, lighting) often steer realism more reliably than generic 'ultra-detailed'"** [distilled-image-models.md].

Two calibrations that come with it:
- The guide's own hedge is **"aperture feel"**, an admission that the model approximates the *look* of an aperture rather than simulating it [distilled-image-models.md].
- Camera specs "may be interpreted loosely, so use them mainly for high-level look and composition" [distilled-image-models.md]. Do not expect a stated f-number to produce physically correct depth of field; expect it to select a look.

**Operational consequence.** Spend your prompt budget on SLOT 8 (`OPTICS`) and SLOT 7 (`LIGHT`), not on stacking quality adjectives. "Shot on a 24 mm phone main camera at arm's length, everything from the near shoulder to the far wall in focus" outperforms "ultra-detailed, 8K, masterpiece" and the second phrasing actively hurts (see the anti-pattern list in `04-authenticity-imperfection.md`).

**Explicitly forbidden vocabulary, named by the vendor:** "Avoid words that imply studio polish or staging." The named offenders are *pristine, flawless, perfect, ultra-detailed, 8K, hyperdetailed, masterpiece* [distilled-image-models.md].

---

## 4. The prompt block template

Copy this whole block. Delete slots you genuinely do not need. Keep the labels: they satisfy OpenAI's labeled-segments rule and cost Google nothing.

```
INTENT: [what this image is for and what polish level that implies, e.g.
"a personal text-message snapshot, not an advertisement"]

MEDIUM: A photorealistic [real photograph | iPhone photo | candid photograph
taken on a real camera], captured in the moment.

SHOT: [wide-angle shot | close-up | portrait | macro shot | three-quarter
head-and-shoulders], shot from [eye level | a low perspective | an elevated
45-degree angle], [handheld | on a tripod].

SCENE: [the environment first, in full sentences: the room or location, the
surfaces, the depth behind the subject, what is cluttering the background,
what light sources are visible in frame].

SUBJECT: [one primary subject, described concretely: age band, build, hair,
clothing with material named, posture. Name who is primary if more than one
person is present].

ACTION: [what the subject is doing at this exact instant, mid-gesture, not a
completed pose].

LIGHT: [the named source or sources with color temperature or quality, the
direction, the falloff across the frame, the shadow behavior, the catchlight
shape].

OPTICS: [effective focal length and working distance, aperture feel, what is
in and out of focus, and which real optical artifacts are present].

IMPERFECTION: [pull from guide 04: skin texture, asymmetry, motion, focus,
highlight, noise, framing accidents].

MOOD: [one clause, emotional register only].

FRAMING: [aspect ratio in prose] framing, [what is cropped by the frame edge],
[where the subject sits in the frame].

EXCLUDE: No [watermark], no [text or logos], no [studio backdrop], no
[retouching or skin smoothing].
```

**Slot-order note for Google.** If you want the Google template shape literally, collapse SHOT, SUBJECT, SCENE, LIGHT and OPTICS into the template's five positions and keep IMPERFECTION and EXCLUDE as trailing sentences. The eight-slot checklist is "the checklist behind the one-line template in the API docs" [distilled-image-models.md], so the labeled form is the same content.

---

## 5. Three complete worked examples

### 5.1 Register A: phone selfie (arm's length, front camera)

```
INTENT: A personal selfie for a group chat. Not an advertisement, not a
headshot. Casual polish level.
MEDIUM: A photorealistic iPhone photo, front camera, captured in the moment.
SHOT: Close-up self-portrait, camera held at arm's length roughly 60 cm from
the face and slightly above eye level, tilted a few degrees off horizontal.
SCENE: A cramped apartment kitchen at night. Behind her, an open cabinet with
mismatched mugs, a dish rack with plates still wet, a magnetic knife strip, a
takeaway container on the counter. A warm 2800 K ceiling bulb is the only
overhead source; a phone screen glow and a cool 6500 K streetlight through the
window on the left add two more color temperatures to the frame.
SUBJECT: A woman in her early thirties, dark curly hair pulled back with
strands escaping at the temples, wearing a washed-out cotton t-shirt with a
visible neckline stretch. She is the only person in frame.
ACTION: Mid-laugh, mouth open asymmetrically, head turned slightly away from
the lens, one shoulder rising toward the camera.
LIGHT: Top-down warm household tungsten with a hard falloff, so her forehead
and the bridge of her nose are the brightest points and her eye sockets fall
into shadow. Cool blue window spill on the left cheek that the white balance
has not reconciled with the warm key: warm face, cyan edge. Small bright
catchlight in each eye from the overhead bulb.
OPTICS: The 24 mm equivalent front camera at close range, so her nose reads
noticeably larger relative to her ears and the frame edges stretch. Deep
depth of field: the kitchen behind her is nearly as sharp as her face, with
only a soft loss of detail at the far wall.
IMPERFECTION: Visible skin pores across the nose and cheeks, a small blemish
on the chin, uneven skin tone with redness around the nostrils, fine flyaway
hairs breaking the hairline silhouette, slight motion blur on the near hand,
one eye slightly more closed than the other, luminance grain in the shadowed
side of the face and mild color mottling in the dark cabinet interior.
MOOD: Unguarded, mid-conversation.
FRAMING: Vertical 3:4 framing. The top of her head is cut off by the frame
edge and her right shoulder runs out of frame. She sits off-center to the
left.
EXCLUDE: No watermark, no text overlay, no beauty filter, no skin smoothing,
no studio lighting, no bokeh behind her.
```

### 5.2 Register B: candid third-party phone shot (someone else took it)

```
INTENT: A photo a friend took and sent over, later reposted. Snapshot polish
level, not a portfolio image.
MEDIUM: A photorealistic candid photograph taken on a real camera phone,
captured in the moment, unposed.
SHOT: Medium shot from waist up, shot from roughly 2.5 m away at chest height,
handheld, horizon tilted about three degrees.
SCENE: A crowded backyard barbecue in late afternoon. Folding chairs, a cooler
with the lid open, a paper plate on a plastic table, string lights not yet
switched on, a fence and neighbouring roofline behind. Two other people are
partly visible at the frame edges, one cut in half by the crop.
SUBJECT: A man in his forties in a faded polo shirt, primary subject, centered
slightly right. The two background figures are secondary and out of focus only
by distance, not by lens.
ACTION: Turning toward something off-frame while still holding a plate,
caught between expressions, mouth half open, one hand blurred by the movement.
LIGHT: Low golden-hour sun at about 2800 K raking in from frame left, casting
a long shadow across the grass several times his height, with cool blue sky
fill on the shadow side of his face. Highlight on his forehead is just
clipping to white. Reduced contrast versus midday.
OPTICS: 26 mm equivalent phone main camera, which renders depth of field like
a full-frame lens at roughly f/8: the whole yard is effectively sharp from a
metre to the fence. Slight veiling flare lifting the blacks on the sunward
side of the frame. Faint cyan and magenta fringing in the top corners only,
absent at the center.
IMPERFECTION: The subject is mid-blink on one eye, his shirt collar is folded
under, there is a hard clipped highlight on the cooler lid, the focus has
landed on his shoulder rather than his eyes, the background is cluttered and
unarranged, and fine luminance grain is present evenly across both the sharp
and the soft parts of the frame.
MOOD: Ordinary, unremarkable, mid-afternoon.
FRAMING: Horizontal 4:3 framing. A stranger's arm enters from the right edge
and is cut off. The subject is not on a rule-of-thirds line.
EXCLUDE: No watermark, no text, no professional lighting, no shallow depth of
field, no arranged background, no color grading.
```

### 5.3 Register C: professional headshot (the one case where polish is correct)

```
INTENT: A corporate headshot for a company directory page. Professional polish
level, but a real photographic capture, not a render.
MEDIUM: A photorealistic professional photography headshot, taken on a real
camera.
SHOT: Head-and-shoulders portrait, eye-level camera, subject at roughly 2.5 m
from the lens.
SCENE: A real office interior well behind the subject, at least four metres
back: a glass partition, a corridor, a fire exit sign, a plant. The background
is genuinely distant, not a backdrop.
SUBJECT: A man in his fifties, deep skin tone, close-cropped grey-flecked
hair, wearing an unpressed navy blazer over an open-collar shirt with visible
weave in the fabric.
ACTION: Settling into position between two frames, weight on one foot, a small
genuine smile just beginning.
LIGHT: A large softbox key at 45 degrees camera left and slightly above eye
line, close enough that the near cheek is visibly brighter than the far cheek
across the face. Deliberately low fill so the shadow side keeps its density
and the face keeps its shape. A hair light from behind camera right separating
him from the dark corridor. Exposure placed for the diffuse skin return, not
for the speculars, so the highlights on the forehead and cheekbones stay
controlled rather than blowing out. Large rectangular softbox catchlight in
each eye.
OPTICS: An 85 mm lens at about 2.5 m working distance, so the facial planes
read flat and the nose-to-ear proportion is normalized. Aperture feel around
f/2: the background is softly separated but you can still tell it is an
office. Continuous blur ramp increasing with distance, not a single step.
Slight optical vignetting darkening the corners, and cat's-eye squashing of
the out-of-focus highlights toward the frame corners.
IMPERFECTION: Visible skin pores and fine lines around the eyes, a small
razor nick on the jaw, one eyebrow sitting slightly higher than the other,
the blazer shoulder not perfectly aligned, a single stray thread on the lapel,
and fine luminance grain present at the same level in both the sharp face and
the blurred background.
MOOD: Composed, approachable.
FRAMING: Vertical 4:5 framing. Head near the top third, small amount of
headroom, shoulders cut by the bottom edge.
EXCLUDE: No watermark, no company logo, no seamless studio backdrop, no skin
retouching, no teeth whitening, no HDR halo around the head.
```

---

## 6. Referencing multiple input images

### 6.1 The universal rule

"Reference each input by **index and description**" (for example, "Image 1: product photo..."); describe how they interact ("apply Image 2's style to Image 1"); when compositing "be explicit about which elements move where" [distilled-image-models.md].

Before using the manifest, run the CASE B gate for the model. References may
be `visual-only` (including consented platform derivatives with no EXIF) or
`capture-backed`. They guide likeness only. Do not describe a visual-only
file as an original capture, infer a camera from it, or copy its metadata into
the generated output.

Write it as an explicit manifest block above the slot block:

```
INPUTS:
Image 1: reference photograph of the subject's face and hair, front lit.
Image 2: reference photograph of the same subject in three-quarter profile.
Image 3: the garment to be worn, laid flat on a table.
Image 4: the room this photograph is taken in, empty.

COMPOSITION INSTRUCTION: Place the person from Image 1 and Image 2 into the
room from Image 4, wearing the garment from Image 3. Keep the face, hair,
skin texture and body proportions from Image 1 and Image 2 exactly. Fit the
garment from Image 3 naturally to the pose with realistic fabric behavior and
matching shadows. Use the existing light direction of Image 4.
```

### 6.2 Per-platform limits (they differ, and they differ by category)

| Platform / model | Limit | Notes |
|---|---|---|
| OpenAI `/v1/images/edits` (GPT image models) | **Up to 16 images**, each **max 20971520 bytes (20 MiB)** | Each as `file_id` or `image_url` (fully qualified URL or base64 data URL). **No "reference strength" or IP-Adapter-style weight parameter exists** [distilled-image-models.md] |
| OpenAI Responses API | Multiple reference images supported simultaneously in a single request | URLs, base64 data URLs (`data:image/png;base64,{encoded}`), or Files API IDs with purpose `"vision"` [distilled-image-models.md] |
| `gemini-3-pro-image` (Nano Banana Pro) | **6 objects / 5 characters / 3 style references**, and **up to 14 images total** as inputs | The three caps are per-category; 14 is the total input budget. Consistency maintained for "up to 5 people" [distilled-image-models.md] |
| `gemini-3.1-flash-image` | **10 objects / 4 characters / no style references** | [distilled-image-models.md] |
| `gemini-3.1-flash-lite-image` | **14 objects / no characters / no style references** | [distilled-image-models.md] |
| Replicate `google/nano-banana-pro` | `image_input` array, "supports up to 14 images" | Output is **a single image URI string, not an array** [distilled-image-models.md] |

### 6.3 The fidelity-knob trap

`input_fidelity` (`"high"` preserves fine detail, faces, logos and texture; `"low"` re-imagines more of the frame) is **disabled on `gpt-image-2`**: "Disabled. `input_fidelity` does not work for this model because output is already high fidelity by default" [distilled-image-models.md]. It works only on `gpt-image-1.5`, `gpt-image-1` and `gpt-image-1-mini`, all of which shut down **2026-12-01** [distilled-image-models.md].

**Consequence for prompt construction:** after that date, reference fidelity is carried **entirely** by multi-image inputs plus explicit preserve-list prompting [distilled-image-models.md]. Write the preserve list as if the parameter never existed. It is the durable technique.

---

## 7. Exclusions: there is no negative-prompt syntax on either platform

**The finding, stated plainly.** "The guide does not document any negative-prompt or exclusion syntax (no `--no`, no weights, no parentheses emphasis). Exclusions are plain English sentences inside the prompt." [distilled-image-models.md] Corroborated: "There are no weights, no `::` emphasis, no `--no` negatives" [distilled-image-models.md]. On the Google side, "no `seed`, no negative prompt, no CFG-style control appears in either the Google docs or the Replicate schema" [distilled-image-models.md].

**What the vendor actually prescribes:** "State exclusions and invariants explicitly (e.g., 'no watermark,' 'no extra text')" and "'no watermark,' 'no logos/trademarks'" [distilled-image-models.md].

### 7.1 Exclusion patterns that work

| Pattern | Template | Use for |
|---|---|---|
| Flat negation | `No [thing].` | Watermarks, text, logos, borders |
| Positive substitution (strongest) | `The background is [X], not [Y].` | Replacing an unwanted default with a wanted one |
| Invariant assertion | `[Property] stays [value] across the whole frame.` | Light direction, white balance, grain level |
| Absence-as-description | `There is no [thing] anywhere in the frame.` | Studio backdrops, lens flare when unwanted |
| Process negation | `This image has not been [retouched / color graded / smoothed].` | The plastic failure mode |

**Prefer positive substitution.** "The background is a cluttered real kitchen, not a seamless studio backdrop" gives the model a target; "no studio backdrop" only gives it a prohibition. Reserve flat negation for things that have no substitute (watermarks, text).

**Consolidate exclusions into one trailing `EXCLUDE:` line.** Scattering negations through the prose competes with the descriptive content the model is actually good at following.

---

## 8. Edit drift and its mitigation

### 8.1 The two rules, verbatim

1. **The change-only formula.** Use **"change only X" plus "keep everything else the same"** [distilled-image-models.md]. Google's inpainting template is the same idiom: "Using the provided image, change only the [specific element] to [new element/description]. Keep everything else in the image exactly the same, preserving the original style, lighting, and composition." [distilled-image-models.md] This is a cross-vendor portable idiom.

2. **The repeat rule.** **"Repeat the preserve list on each iteration to reduce drift."** [distilled-image-models.md] Not once at the start. Every single iteration, in full.

### 8.2 The preserve-list procedure

**Step 1.** After the first acceptable generation, write the preserve list once and store it. Documented locks for identity work: "Explicitly lock the person (face, body shape, pose, hair, expression)" and, on precision edits, preserve "camera angle, lighting, shadows, and surrounding context" [distilled-image-models.md].

**Step 2.** Every subsequent call uses this exact shape:

```
Change only: [the single thing].

Keep everything else in the image exactly the same. Preserve, unchanged:
- her face, facial proportions and identity
- her body shape and current pose
- her hair, including the flyaway strands at the temples
- her expression
- the camera angle and working distance
- the light direction, color temperature and shadow geometry
- the background and all objects in it
- the grain level and the depth of field
```

**Step 3.** Requirements that make the change integrate: require "realistic fabric behavior" and matching shadows for garment swaps [distilled-image-models.md].

**Step 4.** One change per call. "Start with a clean base prompt, then refine with small, single-change follow-ups" [distilled-image-models.md]. Batching two changes into one call multiplies drift surface.

### 8.3 Session mechanics

| Platform | Mechanism |
|---|---|
| OpenAI Responses API | Multi-turn iterative editing via `previous_response_id`, or by including prior image-generation call outputs in the context array [distilled-image-models.md] |
| OpenAI Responses tool shape | `{ type: "image_generation", action: "auto\|generate\|edit", partial_images: number }`. Force `action: "edit"` when you mean an edit rather than letting `"auto"` decide [distilled-image-models.md] |
| Google | Conversational iteration via `previous_interaction_id` [distilled-image-models.md] |
| Google inpainting | **Semantic masking, no mask file required, describe the region** [distilled-image-models.md] |
| OpenAI inpainting | Alpha mask file: **transparent regions of the mask mark the editable area** (opaque = preserve) [distilled-image-models.md] |

**Do not re-generate when a surgical edit will do.** Named on the vendor's what-to-avoid list: "re-generating entire scenes when surgical edits suffice" [distilled-image-models.md].

---

## 9. Plan-then-generate: using a reasoning model as the shot planner

### 9.1 What this is, and what it is not

The legitimate workflow is the documented **"Thinking mode"** pattern: a reasoning model plans and writes the prompt, then calls the image model. **It is a pipeline, not a product name** [distilled-image-models.md]. OpenAI's launch post cites "Thinking mode for richer workflows", meaning "integration with reasoning models so image generation can be planned in context before rendering" [distilled-image-models.md].

For the record, so you do not chase it: **`gpt-5.6-sol` is a text-only reasoning model. Output: text only. It does NOT generate images.** There is no `gpt-5.6-sol-ultra`; the `reasoning.effort` enum is `none`, `low`, `medium` (default), `high`, `xhigh`, `max`, with **no level called "ultra"** [distilled-image-models.md].

### 9.2 The pipeline

| Step | Action | Setting |
|---|---|---|
| 1 | Reasoning model receives the user's intent plus guides 03 and 04 | `reasoning.effort` at `high`, `xhigh` or `max` for shot planning [distilled-image-models.md] |
| 2 | Planner emits a filled slot block (section 4) as **literal text**, not a description of one | |
| 3 | Slot block is passed to the image model | `gpt-image-2` via `/v1/images/generations` or `/v1/images/edits`; or `gemini-3-pro-image` |
| 4 | Google-side thinking | `generation_config.thinking_level` is `minimal` or `high`; thinking mode is **default enabled** and generates interim "thought images" [distilled-image-models.md] |
| 5 | Evaluate, then single-change iterate per section 8 | |

### 9.3 The rewriting caveat (this decides which endpoint you use)

The mainline model "will automatically revise your prompt for improved performance," exposing the rewrite in `revised_prompt`. **Your literal prompt is not necessarily what reaches the image model.** The raw Image API (`/v1/images/generations`) does not apply this rewriting layer in the same way, giving **more deterministic control over photographic language** [distilled-image-models.md].

**Rule:** if the planner has spent effort on precise optical and imperfection language, send it through `/v1/images/generations`, not through the Responses tool. If you do use the Responses tool, log `revised_prompt` and diff it against your slot block; a rewrite that stripped the IMPERFECTION slot explains a plastic result.

### 9.4 What the planner must output

The planner's output contract. Every field is mandatory; empty means the planner failed.

1. **Platform choice with reason.** `gemini-3-pro-image` for photorealistic skin, natural-light portraits, phone/UGC candid looks and un-over-processed color; `gpt-image-2` for anything featuring a named or prominent real person (Nano Banana Pro hard-refuses), transparent backgrounds, mask-precise inpainting, and diagrams or dense typography [distilled-image-models.md].
2. **Register.** Phone selfie, candid third-party, or professional. This determines which trigger phrase from section 3.1 goes in MEDIUM.
3. **Scene type, with the detection-rate justification.** Prefer single-subject portrait or candid-group framing (see guide 04, section on scene-type ranking).
4. **The filled slot block**, all twelve slots, values as sentences.
5. **The imperfection selection**: which levers from guide 04 were chosen and what each defeats. Minimum three, drawn from different categories (skin, optics, physics, framing).
6. **The exclusion line**, consolidated.
7. **The preserve list**, pre-written, ready for the first edit iteration.
8. **Parameters**: `size` or `aspect_ratio` (and the same ratio restated in prose, per the practitioner rule that "model composition improves when aspect is both flagged and mentioned in prose"), `quality`, `output_format`, `n` [distilled-image-models.md].
9. **A stop condition**: what would make this image acceptable, and what artifact would send it back for another iteration.

### 9.5 Planner-side parameter cheat sheet

| Parameter | Value to plan | Source note |
|---|---|---|
| `size` (OpenAI) | `auto`, `1024x1024`, `1536x1024`, `1024x1536`, or custom WIDTHxHEIGHT with **each dimension divisible by 16, up to 3840x2160** | Generate endpoint. Edit endpoint documents only the four fixed values [distilled-image-models.md] |
| `gpt-image-2` constraints | Max edge **< 3840 px**; both edges **multiples of 16**; aspect cap **<= 3:1**; total pixels **655,360 to 8,294,400**; treat above **2560x1440** as **experimental** | [distilled-image-models.md] |
| `quality` (OpenAI) | `auto`, `high`, `medium`, `low`. Start `low` and evaluate; use `medium` or `high` for "small or dense text, detailed infographics, close-up portraits, identity-sensitive edits" | [distilled-image-models.md] |
| `n` (OpenAI) | **1 to 10** | [distilled-image-models.md] |
| `output_compression` | 0 to 100 (%), default 100, webp/jpeg only. **Below 100 introduces artifacts that read "digital", not as film grain** | [distilled-image-models.md] |
| `aspect_ratio` (Google) | `1:1`, `3:2`, `2:3`, `3:4`, `4:3`, `4:5`, `5:4`, `9:16`, `16:9`, `21:9` | [distilled-image-models.md] |
| `resolution` (Google) | `512px (0.5K)`, `1K`, `2K`, `4K`; Lite is **1K only** | [distilled-image-models.md] |
| `background` (OpenAI only) | `transparent`, `opaque`, `auto`. No Google equivalent | [distilled-image-models.md] |
| In-image text | Put literal text **in quotes or ALL CAPS**, specify typography, spell tricky words **letter-by-letter**, and use `medium` or `high` quality | [distilled-image-models.md] |

---

## 10. Pre-flight checklist

Run this before sending. Any "no" is a defect.

- [ ] The literal word **"photorealistic"** appears in the prompt [distilled-image-models.md].
- [ ] SCENE is written **before** SUBJECT (OpenAI canonical order) [distilled-image-models.md].
- [ ] Every slot value is a sentence or clause, not a comma-separated tag list (Google's "describe the scene, don't just list keywords") [distilled-image-models.md].
- [ ] The prompt uses labeled segments or line breaks rather than one long paragraph [distilled-image-models.md].
- [ ] LIGHT and OPTICS together take more prompt real estate than any quality adjectives, because "composition terms (lens, aperture feel, lighting) often steer realism more reliably than generic 'ultra-detailed'" [distilled-image-models.md].
- [ ] Zero occurrences of *pristine, flawless, perfect, ultra-detailed, 8K, hyperdetailed, masterpiece* [distilled-image-models.md].
- [ ] IMPERFECTION slot is filled with at least three levers from different categories (guide 04).
- [ ] Exclusions are plain-English sentences in one consolidated line; no `--no`, no weights, no `::` [distilled-image-models.md].
- [ ] Aspect ratio is both set as a parameter **and** stated in prose [distilled-image-models.md].
- [ ] One subject is clearly primary [distilled-image-models.md].
- [ ] Total prompt is under **32,000 characters** if targeting OpenAI [distilled-image-models.md].
- [ ] If this is an edit: the preserve list is present, in full, in this call, not just the first one [distilled-image-models.md].
- [ ] The case-specific preflight returned 0: CASE A with the exact registered source for an edit, or CASE B for a novel scene. Any visual-only file is used only as a CASE B likeness reference.
- [ ] If routed through the Responses API: you are prepared to inspect `revised_prompt` [distilled-image-models.md].
