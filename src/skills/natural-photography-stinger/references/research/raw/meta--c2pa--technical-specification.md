# C2PA Technical Specification (Content Credentials)

- URL: https://spec.c2pa.org/specifications/specifications/2.4/specs/C2PA_Specification.html
- Fetched: 2026-08-17
- Source type: standard

## Version history

- **2.4 — April 2026 — CURRENT as of this research date**
- 2.2 — May 2025 ("technical and editorial changes to clarify some of the new features")
- 2.0 — January 2024
- Versioned spec URLs: `https://spec.c2pa.org/specifications/specifications/<VER>/specs/C2PA_Specification.html`

### What changed in 2.4 vs 2.2/2.3

- crJSON serialization introduced
- Three new assertions: **Repository Receipt**, **Environmental Sustainability**, **AI Disclosure**
- HTML / structured text embedding support
- Actions assertion gained a `relatedAssertions` field
- `specVersion` moved out of the claim into `claim_generator_info`

## Manifest store structure

A **C2PA Manifest Store** is "a collection of C2PA Manifests that can either be embedded into an
asset or be external to its asset." The last manifest in the store is the **active manifest**,
which holds the currently valid content bindings.

Each **Manifest** contains three parts:

1. **Assertions** — individual statements about the asset: metadata, actions, hashes,
   thumbnails, ingredients.
2. **Claim** — a container that references the assertions and establishes the binding to the
   content.
3. **Claim Signature** — the cryptographic signature over the claim, proving authenticity and
   integrity.

**Ingredients** represent prior assets consumed to produce this one, which is how edit chains
and composites are expressed. A parent ingredient represents the pre-edit state.

"The set of C2PA Manifests, as stored in the asset's Content Credential, represent its
provenance data."

## Embedding — JUMBF

Manifests are embedded using **JUMBF (JPEG Universal Metadata Box Format)**, defined in
**ISO/IEC 19566-5:2023**. For non-BMFF formats such as JPEG and PNG, the manifest store is
stored as a **JUMBF superbox** containing description and content boxes.

(The 2.4 text fetched did not spell out the specific JPEG marker segment / PNG chunk name in
the excerpt retrieved. In practice JPEG uses APP11 marker segments and PNG uses a `caBX`
ancillary chunk — **this detail was not confirmed from the primary source in this pass.**)

## Hard bindings vs soft bindings

**Hard bindings** are cryptographic hashes that uniquely identify an asset or a portion of it,
providing tamper detection. Mechanisms vary by format: byte-range hashing, box hashing, or
BMFF-based hashing.

**Soft bindings** use fingerprints or invisible watermarks computed from the content itself.
They allow matching of derived assets and renditions "even when the underlying bits differ" —
across resolutions, re-encodings, and format conversions. The spec is explicit that soft
bindings serve **identity matching, not integrity verification**; they do not replace the
cryptographic hard binding.

**Durable Content Credentials** are defined as a "Content Credential for which there exists one
or more soft bindings that enable its discovery in a manifest repository." This is the mechanism
that lets a manifest be recovered and re-attached to an asset after the embedded manifest has
been stripped — the watermark/fingerprint survives, the repository lookup returns the manifest.

## What happens when metadata is stripped

- Claim generators may **exclude asset metadata from the content binding** using exclusion
  mechanisms in the hash assertions. Excluded metadata is not attributed to the signer.
- When asset metadata outside the C2PA manifest (EXIF, XMP) is stripped, it is no longer
  protected by the hard binding.
- Guidance: "any asset metadata values that are supported by the common metadata assertion
  should be copied into such an assertion and included in the C2PA Manifest" — i.e. duplicate
  the important EXIF/IPTC/XMP values *inside* the signed manifest so they survive and are
  attributable.
- If the embedded JUMBF manifest itself is removed, the only recovery route is a soft binding
  (durable Content Credentials) plus a manifest repository lookup, or a remote/sidecar manifest
  reference. **A plain metadata strip removes embedded Content Credentials entirely.**

## Key assertions

- **`c2pa.actions` / `c2pa.actions.v2`** — records operations performed by an actor on an asset
  (create, embed, filter, etc.). v2 supports "richer models of ingredient-based workflows",
  refined watermarking actions, and **requires that either `c2pa.created` or `c2pa.opened` is
  present in a standard manifest**.
- **`c2pa.metadata`** — the common metadata assertion. Carries supported metadata schemas
  (Dublin Core, EXIF, IPTC, XMP). Validation requires consistency with the serialized values in
  the asset.
- **AI Disclosure assertion** — new in 2.4.
- **Repository Receipt**, **Environmental Sustainability** — new in 2.4.

## digitalSourceType in C2PA

C2PA reuses the **IPTC Digital Source Type NewsCodes** vocabulary
(`http://cv.iptc.org/newscodes/digitalsourcetype/…`) as the primary vocabulary, carried as an
IPTC assertion within the manifest.

C2PA additionally defines its **own** extension URIs under its own namespace:

- `http://c2pa.org/digitalsourcetype/trainedAlgorithmicData`
- `http://c2pa.org/digitalsourcetype/empty`

These are C2PA-specific and are **not** IPTC NewsCodes. Do not confuse
`c2pa.org/digitalsourcetype/trainedAlgorithmicData` with
`cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia` — different namespace,
different term ("Data" vs "Media").
