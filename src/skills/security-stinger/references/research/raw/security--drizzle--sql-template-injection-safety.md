# Magic sql`` operator - Drizzle ORM

- URL: https://orm.drizzle.team/docs/sql
- Fetched: 2026-08-14
- Source type: official ORM documentation
- Component: Drizzle ORM raw/partial SQL construction

## Content

- Drizzle's `sql` tagged template lets you write partial or full raw SQL while keeping type safety and automatic parameterization, usable in SELECT lists, WHERE, ORDER BY, GROUP BY, HAVING, and relational queries.
- Parameterization is automatic and safe by design: `sql`select * from ${usersTable} where ${usersTable.id} = ${id}`` compiles to `select * from "users" where "users"."id" = $1` with `id` moved into a separately-passed values array - "This approach effectively prevents any potential SQL Injection vulnerabilities."
- Tables and columns interpolated into `sql` templates (e.g. `${usersTable}`, `${usersTable.id}`) are automatically mapped to properly escaped identifier syntax - this is the safe path for referencing a table/column that is a compile-time-known Drizzle schema object.
- `sql.raw(str)` is the explicit escape hatch that performs NO parameterization or escaping - "You can also utilize `sql.raw()` within the sql function, enabling you to include any raw string without escaping it through the main sql template function." Any value passed to `sql.raw()` that originates from user input is a SQL injection vector; it must only be used for static, developer-controlled SQL fragments.
- `sql.identifier(value)` exists specifically for dynamic identifiers (table/column names not known at compile time) and DOES escape the identifier for the target dialect (e.g. double-quotes in Postgres) - but Drizzle's own doc carries an explicit warning: "WARNING: This function does not offer any protection against SQL injections, so you must validate any user input beforehand." Escaping an identifier is not the same as validating that the identifier names an allowed table/column; a user-supplied string like `users"; DROP TABLE users; --` would still need application-level allowlisting before being handed to `sql.identifier()`.
- As of Drizzle ORM 1.0.0-beta.20 (release notes referenced in research), `sql.identifier()` and `sql.as()` previously had an escaping bug: "values passed to this function were not properly escaped causing a possible SQL Injection (CWE-89) vulnerability," fixed in that release - confirming dynamic-identifier handling has been a real, exploitable vulnerability class in this exact ORM, not just a theoretical concern.
- Since a breaking change (PR drizzle-team/drizzle-orm#3761), `db.execute()` no longer accepts bare raw strings at all - callers must wrap in `sql`...`` or explicitly `sql.raw(...)`, specifically because "accidentally missing/removing `sql` when using `.execute()` method, could lead to an SQL injection vulnerability" and the two call shapes (`sql`select...${id}`` vs a bare template string) look dangerously similar in a diff.

## Audit takeaway

- Safe: `sql`...${value}...`` (auto-parameterized), the fluent query builder (`db.select().from(t).where(eq(t.col, val))`), `sql.identifier()` fed only from an application-defined allowlist/enum of column names.
- Unsafe / grep targets: `sql.raw(` where the argument contains any variable derived from request input; `sql.identifier(` fed directly from a request parameter, query string, or any other unvalidated user input; any string concatenation building a SQL fragment outside the `sql` template system.
