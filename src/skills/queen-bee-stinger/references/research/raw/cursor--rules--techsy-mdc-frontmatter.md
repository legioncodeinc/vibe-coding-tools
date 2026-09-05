# Cursor Rules: .mdc Frontmatter, globs & alwaysApply | TECHSY
- URL: https://techsy.io/en/blog/cursor-rules-guide
- Fetched: 2026-08-14
- Source type: community
- Component: rules

Written by Mert Batur. Updated Jul 5, 2026.

## What Are Cursor Rules and Why Do They Matter?

Cursor rules are markdown files that act as a permanent system prompt injected before every AI interaction, chat, autocomplete, code generation, all of it. Think of them as onboarding docs for the AI. Instead of correcting the same mistakes every session, you write the instruction once and it sticks.

The old approach was a single `.cursorrules` file in your project root. That still works, but it's deprecated. The current system uses a `.cursor/rules/` directory with individual `.mdc` (Markdown Cursor) files, each scoped to specific situations. This is a much better setup because you're not cramming every instruction into one giant file, you split rules by concern, and Cursor only loads the ones relevant to what you're doing right now.

## Setting Up Your First Rule File

Create the `.cursor/rules/` directory at your project root:

```bash
mkdir -p .cursor/rules
```

Each rule is a `.mdc` file with YAML frontmatter followed by markdown content:

```yaml
---
description: "When this rule should apply"
globs: ["src/components/**/*.tsx"]
alwaysApply: false
---

Your instructions go here in plain markdown.
```

Three frontmatter fields control everything:

| Field | Type | Purpose |
| --- | --- | --- |
| `alwaysApply` | boolean | Include in every AI request when `true` |
| `description` | string | Helps the agent decide if this rule is relevant |
| `globs` | string[] | File patterns that trigger this rule |

You can also create rules through Cursor itself, type `/create-rule` in chat and describe what you want. But writing them by hand gives you more control.

## The Four Rule Types Explained

### Always Apply

```yaml
---
alwaysApply: true
---
```

Loaded into every single AI request. Use this sparingly, for project-wide fundamentals like your tech stack declaration or critical conventions that apply everywhere. Every always-on rule eats tokens from every interaction, whether relevant or not.

### Auto-Attached (Glob-Based)

```yaml
---
globs: ["src/api/**/*.ts", "src/routes/**/*.ts"]
alwaysApply: false
---
```

Activates only when you're editing files that match the glob patterns. This is the workhorse rule type. Your React component conventions load when you're in component files, your API patterns load when you're in route handlers, your test rules load when you're writing tests.

### Agent-Requested (Intelligent)

```yaml
---
description: "Database migration patterns using Drizzle ORM"
alwaysApply: false
---
```

No globs, no always-apply, just a description. Cursor's agent reads the description and decides whether the rule is relevant to the current task. If you ask it to write a migration, it pulls in this rule. If you're styling a button, it skips it. This works surprisingly well for rules that don't map neatly to file paths.

### Manual

```yaml
---
---
```

No frontmatter fields set (or empty frontmatter). These rules only activate when you explicitly mention them with `@rule-name` in chat. Good for rarely-used but important instructions, like deployment checklists or refactoring guides you only need occasionally.

| Rule Type | When It Loads | Best For |
| --- | --- | --- |
| Always Apply | Every request | Tech stack, critical conventions |
| Auto-Attached | Matching file open | Framework patterns, file-type rules |
| Agent-Requested | Agent decides | Cross-cutting concerns, workflows |
| Manual | @-mentioned | One-off tasks, checklists |

## Glob Patterns That Actually Work

Globs determine which files trigger auto-attached rules. Get them wrong and your rules either never fire or fire everywhere.

```yaml
# All TypeScript files in src
globs: ["src/**/*.ts", "src/**/*.tsx"]

# Only component files
globs: ["**/components/**/*.tsx"]

# Python files, excluding tests
globs: ["**/*.py", "!**/test_*.py"]

# Multiple specific directories
globs: ["src/api/**", "src/services/**"]
```

A few gotchas from real usage:

- `src/*` only matches one directory level. You almost always want `src/**/*` for recursive matching.
- `*.js` won't match `.jsx` or `.ts` files. Be explicit about extensions.
- Globs must be a YAML list. The brace syntax like `{src,lib}/**/*.ts` can fail silently, stick with separate list entries.
- The `!` prefix excludes patterns, which is useful for ignoring generated files or legacy code.

## Practical Rule Examples

### Project-Wide Base Rule (Always Apply)

```yaml
---
alwaysApply: true
---

# Project: Acme Dashboard

## Tech Stack
- Next.js 15 (App Router only — no Pages Router)
- TypeScript strict mode
- Tailwind CSS v4
- Drizzle ORM with PostgreSQL
- pnpm for package management

## Critical Conventions
- All components are React Server Components by default
- Use "use client" only when the component needs interactivity
- Import paths use @/ alias mapped to src/
- Error handling: wrap async operations in try/catch, never use .catch()
- No default exports except for pages and layouts
```

Keep this under 30 lines. It's loaded with every request, so every word costs tokens.

### React Component Rule (Auto-Attached)

```yaml
---
description: "React component patterns and conventions"
globs: ["src/components/**/*.tsx", "src/app/**/*.tsx"]
alwaysApply: false
---

# React Component Rules

## Structure
Every component file follows this order:
1. Imports
2. Type definitions (Props interface)
3. Component function (named export)
4. Sub-components (if any)

## Patterns

Use named exports, not default:
- YES: `export function Button({ label }: ButtonProps)`
- NO: `export default function Button()`

For data fetching in Server Components:
```tsx
// Fetch directly in the component, no useEffect
export async function UserProfile({ id }: { id: string }) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id)
  });
  return <div>{user.name}</div>;
}
```

## Anti-Patterns (NEVER do these)

- No useEffect for data fetching in Server Components
- No CSS modules — use Tailwind exclusively
- No barrel exports (index.ts re-exports)
- No prop drilling beyond 2 levels — use context or composition
```

### Python API Rule (Auto-Attached)

```yaml
---
description: "FastAPI endpoint conventions and patterns"
globs: ["src/api/**/*.py", "src/routes/**/*.py"]
alwaysApply: false
---

# FastAPI Conventions

## Endpoint Structure
- Use APIRouter for route grouping
- Type all request/response models with Pydantic v2
- Dependency injection for database sessions

## Pattern
```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    db: AsyncSession = Depends(get_db)
) -> UserResponse:
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse.model_validate(user)
```

## Error Handling

- Always use HTTPException, not raw Response objects
- Log errors with structlog before raising
- Return consistent error shapes: {"detail": "message"}
```

### Go Service Rule (Auto-Attached)

```yaml
---
description: "Go service patterns and error handling"
globs: ["**/*.go", "!**/*_test.go"]
alwaysApply: false
---

# Go Conventions

## Error Handling
- Always handle errors immediately — no _ for error returns
- Wrap errors with fmt.Errorf("context: %w", err)
- Use sentinel errors for expected failure cases

## Project Layout
- cmd/ for entrypoints
- internal/ for private packages
- pkg/ for public libraries

## Pattern
```go
func (s *UserService) GetByID(ctx context.Context, id string) (*User, error) {
    user, err := s.repo.Find(ctx, id)
    if err != nil {
        if errors.Is(err, ErrNotFound) {
            return nil, fmt.Errorf("user %s: %w", id, ErrNotFound)
        }
        return nil, fmt.Errorf("fetching user %s: %w", id, err)
    }
    return user, nil
}
```
```

## Managing the Token Tax

Here's something most Cursor guides skip: every rule you write costs tokens. A project with 20 always-on rules might burn **2,000+ tokens per request** just on instructions, before the AI even looks at your code.

That matters because Cursor's chat context is roughly 20,000 tokens in standard mode. If your rules eat 25% of that, you've lost a quarter of the AI's "thinking space" for your actual question. You'll notice worse output quality as rules pile up, especially in longer conversations.

Three principles keep your token budget healthy:

1. **Use auto-attached and agent-requested rules aggressively.** Only your project stack declaration should be always-on. Everything else should load conditionally.
2. **Write dense, not wordy.** Replace "It is strongly recommended that developers use TypeScript interfaces rather than type aliases when defining public API contracts" with "Prefer `interface` over `type` for public APIs."
3. **Apply the Rule of Three.** Only codify a pattern as a rule after the AI gets it wrong three times.

You can monitor token usage in the status bar at the bottom of Cursor's chat panel.

## Organizing Rules for a Real Project

A production project typically needs 5-8 rule files:

```text
.cursor/rules/
  base.mdc            # Tech stack, always-apply (< 30 lines)
  components.mdc      # React/Vue patterns, glob to component dirs
  api.mdc             # Backend conventions, glob to API dirs
  database.mdc        # ORM patterns, glob to models/migrations
  testing.mdc         # Test conventions, glob to test files
  deployment.mdc      # CI/CD patterns, manual trigger
  personal.mdc        # Your preferences (gitignored)
```

Commit everything to version control except `personal.mdc`. That way your entire team gets the same AI behavior, which is the whole point.

If you're working with other AI coding tools alongside Cursor, the concepts transfer directly. Claude Code uses CLAUDE.md, while Codex reads AGENTS.md, GitHub Copilot has instruction files, and Windsurf has its own format, but the underlying principle is identical.

## How Rule Precedence Works

When multiple rules apply to the same file, Cursor follows a clear hierarchy:

| Priority | Source | Override Behavior |
| --- | --- | --- |
| 1 (highest) | Team Rules (dashboard) | Cannot be disabled by users |
| 2 | Project Rules (.cursor/rules) | Override user rules |
| 3 | User Rules (Cursor settings) | Global defaults |

Team rules are available on Team and Enterprise plans. They're set in the Cursor dashboard by admins and enforced across the organization, individual developers can't turn them off.

Within project rules, if two rules apply to the same file and conflict, the behavior isn't strictly defined. In practice, rules loaded later tend to take precedence. Numbering your files (`001-base.mdc`, `002-components.mdc`) gives you predictable ordering.

## Common Mistakes and How to Fix Them

- Writing rules that are too vague. "Write clean code" tells the AI nothing. "Use named exports, not default exports. Structure components as: imports, types, function, sub-components" gives it something actionable.
- Making everything always-apply. Your first instinct is to set `alwaysApply: true` on every rule. Resist it. Audit your rules quarterly, if you have more than 2-3 always-on rules, you're probably wasting tokens.
- Forgetting to test rules. After writing a rule, open a relevant file and ask Cursor to generate something that should follow the rule. If it doesn't, your glob pattern might be wrong, or the instruction isn't clear enough.
- Not documenting anti-patterns. Telling the AI what to do is half the job. Telling it what not to do is the other half. Include a "NEVER do these" section in each rule with explicit examples of the wrong approach.
- Ignoring rule saves in the UI. A known bug causes rule edits to disappear. If changes vanish, close Cursor completely, select "Override" on the unsaved changes popup, and reopen.

## Cursor Rules vs CLAUDE.md vs AGENTS.md

| Feature | .cursor/rules | CLAUDE.md | AGENTS.md |
| --- | --- | --- | --- |
| Format | MDC with frontmatter | Plain markdown | Plain markdown |
| Glob scoping | Yes | No | Directory-level |
| Rule types | 4 (always, auto, agent, manual) | Always-on | Always-on |
| Token control | Fine-grained | Coarse | Coarse |
| Version control | Yes | Yes | Yes |
| Works in | Cursor only | Claude Code | Multiple tools |

Cursor's advantage is granularity. CLAUDE.md and AGENTS.md are simpler, they load everything always. Cursor lets you load the right rules at the right time, which matters once your instruction set grows beyond a few hundred lines.

## FAQ

### Is .cursorrules deprecated?

Yes. The single `.cursorrules` file at your project root still works, but Cursor recommends migrating to `.cursor/rules/*.mdc` files. The new format supports glob patterns, conditional loading, and better organization.
