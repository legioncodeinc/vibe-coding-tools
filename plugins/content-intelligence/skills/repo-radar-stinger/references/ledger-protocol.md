# Topic ledger protocol (shared by viral-news-stinger and repo-radar-stinger)

The ledger is the shared memory of every topic and repo already covered, so no run ever repeats one. It lives in the user's persistent Claude memory filesystem, which follows the account across sessions and surfaces. Routine runs are fresh sessions; the ledger is the only thing connecting them.

## Location

Memory file: `/areas/content-post-ledger.md`

Access it with the memory tools (`memory_list`, `memory_read`, `memory_str_replace`, `memory_write`). If the memory tools are deferred, load them first (in Cowork, via ToolSearch).

## File format

```
---
name: content-post-ledger
description: Ledger of news topics and GitHub repos already turned into social posts by the viral-news and repo-radar skills. Read before every run to avoid repeats.
sources:
  - cowork
---
# Covered topics and repos

[stated] 2026-08-17 | news | example-topic-slug | https://source.example.com/story
[stated] 2026-08-17 | repo | owner/repo-name | https://github.com/owner/repo-name
```

One line per covered item: date | kind (news or repo) | slug | canonical link. Keep slugs short and recognizable (the story's subject, or owner/repo).

## Read protocol (start of EVERY run, before any searching)

1. `memory_list` to confirm the file exists.
2. If it exists, `memory_read` it and hold every slug and link in mind as the exclusion list.
3. If it does not exist, create it with `memory_write` (if_version "new") using the format above, with no entries yet.

A topic is a repeat if it matches a ledger entry by slug, by link, or by substance (same underlying story or repo under a different headline). Substance matches count as repeats. When in doubt, it is a repeat: pick the next candidate.

## Write protocol (end of a run that produced a post)

Append ONE line for the topic covered, using `memory_str_replace` (anchor on the last existing line) or by rewriting the file with the new line added. Include the version token from the read. On a version conflict, merge with the current content and retry once.

A run that produced NO post writes NOTHING to the ledger.

## Hygiene

When the file grows past roughly 150 entries, condense: keep the last 60 days of lines verbatim and collapse older entries into a single summary line per month (topics from that month, comma-separated slugs). Never delete the file.
