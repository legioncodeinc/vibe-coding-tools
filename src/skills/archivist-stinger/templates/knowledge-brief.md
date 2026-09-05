# {product} knowledge-base brief (read fully before writing anything)

You are one knowledge-worker-bee in a fleet writing `library/knowledge/private/` for this repository in parallel. Every bee reads this same brief so the knowledge base reads as one authored artifact. Repository root: `{absolute repo path}`. Use the shell tool with forward slashes (`cat`, `sed -n`, `grep -n`) to read source.

## 1. Canonical system facts (do not contradict; verify details in code before adding more)

{The archivist fills this section from its own reading of the repository before dispatch. Every bullet must be verifiable in code and cite the file that proves it. Cover, in this order:}

- Product name in prose: **{product}**. {If the code still carries an older identifier anywhere, state exactly which identifiers (package name, binaries, env vars, storage paths) and instruct bees to write them exactly as the code accepts them.}
- Entry points: {binaries, services, or modules that a user or operator invokes, with file paths}.
- What the system is: {two or three sentences, the elevator pitch a maintainer would give}.
- Persistent state: {every file, table, or store the system owns, with the module that owns each}.
- Layering or module boundaries: {what may import what; how it is enforced}.
- Core mechanism {1}: {the thing the acquirer cares most about; the exact functions, constants, defaults, and ordering}.
- Core mechanism {2}: {...}
- Security boundaries: {what is enforced and where}.
- Known non-goals or explicitly unprotected areas: {so bees do not invent guarantees}.
- Source material: {ADRs, PRDs, in-tree agent knowledge files such as AGENTS.md, legacy docs (read-only; state if they are being relocated concurrently)}. {If there are no ADRs or PRDs say so and name what to cite instead.}

## 2. Assigned paths (every bee links to these exact paths)

New narrative docs being written by the fleet:

- `{domain}/{slug}.md`, `{domain}/{slug}.md`, ...
- `overview.md` (written last by the orchestrator; never by a bee)

Relocated legacy docs (being written concurrently by the merge bees; link by path):

- `{domain}/{relocated-slug}.md`, ...
- `public/{folder}/{slug}.md`, ...

From `library/knowledge/private/<domain>/x.md`, a public doc is reached as `../../public/<...>`.

## 3. Rules for every doc

- Write only your assigned files at `library/knowledge/private/<domain>/<slug>.md`; `mkdir -p` the folder. Do NOT create or edit any `README.md`. Do NOT write `overview.md`. Do NOT modify source code, tests, the legacy docs tree, package manifests, or any file outside your assignment.
- Header, exactly this shape:

```
# Title In Title Case

> Category: <Domain Title Case> | Version: 1.0 | Date: {Month YYYY} | Status: Active

One sentence: who reads this and what it covers.

**Related:**
- [`sibling.md`](sibling.md)
- ... (3 to 8 links: siblings in your domain first, then cross-domain docs, then relocated legacy references; relative paths only)

---
```

Category is your folder name in Title Case (`ai` becomes `AI`).

- Body: narrative prose in active voice; inverted pyramid (open every section with its most important sentence); progressive disclosure: the first H2 explains why the component exists, then the mechanism, then ground-truth technical detail (real signatures, schemas, constants, and defaults copied from source with the file path cited; real env var names; real command lines), then operational detail, then optional trade-offs or known limitations. H2 and H3 only. No bullet soup for explanations. 120 to 400 lines per doc; split if longer; schema docs may run to 500.
- Ground truth: read every source file you cite before writing. Never invent behavior, defaults, file names, or flags. If you cannot confirm a fact in code, leave it out or mark it "unverified in source". Do not copy legacy docs verbatim; explain and cite code.
- Mermaid: `flowchart TD` or `TB`, `sequenceDiagram`, `stateDiagram-v2` only; camelCase node ids; quote labels with special characters; NO explicit colors or `style` lines; NO `click` events.
- Punctuation: never use em dashes or en dashes. Use commas, colons, parentheses, periods, or semicolons.
- Attribution: never mention any person, handle, upstream repository URL, or license, and never credit reporters or contributors even where legacy docs do. Plain issue or PR numbers may be cited.
- Before reporting: (1) every Related link target exists now or is on the assigned-paths list; (2) every symbol you name exists in the file you cite (grep it); (3) a byte-level scan of your files for em and en dashes returns nothing (grep -P with `\xE2\x80[\x93\x94]`, since `\x{2014}` fails under a C locale); (4) a scan for the forbidden attribution strings returns nothing.
- Report back: each file written with its line count, the source files you read, and any facts you could not verify.
