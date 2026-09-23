# Markdown + images -> tawk.to KB article

Goal: take a markdown file (with local image paths and/or remote image links) and publish it as a tawk.to knowledge base article.

Two hard constraints from the API (see `knowledge-base.md`):

1. Article bodies are typed **content blocks**, not markdown. You must parse markdown into blocks. The good news (VERIFIED 2026-06-05 against a live tawk draft): the `paragraph` block's `text` field accepts **HTML**, so inline marks (bold, italic, links, code) and lists (`<ul>`/`<ol>`) are preserved by rendering each markdown block to HTML and dropping it into a paragraph block. Only headings, images, code, tables, dividers, and videos need their own dedicated block type.
2. **tawk.to has no image upload endpoint.** Image blocks reference a `url`. Local images must first be uploaded to a public store (Cloudflare R2 or DigitalOcean Spaces), and the markdown's local paths swapped for the resulting public URLs. (Note: the help-center `_meta/README.md` assumes manual editor upload where "Tawk hosts its own copy" - that path does not exist in the API, so programmatic publishing must host images itself.)

## Pipeline

```
Task Progress:
- [ ] 1. Parse front matter (title, slug, status, categories, banner) + markdown body
- [ ] 2. Collect every image reference in the markdown
- [ ] 3. Upload local images to R2 / DO Spaces -> map local path -> public URL
- [ ] 4. Convert markdown AST -> tawk contents[] blocks (rewrite image URLs)
- [ ] 5. Resolve/create siteId + category ids
- [ ] 6. POST knowledge-base.article.create (status: draft)
- [ ] 7. Verify in dashboard, then knowledge-base.article.update -> published
```

## Step 3: hosting images (pick one)

You only need the object to be publicly readable over HTTPS. Both options below are equivalent for tawk's purposes; choose by what the repo already uses.

### Cloudflare R2
- Create a bucket, attach a public r2.dev URL or (better) a custom domain via Cloudflare.
- Upload with the S3-compatible API (R2 speaks S3) or `wrangler r2 object put`.
- Public URL pattern: `https://<your-domain-or-r2-dev>/<key>`.

```bash
# Wrangler (simple, no SDK)
wrangler r2 object put my-kb-assets/articles/onboarding/diagram.png --file ./diagram.png
# then the public URL is https://<your-public-bucket-domain>/articles/onboarding/diagram.png
```

### DigitalOcean Spaces (S3-compatible)
- Create a Space, set file ACL to `public-read` on upload.
- Public URL pattern: `https://<space>.<region>.digitaloceanspaces.com/<key>` (or the CDN edge URL).

Both are S3-compatible, so a single `@aws-sdk/client-s3` `PutObjectCommand` with `ACL: "public-read"` works against either by swapping `endpoint` and credentials.

```ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { readFile } from "node:fs/promises";

// R2:    endpoint https://<accountid>.r2.cloudflarestorage.com  (R2 ignores ACL; use a public bucket/custom domain)
// Spaces: endpoint https://<region>.digitaloceanspaces.com      (set ACL public-read)
const s3 = new S3Client({ region: "auto", endpoint: process.env.S3_ENDPOINT!, credentials: {
  accessKeyId: process.env.S3_KEY!, secretAccessKey: process.env.S3_SECRET! } });

export async function uploadImage(localPath: string, key: string, contentType: string): Promise<string> {
  await s3.send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET!, Key: key, Body: await readFile(localPath),
    ContentType: contentType, ACL: "public-read" /* Spaces; harmless/ignored on R2 */ }));
  return `${process.env.PUBLIC_ASSET_BASE_URL}/${key}`; // e.g. https://cdn.legion.example/<key>
}
```

Tips:
- Key images deterministically (e.g. `kb/<articleSlug>/<filename>`) so re-runs are idempotent.
- Set a long `Cache-Control` (`public, max-age=31536000, immutable`) and a correct `ContentType`.
- Remote images already on a public HTTPS URL can be passed straight through (optionally re-host for stability).

## Step 4: markdown element -> tawk block mapping

| Markdown | tawk block | Notes |
|----------|-----------|-------|
| `# H1` | (article `title`) | The single H1 is the article title, not a body block |
| `## H2` ... `###### H6` | `header` | tawk headings are h2-h6; map `##`->h2, `###`->h3, ... clamp at h6. `text` is HTML wrapped in `<p>...</p>`; header takes only `text`/`heading`/`color` |
| paragraph (with `**bold**`, `*italic*`, `` `code` ``, links) | `paragraph` | Render inline markdown to HTML: `text` = `<p>...<b>..</b>..<a href="..">..</a>..</p>` |
| `- item` / `1. item` (lists) | `paragraph` | `text` = `<ul><li>..</li></ul>` or `<ol><li>..</li></ol>` HTML (matches observed editor output) |
| `> blockquote` | `paragraph` | Render to HTML (`<blockquote>` or `<p>`); but see screenshot placeholders below |
| `![alt](path)` | `image` | Rewrite `path` to the hosted public URL; set `alignment` (default `center`) |
| fenced code ```lang | `code` | Map ```lang to a `mime` (e.g. `js`->`text/javascript`) |
| `---` / `***` | `divider` `type: line-full` | |
| table | `table` | Build `head.cells` from header row, `body[].cells` from rows; set `rows`/`columns` |
| `[t](url)` inline link | within `paragraph.text` | Rendered as `<a href="url">t</a>` in the paragraph HTML |
| cover/banner image | `content.metadata.banner.content` | Upload first, then use the URL with `type: "url"` |

Behavior verified against the live draft (2026-06-05, second pass):
- Inline `<b>`, `<i>`, `<u>`, and links `<a href="..." target="_blank">` all render from `paragraph.text` and nest (e.g. `<b><i><u><a ...>x</a></u></i></b>`). `<br />` is self-closing. Bold, italic, underline, links, and lists ARE preserved (as HTML) - no need to flatten or drop them.
- Block-level `<p>`, `<ul>/<li>`, `<ol>/<li>`, and `<blockquote>` all live inside `paragraph.text`. Ordered AND unordered lists, plus blockquotes, are paragraph HTML, not dedicated block types.
- `header` block `text` is also HTML wrapped in `<p>`; a header has only `text`/`heading`/`color` (no `size`/`backgroundColor`).
- `table` with no header row serializes as `head: null` with `rows`/`columns` and a `body` of cell rows.
- Editor defaults per paragraph: `size: 18`, `color: "#000000"`, `backgroundColor: "#FFFFFF"`. The editor also leaves harmless empty trailing nodes (`<p></p>`, `<ol></ol>`); your converter need not emit those.
- Sanitize the HTML you emit (escape `<`, `>`, `&` in text content; allow only the formatting tags above) so user content cannot inject arbitrary markup.

Repo-specific (legion-sight `library/knowledge/public/guides/`): screenshots are placeholders written as a blockquote line `> ![SCREENSHOT: <id>] Depicts: ...`. The real files live in `_images/<id>.png`. When converting, detect this pattern and either (a) if `_images/<id>.png` exists, upload it and emit an `image` block, or (b) if not yet captured, skip it (do not emit the placeholder text as a paragraph). Also strip `<!-- VERIFY: ... -->` HTML comments before publishing.

## Step 4 reference converter (Node, `unified`/`remark`)

Install: `npm i unified remark-parse remark-gfm`. Adapt as needed; this is a starting point, not a drop-in.

```ts
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";

const MIME: Record<string, string> = {
  js: "text/javascript", ts: "text/typescript", py: "text/x-python",
  json: "application/json", html: "text/html", css: "text/css", bash: "text/x-sh", sh: "text/x-sh",
};
const clampHeading = (d: number) => `h${Math.min(6, Math.max(2, d + 1))}`; // md depth 1 -> h2, clamp h2..h6
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const PARA = { size: 18, color: "#000000", backgroundColor: "#FFFFFF" };

// Render inline (phrasing) markdown nodes to the HTML tawk stores in paragraph.text.
function inlineHtml(node: any): string {
  switch (node.type) {
    case "text": return esc(node.value);
    case "strong": return `<b>${(node.children ?? []).map(inlineHtml).join("")}</b>`;
    case "emphasis": return `<i>${(node.children ?? []).map(inlineHtml).join("")}</i>`;
    case "delete": return `<s>${(node.children ?? []).map(inlineHtml).join("")}</s>`;
    case "inlineCode": return `<code>${esc(node.value)}</code>`;
    case "break": return "<br>";
    case "link": return `<a href="${esc(node.url)}" target="_blank">${(node.children ?? []).map(inlineHtml).join("")}</a>`;
    default: return (node.children ?? []).map(inlineHtml).join("");
  }
}
const listHtml = (node: any): string => {
  const tag = node.ordered ? "ol" : "ul";
  const items = node.children.map((li: any) =>
    `<li>${li.children.map((c: any) => (c.type === "list" ? listHtml(c) : (c.children ?? []).map(inlineHtml).join(""))).join("")}</li>`
  ).join("");
  return `<${tag}>${items}</${tag}>`;
};

// mdImageSrcToUrl: local path -> hosted public URL (from Step 3). Pass-through if already https.
export function markdownToBlocks(md: string, mdImageSrcToUrl: (src: string) => string) {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(md);
  const plain = (node: any): string =>
    (node.children ?? []).map((c: any) => c.value ?? plain(c)).join("");
  const blocks: any[] = [];

  for (const node of (tree as any).children) {
    switch (node.type) {
      case "heading": {
        if (node.depth === 1) break; // H1 is the article title, handled separately
        // header text is HTML wrapped in <p> (verified); header has no size/backgroundColor
        const html = `<p>${node.children.map(inlineHtml).join("")}</p>`;
        blocks.push({ type: "header", content: { text: html, heading: clampHeading(node.depth), color: "#000000" } });
        break;
      }
      case "paragraph": {
        const img = node.children?.find((c: any) => c.type === "image");
        if (img && node.children.length === 1) {
          blocks.push({ type: "image", content: { url: mdImageSrcToUrl(img.url), alignment: "center" } });
        } else {
          const html = `<p>${node.children.map(inlineHtml).join("")}</p>`;
          blocks.push({ type: "paragraph", content: { text: html, ...PARA } });
        }
        break;
      }
      case "image":
        blocks.push({ type: "image", content: { url: mdImageSrcToUrl(node.url), alignment: "center" } });
        break;
      case "code":
        blocks.push({ type: "code", content: { text: node.value, ...(MIME[node.lang] ? { mime: MIME[node.lang] } : {}) } });
        break;
      case "thematicBreak":
        blocks.push({ type: "divider", content: { type: "line-full" } });
        break;
      case "list": // lists are HTML inside ONE paragraph block (verified editor behavior)
        blocks.push({ type: "paragraph", content: { text: listHtml(node), ...PARA } });
        break;
      case "blockquote":
        blocks.push({ type: "paragraph", content: { text: `<blockquote>${node.children.map((c: any) => `<p>${(c.children ?? []).map(inlineHtml).join("")}</p>`).join("")}</blockquote>`, ...PARA } });
        break;
      case "table": {
        const rows = node.children;
        const head = { cells: rows[0].children.map((c: any) => ({ value: plain(c) })) };
        const body = rows.slice(1).map((r: any) => ({ cells: r.children.map((c: any) => ({ value: plain(c) })) }));
        blocks.push({ type: "table", content: {
          rows: body.length, columns: head.cells.length, head, body } });
        break;
      }
    }
  }
  return blocks;
}
```

## Step 6: create the article

```ts
async function createArticle(opts: {
  apiKey: string; propertyId: string; siteId: string; title: string;
  blocks: any[]; categories?: { id: string; name?: string; primary: boolean }[]; bannerUrl?: string;
}) {
  const body = {
    propertyId: opts.propertyId,
    article: {
      content: {
        siteId: opts.siteId,
        title: opts.title,
        status: "draft",
        ...(opts.bannerUrl ? { metadata: { banner: { type: "url", content: opts.bannerUrl } } } : {}),
        contents: opts.blocks,
      },
      meta: { visibility: "private", categories: opts.categories ?? [] },
    },
  };
  const res = await fetch("https://api.tawk.to/v1/knowledge-base.article.create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": "Basic " + Buffer.from(opts.apiKey + ":").toString("base64"),
    },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.ok) throw new Error(`${json.error}: ${json.message ?? ""}`);
  return json.data.article.id as string;
}
```

> CAUTION (verified 2026-06-05): sending `article.content.metadata` on CREATE currently fails with `validation_error` (see `knowledge-base.md` Create Article gotcha). The `bannerUrl`/`metadata` branch above will break a create until the accepted metadata shape is confirmed. For now, create WITHOUT `metadata`, then set the banner/description in a follow-up `article.update` if needed. Also pass real category ids or `[]`.

## Step 7: publish

After verifying the draft renders correctly in the dashboard, call `knowledge-base.article.update` with the same `article` object (now `status: "published"`) plus the `articleId`. Remember update requires `status`, `subtitle`, and `author` inside `content`, and the `contents` array replaces the existing body.

## Idempotent re-sync pattern

To keep a markdown source folder in sync with tawk:
1. Maintain a local map of `sourceFile -> { articleId, contentHash }`.
2. On run, hash the rendered blocks; skip unchanged articles.
3. New file -> `article.create`; changed file -> `article.update`; removed file -> `article.delete` (soft) or `.destroy` (permanent).
4. Re-upload images only when their bytes change (deterministic keys make this cheap).
