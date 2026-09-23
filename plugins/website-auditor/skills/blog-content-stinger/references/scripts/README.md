# Scripts

Deterministic scripts shared across multiple Stingers live in the plugin-root `shared/scripts/` folder, per `shared/scripts/README.md`. This pair has no entry there, its detection-and-word-count problem is specific to the blog-content audit, so its one script lives locally instead of being force-fit into the shared catalog.

| Script | Purpose | Deterministic? |
|---|---|---|
| `select-recent-posts.py` | Finds blog-path candidates in `site-data/`, extracts a publish date (JSON-LD `datePublished`, `article:published_time`, `<time datetime>`, or markdown frontmatter `date:`, in that priority order), keeps the 10 most recent, and computes a word count per kept post from its paired markdown file. | Yes, entirely. Recency ranking and word count are the only two facts in this Drone's job that are genuinely mechanical. |

What this script does NOT do, and why: it does not run or approximate the `[subjective]` quality read, and it does not produce or influence the AI-authorship probability band. Both of those are reasoning outputs grounded against `references/research/distilled-blog-content.md`, not something a deterministic script can responsibly emit, per this Stinger's binding conduct rule (see `guides/03-ai-authorship-probability-band-reporting.md`). Feeding a script's raw output as if it were a probability band would itself violate that rule by dressing up an unsourced number as a method.

Run it with the Bash tool, no absolute paths baked in, pass `--site-data` as the actual run's `site-data/` directory:

```
python3 references/scripts/select-recent-posts.py --site-data <run-workspace>/site-data --count 10 --out <run-workspace>/11-blog/post-selection.json
```
