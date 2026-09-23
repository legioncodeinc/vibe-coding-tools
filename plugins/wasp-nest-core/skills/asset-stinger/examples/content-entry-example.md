# Example: `ContentEntry` + `ContentTranslation` rows

A templated greeting used on the dashboard. Demonstrates:
- `kind: template` with `variables` schema
- `maxLength` for UI safety
- `contextNotes` for translators
- Three translations in three states

## Code

```ts
// app/src/content/dashboard.ts

/**
 * @content dashboard.heading.welcome
 * @feature dashboard
 */
export const dashboardHeadingWelcome = {
  key: "dashboard.heading.welcome",
  defaultValue: "Welcome back, {firstName}",
  variables: { firstName: "string" },
} as const;
```

## Registry row: ContentEntry

```ts
{
  id: "clxcontwel01",
  key: "dashboard.heading.welcome",
  kind: "template",
  defaultValue: "Welcome back, {firstName}",
  variables: { firstName: "string" },
  maxLength: 40,
  contextNotes: "Greeting at the top of the dashboard. Tone: warm, personal. Keep under 40 chars for mobile truncation avoidance. `firstName` can be empty; render 'Welcome back' if so.",
  featureKey: "dashboard",
  surfaceKey: null,
  piiLevel: "none",
  editableByPlatformAdmin: true,
  status: "active",
  environments: ["dev", "staging", "prod"],
  ownerTeam: "content",
  prdRef: "FEA-099",
  deprecatedAt: null,
  sunsetAt: null,
  notes: null,
  createdBy: "sync-generator@ci",
  createdAt: "2026-02-05T10:00:00.000Z",
  updatedAt: "2026-04-23T02:00:00.000Z",

  codePath: "app/src/content/dashboard.ts",
  fileHash: "7f8e9a0b1c2d7f8e9a0b1c2d7f8e9a0b1c2d7f8e9a0b1c2d7f8e9a0b1c2d7f8e",
  usageCount: 3,
  detectedAt: "2026-02-05T10:00:00.000Z",
  lastSeenAt: "2026-04-23T02:00:00.000Z",
}
```

## Registry rows: ContentTranslation (three locales)

```ts
// en-US — source (approved)
{
  id: "clxtrans01en",
  contentKey: "dashboard.heading.welcome",
  locale: "en-US",
  value: "Welcome back, {firstName}",
  translationStatus: "approved",
  translator: "source",
  reviewer: null,
  reviewedAt: null,
  createdAt: "2026-02-05T10:00:00.000Z",
  updatedAt: "2026-02-05T10:00:00.000Z",
}

// es-MX — human reviewed
{
  id: "clxtrans02es",
  contentKey: "dashboard.heading.welcome",
  locale: "es-MX",
  value: "Bienvenido de nuevo, {firstName}",
  translationStatus: "approved",
  translator: "user_abc123",
  reviewer: "user_def456",
  reviewedAt: "2026-03-01T14:30:00.000Z",
  createdAt: "2026-02-20T09:00:00.000Z",
  updatedAt: "2026-03-01T14:30:00.000Z",
}

// fr-FR — machine only, not yet reviewed
{
  id: "clxtrans03fr",
  contentKey: "dashboard.heading.welcome",
  locale: "fr-FR",
  value: "Bon retour, {firstName}",
  translationStatus: "machine_translated",
  translator: "deepl@machine",
  reviewer: null,
  reviewedAt: null,
  createdAt: "2026-04-15T08:00:00.000Z",
  updatedAt: "2026-04-15T08:00:00.000Z",
}
```

## Release gate observation

If the release targets `fr-FR` as a supported locale, the release cannot ship while `fr-FR` translation is `machine_translated`: the gate requires `approved`.

## Checklist (filled)

- [x] `key` dotted and namespaced
- [x] `kind: template` matches the `{firstName}` placeholder
- [x] `variables` schema valid
- [x] `maxLength: 40` set
- [x] `contextNotes` provides translator disambiguation
- [x] `piiLevel: none`
- [x] Every supported locale has a `ContentTranslation` row
- [x] Variable placeholders preserved across translations
