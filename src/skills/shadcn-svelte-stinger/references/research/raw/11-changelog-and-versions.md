# Changelog - shadcn-svelte

- URL: https://shadcn-svelte.com/docs/changelog
- Fetched: 2026-08-14
- Source type: release notes
- Component: versions

Latest updates and announcements.

## May 2026 - Introducing Rhea

Introducing Rhea, a new shadcn-svelte style. A more compact Luma. Smaller spacing. Denser surfaces. Built for focused product interfaces. Available now in `shadcn-svelte/create`.

Rhea started from a common request: Luma, but more compact. Rhea keeps the same rounded foundation but makes it more compact for product interfaces where space matters; buttons, inputs, menus, cards, and lists all sit a little tighter.

### Why a new style instead of a spacing tweak?

`--spacing` is a multiplier; changing it globally would change what familiar utilities like `p-2`, `w-4`, `m-16` mean across the app. That tradeoff was rejected in favor of a wholly new style (Rhea), which lets component sizes, gaps, and density be adjusted directly while keeping the underlying utility scale predictable.

## April 2026 - Introducing Sera

Introducing Sera, a new shadcn-svelte style. Minimal. Editorial. Typographic. Underline controls and uppercase headings, shaped by print design principles. Sera pairs serif headings with sans-serif body text, uses square corners, uppercase tracking, and underlined controls. Available now in `shadcn-svelte/create`.

Like the other new styles, Sera changes the geometry, spacing, and feel of the components (not just theming), so an app starts from a different visual baseline.

## More updates (listed, not expanded in the fetched page)

March 2026 - Introducing Luma. October 2025 - New Components. June 2025 - Calendar Components. May 2025 - Tailwind v4 Support. March 2024 - Introducing Blocks. February 2024 - New Component (Resizable). January 2024 - New Components. December 2023 - Calendar Components. November 2023 - Toggle Group. October 2023 - Command and Combobox.

Gap: the changelog page as fetched only expands the two most recent entries (Rhea, Sera) inline; older entries are listed by title only, without expanded body text, in this archive.

---

# npm registry version history

- URL: https://registry.npmjs.org/shadcn-svelte
- Fetched: 2026-08-14
- Source type: official docs
- Component: versions

Latest at fetch time: 1.4.2, published Jul 14, 2026.

| Versions | Published | Releases | Deps |
| --- | --- | --- | --- |
| 1.4.0 - 1.4.2 | Jul 2026 | 3 | 5 |
| 1.3.0 | May 27, 2026 | 1 | 5 |
| 1.2.0 - 1.2.7 | Mar 2026 - Apr 2026 | 8 | 5 |
| 1.1.0 - 1.1.1 | Dec 2025 - Jan 2026 | 2 | 3 |
| 1.0.0 - 1.0.12 | Jun 2025 - Nov 2025 | 13 | 3 |
| 0.14.0 - 0.14.3 | Oct 2024 - Jun 2025 | 4 | 6 |
| 1.0.0-next.0 - 1.0.0-next.19 | Oct 2024 - May 2025 | 20 | 7 |
| 0.13.0 | Aug 17, 2024 | 1 | 6 |
| 0.12.0 - 0.12.2 | Jul 2024 - Aug 2024 | 3 | 7 |
| 0.11.0 - 0.11.1 | Jul 2024 | 2 | 7 |

107 versions total, first published May 26, 2023.

This confirms: the `1.0.0-next.*` prerelease line (Oct 2024 - May 2025) was the Svelte 5 / Tailwind v4 rewrite track; `1.0.0` stable shipped Jun 2025, coinciding with the "Tailwind v4 Support" changelog entry (May 2025) and the general Svelte-5-native cutover described in raw/07-dark-mode.md.

---

# GitHub releases

- URL: https://github.com/huntabyte/shadcn-svelte/releases
- Fetched: 2026-08-14
- Source type: release notes
- Component: versions

Selected recent release notes:

- `shadcn-svelte@1.4.x` (unreleased-notes fragment observed): feat: add `--no-deps-install` flag to `add`, `init`, `update`, and `apply` to write dependencies to `package.json` without running install (#2828); feat: preserve a dependency's existing location in `package.json` if present (#2828); fix: resolve wildcard path alias roots for `components.json` directory aliases (#2822); fix: match deep imports with a path boundary and ignore `sv`/`shadcn-svelte` tooling deps (#2826); chore: deprecate the `--no-deps` flag in favor of `--no-deps-install` (#2828).
- Another entry: chore: release `@shadcn-svelte/sv` as an `sv` community add-on (#2826); breaking: convert `@shadcn-svelte/registry` to an `sv` community add-on for bootstrapping registry projects (#2826).
- Another entry: fix: detect the nearest `jsconfig.json`/`tsconfig.json` so a nested project no longer picks up an unrelated parent config (fixes false `$lib` path alias errors in monorepos).
- `shadcn-svelte@1.2.7` (2026-04-02): fix: fix `tailwind.css` styles (#2620).
- `shadcn-svelte@1.2.4` (2026-03-25): fix: ensure Tailwind utilities are installed on `add`/`update` (#2598); fix: only prompt the user to update the stylesheet if the stylesheet actually changes (#2598).
- feat: `apply` command added (#2751); feat: `--[no]-reinstall` flags for the `init` command (#2751).
- fix: use `@import "shadcn-svelte/tailwind.css";` instead of adding each utility individually (#2614); feat: support new preset options (#2614).

Repo metadata at fetch time: 8635 stars, 527 forks, 81 open issues, primary language TypeScript (89.4%), Svelte (5.2%), CSS (3.8%), JavaScript (1.4%), HTML (0.2%). License MIT. 180 contributors (top: huntabyte, AdrianGonz97, ieedan, github-actions[bot], shyakadavis, HubbeDev, Stadly, WarningImHack3r, ollema, anatolzak). 103 releases. Latest release at fetch time: `shadcn-svelte@1.2.7` (2026-04-02T13:07:46Z) per the repo summary card (note: this lags the 1.4.2 npm version above by publish-index lag in the fetched GitHub summary card; npm's registry listing is the more current source for "latest version").

---

# huntabyte/shadcn-svelte repository

- URL: https://github.com/huntabyte/shadcn-svelte/
- Fetched: 2026-08-14
- Source type: official docs (repo README)
- Component: versions

shadcn/ui, but for Svelte. shadcn-svelte is an unofficial community-led Svelte port of shadcn/ui. "We are not affiliated with shadcn, but we did get his blessing prior to creating this project. This is a project born out of the need for a similar project for the Svelte ecosystem." Accessible and customizable components that you can copy and paste into your apps. Free. Open Source. "Use this to build your own component library." Default branch: main. Homepage: https://shadcn-svelte.com.
