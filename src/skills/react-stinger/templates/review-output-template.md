# React Architecture Review: {{project-name}}

**Date:** {{YYYY-MM-DD}}
**Reviewer:** react-worker-bee
**Scope:** {{branch / diff / module}}
**Stack:** {{captured from package.json: React X, bundler Y, state libs, data libs, test runner}}

---

## Executive summary

{{2-4 sentence synthesis. Lead with the headline finding. Mention severity counts.}}

## Pillar ratings

Ratings: 🟢 Solid · 🟡 Drifting · 🔴 Needs work

| Pillar | Rating | Headline finding |
|---|---|---|
| Project structure (`guides/01`) | | |
| Components & composition (`02`) | | |
| State management (`03`) | | |
| Data layer (`04`) | | |
| Error handling (`05`) | | |
| Forms (`06`) | | |
| Performance (`07`) | | |
| Testing (`08`) | | |
| TypeScript (`09`) | | |
| React 19 idioms (`10`) | | |
| Server Components (`11`) (if applicable) | | |
| Anti-patterns (`12`) | | |

## Findings

### Must-fix ({{count}})

1. **`{{file:line}}`**: {{one-line summary}}
   - Reason: {{citation: guide section or URL}}
   - Fix: {{how}}

2. ...

### Should-refactor ({{count}})

1. **`{{file:line}}`**: ...

### Style ({{count}})

1. **`{{file:line}}`**: ...

## Metrics captured

| Metric | Value | Target | Delta |
|---|---|---|---|
| First-load JS (worst route) | {{KB gz}} | {{from guides/07}} | |
| LCP (4G) | {{s}} | ≤ 2.5s | |
| INP (p75) | {{ms}} | ≤ 200ms | |
| Test coverage | {{%}} | ≥ 70% | |
| Test runtime | {{s}} | | |
| Anti-pattern findings | {{count}} | 0 must-fix | |

## Cross-Bee handoffs

- [ ] `ux-ui-svelte-worker-bee`: {{if any visual / token findings}}
- [ ] `seo-aeo-worker-bee`: {{if any Next.js SEO findings}}
- [ ] `security-worker-bee`: {{if any auth / Server Action / storage findings}}
- [ ] `library-worker-bee`: {{if refactor big enough to warrant a PRD}}
- [ ] `quality-worker-bee`: {{post-fix verification}}

## Recommended next steps

1. {{highest-leverage fix}}
2. {{next}}
3. {{next}}

## References

- `guides/...` ({{list the guides actually cited in findings}})
- `research/...` ({{list the research notes referenced}})
- {{external URLs}}

---

*Produced by react-stinger. See `SKILL.md` for methodology.*
