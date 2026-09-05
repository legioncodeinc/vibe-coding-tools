# 09: TypeScript Patterns

Source: `research/2026-04-24-forms-rhf-zod.md`, `research/2026-04-24-bulletproof-react-api-layer.md`.

## `tsconfig.json` baseline (non-negotiable)

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true,
    "verbatimModuleSyntax": true,
    "moduleResolution": "bundler",
    "target": "ES2022",
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "jsx": "preserve"
  }
}
```

A project without `strict: true` is always a finding. `noUncheckedIndexedAccess` catches array out-of-bounds bugs at type-check; highly recommended.

## Zod at the boundary

External data is **parsed, not cast**. The boundary is anywhere untrusted data enters the app: API response, `FormData`, URL param, `localStorage`, `postMessage`, clipboard.

```ts
const User = z.object({ id: z.string(), email: z.string().email() });
type User = z.infer<typeof User>;

const user = User.parse(await fetchUser(id)); // runtime + compile-time
```

Cast without parse is always a finding:

```ts
// bad
const user = (await fetchUser(id)) as User;
// good
const user = User.parse(await fetchUser(id));
```

See `guides/04-data-layer.md §the-3-part-request-declaration` for the canonical fetcher.

## `satisfies` vs `as`

```ts
// bad — silently widens, can lie about the shape
const routes = {
  home: '/',
  about: '/about',
} as Record<string, string>;

// good — checks + preserves narrow type
const routes = {
  home: '/',
  about: '/about',
} satisfies Record<string, string>;
// typeof routes.home === '/' (literal)
```

`as` is for:
- Informing TS of something it can't know (e.g., `document.querySelector('x') as HTMLInputElement`).
- Inside a Zod schema → type bridge.

`as` is **not** for narrowing a `unknown` from user input. That's Zod's job.

## Branded types for IDs

```ts
type UserId = string & { __brand: 'UserId' };
type PostId = string & { __brand: 'PostId' };

function createUserId(s: string): UserId { return s as UserId; }

function getPost(id: PostId) { /* ... */ }
const u = createUserId('u_123');
getPost(u); // ✗ compile error — UserId not assignable to PostId
```

Use when IDs are semantically distinct and the app has bugs from swapping them (e.g., "I passed the user ID to `deletePost`").

## Discriminated unions

```ts
type Request =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: User }
  | { status: 'error'; error: Error };

function render(r: Request) {
  switch (r.status) {
    case 'success': return r.data.email; // narrowed
    case 'error': return r.error.message; // narrowed
    case 'loading': return 'Loading…';
    case 'idle': return null;
  }
}
```

Exhaustiveness is checked if `noFallthroughCasesInSwitch` is on.

## `Partial<T>` abuse

`Partial` erases the type safety that made you pick TS. Use only when you genuinely mean "any subset" (e.g., a patch object). If you mean "these fields are optional", list them explicitly:

```ts
// bad
type UserPatch = Partial<User>;

// good
type UserPatch = Pick<User, 'name' | 'email'> & { id: User['id'] };
```

## Never use `Function` / `object` / `{}`

- `Function`: structurally any function. Use `(...args: never) => unknown` or a specific signature.
- `object`: any non-primitive. Use `Record<string, unknown>` if you mean a dictionary.
- `{}`: "not null / undefined", almost never what you meant.

## Prop types

```tsx
// prefer
type ButtonProps = {
  children: ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
};

// not
interface ButtonProps { ... }  // fine, but prefer type for primitive-union cases
```

Both work; pick one and be consistent across the codebase. `type` is slightly more flexible for unions and mapped types.

## `enum`: avoid

`enum` has non-obvious bundle and runtime behavior. Prefer union literal types:

```ts
// bad
enum Role { Admin, User }
// good
type Role = 'admin' | 'user';
```

Exception: tsc `const enum` for private constants is fine if isolatedModules allows.

## Common findings

> **[Must-fix]** `src/features/users/api/get-user.ts:10`: `return res.data as User`. Parse with Zod at the boundary. See `guides/09-typescript-patterns.md §zod-at-boundary`.

> **[Must-fix]** `tsconfig.json:3`: `strict: false`. Enable. Batch fixes by feature folder.

> **[Should-refactor]** `src/types/routes.ts:2`: `as Record<string, string>` widens path literals. Replace with `satisfies`.

## Example in action

See `examples/code-review-example-before-after.md`: several TS findings appear.
