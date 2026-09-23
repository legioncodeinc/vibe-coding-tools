# Customizing without breaking upgrades

This is the load-bearing guide for anyone who has edited a copied-in component and later needs to pull upstream changes. There is no dedicated `update` command; the current-generation upgrade path is `add --overwrite`, which replaces the file wholesale [research/raw/14-copy-in-philosophy-and-component-anatomy.md], [research/raw/01-cli-command-reference.md].

## The maintainer-endorsed workflow (verbatim guidance from huntabyte)

"We recommend approaching this by committing all your code before updating, updating one component at a time, and reviewing the diffs/reverting any changes that go against your modifications. This is how I handle it on all my projects, which I use shadcn-svelte on, and it works great. Sometimes you have to look a little closely but it is worth it to own the code." [research/raw/14-copy-in-philosophy-and-component-anatomy.md]

Concretely:

1. **Commit before touching anything.** `git add . && git commit -m "chore: checkpoint before shadcn-svelte update"`.
2. **Update one component at a time, not `--all`, once you've made local edits.** `npx shadcn-svelte@latest add button --overwrite`.
3. **Diff the result.** `git diff` (or your editor's diff view) against the commit from step 1.
4. **Re-apply your customizations by hand** into the new upstream version. This is the "own the code" tax; it's the direct cost of the copy-in model's benefit (no black-box breaking changes).
5. Repeat per component, not in bulk, whenever you have local edits worth preserving.

A community-endorsed variant of the same workflow, corroborating the maintainer's guidance: "I usually use `npx shadcn-svelte@latest add button --overwrite`... If I previously edited button component somehow (eg changing background color), check with git diff and redo the changes on the new installed component... it's a price to pay for having the components installed directly in your code instead of having an npm package. Also on original shadcn library there is the same problem." [research/raw/14-copy-in-philosophy-and-component-anatomy.md]

## Bulk upgrade path (when you haven't customized much)

If a project is close to stock (few or no hand-edits to copied-in components), the Tailwind v4 migration guide documents a bulk path:

```bash
git add . && git commit -m "chore: checkpoint before shadcn-svelte update"
npx shadcn-svelte@latest add --all --overwrite
# then update your app.css color values and re-apply any remaining diffs
```

[research/raw/06-tailwind-v4-migration.md]

## Patterns for edits that survive re-syncs better

- **Prefer additive edits over restructuring.** Adding a new entry to a `tv()` variants map (e.g. a new `size: "icon-xl"`) is a small, easy-to-spot diff after an overwrite. Restructuring the whole component's control flow makes the post-overwrite diff much harder to read and re-apply.
- **Keep custom variant logic in the variants file, not scattered across the render branches**, so the diff after an overwrite is localized to one file's `variants` object rather than spread across markup.
- **If a component needs project-specific behavior that's likely to conflict with every future upstream change, consider wrapping instead of editing in place**: a thin project-level component that imports and composes the copied-in primitive, rather than editing the primitive itself. This trades some of the "edit in place" simplicity for a smaller, more stable diff surface against upstream. (This is a judgment call, not a rule from the research archive; the research only documents the commit-diff-reapply workflow as the maintainer's recommendation, not a wrapping strategy.)

## Known CLI edge case: custom `components.json` aliases

A real, now-fixed bug: the `update`/overwrite flow broke when `components.json` used non-default aliases, because the CLI hardcoded the `ui` directory path instead of resolving it from the configured alias. Fixed as of `shadcn-svelte@1.0.0-next.11` [research/raw/14-copy-in-philosophy-and-component-anatomy.md]. Current versions (1.4.2 at research time) are well past this, but it's a documented signal: if a project has heavily customized its `components.json` aliases, test an `add --overwrite` on a single low-risk component after any CLI version bump before running it broadly.

## What NOT to do

- Don't run `add --all --overwrite` on a project with uncommitted changes. You lose the ability to diff.
- Don't assume an `update` command exists; it doesn't, as a first-class verb, in the researched version range [research/raw/14-copy-in-philosophy-and-component-anatomy.md].
- Don't silently accept an overwrite without reviewing the diff. The entire safety of this workflow depends on the diff-review step; skipping it defeats the point of owning the code.
