# 15: Rich Text & Block Editors

Source: `research/2026-04-25-rich-text-editors.md`. Choosing a rich-text editor is a 2-year decision: the data model leaks into the database, the API, exports, and AI pipelines. Pick once, pick right.

## TL;DR pick

| Project shape | Pick | Why |
|---|---|---|
| Notion-like block editor, fastest start | **BlockNote** | Notion UX out of the box, built on TipTap |
| Notion-like with custom blocks / branding | **TipTap** | The leader; commercial Cloud for collab |
| Meta-scale apps, accessibility floor mandatory | **Lexical** | Powers Facebook, Instagram, Threads |
| Slate already in the codebase, want plugins | **Plate.js** | Best-in-class Slate plugin set |
| Engine-level control, you'll build the UI | **ProseMirror** | What TipTap is built on |
| Want AI completions out of the box | **Novel.sh** | TipTap + Vercel AI SDK preset |
| Yoopta/notion-clone vibe with less lock-in | **Yoopta-Editor** | Modular, zero-lock-in alternative |

The default for new projects: **BlockNote** if you want Notion UX, **TipTap** if you'll customize blocks, **Lexical** if accessibility and reliability at scale dominate.

---

## When to choose each

### BlockNote (the easiest path to Notion UX)
- You want slash commands, drag-and-drop blocks, and a familiar Notion feel without designing the editor surface.
- Wraps TipTap with a polished React UI, sensible defaults, and a JSON document format.
- Trade-off: opinionated. If you need a deeply custom block system, drop down to TipTap.

### TipTap (the Notion-style leader)
- You'll author custom blocks, marks, and node-views.
- Headless React API; you bring the UI primitives (toolbar, slash menu).
- Commercial **TipTap Cloud** adds collaboration, comments, AI, and document storage. Use it if you need realtime collab and don't want to run a Yjs server.

### Lexical (Meta's editor)
- You're building consumer-scale text input (comments, posts, DMs) where reliability and accessibility cannot wobble.
- Excellent screen-reader support; immutable editor state; predictable performance.
- Steeper learning curve than TipTap; smaller plugin ecosystem.

### Plate.js (Slate, batteries included)
- You inherited a Slate codebase or want the Slate data model with a curated plugin set (mentions, tables, code blocks, AI).
- React-first; ships with a starter UI built on shadcn primitives.
- Trade-off: Slate's maintenance cadence is slower than ProseMirror's.

### ProseMirror (the engine)
- You'll build a domain-specific editor (legal contracts, scientific papers, code-and-prose hybrids) where you need every transaction and schema rule to be yours.
- Library, not a framework. Expect to write a lot.
- 90% of teams who think they want ProseMirror want TipTap.

### Novel.sh (AI completions out of the box)
- TipTap-based editor with Vercel AI SDK pre-wired (streamed completions, slash-command AI actions).
- Use it as inspiration / a starting point, not a long-term lock-in. Fork it.

### Yoopta-Editor (the modular alternative)
- Notion-like UX with a plugin architecture that's lighter than TipTap's.
- Smaller community; evaluate maintenance cadence before adopting.

---

## Decision axes

1. **Collaboration?** TipTap (with Cloud or self-hosted Yjs) and Lexical lead. BlockNote inherits TipTap's collab. Plate has Yjs support. ProseMirror requires assembly.
2. **AI completions?** Novel.sh by default. TipTap + Vercel AI SDK if you want control. Lexical can do it but you're wiring more.
3. **Mobile / RN?** Lexical has the best mobile story (Meta uses it on iOS/Android web views). TipTap works but the touch UX needs love.
4. **Document portability?** Markdown export: TipTap, BlockNote, Plate are mature. JSON-as-source-of-truth: all of them. Round-tripping rich content through Markdown lossily is a common foot-gun.
5. **A11y floor?** Lexical > TipTap >= BlockNote > Plate >= ProseMirror (depends on you) > Novel.

---

## Starter (TipTap, the customization-friendly default)

```tsx
'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

export function Editor({
  initial,
  onChange,
}: {
  initial?: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Start writing…' }),
    ],
    content: initial ?? '',
    immediatelyRender: false, // SSR-safe in React 19 / Next 15
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  return <EditorContent editor={editor} />;
}
```

Persist as JSON (`editor.getJSON()`), not HTML, when round-trip fidelity matters. HTML is fine for read-only render but lossy for nested marks.

## Starter (BlockNote, the fastest to Notion UX)

```tsx
'use client';
import '@blocknote/mantine/style.css';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';

export function NotionLikeEditor() {
  const editor = useCreateBlockNote();
  return <BlockNoteView editor={editor} />;
}
```

That's a working slash-menu, drag-and-drop, block-based editor in 5 lines.

---

## Choice tree

1. **You want Notion UX with the least work.** → BlockNote.
2. **You want Notion UX but will customize blocks heavily.** → TipTap.
3. **You're at consumer scale and a11y/reliability floor matters.** → Lexical.
4. **You inherited Slate or want Slate's data model with a curated plugin set.** → Plate.js.
5. **You'll author a domain-specific editor and own the schema completely.** → ProseMirror.
6. **You want AI completions in the editor by default.** → Novel.sh (TipTap under the hood).

---

## Common findings

> **[Should-refactor]** `src/features/notes/Editor.tsx:1`: uses `react-quill`. Quill is in maintenance; document model is brittle. Migrate to TipTap or BlockNote depending on Notion-likeness needed.

> **[Must-fix]** `src/features/posts/render.tsx:5`: renders editor HTML via `dangerouslySetInnerHTML` with no sanitizer. Add `rehype-sanitize` or render from JSON via TipTap's read-only renderer. See `guides/13-ecosystem-catalog.md §markdown`.

> **[Should-refactor]** `package.json:24`: both `@tiptap/react` and `slate-react` present. Converge on one editor stack. Mixed editors leak into the export pipeline and the AI prompt format.

---

## Handoffs

- **Realtime collaboration infra (Yjs server, Liveblocks, PartyKit)** → flag for `devops-worker-bee` or library-worker-bee PRD.
- **Token / typography / spacing of the editor surface** → `ux-ui-svelte-worker-bee`.
- **AI completions inside the editor** → `mind-worker-bee`.
- **Server-side sanitization of editor HTML/JSON** → `security-worker-bee`.
