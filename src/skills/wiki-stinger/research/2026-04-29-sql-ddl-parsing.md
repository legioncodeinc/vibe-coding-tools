---
title: node-sql-parser CREATE TABLE extraction
date: 2026-04-29
sources:
  - https://www.npmjs.com/package/node-sql-parser
  - https://github.com/taozhi8833998/node-sql-parser
  - https://github.com/taozhi8833998/node-sql-parser/blob/master/types.d.ts
---

# node-sql-parser CREATE TABLE extraction

## Summary
`node-sql-parser` is the broadest dialect-aware SQL parser for Node: supporting MySQL, PostgreSQL, SQLite, BigQuery, Snowflake, Athena, TransactSQL, MariaDB, FlinkSQL, and more. It exposes `Parser.astify(sql, opts)` to produce typed AST nodes including `Create` (with `keyword: "table"`) and `Drop`. For wiki-worker-bee's `sql-table` entity sub-type, the agent runs astify on every `.sql` file in the chunk, filters AST nodes for `type: "create" && keyword: "table"`, and extracts table name, column definitions (name, type, constraints), and primary keys. Note: the TypeScript definitions in `types.d.ts` are loose in places (issue #1701): wrap calls in try/catch and cast carefully.

## Key facts
- Install: `npm i node-sql-parser`. Default dialect: MySQL.
- Set dialect per-call: `parser.astify(sql, { database: 'PostgreSQL' })`. Supported dialects include MySQL, PostgreSQL, SQLite, MariaDB, BigQuery, Snowflake, Athena, FlinkSQL, Hive, Redshift, TransactSQL.
- Three primary methods:
  - `parser.astify(sql, opt?): AST | AST[]`: the AST.
  - `parser.parse(sql, opt?): { tableList, columnList, ast }`: convenience: tables visited (`select::dbname::tablename`), columns visited (`select::tablename::columnname`), and the AST.
  - `parser.sqlify(ast, opt?): string`: round-trip from AST to SQL.
- `Create` interface (from `types.d.ts`):
  ```ts
  interface Create {
    type: "create";
    keyword: "table" | "trigger" | "extension" | "function" | "index" | "database" | "schema" | "view" | "domain" | "type" | "user";
    table?: { db: string; table: string }[] | { db: string | null, table: string };
    if_not_exists?: "if not exists" | null;
    create_definitions?: CreateDefinition[] | null;
    table_options?: any[] | null;
  }
  ```
- `create_definitions` is an array containing column defs (`{ resource: 'column', column: { column }, definition: { dataType, ... }, nullable, default_val, primary_key, unique_or_primary }`) AND constraints (foreign keys, indexes).
- `parser.tableList(sql, opt)` returns strings like `["select::mydb::users"]`. For pure DDL, it returns CREATE-mode entries (`["create::null::users"]`).
- Multiple statements: SQL with `;` separators returns `AST[]`. Always check whether result is array first.
- Known TypeScript caveats (issue #1701):
  - `Drop` AST shape doesn't match the type definition perfectly.
  - `Alter.table` field is typed as `From` but `sqlify` expects `From[]`.
  - Some `where` types are over-narrow.
  - Treat the parser output as `unknown` and validate with Zod or runtime checks for production.
- Alternatives:
  - `pg-query-parser` (PostgreSQL-only, Wraps libpg_query): best fidelity for Postgres but Postgres-only.
  - `sqlite-parser`: SQLite-only.
  - For prisma/drizzle/typeorm schemas: prefer parsing the schema source file (Prisma schema or TS source) over their generated migrations.

## Recommended approach for wiki-worker-bee

Detection heuristic for `sql-table`:

1. **File-pattern filter:** look for `.sql` files in the chunk. Optionally also check `migrations/` directories for ORMs.
2. **Detect dialect:** sniff the file path for hints (`postgres/`, `mysql/`, `sqlite/`) or default to PostgreSQL if no hint. Make this configurable per-repo via `.legion/config.json` later.
3. **Run astify with try/catch:**
   ```ts
   const parser = new Parser();
   let ast;
   try {
     ast = parser.astify(sqlContent, { database: detectedDialect });
   } catch (e) {
     // Emit a `gap` with the parse error, file the whole file as a stub.
     return stubEntity(file, 'sql-parse-failed');
   }
   const stmts = Array.isArray(ast) ? ast : [ast];
   ```
4. **Filter for CREATE TABLE:** `stmts.filter(s => s.type === 'create' && s.keyword === 'table')`.
5. **Extract per table:**
   - Name: `s.table[0].table` (handle both array and single-object forms).
   - Schema/db: `s.table[0].db` (may be null).
   - Columns: walk `s.create_definitions`, filter `def.resource === 'column'`, extract `def.column.column` (column name), `def.definition.dataType`, `def.nullable`, `def.default_val`, `def.primary_key`.
   - Foreign keys: `def.resource === 'constraint'` with `def.constraint_type === 'foreign key'`.
6. **For non-CREATE TABLE in same file:** collect `INSERT`, `ALTER` statements as **history events** for the table: render in a `## Migration history` body subsection if relevant.

Entity page filename: `entities/sql-<schema>-<table>.md` (kebab-case, schema prefix if present). `entity_type: sql-table`. Body: Schema / Columns table / Constraints / Indexes / Source. Cite file:line for the CREATE statement.

For ORM-defined schemas (Prisma/Drizzle/TypeORM), file as `data-model` entity sub-type instead: parse the TypeScript source, not generated migrations. The `sql-table` sub-type is for raw DDL.

For ORMs that share the namespace, cross-link `data-model` entity → `sql-table` entity if both exist (Prisma users typically have both schema.prisma and generated migrations).

## Sources
- [node-sql-parser npm](https://www.npmjs.com/package/node-sql-parser): date retrieved 2026-04-29, canonical README, AST examples, multi-dialect support.
- [taozhi8833998/node-sql-parser GitHub](https://github.com/taozhi8833998/node-sql-parser): date retrieved 2026-04-29, repo with full feature list and dialect coverage.
- [types.d.ts](https://github.com/taozhi8833998/node-sql-parser/blob/master/types.d.ts): date retrieved 2026-04-29, TypeScript declarations including `Create` interface.

## Quotes worth preserving
> "Parse simple SQL statements into an abstract syntax tree (AST) with the visited tableList, columnList and convert it back to SQL.", node-sql-parser README
> "Currently at version 5.4.0, the package maintains an active development pace... Key differentiators include its extensive multi-dialect support, the ability to extract visited table and column lists with associated authority.", checklist.day registry

## Open questions / gaps
- Postgres-specific features (ARRAY types, JSONB, GIST indexes, partitioning): partially supported. For production-grade pg fidelity, recommend `pg-query-parser` as fallback. v1: ship with node-sql-parser only.
- For migration files that contain DDL across many tables, do we file one entity per table or one per migration? Recommend per-table entity: the migration file becomes a `decision`-like event in the table's history. Atomic principle.
