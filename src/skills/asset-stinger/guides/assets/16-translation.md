# Guide: `ContentTranslation` (16)

> **Applies to:** localized values of a `ContentEntry`. One `ContentEntry` can have many `ContentTranslation` rows, one per supported locale.

## 1. Purpose

Separates i18n values from keys. The translation engine reads/writes this table; the sync generator never does. This is the one catalog where humans (translators, platform admins) are the authoritative writers.

## 2. DB table

| Field | Type | Class | Required | Notes |
|---|---|---|---|---|
| `contentKey` | `String` | human | yes | FK into `ContentEntry.key` |
| `locale` | `String` | human | yes | BCP-47 tag, e.g., `en-US`, `es-MX`, `fr-FR` |
| `value` | `String` | human | yes | translated string or structured JSON (matches parent `kind`) |
| `translationStatus` | `enum(draft/machine_translated/human_reviewed/approved)` | human | yes | |
| `translator` | `String?` | human | no | user ID or `deepl@machine` |
| `reviewer` | `String?` | human | no | |
| `reviewedAt` | `DateTime?` | human | no | |

Compound unique: `@@unique([contentKey, locale])`.

## 3. Code location and detection

- **Scan path:** `app/src/content/locales/<locale>/*.ts` (if using locale files) OR DB-only (if using the admin UI)
- **Detection:** the generator mirrors locale files to the table for backfill. After backfill, DB is authoritative.

## 4. Registration fields

All human.

## 5. Lifecycle

Lightweight: `draft` → `machine_translated` → `human_reviewed` → `approved`. No standard "deprecated" state; translations live and die with their parent `ContentEntry`.

When a `ContentEntry` is deprecated, its `ContentTranslation` rows remain but are hidden from the runtime.

## 6. Relationships

**ContentTranslation references:** `ContentEntry` (via `contentKey`), `Locale`.

## 7. Hand-offs

- **Translation engine** (future): reads from this table, caches in Valkey.
- **library-worker-bee**: translation process documented in kb, not here.

## 8. Pitfalls

- Shipping a feature that uses a `ContentEntry` whose translations are all `draft`. The release gate should block this.
- Translating the `{firstName}` variable placeholder (should stay intact).
- Writing to a translation for a deprecated key: runtime ignores it; waste of reviewer time.

## 9. Example

```ts
await prisma.contentTranslation.create({
  data: {
    contentKey: "dashboard.heading.welcome",
    locale: "es-MX",
    value: "Hola de nuevo, {firstName}",
    translationStatus: "approved",
    translator: "user_abc123",
    reviewer: "user_def456",
    reviewedAt: new Date(),
  },
});
```

## 10. Checklist

- [ ] `contentKey` resolves to a real `ContentEntry`
- [ ] `locale` is a valid BCP-47 tag
- [ ] `value` matches parent `kind` (JSON for rich, plain text for string)
- [ ] Variables (e.g., `{firstName}`) preserved
- [ ] `translationStatus` honest (not claiming approval without review)
