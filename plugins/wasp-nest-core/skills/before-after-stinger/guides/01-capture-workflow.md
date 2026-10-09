# Capture workflow (before and after screenshots)

Grounded in `../references/research/distilled.md`, which cites the archived
sources in `../references/research/raw/`.

## 1. Pre-flight

```bash
which before-and-after || npm install -g @vercel/before-and-after
```

If the global install is unwanted, `npx @vercel/before-and-after` works;
always the full scoped name, the bare `before-and-after` npm name is a
different package.

## 2. Protection check (never skipped)

For any `.vercel.app` URL:

```bash
curl -s -o /dev/null -w "%{http_code}" "<url>"
```

401 or 403 means deployment protection. Then, in order:

1. `which vercel && vercel whoami` - is the CLI authenticated?
2. If yes: `vercel inspect <url>` and extract the bypass token.
3. If no: tell the user the options: provide a bypass token, take manual
   screenshots, or disable protection temporarily.

## 3. Capture

The working tree as it stands is After. The before state comes from a URL or
image the user supplies (production, preview, local port, existing file).

```bash
before-and-after "<before-url>" "<after-url>"            # basic
before-and-after url1 url2 ".hero-section"               # one selector
before-and-after url1 url2 ".old-card" ".new-card"       # per-side selector
before-and-after url1 url2 --mobile                      # 375x812
before-and-after url1 url2 --tablet                      # 768x1024
before-and-after url1 url2 --size 1280x800               # custom viewport
before-and-after url1 url2 --full                        # full scroll, only on request
before-and-after before.png after.png --markdown         # from existing images
```

Output directory defaults to `~/Downloads`; `-o <dir>` to change it.

## 4. Upload and markdown

```bash
./scripts/upload-and-copy.sh before.png after.png --markdown          # 0x0.st
IMAGE_ADAPTER=gist ./scripts/upload-and-copy.sh before.png after.png --markdown
```

When the skill folder is not present at a path the script expects (user-scope
installs), run the uploader equivalent manually: host both images, emit a two
column markdown table with alt text naming the side. The value is the hosted
pair and the table, not the specific uploader.

## 5. PR integration

```bash
which gh || { echo "no gh; paste manually"; }
gh pr view --json number,body
gh pr edit <number> --body "<existing-body>

## Before and After
<generated-markdown>"
```

Append, never overwrite: read the existing body first and reproduce it
exactly, then add the section.

## Error reference

| Error | Fix |
|---|---|
| `command not found` | `npm install -g @vercel/before-and-after` |
| `could not determine executable` | use `npx @vercel/before-and-after` |
| 401/403 on `.vercel.app` | protection flow in step 2 |
| element not found | verify the selector exists on the page |

## Standing prohibitions

Never switch branches, stash, or start servers to manufacture a before
state. Never guess a before URL: ask. Never capture `--full` unasked.
