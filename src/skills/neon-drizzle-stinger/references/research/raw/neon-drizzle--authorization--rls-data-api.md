# Row-Level Security with Neon / Data API access control / RLS with Drizzle - Neon Docs

- URL: https://neon.com/docs/data-api/access-control (primary); supplementary from https://neon.com/docs/guides/row-level-security and https://neon.com/docs/guides/rls-drizzle
- Fetched: 2026-08-14
- Source type: Official docs (Neon)
- Component: Row Level Security, what you lose leaving Supabase and how to enforce authorization

## Summary (as stated on the page)

The Neon Data API has no separate permission system. All access control is delegated to PostgreSQL through two layers: GRANT-based table privileges and Row-Level Security (RLS) policies. The database role is selected from the incoming JWT: `authenticated` for valid tokens, `anonymous` for unauthenticated requests, or a custom role from the JWT `role` claim. Configure GRANT statements, enable RLS, and write per-row policies with `auth.user_id()`, which extracts the `sub` claim from the request JWT.

## Two-layer model (only applies if you use the Neon Data API)

1. **Role privileges (GRANT)**: determines which tables the API can access at all.
2. **Row-Level Security (RLS)**: determines which specific rows a user is allowed to see, once table access is granted.

When the Data API receives a request, it switches to a Postgres role chosen by the incoming JWT: `authenticated` for a valid bearer token (primary role for app users, **no permissions by default** until explicitly granted), `anonymous` for unauthenticated requests (can be granted `SELECT` for public data), or a custom role read from a `role` JWT claim (must exist in the database with correct permissions).

### RLS state matrix

| State | Behavior |
|---|---|
| RLS disabled | All authenticated users see all rows (no filtering) |
| RLS enabled, no policies | All access is blocked (users see nothing) |
| RLS enabled + policies | Rows filtered by policy rules (typically via `auth.user_id()`) |

**Gotcha explicitly called out**: if RLS is *disabled* on a table, any authenticated (granted) user sees **all** rows, this is different from "secure by default"; it means no filtering at all is applied.

### `auth.user_id()` and the `user_id` column pattern

`auth.user_id()` is a SQL function extracting the User ID (`sub` claim) from the current request's JWT. Use it to (1) set a default value so new rows auto-associate with the current user, and (2) filter rows in RLS policies.

```sql
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
-- once enabled, all access is blocked until a policy exists

CREATE POLICY "User owns data" ON posts
  FOR ALL
  TO authenticated
  USING ( select auth.user_id() = user_id )
  WITH CHECK ( select auth.user_id() = user_id );
```

## RLS is a general Postgres feature, independent of the Data API

Row-Level Security itself is standard Postgres, restricting row access based on the current DB session/role, and works regardless of whether the app uses Neon's Data API. Example:

```sql
CREATE POLICY "users_can_only_access_own_notes" ON notes
  FOR ALL USING (auth.user_id() = user_id);
```

RLS with the Data API additionally requires: the Data API handles JWT validation and exposes `auth.user_id()`; app RLS policies use that function; and **all tables accessed via the Data API must have RLS enabled** as a hard requirement (not optional) when using that API surface.

## RLS with Drizzle ORM (`crudPolicy` helper)

Drizzle provides a `crudPolicy` helper (from `drizzle-orm/neon`) to declaratively generate RLS policies alongside the schema, avoiding repetitive per-table raw SQL:

```typescript
export const users = pgTable("users", {
  userId: text("user_id").primaryKey(),
  email: text("email").unique().notNull(),
}).enableRLS();

export const posts = pgTable(
  "posts",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    userId: text("userId").references(() => users.userId),
  },
  (table) => [
    crudPolicy({ role: anonymousRole, read: true }),
    crudPolicy({ role: authenticatedRole, read: true, modify: authUid(table.userId) }),
  ],
);
```

`crudPolicy` parameters: `role` (Postgres role(s), Neon provides `authenticatedRole`/`anonymousRole` out of the box, custom roles also work), `read` (`true`/`false`/SQL expression/`null`, governs `SELECT`), `modify` (`true`/`false`/SQL expression/`null`, governs `INSERT`/`UPDATE`/`DELETE`). `authUid(column)` generates `(select auth.user_id() = column)`.

For more granular per-operation control (e.g. different rules for admins vs regular users), use the lower-level `pgPolicy` function directly, `crudPolicy` is sugar over `pgPolicy`.

Once RLS policies are defined in the Drizzle schema and migrated, execute RLS-respecting queries either via the **Data API client** (frontend) or the **Neon serverless driver** using the Drizzle query builder (backend), RLS is enforced by Postgres itself regardless of which client issues the query, as long as it authenticates as the `authenticated`/`anonymous` role with a valid JWT.

## Explicit takeaway for a Supabase-migrating team (from `introducing-neon-authorize` blog, cross-referenced)

RLS turns authorization into a **declarative, database-enforced** layer instead of relying purely on application code, analogous to how foreign keys enforce referential integrity. Any JWT-issuing auth provider (Neon's Managed Better Auth, Auth0, Clerk, WorkOS, etc.) can be wired up: Neon downloads the provider's JWKS to validate JWTs, and `auth.user_id()`/`auth.session()` (from the open-source `pg_session_jwt` Postgres extension) expose the JWT claims to SQL policies. Neon RLS/the Data API is provider-agnostic; it is not tied to any specific auth vendor.
