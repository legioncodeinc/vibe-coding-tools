---
source_url: https://www.codesota.com/browse/agentic/swe-bench/swe-bench-verified-agentic
retrieved_on: 2026-05-20
source_type: benchmark-leaderboard
authority: official
relevance: critical
topic: benchmarks
stinger: ai-coding-tools-stinger
---

# SWE-bench Verified Leaderboard: 2026 AI Coding Agent Scores

## Summary

SWE-bench Verified is the primary authoritative benchmark for AI coding agents. It is a human-filtered subset of 500 real GitHub issues from Python repositories where agents must produce code patches that pass full test suites. As of May 2026, scores have risen dramatically from the initial 1.96% baseline in October 2023, with the top systems now exceeding 93%.

## Key quotations / statistics

- "The benchmark measures end-to-end autonomous coding performance, representing a 41× improvement from the initial 1.96% score achieved in October 2023"
- "Human annotators have reviewed each instance to ensure problem descriptions are clear, test patches are correct, and tasks are solvable"

## Top performers (May 2026): language model focused (Bash-only evaluation)

| Model | Score |
|-------|-------|
| Claude Mythos Preview (Anthropic) | 93.90% |
| Claude Opus 4.5 API (Anthropic) | 80.90% |
| Claude Opus 4.6 API (Anthropic) | 80.80% |
| Gemini 3.1 Pro API (Google) | 80.60% |
| GPT-5.2 API (OpenAI) | 80.00% |

## Top performers: full agentic systems

| Agent + System | Score |
|----------------|-------|
| Claude Opus 4.5 + live-SWE-agent | 79.2% |
| Claude Opus 4.5 + Sonar Foundation Agent | 79.2% |
| Doubao-Seed-Code (ByteDance) + TRAE | 78.8% |

## Independent evaluation (vals.ai, June 2025)

| Model | Score |
|-------|-------|
| GPT 5.5 | 82.60% |
| Claude Opus 4.7 | 82.00% |
| Gemini 3.1 Pro Preview | 78.80% |

## Canonical leaderboard URL

Primary: https://www.swebench.com/verified  
Independent: https://www.vals.ai/benchmarks/swebench-06-13-2025  
CodeSOTA comprehensive: https://www.codesota.com/browse/agentic/swe-bench

## Annotations for stinger-forge

- This is the authoritative source for `guides/02-benchmark-data.md`. ALL capability claims in that guide must cite SWE-bench with a date.
- Note that SWE-bench scores primarily reflect the underlying LLM capability, not the scaffolded tool (Cursor, Aider, Cline) that wraps the model. The tool adds UX, context management, and workflow integration ON TOP of the model score.
- The 93.90% Claude Mythos Preview score is a research preview, not available in production tools. For production guidance, the practical ceiling is ~80%.
- The benchmark covers Python repos only: stinger-forge should note this is not representative of polyglot codebases (JavaScript, TypeScript, Go, etc.).
- Stinger-forge should flag that SWE-bench scores change monthly. The guide must include the retrieval date and a "last verified" timestamp.
- Aider's own polyglot leaderboard (aider.chat/docs/leaderboards) is a complementary source for non-Python benchmarks.
