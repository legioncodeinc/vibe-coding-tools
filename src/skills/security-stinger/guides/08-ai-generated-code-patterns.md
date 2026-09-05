# 08. AI-generated code patterns

Grounded in [references/research/distilled-security.md §10](../references/research/distilled-security.md). This guide matters more than the others for this repo specifically, because this repo is AI-built - the failure modes below are not a generic "be careful" list, they are the empirically dominant failure classes for code generated the way this codebase was generated.

## The core finding: authorization is where AI code fails, not classic injection

Across the research: 45-70% of AI-generated code samples fail security tests depending on methodology, with authorization flaws, missing access controls, and hardcoded credentials as the DOMINANT patterns - not SQL injection or XSS. A CSO Online study testing five agentic coding platforms (including Claude Code) building identical apps found ZERO exploitable SQL injection or XSS, but the most common CRITICAL vulnerability class was API authorization logic failures and broken business logic. The interpretation given in the research: modern agentic tools have gotten measurably better at avoiding classic injection patterns (which are well-represented, mechanically checkable patterns in training data), while authorization logic requires holistic, system-wide reasoning about roles and data ownership that generation-time pattern-matching does not reliably produce. [raw/security--ai-generated-code--vibe-coding-vulnerability-debt-2026.md]

**Audit implication:** weight the authorization/tenancy checklist ([03-authorization-and-tenancy.md](03-authorization-and-tenancy.md)) more heavily than a generic injection sweep, without skipping the injection sweep entirely - both matter, but authorization is where this stack's own generation process is statistically most likely to have failed.

## Insecure defaults - the exact pattern to check for in this repo

CVE-2025-48757 is the concrete precedent: Lovable-generated apps shipped without Supabase Row Level Security enabled by default, exposing 303 endpoints across 170 of 1,645 scanned apps to unauthenticated reads/writes of PII, financial records, and admin credentials. The root cause was explicitly named as a DEFAULT-behavior gap in the generating tool - "Lovable did not implement RLS unless explicitly instructed, while users lacked the security knowledge to know it was required" - not a one-off app-level mistake. [raw/security--ai-generated-code--vibe-coding-vulnerability-debt-2026.md]

This repo does not use Supabase or Lovable, but the pattern generalizes directly: never assume RLS/tenant isolation exists on a table just because the schema has a `tenant_id`/`organization_id` column. Verify it was actually enabled, forced, and policy-backed per [03-authorization-and-tenancy.md](03-authorization-and-tenancy.md) - "the AI probably added it" is not evidence.

## Hardcoded secrets are a default assumption, not an edge case

The research treats hardcoded secrets in AI-generated code as common enough to "treat as a default assumption pending scan results." A Cybernews analysis of 38,630 Android apps with AI functionality found 197,092 unique hardcoded secrets across 72% of apps analyzed. Grep for LLM-common placeholder-shaped secrets specifically (`supersecretkey`, `changeme`, generic `your-secret-key` strings) - these recur across generated codebases because LLMs reproduce patterns from training data, including the placeholder secrets present in that training data. [raw/security--ai-generated-code--vibe-coding-vulnerability-debt-2026.md]

## Package hallucination / slopsquatting

19.7% of AI-suggested dependencies in a 576,000-sample study across 16 LLMs were hallucinated - references to packages with no real published counterpart on PyPI/npm. 43% of hallucinated names recurred consistently across repeated queries, making them predictable and registrable by an attacker ahead of time ("slopsquatting"). Audit check: confirm every dependency in `package.json` actually resolves to a real, expected package on the npm registry - a name that looks slightly off, or that nobody on the team recognizes adding deliberately, is worth a direct registry lookup before trusting it. [raw/security--ai-generated-code--vibe-coding-vulnerability-debt-2026.md]

## Miscalibrated trust is the reason this gate exists

Over 75% of developers surveyed believe AI-generated code is MORE secure than human-written code, while 56% of that same group admit AI-generated code sometimes or frequently introduces security issues into their own codebases; under 25% run software composition analysis on AI-generated suggestions; roughly 80% admit bypassing security policy at some point in an AI-assisted workflow. The research names this combination - elevated confidence, reduced verification - as the actual mechanism by which vulnerabilities go undetected until exploitation. [raw/security--ai-generated-code--vibe-coding-vulnerability-debt-2026.md]

This is the concrete justification for why security-stinger runs as a mandatory, first-in-order Ship Gate step rather than an optional pass a developer (human or agent) can decide to skip - the research is explicit that self-assessment by the same process that generated the code is not a reliable substitute for an independent check.

## Iterative degradation

A 2025 study found that after 40 successive AI-driven modifications to the same codebase, the result contained 37% MORE critical vulnerabilities than the initial output after only five iterations - each revision is an opportunity for previously-present security logic to be silently omitted or weakened, and this compounds in ways not visible iteration-by-iteration. Audit implication for a long-lived AI-maintained codebase: a security pass that only looks at the current diff, without periodically re-verifying previously-audited surfaces (auth, tenancy, webhook handlers) haven't regressed under later unrelated changes, will miss this class of drift. The Ship Gate's re-evaluation requirement (see [01-audit-procedure.md](01-audit-procedure.md)) is one structural mitigation; it is not a complete one, and periodic full re-audits (not just diff-scoped ones) are worth scheduling independent of any single feature branch. [raw/security--ai-generated-code--vibe-coding-vulnerability-debt-2026.md]
