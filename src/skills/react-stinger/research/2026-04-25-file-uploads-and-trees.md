# File Uploads & Tree UIs: research notes

**Retrieved:** 2026-04-25
**For guide:** `guides/20-file-uploads-and-trees.md`

## Sources

From `cursor-subagent-research-combined.md` (File Uploads & Tree UIs, ~line 845):

- [Uppy](https://uppy.io/)
- [FilePond](https://pqina.nl/filepond/)
- [Uploadthing](https://uploadthing.com/)
- [React Arborist](https://github.com/brimdata/react-arborist)
- [react-dropzone](https://react-dropzone.js.org/)

## Adjacent references

- tus protocol (resumable uploads, the standard Uppy is built around): https://tus.io/
- tusd (reference tus server implementation): https://github.com/tus/tusd
- Uppy AWS S3 multipart plugin: https://uppy.io/docs/aws-s3-multipart/
- Uppy tus plugin: https://uppy.io/docs/tus/
- Uploadthing FileRouter docs: https://docs.uploadthing.com/
- WAI-ARIA `role="progressbar"` for upload progress: https://www.w3.org/WAI/ARIA/apg/patterns/meter/ (and progressbar pattern)

## Cross-references

- `guides/13-ecosystem-catalog.md` does not cover uploads or trees: this guide is additive.
- Storage backend (S3 / R2 / GCS), signed URLs, lifecycle policies handed off to `devops-worker-bee`.
- Per-upload auth scoping handed off to `security-worker-bee`.
- Image transforms / CDN delivery (Cloudinary, Imgix, unpic) referenced from the source doc but out of scope here: flagged for `library-worker-bee` PRD if needed.

## Notes

The guide's central new contribution: the **chunked / resumable upload story**. tus + Uppy is the canonical pattern; "send the whole file in one POST" is broken for files >100 MB or flaky networks.

The a11y floor on uploads (keyboard-operable drop zone, `role="progressbar"`, focusable cancel, live-region errors) and on trees (arrow-key nav, type-ahead, virtualization) is codified in the guide because both are common regression sources.

No new web_search_exa expansions performed.
