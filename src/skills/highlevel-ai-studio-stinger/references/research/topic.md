# Topic lock: HighLevel AI Studio

- Component type: Stinger with a paired Bee
- Stinger: `highlevel-ai-studio-stinger`
- Bee: `highlevel-ai-studio-worker-bee`
- Target harnesses: Claude Code, Cursor, ChatGPT Codex, and Claude Cowork
- Domain: HighLevel AI Studio and the user-facing AI creation surface selector
- Research window: 2026-03-03 through 2026-09-03
- Source priority: official HighLevel Support Portal first, official HighLevel product blog second
- Ship Gate classification: development-capable operational component, because it can direct code-level changes and publishing work

## Owned work

The pair deeply owns HighLevel AI Studio projects: access, project briefs, prompting, Visual Edits, Code Editor changes, versions, forms, calendars, workflow triggers, preview, publishing, domains, SEO, cloning, snapshots, usage, and troubleshooting.

The pair also resolves ambiguous HighLevel phrases before work begins. `AI Content Studio` and `AI website builder` are treated as ambiguous. The pair selects among AI Studio, Content AI, Ask AI, Funnel & Website AI, Email AI, Blog Post AI, and the WordPress AI-Powered Page Builder based on the destination asset and UI path.

## Explicit boundaries

- Agent Studio nodes, event-driven agents, tools, and agent runtime design are not AI Studio work.
- OAuth, Private Integration Tokens, REST resources, SDKs, and webhook implementation belong to `gohighlevel-stinger`.
- General website implementation outside HighLevel belongs to `website-stinger` or the stack-specific development Stinger.
- Security assessment of generated code, sensitive data, domains, forms, and third-party scripts belongs to `security-stinger`.
- General SEO strategy outside the HighLevel product workflow belongs to the relevant SEO Stinger.

## Completion criteria

1. Archive a current, in-window primary-source corpus with provenance headers.
2. Produce a cited distillation with conflicts and gaps kept visible.
3. Build runtime references, templates, checklists, and focused guides from that distillation.
4. Author the root `SKILL.md` last with portable six-field frontmatter.
5. Create and cross-link the paired Bee.
6. Register the pair in Beekeeper-Suit without disturbing existing work.
7. Generate all supported harness outputs and validate the skill and agent with zero errors.
8. Run Security, then Quality, then the orchestrator-level repository health gate before any commit or push.
