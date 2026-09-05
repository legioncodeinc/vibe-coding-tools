# Tool Recommendation: Output Template

*Fill in this template when `ai-coding-tools-worker-bee` produces a recommendation. Delete sections that don't apply to the user's scenario.*

---

## Recommendation summary

**Recommended tool(s):** [Tool name(s), e.g., "Cursor + Aider (architect/editor)"]
**Tier:** [Tier 1 interactive-pair | Tier 2 hybrid-agent | Tier 3 fully-autonomous | Tier 4 rapid-scaffold]
**Confidence:** [High | Medium | Low]: [one-line rationale]

---

## Why this tool fits your workflow

[2-3 sentences explaining the match between the user's Q1-Q5 answers and the tool's strengths. Cite specific data points from guides when available.]

---

## Configuration to get started

[Paste the minimal working config for the recommended tool. Use one of the formats below.]

### Option A: Aider `.aider.conf.yml`

```yaml
model: [architect-model]
editor-model: [editor-model]
auto-commits: [true/false]
show-diffs: true
read:
  - [always-in-context reference file]
```

### Option B: Claude Code `CLAUDE.md`

```markdown
# Project: [Name]

## Architecture
[Key directories and their roles.]

## Development Commands
[Exact commands to build/test/run.]

## Coding Conventions
[Key rules.]

## Do Not Touch
[Protected files/patterns.]
```

### Option C: Other tool setup note

[Brief setup instructions for Cline, Windsurf, Continue.dev, Bolt, or Devin as applicable.]

---

## Cost estimate

| Component | Model | Est. monthly cost |
|-----------|-------|-----------------|
| [Tool / phase] | [Model name] | $[amount] |
| **Total** | | **$[total]** |

*Benchmark source: [SWE-bench Verified 2026-05-20 / Aider polyglot leaderboard 2026-05-20 / practitioner comparison 2026-05-20]*

---

## Known footguns for this tool

[List 1-3 relevant footguns from `guides/05-footguns.md` that apply to this user's scenario. Include the fix.]

- **[Footgun name]:** [One-line description and fix.]

---

## Cross-link for deeper configuration

[If the recommendation involves Cursor IDE configuration, add:]
> For deep Cursor configuration (rules, MCP servers, Cloud Agents): consult `cursor-ide-worker-bee`.

[If the recommendation involves LLM provider/gateway selection beyond tool-specific routing:]
> For LLM provider and gateway architecture (Portkey, OpenRouter, Bedrock): consult `ai-tools-platform-worker-bee`.

---

## Next step

[One sentence: what the user should do first.]
