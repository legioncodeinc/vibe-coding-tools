# Keep a Changelog

- URL: https://keepachangelog.com/en/1.1.0/
- Fetched: 2026-08-14
- Source type: community convention (widely adopted changelog standard, v1.1.0)
- Component: changelog discipline tied to a released artifact

## What a changelog is, and who it's for

"A changelog is a file which contains a curated, chronologically ordered list of notable changes for each version of a project," written so users and contributors can see precisely what changed between releases. The core principle: **changelogs are for humans, not machines.**

## The rules

- There should be an entry for every single released version.
- The same types of changes should be grouped (the standard groups: Added, Changed, Deprecated, Removed, Fixed, Security).
- Versions and sections should be linkable.
- The latest version comes first (reverse-chronological).
- The release date of each version is displayed.
- The project should state whether it follows Semantic Versioning.
- Keep an `Unreleased` section at the top to track upcoming changes before they're cut into a version.

## Why commit-log diffs are not a changelog

Using raw commit history as a changelog is explicitly called out as a bad idea: it's full of noise (merge commits, obscure commit titles, doc-only changes). A commit documents a step in the evolution of the source; a changelog entry documents the *noteworthy difference* - often spanning multiple commits - communicated clearly to the people consuming the release, not the people who wrote it.

## GitHub Releases are not a substitute

GitHub Releases can be made to look like a Keep a Changelog-formatted file, but they're non-portable (only viewable in GitHub's UI context) and less discoverable than a top-level `CHANGELOG.md` sitting next to `README` and `CONTRIBUTING`.

## Applicability to this skill

This is the format-and-discipline half of changelog work (the existing guide already has the [BREAKING]-tag and impact-first-format ideas, which are compatible with and build on Keep a Changelog's category structure). The genuinely new, generalizable pieces worth folding in: the "for humans, not machines" framing as the reason to reject commit-log-as-changelog even when commits are well-formed; the `Unreleased` section convention for tracking in-flight changes before a version is cut; and the explicit statement that GitHub Releases don't replace a versioned `CHANGELOG.md`. Pairs with automated tooling (semantic-release, release-please, conventional-changelog) that derives a Keep-a-Changelog-shaped file from Conventional Commits - covered in this skill's distilled research doc as the automation layer on top of this format.
