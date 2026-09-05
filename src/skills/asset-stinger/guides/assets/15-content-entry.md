# Guide: `ContentEntry` (15)

> **Applies to:** every translatable or platform-admin-editable string/block in the app. Button labels, headings, toasts, onboarding paragraphs, legal copy, alt text, nav labels.

## 1. Purpose

`ContentEntry` is the spine of i18n + platform-admin copy editing + the future WYSIWYG engine builder. Every string referenced by key (`t("auth.login.cta")` or `<LabelByKey contentKey="…">`) has a row.

Today, strings live as hardcoded literals or ad-hoc JSONs. This catalog consolidates them into a queryable, translatable, cacheable layer (Valkey-backed).

## 2. DB table

| Field | Type | Class | Required | Notes |
|---|---|---|---|---|
| `key` | `String @unique` | human | yes | dotted; e.g., `auth.login.cta`, `dashboard.heading.welcome` |
| `kind` | `enum(string/template/rich/markdown/html)` | human | yes | |
| `defaultValue` | `String` | human | yes | the source-of-truth text (English) or structured JSON for `rich` |
| `variables` | `Json?` | human | no | JSON schema for `template` kind, e.g., `{"firstName":"string"}` |
| `maxLength` | `Int?` | human | no | |
| `contextNotes` | `String?` | human | yes for translators | disambiguation, tone, usage |
| `featureKey` | `String?` | human | yes if feature-owned | |
| `surfaceKey` | `String?` | human | no | where this string appears |
| `piiLevel` | `enum(none/low/high)` | human | yes | rarely high, only if the string itself is PII |
| `editableByPlatformAdmin` | `Boolean @default(true)` | human | yes | whether platform-admins can edit via admin UI |

## 3. Code location and detection

- **Scan path:** `app/src/content/**/*.ts`
- **Detection:** exported maps with `@content <key>` annotations.
- **Code reference pattern:** `t("auth.login.cta")` or `<Label contentKey="auth.login.cta">`. The generator cross-references these calls to ensure every key is both declared and used.

## 4. Registration fields

### Human fields
All except generator ones.

### Generator fields
`codePath`, `fileHash`, `usageCount` (how many call sites reference this key).

## 5. Lifecycle

Standard. Deprecated content entries fall back to the `key` string if no translation exists past sunset. Platform admins see a warning when editing a deprecated entry.

## 6. Relationships

**ContentEntry references:** `Feature`, `Surface`.

**Referenced by:** `ContentTranslation` (1:many per locale), `NavEntry.labelContentKey`, `MediaAsset.altContentKey`, `EmailTemplate.subjectContentKey`/`bodyContentKey`, `NotificationTemplate`.

## 7. Hand-offs

- **ux-ui-svelte-worker-bee**: owns `maxLength` guidance for UI constraints.
- **library-worker-bee**: legal documents (`kind: rich` for ToS/Privacy) get cross-linked to versioning PRDs.
- **security-worker-bee**: `piiLevel` classification review.

## 8. Pitfalls

- Shipping a feature without registering its strings: the drift audit flags every `t(...)` call that doesn't resolve.
- Using `kind: html` when `rich` (structured JSON) would suffice; HTML is harder to translate safely.
- Missing `contextNotes` for ambiguous strings (e.g., "Post": verb or noun? Translators need to know).
- `maxLength` inherited from UI reality but not declared: leads to truncation bugs in German/French.
- Embedding dynamic variables (`"Hello " + name`) in code instead of using `kind: template` with `{firstName}`.

## 9. Example

```ts
await prisma.contentEntry.create({
  data: {
    key: "dashboard.heading.welcome",
    kind: "template",
    defaultValue: "Welcome back, {firstName}",
    variables: { firstName: "string" },
    maxLength: 40,
    contextNotes: "Greeting at the top of the dashboard. Tone: warm, personal.",
    featureKey: "dashboard",
    surfaceKey: null,
    piiLevel: "none",
    editableByPlatformAdmin: true,
    status: "draft",
    ownerTeam: "content",
    prdRef: "FEA-099",
    environments: ["dev", "staging", "prod"],
    createdBy: "sync-generator@ci",
  },
});
```

See `examples/content-entry-example.md`.

## 10. Checklist

- [ ] `key` is dotted and namespaced by surface or feature
- [ ] `kind` reflects the actual content shape (string vs template vs rich)
- [ ] `variables` JSON schema is valid if `kind: template`
- [ ] `contextNotes` provides disambiguation for translators
- [ ] `maxLength` set for strings in tight UI slots
- [ ] No PII values hardcoded in `defaultValue`
- [ ] Every `t(...)` call in code resolves to a registered key
