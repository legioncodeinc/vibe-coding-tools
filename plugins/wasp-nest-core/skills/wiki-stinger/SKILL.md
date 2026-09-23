---
name: "wiki-stinger"
license: AGPL-3.0-or-later
description: "Extract code entities into the wiki. Use for atomic pages, backlinks, inferred ADRs, contradiction checks, or wiki linting. Read README.md for the guide map."
---

# wiki-stinger

Cursor-skill wrapper for the `wiki-wasp-drone` Drone's companion resource bundle. The full navigation, directory map, mode table, six-phase procedure, non-negotiables list, and reading order are in `README.md` - start there.

> **Agent entry point:** [`../../agents/wiki-wasp-drone.md`](../../agents/wiki-wasp-drone.md)

This file exists so Cursor's skill router can discover the stinger by description. The Drone reads `README.md` for navigation and the matching `guides/*.md` for procedural detail per invocation.
