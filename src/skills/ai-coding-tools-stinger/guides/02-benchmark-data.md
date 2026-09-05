# Guide 02: Benchmark Data: What the Numbers Actually Mean

*Sources: `research/external/2026-05-20-swe-bench-leaderboard.md`, `research/external/2026-05-20-aider-llm-leaderboard.md`*
*Last verified: 2026-05-20: **always cite this date and note scores change monthly***

---

## Two complementary benchmarks

No single benchmark covers everything. Use both together:

| Benchmark | Coverage | Authority | URL |
|-----------|----------|-----------|-----|
| **SWE-bench Verified** | Python repos only, 500 real GitHub issues | Official (Princeton/CMU) | https://www.swebench.com/verified |
| **Aider polyglot leaderboard** | Multiple languages, edit format accuracy | Official (Aider project) | https://aider.chat/docs/leaderboards |

**Critical caveat:** SWE-bench measures raw LLM capability at the model level, not the scaffolded tool performance. A tool like Cursor or Aider adds UX, context management, and workflow integration ON TOP of the model score. The tool's UX quality matters beyond the benchmark number. Source: `research/external/2026-05-20-swe-bench-leaderboard.md`.

---

## SWE-bench Verified scores (May 2026)

The benchmark has improved 41x from its October 2023 baseline of 1.96%.

### Top language models (Bash-only evaluation)

| Model | Score | Note |
|-------|-------|------|
| Claude Mythos Preview (Anthropic) | 93.90% | Research preview only, NOT production |
| Claude Opus 4.5 API | 80.90% | Production ceiling |
| Claude Opus 4.6 API | 80.80% | Production |
| Gemini 3.1 Pro API | 80.60% | Production |
| GPT-5.2 API | 80.00% | Production |

### Top full agentic systems

| Agent + System | Score |
|----------------|-------|
| Claude Opus 4.5 + live-SWE-agent | 79.2% |
| Claude Opus 4.5 + Sonar Foundation Agent | 79.2% |
| Doubao-Seed-Code (ByteDance) + TRAE | 78.8% |

### Independent evaluation (vals.ai, June 2025)

| Model | Score |
|-------|-------|
| GPT-5.5 | 82.60% |
| Claude Opus 4.7 | 82.00% |
| Gemini 3.1 Pro Preview | 78.80% |

**Practical production ceiling: ~80%.** The 93.90% score (Claude Mythos Preview) is a research artifact not available in any production tool as of 2026-05-20.

Source: `research/external/2026-05-20-swe-bench-leaderboard.md`

---

## Aider polyglot leaderboard (May 2026)

Aider's leaderboard tests across multiple programming languages: a critical complement to SWE-bench's Python-only coverage.

| Model | Pass Rate (2nd attempt) |
|-------|------------------------|
| GPT-5 (high reasoning) | 88.0% |
| o3-pro (high) | 84.9% |
| GPT-5 (medium reasoning) | 86.7% |
| Gemini 2.5 Pro | 83.1% |
| GPT-5 (low reasoning) | 81.3% |

Source: `research/external/2026-05-20-aider-llm-leaderboard.md`

---

## Tool-level quality scores (practitioner benchmark, 2026)

The following scores come from a practitioner-authored real-world comparison, not SWE-bench:

| Tool | Code quality score | Notes |
|------|-------------------|-------|
| Claude Code | 9.5/10 | Highest quality, highest token cost |
| Aider | 8.4/10 | Best efficiency ratio |
| Cline | 8.3/10 | Comparable to Aider but more reliability issues |

Source: `research/external/2026-05-20-claude-code-aider-cline-comparison.md`

---

## How to use benchmark data in a recommendation

1. **Lead with the use case, not the score.** A tool with a higher SWE-bench score is not automatically better for your codebase if it uses 3x more tokens.
2. **Cross-reference both benchmarks** when the user's codebase is polyglot (not Python-only).
3. **Flag the Python-only caveat** explicitly for non-Python projects.
4. **Include the retrieval date** in every cited score. Scores change monthly.
5. **Distinguish model score from tool score.** The underlying model's SWE-bench score does not equal the tool's performance: the tool's context management, file handling, and workflow UX add or subtract from the raw model capability.

> **TODO: open question**: Devin 2.0's current SWE-bench score was not definitively captured in research. The 14% figure in research notes is from Devin 1.x early benchmarks. Re-fetch from https://www.swebench.com/verified before citing Devin's score in a recommendation.
