# references/

Research archive, executable scripts, and templates.

## Structure

```
references/
├── research/
│   ├── raw/                                73 primary sources, one per file
│   ├── distilled-photographic-craft.md     694 lines
│   ├── distilled-image-models.md           703 lines
│   └── distilled-metadata-and-provenance.md 770 lines
├── scripts/
│   ├── preflight.py                        the model gate
│   └── exif_apply.py                       the three-case metadata layer
└── templates/
    └── exif-profiles/                      CASE B scene profiles
```

## The citation chain

Every factual claim in this skill is traceable:

```
guide statement
  -> [distilled-*.md]
     -> [raw/<source>.md]
        -> URL + fetch date + source type
```

Each raw file opens with its URL, the date it was fetched (2026-08-17), and
whether it is official documentation, a vendor blog, an academic paper, or a
practitioner source. Official docs outrank vendor blogs outrank community
posts, and where sources conflict the distilled files state both readings and
name the better supported one rather than smoothing it over.

The raw archive preserves source wording verbatim, including punctuation. It
is the one part of this skill that is not written in the house style, and
that is deliberate: an archive that has been edited is not an archive.

## Raw archive composition

| Prefix | Count | Domain |
|---|---|---|
| `craft--` | 27 | Optics, lighting, sensors, computational photography, skin tone rendering, candid aesthetics |
| `gptimage--` | 15 | OpenAI model identity, API parameters, prompting doctrine, provenance |
| `nanobanana--` | 15 | Google model identity, Replicate access, SynthID, prompting |
| `meta--` | 16 | ExifTool, EXIF tag semantics, IPTC, C2PA, regulation, privacy practice |

## Scripts

Both are standard library only, no pip install required. `exif_apply.py`
shells out to `exiftool`, which must be on PATH.

### preflight.py

The gate. Determines whether consented source material exists.

```bash
python3 references/scripts/preflight.py --json
python3 references/scripts/preflight.py --model mario --case B
python3 references/scripts/preflight.py --model mario --case A --source /absolute/path/to/source.jpg
python3 references/scripts/preflight.py --models-dir /path/to/models
```

Exit codes: `0` READY, `2` NO_MODELS, `3` INCOMPLETE, `4` BAD_LAYOUT,
`5` CASE_BLOCKED, `64` INVALID_ARGUMENTS. Map code 64 to
`E_GATE_ARGUMENTS` in scheduled-run reports and fix the invocation before
retrying. A case-specific gate requires `--model`; CASE A also requires
`--source`, which is invalid with any other case.

It validates more than folder presence. It checks the model state, release,
ledger membership, reference/select counts, the required one-to-one checksum
manifest and filled brief. A visual-only model can pass CASE B while CASE A
remains blocked. CASE A passes only for an exact, checksum-verified source
registered in `MODEL-STATE.json.case_a_sources`.

### exif_apply.py

The metadata layer. Four subcommands.

```bash
exif_apply.py inherit --source SRC.jpg --target OUT.jpg [--source-type VALUE] [--keep-gps]
exif_apply.py scene   --target OUT.jpg --profile PROFILE.json [--source-type VALUE]
exif_apply.py publish --target OUT.jpg
exif_apply.py inspect --target OUT.jpg
```

`inherit` is CASE A and must be run only after the exact source passes the
CASE A preflight. It copies the source frame's genuine metadata with
`-tagsFromFile ... -all:all`, brings MakerNotes across with the `-make` and
`-model` tags they need to stay interpretable, drops GPS by default for
privacy, sets `XMP-iptcExt:DigitalSourceType`, and writes a
`.lineage.json` recording the source file's SHA-256 alongside the output's.

`scene` is CASE B. It refuses any profile containing a capture-identity tag,
naming the offending tags and exiting non-zero. It also refuses a
`digitalCapture` or `computationalCapture` source type, since neither is true
of an image that did not come from a camera.

`publish` is CASE C. It removes GPS, serials and owner identifiers while
preserving `Make`, `Model`, `LensModel`, exposure values, `Artist`,
`Copyright` and `DigitalSourceType`, then reports exactly what it removed and
what it kept.

Verified behavior on all four subcommands, including both refusal paths,
against exiftool 12.76.

## Templates

`exif-profiles/` holds CASE B scene profiles. Its README documents which tags
a profile may contain, which are refused, and a coherence table for choosing
values that do not contradict the depicted scene. A frame showing visible
motion blur should not carry 1/2000, and a frame with everything in focus
should not carry f/1.2 on a full frame body.
