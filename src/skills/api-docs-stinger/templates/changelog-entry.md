# Changelog Entry Template

Copy this into your `CHANGELOG.md`. Fill in all `{{placeholder}}` values.

---

## [{{VERSION}}]: {{YYYY-MM-DD}}

### [BREAKING] {{HTTP_METHOD}} {{PATH}}: {{WHAT_CHANGED}}

**Who is affected:** {{Describe which client patterns will break. Be specific.}}
**Migration:** {{Step-by-step migration instructions. Include code snippets if helpful.}}
**Timeline:** {{Old behavior / endpoint will be removed on YYYY-MM-DD}} ({{N}}-month deprecation window).

---

### Added: {{HTTP_METHOD}} {{PATH}}

{{One sentence: what it does. Non-breaking additions require no migration guidance.}}

---

### Changed: {{HTTP_METHOD}} {{PATH}}: {{WHAT_CHANGED}}

{{Non-breaking change description. If it is actually breaking, move to [BREAKING] above.}}

---

### Deprecated: {{HTTP_METHOD}} {{PATH}} (use {{NEW_ALTERNATIVE}} instead)

`{{OLD_PATH}}` will be removed in v{{MAJOR_VERSION}}.0.0. Migration guide: [link].

---

### Fixed: {{HTTP_METHOD}} {{PATH}}: {{WHAT_WAS_BROKEN}}

{{Bug fix description. No migration needed.}}

---

## Notes on this template

- Use **[BREAKING]** for: removing fields, renaming paths/methods/fields, changing field types, removing enum values, changing auth schemes.
- Use **Deprecated:** for: endpoints/fields that still work but will be removed in a future version. Always include a removal date.
- Use **Added:** for: new endpoints, new optional fields. Always non-breaking.
- Use **Changed:** for: non-breaking behavior changes, documentation improvements.
- Use **Fixed:** for: bug fixes that restore documented behavior.
- Entries should be in reverse chronological order (newest at top).
