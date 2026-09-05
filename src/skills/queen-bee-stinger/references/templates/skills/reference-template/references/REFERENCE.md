# {Reference title}

This file is deep reference material for the `{stinger-name}` stinger. It only loads into context when the model decides it needs it, per the load-when guidance in the parent `SKILL.md`'s references map. Nothing here is read at startup.

Use this folder for the material that would bloat the root `SKILL.md` if it lived there instead: full field tables, long worked examples, edge cases, background rationale, anything the model needs occasionally but not on every invocation. If a piece of guidance is needed on every single run of the stinger, it belongs in `SKILL.md` itself, not here.

You can add more files to this folder as the stinger grows. Name each one for what it covers (`FIELD-REFERENCE.md`, `TROUBLESHOOTING.md`, `EXAMPLES.md`) and add a load-when line for each in the parent `SKILL.md`'s references map, the same way this file is referenced.

## {Section one heading}

{Placeholder body. Replace with the actual reference content: a table, a worked example, a decision tree, whatever this stinger needs on demand but not by default.}

## {Section two heading}

{Placeholder body.}

## Sources

{If this reference material is grounded in external documentation, cite it here the same way the Hive research files do: a bracketed pointer to the source, so a future author can verify or update the claim.}
