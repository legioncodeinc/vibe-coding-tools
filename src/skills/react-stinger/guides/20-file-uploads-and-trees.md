# 20: File Uploads & Tree UIs

Source: `research/2026-04-25-file-uploads-and-trees.md`. File uploads are easy to ship and easy to ship wrong (no resumability, no chunking, no progress, no cancellation). Tree UIs are easy to ship and easy to crash with virtualization gone wrong. This guide picks both.

## TL;DR pick

| Use case | Pick | Why |
|---|---|---|
| Drop zone + small file uploads | **react-dropzone** | The drop-zone primitive |
| Resumable / chunked / multi-GB uploads | **Uppy** (with **tus** server) | Resume after disconnect; battle-tested |
| Polished single-file upload UX | **FilePond** | Beautiful UX with adapters per backend |
| Next.js / Vercel-native managed uploads | **Uploadthing** | Schema + server + client + auth in one |
| Virtualized tree (file manager, tag tree) | **React Arborist** | Virtualized + DnD-friendly |
| Static / small tree | **Radix accordion** or custom recursion | Right-sized, no extra dep |

For most teams: **react-dropzone** for the drop zone, **Uppy + tus** for serious file pipelines, **Uploadthing** for Next-first apps where you want the whole pipe in one package, **React Arborist** for any tree UI larger than a few dozen nodes.

---

## When to choose each

### react-dropzone (the drop-zone primitive)
- Headless. You write the visual. It handles drag-and-drop, file selection, type validation.
- Pairs with anything (Uppy, Uploadthing, custom uploads): it's just the input surface.
- Use it as the input even when the *upload pipeline* is something else.

### Uppy (the upload pipeline)
- Resumable uploads via tus (`@uppy/tus`), S3 multipart (`@uppy/aws-s3-multipart`), or any custom transport.
- Survives network disconnects; uploads pause and resume from the last chunk.
- Plug-in architecture: webcam, image editor, Google Drive picker, dashboard UI.
- Pair with a tus server (e.g., `tusd`) for true resumability. Without tus you're not getting the resumability promise.

### FilePond (the polished single-file UX)
- Beautiful, animated drop UX out of the box. Adapters for S3, Cloudinary, custom endpoints.
- Less flexible than Uppy for very large or chunked uploads.
- Use when the UX of the input itself is the point (avatars, hero images, single-file PDFs).

### Uploadthing (Next-first managed uploads)
- Defines upload routes server-side (TypeScript), validates per upload, exposes a typed client.
- Auth-aware (per-user upload permissions, file size limits, mime allowlist).
- Lock-in to Uploadthing's hosting. Fine for solo / small teams; less appealing if you already run S3 / R2.

### React Arborist (the virtualized tree)
- Virtualized tree component: renders thousands of nodes without choking.
- Built-in keyboard navigation, multi-select, drag-and-drop reorder.
- Use for file managers, project navigators, tag trees, org charts.

---

## The chunked / resumable upload story

For files >100 MB or any upload over a flaky network, "send the whole file in one POST" is broken. The fix:

1. **Chunked transport.** Split the file into 5 to 20 MB chunks; upload each independently; reassemble server-side.
2. **Resumability.** If a chunk fails, retry it; if the whole upload fails, resume from the last successful chunk.
3. **Progress.** Per-chunk progress aggregated to a per-file progress bar.
4. **Cancellation.** AbortController on the in-flight chunk(s).
5. **Auth & limits.** Signed URLs, per-user limits, mime allowlist enforced server-side, not client.

The standard for this is the **tus protocol**. Uppy's `@uppy/tus` plugin + a `tusd` server is the canonical implementation. S3 multipart works too but is more code.

---

## Starter (react-dropzone + Uppy + tus)

```tsx
'use client';
import { useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import Uppy from '@uppy/core';
import Tus from '@uppy/tus';

export function ResumableUpload({ tusEndpoint }: { tusEndpoint: string }) {
  const uppyRef = useRef<Uppy | null>(null);

  useEffect(() => {
    const uppy = new Uppy({ autoProceed: true, restrictions: { maxFileSize: 5 * 1024 * 1024 * 1024 } })
      .use(Tus, { endpoint: tusEndpoint, chunkSize: 10 * 1024 * 1024, retryDelays: [0, 1000, 3000, 5000] });
    uppyRef.current = uppy;
    return () => uppy.cancelAll();
  }, [tusEndpoint]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => files.forEach((f) => uppyRef.current?.addFile({ name: f.name, type: f.type, data: f })),
  });

  return (
    <div {...getRootProps()} role="button" tabIndex={0} aria-label="Upload files">
      <input {...getInputProps()} />
      {isDragActive ? 'Drop files here' : 'Drop files or click to browse'}
    </div>
  );
}
```

That's a 5 GB-capable, resumable, chunked upload UI in ~30 lines. Subscribe to Uppy events (`upload-progress`, `complete`, `upload-error`) to drive a progress bar and toast.

## Starter (Uploadthing on Next.js)

```ts
// src/server/uploadthing.ts
import { createUploadthing, type FileRouter } from 'uploadthing/next';
const f = createUploadthing();

export const uploadRouter = {
  avatar: f({ image: { maxFileSize: '4MB' } })
    .middleware(async () => {
      // your auth check; return user context
      return { userId: 'demo' };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // persist file.url to your DB
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;
export type UploadRouter = typeof uploadRouter;
```

```tsx
// client
'use client';
import { UploadButton } from './uploadthing-client'; // generated helper

export function AvatarUpload() {
  return <UploadButton<UploadRouter, 'avatar'> endpoint="avatar" />;
}
```

---

## Starter (React Arborist tree)

```tsx
'use client';
import { Tree } from 'react-arborist';

type Node = { id: string; name: string; children?: Node[] };
const data: Node[] = [{ id: '1', name: 'src', children: [{ id: '2', name: 'app.tsx' }] }];

export function FileTree() {
  return (
    <Tree data={data} openByDefault width={320} height={480} indent={16}>
      {({ node, style, dragHandle }) => (
        <div style={style} ref={dragHandle}>
          {node.isLeaf ? '📄' : node.isOpen ? '📂' : '📁'} {node.data.name}
        </div>
      )}
    </Tree>
  );
}
```

For trees over a few hundred nodes, virtualization is non-negotiable: Arborist gives it to you for free.

---

## Accessibility floor

- **Drop zones** must be keyboard-operable (`role="button"`, `tabIndex={0}`, Enter/Space triggers the file picker). react-dropzone gives you the props; wire the role + tabIndex.
- **Progress** must be announced via `role="progressbar"` with `aria-valuenow`/`aria-valuemax`, or live-region updates.
- **Cancel** must be focusable per upload, not buried in a dropdown.
- **Trees** must support arrow-key navigation, Home/End, type-ahead, and Enter to activate. Arborist handles this.
- **Errors** ("file too large", "wrong type", "upload failed") go to a live region, not just a red border.

---

## Choice tree

1. **Drop zone surface only** → react-dropzone.
2. **Files >100 MB or flaky network** → Uppy + tus (tusd server).
3. **S3 multipart preferred** → Uppy + `@uppy/aws-s3-multipart`.
4. **Next-first, want the whole pipeline in one package** → Uploadthing.
5. **Polished single-file UX** → FilePond.
6. **Tree with >100 nodes** → React Arborist.
7. **Tree with <50 static nodes** → Radix Accordion or hand-rolled recursion.

---

## Common findings

> **[Must-fix]** `src/features/upload/Upload.tsx:1`: uploads via single `fetch` POST with no chunking; 200 MB files fail on flaky networks. Migrate to Uppy + tus or S3 multipart. See this guide §chunked-resumable-upload.

> **[Must-fix]** `src/features/files/FileTree.tsx:1`: renders 8,000 nodes with naive recursion; main thread blocks on expand. Move to React Arborist (virtualized).

> **[Should-refactor]** `src/features/upload/Drop.tsx:5`: drop zone is a `<div>` with no role / tabIndex / keyboard handler. Apply react-dropzone's `getRootProps()` + add `role="button"` and `tabIndex={0}`.

> **[Must-fix]** `src/server/upload.ts:1`: file size + mime allowlist enforced only client-side. Re-enforce on the server. See `guides/11-server-components.md §server-actions` and `security-worker-bee` handoff.

---

## Handoffs

- **Storage layer (S3 / R2 / GCS), signed URLs, lifecycle policies** → `devops-worker-bee`.
- **Auth scoping per upload (who can write where)** → `security-worker-bee`.
- **Image transforms / CDN delivery** → image-CDN territory (Cloudinary, Imgix, unpic). Out of scope for this guide; flag for library-worker-bee PRD if needed.
- **Visual treatment of drop zones, progress, and tree rows** → `ux-ui-svelte-worker-bee`.
