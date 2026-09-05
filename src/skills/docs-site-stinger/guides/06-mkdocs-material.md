# MkDocs Material: Maintenance Mode Guidance

**Status: MAINTENANCE MODE since November 2025.** No new features. Security and critical bug fixes only until approximately November 2026. The creator (Martin Donath) is building Zensical as the successor (no public release date).

> Source: `research/external/2026-05-20-mkdocs-material-maintenance-mode.md`

---

## Decision rules

**DO NOT start a new project on MkDocs Material in 2026.**

If the team is considering MkDocs Material for a new project, route to `guides/00-platform-selection.md` and select a different platform. For Python projects, consider Starlight (Astro) or Docusaurus: both support Python code examples well.

**Existing MkDocs Material sites:** continue using it. The platform is stable for maintenance. Upgrade to 9.7.0 to get all previously-Insiders features for free.

---

## 2026 positive change: 9.7.0 opens all Insiders features

MkDocs Material 9.7.0 (released alongside the maintenance mode announcement) made all previously-Insiders features available in the community edition at no cost:
- Blog plugin
- Tags plugin with tree structure
- Privacy plugin (external asset download for GDPR compliance)
- Social cards (auto-generated OG images)
- Optimize plugin (image compression)
- Projects plugin (multi-project builds)

Upgrade existing sites to 9.7.0:
```bash
pip install mkdocs-material==9.7.0
```

---

## Existing site setup reference (for maintenance only)

```yaml
# mkdocs.yml
site_name: My Docs
theme:
  name: material
  palette:
    - scheme: default
      primary: indigo
      accent: indigo
      toggle:
        icon: material/brightness-7
        name: Switch to dark mode
    - scheme: slate
      primary: indigo
      accent: indigo
      toggle:
        icon: material/brightness-4
        name: Switch to light mode
  features:
    - navigation.tabs
    - navigation.sections
    - navigation.expand
    - search.suggest
    - search.highlight
    - content.code.copy

plugins:
  - search
  - blog
  - tags

markdown_extensions:
  - admonition
  - pymdownx.details
  - pymdownx.superfences
  - pymdownx.tabbed:
      alternate_style: true
```

## Versioning with mike

```bash
pip install mike
mike deploy 1.0 latest --update-aliases
mike set-default latest
```

---

## Migration path

When ready to migrate away from MkDocs Material:

1. **Inventory current content:** list all `.md` pages, nav structure, custom CSS/macros, and plugins used.
2. **Choose target platform:** Starlight (Astro) for similar Markdown-first experience; Docusaurus for React/MDX power users.
3. **Convert frontmatter:** MkDocs uses YAML frontmatter; Starlight and Docusaurus also use YAML frontmatter: most pages transfer directly.
4. **Port navigation:** map `mkdocs.yml` `nav:` to the target platform's sidebar config.
5. **Port custom CSS:** extract color and spacing overrides to the new platform's token system.
6. **Port macros/plugins:** MkDocs Jinja macros have no direct equivalent in JS platforms: convert to MDX components.

Use `templates/migration-checklist.md` for the step-by-step migration.

---

## Zensical (successor)

Monitor https://github.com/squidfunk: no public release date as of May 2026. Do not commit to Zensical migration until it reaches a stable release.
