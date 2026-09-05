# DevOps Audit / Design Output: {{project-name}}

**Date:** {{YYYY-MM-DD}}
**Reviewer:** devops-worker-bee
**Scope:** {{branch / PR / new pipeline / depot migration}}
**Stack:** {{captured from inventory, Node version, package manager, framework, deploy target, existing Depot wiring, scan tooling}}

---

## Executive summary

{{2-4 sentence synthesis. Lead with the headline finding. Mention severity counts and top recommendation.}}

## Inventory captured

| Artifact | Status | Notes |
|---|---|---|
| `Dockerfile` | {{present / absent / multiple}} | {{base image, stages, USER, HEALTHCHECK}} |
| `.dockerignore` | {{present / canonical / missing / stale}} | |
| `docker-compose*.yml` | {{present / absent}} | {{profiles, healthchecks, secrets}} |
| `.github/workflows/*.yml` | {{count}} | {{actions used, OIDC, permissions}} |
| `package.json` Node version | | {{matches Dockerfile?}} |
| Depot wiring | {{present / absent}} | |
| Scan tooling | {{Trivy / Scout / none}} | |
| Make / Bake | {{present / absent}} | |

## Pillar ratings

Ratings: Solid / Drifting / Needs work

| Pillar | Rating | Headline finding |
|---|---|---|
| Dockerfile patterns (`guides/01`) | | |
| Multi-arch (`02`) | | |
| Compose for dev (`03`) | | |
| Image scanning (`04`) | | |
| Actions architecture (`05`) | | |
| Actions security (`06`) | | |
| Depot integration (`07`) | | |
| Caching (`08`) | | |
| Pipeline shapes (`09`) | | |
| Local-CI parity (`10`) | | |

## Findings

### Must-fix ({{count}})

1. **`{{file:line}}`**: {{one-line summary}}
   - Reason: {{citation, guide section + research note or external URL}}
   - Fix: {{specific change}}

2. ...

### Should-refactor ({{count}})

1. **`{{file:line}}`**: ...

### Style ({{count}})

1. **`{{file:line}}`**: ...

## Metrics captured (where available)

| Metric | Current | Target | Delta |
|---|---|---|---|
| PR build duration (cold) | {{min}} | < 5 min | |
| PR build duration (warm) | {{sec}} | < 90 sec | |
| Main deploy duration | {{min}} | < 5 min | |
| Image size | {{MB}} | < 500 MB | |
| Cache hit rate (warm) | {{%}} | > 80% | |
| Trivy CRITICAL count | {{n}} | 0 | |
| Trivy HIGH count (fixed) | {{n}} | 0 | |
| Actions minutes / month | {{est}} | | |

## Cross-Bee handoffs

- [ ] `security-worker-bee`: {{if any secret-leak / CVE / token-scope concern surfaced}}
- [ ] `db-worker-bee`: {{if migration step needs authoring or schema-level concern flagged}}
- [ ] `library-worker-bee`: {{if pipeline change is large enough to warrant PRD authoring}}
- [ ] `quality-worker-bee`: {{post-implementation verification}}
- [ ] `react-worker-bee`: {{if Node version / workspace decisions affect the React app}}

## Recommended next steps

1. {{highest-leverage fix, e.g., "pin all actions to SHA via scripts/pin-actions-to-sha.sh"}}
2. {{next}}
3. {{next}}

## References

- `guides/...` ({{list the guides actually cited}})
- `research/...` ({{list the research notes referenced}})
- {{external URLs cited inline above}}

---

*Produced by devops-stinger. See `SKILL.md` for methodology.*
