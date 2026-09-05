# c2patool CLI — Content Authenticity Initiative open-source tools

- URL: https://opensource.contentauthenticity.org/docs/c2patool/
- Fetched: 2026-08-17
- Source type: official-docs

`c2patool` is the reference CLI for reading, creating and signing C2PA manifests. Repo:
https://github.com/contentauth/c2patool

## Installation

Pre-built binaries from the repo releases page (Linux, macOS, Windows) — put the executable on
PATH. Verify with `c2patool -h`.

Via cargo-binstall (recommended):

```bash
cargo install cargo-binstall
cargo binstall c2patool
```

From source:

```bash
cargo install c2patool
```

## Supported formats

`.avi .avif .c2pa .dng .heic .heif .jpg .jpeg .m4a .mp3 .mp4 .mov .pdf .png .svg .tif .tiff .wav .webp`

Note: no support for raw formats other than DNG. Camera-native raw (CR3, NEF, ARW) is not in
the list.

## Syntax

```
c2patool [trust] [PATH] [OPTIONS]
```

## Reading / inspecting

```bash
# print manifest JSON to stdout
c2patool sample/C.jpg

# save manifest plus extracted thumbnails to a directory
c2patool sample/C.jpg --output ./report

# detailed report in internal C2PA format
c2patool sample/C.jpg --detailed
c2patool sample/C.jpg -d --output ./report        # writes detailed.json into ./report

# high-level info: manifest size, count, validation status, cloud manifest URLs
c2patool sample/C.jpg --info

# extract the signing certificate chain
c2patool sample/C.jpg --certs

# render the manifest store as a tree
c2patool sample/C.jpg --tree
```

## Adding / signing a manifest

```bash
# add manifest from a definition file
c2patool sample/image.jpg -m sample/test.json -o signed_image.jpg

# force overwrite of an existing output
c2patool sample/image.jpg -m sample/test.json -f -o signed_image.jpg

# declare a parent (the pre-edit state), producing an ingredient relationship
c2patool sample/image.jpg -m sample/test.json -p sample/c.jpg -o signed_image.jpg

# two-step: generate an ingredient, then use it as parent
c2patool sample/C.jpg --ingredient --output ./ingredient
c2patool sample/image.jpg -m sample/test.json -p ./ingredient -o signed_image.jpg

# external sidecar manifest (.c2pa file alongside the asset)
c2patool sample/image.jpg -s -m sample/test.json -o signed_image.jpg

# remote manifest: embeds an HTTP reference, writes the .c2pa to disk
c2patool sample/image.jpg -r http://my_server/myasset.c2pa -m sample/test.json -o signed_image.jpg

# inline manifest definition on the command line
c2patool sample/image.jpg \
  -c '{"assertions": [{"label": "org.contentauth.test", "data": {"my_key": "whatever I want"}}]}'
```

## Manifest definition JSON

```json
{
  "assertions": [
    {
      "label": "org.contentauth.test",
      "data": { "my_key": "whatever I want" }
    }
  ]
}
```

With signing credentials:

```json
{
  "private_key": "/path/to/private.key",
  "sign_cert": "/path/to/certificate.pem",
  "assertions": [ ... ]
}
```

If `private_key` / `sign_cert` are absent, c2patool falls back to a **built-in test certificate
and key, "suitable for development and testing"** only — such manifests will not validate
against the production trust list. Credentials can also be supplied via environment variables
rather than embedded in the manifest file.

## Custom signer

```bash
c2patool sample/image.jpg \
  --manifest sample/test.json \
  --output sample/signed-image.jpg \
  --signer-path ./custom-signer \
  --reserve-size 20248 \
  -f
```

The custom signer executable receives claim bytes on stdin and writes signature bytes to stdout.

Skip post-signing validation for speed: `--no_signing_verify`.

## Trust lists

```bash
c2patool sample/C.jpg trust \
  --allowed_list sample/allowed_list.pem \
  --trust_config sample/store.cfg
```

Environment variables:

- `C2PATOOL_TRUST_ANCHORS` — trust anchor list (PEM)
- `C2PATOOL_ALLOWED_LIST` — end-entity certificates (PEM)
- `C2PATOOL_TRUST_CONFIG` — custom certificate OIDs

Using the C2PA Verify lists:

```bash
export C2PATOOL_TRUST_ANCHORS='https://contentcredentials.org/trust/anchors.pem'
export C2PATOOL_ALLOWED_LIST='https://contentcredentials.org/trust/allowed.sha256.txt'
export C2PATOOL_TRUST_CONFIG='https://contentcredentials.org/trust/store.cfg'
c2patool sample/C.jpg trust
```

## Flag reference

| Flag | Short | Purpose |
|---|---|---|
| `--manifest` | `-m` | Manifest definition file to add |
| `--output` | `-o` | Output file or folder |
| `--detailed` | `-d` | Detailed C2PA-format report |
| `--parent` | `-p` | Parent (pre-edit) file |
| `--force` | `-f` | Overwrite existing output |
| `--sidecar` | `-s` | Write external `.c2pa` manifest |
| `--remote` | `-r` | Remote manifest HTTP URL |
| `--ingredient` | `-i` | Create an ingredient definition |
| `--config` | `-c` | Inline JSON manifest definition |
| `--signer-path` | — | External signing executable |
| `--reserve-size` | — | Bytes reserved for the signature |
| `--no_signing_verify` | — | Skip post-signing validation |
| `--info` | — | High-level file info |
| `--certs` | — | Extract certificate chain |
| `--tree` | — | Manifest store tree diagram |
| `--version` | `-V` | Version |
